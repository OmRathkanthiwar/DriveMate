// src/routes/driver.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Update driver status (available/busy)
router.put('/status', async (req, res) => {
  try {
    const { status, driverId } = req.body;
    const driver = await Driver.findByIdAndUpdate(driverId, { status }, { new: true });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update location
router.put('/location', async (req, res) => {
  try {
    const { driverId, coordinates } = req.body;
    const driver = await Driver.findByIdAndUpdate(driverId, { 
      location: { type: 'Point', coordinates } 
    }, { new: true });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
