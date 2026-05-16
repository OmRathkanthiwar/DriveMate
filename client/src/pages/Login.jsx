import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'driver') navigate('/driver/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass p-8 md:p-12 rounded-3xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Login to manage your rides and profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                <input 
                  type="email" 
                  required 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 text-white focus:border-blue-500 outline-none transition-all" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <Link to="#" className="text-xs text-blue-400 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                <input 
                  type="password" 
                  required 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 text-white focus:border-blue-500 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 rounded-xl premium-gradient text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-blue-500/30 transition-all">
              <LogIn className="w-5 h-5" /> Login to Account
            </button>

            <p className="text-center text-slate-500">
              Don't have an account? <Link to="/register" className="text-blue-400 hover:underline font-medium">Sign up for free</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
