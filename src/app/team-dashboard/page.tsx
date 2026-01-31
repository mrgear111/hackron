'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FaLink, FaFileAlt, FaCode, FaVideo, FaClipboardList, FaUser, FaClipboardCheck, FaGithub, FaCheckCircle, FaBell, FaTimes, FaUserFriends, FaRocket, FaLightbulb, FaLock, FaBook } from 'react-icons/fa';

interface TeamData {
  teamName: string;
  email: string;
  createdAt?: string;
  members?: any[];
  githubUrl?: string;
  submissionUrl?: string;
  githubRepo?: GitHubRepo;
  projectSubmission?: ProjectSubmission;
}

interface ProjectSubmission {
  projectName?: string;
  description?: string;
  techStack?: string;
  liveUrl?: string;
  liveDemo?: string;
  demoVideoUrl?: string;
  presentationUrl?: string;
  codeRepository?: string;
  problemStatement?: string;
  solution?: string;
  documentation?: string;
  challenges?: string;
  learnings?: string;
}

interface GitHubRepo {
  repoUrl: string;
  lastUpdated: string;
}

const problemStatements = [
  "City-Wide Dark Store Network Projection: Develop a system for analyzing and projecting the expansion of dark stores across a city. It may involve demand forecasting, geographical analysis, and optimal placement for maximum efficiency and customer reach.",

  "Smart Inventory Theft Detection System: A system that uses AI, IoT, and data analytics to detect theft in inventory management. It could involve real-time monitoring, anomaly detection, and alert mechanisms to prevent unauthorized access or theft.",

  "Smart Dynamic Pricing System: Create a pricing system that adjusts product prices dynamically based on various factors like demand, stock levels, competitor pricing, and customer behavior, potentially using AI or machine learning for optimization.",

  "Dark Store Management Platform: Design a comprehensive platform for managing dark stores, which includes inventory tracking, order management, staff coordination, and logistical planning. It should streamline operations for better efficiency.",

  "Real-Time Inventory Auditing System: Build a system that allows for continuous, real-time auditing of inventory levels in warehouses or stores, minimizing the need for manual stock-taking and improving accuracy in inventory data.",

  "Expiry-Based Dynamic Discount System: A system that automatically applies dynamic discounts to products nearing their expiration date, encouraging sales while reducing waste. It could integrate with inventory systems to monitor expiration and adjust pricing accordingly.",

  "Waste Management Automation in Dark Stores: Create a solution to automate waste management processes in dark stores, including the efficient disposal, recycling, and reduction of waste. This might involve IoT integration, AI for predictive waste patterns, and sustainability features.",

  "Heatmap-Based Store Placement Analysis: Develop an analytical tool that uses heatmaps to optimize store placements in a region. The system would analyze foot traffic, population density, and demand patterns to suggest ideal locations for new stores."
];

const motivationalQuotes = [
  {
    text: "🏁 HACKATHON ENDED 🏁\n\nThank you for participating! Project submissions are now closed. Stay tuned for the results!",
    isUrgent: true
  },
  {
    text: "⚠️ URGENT NOTIFICATION ⚠️\n\nDear Teams,\n\nSome teams have yet to update their Demo, Presentation, and Repository Links in the designated sections. And some teams have update broken links Please fix this immediately to avoid disqualification. ⚠️⏳",
    isUrgent: true
  },
  {
    text: "Keep pushing forward, warrior! 🚀\nYou've come too far to give up now. The code flows through you - embrace the challenge and make something legendary!",
    timestamp: new Date().toLocaleString()
  },
  {
    text: "In the matrix of possibilities, you are the chosen one! 💻\nEvery bug you fix makes you stronger. Every feature you ship brings you closer to greatness!",
    timestamp: new Date().toLocaleString()
  },
  {
    text: "Debug like a warrior, deploy like a boss! ⚡\nYour code is your weapon, your logic is your shield. The future belongs to those who build it!",
    timestamp: new Date().toLocaleString()
  },
  {
    text: "The best code is yet to come! 🎯\nEvery line of code you write is a step towards innovation. Keep pushing the boundaries of what's possible!",
    timestamp: new Date().toLocaleString()
  },
  {
    text: "You're not just coding, you're crafting the future! 🌟\nEmbrace the challenges, celebrate the victories, and let your creativity flow through your keystrokes!",
    timestamp: new Date().toLocaleString()
  }
];

