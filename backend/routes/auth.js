const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Manager = require('../models/Manager');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/student/register
router.post('/student/register', async (req, res) => {
  try {
    const { rollNo, firstName, lastName, mobileNo, department, yearOfStudy, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain letters and numbers' });
    }
    const exists = await Student.findOne({ rollNo: rollNo.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Roll number already registered' });

    const student = await Student.create({
      rollNo: rollNo.toLowerCase(),
      firstName,
      lastName,
      mobileNo,
      department,
      yearOfStudy,
      password,
    });
    const token = signToken(student._id, 'student');
    res.status(201).json({ success: true, token, role: 'student', user: { id: student._id, rollNo: student.rollNo, firstName: student.firstName, lastName: student.lastName } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
  try {
    const { rollNo, password } = req.body;
    const student = await Student.findOne({ rollNo: rollNo.toLowerCase() }).populate('hostel room');
    if (!student || !(await student.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(student._id, 'student');
    res.json({
      success: true,
      token,
      role: 'student',
      user: {
        id: student._id,
        rollNo: student.rollNo,
        firstName: student.firstName,
        lastName: student.lastName,
        mobileNo: student.mobileNo,
        department: student.department,
        yearOfStudy: student.yearOfStudy,
        hostel: student.hostel,
        room: student.room,
        bed: student.bed,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/manager/login
router.post('/manager/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const manager = await Manager.findOne({ username }).populate('hostel');
    if (!manager || !(await manager.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const role = manager.isAdmin ? 'admin' : 'manager';
    const token = signToken(manager._id, role);
    res.json({
      success: true,
      token,
      role,
      user: {
        id: manager._id,
        username: manager.username,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        mobileNo: manager.mobileNo,
        hostel: manager.hostel,
        isAdmin: manager.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
