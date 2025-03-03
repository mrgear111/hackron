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

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6"
        >
          <h2 className="text-xl font-mono text-purple-400 mb-4 flex items-center">
            <FaUser className="mr-2" /> {`> Team_Stats`}
          </h2>
          <div className="space-y-2 font-mono">
            <p className="text-gray-200">
              Member since: {new Date(teamData?.createdAt || '').toLocaleDateString()}
            </p>
            <p className="text-gray-200">
              Projects: 0
            </p>
          </div>
        </motion.div>

        {/* Add the Quotes component here */}
        <Quotes />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* GitHub Repository Section - Updated title */}
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
                <FaCode className="mr-3 text-purple-500" />
                {`> GitHub Repository`}
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

          {/* Project Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.15)]"
          >
            {/* Header with glowing accent */}
            <div className="relative bg-black/60 p-6 border-b border-cyan-500/20">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              <h2 className="text-xl font-mono text-cyan-400 flex items-center">
                <FaRocket className="mr-3 text-cyan-500" />
                {`> Project Submission`}
              </h2>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="p-6">
                {/* If no GitHub repo is added, show a warning */}
                {!githubRepo && (
                  <div className="mb-6 bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-md">
                    <div className="flex items-start">
                      <div className="text-yellow-500 mr-3">!</div>
                      <div className="text-yellow-200 font-mono text-sm">
                        Please connect your GitHub repository above before submitting your project.
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Progress indicator */}
                <div className="mb-8 px-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400">Project Links</span>
                    <span className="text-xs font-mono text-cyan-400">Project Details</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Project Links Panel */}
                  <div className="relative">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/40"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/40"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/40"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/40"></div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-6 bg-purple-500 mr-3"></div>
                        <h3 className="text-purple-400 font-mono text-sm tracking-wider">{`PROJECT LINKS`}</h3>
                      </div>
                      
                      <div className="space-y-5">
                        {/* Live Demo */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-cyan-400 transition-colors">
                            <FaLink className="text-purple-400 mr-2" />
                            LIVE DEMO URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              name="liveDemo"
                              value={formData.liveDemo}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-b-2 border-gray-700 focus:border-cyan-500 rounded-t-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none transition-colors"
                              placeholder="https://your-project.vercel.app"
                              required
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-focus-within:w-full transition-all duration-300"></div>
                          </div>
                        </div>
                        
                        {/* Presentation URL */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-cyan-400 transition-colors">
                            <FaFileAlt className="text-purple-400 mr-2" />
                            PRESENTATION URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              name="presentationUrl"
                              value={formData.presentationUrl}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-b-2 border-gray-700 focus:border-cyan-500 rounded-t-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none transition-colors"
                              placeholder="https://docs.google.com/presentation/..."
                              required
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-focus-within:w-full transition-all duration-300"></div>
                          </div>
                        </div>
                        
                        {/* Code Repository */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-cyan-400 transition-colors">
                            <FaCode className="text-purple-400 mr-2" />
                            CODE REPOSITORY URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              name="codeRepository"
                              value={formData.codeRepository}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-b-2 border-gray-700 focus:border-cyan-500 rounded-t-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none transition-colors"
                              placeholder="https://github.com/username/repo"
                              required
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-focus-within:w-full transition-all duration-300"></div>
                          </div>
                        </div>
                        
                        {/* Documentation */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-cyan-400 transition-colors">
                            <FaClipboardList className="text-purple-400 mr-2" />
                            DOCUMENTATION URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              name="documentation"
                              value={formData.documentation}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-b-2 border-gray-700 focus:border-cyan-500 rounded-t-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none transition-colors"
                              placeholder="https://docs.yourproject.com"
                              required
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-focus-within:w-full transition-all duration-300"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Details Panel */}
                  <div className="relative">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500/40"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/40"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-purple-500/40"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-purple-500/40"></div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-6 bg-cyan-500 mr-3"></div>
                        <h3 className="text-cyan-400 font-mono text-sm tracking-wider">{`PROJECT DETAILS`}</h3>
                      </div>
                      
                      <div className="space-y-5">
                        {/* Problem Statement */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                            <FaClipboardCheck className="text-cyan-400 mr-2" />
                            PROBLEM STATEMENT
                          </label>
                          <div className="relative bg-gray-900/70 rounded-md overflow-hidden">
                            <select
                              id="problemStatement"
                              value={formData.problemStatement}
                              onChange={handleProblemStatementChange}
                              className="w-full bg-transparent border-l-2 border-gray-700 focus:border-purple-500 px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none appearance-none"
                            >
                              {problemStatements.map((statement, index) => (
                                <option key={index} value={statement} className="bg-gray-900">
                                  {statement}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 pointer-events-none">
                              ▼
                            </div>
                          </div>
                        </div>
                        
                        {/* Solution */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                            <FaRocket className="text-cyan-400 mr-2" />
                            SOLUTION
                          </label>
                          <div className="relative">
                            <textarea
                              name="solution"
                              value={formData.solution}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-l-2 border-gray-700 focus:border-purple-500 rounded-r-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none min-h-[80px] resize-none"
                              placeholder="How does your solution address the problem?"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Tech Stack */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                            <FaCode className="text-cyan-400 mr-2" />
                            TECH STACK
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="techStack"
                              value={formData.techStack}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-l-2 border-gray-700 focus:border-purple-500 rounded-r-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none"
                              placeholder="React, Next.js, Firebase, etc."
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Challenges */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                            <FaClipboardList className="text-cyan-400 mr-2" />
                            CHALLENGES
                          </label>
                          <div className="relative">
                            <textarea
                              name="challenges"
                              value={formData.challenges}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-l-2 border-gray-700 focus:border-purple-500 rounded-r-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none min-h-[60px] resize-none"
                              placeholder="What challenges did you face?"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Learnings */}
                        <div className="group">
                          <label className="flex items-center text-gray-300 font-mono text-xs mb-2 group-focus-within:text-purple-400 transition-colors">
                            <FaClipboardList className="text-cyan-400 mr-2" />
                            LEARNINGS
                          </label>
                          <div className="relative">
                            <textarea
                              name="learnings"
                              value={formData.learnings}
                              onChange={handleChange}
                              className="w-full bg-gray-900/70 border-l-2 border-gray-700 focus:border-purple-500 rounded-r-md px-4 py-2 
                                text-gray-100 font-mono text-sm focus:outline-none min-h-[60px] resize-none"
                              placeholder="What did you learn from this project?"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-md">
                    <div className="flex items-start">
                      <div className="text-red-500 mr-3">!</div>
                      <div className="text-red-200 font-mono text-sm">{error}</div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="mt-8 flex justify-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !githubRepo}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden group px-8 py-3 bg-gradient-to-r from-cyan-600/80 to-purple-600/80 rounded-md font-mono text-white shadow-lg disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center">
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block mr-2"
                          >
                            ⟳
                          </motion.span>
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">SUBMIT PROJECT</span>
                          <FaRocket />
                        </>
                      )}
                    </span>
                    
                    {/* Button glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-white/20 to-purple-600/0"
                      animate={{ x: ["120%", "-120%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 