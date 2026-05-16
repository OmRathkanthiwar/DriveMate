import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Car, Clock, MapPin, IndianRupee, ChevronRight, Search, CheckCircle2, User, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(`/api/booking/user/${userId}`);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
      const interval = setInterval(fetchBookings, 5000); // Poll for real-time updates
      return () => clearInterval(interval);
    }
  }, [userId]);

  const displayName = (!userName || userName === 'undefined') ? 'User' : userName;
  const activeRide = bookings.find(b => b.status === 'accepted' || b.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 text-left">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back, <span className="text-gradient">{displayName}</span></h1>
              <p className="text-slate-400">Manage your bookings and travel in comfort.</p>
            </div>
            <div className="flex gap-4">
              <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <Car className="text-blue-400 w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total Rides</p>
                    <p className="text-2xl font-bold text-white">{bookings.length}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Bookings List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="text-blue-400" /> Your History
                </h2>
                <button className="text-blue-400 text-sm font-bold hover:underline">View All</button>
              </div>

              {loading ? (
                <div className="p-20 text-center"><p className="text-slate-500">Loading your journeys...</p></div>
              ) : bookings.length > 0 ? (
                bookings.map((ride) => (
                  <motion.div 
                    key={ride._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-6 rounded-[2.5rem] border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                          <Car className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ride.status === 'pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                              {ride.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1)} Journey</h3>
                          <p className="text-xs text-slate-500">{new Date(ride.startDate).toDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-right hidden sm:block">
                            <p className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                               <IndianRupee className="w-4 h-4 text-slate-500" /> {ride.fare}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-end gap-1 text-right">
                               <MapPin className="w-3 h-3" /> {ride.startLocation.split(',')[0]} → {ride.endLocation.split(',')[0]}
                            </p>
                         </div>
                         <ChevronRight className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center border-2 border-dashed border-slate-900 rounded-[3rem]">
                   <p className="text-slate-500 font-bold mb-4">No rides found yet.</p>
                   <Link to="/book" className="px-8 py-3 rounded-full premium-gradient text-white font-bold inline-block">Book Your First Ride</Link>
                </div>
              )}
            </div>

            {/* Active Ride Status */}
            <div className="space-y-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-3">
                 <Search className="text-blue-400" /> Live Ride Status
               </h2>
               
               <div className="glass p-8 rounded-[3rem] border-2 border-blue-500/20 relative overflow-hidden text-center">
                  {activeRide ? (
                    activeRide.status === 'accepted' ? (
                      <div className="space-y-6 animate-in fade-in duration-700">
                         <div className="w-20 h-20 rounded-full bg-green-500/10 mx-auto flex items-center justify-center border-2 border-green-500/50">
                            <CheckCircle2 className="text-green-400 w-10 h-10" />
                         </div>
                         <h3 className="text-2xl font-bold text-white">Driver Found!</h3>
                         <p className="text-sm text-slate-400">Share this OTP with your driver to start the journey</p>
                         
                         <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Your Start OTP</p>
                            <p className="text-5xl font-black text-blue-400 tracking-[0.2em]">{activeRide.otp?.start || '----'}</p>
                         </div>
                         
                         <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-left">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                               <User className="text-blue-400 w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-500 font-bold uppercase">Your Driver</p>
                               <p className="text-white font-bold">Assigned Partner</p>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                         <div className="absolute top-0 right-0 p-4">
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                         </div>
                         <div className="w-20 h-20 rounded-full bg-slate-900 mx-auto flex items-center justify-center">
                            <Search className="text-blue-400 w-10 h-10" />
                         </div>
                         <h3 className="text-2xl font-bold text-white">Searching...</h3>
                         <p className="text-sm text-slate-400">Waiting for a driver to accept your request from {activeRide.startLocation.split(',')[0]}</p>
                         <div className="flex justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                         </div>
                      </div>
                    )
                  ) : (
                    <div className="py-10">
                       <ShieldCheck className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                       <p className="text-slate-600 font-bold">No active ride requests</p>
                       <p className="text-xs text-slate-700 mt-2 italic">Book a ride to see it here</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
