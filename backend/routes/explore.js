const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing'); // adjust path as needed
const verifyToken = require('../middleware/auth'); // adjust path if needed

// Search by query string
router.get('/search', verifyToken, async (req, res) => {
  const query = req.query.q;
  try {
    const regex = new RegExp(query, 'i'); // case-insensitive
    const results = await Listing.find({
      $or: [
        { title: regex },
        { category: regex },
        { description: regex },
        { university: regex }
      ]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Filter by category
router.get('/category/:cat', verifyToken, async (req, res) => {
  try {
    const results = await Listing.find({ category: req.params.cat });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Category fetch failed' });
  }
});

// Recent listings (exclude current user)
router.get('/recent', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Listing.find({ user: { $ne: userId } }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load listings' });
  }
});

module.exports = router;
