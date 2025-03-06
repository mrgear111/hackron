'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FaLink, FaFileAlt, FaCode, FaVideo, FaClipboardList, FaUser, FaClipboardCheck, FaRocket, FaFileCode, FaBell, FaTimes } from 'react-icons/fa';

interface TeamData {
  teamName: string;
  email: string;
  createdAt: string;
  projectSubmission?: ProjectSubmission;
  githubRepo?: GitHubRepo;
  submissionUrl?: string;
}

interface ProjectSubmission {
  liveDemo: string;
  presentationUrl?: string;
  codeRepository: string;
  documentation?: string;
  problemStatement?: string;
  solution?: string;
  techStack?: string;
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

      // Set showForm to false since hackathon is over
      setShowForm(false);
      
      // Fetch team data
      const teamRef = ref(db, `teams/${user.uid}`);
      onValue(teamRef, (snapshot) => {
        const data = snapshot.val();
        setTeamData(data);
        
        // Also get GitHub repo data if it exists
        if (data && data.githubRepo) {
          setGithubRepo(data.githubRepo);
        }
        
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, [router]);

  const handleEditSubmission = () => {
    setError("Project submissions are now closed. The hackathon has ended.");
    return;
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
        ...prev,
        projectSubmission: formData,
        teamName: prev?.teamName || '',
        email: prev?.email || '',
        createdAt: prev?.createdAt || '',
        githubRepo: prev?.githubRepo || undefined
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
    setError("GitHub repository submissions are now closed. The hackathon has ended.");
    return;
  };

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("URL submissions are now closed. The hackathon has ended.");
    return;
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 font-mono text-sm transition-colors duration-300"
          >
            <span className="text-cyan-400">{'<'}</span>
            {`Return_To_Homepage`}
          </Link>
        </motion.div>

        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-mono text-cyan-400">
                {`> Welcome_Back ${teamData?.teamName}`}
              </h1>
              <p className="text-gray-400 font-mono mt-2">
                {teamData?.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 text-green-400 font-mono">
            {successMessage}
          </div>
        )}

        {/* Checkpoint Alert Popup */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 relative bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 overflow-hidden"
            >
              {/* Glowing border effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'linear-gradient(90deg, transparent, rgba(34,211,238,0.2), transparent)',
                    'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />

              {/* Close button */}
              <button
                onClick={() => setShowAlert(false)}
                className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <FaTimes />
              </button>

              {/* Alert content */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <FaBell className="text-cyan-400 h-6 w-6" />
                  <motion.div
                    className="absolute inset-0 bg-cyan-500 filter blur-md"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className={`font-mono text-lg mb-2 ${
                    motivationalQuotes[currentQuote].isUrgent 
                      ? 'text-red-400 animate-pulse'
                      : 'text-cyan-400'
                  }`}>
                    {motivationalQuotes[currentQuote].isUrgent 
                      ? `> Urgent_Alert` 
                      : `> System_Alert`}
                  </h3>
                  <p className={`font-mono text-sm whitespace-pre-line ${
                    motivationalQuotes[currentQuote].isUrgent 
                      ? 'text-red-300'
                      : 'text-gray-300'
                  }`}>
                    {motivationalQuotes[currentQuote].text}
                  </p>
                  <p className="text-cyan-500/50 font-mono text-xs mt-3">
                    {new Date().toLocaleString()}
                  </p>
                  {motivationalQuotes[currentQuote].isUrgent && (
                    <motion.div
                      animate={{ 
                        opacity: [1, 0.5, 1],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity 
                      }}
                      className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-md"
                    >
                      <p className="text-red-400 font-mono text-xs">
                        ⚡ Take immediate action to ensure your team's participation!
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-gray-300 font-mono text-sm break-all">{githubRepo.repoUrl}</p>
                    <p className="text-gray-500 font-mono text-xs mt-2">
                      Last updated: {new Date(githubRepo.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-black/30 p-6 rounded-lg border border-red-500/30">
                  <div className="text-center space-y-4">
                    <FaCode className="text-4xl text-red-400 mx-auto" />
                    <h3 className="text-xl font-mono text-red-400">
                      Repository Submissions Closed
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      GitHub repository submissions are now closed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* URL Submission Box */}
          <motion.div
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
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-gray-300 font-mono text-sm break-all">{submissionUrl}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-black/30 p-6 rounded-lg border border-red-500/30">
                  <div className="text-center space-y-4">
                    <FaLink className="text-4xl text-red-400 mx-auto" />
                    <h3 className="text-xl font-mono text-red-400">
                      URL Submissions Closed
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      Project URL submissions are now closed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Project Submission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.15)] mb-6"
          >
            {/* Header with glowing accent */}
            <div className="relative bg-black/60 p-6 border-b border-purple-500/20">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-mono text-purple-400 flex items-center">
                  <FaFileAlt className="mr-3 text-purple-500" />
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
            </div>
            <div className="p-6">
              {!showForm && (
                <div className="bg-black/30 p-6 rounded-lg border border-red-500/30">
                  <div className="text-center space-y-4">
                    <FaClipboardCheck className="text-4xl text-red-400 mx-auto" />
                    <h3 className="text-xl font-mono text-red-400">
                      Hackathon Submissions Closed
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      Thank you for participating! Project submissions are now closed.
                      Stay tuned for the results! 🏆
                    </p>
                    {teamData?.projectSubmission && (
                      <div className="mt-6">
                        <h4 className="text-cyan-400 font-mono text-sm mb-3">
                          Your Submitted Project:
                        </h4>
                        {/* Display submitted project details */}
                        {/* ... rest of your project display code ... */}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}