import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, MapPin, Navigation, IndianRupee, Clock, CheckCircle, XCircle, User, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  const [requests, setRequests] = useState([]);
  const [otpInput, setOtpInput] = useState('');
  const driverId = localStorage.getItem('userId');

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/booking/available');
      setRequests(data);
    } catch (err) { console.error(err); }
  };

  const fetchActiveRide = async () => {
    try {
      const { data } = await axios.get(`/api/driver/${driverId}/active`);
      if (data) setActiveRide(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (driverId) fetchActiveRide();
    if (isOnline) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline, driverId]);

  const handleAccept = async (ride) => {
    try {
      const { data } = await axios.patch(`/api/booking/${ride._id}/accept`, { driverId });
      setActiveRide(data);
    } catch (err) { alert('Accept failed'); }
  };

  const verifyStart = async () => {
    try {
      const { data } = await axios.patch(`/api/booking/${activeRide._id}/start`, { otp: otpInput });
      setActiveRide(data);
      setOtpInput('');
    } catch (err) { alert('Invalid Start OTP'); }
  };

  const verifyEnd = async () => {
    try {
      const { data } = await axios.patch(`/api/booking/${activeRide._id}/complete`, { otp: otpInput });
      setActiveRide(null);
      setOtpInput('');
      alert('Trip Completed Successfully!');
    } catch (err) { alert('Invalid End OTP'); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
           <h1 className="text-4xl font-bold text-white">Driver <span className="text-gradient">Console</span></h1>
           <button onClick={() => setIsOnline(!isOnline)} className={`px-8 py-3 rounded-2xl font-bold ${isOnline ? 'bg-red-500/10 text-red-500' : 'bg-blue-600 text-white'}`}>
             {isOnline ? 'Go Offline' : 'Go Online'}
           </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
             {activeRide ? (
               <div className="glass p-10 rounded-[3rem] border-2 border-blue-500/30 text-left">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-blue-500/20"><User className="text-blue-400" /></div>
                     <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ongoing Trip</p>
                        <h3 className="text-2xl font-bold text-white">{activeRide.customerId?.name || 'Customer'}</h3>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Pickup & Drop</p>
                           <p className="text-white font-medium">{activeRide.startLocation} → {activeRide.endLocation}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Vehicle Specs</p>
                           <p className="text-white font-medium capitalize">{activeRide.vehicleType} • {activeRide.transmissionType}</p>
                        </div>
                     </div>

                     {activeRide.status === 'accepted' && (
                       <div className="space-y-4 pt-6 border-t border-white/5">
                          <label className="text-sm font-bold text-slate-400">Enter Start OTP from Customer</label>
                          <div className="flex gap-4">
                             <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 text-white text-2xl tracking-[1em] font-black w-48 outline-none focus:border-blue-500" maxLength="4" />
                             <button onClick={verifyStart} className="px-8 rounded-xl bg-blue-600 text-white font-bold hover:shadow-lg transition-all">Verify & Start</button>
                          </div>
                       </div>
                     )}

                     {activeRide.status === 'started' && (
                       <div className="space-y-4 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-3 text-blue-400 mb-6 font-bold"><Navigation className="animate-bounce" /> Ride is in Progress...</div>
                          <label className="text-sm font-bold text-slate-400">Enter End OTP from Customer</label>
                          <div className="flex gap-4">
                             <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="bg-slate-900 border border-red-500/30 rounded-xl px-6 py-4 text-white text-2xl tracking-[1em] font-black w-48 outline-none focus:border-red-500" maxLength="4" />
                             <button onClick={verifyEnd} className="px-8 rounded-xl bg-red-600 text-white font-bold hover:shadow-lg transition-all">Verify & Complete</button>
                          </div>
                       </div>
                     )}
                  </div>
               </div>
             ) : (
               <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3 text-left"><MapPin className="text-blue-400" /> Available Near You</h2>
                  {requests.map(ride => (
                    <div key={ride._id} className="glass p-6 rounded-[2rem] border border-white/5 flex justify-between items-center text-left">
                       <div className="space-y-3">
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{ride.tripType}</span>
                          <h3 className="text-white font-bold">{ride.startLocation.split(',')[0]} → {ride.endLocation.split(',')[0]}</h3>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="text-right">
                             <p className="text-2xl font-bold text-white flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {ride.fare}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">{ride.paymentMethod}</p>
                          </div>
                          <button onClick={() => handleAccept(ride)} className="px-8 py-3 rounded-xl premium-gradient text-white font-bold">Accept</button>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>

          <div className="space-y-6">
             <div className="glass p-8 rounded-[2.5rem] text-left">
                <h3 className="text-white font-bold mb-6">Settlement Center</h3>
                <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Pending COD Balance</p>
                   <p className="text-3xl font-bold text-white">₹0.00</p>
                </div>
                <p className="text-[10px] text-slate-600 mt-4 leading-relaxed uppercase font-bold tracking-widest">Note: COD payments must be settled within 48 hours to avoid account block.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
