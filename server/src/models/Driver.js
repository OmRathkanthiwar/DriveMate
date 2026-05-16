// src/models/Driver.js
const mongoose = require('mongoose');
const User = require('./User');

const DriverSchema = new mongoose.Schema({
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
  aadhaar: { type: String, required: true },
  license: { type: String, required: true },
  pan: { type: String, required: true },
  photos: [String],
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['available', 'busy', 'offline', 'blocked'], default: 'available' },
  radius: { type: Number, default: 10 }, // km
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  rating: { type: Number, default: 5 },
  reviews: [{ customerId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }]
});

module.exports = User.discriminator('driver', DriverSchema);