export default function TeamDashboard() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProjectSubmission>({
    liveDemo: '',
    demoVideoUrl: '',
    presentationUrl: '',
    codeRepository: '',
    documentation: '',
    problemStatement: '',
    solution: '',
    techStack: '',
    challenges: '',
    learnings: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProblemStatement, setSelectedProblemStatement] = useState(problemStatements[0]);
  const [showForm, setShowForm] = useState(true);
  const [githubRepo, setGithubRepo] = useState<GitHubRepo | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [adminBroadcast, setAdminBroadcast] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problemCounts, setProblemCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const teamsRef = ref(db, 'teams');
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const counts: Record<string, number> = {};

        Object.values(data).forEach((team: any) => {
          const ps = team.projectSubmission?.problemStatement;
          if (ps) {
            counts[ps] = (counts[ps] || 0) + 1;
          }
        });
        setProblemCounts(counts);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync modal visibility with alerts
  useEffect(() => {
    if (adminBroadcast || showAlert) {
      setIsModalOpen(true);
    }
  }, [adminBroadcast, showAlert]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 300000); // Changes every 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      // Fetch team data first to check submission status
      const teamRef = ref(db, `teams/${user.uid}`);
      onValue(teamRef, (snapshot) => {
        const data = snapshot.val();

        // Set showForm based on whether submission exists
        setShowForm(!data?.projectSubmission);

        setTeamData(data);

        // Also get GitHub repo data if it exists
        if (data && data.githubRepo) {
          setGithubRepo(data.githubRepo);
          setRepoUrl(data.githubRepo.repoUrl);
        }

        if (data && data.submissionUrl) {
          setSubmissionUrl(data.submissionUrl);
        }

        setLoading(false);
      });

      // Listen for notifications
      const notificationRef = ref(db, 'admin/notification');
      onValue(notificationRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.active && data.text) {
          // Override the current quote with the broadcast message
          const adminQuote = {
            text: data.text,
            isUrgent: data.isUrgent || false,
            timestamp: data.lastUpdated
          };

          // We'll put this in a special state or override the quotes array
          // Here I'll add it as a high-priority quote and freeze the rotation
          // or handle it via a new state variable. 
          // Let's use a new state variable for Admin Broadcast to take precedence.
          setAdminBroadcast(adminQuote);
        } else {
          setAdminBroadcast(null);
        }
      });
    });

    return () => unsubscribe();
  }, [router]);

  const handleEditSubmission = () => {
    setShowForm(true);
    setIsEditMode(true);
    setError('');
    // Pre-fill form with existing data
    if (teamData?.projectSubmission) {
      setFormData(teamData.projectSubmission);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Only validate liveDemo and codeRepository
    if (!formData.liveDemo || !formData.codeRepository) {
      setError('Please fill in all required fields (Live Demo URL and Code Repository).');
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionRef = ref(db, `teams/${auth.currentUser?.uid}/projectSubmission`);
      await set(submissionRef, formData);

      // Update team data after submission
      setTeamData(prev => ({
        ...prev!, // Assert prev is not null as we're authenticated
        projectSubmission: formData,
      }));

      // Set success message
      setSuccessMessage('Congrats! You have successfully submitted your project.');

      // Close the form and exit edit mode
      setShowForm(false);
      setIsEditMode(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Separate handler for the dropdown
  const handleProblemStatementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatement = e.target.value;
    setFormData(prev => ({
      ...prev,
      problemStatement: selectedStatement
    }));
  };

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingRepo(true);
    setError('');

    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      setIsAddingRepo(false);
      return;
    }

    try {
      const repoData = {
        repoUrl,
        lastUpdated: new Date().toISOString()
      };

      const repoRef = ref(db, `teams/${auth.currentUser?.uid}/githubRepo`);
      await set(repoRef, repoData);

      setGithubRepo(repoData);
      setSuccessMessage('GitHub repository connected successfully!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsAddingRepo(false);
    }
  };

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingUrl(true);
    setError('');

    if (!submissionUrl) {
      setError('Please enter a submission URL');
      setIsSubmittingUrl(false);
      return;
    }

    try {
      const urlRef = ref(db, `teams/${auth.currentUser?.uid}/submissionUrl`);
      await set(urlRef, submissionUrl);

      setSuccessMessage('Submission URL updated successfully!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-cyan-500 text-2xl"
        >
          ⟳
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="w-full pt-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 px-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-tekron-pink-neon font-pixel text-base transition-colors duration-300 tracking-wider"
          >
            <span className="text-tekron-pink-neon">{'<'}</span>
            {`RETURN_TO_HOMEPAGE`}
          </Link>
        </motion.div>

        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-tekron-purple-deep/60 via-black/80 to-tekron-purple-deep/60 backdrop-blur-xl border-2 border-tekron-pink-neon/30 rounded-2xl p-8 mb-10 overflow-hidden"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-tekron-pink-neon/20 to-tekron-purple-accent/20 blur-xl opacity-50" />

          <div className="relative flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-pixel text-tekron-pink-neon tracking-wider mb-3" style={{ textShadow: '0 0 20px rgba(255, 0, 110, 0.5)' }}>
                {`> WELCOME_BACK`}
              </h1>
              <p className="text-2xl font-pixel text-cyan-400 mb-2 tracking-wide">
                {teamData?.teamName}
              </p>
              <p className="text-gray-400 font-mono text-base mt-2">
                {teamData?.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 mx-6 relative bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-400/50 rounded-xl p-5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-400/5 blur-xl" />
            <p className="relative text-green-300 font-pixel text-lg tracking-wide">{successMessage}</p>
          </motion.div>
        )}

        {/* Checkpoint Alert Modal */}
        <AnimatePresence>
          {isModalOpen && (adminBroadcast || showAlert) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => {
                  if (!adminBroadcast?.isUrgent) {
                    setIsModalOpen(false);
                    setShowAlert(false);
                  }
                }}
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-gradient-to-br from-tekron-purple-deep via-black/90 to-cyan-900/40 border-2 border-cyan-400/40 rounded-2xl p-8 overflow-hidden shadow-2xl shadow-cyan-500/20"
              >
                {/* Glow border effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    animate={{
                      background: [
                        'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)',
                        'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </div>

                {/* Close button - Always visible now */}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowAlert(false);
                  }}
                  className="absolute top-4 right-4 text-cyan-500/50 hover:text-tekron-pink-neon transition-colors z-20 p-2 transform hover:scale-110"
                >
                  <FaTimes className="text-xl" />
                </button>

                {/* Alert content */}
                <div className="flex items-start space-x-6 relative z-10">
                  <div className="relative shrink-0">
                    <FaBell className="text-cyan-400 h-10 w-10" />
                    <motion.div
                      className="absolute inset-0 bg-cyan-400 filter blur-xl"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-pixel text-2xl mb-4 tracking-wider ${(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent)
                      ? 'text-red-400 animate-pulse'
                      : 'text-cyan-300'
                      }`}>
                      {(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent)
                        ? `> URGENT_ALERT`
                        : `> SYSTEM_MESSAGE`}
                    </h3>
                    <p className={`font-mono text-base whitespace-pre-line leading-relaxed ${(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent)
                      ? 'text-red-300'
                      : 'text-gray-300'
                      }`}>
                      {adminBroadcast ? adminBroadcast.text : motivationalQuotes[currentQuote].text}
                    </p>
                    <p className="text-cyan-500 font-mono text-xl mt-6 border-t border-cyan-500/20 pt-4">
                      {adminBroadcast && adminBroadcast.timestamp ? new Date(adminBroadcast.timestamp).toLocaleString() : new Date().toLocaleString()}
                    </p>

                    {(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent) && (
                      <motion.div
                        animate={{
                          opacity: [1, 0.5, 1],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                        className="mt-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex flex-col gap-4">
                          <button
                            onClick={() => {
                              setIsModalOpen(false);
                              setShowAlert(false);
                            }}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 font-pixel py-3 rounded text-sm tracking-wider transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                          >
                            [ ACKNOWLEDGE_&_DISMISS ]
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-6">
          {/* USER Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="relative bg-gradient-to-br from-tekron-purple-deep/70 via-black/60 to-cyan-900/40 backdrop-blur-xl border-2 border-cyan-400/40 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-300">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaUser className="text-cyan-400 text-2xl" />
                  <h3 className="text-cyan-300 font-pixel text-base tracking-wider">USER</h3>
                </div>
                <div className="text-3xl font-pixel text-cyan-300 mb-2">$ {teamData?.teamName || 'N/A'}</div>
                <p className="text-gray-400 font-mono text-sm">~/{teamData?.email?.split('@')[0] || 'user'}</p>
              </div>
            </div>
          </motion.div>

          {/* STATUS Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="relative bg-gradient-to-br from-tekron-purple-deep/70 via-black/60 to-purple-900/40 backdrop-blur-xl border-2 border-purple-400/40 rounded-2xl p-6 hover:border-purple-400/60 transition-all duration-300">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaClipboardCheck className="text-purple-400 text-2xl" />
                  <h3 className="text-purple-300 font-pixel text-base tracking-wider">STATUS</h3>
                </div>
                <div className="text-3xl font-pixel text-purple-300 mb-2">$ {teamData?.projectSubmission ? 'SUBMITTED' : 'PENDING'}</div>
                <p className="text-gray-400 font-mono text-sm">~/{teamData?.projectSubmission ? 'uploaded' : 'await_upload'}</p>
              </div>
            </div>
          </motion.div>

          {/* GIT_REMOTE Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-rose-600/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="relative bg-gradient-to-br from-tekron-purple-deep/70 via-black/60 to-pink-900/40 backdrop-blur-xl border-2 border-tekron-pink-neon/40 rounded-2xl p-6 hover:border-tekron-pink-neon/60 transition-all duration-300">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaGithub className="text-tekron-pink-neon text-2xl" />
                  <h3 className="text-pink-300 font-pixel text-base tracking-wider">GIT_REMOTE</h3>
                </div>
                <div className="text-3xl font-pixel text-pink-300 mb-2">$ {teamData?.githubRepo ? 'CONNECTED' : 'DISCONNECTED'}</div>
                <p className="text-gray-400 font-mono text-sm">~/{teamData?.githubRepo ? 'repo_linked' : 'not_yet_uploaded'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Last Message Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10 px-6"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-emerald-600/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="relative bg-gradient-to-br from-tekron-purple-deep/70 via-black/60 to-green-900/40 backdrop-blur-xl border-2 border-green-400/40 rounded-2xl p-6 hover:border-green-400/60 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaBell className={`text-2xl ${(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent)
                    ? 'text-red-400 animate-pulse'
                    : 'text-green-400'
                    }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-pixel text-lg tracking-wider ${(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent)
                      ? 'text-red-300'
                      : 'text-green-300'
                      }`}>
                      LAST_MESSAGE
                    </h3>
                    <span className="text-gray-500 font-mono text-sm">
                      // {adminBroadcast && adminBroadcast.timestamp ? new Date(adminBroadcast.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`font-mono text-lg leading-relaxed ${(adminBroadcast ? adminBroadcast.isUrgent : motivationalQuotes[currentQuote].isUrgent)
                    ? 'text-red-300'
                    : 'text-gray-300'
                    }`}>
                    {adminBroadcast ? adminBroadcast.text : motivationalQuotes[currentQuote].text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="px-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Problem Statements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.15)] mb-6"
            >
              <div className="relative bg-black/60 p-6 border-b border-cyan-500/20">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                <h2 className="text-xl font-mono text-cyan-400 flex items-center">
                  <FaLightbulb className="mr-3 text-cyan-500" />
                  {`> Problem_Statements`}
                </h2>
              </div>

              <div className="p-6">
                <a
                  href="https://hackron.tekronfest.com/problems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono py-4 rounded transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] group"
                >
                  <span className="flex items-center justify-center gap-2 text-lg">
                    {`> VIEW_ALL_PROBLEMS`}
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </a>
              </div>
            </motion.div>

            {/* GitHub Repository Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br 
              ${githubRepo
                  ? 'from-green-900/20 to-black border-green-500/30'
                  : 'from-gray-900 to-black border-purple-500/30'} 
              backdrop-blur-sm border rounded-lg overflow-hidden 
              shadow-[0_0_15px_rgba(8,145,178,0.15)] mb-6`}
            >
              <div className={`relative bg-black/60 p-6 border-b 
              ${githubRepo ? 'border-green-500/20' : 'border-purple-500/20'}`}
              >
                <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r 
                from-transparent 
                ${githubRepo ? 'via-green-500/50' : 'via-purple-500/50'} 
                to-transparent`}
                />
                <h2 className={`text-xl font-mono ${githubRepo ? 'text-green-400' : 'text-purple-400'} 
                flex items-center`}
                >
                  <FaCode className={`mr-3 ${githubRepo ? 'text-green-500' : 'text-purple-500'}`} />
                  {`> GitHub_Repository`}
                  {githubRepo && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-2 text-sm text-green-400/70"
                    >
                      (Connected)
                    </motion.span>
                  )}
                </h2>
              </div>

              <div className="p-6">
                {githubRepo ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-mono text-cyan-400">Repository Details:</h3>
                      <button
                        onClick={() => {
                          setGithubRepo(null);
                          setRepoUrl('');
                        }}
                        className="text-red-400 hover:text-red-300 font-mono text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30">
                      <p className="text-gray-300 font-mono text-sm break-all">{githubRepo.repoUrl}</p>
                      <p className="text-gray-500 font-mono text-xs mt-2">
                        Last updated: {new Date(githubRepo.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddRepo} className="space-y-4">
                    <div>
                      <label className="block text-cyan-400 font-mono text-sm mb-2">
                        {`> Repository_URL:`}
                      </label>
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-2 text-green-400 font-mono focus:outline-none focus:border-green-500 placeholder-green-500/30"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAddingRepo}
                      className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 font-mono py-2 rounded transition-all duration-300"
                    >
                      {isAddingRepo ? 'Connecting...' : '> Connect_Repository'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div >

            {/* URL Submission Box */}
            < motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.15)] mb-6"
            >
              <div className="relative bg-black/60 p-6 border-b border-purple-500/20">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <h2 className="text-xl font-mono text-purple-400 flex items-center">
                  <FaLink className="mr-3 text-purple-500" />
                  {`> URL_Submission`}
                </h2>
              </div>

              <div className="p-6">
                {submissionUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-mono text-cyan-400">Submission URL:</h3>
                      <button
                        onClick={() => {
                          setSubmissionUrl('');
                          // Optional: update DB to remove url
                        }}
                        className="text-red-400 hover:text-red-300 font-mono text-sm underline"
                      >
                        Change
                      </button>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30">
                      <p className="text-gray-300 font-mono text-sm break-all">{submissionUrl}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitUrl} className="space-y-4">
                    <div>
                      <label className="block text-cyan-400 font-mono text-sm mb-2">
                        {`> Project_URL:`}
                      </label>
                      <input
                        type="url"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-black/30 border border-purple-500/30 rounded px-4 py-2 text-purple-400 font-mono focus:outline-none focus:border-purple-500 placeholder-purple-500/30"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingUrl}
                      className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 text-purple-400 font-mono py-2 rounded transition-all duration-300"
                    >
                      {isSubmittingUrl ? 'Submitting...' : '> Submit_URL'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div >

            {/* Project Submission Section */}
            < motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.15)] mb-6"
            >
              {/* Header with glowing accent */}
              < div className="relative bg-black/60 p-6 border-b border-purple-500/20" >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-mono text-purple-400 flex items-center">
                    <FaFileAlt className="mr-3 text-purple-500 text-2xl" />
                    {teamData?.projectSubmission && !isEditMode ?
                      `> Congrats! You have successfully submitted your project.` :
                      `> Project_Submission`}
                  </h2>
                  {teamData?.projectSubmission && !showForm && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditSubmission}
                      className="px-4 py-1 bg-cyan-600/80 text-white rounded font-mono text-sm flex items-center"
                    >
                      <FaClipboardCheck className="mr-2" />
                      Edit Submission
                    </motion.button>
                  )}
                </div>
              </div >
              <div className="p-6">
                {showForm ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Problem Statement Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-cyan-400 font-mono text-lg">
                          {`> Problem_Statement:`}
                        </label>
                        <div className="flex items-center gap-3">
                          <Link href="/problems" target="_blank" className="text-sm font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-1 hover:underline">
                            <FaLightbulb size={12} /> View Detailed Problems
                          </Link>
                          <Link href="/docs" target="_blank" className="text-sm font-mono text-yellow-500 hover:text-yellow-400 flex items-center gap-1 hover:underline">
                            <FaBook size={12} /> Playbook
                          </Link>
                        </div>
                      </div>

                      {teamData?.projectSubmission?.problemStatement ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={teamData.projectSubmission.problemStatement.split(':')[0]}
                            disabled
                            className="w-full bg-black/30 border border-purple-500/30 rounded px-4 py-3 text-gray-400 font-mono text-lg cursor-not-allowed"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-purple-400 text-xs font-mono">
                            <FaLock /> LOCKED
                          </div>
                          <p className="mt-2 text-xs text-red-400 font-mono">
                            * Problem statement selection cannot be changed once submitted.
                          </p>
                        </div>
                      ) : (
                        <>
                          <select
                            value={formData.problemStatement || problemStatements[0]}
                            onChange={handleProblemStatementChange}
                            className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          >
                            {problemStatements.map((statement, index) => {
                              const count = problemCounts[statement] || 0;
                              const isFull = count >= 11;
                              const isSelected = formData.problemStatement === statement;

                              // Disable if full AND not currently selected (so they don't lose their own selection)
                              const isDisabled = isFull && !isSelected;

                              return (
                                <option
                                  key={index}
                                  value={statement}
                                  disabled={isDisabled}
                                  className={`bg-gray-900 text-lg ${isDisabled ? 'text-gray-600' : 'text-gray-300'}`}
                                >
                                  {statement.split(':')[0]} {isFull ? '(FULL)' : `(${count}/11)`}
                                </option>
                              );
                            })}
                          </select>
                          <p className="mt-2 text-xs text-gray-500 font-mono">
                            {formData.problemStatement || problemStatements[0]}
                          </p>
                        </>
                      )}
                    </div>

                    {/* URLs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Live_Demo_URL:`} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="liveDemo"
                          value={formData.liveDemo}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="https://..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Presentation_URL:`}
                        </label>
                        <input
                          type="url"
                          name="presentationUrl"
                          value={formData.presentationUrl}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Code_Repository:`} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="codeRepository"
                          value={formData.codeRepository}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="https://github.com/..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Demo_Video_URL:`}
                        </label>
                        <input
                          type="url"
                          name="demoVideoUrl"
                          value={formData.demoVideoUrl}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="https://youtu.be/..."
                        />
                      </div>
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Documentation_URL:`}
                        </label>
                        <input
                          type="url"
                          name="documentation"
                          value={formData.documentation}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Text Areas */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Solution_Description:`}
                        </label>
                        <textarea
                          name="solution"
                          value={formData.solution}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="Describe your solution..."
                        />
                      </div>
                      <div>
                        <label className="block text-cyan-400 font-mono text-lg mb-2">
                          {`> Tech_Stack:`}
                        </label>
                        <textarea
                          name="techStack"
                          value={formData.techStack}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                          placeholder="React, Next.js, Firebase, etc..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-cyan-400 font-mono text-lg mb-2">
                            {`> Challenges_Faced:`}
                          </label>
                          <textarea
                            name="challenges"
                            value={formData.challenges}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                            placeholder="What challenges did you face?"
                          />
                        </div>
                        <div>
                          <label className="block text-cyan-400 font-mono text-lg mb-2">
                            {`> Key_Learnings:`}
                          </label>
                          <textarea
                            name="learnings"
                            value={formData.learnings}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-black/30 border border-cyan-500/30 rounded px-4 py-3 text-gray-300 font-mono text-lg focus:outline-none focus:border-cyan-500"
                            placeholder="What did you learn?"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-400 font-mono text-sm">
                        {`> Error: ${error}`}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 
                        text-cyan-400 font-mono px-8 py-3 rounded-lg flex items-center gap-2 text-lg
                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⟳
                            </motion.span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaRocket />
                            {`> Submit_Project`}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-black/30 p-6 rounded-lg border border-cyan-500/30">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-mono text-cyan-400">{teamData?.projectSubmission?.problemStatement?.split(':')[0]}</h3>
                        <div className="flex gap-2">
                          {teamData?.projectSubmission?.liveDemo && (
                            <a href={teamData.projectSubmission.liveDemo} target="_blank" rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300"><FaRocket size={20} /></a>
                          )}
                          {teamData?.projectSubmission?.demoVideoUrl && (
                            <a href={teamData.projectSubmission.demoVideoUrl} target="_blank" rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300"><FaVideo size={20} /></a>
                          )}
                          {teamData?.projectSubmission?.codeRepository && (
                            <a href={teamData.projectSubmission.codeRepository} target="_blank" rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300"><FaCode size={20} /></a>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-4">{teamData?.projectSubmission?.solution}</p>
                      <div className="flex flex-wrap gap-2">
                        {teamData?.projectSubmission?.techStack?.split(',').map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400 font-mono">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div >
          </div >
        </div >
      </div >
    </div >
  );
}
