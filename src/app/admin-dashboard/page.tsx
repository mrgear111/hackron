'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get } from 'firebase/database';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      // Check if user is admin
      const adminRef = ref(db, 'admins');
      const snapshot = await get(adminRef);
      if (!snapshot.exists() || !Object.values(snapshot.val()).includes(user.email)) {
        router.push('/');
        return;
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-2xl text-cyan-400"
          >
            ⟳
          </motion.span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-mono text-cyan-400">
              {`> Admin_Dashboard`}
            </h1>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/70 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-lg font-mono text-cyan-400">Welcome Admin</h3>
              <p className="text-gray-400 font-mono text-sm mt-2">
                You have full access to manage teams and submissions
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gray-800/70 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-xl font-mono text-purple-400 mb-4">
              {`> Coming_Soon`}
            </h2>
            <ul className="space-y-2 text-gray-300 font-mono text-sm">
              <li>• Team Management</li>
              <li>• Submission Reviews</li>
              <li>• Analytics Dashboard</li>
              <li>• Export Functionality</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 