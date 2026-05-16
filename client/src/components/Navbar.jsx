import React from 'react';
import { Link } from 'react-router-dom';
import { Car, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed w-full z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 premium-gradient rounded-xl animate-float">
              <Car className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Drive<span className="text-blue-400">Mate</span></span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link to="/book" className="text-slate-300 hover:text-white transition-colors">Book a Ride</Link>
            
            {localStorage.getItem('token') ? (
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-5 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 rounded-full border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all">Login</Link>
                <Link to="/register" className="px-5 py-2 rounded-full premium-gradient text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">Register</Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white p-2">
               <X className="w-8 h-8" />
            </button>
            <Link to="/" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white">Home</Link>
            <Link to="/book" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white">Book a Ride</Link>
            
            {localStorage.getItem('token') ? (
               <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="text-3xl font-bold text-red-400"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="px-12 py-4 text-2xl font-bold premium-gradient rounded-2xl text-white">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
