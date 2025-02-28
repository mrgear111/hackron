'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ref, set } from 'firebase/database';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    teamName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        router.push('/team-dashboard');
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        const teamData = {
          teamName: formData.teamName,
          email: formData.email,
          createdAt: new Date().toISOString(),
        };
        
        const teamRef = ref(db, `teams/${userCredential.user.uid}`);
        await set(teamRef, teamData);
        
        router.push('/team-dashboard');
        onClose();
      }
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

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({
      teamName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[400px]"
            >
              <div className="relative bg-black/90 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-xl">
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div className="ml-2 text-sm text-gray-400 font-mono">
                      {`> ${isLoginMode ? 'Team_Login.exe' : 'Team_Registration.exe'}`}
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLoginMode && (
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
                          required={!isLoginMode}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none"></div>
                      </div>
                    </div>
                  )}

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

                  {!isLoginMode && (
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
                          required={!isLoginMode}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md pointer-events-none"></div>
                      </div>
                    </div>
                  )}

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
                      `> Initialize_${isLoginMode ? 'Login' : 'Registration'}`
                    )}
                  </motion.button>

                  {/* Register Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-gray-400 hover:text-cyan-400 font-mono text-sm transition-colors duration-300"
                    >
                      {isLoginMode ? 
                        `> New_Team? Register_Here` : 
                        `> Already_Registered? Login_Here`
                      }
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 