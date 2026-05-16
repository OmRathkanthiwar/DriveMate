import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Camera, CheckCircle2, FileText, CreditCard, ShieldCheck, UserCircle, Hash } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const UploadBox = ({ label, icon: Icon, file, onUpload, id }) => {
  const inputRef = useRef(null);
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
      <input type="file" ref={inputRef} onChange={(e) => onUpload(id, e.target.files[0])} className="hidden" accept="image/*" />
      <div 
        onClick={() => inputRef.current.click()}
        className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-green-500/50 bg-green-500/5 text-green-400' : 'border-slate-800 text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-1 text-center">
            <CheckCircle2 className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold line-clamp-1 px-2">{file.name}</span>
          </div>
        ) : (
          <>
            <Icon className="w-5 h-5 mb-2" />
            <span className="text-[10px] font-bold uppercase">Upload</span>
          </>
        )}
      </div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    profilePhoto: null,
    addressProof: null,
    aadhaarCard: null,
    license: null,
    panCard: null
  });
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    address: '', aadhaar: '', license: '', pan: '',
    city: '', state: '', country: 'India'
  });

  const handleUpload = (id, file) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const isFormValid = () => {
    const basicInfo = formData.name && formData.email && formData.password && formData.phone && formData.city && formData.state && formData.country;
    if (role === 'customer') return basicInfo;
    return (
      basicInfo && formData.address && formData.aadhaar && formData.license && formData.pan &&
      files.profilePhoto && files.addressProof && files.aadhaarCard && 
      files.license && files.panCard
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('role', role);
      
      if (role === 'driver') {
        data.append('profilePhoto', files.profilePhoto);
        data.append('addressProof', files.addressProof);
        data.append('aadhaarCard', files.aadhaarCard);
        data.append('licenseFile', files.license);
        data.append('panCard', files.panCard);
      }

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
          className="max-w-6xl mx-auto glass rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-1/4 premium-gradient p-10 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8">DriveMate</h2>
            <div className="space-y-4">
              <button onClick={() => setRole('customer')} className={`w-full py-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'customer' ? 'bg-white text-blue-600 border-white shadow-xl' : 'border-white/30 text-white hover:bg-white/10'}`}>Customer</button>
              <button onClick={() => setRole('driver')} className={`w-full py-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'driver' ? 'bg-white text-blue-600 border-white shadow-xl' : 'border-white/30 text-white hover:bg-white/10'}`}>Driver</button>
            </div>
          </div>

          <div className="md:w-3/4 p-8 md:p-14 text-left">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Full Name</label>
                  <input name="name" required onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" placeholder="e.g. Sanket Magar" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email Address</label>
                  <input name="email" required type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" placeholder="sanket@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Secure Password</label>
                  <input name="password" required type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Phone Number</label>
                  <input name="phone" required onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" placeholder="9876543210" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">City</label>
                  <input name="city" required onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" placeholder="e.g. Pune" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">State</label>
                  <input name="state" required onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" placeholder="e.g. Maharashtra" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Country</label>
                  <input name="country" required defaultValue="India" onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all text-lg" />
                </div>
              </div>

              {role === 'driver' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center gap-4">
                     <div className="h-px bg-slate-800 flex-1" />
                     <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Driver Details & Documents</span>
                     <div className="h-px bg-slate-800 flex-1" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Full Residential Address</label>
                      <input name="address" required onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none text-lg" placeholder="123, Street Name, City, State" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">Aadhaar Number</label>
                      <input name="aadhaar" required onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none text-lg" placeholder="12-digit number" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">License Number</label>
                      <input name="license" required onChange={(e) => setFormData({...formData, license: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none text-lg" placeholder="DL-1234567890" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest">PAN Card Number</label>
                      <input name="pan" required onChange={(e) => setFormData({...formData, pan: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:border-blue-500 outline-none text-lg" placeholder="ABCDE1234F" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <UploadBox id="profilePhoto" label="Profile Photo" icon={UserCircle} file={files.profilePhoto} onUpload={handleUpload} />
                    <UploadBox id="addressProof" label="Address Proof" icon={MapPin} file={files.addressProof} onUpload={handleUpload} />
                    <UploadBox id="aadhaarCard" label="Aadhaar Card" icon={ShieldCheck} file={files.aadhaarCard} onUpload={handleUpload} />
                    <UploadBox id="license" label="Driving License" icon={FileText} file={files.license} onUpload={handleUpload} />
                    <UploadBox id="panCard" label="PAN Card" icon={CreditCard} file={files.panCard} onUpload={handleUpload} />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading || !isFormValid()} 
                  className="w-full py-5 rounded-2xl premium-gradient text-white font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-20 disabled:grayscale cursor-pointer active:scale-95"
                >
                  {loading 
                    ? (role === 'driver' ? 'Registering Driver...' : 'Creating Account...') 
                    : (role === 'driver' ? 'Complete Driver Registration' : 'Create Customer Account')
                  }
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
