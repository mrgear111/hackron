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
        className="w-full fixed top-0 z-50"
      >
        {/* Cyberpunk-style background with noise texture */}
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm border-b border-cyan-500/30 overflow-hidden">
          {/* Animated grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          
          {/* Animated noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />

          {/* Glowing border with dual scan lines */}
          <div className="absolute inset-x-0 bottom-0">
            {/* Main border gradient */}
            <motion.div 
              className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(34,211,238,0.2)",
                  "0 0 20px rgba(34,211,238,0.6)",
                  "0 0 10px rgba(34,211,238,0.2)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Fast scan line */}
            <motion.div
              className="absolute bottom-0 h-[2px] w-[10%] bg-cyan-400/80"
              animate={{ 
                x: ["-100%", "1000%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Slow scan line */}
            <motion.div
              className="absolute bottom-0 h-[1px] w-[30%] bg-cyan-400/40"
              animate={{ 
                x: ["-100%", "400%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Vertical data streams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
                style={{ 
                  left: `${i * 3.33}%`,
                  height: '100%',
                  opacity: 0.1
                }}
                animate={{
                  y: ["-100%", "100%"],
                  opacity: [0, 0.2, 0]
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center gap-2">
                <motion.div className="relative">
                  {/* Main glowing background */}
                  <motion.div
                    className="absolute -inset-3 rounded opacity-75 blur-2xl"
                    animate={{
                      background: [
                        "radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)",
                        "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(34,211,238,0.3) 50%, transparent 70%)",
                      ],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className="relative flex items-center text-2xl font-bold font-mono">
                    {/* Terminal Prompt */}
                    <motion.div
                      animate={{
                        color: ["#22d3ee", "#3b82f6", "#22d3ee"],
                        textShadow: [
                          "0 0 10px rgba(34,211,238,0.7)",
                          "0 0 15px rgba(59,130,246,0.7)",
                          "0 0 10px rgba(34,211,238,0.7)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mr-1"
                    >
                      {">"}
                    </motion.div>

                    {/* HACKRON Text */}
                    <div className="relative">
                      {/* Main text with gradient */}
                      <motion.div
                        className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 relative z-10"
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(34,211,238,0.5)",
                            "0 0 20px rgba(59,130,246,0.5)",
                            "0 0 10px rgba(34,211,238,0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        HACKRON
                      </motion.div>

                      {/* Glitch Effect Layers */}
                      <motion.div
                        className="absolute inset-0 text-cyan-400/30"
                        animate={{
                          x: [0, -2, 0, 2, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 0.3,
                          repeat: Infinity,
                          repeatType: "reverse",
                          times: [0, 0.2, 0.4, 0.6, 1]
                        }}
                      >
                        HACKRON
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 text-blue-400/30"
                        animate={{
                          x: [0, 2, 0, -2, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 0.4,
                          repeat: Infinity,
                          repeatType: "reverse",
                          times: [0, 0.2, 0.4, 0.6, 1]
                        }}
                      >
                        HACKRON
                      </motion.div>
                    </div>

                    {/* Animated Cursor */}
                    <motion.div
                      className="ml-1 w-[3px] h-[24px] bg-cyan-400"
                      animate={{
                        opacity: [1, 0],
                        backgroundColor: ["#22d3ee", "#3b82f6"],
                        boxShadow: [
                          "0 0 10px rgba(34,211,238,0.7)",
                          "0 0 15px rgba(59,130,246,0.7)"
                        ]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>

                  {/* Decorative circuit lines */}
                  <div className="absolute -bottom-2 left-0 w-full">
                    <motion.div
                      className="h-[1px] w-full"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)"
                      }}
                      animate={{
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="h-[1px] w-[60%] mx-auto mt-1"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)"
                      }}
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        width: ["60%", "40%", "60%"]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
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

                {/* Problem Statements Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/problems"
                    className="relative group px-4 py-2 text-sm font-mono"
                  >
                    <span className="relative z-10 text-cyan-400">
                      {`> Problem_Statements`}
                    </span>
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

                {/* Final Rankings Button */}
                <Link
                  href="/leaderboard"
                  className="relative group px-4 py-2 text-sm font-mono hover:text-cyan-400 transition-colors duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{`> Shortlisted_Teams`}</span>
                  </span>
                  <motion.div
                    className="absolute inset-0 border border-cyan-500/30 rounded-md overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity"
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
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <motion.div
            className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyan-500/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              boxShadow: [
                "0 0 5px rgba(34,211,238,0.2)",
                "0 0 10px rgba(34,211,238,0.4)",
                "0 0 5px rgba(34,211,238,0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16">
          <motion.div
            className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyan-500/30"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* System status indicators */}
        <motion.div
          className="absolute top-2 right-20 font-mono text-[10px] text-cyan-500/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="mr-2">[sys.status: online]</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ●
          </motion.span>
        </motion.div>
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