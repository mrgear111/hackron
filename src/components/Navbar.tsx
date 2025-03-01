'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import AdminLoginModal from './AdminLoginModal';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get } from 'firebase/database';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [teamName, setTeamName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let teamListener: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setTeamName('');
        setIsAdmin(false);
        return;
      }

      setUser(currentUser);

      // Check if user is admin
      const adminRef = ref(db, `admins/${currentUser.uid}`);
      const adminSnapshot = await get(adminRef);
      const isAdminUser = adminSnapshot.exists();
      setIsAdmin(isAdminUser);

      // Clean up previous listener if exists
      if (teamListener) {
        teamListener();
      }

      // Only set up team listener if not an admin
      if (!isAdminUser) {
        const teamRef = ref(db, `teams/${currentUser.uid}`);
        teamListener = onValue(teamRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setTeamName(data.teamName);
          } else {
            // If no team data found, sign out
            auth.signOut();
            router.push('/');
          }
        });
      }
    });

    return () => {
      unsubscribe();
      if (teamListener) {
        teamListener();
      }
    };
  }, [router]);

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
                      {/* User Status - Updated to show different status for admin */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-gray-400 font-mono text-sm">
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className={`${isAdmin ? 'text-purple-400' : 'text-cyan-400'}`}
                          >
                            ●
                          </motion.span>
                          {isAdmin ? (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="inline-flex items-center gap-2"
                            >
                              <span className="text-purple-400">{`_Connected`}</span>
                              <motion.span
                                animate={{ 
                                  textShadow: [
                                    "0 0 8px rgba(168, 85, 247, 0.4)",
                                    "0 0 12px rgba(168, 85, 247, 0.2)",
                                    "0 0 8px rgba(168, 85, 247, 0.4)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-purple-400"
                              >
                                [ADMIN]
                              </motion.span>
                            </motion.span>
                          ) : (
                            ` ${teamName}_Connected`
                          )}
                        </span>
                      </motion.div>

                      {/* Dashboard Button */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href={isAdmin ? "/admin-dashboard" : "/team-dashboard"}
                          className="relative group px-4 py-2 text-sm font-mono"
                        >
                          <span className="relative z-10 text-cyan-400">
                            {isAdmin ? (
                              <span className="text-purple-400">{`> Admin_Dashboard`}</span>
                            ) : (
                              `> Team_Dashboard`
                            )}
                          </span>
                          <motion.div
                            className={`absolute inset-0 border ${
                              isAdmin ? 'border-purple-500/30' : 'border-cyan-500/30'
                            } rounded-md`}
                            animate={{
                              boxShadow: [
                                `0 0 10px ${isAdmin ? 'rgba(168,85,247,0.2)' : 'rgba(0,255,255,0.2)'}`,
                                `0 0 20px ${isAdmin ? 'rgba(168,85,247,0.1)' : 'rgba(0,255,255,0.1)'}`,
                                `0 0 10px ${isAdmin ? 'rgba(168,85,247,0.2)' : 'rgba(0,255,255,0.2)'}`,
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
                        <button
                          onClick={() => setIsAdminModalOpen(true)}
                          className="text-gray-400 hover:text-cyan-400 font-mono text-sm transition-colors"
                        >
                          {`> Admin_Login`}
                        </button>
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
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </>
  );
};

export default Navbar; 