import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Car, ChevronRight, CheckCircle2, IndianRupee, ShieldCheck, Moon, Settings, Fuel, Navigation, Wallet } from 'lucide-react';
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
    tripType: 'round-trip',
    paymentMethod: 'razorpay'
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Trip Type Selector */}
              <div className="flex bg-slate-900 p-1 rounded-2xl w-fit">
                 <button onClick={() => setFormData({...formData, tripType: 'round-trip'})} className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${formData.tripType === 'round-trip' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Round Trip</button>
                 <button onClick={() => setFormData({...formData, tripType: 'one-way'})} className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${formData.tripType === 'one-way' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>One Way (+20%)</button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pickup</label>
                  <input value={formData.startLocation} onChange={(e) => setFormData({...formData, startLocation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none" placeholder="Pickup address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Destination</label>
                  <input value={formData.endLocation} onChange={(e) => setFormData({...formData, endLocation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none" placeholder="Drop address" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Start Date</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Start Time</label>
                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">End Date</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">End Time</label>
                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none" />
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Vehicle</label>
                    <select value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">
                       <option value="sedan">Sedan</option>
                       <option value="hatchback">Hatchback</option>
                       <option value="family">Family Car</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Transmission</label>
                    <select value={formData.transmissionType} onChange={(e) => setFormData({...formData, transmissionType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">
                       <option value="manual">Manual</option>
                       <option value="automatic">Automatic</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Fuel</label>
                    <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm">
                       <option value="petrol">Petrol</option>
                       <option value="diesel">Diesel</option>
                       <option value="cng">CNG</option>
                       <option value="ev">Electric</option>
                    </select>
                 </div>
              </div>

              <button onClick={() => setStep(2)} className="w-full py-5 rounded-2xl premium-gradient text-white font-bold text-xl flex items-center justify-center gap-3">
                 Check Fare <ChevronRight />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10">
               <div className="space-y-2">
                  <p className="text-slate-500 uppercase font-bold tracking-widest text-sm">Estimated Total Fare</p>
                  <h2 className="text-7xl font-black text-white flex items-center justify-center gap-3">
                     <IndianRupee className="text-blue-500 w-12 h-12" /> {fare}
                  </h2>
               </div>

               <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'razorpay' ? 'bg-blue-600/10 border-blue-600' : 'bg-slate-900 border-slate-800'}`} onClick={() => setFormData({...formData, paymentMethod: 'razorpay'})}>
                     <Wallet className="w-6 h-6 text-blue-500 mb-2" />
                     <h4 className="text-white font-bold">Online Payment</h4>
                     <p className="text-xs text-slate-500">Secure via Razorpay</p>
                  </div>
                  <div className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'cash' ? 'bg-blue-600/10 border-blue-600' : 'bg-slate-900 border-slate-800'}`} onClick={() => setFormData({...formData, paymentMethod: 'cash'})}>
                     <IndianRupee className="w-6 h-6 text-green-500 mb-2" />
                     <h4 className="text-white font-bold">Cash on Delivery</h4>
                     <p className="text-xs text-slate-500">Pay directly to driver</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl border border-slate-800 text-slate-500 font-bold">Back</button>
                  <button onClick={handleConfirm} disabled={loading} className="flex-[2] py-4 rounded-xl premium-gradient text-white font-bold text-xl">
                     {loading ? 'Confirming...' : 'Confirm Booking'}
                  </button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10 space-y-8">
               <div className="w-24 h-24 bg-green-500/10 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="text-green-500 w-12 h-12" />
               </div>
               <h2 className="text-4xl font-bold text-white">Booking Confirmed!</h2>
               <button onClick={() => window.location.href = '/customer/dashboard'} className="px-12 py-4 rounded-2xl premium-gradient text-white font-bold">Go to Dashboard</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
