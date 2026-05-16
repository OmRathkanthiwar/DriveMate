// src/routes/admin.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

// Get all pending drivers for verification
router.get('/pending-drivers', async (req, res) => {
  try {
    const drivers = await Driver.find({ verified: false }).select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify driver
router.put('/verify-driver/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deactivate driver
router.put('/deactivate-driver/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
