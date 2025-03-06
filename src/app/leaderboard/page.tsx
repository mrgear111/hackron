'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

export default function Leaderboard() {
  const finalRankings = [
    { name: "Humorous", rank: 1, badge: "🏆", color: "text-yellow-400" },
    { name: "Hack O' Giants", rank: 2, badge: "🥈", color: "text-gray-300" },
    { name: "Coding Knights", rank: 3, badge: "🥉", color: "text-orange-400" },
    { name: "402", rank: 4, badge: "⭐", color: "text-cyan-400" },
    { name: "Red Renegades", rank: 5, badge: "🚀", color: "text-red-400" },
    { name: "Int main", rank: 6, badge: "💫", color: "text-purple-400" },
    { name: "The Neural Network", rank: 7, badge: "🧠", color: "text-green-400" },
    { name: "Fantastic Four", rank: 8, badge: "✨", color: "text-blue-400" },
    { name: "Pixel_Perfect", rank: 9, badge: "🎨", color: "text-pink-400" },
    { name: "codemonk", rank: 10, badge: "🎯", color: "text-indigo-400" },
    { name: "Skittles", rank: 11, badge: "🌈", color: "text-violet-400" },
    { name: "JHC hub", rank: 12, badge: "💻", color: "text-teal-400" },
    { name: "Senorita", rank: 13, badge: "🌟", color: "text-amber-400" },
    { name: "Techies", rank: 14, badge: "⚡", color: "text-lime-400" },
    { name: "8 bit", rank: 15, badge: "🎮", color: "text-emerald-400" }
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
          <h1 className="text-4xl font-mono text-cyan-400 mb-4">🏆 Champions of Innovation 🏆</h1>
          <p className="text-gray-400 font-mono">Celebrating the brilliant minds who shaped the future!</p>
        </motion.div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {finalRankings.map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-900 to-black border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{team.badge}</span>
                  <div>
                    <h3 className={`text-xl font-mono ${team.color}`}>
                      {team.name}
                    </h3>
                    <p className="text-gray-500 font-mono text-sm">
                      Rank #{team.rank}
                    </p>
                  </div>
                </div>
                {team.rank <= 3 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    {team.rank === 1 && <FaTrophy className="text-yellow-400" />}
                    {team.rank === 2 && <FaMedal className="text-gray-300" />}
                    {team.rank === 3 && <FaMedal className="text-orange-400" />}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 