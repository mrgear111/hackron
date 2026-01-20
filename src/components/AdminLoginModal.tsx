'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ref, get, set } from 'firebase/database';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '', // For verification during registration
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const checkIsAdmin = async (email: string): Promise<boolean> => {
    const adminRef = ref(db, 'admins');
    const snapshot = await get(adminRef);
    if (snapshot.exists()) {
      const admins = snapshot.val();
      return Object.values(admins).includes(email);
    }
    return false;
  };

  const registerAdmin = async () => {
    // Verify admin key
    const adminKeyRef = ref(db, 'adminKey');
    try {
      const snapshot = await get(adminKeyRef);

      console.log('Admin key check:', {
        exists: snapshot.exists(),
        inputKey: formData.adminKey,
        dbKey: snapshot.val()
      });

      if (!snapshot.exists() || snapshot.val() !== formData.adminKey) {
        throw new Error('Invalid admin key');
      }
    } catch (error: any) {
      if (error.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Please contact the administrator.');
      }
      console.error('Admin registration error:', error);
      throw error;
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // Add to admins list
    const adminRef = ref(db, `admins/${userCredential.user.uid}`);
    await set(adminRef, formData.email);

    return userCredential;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        // First check if this email is registered as an admin
        const adminRef = ref(db, 'admins');
        const adminSnapshot = await get(adminRef);
        const adminEmails = adminSnapshot.exists() ? Object.values(adminSnapshot.val()) : [];
        const isAdmin = adminEmails.includes(formData.email);

        if (!isAdmin) {
          setError('This email is not registered as an admin. Please use team login if you are a team member.');
          setIsLoading(false);
          return;
        }

        // Try to sign in
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

          // Double check the specific admin entry
          const userAdminRef = ref(db, `admins/${userCredential.user.uid}`);
          const userAdminSnapshot = await get(userAdminRef);

          if (!userAdminSnapshot.exists()) {
            // Create the admin entry if it doesn't exist
            await set(userAdminRef, formData.email);
          }

          router.push('/admin-dashboard');
          onClose();
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential') {
            setError('Invalid email or password');
          } else if (error.code === 'auth/user-not-found') {
            setError('No account found with this email');
          } else if (error.code === 'auth/wrong-password') {
            setError('Incorrect password');
          } else {
            setError('Login failed. Please try again.');
          }
          if (auth.currentUser) {
            await auth.signOut();
          }
        }
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (!formData.adminKey) {
          throw new Error('Admin key is required');
        }

        await registerAdmin();
        router.push('/admin-dashboard');
        onClose();
      }
    } catch (error: any) {
      console.error('Admin auth error:', error);

      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please switch to login.');
      } else {
        setError(error.message || 'Authentication failed');
      }

      if (auth.currentUser) {
        await auth.signOut();
      }
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
      email: '',
      password: '',
      confirmPassword: '',
      adminKey: '',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 w-full max-w-md relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 
                  transition-colors duration-200 group"
              >
                <div className="relative">
                  <span className="text-2xl font-mono">&times;</span>
                  <motion.div
                    className="absolute -inset-2 border border-cyan-500/0 rounded-full 
                      group-hover:border-cyan-500/50"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </button>

              <div className="space-y-6">
                <h2 className="text-2xl font-mono text-cyan-400">
                  {isLoginMode ? `> Admin_Login` : `> Admin_Registration`}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-cyan-400 font-mono text-sm mb-2">
                      {`> Email:`}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono focus:outline-none focus:border-cyan-500/50 
                          focus:ring-1 focus:ring-cyan-500/50"
                        placeholder="admin@example.com"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 
                        to-purple-500/10 rounded-md pointer-events-none" />
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
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono focus:outline-none focus:border-cyan-500/50 
                          focus:ring-1 focus:ring-cyan-500/50"
                        placeholder="••••••••"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 
                        to-purple-500/10 rounded-md pointer-events-none" />
                    </div>
                  </div>

                  {/* Confirm Password - Only show in registration mode */}
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
                          className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                            text-gray-100 font-mono focus:outline-none focus:border-cyan-500/50 
                            focus:ring-1 focus:ring-cyan-500/50"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Admin Key - Only show in registration mode */}
                  {!isLoginMode && (
                    <div>
                      <label className="block text-cyan-400 font-mono text-sm mb-2">
                        {`> Admin_Key:`}
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="adminKey"
                          value={formData.adminKey}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                            text-gray-100 font-mono focus:outline-none focus:border-cyan-500/50 
                            focus:ring-1 focus:ring-cyan-500/50"
                          placeholder="Enter admin key"
                          required
                        />
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
                      hover:from-cyan-500/30 hover:to-cyan-500/20 border border-cyan-500/30 
                      rounded-md px-4 py-3 text-cyan-400 font-mono text-sm
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                      isLoginMode ? `> Initialize_Admin_Login` : `> Register_Admin_Access`
                    )}
                  </motion.button>

                  {/* Toggle Mode Button */}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="w-full text-center text-cyan-400/70 hover:text-cyan-400 
                      font-mono text-sm mt-4 transition-colors"
                  >
                    {isLoginMode ?
                      '> Switch_to_Registration' :
                      '> Switch_to_Login'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 