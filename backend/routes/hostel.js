const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// GET /api/hostels - list all hostels
router.get('/', protect, async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json({ success: true, data: hostels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/hostels/type/:type - get hostels by type (attached/non-attached)
router.get('/type/:type', protect, async (req, res) => {
  try {
    const hostels = await Hostel.find({ type: req.params.type });
    res.json({ success: true, data: hostels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/hostels/:id - single hostel
router.get('/:id', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ success: false, message: 'Hostel not found' });
    res.json({ success: true, data: hostel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/hostels/:id/floors/:floor/rooms - rooms on a specific floor
router.get('/:id/floors/:floor/rooms', protect, async (req, res) => {
  try {
    const rooms = await Room.find({ hostel: req.params.id, floor: Number(req.params.floor) })
      .populate('beds.student', 'rollNo firstName lastName');
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
