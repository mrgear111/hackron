'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: "Checkpoint 1 Alert! 🚀\nAll teams must update their project on GitHub, be ready, and move to their designated places now!",
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group px-3 py-2"
      >
        {/* Glowing background effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Bell icon with glow */}
        <div className="relative">
          <FaBell className="text-cyan-400 h-6 w-6 group-hover:text-cyan-300 transition-colors relative z-10" />
          <motion.div
            className="absolute inset-0 bg-cyan-500 filter blur-md opacity-50"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Notification count badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              boxShadow: [
                "0 0 0 0 rgba(168,85,247,0.4)",
                "0 0 0 8px rgba(168,85,247,0)",
              ]
            }}
            transition={{
              boxShadow: {
                duration: 1.5,
                repeat: Infinity,
              }
            }}
            className="absolute -top-1 -right-1 bg-purple-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center z-20"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-black/90 border border-cyan-500/30 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                  <FaBell className="text-cyan-500" />
                  {`> System_Alerts [${notifications.length}]`}
                </h3>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-cyan-500"
                />
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-4 border border-cyan-500/30 rounded-md overflow-hidden"
                  >
                    {/* Glowing border effect */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      animate={{
                        background: [
                          'linear-gradient(90deg, transparent, rgba(34,211,238,0.2), transparent)',
                          'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    
                    <p className="text-gray-300 font-mono text-sm whitespace-pre-line">
                      {notification.message}
                    </p>
                    <p className="text-cyan-500/50 font-mono text-xs mt-3">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 