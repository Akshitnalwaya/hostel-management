const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');
const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/admin/managers - list all managers
router.get('/managers', protect, requireRole('admin'), async (req, res) => {
  try {
    const managers = await Manager.find({ isAdmin: false }).select('-password').populate('hostel', 'name type');
    res.json({ success: true, data: managers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/managers - create a hostel manager
router.post('/managers', protect, requireRole('admin'), async (req, res) => {
  try {
    const { username, firstName, lastName, mobileNo, email, hostelName, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    const hostel = await Hostel.findOne({ name: hostelName });
    if (!hostel) return res.status(404).json({ success: false, message: 'Hostel not found' });

    const exists = await Manager.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ success: false, message: 'Username or email already taken' });

    const manager = await Manager.create({ username, firstName, lastName, mobileNo, email, hostel: hostel._id, password });
    res.status(201).json({ success: true, data: manager });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/managers/:id - remove a manager
router.delete('/managers/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found' });
    res.json({ success: true, message: 'Manager removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/students - all students
router.get('/students', protect, requireRole('admin'), async (req, res) => {
  try {
    const students = await Student.find().select('-password').populate('hostel', 'name').populate('room', 'floor roomNumber');
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/hostels - all hostels with stats
router.get('/hostels', protect, requireRole('admin'), async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json({ success: true, data: hostels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/hostels - create a hostel (seed)
router.post('/hostels', protect, requireRole('admin'), async (req, res) => {
  try {
    const { name, type, totalRooms, feePerYear, floors, roomsPerFloor, bedsPerRoom } = req.body;
    const hostel = await Hostel.create({ name, type, totalRooms, feePerYear, floors, roomsPerFloor, bedsPerRoom });

    // Create rooms automatically
    const beds = ['A', 'B', 'C'].slice(0, bedsPerRoom || 3);
    const roomDocs = [];
    for (let floor = 1; floor <= (floors || 4); floor++) {
      for (let roomNum = 1; roomNum <= (roomsPerFloor || 100); roomNum++) {
        roomDocs.push({
          hostel: hostel._id,
          floor,
          roomNumber: roomNum,
          type,
          totalBeds: beds.length,
          beds: beds.map((label) => ({ bedLabel: label, isBooked: false, student: null })),
          isUnlocked: floor === 1 && roomNum === 1,
        });
      }
    }
    await Room.insertMany(roomDocs);

    res.status(201).json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/dashboard - stats
router.get('/dashboard', protect, requireRole('admin'), async (req, res) => {
  try {
    const [totalStudents, totalManagers, totalHostels, totalRooms] = await Promise.all([
      Student.countDocuments(),
      Manager.countDocuments({ isAdmin: false }),
      Hostel.countDocuments(),
      Room.countDocuments(),
    ]);
    const allocatedRooms = await Room.countDocuments({ 'beds.isBooked': true });
    res.json({ success: true, data: { totalStudents, totalManagers, totalHostels, totalRooms, allocatedRooms } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
