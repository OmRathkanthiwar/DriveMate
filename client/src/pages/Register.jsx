import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Camera, CheckCircle2, FileText, CreditCard, ShieldCheck } from 'lucide-react';
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
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-[10px] font-bold truncate max-w-[100px]">{file.name}</span>
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
    addressProof: null,
    aadhaarCard: null,
    license: null,
    panCard: null
  });
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    aadhaarNo: '', licenseNo: '', panNo: '', city: '', state: '', country: 'India'
  });

  const handleUpload = (id, file) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const isFormValid = () => {
    if (role === 'customer') return formData.name && formData.email && formData.password && formData.phone;
    return (
      formData.name && formData.email && formData.password && formData.phone &&
      files.addressProof && files.aadhaarCard && files.license && files.panCard
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
          className="max-w-5xl mx-auto glass rounded-3xl overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-1/4 premium-gradient p-10 text-white flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">DriveMate</h2>
            <div className="space-y-4">
              <button onClick={() => setRole('customer')} className={`w-full py-4 rounded-xl border-2 transition-all font-bold text-sm ${role === 'customer' ? 'bg-white text-blue-600 border-white' : 'border-white/30 text-white'}`}>Customer</button>
              <button onClick={() => setRole('driver')} className={`w-full py-4 rounded-xl border-2 transition-all font-bold text-sm ${role === 'driver' ? 'bg-white text-blue-600 border-white' : 'border-white/30 text-white'}`}>Driver</button>
            </div>
          </div>

          <div className="md:w-3/4 p-8 md:p-12 text-left">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Name</label>
                  <input name="name" required onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Email</label>
                  <input name="email" required type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Password</label>
                  <input name="password" required type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Phone</label>
                  <input name="phone" required onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                </div>
              </div>

              {role === 'driver' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="h-px bg-slate-800 w-full" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <UploadBox id="addressProof" label="Address Proof" icon={MapPin} file={files.addressProof} onUpload={handleUpload} />
                    <UploadBox id="aadhaarCard" label="Aadhaar Card" icon={ShieldCheck} file={files.aadhaarCard} onUpload={handleUpload} />
                    <UploadBox id="license" label="Driving License" icon={FileText} file={files.license} onUpload={handleUpload} />
                    <UploadBox id="panCard" label="PAN Card" icon={CreditCard} file={files.panCard} onUpload={handleUpload} />
                  </div>
                  <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                    <p className="text-xs text-blue-300">All 4 documents are mandatory for driver verification.</p>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !isFormValid()} 
                className="w-full py-4 rounded-2xl premium-gradient text-white font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-30 disabled:grayscale cursor-pointer"
              >
                {loading ? 'Verifying Documents...' : 'Create Verified Account'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
