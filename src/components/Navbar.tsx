'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [teamName, setTeamName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch team name
        const teamRef = ref(db, `teams/${currentUser.uid}`);
        onValue(teamRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setTeamName(data.teamName);
          }
        });
      } else {
        setTeamName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full fixed top-0 z-50"
      >
        {/* Animated Border */}
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm border-b border-cyan-500/30">
          <div className="absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Text */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  className="text-2xl font-bold font-mono"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(0,255,255,0.5)",
                      "0 0 20px rgba(0,255,255,0.3)",
                      "0 0 10px rgba(0,255,255,0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <span className="text-cyan-400">&gt;</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    HACKRON_
                  </span>
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    |
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {/* Login/User Status */}
                <div className="flex items-center space-x-4">
                  {user ? (
                    <>
                      {/* User Status */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-gray-400 font-mono text-sm">
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-cyan-400"
                          >
                            ●
                          </motion.span>
                          {` ${teamName}_Connected`}
                        </span>
                      </motion.div>

                      {/* Dashboard Button */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="/team-dashboard"
                          className="relative group px-4 py-2 text-sm font-mono"
                        >
                          <span className="relative z-10 text-cyan-400">{`> Access_Dashboard`}</span>
                          <motion.div
                            className="absolute inset-0 border border-cyan-500/30 rounded-md"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(0,255,255,0.2)",
                                "0 0 20px rgba(0,255,255,0.1)",
                                "0 0 10px rgba(0,255,255,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </Link>
                      </motion.div>

                      {/* Logout Button */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          onClick={handleLogout}
                          className="relative group px-4 py-2 text-sm font-mono"
                        >
                          <span className="relative z-10 text-red-400">{`> Terminate_Session`}</span>
                          <motion.div
                            className="absolute inset-0 border border-red-500/30 rounded-md"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(255,0,0,0.2)",
                                "0 0 20px rgba(255,0,0,0.1)",
                                "0 0 10px rgba(255,0,0,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Login Button */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          onClick={() => setIsLoginModalOpen(true)}
                          className="relative group px-4 py-2 text-sm font-mono"
                        >
                          <span className="relative z-10 text-cyan-400">{`> Team_Login`}</span>
                          <motion.div
                            className="absolute inset-0 border border-cyan-500/30 rounded-md"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(0,255,255,0.2)",
                                "0 0 20px rgba(0,255,255,0.1)",
                                "0 0 10px rgba(0,255,255,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </button>
                      </motion.div>

                      {/* Admin Button - Only show when not logged in */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="/admin"
                          className="relative group px-4 py-2 text-sm font-mono"
                        >
                          <span className="relative z-10 text-purple-400">{`> Admin_Access`}</span>
                          <motion.div
                            className="absolute inset-0 border border-purple-500/30 rounded-md"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(147,51,234,0.2)",
                                "0 0 20px rgba(147,51,234,0.1)",
                                "0 0 10px rgba(147,51,234,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Line Effect */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />
      </motion.nav>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 