const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  university: String,
  department: String,
  program: String,
  year: String,
  phone: String,
  dob: Date,
  isVerified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false }  // <-- Added this line
});

module.exports = mongoose.model('User', userSchema);
