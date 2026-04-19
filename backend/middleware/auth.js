const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Manager = require('../models/Manager');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'student') {
      req.user = await Student.findById(decoded.id).select('-password');
      req.role = 'student';
    } else if (decoded.role === 'manager' || decoded.role === 'admin') {
      req.user = await Manager.findById(decoded.id).select('-password');
      req.role = decoded.role;
    }
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = { protect, requireRole };
