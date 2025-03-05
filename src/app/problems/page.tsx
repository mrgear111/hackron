'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FaLightbulb, FaLock } from 'react-icons/fa';

const problemStatements = [
  {
    id: 1,
    title: "City-Wide Dark Store Network Projection",
    description: "Design a projection model to determine the ideal number, size, and location of Blinkit dark stores within a city, factoring in customer demand patterns, delivery time constraints, and operational costs."
  },
  {
    id: 2,
    title: "Smart Inventory Theft Detection System",
    description: "Build an AI-based anti-theft system that uses RFID sensors, computer vision, and inventory logs to detect discrepancies, suspicious activities, and unauthorized inventory movements in dark stores."
  },
  {
    id: 3,
    title: "Smart Dynamic Pricing System",
    description: "Design a platform that dynamically adjusts pricing for deliveries based on factors such as demand fluctuations, delivery urgency, route congestion, and available delivery staff. The system should optimize pricing in real-time to balance cost efficiency for customers and profitability for the service provider while ensuring fair and transparent pricing."
  },
  {
    id: 4,
    title: "Dark Store Management Platform",
    description: "Build a centralized dashboard that integrates inventory tracking, staff task management, store maintenance requests, and delivery scheduling into a single system."
  },
  {
    id: 5,
    title: "Heatmap-Based Store Placement Analysis",
    description: "Develop a heatmap visualization tool that combines order density, delivery delays, and population demographics to identify underserved areas and recommend new store locations."
  },
  {
    id: 6,
    title: "Expiry-Based Dynamic Discount System",
    description: "Create an automated pricing system that reduces prices of perishable products based on expiry dates, customer demand, and shelf time to minimize wastage."
  },
  {
    id: 7,
    title: "Real-Time Inventory Auditing System",
    description: "Design a system that conducts real-time audits by cross-verifying physical stock with digital inventory records using barcode scanning and weight sensors at regular intervals."
  },
  {
    id: 8,
    title: "Waste Management Automation in Dark Stores",
    description: "Design an automated waste segregation and disposal system that tracks expired products and sorts recyclable and non-recyclable waste."
  }
];

export default function Problems() {
  const isLocked = true; // We'll make this dynamic when you want to unlock it

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 
            backdrop-blur-sm border border-purple-500/30 rounded-lg p-8"
          >
            <h1 className="text-2xl font-mono text-purple-400 flex items-center gap-3">
              <FaLightbulb className="text-purple-500" />
              {`> Problem_Statements`}
            </h1>
          </div>

          {/* Locked Content Display */}
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <FaLock className="text-6xl text-purple-500/50" />
              <motion.div
                className="absolute inset-0 blur-xl bg-purple-500/20"
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.p 
              className="mt-8 text-xl font-mono text-purple-400/80 text-center"
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {`> Access_Restricted`}
            </motion.p>
            
            <p className="mt-4 text-gray-500 font-mono text-sm text-center max-w-md">
              Problem statements will be revealed when the competition begins.
            </p>

            {/* Matrix-like effect in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="w-full h-full opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
                animate={{
                  y: ["0%", "100%"]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 