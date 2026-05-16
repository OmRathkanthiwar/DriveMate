import React from 'react';
import Navbar from '../components/Navbar';
import BookingForm from '../components/BookingForm';
import { motion } from 'framer-motion';

const Booking = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Book Your <span className="text-gradient">Professional</span> Driver
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto"
            >
              Fill in your journey details below. We'll calculate the best fare and match you with top-rated drivers in your area.
            </motion.p>
          </div>

          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
