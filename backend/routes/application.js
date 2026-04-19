const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/applications - student submits application
router.post('/', protect, requireRole('student'), async (req, res) => {
  try {
    const { hostelId, message } = req.body;
    const existing = await Application.findOne({ student: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ success: false, message: 'You already have a pending application' });

    const application = await Application.create({
      student: req.user._id,
      hostel: hostelId,
      message,
    });
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/applications/my - student's own applications
router.get('/my', protect, requireRole('student'), async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user._id }).populate('hostel', 'name type');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/applications - manager sees applications for their hostel
router.get('/', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const query = req.role === 'admin' ? {} : { hostel: req.user.hostel };
    const apps = await Application.find(query)
      .populate('student', 'rollNo firstName lastName department yearOfStudy')
      .populate('hostel', 'name type');
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/applications/:id - manager approves/rejects
router.put('/:id', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const { status, roomNo } = req.body;
    const app = await Application.findByIdAndUpdate(req.params.id, { status, roomNo }, { new: true });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
