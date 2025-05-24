const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing'); // Ensure correct capitalization
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Utility
function getVisibilityFilter(userUniversity) {
  return {
    $or: [
      { visibility: 'Global' },
      { visibility: 'UniversityOnly', university: userUniversity }
    ]
  };
}

// ✅ Feature: My Listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching user listings.' });
  }
});

// ✅ Feature: Mark a Listing as Sold
router.patch('/:id/mark-sold', auth, async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, owner: req.user._id });

    if (!listing) return res.status(404).json({ error: 'Listing not found or unauthorized.' });

    listing.status = 'Sold';
    await listing.save();
    res.json({ message: 'Listing marked as sold.', listing });
  } catch (err) {
    res.status(500).json({ error: 'Server error marking listing as sold.' });
  }
});

// Recent Listings
router.get('/recent', auth, async (req, res) => {
  try {
    const filter = getVisibilityFilter(req.user.university);
    const listings = await Listing.find(filter).sort({ createdAt: -1 }).limit(10);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent listings" });
  }
});

// All Listings
router.get('/listings', auth, async (req, res) => {
  try {
    const filter = getVisibilityFilter(req.user.university);
    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Search Listings
router.get('/search', auth, async (req, res) => {
  const q = req.query.q || '';
  try {
    const filter = {
      $and: [
        getVisibilityFilter(req.user.university),
        {
          $or: [
            { title: new RegExp(q, 'i') },
            { description: new RegExp(q, 'i') }
          ]
        }
      ]
    };
    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Category Filter
router.get('/category/:category', auth, async (req, res) => {
  try {
    const filter = {
      $and: [
        getVisibilityFilter(req.user.university),
        { category: req.params.category }
      ]
    };
    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Filter failed" });
  }
});

// Price Filter
router.get('/price', async (req, res) => {
  const min = parseFloat(req.query.min);
  const max = parseFloat(req.query.max);
  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({ message: "Invalid price range" });
  }
  try {
    const listings = await Listing.find({ price: { $gte: min, $lte: max } });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create Listing with image
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const {
      title, description, category, price,
      priceType, condition, visibility, type
    } = req.body;

    if (!['Global', 'UniversityOnly'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility option' });
    }

    const listing = new Listing({
      title,
      description,
      category,
      price,
      priceType,
      condition,
      visibility,
      type,
      university: req.user.university,
      owner: req.user._id,
      imageUrl: req.file ? req.file.filename : null,
    });

    await listing.save();
    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing status to Sold/Available (optional general update route)
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  if (!['Available', 'Sold'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updated = await Listing.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Listing not found or unauthorized' });

    res.json({ message: `Listing marked as ${status}`, listing: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
