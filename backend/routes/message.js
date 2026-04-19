const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Manager = require('../models/Manager');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/messages - student sends a complaint
router.post('/', protect, requireRole('student'), async (req, res) => {
  try {
    const { subject, message } = req.body;
    const student = req.user;
    if (!student.hostel) return res.status(400).json({ success: false, message: 'You must be allocated a hostel first' });

    let manager = await Manager.findOne({ hostel: student.hostel, isAdmin: false });
    if (!manager) manager = await Manager.findOne({ isAdmin: true });
    if (!manager) return res.status(404).json({ success: false, message: 'No manager found in the system' });

    const msg = await Message.create({
      sender: student._id,
      senderModel: 'Student',
      receiver: manager._id,
      receiverModel: 'Manager',
      hostel: student.hostel,
      subject,
      message,
    });
    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/messages/my - student's own messages
router.get('/my', protect, requireRole('student'), async (req, res) => {
  try {
    const msgs = await Message.find({ sender: req.user._id, senderModel: 'Student' })
      .sort('-createdAt');
    res.json({ success: true, data: msgs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/messages - manager sees complaints for their hostel
router.get('/', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const query = req.role === 'admin' ? {} : { hostel: req.user.hostel };
    const msgs = await Message.find(query)
      .populate('sender', 'rollNo firstName lastName')
      .sort('-createdAt');
    res.json({ success: true, data: msgs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/messages/:id/resolve - manager resolves a complaint
router.put('/:id/resolve', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolvedAt: new Date(), resolvedBy: req.user.username },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
