import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Car } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-blue-400 text-sm font-semibold mb-6">
              ✨ Trusted by 10,000+ Vehicle Owners
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Hire a <span className="text-gradient">Professional</span> Driver for Your Own Car
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0">
              Safe, reliable, and verified drivers at your doorstep. Experience the luxury of being driven in the comfort of your own vehicle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/book" className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-blue-500/40 transition-all group">
                Book a Ride Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="px-8 py-4 rounded-2xl glass text-white font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                Join as a Driver
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-white">4.9/5</span>
                <span className="text-sm">User Rating</span>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-sm">Availability</span>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-sm">Verified</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden glass p-4 aspect-square">
                {/* Image placeholder or actual image */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                 <Car className="w-32 h-32 text-blue-500/20" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass p-6 rounded-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="text-green-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Driver Status</p>
                    <p className="text-sm font-bold text-white">Fully Verified</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass p-6 rounded-2xl animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Clock className="text-orange-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Response Time</p>
                    <p className="text-sm font-bold text-white">&lt; 15 Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
