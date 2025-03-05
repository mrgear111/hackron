'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FaLightbulb } from 'react-icons/fa';

const problemStatements = [
  {
    id: 1,
    title: "City-Wide Dark Store Network Projection",
    description: "Develop a system for analyzing and projecting the expansion of dark stores across a city. It may involve demand forecasting, geographical analysis, and optimal placement for maximum efficiency and customer reach."
  },
  {
    id: 2,
    title: "Smart Inventory Theft Detection System",
    description: "A system that uses AI, IoT, and data analytics to detect theft in inventory management. It could involve real-time monitoring, anomaly detection, and alert mechanisms to prevent unauthorized access or theft."
  },
  {
    id: 3,
    title: "Smart Dynamic Pricing System",
    description: "Create a pricing system that adjusts product prices dynamically based on various factors like demand, stock levels, competitor pricing, and customer behavior, potentially using AI or machine learning for optimization."
  },
  {
    id: 4,
    title: "Dark Store Management Platform",
    description: "Design a comprehensive platform for managing dark stores, which includes inventory tracking, order management, staff coordination, and logistical planning. It should streamline operations for better efficiency."
  },
  {
    id: 5,
    title: "Real-Time Inventory Auditing System",
    description: "Build a system that allows for continuous, real-time auditing of inventory levels in warehouses or stores, minimizing the need for manual stock-taking and improving accuracy in inventory data."
  },
  {
    id: 6,
    title: "Expiry-Based Dynamic Discount System",
    description: "A system that automatically applies dynamic discounts to products nearing their expiration date, encouraging sales while reducing waste. It could integrate with inventory systems to monitor expiration and adjust pricing accordingly."
  },
  {
    id: 7,
    title: "Waste Management Automation in Dark Stores",
    description: "Create a solution to automate waste management processes in dark stores, including the efficient disposal, recycling, and reduction of waste. This might involve IoT integration, AI for predictive waste patterns, and sustainability features."
  },
  {
    id: 8,
    title: "Heatmap-Based Store Placement Analysis",
    description: "Develop an analytical tool that uses heatmaps to optimize store placements in a region. The system would analyze foot traffic, population density, and demand patterns to suggest ideal locations for new stores."
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