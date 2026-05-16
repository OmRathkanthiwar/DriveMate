import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Car, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-12 transition-transform">
            <Car className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">DriveMate</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">Home</Link>
          <Link to="/book" className="text-slate-300 hover:text-white font-medium transition-colors">Book a Ride</Link>
        </div>

        {/* Right Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-6">
              <Link to={localStorage.getItem('role') === 'driver' ? '/driver/dashboard' : '/customer/dashboard'} className="text-blue-400 font-bold hover:text-blue-300 transition-colors text-sm">My Dashboard</Link>
              <div className="flex items-center gap-2 text-slate-300">
                 <UserIcon className="w-4 h-4 text-blue-400" />
                 <span className="text-sm font-bold truncate max-w-[100px]">{userName || 'User'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white font-bold transition-colors">Login</Link>
              <Link to="/register" className="px-6 py-2 rounded-full premium-gradient text-white font-bold hover:shadow-lg transition-all">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)} className="text-white p-2">
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-slate-950 z-[60] flex flex-col p-10 space-y-10"
          >
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-white">Menu</span>
              <button onClick={() => setIsOpen(false)} className="text-white p-2 bg-white/5 rounded-2xl">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <Link to="/" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-white">Home</Link>
            <Link to="/book" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-white">Book a Ride</Link>
            
            {token && (
               <Link to={localStorage.getItem('role') === 'driver' ? '/driver/dashboard' : '/customer/dashboard'} onClick={() => setIsOpen(false)} className="text-4xl font-bold text-blue-400">My Dashboard</Link>
            )}
            
            <div className="h-px bg-slate-900 w-full" />
            
            {token ? (
              <button onClick={handleLogout} className="text-4xl font-bold text-red-400 text-left">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-white">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="py-6 text-3xl font-bold premium-gradient rounded-[2rem] text-center text-white">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
