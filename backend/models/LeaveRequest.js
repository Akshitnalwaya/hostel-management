const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  decidedAt: { type: Date, default: null },
  decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', default: null },
  remarks: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
