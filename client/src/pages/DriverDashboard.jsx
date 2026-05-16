import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, MapPin, Navigation, IndianRupee, Clock, CheckCircle, XCircle, User } from 'lucide-react';

const RideRequestCard = ({ ride, onAccept }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all"
  >
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">New Request</span>
          <span className="text-slate-500 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 5 mins ago</span>
        </div>
        
        <div className="space-y-2">
           <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Pickup</p>
                <p className="text-white font-medium">{ride.startLocation}</p>
              </div>
           </div>
           <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Destination</p>
                <p className="text-white font-medium">{ride.endLocation}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col justify-between md:items-end gap-6">
         <div className="text-right">
            <p className="text-sm text-slate-400 mb-1">Estimated Earnings</p>
            <p className="text-3xl font-bold text-white flex items-center justify-end gap-1">
               <IndianRupee className="w-5 h-5 text-green-400" /> {Math.floor(ride.fare * 0.8)}
            </p>
            <p className="text-[10px] text-slate-500 uppercase">After 20% platform fee</p>
         </div>
         
         <div className="flex gap-3">
            <button className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all">
               <XCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onAccept(ride)}
              className="px-8 py-3 rounded-2xl premium-gradient text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all"
            >
               Accept Ride <Navigation className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  </motion.div>
);

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  
  const [requests, setRequests] = useState([
    { _id: '1', startLocation: 'Malad West, Mumbai', endLocation: 'Bandra Kurla Complex', fare: 1200, customerName: 'Arjun M.' },
    { _id: '2', startLocation: 'Colaba Causeway', endLocation: 'Thane West', fare: 2800, customerName: 'Sonia K.' },
  ]);

  const handleAccept = (ride) => {
    setActiveRide(ride);
    setRequests(requests.filter(r => r._id !== ride._id));
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Driver <span className="text-gradient">Portal</span></h1>
              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                 <p className="text-slate-400 font-medium">{isOnline ? 'Online & Accepting Rides' : 'Offline'}</p>
              </div>
            </div>

            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-bold transition-all ${isOnline ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'premium-gradient text-white shadow-lg'}`}
            >
              <Power className="w-5 h-5" /> {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
               {activeRide ? (
                 <div className="space-y-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                       <Navigation className="text-blue-400" /> Current Mission
                    </h2>
                    <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 border-blue-500/30 relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-6 md:mb-8">
                             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700">
                                <User className="text-blue-400" />
                             </div>
                             <div>
                                <p className="text-[10px] md:text-sm text-slate-500 uppercase font-bold tracking-widest">Customer</p>
                                <h3 className="text-xl md:text-2xl font-bold text-white">{activeRide.customerName}</h3>
                             </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-10">
                             <div className="space-y-4">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Journey</p>
                                <div className="space-y-2">
                                   <p className="text-white text-base md:text-lg font-medium">{activeRide.startLocation}</p>
                                   <div className="h-4 md:h-8 w-px bg-slate-800 ml-2" />
                                   <p className="text-white text-base md:text-lg font-medium">{activeRide.endLocation}</p>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">OTP Verification</p>
                                <input maxLength={6} placeholder="Start OTP" className="w-full bg-slate-900 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-center text-xl md:text-2xl font-mono text-blue-400 tracking-[0.2em] md:tracking-[0.5em] focus:border-blue-500 outline-none" />
                             </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                             <button className="flex-1 py-4 rounded-xl md:rounded-2xl bg-green-500 text-white font-bold text-lg hover:shadow-lg active:scale-95 transition-all">Start Journey</button>
                             <button onClick={() => setActiveRide(null)} className="flex-1 py-4 rounded-xl md:rounded-2xl border border-slate-800 text-slate-400 hover:bg-slate-800 font-bold transition-all">Cancel</button>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                          <MapPin className="text-blue-400" /> Nearby Opportunities
                       </h2>
                       <span className="text-sm text-slate-500">{requests.length} rides available</span>
                    </div>

                    <div className="space-y-6">
                       {isOnline ? (
                         <AnimatePresence>
                           {requests.map(ride => (
                             <RideRequestCard key={ride._id} ride={ride} onAccept={handleAccept} />
                           ))}
                         </AnimatePresence>
                       ) : (
                         <div className="glass p-20 rounded-[3rem] text-center">
                            <XCircle className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-slate-500">You are Offline</h3>
                            <p className="text-slate-600">Go online to start seeing ride requests near you.</p>
                         </div>
                       )}
                    </div>
                 </div>
               )}
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-8">
               <div className="glass p-8 rounded-[2.5rem] space-y-6">
                  <h3 className="font-bold text-white text-lg">Today's Performance</h3>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/50">
                        <div className="flex items-center gap-3">
                           <IndianRupee className="text-green-500 w-5 h-5" />
                           <span className="text-slate-400">Earnings</span>
                        </div>
                        <span className="text-white font-bold">₹0.00</span>
                     </div>
                     <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/50">
                        <div className="flex items-center gap-3">
                           <Navigation className="text-blue-500 w-5 h-5" />
                           <span className="text-slate-400">Trips</span>
                        </div>
                        <span className="text-white font-bold">0</span>
                     </div>
                     <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/50">
                        <div className="flex items-center gap-3">
                           <Clock className="text-orange-500 w-5 h-5" />
                           <span className="text-slate-400">Hours</span>
                        </div>
                        <span className="text-white font-bold">0.0</span>
                     </div>
                  </div>
               </div>

               <div className="glass p-8 rounded-[2.5rem] bg-indigo-500/5 border-indigo-500/20">
                  <div className="flex items-center gap-3 mb-4">
                     <CheckCircle className="text-indigo-400 w-5 h-5" />
                     <h3 className="font-bold text-white">Top Rated Partner</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Maintaining a rating above 4.5 gives you priority access to high-fare rides.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
