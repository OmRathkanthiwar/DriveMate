import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { LayoutDashboard, Car, Clock, CheckCircle2, AlertCircle, User, MapPin, ChevronRight } from 'lucide-react';
import axios from 'axios';

const StatusBadge = ({ status }) => {
  const configs = {
    pending: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
    accepted: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle2 },
    started: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: Car },
    completed: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: CheckCircle2 },
  };
  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 w-fit ${config.color}`}>
      <Icon className="w-3 h-3" /> {status.toUpperCase()}
    </span>
  );
};

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([
    // Mock data for initial view
    {
      _id: '1',
      startDate: '2026-05-18',
      vehicleType: 'sedan',
      startLocation: 'Powai, Mumbai',
      endLocation: 'Pune City',
      fare: 2450,
      status: 'pending',
    },
    {
      _id: '2',
      startDate: '2026-05-15',
      vehicleType: 'suv',
      startLocation: 'Andheri West',
      endLocation: 'Gateway of India',
      fare: 850,
      status: 'completed',
    }
  ]);

  let userName = localStorage.getItem('userName');
  if (!userName || userName === 'undefined') userName = 'User';

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back, <span className="text-gradient">{userName}</span></h1>
              <p className="text-slate-400">Manage your bookings and travel in comfort.</p>
            </div>
            <div className="flex gap-4">
               <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center">
                    <LayoutDashboard className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Rides</p>
                    <p className="text-xl font-bold text-white">12</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Active & Recent Bookings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="text-blue-400 w-5 h-5" /> Your Bookings
                </h2>
                <button className="text-sm text-blue-400 hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div 
                    key={booking._id}
                    whileHover={{ scale: 1.01 }}
                    className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center">
                          <Car className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div>
                          <StatusBadge status={booking.status} />
                          <h3 className="text-lg font-bold text-white mt-2 capitalize">{booking.vehicleType} Journey</h3>
                          <p className="text-sm text-slate-500">{new Date(booking.startDate).toDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end justify-between gap-4">
                        <p className="text-2xl font-bold text-white font-mono">₹{booking.fare}</p>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                           <MapPin className="w-4 h-4" /> {booking.startLocation.split(',')[0]} → {booking.endLocation.split(',')[0]}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <ChevronRight className="text-slate-700 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Driver Details (Visible if ride accepted) */}
            <div className="space-y-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="text-blue-400 w-5 h-5" /> Active Match
                </h2>
                
                <div className="glass p-8 rounded-3xl relative overflow-hidden">
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 premium-gradient opacity-10 blur-3xl rounded-full -mr-16 -mt-16" />
                   
                   <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-slate-800 mx-auto mb-4 border-4 border-slate-900 shadow-xl relative">
                         <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full" />
                         <User className="w-full h-full p-4 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Searching...</h3>
                      <p className="text-sm text-slate-400 mb-6">Matching you with the best driver nearby</p>
                      
                      <div className="flex justify-center mb-8">
                         <div className="animate-pulse flex space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-400"></div>
                         </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-slate-800 text-left">
                         <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <AlertCircle className="w-4 h-4 text-blue-400" />
                            <span>Verification in progress</span>
                         </div>
                         <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>5 Drivers in your radius</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="glass p-6 rounded-3xl bg-blue-500/5 border-blue-500/20">
                   <p className="text-sm text-blue-300 font-medium mb-1">Support</p>
                   <p className="text-xs text-slate-400 leading-relaxed">Need help with a booking? Our support team is available 24/7.</p>
                   <button className="mt-4 text-sm font-bold text-white bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all w-full">
                      Contact Support
                   </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
