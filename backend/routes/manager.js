const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const Room = require('../models/Room');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/managers/profile - own profile
router.get('/profile', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const manager = await Manager.findById(req.user._id).select('-password').populate('hostel', 'name type');
    res.json({ success: true, data: manager });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/managers/rooms/allocated - rooms with students in manager's hostel
router.get('/rooms/allocated', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const hostelId = req.role === 'admin' ? req.query.hostelId : req.user.hostel;
    const rooms = await Room.find({ hostel: hostelId, 'beds.isBooked': true })
      .populate('beds.student', 'rollNo firstName lastName department yearOfStudy');
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/managers/rooms/empty - empty rooms in manager's hostel
router.get('/rooms/empty', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const hostelId = req.role === 'admin' ? req.query.hostelId : req.user.hostel;
    const rooms = await Room.find({ hostel: hostelId, isFull: false });
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/managers/rooms/unlock - unlock a room for booking
router.post('/rooms/unlock', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findByIdAndUpdate(roomId, { isUnlocked: true }, { new: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/managers/allocate - manually allocate a student to a room/bed
router.post('/allocate', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const { studentId, roomId, bedLabel } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const bed = room.beds.find((b) => b.bedLabel === bedLabel);
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });
    if (bed.isBooked) return res.status(400).json({ success: false, message: 'Bed already booked' });

    bed.isBooked = true;
    bed.student = student._id;
    if (room.beds.every((b) => b.isBooked)) room.isFull = true;
    await room.save();

    student.room = room._id;
    student.hostel = room.hostel;
    student.bed = bedLabel;
    await student.save();

    await Hostel.findByIdAndUpdate(room.hostel, { $inc: { totalStudents: 1 } });

    res.json({ success: true, message: 'Room allocated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
