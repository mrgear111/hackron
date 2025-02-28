'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import Navbar from '@/components/Navbar';

interface TeamData {
  teamName: string;
  email: string;
  createdAt: string;
}

export default function TeamDashboard() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

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
            <motion.button
              onClick={() => auth.signOut()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-md
                text-red-400 font-mono text-sm hover:bg-red-500/20 transition-colors"
            >
              {`> Terminate_Session`}
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono text-cyan-400 mb-4">
              {`> Project_Submissions`}
            </h2>
            <div className="text-gray-400 font-mono">
              No submissions yet...
            </div>
          </motion.div>

          {/* Team Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono text-purple-400 mb-4">
              {`> Team_Stats`}
            </h2>
            <div className="space-y-2 font-mono">
              <p className="text-gray-400">
                Member since: {new Date(teamData?.createdAt || '').toLocaleDateString()}
              </p>
              <p className="text-gray-400">
                Projects: 0
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono text-emerald-400 mb-4">
              {`> Quick_Actions`}
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 
                rounded-md text-emerald-400 font-mono text-sm hover:bg-emerald-500/20 transition-colors">
                {`> Submit_New_Project`}
              </button>
              <button className="w-full px-4 py-2 bg-blue-500/10 border border-blue-500/30 
                rounded-md text-blue-400 font-mono text-sm hover:bg-blue-500/20 transition-colors">
                {`> View_Submissions`}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 