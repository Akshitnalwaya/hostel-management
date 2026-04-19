const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedLabel: { type: String, required: true },   // A, B, C
  isBooked: { type: Boolean, default: false },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
});

const roomSchema = new mongoose.Schema({
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  floor: { type: Number, required: true },
  roomNumber: { type: Number, required: true },
  type: { type: String, enum: ['attached', 'non-attached'], required: true },
  totalBeds: { type: Number, default: 3 },
  beds: [bedSchema],
  isUnlocked: { type: Boolean, default: false },  // unlocked for booking
  isFull: { type: Boolean, default: false },
}, { timestamps: true });

// Compound unique index
roomSchema.index({ hostel: 1, floor: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
