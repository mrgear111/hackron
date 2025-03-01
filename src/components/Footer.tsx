import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative bg-black/90 border-t border-cyan-500/20 py-6 overflow-hidden">
      {/* Matrix-like Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between font-mono text-sm">
          {/* Creator Credit */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 8px rgba(34,211,238,0)",
                  "0 0 12px rgba(34,211,238,0.5)",
                  "0 0 8px rgba(34,211,238,0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400"
            >
              <span className="text-cyan-400">&gt;</span> Crafted_by
            </motion.span>
            <motion.span
              animate={{ 
                color: ["#67e8f9", "#818cf8", "#67e8f9"],
                textShadow: [
                  "0 0 8px rgba(103,232,249,0.3)",
                  "0 0 12px rgba(129,140,248,0.5)",
                  "0 0 8px rgba(103,232,249,0.3)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-bold relative"
            >
              <span className="relative z-10">Daksh</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-lg"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.span>
            <motion.span 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-purple-400"
            >
              |
            </motion.span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 flex items-center space-x-1"
            >
              <span>Vice_President</span>
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-cyan-400 inline-block"
              >
                _
              </motion.span>
              <motion.span
                animate={{
                  color: ["#a855f7", "#67e8f9", "#a855f7"],
                  textShadow: [
                    "0 0 8px rgba(168,85,247,0.3)",
                    "0 0 12px rgba(103,232,249,0.5)",
                    "0 0 8px rgba(168,85,247,0.3)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-bold"
              >
                DevClub
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Copyright */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-gray-400"
          >
            <span className="text-cyan-500/50">&gt;</span>
            <span>© 2024 Hackron. All rights reserved</span>
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-cyan-400"
            >
              _
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)'
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </footer>
  );
};

export default Footer; 