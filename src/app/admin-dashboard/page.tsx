'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get, set } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { FirebaseError } from 'firebase/app';
import { FaCode } from 'react-icons/fa';

interface TeamData {
  teamName: string;
  email: string;
  createdAt: string;
  projectSubmission?: {
    liveDemo: string;
    presentationUrl: string;
    videoWalkthrough: string;
    codeRepository: string;
    problemStatement: string;
    solution: string;
    techStack: string;
    documentation?: string;
  };
  githubRepo?: {
    repoUrl: string;
    lastUpdated: string;
  };
  checkpoints?: Record<string, boolean>;
}

interface TeamScore {
  innovation: number;
  implementation: number;
  presentation: number;
  problemSolving: number;
  totalScore: number;
  feedback: string;
  judgedBy: string;
  judgedAt: string;
}

const judgeQuotes = [
  "Innovation distinguishes between a leader and a follower - Steve Jobs",
  "The best way to predict the future is to create it - Peter Drucker",
  "Every great developer you know got there by solving problems they were unqualified to solve",
  "Code is like humor. When you have to explain it, it's bad - Cory House",
  "The function of good software is to make the complex appear to be simple"
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Record<string, TeamData>>({});
  const [teamScores, setTeamScores] = useState<Record<string, TeamScore>>({});
  const [randomQuote, setRandomQuote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [judgedTeams, setJudgedTeams] = useState<Record<string, boolean>>({});
  const [teamCheckpoints, setTeamCheckpoints] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    console.log("AdminDashboard useEffect triggered");
    setRandomQuote(judgeQuotes[Math.floor(Math.random() * judgeQuotes.length)]);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user found, redirecting to home");
        router.push('/');
        return;
      }

      try {
        // Check if user is admin using their UID
        const adminRef = ref(db, `admins/${user.uid}`);
        const adminSnapshot = await get(adminRef);
        
        if (!adminSnapshot.exists()) {
          console.log("Not an admin, redirecting");
          router.push('/');
          return;
        }

        // Fetch teams data with error handling
        const teamsRef = ref(db, 'teams');
        const unsubTeams = onValue(teamsRef, 
          (snapshot) => {
            const teamsData = snapshot.val() || {};
            setTeams(teamsData);
            
            // Extract checkpoints data
            const checkpoints: Record<string, Record<string, boolean>> = {};
            Object.entries(teamsData).forEach(([id, team]: [string, any]) => {
              if (team.checkpoints) {
                checkpoints[id] = team.checkpoints;
              }
            });
            setTeamCheckpoints(checkpoints);
            
            // Also get judging data if it exists
            const scores: Record<string, TeamScore> = {};
            const judged: Record<string, boolean> = {};
            
            Object.entries(teamsData).forEach(([id, team]: [string, any]) => {
              if (team.judging) {
                scores[id] = team.judging;
                // Extract judged status
                if (team.judging.isJudged !== undefined) {
                  judged[id] = team.judging.isJudged;
                }
              }
            });
            
            setTeamScores(scores);
            setJudgedTeams(judged);
            setLoading(false);
          }, 
          (error) => {
            console.error("Error fetching teams:", error);
            if ('code' in error && error.code === 'PERMISSION_DENIED') {
              router.push('/');
            }
            setLoading(false);
          }
        );

        return () => unsubTeams();

      } catch (error) {
        console.error("Error in admin check:", error);
        setLoading(false);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const getStats = () => {
    const totalTeams = Object.keys(teams).length;
    const submittedProjects = Object.values(teams).filter(team => team.projectSubmission).length;
    const pendingSubmissions = totalTeams - submittedProjects;
    
    return { totalTeams, submittedProjects, pendingSubmissions };
  };

  const filteredTeams = Object.entries(teams).filter(([_, team]) => 
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTeamExpansion = (teamId: string) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  const handleScoreSubmit = async (teamId: string, scores: Omit<TeamScore, 'totalScore' | 'judgedBy' | 'judgedAt'>) => {
    try {
      const totalScore = 
        scores.innovation + 
        scores.implementation + 
        scores.presentation + 
        scores.problemSolving;
      
      const scoreData: TeamScore = {
        ...scores,
        totalScore,
        judgedBy: auth.currentUser?.email || 'Unknown',
        judgedAt: new Date().toISOString()
      };
      
      // Save to Firebase
      const scoreRef = ref(db, `teams/${teamId}/judging`);
      await set(scoreRef, scoreData);
      
      // Update local state
      setTeamScores(prev => ({
        ...prev,
        [teamId]: scoreData
      }));
      
      // Show success message
      alert("Scores submitted successfully!");
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("Failed to submit scores. Please try again.");
    }
  };

  const toggleJudgedStatus = async (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent team expansion when clicking the checkbox
    
    if (!auth.currentUser) {
      alert("You must be logged in to judge teams");
      return;
    }
    
    try {
      const newStatus = !judgedTeams[teamId];
      
      // Get the current team data
      const teamRef = ref(db, `teams/${teamId}`);
      const snapshot = await get(teamRef);
      const teamData = snapshot.val() || {};
      
      // Create or update the judging field
      const judging = teamData.judging || {};
      judging.isJudged = newStatus;
      judging.judgedBy = auth.currentUser.email;
      judging.judgedAt = new Date().toISOString();
      
      // Update the team data
      await set(ref(db, `teams/${teamId}/judging`), judging);
      
      // Update local state
      setJudgedTeams(prev => ({
        ...prev,
        [teamId]: newStatus
      }));
    } catch (error) {
      console.error("Error updating judged status:", error);
      alert("Failed to update judged status. Please try again.");
    }
  };

  const toggleCheckpoint = async (teamId: string, checkpoint: string) => {
    try {
      const newValue = !teamCheckpoints[teamId]?.[checkpoint];
      const checkpointRef = ref(db, `teams/${teamId}/checkpoints/${checkpoint}`);
      await set(checkpointRef, newValue);
      
      setTeamCheckpoints(prev => ({
        ...prev,
        [teamId]: {
          ...prev[teamId],
          [checkpoint]: newValue
        }
      }));
    } catch (error) {
      console.error('Error toggling checkpoint:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
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
            className="text-cyan-400 text-4xl"
          >
            ⟳
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="ml-4 text-cyan-400 font-mono"
          >
            Initializing_Admin_Console...
          </motion.p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="space-y-8">
          {/* Judge Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-purple-900/20 to-cyan-900/20 
              backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 overflow-hidden"
          >
            {/* Background Matrix Effect */}
            <div className="absolute inset-0 matrix-bg opacity-5"></div>

            {/* Console Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-purple-400 font-mono text-2xl">&gt;</span>
              <h2 className="text-2xl font-mono text-purple-400">Judge's_Console</h2>
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-purple-400 text-2xl"
              >
                _
              </motion.span>
            </div>

            {/* Quote Content */}
            <div className="relative ml-6">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-cyan-400 font-mono text-base leading-relaxed"
              >
                <span className="text-gray-500 block mb-2"># Today's wisdom:</span>
                <span className="text-purple-400">&gt; </span>
                <span className="italic text-cyan-300">"{randomQuote}"</span>
              </motion.p>
            </div>

            {/* Decorative Bottom Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1 }}
              className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Teams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/50 transition-all"
            >
              <h3 className="text-lg font-mono text-cyan-400">Total Teams</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-mono text-white">{stats.totalTeams}</span>
                <span className="text-sm font-mono text-gray-500">registered</span>
              </div>
            </motion.div>

            {/* Similar styling for other stat boxes */}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-purple-400 font-mono">&gt;</span>
            </div>
            <input
              type="text"
              placeholder="Search_Teams"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg pl-8 pr-4 py-2
                text-gray-300 font-mono focus:outline-none focus:border-purple-500/50 
                placeholder-gray-600"
            />
          </div>

          {/* Team List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono text-purple-400 mb-4 flex items-center gap-2">
              <span>{`> Participating_Teams`}</span>
              <span className="text-sm text-gray-500">[{filteredTeams.length}]</span>
            </h2>
            <div className="space-y-4">
              {filteredTeams.map(([id, team]) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/30 border border-gray-800 rounded-lg p-4 
                    hover:border-purple-500/30 transition-all group cursor-pointer"
                  onClick={() => toggleTeamExpansion(id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors flex items-center">
                        {team.teamName}
                        <span className="ml-2 text-xs text-gray-500">
                          {expandedTeamId === id ? '(click to collapse)' : '(click to expand)'}
                        </span>
                      </h3>
                      <p className="text-sm font-mono text-gray-400">{team.email}</p>
                      {team.githubRepo && (
                        <a 
                          href={team.githubRepo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <FaCode className="text-purple-500" />
                          {team.githubRepo.repoUrl.replace('https://github.com/', '')}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      <p className="text-xs font-mono text-gray-500 mt-1">
                        Registered: {new Date(team.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {team.projectSubmission ? (
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 
                          rounded-full text-emerald-400 text-xs font-mono">
                          Project Submitted
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 
                          rounded-full text-red-400 text-xs font-mono">
                          Submission Pending
                        </span>
                      )}
                      
                      {/* Checkpoints Status */}
                      <div className="flex gap-2">
                        {['C1', 'C2', 'C3', 'C4'].map((checkpoint, index) => (
                          <div 
                            key={checkpoint}
                            className="flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add your checkpoint toggle logic here
                              toggleCheckpoint(id, checkpoint);
                            }}
                          >
                            <div className={`
                              w-6 h-6 flex items-center justify-center rounded border 
                              ${team.checkpoints?.[checkpoint] 
                                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                                : 'bg-gray-800/30 border-gray-700 text-gray-500'} 
                              cursor-pointer hover:bg-purple-500/10 transition-colors
                            `}>
                              {checkpoint}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Existing Mark as Judged button */}
                      <div 
                        className={`px-3 py-1 ${judgedTeams[id] ? 'bg-purple-500/10 border-purple-500/30' : 'bg-gray-800/30 border-gray-700'} 
                          border rounded-full text-xs font-mono flex items-center cursor-pointer`}
                        onClick={(e) => toggleJudgedStatus(id, e)}
                      >
                        <div className={`w-4 h-4 mr-2 rounded border ${judgedTeams[id] ? 'bg-purple-500 border-purple-500' : 'bg-transparent border-gray-600'} flex items-center justify-center`}>
                          {judgedTeams[id] && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                        <span className={judgedTeams[id] ? 'text-purple-400' : 'text-gray-400'}>
                          {judgedTeams[id] ? 'Judged' : 'Mark as Judged'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedTeamId === id && team.projectSubmission && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {team.projectSubmission.liveDemo && (
                          <a
                            href={team.projectSubmission.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 
                              rounded-md text-cyan-400 font-mono text-sm hover:bg-cyan-500/20 
                              transition-all flex items-center justify-between group"
                          >
                            <span>Live Demo</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                        {team.projectSubmission.codeRepository && (
                          <a
                            href={team.projectSubmission.codeRepository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 
                              rounded-md text-purple-400 font-mono text-sm hover:bg-purple-500/20 
                              transition-all flex items-center justify-between group"
                          >
                            <span>Repository</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                        {team.projectSubmission.presentationUrl && (
                          <a
                            href={team.projectSubmission.presentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 
                              rounded-md text-emerald-400 font-mono text-sm hover:bg-emerald-500/20 
                              transition-all flex items-center justify-between group"
                          >
                            <span>Presentation</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                        {team.projectSubmission.documentation && (
                          <a
                            href={team.projectSubmission.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 
                              rounded-md text-yellow-400 font-mono text-sm hover:bg-yellow-500/20 
                              transition-all flex items-center justify-between group"
                          >
                            <span>Documentation</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                      </div>

                      {team.projectSubmission.techStack && (
                        <div className="mt-4">
                          <h4 className="text-cyan-400 font-mono text-sm mb-2">Tech Stack:</h4>
                          <p className="text-gray-300 font-mono text-sm">
                            {team.projectSubmission.techStack}
                          </p>
                        </div>
                      )}

                      {team.projectSubmission.problemStatement && (
                        <div className="mt-4">
                          <h4 className="text-cyan-400 font-mono text-sm mb-2">Problem Statement:</h4>
                          <p className="text-gray-300 font-mono text-sm">
                            {team.projectSubmission.problemStatement}
                          </p>
                        </div>
                      )}

                      {team.projectSubmission.solution && (
                        <div className="mt-4">
                          <h4 className="text-cyan-400 font-mono text-sm mb-2">Solution:</h4>
                          <p className="text-gray-300 font-mono text-sm">
                            {team.projectSubmission.solution}
                          </p>
                        </div>
                      )}

                      {team.githubRepo && (
                        <div className="mt-4">
                          <h4 className="text-cyan-400 font-mono text-sm mb-2">GitHub Repository:</h4>
                          <a 
                            href={team.githubRepo.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 font-mono text-sm hover:underline flex items-center"
                          >
                            <FaCode className="mr-2" />
                            {team.githubRepo.repoUrl.replace('https://github.com/', '')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <p className="text-gray-500 font-mono text-xs mt-1">
                            Connected: {new Date(team.githubRepo.lastUpdated).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 