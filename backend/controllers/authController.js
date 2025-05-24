const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const allowedDomains = ['iut-dhaka.edu', 'du.ac.bd'];
exports.register = async (req, res) => {
  const { name, email, password, university, department, program, year, phone, dob } = req.body;

  // ✅ Allow any .edu email
  if (!email.endsWith('.edu')) {
    return res.status(400).json({ message: 'Only .edu emails are allowed.' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const user = new User({
    name, email, password: hashedPassword, university, department, program, year,
    phone, dob, emailVerificationToken
  });

  await user.save();

  const link = `http://localhost:5000/api/auth/verify/${emailVerificationToken}`;
  await sendEmail(email, 'Verify your student account', `Click to verify: ${link}`);

  res.status(201).json({ message: 'Registration successful. Check your email to verify.' });
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid verification link.' });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified. You can now log in.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};
