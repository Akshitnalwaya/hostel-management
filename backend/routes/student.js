const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/students/profile - own profile
router.get('/profile', protect, requireRole('student'), async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('-password')
      .populate('hostel', 'name type feePerYear')
      .populate('room', 'floor roomNumber type');
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/students - admin/manager lists all students
router.get('/', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const query = req.role === 'manager' ? { hostel: req.user.hostel } : {};
    const students = await Student.find(query)
      .select('-password')
      .populate('hostel', 'name type')
      .populate('room', 'floor roomNumber');
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/students/:id - admin/manager views specific student
router.get('/:id', protect, requireRole('manager', 'admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password')
      .populate('hostel', 'name type')
      .populate('room', 'floor roomNumber type');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
