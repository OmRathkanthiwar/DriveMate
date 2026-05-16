import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, FileText, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    contactNo: '', // for driver
    address: '',
    aadhaar: '',
    license: '',
    pan: '',
    city: '',
    state: '',
    country: 'India'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { role, ...formData };
      if (role === 'driver') {
         payload.contactNo = formData.phone; // map for consistency
      }
      await axios.post('/api/auth/register', payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left side - Info */}
          <div className="md:w-1/3 premium-gradient p-12 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Join DriveMate</h2>
            <p className="opacity-80 mb-8">Choose your role and start your journey with India's most trusted driver network.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setRole('customer')}
                className={`w-full py-4 rounded-2xl border-2 transition-all font-bold ${role === 'customer' ? 'bg-white text-blue-600 border-white' : 'border-white/30 text-white hover:bg-white/10'}`}
              >
                I'm a Customer
              </button>
              <button 
                onClick={() => setRole('driver')}
                className={`w-full py-4 rounded-2xl border-2 transition-all font-bold ${role === 'driver' ? 'bg-white text-blue-600 border-white' : 'border-white/30 text-white hover:bg-white/10'}`}
              >
                I'm a Driver
              </button>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-2/3 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                    <input name="name" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                    <input name="email" type="email" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                    <input name="password" type="password" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none" placeholder="••••••••" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                    <input name="phone" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none" placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              {role === 'customer' ? (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">City</label>
                    <input name="city" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">State</label>
                    <input name="state" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Country</label>
                    <input name="country" defaultValue="India" readOnly className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-400 outline-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Full Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-500 h-5 w-5" />
                      <textarea name="address" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 text-white focus:border-blue-500 outline-none min-h-[100px]" placeholder="123 Street, Area, City..." />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Aadhaar Number</label>
                      <input name="aadhaar" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none" placeholder="1234 5678 9012" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">License Number</label>
                      <input name="license" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none" placeholder="DL-1234567890" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">PAN Card</label>
                      <input name="pan" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none" placeholder="ABCDE1234F" />
                    </div>
                  </div>
                  <div className="p-4 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer">
                    <Camera className="mb-2" />
                    <span className="text-sm">Upload Profile Photo & Documents</span>
                    <span className="text-xs opacity-50">JPG, PNG up to 5MB</span>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg hover:shadow-2xl transition-all">
                Create My Account
              </button>

              <p className="text-center text-slate-500">
                Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
