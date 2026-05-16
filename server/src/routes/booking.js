// src/routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { calculateFare } = require('../utils/fareCalculator');

// Create a booking request (calculate fare)
router.post('/calculate', async (req, res) => {
  try {
    const { totalHours, dayHours, nightHours, distance } = req.body;
    const fare = calculateFare({ totalHours, dayHours, nightHours, distance });
    res.json({ fare });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Find available drivers for a booking
router.get('/:id/available-drivers', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Find drivers within radius (e.g. 15km)
    // For simplicity, we'll just find all available drivers for now
    // In a real app, use $near or $geoWithin
    const drivers = await Driver.find({ 
      status: 'available',
      verified: true
    }).select('-password');
    
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
