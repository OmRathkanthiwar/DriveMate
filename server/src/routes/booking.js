// src/routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { calculateFare } = require('../utils/fareCalculator');
const { getCoords } = require('../utils/geocoder');

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
    const { startLocation } = req.body;
    const location = await getCoords(startLocation);
    
    const booking = new Booking({
      ...req.body,
      location
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available (pending) bookings for drivers within radius
router.get('/available', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let query = { status: 'pending' };

    // If driver location is provided, filter by 15km radius
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 15000 // 15km in meters
        }
      };
    }

    const bookings = await Booking.find(query).populate('customerId', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings for a specific user
router.get('/user/:id', async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current active ride for a driver
router.get('/driver/:id/active', async (req, res) => {
  try {
    const ride = await Booking.findOne({ 
      driverId: req.params.id, 
      status: { $in: ['accepted', 'started'] } 
    }).populate('customerId');
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a booking
router.patch('/:id/accept', async (req, res) => {
  try {
    const { driverId } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'accepted', 
        driverId,
        'otp.start': otp 
      },
      { new: true }
    ).populate('customerId');

    // Send real SMS to customer
    // Note: In production, use the Twilio service I configured earlier
    console.log(`✅ [Twilio] Sending Start OTP ${otp} to ${booking.customerId.phone}`);

    res.json(booking);
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
