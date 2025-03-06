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
  presentationUrl: string;
  codeRepository: string;
  documentation: string;
  problemStatement: string;
  solution: string;
  techStack: string;
  challenges: string;
  learnings: string;
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

  // Function to handle edit mode activation
  const handleEditSubmission = () => {
    // Pre-populate the form with existing submission data
    if (teamData?.projectSubmission) {
      setFormData(teamData.projectSubmission);
    }
    setIsEditMode(true);
    setShowForm(true);
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate form data
    if (!formData.problemStatement || !formData.solution || !formData.techStack) {
      setError('Please fill in all required fields.');
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
    
    if (!repoUrl) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    // Validate GitHub URL format
    if (!repoUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/)) {
      setError('Please enter a valid GitHub repository URL (https://github.com/username/repo)');
      return;
    }
    
    setIsAddingRepo(true);
    
    try {
      const newRepo: GitHubRepo = {
        repoUrl,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to Firebase
      const repoRef = ref(db, `teams/${auth.currentUser?.uid}/githubRepo`);
      await set(repoRef, newRepo);
      
      // Update local state
      setGithubRepo(newRepo);
      setRepoUrl('');
      setIsAddingRepo(false);
    } catch (error: any) {
      setError(error.message);
      setIsAddingRepo(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionUrl) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Validate URL format
    try {
      new URL(submissionUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    
    setIsSubmittingUrl(true);
    
    try {
      const urlRef = ref(db, `teams/${auth.currentUser?.uid}/submissionUrl`);
      await set(urlRef, submissionUrl);
      
      // Update local state
      setTeamData(prev => ({
        ...prev!,
        submissionUrl: submissionUrl
      }));
      
      setSuccessMessage('URL submitted successfully!');
      setSubmissionUrl('');
      setIsEditMode(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch team data
      const teamRef = ref(db, `teams/${user.uid}`);
      onValue(teamRef, (snapshot) => {
        const data = snapshot.val();
        setTeamData(data);
        
        // Also get GitHub repo data if it exists
        if (data && data.githubRepo) {
          setGithubRepo(data.githubRepo);
        }

        // If project is already submitted, don't show form by default
        if (data && data.projectSubmission) {
          setShowForm(false);
        }
        
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, [router]);

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
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="text-gray-400 font-mono text-xs mb-1">PROJECT REPOSITORY</div>
                      <a 
                        href={githubRepo.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 font-mono text-lg hover:underline flex items-center"
                      >
                        <FaCode className="mr-2" />
                        {githubRepo.repoUrl.replace('https://github.com/', '')}
                      </a>
                      <div className="text-gray-500 font-mono text-xs mt-2">
                        Connected: {new Date(githubRepo.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-600/80 text-white rounded font-mono text-sm flex items-center"
                        onClick={() => window.open(githubRepo.repoUrl, '_blank')}
                      >
                        <span className="mr-2">View Repo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                          <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                        </svg>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-700/80 text-white rounded font-mono text-sm flex items-center"
                        onClick={() => setGithubRepo(null)}
                      >
                        Change Repo
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddRepo} className="bg-black/40 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-gray-300 font-mono mb-4">
                    Please connect your GitHub repository for your project. This is required before submitting your project.
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="group w-full">
                        <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                          <FaCode className="text-purple-400 mr-2" />
                          GITHUB REPOSITORY URL
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full bg-gray-900/70 border-b-2 border-gray-700 focus:border-purple-500 rounded-t-md px-4 py-2 
                              text-gray-100 font-mono text-sm focus:outline-none transition-colors"
                            placeholder="https://github.com/username/repo"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 group-focus-within:w-full transition-all duration-300"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <motion.button
                        type="submit"
                        disabled={isAddingRepo}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="h-full px-6 py-2 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 rounded-md font-mono text-white shadow-lg disabled:opacity-50 flex items-center justify-center"
                      >
                        {isAddingRepo ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block mr-2"
                            >
                              ⟳
                            </motion.span>
                            CONNECTING...
                          </>
                        ) : (
                          <>CONNECT REPOSITORY</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Helpful tips */}
                  <div className="mt-4 text-gray-500 font-mono text-xs">
                    <div className="flex items-start mb-1">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Make sure your repository is public or our team has access to it</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Format: https://github.com/username/repository</span>
                    </div>
                  </div>
                </form>
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
              {teamData?.submissionUrl && !isEditMode ? (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow">
                      <div className="text-gray-400 font-mono text-xs mb-2">SUBMITTED URL</div>
                      <a 
                        href={teamData.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 font-mono text-lg hover:underline flex items-center"
                      >
                        <FaLink className="mr-2" />
                        {teamData.submissionUrl}
                      </a>
                      <div className="text-gray-500 font-mono text-xs mt-2">
                        Status: <span className="text-green-400">Submitted</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 bg-cyan-600/80 text-white rounded font-mono text-sm flex items-center"
                    >
                      <FaLink className="mr-2" />
                      Update URL
                    </motion.button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUrlSubmit} className="bg-black/40 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="group w-full">
                        <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                          <FaLink className="text-purple-400 mr-2" />
                          ENTER URL
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={submissionUrl}
                            onChange={(e) => setSubmissionUrl(e.target.value)}
                            className="w-full bg-gray-900/70 border-b-2 border-gray-700 focus:border-purple-500 rounded-t-md px-4 py-2 
                              text-gray-100 font-mono text-sm focus:outline-none transition-colors"
                            placeholder="https://your-url-here.com"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 group-focus-within:w-full transition-all duration-300"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <motion.button
                        type="submit"
                        disabled={isSubmittingUrl}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="h-full px-6 py-2 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 rounded-md font-mono text-white shadow-lg disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSubmittingUrl ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block mr-2"
                            >
                              ⟳
                            </motion.span>
                            SUBMITTING...
                          </>
                        ) : (
                          <>SUBMIT URL</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Helpful tips */}
                  <div className="mt-4 text-gray-500 font-mono text-xs">
                    <div className="flex items-start mb-1">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Make sure your URL is accessible and valid</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Format: https://your-url-here.com</span>
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <motion.button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-700/80 rounded-md py-2 text-white font-mono shadow-lg mt-4"
                    >
                      CANCEL
                    </motion.button>
                  )}
                </form>
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
              {!githubRepo ? (
                // Show message if GitHub repo is not connected
                <div className="text-center py-8">
                  <div className="text-gray-400 font-mono mb-4">
                    Please connect your GitHub repository first
                  </div>
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-purple-400/50 text-sm font-mono"
                  >
                    {`> Waiting for repository connection...`}
                  </motion.div>
                </div>
              ) : teamData?.projectSubmission && !showForm ? (
                // Show submitted project details
                <div className="space-y-8">
                  {/* Project Summary */}
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
                    <div className="flex items-center mb-4">
                      <FaRocket className="text-green-400 mr-2" />
                      <h3 className="text-lg font-mono text-green-400">Project Summary</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Problem Statement */}
                      <div>
                        <h4 className="text-purple-400 font-mono text-sm mb-2">Problem Statement</h4>
                        <p className="text-gray-300 font-mono text-sm">
                          {teamData.projectSubmission.problemStatement}
                        </p>
                      </div>
                      
                      {/* Tech Stack */}
                      <div>
                        <h4 className="text-purple-400 font-mono text-sm mb-2">Tech Stack</h4>
                        <p className="text-gray-300 font-mono text-sm">
                          {teamData.projectSubmission.techStack}
                        </p>
                      </div>
                    </div>
                    
                    {/* Links Section */}
                    <div className="mt-6 border-t border-gray-800 pt-4">
                      <h4 className="text-purple-400 font-mono text-sm mb-2">Project Links</h4>
                      <div className="flex flex-wrap gap-4">
                        {teamData.projectSubmission.liveDemo && (
                          <a
                            href={teamData.projectSubmission.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 font-mono text-sm hover:underline flex items-center"
                          >
                            <FaRocket className="mr-2" />
                            Live Demo
                          </a>
                        )}
                        {teamData.projectSubmission.presentationUrl && (
                          <a
                            href={teamData.projectSubmission.presentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 font-mono text-sm hover:underline flex items-center"
                          >
                            <FaFileAlt className="mr-2" />
                            Presentation
                          </a>
                        )}
                        {teamData.projectSubmission.codeRepository && (
                          <a
                            href={teamData.projectSubmission.codeRepository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 font-mono text-sm hover:underline flex items-center"
                          >
                            <FaCode className="mr-2" />
                            Code Repository
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Show submission form if GitHub repo is connected
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* URLs Section */}
                  <div className="space-y-6 bg-black/20 p-6 rounded-lg border border-purple-500/20">
                    <h3 className="text-lg font-mono text-purple-400 mb-4 flex items-center">
                      <FaLink className="mr-2" />
                      {`> Project_URLs`}
                    </h3>
                    {/* Live Demo URL */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Live_Demo_URL:`}
                      </label>
                      <input
                        type="url"
                        name="liveDemo"
                        value={formData.liveDemo}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50"
                        placeholder="https://your-demo-url.com"
                      />
                    </div>
                    {/* Presentation URL */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Presentation_URL:`}
                      </label>
                      <input
                        type="url"
                        name="presentationUrl"
                        value={formData.presentationUrl}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50"
                        placeholder="https://your-presentation-url.com"
                      />
                    </div>
                    {/* Code Repository */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Code_Repository:`}
                      </label>
                      <input
                        type="url"
                        name="codeRepository"
                        value={formData.codeRepository}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50"
                        placeholder="https://github.com/your-repo"
                      />
                    </div>
                  </div>
                  {/* Project Details Section */}
                  <div className="space-y-6 bg-black/20 p-6 rounded-lg border border-purple-500/20">
                    <h3 className="text-lg font-mono text-purple-400 mb-4 flex items-center">
                      <FaFileCode className="mr-2" />
                      {`> Project_Details`}
                    </h3>
                    {/* Problem Statement Dropdown */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Problem_Statement:`}
                      </label>
                      <textarea
                        name="problemStatement"
                        value={formData.problemStatement}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                        placeholder="Describe the problem you're solving..."
                      />
                    </div>
                    {/* Solution */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Solution:`}
                      </label>
                      <textarea
                        name="solution"
                        value={formData.solution}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                        placeholder="Describe your solution..."
                      />
                    </div>
                    {/* Tech Stack */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Tech_Stack:`}
                      </label>
                      <textarea
                        name="techStack"
                        value={formData.techStack}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                        placeholder="List the technologies used..."
                      />
                    </div>
                    {/* Documentation */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Documentation:`}
                      </label>
                      <textarea
                        name="documentation"
                        value={formData.documentation}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                        placeholder="Project documentation and setup instructions..."
                      />
                    </div>
                    {/* Challenges Faced */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Challenges:`}
                      </label>
                      <textarea
                        name="challenges"
                        value={formData.challenges}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                        placeholder="Describe the challenges you faced during development..."
                      />
                    </div>
                    {/* Key Learnings */}
                    <div>
                      <label className="block text-purple-400 font-mono text-sm mb-2">
                        {`> Key_Learnings:`}
                      </label>
                      <textarea
                        name="learnings"
                        value={formData.learnings}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                          text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                        placeholder="Share your key learnings from this project..."
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 
                      rounded-md py-3 text-white font-mono shadow-lg 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >⟳</motion.span>
                        SUBMITTING...
                      </span>
                    ) : isEditMode ? 'UPDATE PROJECT' : 'SUBMIT PROJECT'}
                  </motion.button>
                  {error && (
                    <div className="text-red-400 font-mono text-sm text-center">
                      {`> Error: ${error}`}
                    </div>
                  )}
                  
                  {isEditMode && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditMode(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-700/80 rounded-md py-3 text-white font-mono shadow-lg mt-2"
                    >
                      CANCEL
                    </motion.button>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}