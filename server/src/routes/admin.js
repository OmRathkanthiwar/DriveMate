// src/routes/admin.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Get all pending driver verifications
router.get('/pending-drivers', async (req, res) => {
  try {
    const drivers = await Driver.find({ verified: false }).select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify a driver
router.patch('/verify-driver/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json({ message: 'Driver verified successfully', driver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get global stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRides = await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'started'] } });
    res.json({ totalUsers, activeRides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
