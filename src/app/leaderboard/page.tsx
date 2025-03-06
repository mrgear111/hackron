'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function Leaderboard() {
  const shortlistedTeams = [
    { name: "Humorous", color: "text-cyan-400" },
    { name: "Hack O' Giants", color: "text-cyan-400" },
    { name: "Coding Knights", color: "text-cyan-400" },
    { name: "402", color: "text-cyan-400" },
    { name: "Red Renegades", color: "text-cyan-400" },
    { name: "Int main", color: "text-cyan-400" },
    { name: "The Neural Network", color: "text-cyan-400" },
    { name: "Fantastic Four", color: "text-cyan-400" },
    { name: "Pixel_Perfect", color: "text-cyan-400" },
    { name: "codemonk", color: "text-cyan-400" },
    { name: "Skittles", color: "text-cyan-400" },
    { name: "JHC hub", color: "text-cyan-400" },
    { name: "Senorita", color: "text-cyan-400" },
    { name: "Techies", color: "text-cyan-400" },
    { name: "8 bit", color: "text-cyan-400" },
    { name: "localhost:8080", color: "text-cyan-400" }
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
          <h1 className="text-4xl font-mono text-cyan-400 mb-4">Shortlisted Teams</h1>
     
        </motion.div>

        <div className="grid gap-4 max-w-3xl mx-auto">
          {shortlistedTeams.map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center">
                <h3 className="text-xl font-mono text-cyan-400">
                  {`> ${team.name}`}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 