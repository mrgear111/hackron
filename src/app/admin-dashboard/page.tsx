'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get, set } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { FirebaseError } from 'firebase/app';
import { FaCode, FaLink, FaVideo, FaFileAlt, FaUser, FaFileCode, FaRocket, FaClipboardList, FaBell, FaSave, FaCheckCircle, FaEdit, FaCalculator, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

interface TeamData {
  teamName: string;
  email: string;
  createdAt: string;
  projectSubmission?: {
    liveDemo: string;
    demoVideoUrl?: string; // Added field
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
  evaluation?: TeamEvaluation;
}

interface Checkpoint1Evaluation {
  score_updater: number;
  comments?: string;
}

interface Checkpoint2Evaluation {
  tech_stack?: string;
  admin_tech_stack_score: number;
  implementation_score: number;
  comments?: string;
}

interface FinalCheckpointEvaluation {
  demo_link?: string;
  prod_link?: string;
  ppt_link?: string;
  code_quality_score: number;
  prod_working_score: number;
  solution_relevance_score: number;
  ppt_score: number;
  comments?: string;
}

interface BonusEvaluation {
  modality: number;
  accuracy: number;
  multi_level_orchestrator: number;
  comments?: string;
}

interface TeamEvaluation {
  checkpoint1?: Checkpoint1Evaluation;
  checkpoint2?: Checkpoint2Evaluation;
  final_checkpoint?: FinalCheckpointEvaluation;
  bonus?: BonusEvaluation;
  total_score: number;
  status: 'draft' | 'final';
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

// Keeping TeamScore for backward compatibility if needed, but mainly using TeamEvaluation now
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
  const [evaluationTab, setEvaluationTab] = useState<'c1' | 'c2' | 'final' | 'bonus' | 'summary'>('c1');

  // Initialization helper
  const getInitialEvaluation = (existing?: TeamEvaluation): TeamEvaluation => {
    return existing || {
      total_score: 0,
      status: 'draft',
      checkpoint1: { score_updater: 0 },
      checkpoint2: { admin_tech_stack_score: 0, implementation_score: 0, tech_stack: '' },
      final_checkpoint: {
        code_quality_score: 0,
        prod_working_score: 0,
        solution_relevance_score: 0,
        ppt_score: 0
      },
      bonus: { modality: 0, accuracy: 0, multi_level_orchestrator: 0 }
    };
  };

  const calculateTotalScore = (evalData: TeamEvaluation): number => {
    let total = 0;
    // Checkpoint 1
    if (evalData.checkpoint1) total += Number(evalData.checkpoint1.score_updater || 0);

    // Checkpoint 2
    if (evalData.checkpoint2) {
      total += Number(evalData.checkpoint2.admin_tech_stack_score || 0);
      total += Number(evalData.checkpoint2.implementation_score || 0);
    }

    // Final
    if (evalData.final_checkpoint) {
      total += Number(evalData.final_checkpoint.code_quality_score || 0);
      total += Number(evalData.final_checkpoint.prod_working_score || 0);
      total += Number(evalData.final_checkpoint.solution_relevance_score || 0);
      total += Number(evalData.final_checkpoint.ppt_score || 0);
    }

    // Bonus
    if (evalData.bonus) {
      total += Number(evalData.bonus.modality || 0);
      total += Number(evalData.bonus.accuracy || 0);
      total += Number(evalData.bonus.multi_level_orchestrator || 0);
    }

    return total;
  };

  const handleSaveEvaluation = async (teamId: string, newEval: TeamEvaluation, status: 'draft' | 'final') => {
    try {
      if (!auth.currentUser) return;

      const totalScore = calculateTotalScore(newEval);
      const evalToSave: TeamEvaluation = {
        ...newEval,
        total_score: totalScore,
        status,
        lastUpdatedBy: auth.currentUser.email || 'unknown',
        lastUpdatedAt: new Date().toISOString()
      };

      // Validation for final submission
      if (status === 'final') {
        // Check range 0-10 for regular scores, 0-5 for bonus
        // This is a basic check, detailed validation can be added
        if (
          (evalToSave.checkpoint1?.score_updater ?? 0) < 0 || (evalToSave.checkpoint1?.score_updater ?? 0) > 10 ||
          (evalToSave.checkpoint2?.admin_tech_stack_score ?? 0) < 0 || (evalToSave.checkpoint2?.admin_tech_stack_score ?? 0) > 10
          // ... add other checks
        ) {
          alert("Validation Error: specific scores must be within 0-10 range.");
          return;
        }
      }

      const evalRef = ref(db, `teams/${teamId}/evaluation`);
      await set(evalRef, evalToSave);

      // Update local state
      setTeams(prev => ({
        ...prev,
        [teamId]: {
          ...prev[teamId],
          evaluation: evalToSave
        }
      }));

      alert(`Evaluation ${status === 'draft' ? 'saved as draft' : 'finalized'} successfully!`);
    } catch (error) {
      console.error("Error saving evaluation:", error);
      alert("Failed to save evaluation");
    }
  };

  const updateEvaluationField = (teamId: string, fieldPath: string, value: any) => {
    setTeams(prev => {
      const team = prev[teamId];
      if (!team) return prev;

      const newEval = getInitialEvaluation(team.evaluation);
      // Helper to set nested value
      const parts = fieldPath.split('.');
      let current: any = newEval;
      for (let i = 0; i < parts.length - 1; i++) {
        // Ensure intermediate objects exist (though getInitialEvaluation handles most)
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;

      // Auto-update total score on the fly for preview
      newEval.total_score = calculateTotalScore(newEval);

      return {
        ...prev,
        [teamId]: {
          ...team,
          evaluation: newEval
        }
      };
    });
  };

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

  // Global Settings State
  const [isProblemsVisible, setIsProblemsVisible] = useState(false);

  // Fetch initial settings
  useEffect(() => {
    const settingsRef = ref(db, 'admin/settings/problemsVisible');
    onValue(settingsRef, (snapshot) => {
      setIsProblemsVisible(snapshot.val() || false);
    });
  }, []);

  const toggleProblemsVisibility = async () => {
    console.log("Toggling visibility...");
    try {
      const newValue = !isProblemsVisible;
      console.log("Setting to:", newValue);
      const settingsRef = ref(db, 'admin/settings/problemsVisible');
      await set(settingsRef, newValue);
      console.log("Full Success");
      // State updates automatically via listener
    } catch (error) {
      console.error("Error updating problems visibility:", error);
      alert("Failed to update visibility setting.");
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

          {/* Notification Console & Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      Active
                    </span>
                  </label>
                  <button
                    onClick={handleUpdateNotification}
                    className="ml-auto px-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 font-mono text-sm transition-all"
                  >
                    {`> Update`}
                  </button>
                </div>
              </div>
            </div>

            {/* Global Settings Console */}
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h2 className="text-xl font-mono text-purple-400 mb-4 flex items-center gap-2">
                <FaCalculator className="text-purple-500" />
                <span>{`> Global_Settings`}</span>
              </h2>
              <div className="space-y-6">
                {/* Problems Visibility Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-900/40 rounded-lg border border-gray-800">
                  <div>
                    <h3 className="text-gray-300 font-mono text-lg flex items-center gap-2">
                      <FaLightbulb className={isProblemsVisible ? "text-yellow-400" : "text-gray-600"} />
                      Problem Statements Visibility
                    </h3>
                    <p className="text-gray-500 text-sm font-mono mt-1">
                      {isProblemsVisible
                        ? "Currently VISIBLE to all teams."
                        : "Currently HIDDEN (Locked) for teams."}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isProblemsVisible}
                      onChange={toggleProblemsVisibility}
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
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
                      className="border-t border-gray-800 bg-black/40"
                    >
                      {(() => {
                        const evalData = getInitialEvaluation(team.evaluation);
                        const isFinalized = evalData.status === 'final';

                        return (
                          <div className="p-6">

                            {/* Evaluation Status Header */}
                            <div className="flex justify-between items-center mb-6 bg-black/40 p-4 rounded-lg border border-gray-800">
                              <div className="flex items-center gap-4">
                                <h3 className="text-xl font-mono text-cyan-400 flex items-center gap-2">
                                  <FaCalculator className="text-cyan-500" />
                                  Evaluation Console
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-mono border ${evalData.status === 'final'
                                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                  : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                                  }`}>
                                  Status: {evalData.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 font-mono">Current Total</p>
                                  <p className="text-2xl font-mono text-purple-400 font-bold">{evalData.total_score}</p>
                                </div>
                                <div className="flex gap-2">
                                  {!isFinalized && (
                                    <button
                                      onClick={() => handleSaveEvaluation(id, evalData, 'draft')}
                                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 font-mono text-sm flex items-center gap-2"
                                    >
                                      <FaEdit />
                                      Save Draft
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleSaveEvaluation(id, evalData, 'final')}
                                    disabled={isFinalized}
                                    className={`px-4 py-2 rounded font-mono text-sm flex items-center gap-2 border ${isFinalized
                                      ? 'bg-green-900/20 border-green-500/30 text-green-500 cursor-not-allowed'
                                      : 'bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/50 text-cyan-400'
                                      }`}
                                  >
                                    {isFinalized ? <FaCheckCircle /> : <FaSave />}
                                    {isFinalized ? 'Finalized' : 'Finalize Evaluation'}
                                  </button>
                                  {isFinalized && (
                                    <button
                                      onClick={() => handleSaveEvaluation(id, evalData, 'draft')}
                                      className="px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded border border-red-500/30 font-mono text-xs"
                                      title="Revert to Draft (Unlock)"
                                    >
                                      Unlock
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
                              {[
                                { id: 'c1', label: 'Checkpoint 1' },
                                { id: 'c2', label: 'Checkpoint 2' },
                                { id: 'final', label: 'Final Checkpoint' },
                                { id: 'bonus', label: 'Bonus' },
                                { id: 'summary', label: 'Summary' }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => setEvaluationTab(tab.id as any)}
                                  className={`px-6 py-3 font-mono text-sm transition-colors border-b-2 ${evaluationTab === tab.id
                                    ? 'border-cyan-500 text-cyan-400 bg-cyan-900/10'
                                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                                    }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-black/30 rounded-xl border border-gray-800 p-6 min-h-[400px]">

                              {/* CHECKPOINT 1 */}
                              {evaluationTab === 'c1' && (
                                <div className="space-y-6 max-w-2xl">
                                  <div className="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10 mb-6">
                                    <h4 className="text-lg font-mono text-cyan-400">Checkpoint 1: Early Progress</h4>
                                    <p className="text-sm text-gray-400 mt-1">Evaluate the team's initial progress and understanding.</p>
                                  </div>
                                  <div>
                                    <label className="block text-gray-400 font-mono text-sm mb-2">Progress Score (0-10) *</label>
                                    <input
                                      type="number"
                                      min="0" max="10"
                                      value={evalData.checkpoint1?.score_updater ?? 0}
                                      onChange={(e) => updateEvaluationField(id, 'checkpoint1.score_updater', parseInt(e.target.value) || 0)}
                                      className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
                                      disabled={isFinalized}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-gray-400 font-mono text-sm mb-2">Comments (Optional)</label>
                                    <textarea
                                      value={evalData.checkpoint1?.comments || ''}
                                      onChange={(e) => updateEvaluationField(id, 'checkpoint1.comments', e.target.value)}
                                      className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none h-24"
                                      placeholder="Add evaluation comments..."
                                      disabled={isFinalized}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* CHECKPOINT 2 */}
                              {evaluationTab === 'c2' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-6">
                                    <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10 mb-6">
                                      <h4 className="text-lg font-mono text-purple-400">Participant Submission</h4>
                                    </div>
                                    <div>
                                      <label className="block text-gray-500 font-mono text-xs mb-1">Tech Stack Used</label>
                                      <div className="bg-black/50 border border-gray-700 rounded p-3 text-gray-300 font-mono text-sm min-h-[100px]">
                                        {team.projectSubmission?.techStack || "No details provided yet."}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10 mb-6">
                                      <h4 className="text-lg font-mono text-cyan-400">Admin Evaluation</h4>
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 font-mono text-sm mb-2">Tech Stack Appropriateness (0-10)</label>
                                      <input
                                        type="number" min="0" max="10"
                                        value={evalData.checkpoint2?.admin_tech_stack_score ?? 0}
                                        onChange={(e) => updateEvaluationField(id, 'checkpoint2.admin_tech_stack_score', parseInt(e.target.value) || 0)}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
                                        disabled={isFinalized}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 font-mono text-sm mb-2">Implementation Quality (0-10)</label>
                                      <input
                                        type="number" min="0" max="10"
                                        value={evalData.checkpoint2?.implementation_score ?? 0}
                                        onChange={(e) => updateEvaluationField(id, 'checkpoint2.implementation_score', parseInt(e.target.value) || 0)}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
                                        disabled={isFinalized}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 font-mono text-sm mb-2">Comments (Optional)</label>
                                      <textarea
                                        value={evalData.checkpoint2?.comments || ''}
                                        onChange={(e) => updateEvaluationField(id, 'checkpoint2.comments', e.target.value)}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none h-24"
                                        placeholder="Add evaluation comments..."
                                        disabled={isFinalized}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* FINAL CHECKPOINT */}
                              {evaluationTab === 'final' && (
                                <div className="space-y-8">
                                  {/* Project Context Section (Read-Only) */}
                                  <div className="bg-black/40 rounded-lg border border-gray-800 p-6">
                                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/10 mb-6">
                                      <h4 className="text-lg font-mono text-blue-400">Project Context</h4>
                                      <p className="text-sm text-gray-400">Review the team's submission details.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                        <div>
                                          <h5 className="text-gray-500 font-mono text-md uppercase mb-2">Problem Statement</h5>
                                          <p className="text-gray-300 font-mono text-lg bg-black/50 p-3 rounded border border-gray-800">
                                            {team.projectSubmission?.problemStatement || "Not specified"}
                                          </p>
                                        </div>
                                        <div>
                                          <h5 className="text-gray-500 font-mono text-md uppercase mb-2">Solution Description</h5>
                                          <p className="text-gray-300 font-mono text-lg bg-black/50 p-3 rounded border border-gray-800">
                                            {team.projectSubmission?.solution || "Not specified"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        {team.projectSubmission?.videoWalkthrough && (
                                          <div>
                                            <h5 className="text-gray-500 font-mono text-md uppercase mb-2">Video Walkthrough</h5>
                                            <a
                                              href={team.projectSubmission.videoWalkthrough}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-3 bg-black/50 p-3 rounded border border-gray-800 hover:border-cyan-500/50 transition-colors group"
                                            >
                                              <div className="w-8 h-8 rounded bg-red-900/20 flex items-center justify-center text-red-500">
                                                <FaVideo />
                                              </div>
                                              <span className="text-cyan-400 text-sm font-mono group-hover:underline truncate">
                                                {team.projectSubmission.videoWalkthrough}
                                              </span>
                                            </a>
                                          </div>
                                        )}

                                        {/* Additional Details Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                          {(team.projectSubmission?.challenges || team.projectSubmission?.learnings) && (
                                            <div className="col-span-2">
                                              <h5 className="text-gray-500 font-mono text-md uppercase mb-2">Additional Info</h5>
                                              <div className="space-y-2">
                                                {team.projectSubmission.challenges && (
                                                  <div className="bg-black/50 p-3 rounded border border-gray-800">
                                                    <span className="text-purple-400 text-md block mb-1">Challenges:</span>
                                                    <span className="text-gray-300 text-lg">{team.projectSubmission.challenges}</span>
                                                  </div>
                                                )}
                                                {team.projectSubmission.learnings && (
                                                  <div className="bg-black/50 p-3 rounded border border-gray-800">
                                                    <span className="text-green-400 text-md block mb-1">Learnings:</span>
                                                    <span className="text-gray-300 text-lg">{team.projectSubmission.learnings}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                      <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/10 mb-6">
                                        <h4 className="text-lg font-mono text-purple-400">Initial Submission Links</h4>
                                      </div>
                                      <div className="space-y-3">
                                        {[
                                          { label: 'Live Demo', val: team.projectSubmission?.liveDemo, icon: <FaRocket /> },
                                          { label: 'Demo Video', val: team.projectSubmission?.demoVideoUrl, icon: <FaVideo /> },
                                          { label: 'Presentation', val: team.projectSubmission?.presentationUrl, icon: <FaFileAlt /> },
                                          { label: 'Repo', val: team.githubRepo?.repoUrl || team.projectSubmission?.codeRepository, icon: <FaCode /> }
                                        ].map((item, idx) => (
                                          <div key={idx} className="flex justify-between items-center bg-black/50 p-3 rounded border border-gray-800">
                                            <span className="text-gray-400 font-mono text-sm flex items-center gap-2">
                                              {item.icon} {item.label}
                                            </span>
                                            {item.val ? (
                                              <a href={item.val} target="_blank" className="text-cyan-400 text-xs hover:underline flex items-center gap-1">
                                                Open Link <FaLink />
                                              </a>
                                            ) : (
                                              <span className="text-red-500 text-xs flex items-center gap-1">
                                                <FaExclamationTriangle /> Missing
                                              </span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {/* Final Submission override inputs if needed */}
                                      <div className="mt-8 pt-6 border-t border-gray-800">
                                        <h5 className="text-gray-500 font-mono text-xs mb-4 uppercase">Final Deliverables (Admin Verified)</h5>
                                        <div className="space-y-3">
                                          <input
                                            type="text" placeholder="Verified Demo Link"
                                            value={evalData.final_checkpoint?.demo_link ?? ""}
                                            onChange={(e) => updateEvaluationField(id, 'final_checkpoint.demo_link', e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                                            disabled={isFinalized}
                                          />
                                          <input
                                            type="text" placeholder="Verified Presentation Link"
                                            value={evalData.final_checkpoint?.ppt_link ?? ""}
                                            onChange={(e) => updateEvaluationField(id, 'final_checkpoint.ppt_link', e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                                            disabled={isFinalized}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-900/10 mb-6">
                                        <h4 className="text-lg font-mono text-cyan-400">Final Scoring</h4>
                                      </div>
                                      {[
                                        { field: 'code_quality_score', label: 'Code Quality' },
                                        { field: 'prod_working_score', label: 'Production Working Quality' },
                                        { field: 'solution_relevance_score', label: 'Solution Relevance' },
                                        { field: 'ppt_score', label: 'Presentation Quality' }
                                      ].map((criteria) => (
                                        <div key={criteria.field}>
                                          <label className="block text-gray-400 font-mono text-sm mb-2">{criteria.label} (0-10)</label>
                                          <input
                                            type="number" min="0" max="10"
                                            value={(evalData.final_checkpoint as any)?.[criteria.field] ?? 0}
                                            onChange={(e) => updateEvaluationField(id, `final_checkpoint.${criteria.field}`, parseInt(e.target.value) || 0)}
                                            className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
                                            disabled={isFinalized}
                                          />
                                        </div>
                                      ))}
                                      <div>
                                        <label className="block text-gray-400 font-mono text-sm mb-2">Comments (Optional)</label>
                                        <textarea
                                          value={evalData.final_checkpoint?.comments || ''}
                                          onChange={(e) => updateEvaluationField(id, 'final_checkpoint.comments', e.target.value)}
                                          className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-cyan-500 focus:outline-none h-24"
                                          placeholder="Add evaluation comments..."
                                          disabled={isFinalized}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* BONUS */}
                              {evaluationTab === 'bonus' && (
                                <div className="max-w-2xl mx-auto space-y-6">
                                  <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10 mb-6">
                                    <h4 className="text-lg font-mono text-yellow-400">Bonus Points (Optional)</h4>
                                    <p className="text-sm text-gray-400">Additional points for exceptional achievements.</p>
                                  </div>
                                  {[
                                    { field: 'modality', label: 'Modality (Innovative Approach)' },
                                    { field: 'accuracy', label: 'Accuracy / Performance' },
                                    { field: 'multi_level_orchestrator', label: 'Multi-Level Orchestrator' }
                                  ].map((criteria) => (
                                    <div key={criteria.field}>
                                      <label className="block text-gray-400 font-mono text-sm mb-2">{criteria.label} (0-5)</label>
                                      <input
                                        type="number" min="0" max="5"
                                        value={(evalData.bonus as any)?.[criteria.field] ?? 0}
                                        onChange={(e) => updateEvaluationField(id, `bonus.${criteria.field}`, parseInt(e.target.value) || 0)}
                                        className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-yellow-500 focus:outline-none"
                                        disabled={isFinalized}
                                      />
                                    </div>
                                  ))}
                                  <div>
                                    <label className="block text-gray-400 font-mono text-sm mb-2">Comments (Optional)</label>
                                    <textarea
                                      value={evalData.bonus?.comments || ''}
                                      onChange={(e) => updateEvaluationField(id, 'bonus.comments', e.target.value)}
                                      className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white font-mono focus:border-yellow-500 focus:outline-none h-24"
                                      placeholder="Add evaluation comments..."
                                      disabled={isFinalized}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* SUMMARY */}
                              {evaluationTab === 'summary' && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                      <h4 className="text-lg font-mono text-cyan-400 mb-4 border-b border-gray-800 pb-2">Score Breakdown</h4>
                                      <div className="space-y-3 font-mono text-sm">
                                        <div className="flex justify-between text-gray-400">
                                          <span>Checkpoint 1</span>
                                          <span className="text-white">{evalData.checkpoint1?.score_updater || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                          <span>Checkpoint 2 (Tech + Impl)</span>
                                          <span className="text-white">
                                            {(evalData.checkpoint2?.admin_tech_stack_score || 0) + (evalData.checkpoint2?.implementation_score || 0)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                          <span>Final Checkpoint</span>
                                          <span className="text-white">
                                            {(evalData.final_checkpoint?.code_quality_score || 0) +
                                              (evalData.final_checkpoint?.prod_working_score || 0) +
                                              (evalData.final_checkpoint?.solution_relevance_score || 0) +
                                              (evalData.final_checkpoint?.ppt_score || 0)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-yellow-400">
                                          <span>Bonus</span>
                                          <span>
                                            {(evalData.bonus?.modality || 0) +
                                              (evalData.bonus?.accuracy || 0) +
                                              (evalData.bonus?.multi_level_orchestrator || 0)}
                                          </span>
                                        </div>
                                        <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between text-lg font-bold text-cyan-400">
                                          <span>TOTAL SCORE</span>
                                          <span>{evalData.total_score}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                                      <h4 className="text-lg font-mono text-purple-400 mb-4">Evaluation Metadata</h4>
                                      <div className="space-y-2 font-mono text-xs text-gray-500">
                                        <p>Last Updated: {evalData.lastUpdatedAt ? new Date(evalData.lastUpdatedAt).toLocaleString() : 'Never'}</p>
                                        <p>Updated By: {evalData.lastUpdatedBy || 'N/A'}</p>
                                        <p>Status: <span className={evalData.status === 'final' ? 'text-green-500' : 'text-yellow-500'}>{evalData.status.toUpperCase()}</span></p>
                                      </div>

                                      <div className="mt-8 p-4 bg-blue-900/10 border border-blue-500/20 rounded">
                                        <p className="text-blue-400 text-sm">
                                          <span className="font-bold">Note:</span> Ensuring fair and transparent evaluation.
                                          Finalized scores are locked but can be unlocked by Admins if necessary.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )
                  }
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 