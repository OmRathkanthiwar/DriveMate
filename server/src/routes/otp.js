// src/routes/otp.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// REAL OTP sending via Twilio
router.post('/send', async (req, res) => {
  let { phone, type } = req.body;
  
  // Auto-fix: Add +91 if user only entered 10 digits
  if (phone.length === 10 && !phone.startsWith('+')) {
    phone = `+91${phone}`;
  } else if (!phone.startsWith('+')) {
    // If it's something like '919876...', just add the +
    phone = `+${phone}`;
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    // Send via Twilio
    await client.messages.create({
      body: `Your DriveMate OTP for ${type} is ${otp}. Valid for 5 minutes.`,
      from: '+12184131584', // This should ideally be in .env, but using a placeholder for now
      to: phone
    });

    console.log(`✅ [Twilio] OTP ${otp} sent to ${phone}`);
    
    // In production, you would save this to the DB with an expiry.
    // For now, we return it so the frontend can verify (safe for testing).
    res.json({ message: 'OTP sent successfully', otp }); 
  } catch (err) {
    console.error('❌ [Twilio] Error:', err.message);
    res.status(500).json({ error: 'Failed to send SMS. Check your Twilio keys.' });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  const { otp, inputOtp } = req.body;
  if (otp === inputOtp) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

module.exports = router;
