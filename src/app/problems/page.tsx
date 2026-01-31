'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, onValue } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { FaLightbulb, FaLock, FaTimes, FaExclamationCircle, FaArrowRight, FaUsers } from 'react-icons/fa';

import { problemStatements } from '@/lib/problemStatements';

export default function Problems() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProblemsVisible, setIsProblemsVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<typeof problemStatements[0] | null>(null);
  const [problemCounts, setProblemCounts] = useState<Record<number, number>>({});
  const [configError, setConfigError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Safety check for Firebase initialization
    if (!auth || !db) {
      console.error("Firebase not initialized");
      setConfigError(true);
      setLoading(false);
      return;
    }

    // Listen to problem visibility setting
    try {
      const settingsRef = ref(db, 'admin/settings/problemsVisible');
      const unsubSettings = onValue(settingsRef, (snapshot) => {
        setIsProblemsVisible(snapshot.val() || false);
      }, (error) => {
        console.error("Error fetching settings:", error);
      });

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.log("No user found");
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        // Don't set loading to false yet, wait for admin check

        try {
          const adminRef = ref(db, `admins/${user.uid}`);
          const adminSnapshot = await get(adminRef);

          if (adminSnapshot.exists()) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        } finally {
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
        unsubSettings();
      };
    } catch (error) {
      console.error("Error setting up listeners:", error);
      setConfigError(true);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!db) return;

    // Fetch counts for all authenticated users from public node
    const selectionsRef = ref(db, 'problem_selections');
    const unsubscribe = onValue(selectionsRef, (snapshot) => {
      const data = snapshot.val();

      const counts: Record<number, number> = {};
      // Initialize counts
      problemStatements.forEach(p => counts[p.id] = 0);

      if (data) {
        Object.values(data).forEach((submissionTitle: any) => {
          if (typeof submissionTitle === 'string') {
            // The value is just the title string now
            const matchedProblem = problemStatements.find(p =>
              p.title === submissionTitle
            );

            if (matchedProblem) {
              counts[matchedProblem.id] = (counts[matchedProblem.id] || 0) + 1;
            }
          }
        });
      }

      setProblemCounts(counts);
    }, (error) => {
      console.error("Error fetching team counts:", error);
    });

    return () => unsubscribe();
  }, []); // Run once on mount

  // View for configuration error
  if (configError) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 p-12 rounded-xl border border-red-500/50 backdrop-blur-sm"
          >
            <FaExclamationCircle className="text-6xl text-red-500 mb-6 mx-auto" />
            <h1 className="text-3xl font-bold text-red-400 mb-4">{`> SYSTEM_ERROR`}</h1>
            <p className="text-gray-400 text-xl max-w-lg mx-auto">
              Database configuration missing. Please report this to the administrators.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // View for unauthenticated users
  if (!loading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 p-12 rounded-xl border border-gray-800 backdrop-blur-sm"
          >
            <FaLock className="text-6xl text-cyan-600 mb-6 mx-auto" />
            <h1 className="text-3xl font-bold text-cyan-400 mb-4">{`> ACCESS_RESTRICTED`}</h1>
            <p className="text-gray-500 text-xl max-w-lg mx-auto mb-8">
              You must be logged in to view problem statements.
            </p>
            <div className="text-sm text-gray-600">
              {`> Please use the Team Login button in the navbar.`}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // View for when problems are locked/hidden
  if (!loading && !isProblemsVisible && !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 p-12 rounded-xl border border-gray-800 backdrop-blur-sm"
          >
            <FaLock className="text-6xl text-gray-600 mb-6 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-400 mb-4">{`> ACCESS_DENIED`}</h1>
            <p className="text-gray-500 text-xl max-w-lg mx-auto">
              Problem statements are currently encrypted and hidden by the administrators.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <span className="animate-pulse text-purple-500">_</span>
              <span className="animate-pulse delay-75 text-cyan-500">_</span>
              <span className="animate-pulse delay-150 text-emerald-500">_</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-cyan-400 text-4xl mb-4"
          >
            <FaLock />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-400 font-mono"
          >
            Verifying_Clearance...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-cyan-500/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/10 to-cyan-900/10 
            backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FaLightbulb size={120} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center gap-3">
                  Problem Statements
                </h1>
                <p className="mt-2 text-gray-400 max-w-2xl text-lg">
                  Select a challenge to solve. Analyze the requirements carefully and choose the one that best fits your team's expertise.
                </p>
              </div>
            </div>
          </div>

          {/* List of Cards */}
          <div className="space-y-4">
            {problemStatements.map((problem, index) => {
              const count = problemCounts[problem.id] || 0;
              const isFull = count >= 11;

              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProblem(problem)}
                  className="group relative rounded-xl transition-all duration-300 border bg-white/5 border-white/10 hover:border-cyan-500/30 hover:bg-white/10 cursor-pointer p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold font-mono bg-white/10 text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                      {problem.id}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                        {problem.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 font-mono text-sm">
                        <span className="text-gray-500">{problem.domain}</span>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs
                          ${isFull
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          }`}
                        >
                          <FaUsers size={12} />
                          {isFull ? 'FULL' : `${count}/11`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-600 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedProblem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProblem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-black border border-cyan-500/30 rounded-2xl w-full max-w-2xl overflow-hidden pointer-events-auto shadow-2xl shadow-cyan-900/20"
              >
                {/* Modal Header */}
                <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-cyan-900/10 relative">
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/40 rounded-full hover:bg-black/60 transition-colors"
                  >
                    <FaTimes />
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
                      Problem #{selectedProblem.id}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
                      {selectedProblem.domain}
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-xs font-mono
                      ${(problemCounts[selectedProblem.id] || 0) >= 11
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                      }`}
                    >
                      {(problemCounts[selectedProblem.id] || 0) >= 11
                        ? 'Selection Full'
                        : `${11 - (problemCounts[selectedProblem.id] || 0)} slots remaining`
                      }
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-4">{selectedProblem.title}</h2>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                    <h4 className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <FaExclamationCircle className="text-cyan-400" />
                      Description
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {selectedProblem.fullDescription || selectedProblem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}