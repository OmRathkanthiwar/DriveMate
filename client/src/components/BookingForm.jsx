import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Car, ChevronRight, CheckCircle2, IndianRupee, ShieldCheck, Moon } from 'lucide-react';
import axios from 'axios';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(0);
  const [isNightDrive, setIsNightDrive] = useState(true);
  
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    startDate: '',
    endDate: '',
    vehicleType: 'sedan',
    totalHours: 12,
    dayHours: 8,
    nightHours: 4,
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
    fetchFare();
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
      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-900 flex">
           <motion.div animate={{ width: `${(step/3)*100}%` }} className="h-full premium-gradient" />
        </div>

        <div className="p-8 md:p-12 text-left">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input value={formData.startLocation} onChange={(e) => setFormData({...formData, startLocation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none" placeholder="Enter pickup address" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Drop Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                    <input value={formData.endLocation} onChange={(e) => setFormData({...formData, endLocation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 outline-none" placeholder="Enter destination" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Vehicle</label>
                    <select value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none">
                       <option value="sedan">Sedan</option>
                       <option value="suv">SUV</option>
                       <option value="luxury">Luxury</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Day Hours</label>
                    <input type="number" value={formData.dayHours} onChange={(e) => setFormData({...formData, dayHours: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Night Hours</label>
                    <input type="number" value={formData.nightHours} onChange={(e) => setFormData({...formData, nightHours: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" />
                 </div>
              </div>

              {/* NIGHT DRIVE OPTION */}
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${isNightDrive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                       <Moon className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold">Drive at Night?</h4>
                       <p className="text-xs text-slate-500">If off, driver stays at night (Flat ₹200 fee)</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsNightDrive(!isNightDrive)}
                   className={`w-14 h-8 rounded-full transition-all relative ${isNightDrive ? 'bg-blue-600' : 'bg-slate-800'}`}
                 >
                    <motion.div animate={{ x: isNightDrive ? 26 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" />
                 </button>
              </div>

              <button onClick={() => setStep(2)} className="w-full py-5 rounded-2xl premium-gradient text-white font-bold text-xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all">
                 Calculate Final Fare <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10">
               <div className="space-y-2">
                  <p className="text-slate-500 uppercase font-bold tracking-widest text-sm">Estimated Total Fare</p>
                  <h2 className="text-7xl font-black text-white flex items-center justify-center gap-2">
                     <IndianRupee className="text-blue-500 w-12 h-12" /> {fare}
                  </h2>
               </div>

               <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Journey Summary</p>
                     <p className="text-white font-medium">{formData.startLocation} to {formData.endLocation}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Night Strategy</p>
                     <p className="text-blue-400 font-bold">{isNightDrive ? 'Active Driving' : 'Driver Stay'}</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl border border-slate-800 text-slate-400 font-bold hover:bg-slate-900 transition-all">Back to Edit</button>
                  <button onClick={handleConfirm} disabled={loading} className="flex-[2] py-5 rounded-2xl premium-gradient text-white font-bold text-xl hover:shadow-2xl transition-all">
                     {loading ? 'Confirming...' : 'Book My Driver Now'}
                  </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10 space-y-8">
               <div className="w-24 h-24 bg-green-500/10 rounded-full mx-auto flex items-center justify-center border-4 border-green-500/20">
                  <CheckCircle2 className="text-green-500 w-12 h-12" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white">Booking Confirmed!</h2>
                  <p className="text-slate-400 max-w-sm mx-auto">Your request has been sent to drivers near {formData.startLocation}. We'll notify you once a driver accepts.</p>
               </div>
               <button onClick={() => window.location.href = '/customer/dashboard'} className="px-12 py-4 rounded-2xl premium-gradient text-white font-bold text-lg hover:shadow-xl transition-all">Go to My Dashboard</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
