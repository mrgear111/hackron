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
}

interface ProjectSubmission {
  liveDemo: string;
  presentationUrl: string;
  videoWalkthrough: string;
  codeRepository: string;
  documentation: string;
  problemStatement: string;
  solution: string;
  techStack: string;
  challenges: string;
  learnings: string;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const submissionRef = ref(db, `teams/${auth.currentUser?.uid}/projectSubmission`);
      await set(submissionRef, formData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        setTeamData(snapshot.val());
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
          {/* Project Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono text-cyan-400 mb-6">
              {`> Project Submission`}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Links */}
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-mono text-sm">{`> Project Links`}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FaLink className="text-cyan-400" />
                      <input
                        type="url"
                        name="liveDemo"
                        value={formData.liveDemo}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        placeholder="Live Demo URL"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaFileAlt className="text-cyan-400" />
                      <input
                        type="url"
                        name="presentationUrl"
                        value={formData.presentationUrl}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        placeholder="Presentation URL"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaVideo className="text-cyan-400" />
                      <input
                        type="url"
                        name="videoWalkthrough"
                        value={formData.videoWalkthrough}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        placeholder="Video Walkthrough URL"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCode className="text-cyan-400" />
                      <input
                        type="url"
                        name="codeRepository"
                        value={formData.codeRepository}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        placeholder="Code Repository URL"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClipboardList className="text-cyan-400" />
                      <input
                        type="url"
                        name="documentation"
                        value={formData.documentation}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        placeholder="Documentation URL"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-mono text-sm">{`> Project Details`}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-cyan-400 font-mono text-xs mb-2">{`> Problem Statement:`}</label>
                      <textarea
                        name="problemStatement"
                        value={formData.problemStatement}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        rows={3}
                        placeholder="What problem does your project solve?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 font-mono text-xs mb-2">{`> Solution:`}</label>
                      <textarea
                        name="solution"
                        value={formData.solution}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        rows={3}
                        placeholder="How does your solution address the problem?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 font-mono text-xs mb-2">{`> Tech Stack:`}</label>
                      <input
                        type="text"
                        name="techStack"
                        value={formData.techStack}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        placeholder="React, Next.js, Firebase, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 font-mono text-xs mb-2">{`> Challenges:`}</label>
                      <textarea
                        name="challenges"
                        value={formData.challenges}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        rows={2}
                        placeholder="What challenges did you face?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 font-mono text-xs mb-2">{`> Learnings:`}</label>
                      <textarea
                        name="learnings"
                        value={formData.learnings}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-cyan-500/30 rounded-md px-4 py-2 
                          text-gray-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
                        rows={2}
                        placeholder="What did you learn from this project?"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-400 font-mono text-sm">
                  {`> Error: ${error}`}
                </div>
              )}

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md 
                    font-mono text-sm hover:bg-gradient-to-l transition-all duration-300"
                >
                  {isSubmitting ? '> Processing...' : '> Submit Project'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 