// src/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Made optional for easier testing
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  vehicleType: { type: String, required: true },
  transmissionType: { type: String, required: true },
  fuelType: { type: String, required: true },
  fare: { type: Number },
  status: { type: String, enum: ['pending', 'accepted', 'started', 'completed', 'cancelled'], default: 'pending' },
  otp: {
    start: String,
    end: String
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['razorpay', 'cash'], default: 'razorpay' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
