import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Users, Car, CheckCircle, AlertTriangle, IndianRupee, TrendingUp, Search, Filter } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-8 opacity-10 ${color}`}>
       <Icon className="w-20 h-20" />
    </div>
    <div className="relative z-10">
       <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
       <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const pendingDrivers = [
    { name: 'Sameer Khan', license: 'MH-12-2023-000456', status: 'pending' },
    { name: 'Priya Verma', license: 'MH-01-2022-000987', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin <span className="text-gradient">Command Center</span></h1>
              <p className="text-slate-400">Platform-wide overview and verification management.</p>
            </div>
            <div className="flex gap-4">
               <div className="glass p-2 rounded-2xl flex gap-1">
                  <button className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm">Dashboard</button>
                  <button className="px-4 py-2 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-bold">Logs</button>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <StatCard title="Total Users" value="1,248" icon={Users} color="text-blue-500" />
             <StatCard title="Active Rides" value="42" icon={Car} color="text-indigo-500" />
             <StatCard title="Total Revenue" value="₹4.2L" icon={IndianRupee} color="text-green-500" />
             <StatCard title="Growth" value="+18%" icon={TrendingUp} color="text-orange-500" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
             {/* Driver Verification Table */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <AlertTriangle className="text-orange-400" /> Pending Verifications
                   </h2>
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input placeholder="Search drivers..." className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 outline-none w-64" />
                   </div>
                </div>

                <div className="glass rounded-[2rem] overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5">
                         <tr>
                            <th className="p-6 text-slate-500 text-xs font-bold uppercase tracking-widest">Driver Name</th>
                            <th className="p-6 text-slate-500 text-xs font-bold uppercase tracking-widest">License No</th>
                            <th className="p-6 text-slate-500 text-xs font-bold uppercase tracking-widest">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {pendingDrivers.map((driver, idx) => (
                           <tr key={idx} className="hover:bg-white/5 transition-colors group">
                              <td className="p-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                                       <Users className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">{driver.name}</span>
                                 </div>
                              </td>
                              <td className="p-6 font-mono text-slate-400 text-sm">{driver.license}</td>
                              <td className="p-6">
                                 <div className="flex gap-2">
                                    <button className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-bold hover:bg-green-500/20 transition-all">Verify</button>
                                    <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all">Reject</button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Recent Activity */}
             <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <TrendingUp className="text-blue-400" /> Recent Activity
                </h2>
                <div className="glass p-8 rounded-[2rem] space-y-8 relative">
                   <div className="absolute left-[2.5rem] top-12 bottom-12 w-px bg-slate-800" />
                   
                   {[
                     { time: '2m ago', msg: 'New booking in Powai', type: 'ride' },
                     { time: '15m ago', msg: 'Driver Arjun M. verified', type: 'driver' },
                     { time: '1h ago', msg: 'Payment failed for Order #982', type: 'payment' },
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-6 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                           <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <div>
                           <p className="text-white text-sm font-medium">{item.msg}</p>
                           <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="glass p-6 rounded-3xl bg-orange-500/5 border-orange-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-orange-400 w-4 h-4" />
                      <p className="text-sm text-orange-400 font-bold">System Warning</p>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed">Server load is slightly higher than usual. Auto-scaling is active.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
