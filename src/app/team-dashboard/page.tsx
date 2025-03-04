'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Quotes from '@/components/Quotes';
import { FaLink, FaFileAlt, FaCode, FaVideo, FaClipboardList, FaUser, FaClipboardCheck, FaRocket } from 'react-icons/fa';

interface TeamData {
  teamName: string;
  email: string;
  createdAt: string;
  projectSubmission?: ProjectSubmission;
  githubRepo?: GitHubRepo;
}

interface ProjectSubmission {
  liveDemo: string;
  presentationUrl: string;
  videoWalkthrough?: string;
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
  "Problem Statement 1: Description...",
  "Problem Statement 2: Description...",
  "Problem Statement 3: Description...",
  // Add more problem statements as needed
];

export default function TeamDashboard() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProjectSubmission>({
    liveDemo: '',
    presentationUrl: '',
    videoWalkthrough: '',
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

      // Close the form
      setShowForm(false);
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

        {/* Add the Quotes component here */}
        <Quotes />

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
                            required
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
              <h2 className="text-xl font-mono text-purple-400 flex items-center">
                <FaFileAlt className="mr-3 text-purple-500" />
                {`> Project_Submission`}
              </h2>
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
              ) : (
                // Show submission form if GitHub repo is connected
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Problem Statement Dropdown */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      {`> Problem_Statement:`}
                    </label>
                    <select
                      name="problemStatement"
                      value={formData.problemStatement}
                      onChange={handleProblemStatementChange}
                      className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                        text-gray-300 font-mono focus:outline-none focus:border-purple-500/50"
                      required
                    >
                      <option value="">Select a problem statement</option>
                      {problemStatements.map((statement, index) => (
                        <option key={index} value={statement}>
                          {statement}
                        </option>
                      ))}
                    </select>
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
                      required
                    />
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block text-purple-400 font-mono text-sm mb-2">
                      {`> Tech_Stack:`}
                    </label>
                    <input
                      type="text"
                      name="techStack"
                      value={formData.techStack}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-purple-500/30 rounded p-2 
                        text-gray-300 font-mono focus:outline-none focus:border-purple-500/50"
                      placeholder="React, Node.js, Firebase, etc."
                      required
                    />
                  </div>

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
                      required
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
                      placeholder="https://slides.com/your-presentation"
                      required
                    />
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
                    ) : (
                      'SUBMIT PROJECT'
                    )}
                  </motion.button>

                  {error && (
                    <div className="text-red-400 font-mono text-sm text-center">
                      {`> Error: ${error}`}
                    </div>
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