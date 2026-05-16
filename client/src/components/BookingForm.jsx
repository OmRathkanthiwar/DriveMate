import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Car, ChevronRight, CheckCircle2, IndianRupee, ShieldCheck, Moon, Settings, Fuel } from 'lucide-react';
import axios from 'axios';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(0);
  const [isNightDrive, setIsNightDrive] = useState(false);
  
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:00',
    vehicleType: 'sedan',
    transmissionType: 'manual',
    fuelType: 'petrol',
    distance: 100
  });

  const fetchFare = async () => {
    try {
      const { data } = await axios.post('/api/booking/calculate', {
        ...formData,
        isNightDrive
      });
      setFare(data.fare);
    } catch (err) {
      console.error('Fare calculation failed');
    }
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      fetchFare();
    }
  }, [formData, isNightDrive]);

  const handleConfirm = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to complete your booking!');
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/booking', {
        ...formData,
        fare,
        isNightDrive,
        customerId: userId,
        status: 'pending'
      });
      setStep(3);
    } catch (err) {
      alert('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="h-1.5 w-full bg-slate-900 flex">
           <motion.div animate={{ width: `${(step/3)*100}%` }} className="h-full premium-gradient" />
        </div>

        <div className="p-8 md:p-14 text-left">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {/* Row 1: Locations */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input value={formData.startLocation} onChange={(e) => setFormData({...formData, startLocation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Enter pickup address" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Drop Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                    <input value={formData.endLocation} onChange={(e) => setFormData({...formData, endLocation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Enter destination" />
                  </div>
                </div>
              </div>

              {/* Row 2: Dates & Times */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Start Date</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Start Time</label>
                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">End Date</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">End Time</label>
                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm outline-none" />
                 </div>
              </div>

              {/* Row 3: Vehicle Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Vehicle Type</label>
                    <div className="relative">
                       <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                       <select value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none cursor-pointer appearance-none">
                          <option value="sedan">Sedan</option>
                          <option value="hatchback">Hatchback</option>
                          <option value="family">Family Car</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Drive Type</label>
                    <div className="relative">
                       <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                       <select value={formData.transmissionType} onChange={(e) => setFormData({...formData, transmissionType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none cursor-pointer appearance-none">
                          <option value="manual">Manual Transmission</option>
                          <option value="automatic">Automatic Transmission</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Fuel Type</label>
                    <div className="relative">
                       <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                       <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none cursor-pointer appearance-none">
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="cng">CNG</option>
                          <option value="ev">Electric (EV)</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Night Drive Option */}
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-[1.25rem] transition-all ${isNightDrive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                       <Moon className="w-7 h-7" />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-white">Active Night Driving</h4>
                       <p className="text-sm text-slate-500">Enable if you need the driver between 10 PM - 6 AM</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsNightDrive(!isNightDrive)}
                   className={`w-16 h-9 rounded-full transition-all relative ${isNightDrive ? 'bg-blue-600' : 'bg-slate-800'}`}
                 >
                    <motion.div animate={{ x: isNightDrive ? 30 : 6 }} className="absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg" />
                 </button>
              </div>

              <button onClick={() => setStep(2)} className="w-full py-6 rounded-2xl premium-gradient text-white font-bold text-2xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all">
                 Review Fare & Details <ChevronRight className="w-7 h-7" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
               <div className="space-y-4">
                  <p className="text-slate-500 uppercase font-bold tracking-[0.2em] text-sm">Estimated Service Fare</p>
                  <h2 className="text-8xl font-black text-white flex items-center justify-center gap-3">
                     <IndianRupee className="text-blue-500 w-14 h-14" /> {fare}
                  </h2>
               </div>

               <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-left">
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Duration</p>
                     <p className="text-white font-bold">{formData.startDate} {formData.startTime} — {formData.endDate} {formData.endTime}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 text-left">
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Vehicle Details</p>
                     <p className="text-white font-bold capitalize">{formData.vehicleType} • {formData.transmissionType} • {formData.fuelType}</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-5 pt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl border-2 border-slate-800 text-slate-500 font-bold hover:bg-slate-900 transition-all text-lg">Back to Edit</button>
                  <button onClick={handleConfirm} disabled={loading} className="flex-[2] py-5 rounded-2xl premium-gradient text-white font-bold text-2xl hover:shadow-2xl transition-all">
                     {loading ? 'Finalizing...' : 'Confirm My Booking'}
                  </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 space-y-10">
               <div className="w-28 h-28 bg-green-500/10 rounded-full mx-auto flex items-center justify-center border-4 border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                  <CheckCircle2 className="text-green-500 w-14 h-14" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-5xl font-bold text-white tracking-tight">Booking Sent!</h2>
                  <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">We've notified nearby drivers of your journey in a {formData.vehicleType}.</p>
               </div>
               <button onClick={() => window.location.href = '/customer/dashboard'} className="px-16 py-5 rounded-[2rem] premium-gradient text-white font-bold text-xl hover:shadow-2xl transition-all shadow-lg active:scale-95">Go to My Dashboard</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
