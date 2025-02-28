'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    teamName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const teamData = {
        teamName: formData.teamName,
        email: formData.email,
        createdAt: new Date().toISOString(),
      };
      
      const teamRef = ref(db, `teams/${userCredential.user.uid}`);
      await set(teamRef, teamData);

      router.push('/login');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="relative bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-8">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-2 text-sm text-gray-400 font-mono">{`> Team_Registration.exe`}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name Input */}
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  {`> Team_Name:`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 text-gray-300 font-mono
                      focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="enter_team_name"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none"></div>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  {`> Email_Address:`}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 text-gray-300 font-mono
                      focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="enter_email"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none"></div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  {`> Password:`}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 text-gray-300 font-mono
                      focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="enter_password"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none"></div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  {`> Confirm_Password:`}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 text-gray-300 font-mono
                      focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="confirm_password"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 font-mono text-sm"
                >
                  {`> Error: ${error}`}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 
                  hover:from-cyan-500/30 hover:to-cyan-500/20
                  border border-cyan-500/30 rounded-md px-4 py-3 
                  text-cyan-400 font-mono text-sm
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >⟳</motion.span>
                    Processing...
                  </span>
                ) : (
                  `> Initialize_Registration`
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-gray-400 hover:text-cyan-400 font-mono text-sm transition-colors duration-300"
                >
                  {`> Already_Registered? Login_Here`}
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 