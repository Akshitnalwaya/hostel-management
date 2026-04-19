const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const Manager = require('../models/Manager');
const Student = require('../models/Student');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/leave - student submits leave request
router.post('/', protect, requireRole('student'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const student = await Student.findById(req.user._id);
    if (!student.hostel) return res.status(400).json({ success: false, message: 'You must be allocated a hostel first' });

    // Find manager for the hostel, fall back to any admin if no dedicated manager
    let manager = await Manager.findOne({ hostel: student.hostel, isAdmin: false });
    if (!manager) manager = await Manager.findOne({ isAdmin: true });
    if (!manager) return res.status(404).json({ success: false, message: 'No manager found in the system' });

    const leave = await LeaveRequest.create({
      student: student._id,
      manager: manager._id,
      hostel: student.hostel,
      title,
      body,
    });
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leave/my - student's own leave requests
router.get('/my', protect, requireRole('student'), async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ student: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leave - manager sees leave requests for their hostel
router.get('/', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const query = req.role === 'admin' ? {} : { manager: req.user._id };
    const leaves = await LeaveRequest.find(query)
      .populate('student', 'rollNo firstName lastName department yearOfStudy')
      .sort('-createdAt');
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/leave/:id - manager approves/rejects
router.put('/:id', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, remarks, decidedAt: new Date(), decidedBy: req.user._id },
      { new: true }
    ).populate('student', 'rollNo firstName lastName');
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
