const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const sendEmail = require('../utils/email');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/rooms/:id - single room details
router.get('/:id', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hostel', 'name type')
      .populate('beds.student', 'rollNo firstName lastName');
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rooms/:id/book - book a bed (student only)
router.post('/:id/book', protect, requireRole('student'), async (req, res) => {
  try {
    const { bedLabel, parentEmail } = req.body;
    const room = await Room.findById(req.params.id).populate('hostel');

    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (!room.isUnlocked) return res.status(400).json({ success: false, message: 'Room is not open for booking' });

    const student = await Student.findById(req.user._id);
    if (student.room) return res.status(400).json({ success: false, message: 'You already have a booked bed' });

    const bed = room.beds.find((b) => b.bedLabel === bedLabel);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });
    if (bed.isBooked) return res.status(400).json({ success: false, message: 'Bed already booked' });

    bed.isBooked = true;
    bed.student = student._id;

    const allBooked = room.beds.every((b) => b.isBooked);
    if (allBooked) {
      room.isFull = true;
      // Unlock next room on same floor
      const nextRoom = await Room.findOne({
        hostel: room.hostel._id,
        floor: room.floor,
        roomNumber: room.roomNumber + 1,
        isUnlocked: false,
      });
      if (nextRoom) {
        nextRoom.isUnlocked = true;
        await nextRoom.save();
      }
    }
    await room.save();

    student.room = room._id;
    student.hostel = room.hostel._id;
    student.bed = bedLabel;
    await student.save();

    // Update hostel student count
    await Hostel.findByIdAndUpdate(room.hostel._id, { $inc: { totalStudents: 1 } });

    // Optional email notification
    if (parentEmail) {
      await sendEmail({
        to: parentEmail,
        subject: 'Bed Booking Confirmation - Hostel Management',
        html: `<p>Dear Parent,</p><p>Your ward <b>${student.firstName} ${student.lastName}</b> (${student.rollNo}) has successfully booked <b>Bed ${bedLabel}</b> in <b>Room ${room.roomNumber}, Floor ${room.floor}</b> of <b>${room.hostel.name}</b> Hostel.</p>`,
      }).catch(() => {});
    }

    res.json({ success: true, message: 'Bed booked successfully', data: { room, bed: bedLabel } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rooms/:id/vacate - vacate a bed (student or manager)
router.post('/:id/vacate', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    let studentId;
    if (req.role === 'student') {
      studentId = req.user._id;
    } else {
      studentId = req.body.studentId;
    }

    const bed = room.beds.find((b) => b.student && b.student.toString() === studentId.toString());
    if (!bed) return res.status(404).json({ success: false, message: 'No booking found for this student in room' });

    bed.isBooked = false;
    bed.student = null;
    room.isFull = false;
    await room.save();

    await Student.findByIdAndUpdate(studentId, { room: null, hostel: null, bed: null });
    await Hostel.findByIdAndUpdate(room.hostel, { $inc: { totalStudents: -1 } });

    res.json({ success: true, message: 'Bed vacated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
