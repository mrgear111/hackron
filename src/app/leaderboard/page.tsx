'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FaTrophy } from 'react-icons/fa';

export default function Leaderboard() {
  const shortlistedTeams = [
    { name: "Humorous", badge: "🏆", color: "text-yellow-400" },
    { name: "Hack O' Giants", badge: "🚀", color: "text-cyan-400" },
    { name: "Coding Knights", badge: "⭐", color: "text-purple-400" },
    { name: "402", badge: "✨", color: "text-blue-400" },
    { name: "Red Renegades", badge: "💫", color: "text-red-400" },
    { name: "Int main", badge: "🧠", color: "text-green-400" },
    { name: "The Neural Network", badge: "🎯", color: "text-indigo-400" },
    { name: "Fantastic Four", badge: "🌟", color: "text-amber-400" },
    { name: "Pixel_Perfect", badge: "💻", color: "text-teal-400" },
    { name: "codemonk", badge: "⚡", color: "text-pink-400" },
    { name: "Skittles", badge: "🌈", color: "text-violet-400" },
    { name: "JHC hub", badge: "🎨", color: "text-emerald-400" },
    { name: "Senorita", badge: "🔮", color: "text-fuchsia-400" },
    { name: "Techies", badge: "💡", color: "text-lime-400" },
    { name: "8 bit", badge: "🎮", color: "text-orange-400" },
    { name: "localhost:8080", badge: "🌐", color: "text-sky-400" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-mono text-cyan-400 mb-4">🌟 Shortlisted Teams 🌟</h1>
          <p className="text-gray-400 font-mono">Celebrating the innovative minds of Code Odyssey!</p>
        </motion.div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {shortlistedTeams.map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-900 to-black border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{team.badge}</span>
                <div>
                  <h3 className={`text-xl font-mono ${team.color}`}>
                    {team.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 