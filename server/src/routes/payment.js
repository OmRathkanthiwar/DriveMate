// src/routes/payment.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// REAL Razorpay order creation
router.post('/create-order', async (req, res) => {
  const { amount, bookingId } = req.body;
  
  try {
    const options = {
      amount: amount * 100, // Razorpay expects paise (e.g. 500.00 INR = 50000 paise)
      currency: "INR",
      receipt: bookingId || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log(`✅ [Razorpay] Order created: ${order.id}`);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('❌ [Razorpay] Error:', err.message);
    res.status(500).json({ error: 'Failed to create Razorpay order.' });
  }
});

// REAL Payment verification (HMAC Signature)
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    console.log('✅ [Razorpay] Payment verified successfully');
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    console.error('❌ [Razorpay] Signature mismatch');
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
