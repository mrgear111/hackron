'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FaLightbulb } from 'react-icons/fa';

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
            <p className="mt-4 text-gray-400 font-mono">
              Choose one of the following problem statements for your project.
            </p>
          </div>

          {/* Problem Statements Grid */}
          <div className="grid grid-cols-1 gap-6">
            {problemStatements.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 
                  rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
              >
                <h2 className="text-xl font-mono text-cyan-400 mb-4 flex items-center gap-2">
                  <span className="text-sm text-cyan-500/70">{`${problem.id}.`}</span>
                  {problem.title}
                </h2>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
} 