// src/routes/metadata.js
const express = require('express');
const router = express.Router();

// Static metadata – could later be moved to DB or config file
const vehicleTypes = ['Sedan','Hatchback','SUV','Family Car','Luxury Car'];
const transmissionTypes = ['Manual','Automatic'];
const fuelTypes = ['Petrol','Diesel','CNG','EV'];

router.get('/metadata', (req, res) => {
  res.json({ vehicleTypes, transmissionTypes, fuelTypes });
});

module.exports = router;
