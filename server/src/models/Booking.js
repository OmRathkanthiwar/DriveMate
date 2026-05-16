// src/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startLocation: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  endLocation: {
    address: String,
    coordinates: { type: [Number] }
  },
  vehicleType: { type: String, enum: ['sedan', 'hatchback', 'family car', 'luxury car', 'suv'], required: true },
  transmissionType: { type: String, enum: ['manual', 'automatic'], required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng', 'ev'], required: true },
  fare: { type: Number },
  status: { type: String, enum: ['pending', 'accepted', 'started', 'completed', 'cancelled'], default: 'pending' },
  otp: {
    start: String,
    end: String
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['razorpay', 'cash'] }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
