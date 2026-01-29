'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import AdminLoginModal from './AdminLoginModal';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { FaTrophy } from 'react-icons/fa';

const Navbar = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [teamName, setTeamName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLeaderboardLock, setShowLeaderboardLock] = useState(false);

  const shortlistedTeams = [
    { name: "Humorous", badge: "🏆" },
    { name: "Hack O' Giants", badge: "🚀" },
    { name: "Coding Knights", badge: "⭐" },
    { name: "402", badge: "✨" },
    { name: "Red Renegades", badge: "💫" },
    { name: "Int main", badge: "🧠" },
    { name: "The Neural Network", badge: "🎯" },
    { name: "Fantastic Four", badge: "🌟" },
    { name: "Pixel_Perfect", badge: "💻" },
    { name: "codemonk", badge: "⚡" },
    { name: "Skittles", badge: "🌈" },
    { name: "JHC hub", badge: "🎨" },
    { name: "Senorita", badge: "🔮" },
    { name: "Techies", badge: "💡" },
    { name: "8 bit", badge: "🎮" },
    { name: "localhost:8080", badge: "🌐" }
  ];

  useEffect(() => {
    let teamListener: (() => void) | null = null;

    if (!auth) return;

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
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="w-full fixed top-[30px] z-50 px-4"
      >
        {/* Pill-shaped container with frosted glass effect */}
        <div className="max-w-6xl mx-auto relative">
          {/* Glass background with blur */}
          <div className="absolute inset-0 bg-tekron-purple-deep/20 backdrop-blur-md rounded-full border border-tekron-pink-neon/20 overflow-hidden">

            {/* Animated grid background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

            {/* Animated noise overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />

            {/* Glowing border effect */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "inset 0 0 20px rgba(255,0,110,0.1), 0 0 30px rgba(255,0,110,0.1)",
                    "inset 0 0 30px rgba(255,0,110,0.2), 0 0 40px rgba(255,0,110,0.2)",
                    "inset 0 0 20px rgba(255,0,110,0.1), 0 0 30px rgba(255,0,110,0.1)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-tekron-purple-deep/10 via-transparent to-tekron-pink-neon/10 rounded-full" />
          </div>

          {/* Main content */}
          <div className="relative flex items-center justify-between h-16 px-6">
            {/* Enhanced Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="relative">
                  {/* HACKRON Text */}
                  <div className="relative flex items-center">
                    {/* Terminal Prompt - Subtle */}
                    <motion.span
                      className="text-tekron-pink-neon/80 font-pixel text-xl mr-2"
                      animate={{
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      &gt;
                    </motion.span>

                    {/* Main HACKRON Text */}
                    <div className="relative">
                      {/* Base text with solid color and glow */}
                      <h1
                        className="text-2xl font-bold font-pixel tracking-wide text-tekron-pink-neon"
                        style={{
                          textShadow: '0 0 20px rgba(255, 0, 110, 0.5), 0 0 40px rgba(255, 0, 110, 0.3)'
                        }}
                      >
                        HACKRON
                      </h1>

                      {/* Occasional subtle glitch - only triggers sometimes */}
                      <motion.div
                        className="absolute inset-0 text-2xl font-bold font-pixel tracking-wide text-cyan-400/50"
                        animate={{
                          x: [0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
                          opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0]
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        HACKRON
                      </motion.div>
                    </div>

                    {/* Blinking cursor */}
                    <motion.div
                      className="ml-2 w-[2px] h-5 bg-tekron-pink-neon"
                      animate={{
                        opacity: [1, 1, 0, 0]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>

                  {/* Subtle underline accent */}
                  <motion.div
                    className="h-[1px] mt-1 bg-gradient-to-r from-transparent via-tekron-pink-neon/40 to-transparent"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scaleX: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
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
                            className={`${isAdmin ? 'text-tekron-pink-neon' : 'text-tekron-purple-accent'}`}
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
                            className={`absolute inset-0 border ${isAdmin ? 'border-purple-500/30' : 'border-cyan-500/30'
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
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                      >
                        <button
                          onClick={() => setIsLoginModalOpen(true)}
                          className="relative px-4 py-2 font-mono text-sm group"
                        >
                          <span className="relative z-10 text-cyan-400 group-hover:text-cyan-300">
                            {`> Team_Login`}
                          </span>

                          {/* Animated border */}
                          <motion.div
                            className="absolute inset-0 border border-cyan-500/30 rounded-md"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(34,211,238,0.2)",
                                "0 0 20px rgba(34,211,238,0.1)",
                                "0 0 10px rgba(34,211,238,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />

                          {/* Scan line effect */}
                          <motion.div
                            className="absolute bottom-0 left-0 h-[1px] bg-cyan-400/50"
                            animate={{
                              width: ["0%", "100%", "0%"],
                              x: ["0%", "0%", "100%"],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />

                          {/* Hover effect background */}
                          <motion.div
                            className="absolute inset-0 bg-cyan-400/0 rounded-md -z-10"
                            whileHover={{
                              backgroundColor: "rgba(34,211,238,0.1)",
                              transition: { duration: 0.2 }
                            }}
                          />

                          {/* Corner decorations */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400/30" />
                          <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-400/30" />
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-400/30" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-400/30" />
                        </button>

                        {/* Glitch effect on hover */}
                        <motion.div
                          className="absolute -inset-[2px] bg-cyan-400/20 rounded-md opacity-0 group-hover:opacity-100 blur-lg transition-opacity"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>

                      {/* Admin Button - Only show when not logged in */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                      >
                        <button
                          onClick={() => setIsAdminModalOpen(true)}
                          className="relative px-4 py-2 font-mono text-sm group"
                        >
                          <span className="relative z-10 text-purple-400 group-hover:text-purple-300">
                            {`> Admin_Login`}
                          </span>

                          {/* Animated border */}
                          <motion.div
                            className="absolute inset-0 border border-purple-500/30 rounded-md"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(168,85,247,0.2)",
                                "0 0 20px rgba(168,85,247,0.1)",
                                "0 0 10px rgba(168,85,247,0.2)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />

                          {/* Scan line effect */}
                          <motion.div
                            className="absolute bottom-0 left-0 h-[1px] bg-purple-400/50"
                            animate={{
                              width: ["0%", "100%", "0%"],
                              x: ["0%", "0%", "100%"],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />

                          {/* Hover effect background */}
                          <motion.div
                            className="absolute inset-0 bg-purple-400/0 rounded-md -z-10"
                            whileHover={{
                              backgroundColor: "rgba(168,85,247,0.1)",
                              transition: { duration: 0.2 }
                            }}
                          />

                          {/* Corner decorations */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-purple-400/30" />
                          <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-purple-400/30" />
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-purple-400/30" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-purple-400/30" />
                        </button>

                        {/* Glitch effect on hover */}
                        <motion.div
                          className="absolute -inset-[2px] bg-purple-400/20 rounded-md opacity-0 group-hover:opacity-100 blur-lg transition-opacity"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                    </>
                  )}
                </div>


              </div>
            </div>
          </div>
        </div>
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
