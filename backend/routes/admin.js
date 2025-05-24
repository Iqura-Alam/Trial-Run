const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');

// Dummy admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Admin login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.sendStatus(200);
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Get all users with bought/sold data
router.get('/users', async (req, res) => {
  const users = await User.find();
  const listings = await Listing.find();

  const usersWithData = users.map(user => {
    const bought = listings.filter(l => l.buyerId?.toString() === user._id.toString());
    const sold = listings.filter(l => l.sellerId?.toString() === user._id.toString());

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      suspended: user.suspended || false,
      bought: bought.map(l => l.title),
      sold: sold.map(l => l.title)
    };
  });

  res.json(usersWithData);
});

// Suspend a user
router.post('/suspend/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { suspended: true });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Error suspending user' });
  }
});

// Unsuspend a user
router.post('/unsuspend/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { suspended: false });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: 'Error unsuspending user' });
  }
});

module.exports = router;
