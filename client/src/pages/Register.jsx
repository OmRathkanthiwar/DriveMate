import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Camera, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [role, setRole] = useState('customer');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    aadhaar: '', license: '', pan: '', city: '', state: '', country: 'India'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use FormData for file uploads
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('role', role);
      if (file) data.append('photo', file);

      await axios.post('/api/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-1/3 premium-gradient p-12 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Join DriveMate</h2>
            <div className="space-y-4">
              <button onClick={() => setRole('customer')} className={`w-full py-4 rounded-2xl border-2 transition-all font-bold ${role === 'customer' ? 'bg-white text-blue-600 border-white' : 'border-white/30 text-white'}`}>I'm a Customer</button>
              <button onClick={() => setRole('driver')} className={`w-full py-4 rounded-2xl border-2 transition-all font-bold ${role === 'driver' ? 'bg-white text-blue-600 border-white' : 'border-white/30 text-white'}`}>I'm a Driver</button>
            </div>
          </div>

          <div className="md:w-2/3 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase">Full Name</label>
                  <input name="name" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase">Email</label>
                  <input name="email" type="email" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase">Password</label>
                  <input name="password" type="password" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase">Phone</label>
                  <input name="phone" required onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              {role === 'driver' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid md:grid-cols-3 gap-4">
                    <input name="aadhaar" placeholder="Aadhaar No" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                    <input name="license" placeholder="License No" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                    <input name="pan" placeholder="PAN Card" onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" />
                  </div>
                  
                  {/* REAL UPLOAD BUTTON */}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="p-8 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
                  >
                    {file ? (
                      <div className="flex items-center gap-2 text-blue-400 font-bold">
                        <CheckCircle2 /> {file.name}
                      </div>
                    ) : (
                      <>
                        <Camera className="mb-2" />
                        <span className="text-sm font-bold">Click to Upload License/Photo</span>
                        <span className="text-xs opacity-50 uppercase">JPG, PNG only</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Create My Account'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
