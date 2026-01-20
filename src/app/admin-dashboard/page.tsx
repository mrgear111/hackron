'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get, set } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { FirebaseError } from 'firebase/app';
import { FaCode, FaLink, FaVideo, FaFileAlt, FaUser, FaFileCode, FaRocket, FaClipboardList, FaBell } from 'react-icons/fa';

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
    challenges?: string;
    learnings?: string;
  };
  githubRepo?: {
    repoUrl: string;
    lastUpdated: string;
  };
  checkpoints?: Record<string, boolean>;
  submissionUrl?: string;
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
  const [activeFilter, setActiveFilter] = useState<"all" | "projectSubmitted" | "submissionUrl">("all");
  const [judgedTeams, setJudgedTeams] = useState<Record<string, boolean>>({});
  const [teamCheckpoints, setTeamCheckpoints] = useState<Record<string, Record<string, boolean>>>({});

  // Notification State
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Fetch current notification on load
  useEffect(() => {
    const notificationRef = ref(db, 'admin/notification');
    onValue(notificationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotificationMsg(data.text || '');
        setIsUrgent(data.isUrgent || false);
        setIsActive(data.active || false);
      }
    });
  }, []);

  const handleUpdateNotification = async () => {
    try {
      if (!auth.currentUser) return;

      const notificationRef = ref(db, 'admin/notification');
      await set(notificationRef, {
        text: notificationMsg,
        isUrgent,
        active: isActive,
        lastUpdated: new Date().toISOString(),
        updatedBy: auth.currentUser.email
      });

      alert('Notification broadcast updated successfully!');
    } catch (error) {
      console.error('Error updating notification:', error);
      alert('Failed to update notification');
    }
  };

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

  const filteredTeams = Object.entries(teams).filter(([_, team]) => {
    // First check if the team matches the search term (allowing spaces)
    const matchesSearch = searchTerm === '' ||
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Then check if it matches the active filter
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "projectSubmitted" && team.projectSubmission !== undefined) ||
      (activeFilter === "submissionUrl" && team.submissionUrl !== undefined);

    return matchesSearch && matchesFilter;
  });

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

          {/* Notification Console */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-xl font-mono text-cyan-400 mb-4 flex items-center gap-2">
              <FaBell className="text-cyan-500" />
              <span>{`> Notification_Console`}</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 font-mono text-sm mb-2">Message Content:</label>
                <textarea
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                  className="w-full bg-black/30 border border-cyan-500/30 rounded-lg p-3 text-gray-300 font-mono focus:outline-none focus:border-cyan-500 h-24"
                  placeholder="Enter notification message..."
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-black/30 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span className={`font-mono text-sm ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
                    Mark as Urgent
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-black/30 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span className={`font-mono text-sm ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
                    Active (Visible to Teams)
                  </span>
                </label>
                <button
                  onClick={handleUpdateNotification}
                  className="ml-auto px-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 font-mono text-sm transition-all"
                >
                  {`> Update_Broadcast`}
                </button>
              </div>
            </div>
          </div>

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

          {/* Add this new filter buttons section */}
          <div className="mb-6 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-md font-mono text-sm ${activeFilter === "all"
                ? "bg-cyan-600/80 text-white"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
            >
              All Teams
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter("projectSubmitted")}
              className={`px-4 py-2 rounded-md font-mono text-sm flex items-center gap-2 ${activeFilter === "projectSubmitted"
                ? "bg-purple-600/80 text-white"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
            >
              <FaFileCode />
              Project Submitted
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter("submissionUrl")}
              className={`px-4 py-2 rounded-md font-mono text-sm flex items-center gap-2 ${activeFilter === "submissionUrl"
                ? "bg-green-600/80 text-white"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
            >
              <FaLink />
              Submission URL Added
            </motion.button>
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
                  className={`bg-black/40 backdrop-blur-sm border ${expandedTeamId === id
                    ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'border-gray-800'
                    } rounded-lg overflow-hidden transition-all duration-300`}
                >
                  {/* Team Header */}
                  <div
                    className={`p-4 cursor-pointer ${expandedTeamId === id
                      ? 'bg-gradient-to-r from-cyan-500/5 to-transparent'
                      : 'hover:bg-gray-800/30'
                      } transition-colors duration-300`}
                    onClick={() => setExpandedTeamId(expandedTeamId === id ? null : id)}
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
                        {team.submissionUrl && (
                          <a
                            href={team.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <FaLink className="text-cyan-500" />
                            {team.submissionUrl}
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
                  </div>

                  {/* Expanded Details */}
                  {expandedTeamId === id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-800"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Basic Info Section */}
                          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                            <h4 className="text-cyan-400 font-mono text-sm mb-3 flex items-center">
                              <FaUser className="mr-2" />
                              Team Information
                            </h4>
                            <div className="space-y-2 ml-4">
                              <p className="text-gray-300 font-mono text-sm">
                                <span className="text-purple-400">Team Name:</span> {team.teamName}
                              </p>
                              <p className="text-gray-300 font-mono text-sm">
                                <span className="text-purple-400">Email:</span> {team.email}
                              </p>
                              <p className="text-gray-300 font-mono text-sm">
                                <span className="text-purple-400">Registered:</span> {new Date(team.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Project Details Section */}
                          {team.projectSubmission && (
                            <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                              <h4 className="text-cyan-400 font-mono text-sm mb-3 flex items-center">
                                <FaFileCode className="mr-2" />
                                Project Details
                              </h4>
                              <div className="space-y-4 ml-4">
                                <div>
                                  <h5 className="text-purple-400 font-mono text-xs mb-1">Problem Statement:</h5>
                                  <p className="text-gray-300 font-mono text-sm">
                                    {team.projectSubmission.problemStatement}
                                  </p>
                                </div>
                                <div>
                                  <h5 className="text-purple-400 font-mono text-xs mb-1">Solution:</h5>
                                  <p className="text-gray-300 font-mono text-sm">
                                    {team.projectSubmission.solution}
                                  </p>
                                </div>
                                <div>
                                  <h5 className="text-purple-400 font-mono text-xs mb-1">Tech Stack:</h5>
                                  <p className="text-gray-300 font-mono text-sm">
                                    {team.projectSubmission.techStack}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Project URLs Section */}
                          {team.projectSubmission && (
                            <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                              <h4 className="text-cyan-400 font-mono text-sm mb-3 flex items-center">
                                <FaLink className="mr-2" />
                                Project Links
                              </h4>
                              <div className="space-y-3 ml-4">
                                {team.projectSubmission.liveDemo && (
                                  <a
                                    href={team.projectSubmission.liveDemo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 font-mono text-sm hover:text-cyan-400 flex items-center"
                                  >
                                    <FaRocket className="mr-2" />
                                    Live Demo
                                  </a>
                                )}
                                {team.projectSubmission.videoWalkthrough && (
                                  <a
                                    href={team.projectSubmission.videoWalkthrough}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 font-mono text-sm hover:text-cyan-400 flex items-center"
                                  >
                                    <FaVideo className="mr-2" />
                                    Video Walkthrough
                                  </a>
                                )}
                                {team.projectSubmission.presentationUrl && (
                                  <a
                                    href={team.projectSubmission.presentationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 font-mono text-sm hover:text-cyan-400 flex items-center"
                                  >
                                    <FaFileAlt className="mr-2" />
                                    Presentation
                                  </a>
                                )}
                                {team.githubRepo && (
                                  <a
                                    href={team.githubRepo.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 font-mono text-sm hover:text-cyan-400 flex items-center"
                                  >
                                    <FaCode className="mr-2" />
                                    GitHub Repository
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Additional Details Section */}
                          {team.projectSubmission && (
                            <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                              <h4 className="text-cyan-400 font-mono text-sm mb-3 flex items-center">
                                <FaClipboardList className="mr-2" />
                                Additional Details
                              </h4>
                              <div className="space-y-4 ml-4">
                                {team.projectSubmission.documentation && (
                                  <div>
                                    <h5 className="text-purple-400 font-mono text-xs mb-1">Documentation:</h5>
                                    <p className="text-gray-300 font-mono text-sm">
                                      {team.projectSubmission.documentation}
                                    </p>
                                  </div>
                                )}
                                {team.projectSubmission.challenges && (
                                  <div>
                                    <h5 className="text-purple-400 font-mono text-xs mb-1">Challenges:</h5>
                                    <p className="text-gray-300 font-mono text-sm">
                                      {team.projectSubmission.challenges}
                                    </p>
                                  </div>
                                )}
                                {team.projectSubmission.learnings && (
                                  <div>
                                    <h5 className="text-purple-400 font-mono text-xs mb-1">Learnings:</h5>
                                    <p className="text-gray-300 font-mono text-sm">
                                      {team.projectSubmission.learnings}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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