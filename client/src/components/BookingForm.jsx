import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Car, Fuel, Settings2, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    startLocation: '',
    endLocation: '',
    vehicleType: 'sedan',
    transmissionType: 'manual',
    fuelType: 'petrol'
  });
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // Connect to REAL backend
      const response = await axios.post('http://localhost:5000/api/booking/calculate', {
        ...formData,
        totalHours: 8, // Simplified for now, backend will calculate exacts later
        dayHours: 5,
        nightHours: 3
      });
      
      setFare(response.data.fare);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Error connecting to Backend. Make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Save booking to REAL Database
      await axios.post('http://localhost:5000/api/booking', {
        ...formData,
        fare,
        status: 'pending'
      });
      setStep(3);
    } catch (err) {
      alert('Failed to save booking to Database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass rounded-3xl p-6 md:p-12">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-12 max-w-xs mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'premium-gradient text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && <div className={`w-8 md:w-16 h-1 mx-2 rounded-full transition-all ${step > s ? 'bg-blue-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white"><Calendar className="text-blue-400" /> Ride Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Start Date</label>
                    <input type="date" name="startDate" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">End Date</label>
                    <input type="date" name="endDate" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Start Time</label>
                    <input type="time" name="startTime" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">End Time</label>
                    <input type="time" name="endTime" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white"><MapPin className="text-blue-400" /> Route Details</h3>
                <div className="space-y-4">
                  <input name="startLocation" placeholder="Pickup Location (e.g. Mumbai Airport)" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
                  <input name="endLocation" placeholder="Destination (e.g. Pune City Center)" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Fare & Continue'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-8"
          >
            <div className="p-8 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 inline-block mx-auto">
               <p className="text-blue-400 uppercase tracking-widest text-sm mb-2 font-bold">Verified Fare</p>
               <h2 className="text-6xl font-bold text-white">₹{fare}</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
               <button onClick={() => setStep(1)} className="px-8 py-4 rounded-2xl border border-slate-800 text-slate-400 hover:bg-slate-800 transition-all font-bold">Edit Details</button>
               <button 
                 onClick={handleConfirm}
                 className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
               >
                 Confirm Booking <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
             <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">Request Sent to Drivers!</h2>
             <p className="text-slate-400 mb-10">We have saved your ride to the database and are matching you with available drivers.</p>
             
             <button onClick={() => window.location.href='/customer/dashboard'} className="px-10 py-4 rounded-2xl premium-gradient text-white font-bold">
                Go to Dashboard
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
