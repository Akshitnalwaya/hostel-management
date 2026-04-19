const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['attached', 'non-attached'], required: true },
  totalRooms: { type: Number, default: 400 },
  currentRooms: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  feePerYear: { type: Number, default: 65000 },
  floors: { type: Number, default: 4 },
  roomsPerFloor: { type: Number, default: 100 },
  bedsPerRoom: { type: Number, default: 3 },
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);
