import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, Car, TrendingUp, Search, CheckCircle2, XCircle, Clock, IndianRupee, FileText } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeRides: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [driversRes, statsRes] = await Promise.all([
        axios.get('/api/admin/pending-drivers'),
        axios.get('/api/admin/stats')
      ]);
      setDrivers(driversRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id) => {
    try {
      await axios.patch(`/api/admin/verify-driver/${id}`);
      setDrivers(drivers.filter(d => d._id !== id));
      alert('Driver verified successfully!');
    } catch (err) {
      alert('Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight">Admin <span className="text-blue-500">Command Center</span></h1>
              <p className="text-slate-400">Platform-wide overview and verification management.</p>
            </div>
            
            <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Logs
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
              { label: 'Active Rides', value: stats.activeRides, icon: Car, color: 'indigo' },
              { label: 'Total Revenue', value: '₹4.2L', icon: IndianRupee, color: 'green' },
              { label: 'Growth', value: '+18%', icon: TrendingUp, color: 'orange' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
              >
                <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 text-${stat.color}-500/10 group-hover:scale-110 transition-transform`} />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10 text-left">
            {/* Verification Table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShieldCheck className="text-blue-500" /> Pending Verifications
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input placeholder="Search drivers..." className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none w-64" />
                </div>
              </div>

              <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Driver Name</th>
                      <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Docs</th>
                      <th className="px-8 py-5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                      {drivers.length > 0 ? (
                        drivers.map((driver) => (
                          <motion.tr 
                            key={driver._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-white/[0.02] transition-colors group"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden">
                                   {driver.photos?.[0] ? <img src={driver.photos[0]} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-slate-600" />}
                                </div>
                                <div>
                                  <p className="text-white font-bold">{driver.name}</p>
                                  <p className="text-xs text-slate-500">{driver.license || 'No License'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <div className="flex justify-center gap-2">
                                  {driver.photos?.map((p, idx) => (
                                    <a key={idx} href={p} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-all">
                                       <FileText className="w-4 h-4 text-blue-400" />
                                    </a>
                                  ))}
                               </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleVerify(driver._id)}
                                  className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 hover:bg-green-500/20 transition-all"
                                >
                                  Verify
                                </button>
                                <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all">
                                  Reject
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-8 py-20 text-center text-slate-600 font-medium italic">
                             Great job! All drivers are verified.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Clock className="text-blue-500" /> Recent Activity
               </h2>
               <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-8">
                  {[
                    { type: 'booking', msg: 'New booking in Katraj', time: '2m ago' },
                    { type: 'verify', msg: 'Driver Arjun M. verified', time: '15m ago' },
                    { type: 'error', msg: 'Payment failed for Order #982', time: '1h ago' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="relative">
                          <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          {i !== 2 && <div className="absolute top-4 left-[3px] w-px h-full bg-slate-800" />}
                       </div>
                       <div>
                          <p className="text-sm text-white font-medium">{item.msg}</p>
                          <p className="text-xs text-slate-600 font-bold">{item.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
