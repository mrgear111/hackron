'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/team-dashboard'); // Changed from '/' to '/team-dashboard'
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
              <div className="ml-2 text-sm text-gray-400 font-mono">{`> Team_Login.exe`}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  {`> Email_Address:`}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 text-gray-300 font-mono
                      focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="enter_password"
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
                  `> Initialize_Login`
                )}
              </motion.button>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  href="/register" 
                  className="text-gray-400 hover:text-cyan-400 font-mono text-sm transition-colors duration-300"
                >
                  {`> New_Team? Register_Here`}
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 