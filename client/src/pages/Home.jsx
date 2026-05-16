import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Shield, MapPin, CreditCard, Clock, UserCheck, Star } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-8 rounded-3xl transition-all hover:bg-white/15"
  >
    <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center mb-6">
      <Icon className="text-white w-7 h-7" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose <span className="text-gradient">DriveMate</span>?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We provide the most reliable driver rental service with a focus on safety, professionalism, and customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={UserCheck} 
              title="Verified Drivers" 
              description="Every driver undergoes rigorous background checks, document verification, and driving tests."
            />
            <FeatureCard 
              icon={Shield} 
              title="Safe & Secure" 
              description="OTP-based ride starts and real-time tracking ensure your journey is always safe."
            />
            <FeatureCard 
              icon={MapPin} 
              title="Radius Matching" 
              description="Our smart algorithm finds the best driver closest to your pickup location."
            />
            <FeatureCard 
              icon={CreditCard} 
              title="Flexible Payments" 
              description="Pay easily via Razorpay online or choose cash. Transparent pricing with no hidden costs."
            />
            <FeatureCard 
              icon={Clock} 
              title="24/7 Service" 
              description="Need a driver at midnight? We've got you covered with round-the-clock availability."
            />
            <FeatureCard 
              icon={Star} 
              title="Top Rated" 
              description="Review and rate your drivers. We maintain a high standard based on user feedback."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-24 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="glass p-8 rounded-3xl border-l-4 border-blue-500">
                <p className="text-slate-300 italic mb-6">"DriveMate has changed how I travel for long business trips. I can work in my own car while a professional handles the traffic."</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800" />
                    <div>
                        <p className="font-bold text-white">Rahul Sharma</p>
                        <p className="text-sm text-slate-500">Business Owner</p>
                    </div>
                </div>
             </div>
             <div className="glass p-8 rounded-3xl border-l-4 border-indigo-500">
                <p className="text-slate-300 italic mb-6">"The best part is the transparency. I knew the fare beforehand and the OTP system gave me peace of mind."</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800" />
                    <div>
                        <p className="font-bold text-white">Ananya Iyer</p>
                        <p className="text-sm text-slate-500">Frequent Traveler</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
            <p>© 2026 DriveMate. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
};

export default Home;
