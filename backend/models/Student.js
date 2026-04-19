const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Roll number format: 02fe(22-26)(bcs|bci|bme|bca|bee|bch|bcv)[0-9]{3}
const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
    unique: true,
    match: [/^02fe(2[2-6])(bcs|bci|bme|bca|bee|bch|bcv)\d{3}$/i, 'Invalid roll number format'],
  },
  firstName: { type: String, required: true, match: [/^[A-Z][a-zA-Z]+$/, 'Name must start with capital letter'] },
  lastName: { type: String, required: true, match: [/^[A-Z][a-zA-Z]+$/, 'Name must start with capital letter'] },
  mobileNo: { type: String, required: true, match: [/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'] },
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE', 'AE', 'BT'],
  },
  yearOfStudy: { type: String, required: true, enum: ['2021', '2022', '2023', '2024', '2025', '2026'] },
  password: { type: String, required: true, minlength: 6 },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', default: null },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  bed: { type: String, default: null },
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
