import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Car, Clock, MapPin, IndianRupee, ChevronRight, Search, CheckCircle2, User, PlayCircle, StopCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const interval = setInterval(fetchBookings, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const generateStartOtp = async (id) => {
    try {
      await axios.patch(`/api/booking/${id}/start-otp`);
      fetchBookings();
    } catch (err) { alert('Failed to generate OTP'); }
  };

  const generateEndOtp = async (id) => {
    try {
      await axios.patch(`/api/booking/${id}/end-otp`);
      fetchBookings();
    } catch (err) { alert('Failed to generate OTP'); }
  };

  const activeRide = bookings.find(b => ['pending', 'accepted', 'started'].includes(b.status));

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 text-left">Your <span className="text-gradient">DriveMate</span> Dashboard</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* History */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <h2 className="text-xl font-bold text-white flex items-center gap-3"><Clock className="text-blue-400" /> Recent Journeys</h2>
            {bookings.map(ride => (
              <div key={ride._id} className="glass p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Car className="text-slate-500" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ride.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{ride.status}</span>
                    <h3 className="text-white font-bold">{ride.startLocation.split(',')[0]} → {ride.endLocation.split(',')[0]}</h3>
                    <p className="text-xs text-slate-500">{new Date(ride.startDate).toDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">₹{ride.fare}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{ride.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Status */}
          <div className="space-y-6 text-left">
            <h2 className="text-xl font-bold text-white flex items-center gap-3"><Search className="text-blue-400" /> Live Trip Status</h2>
            <div className="glass p-8 rounded-[3rem] border-2 border-blue-500/20 text-center relative overflow-hidden">
              {activeRide ? (
                <div className="space-y-6">
                  {activeRide.status === 'pending' && (
                    <div className="animate-pulse py-10">
                      <Search className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-xl">Searching for Drivers...</h3>
                    </div>
                  )}

                  {activeRide.status === 'accepted' && (
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full mx-auto flex items-center justify-center border-2 border-green-500/50">
                        <CheckCircle2 className="text-green-400 w-10 h-10" />
                      </div>
                      <h3 className="text-white font-bold text-2xl">Driver Found!</h3>
                      
                      {!activeRide.otp?.start ? (
                        <button onClick={() => generateStartOtp(activeRide._id)} className="w-full py-4 rounded-2xl premium-gradient text-white font-bold flex items-center justify-center gap-2">
                           <PlayCircle /> Start My Ride
                        </button>
                      ) : (
                        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
                           <p className="text-xs text-slate-500 uppercase font-bold mb-2">Share this Start OTP</p>
                           <p className="text-5xl font-black text-blue-400 tracking-widest">{activeRide.otp.start}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeRide.status === 'started' && (
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-blue-500/10 rounded-full mx-auto flex items-center justify-center border-2 border-blue-500/50">
                        <Navigation className="text-blue-400 w-10 h-10 animate-bounce" />
                      </div>
                      <h3 className="text-white font-bold text-2xl">Trip Ongoing...</h3>
                      
                      {!activeRide.otp?.end ? (
                        <button onClick={() => generateEndOtp(activeRide._id)} className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold flex items-center justify-center gap-2">
                           <StopCircle /> End My Ride
                        </button>
                      ) : (
                        <div className="bg-slate-900 p-6 rounded-3xl border border-red-500/20">
                           <p className="text-xs text-slate-500 uppercase font-bold mb-2">Share this End OTP</p>
                           <p className="text-5xl font-black text-red-500 tracking-widest">{activeRide.otp.end}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 opacity-20">
                  <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-bold">No Active Trips</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
