'use client';  // Add this at the top since we're using client-side features

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/utils/animations";
import { useRef, useEffect, useState } from "react";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const eventDetails = {
    mainInfo: [
      { icon: "🚀", label: "24'Hrs Hackathon", value: "Non-Stop Coding" },
      { icon: "📅", label: "Date", value: "5th March" },
      { icon: "📍", label: "Venue", value: "Lab 1 & 2" },
      { icon: "👥", label: "Participants", value: "UG students" },
      { icon: "💰", label: "Prize Pool", value: "60k" },
    ],
    timeline: [
      { time: "07:30 - 09:00", event: "Registration", desc: "" },
      { time: "09:00 - 10:00", event: "Opening and briefing", desc: "" },
      { time: "10:00 - 10:30", event: "Settling down and allocation", desc: "" },
      { time: "10:30", event: "Start of Hackathon", desc: "" },
      { time: "13:00 - 13:30", event: "Checkpoint 1", desc: "" },
      { time: "14:00 - 15:00", event: "Lunch", desc: "" },
      { time: "18:00 - 19:00", event: "Checkpoint 2", desc: "" },
      { time: "20:30 - 21:00", event: "Dinner", desc: "" },
      { time: "22:00 - 22:30", event: "Security Check", desc: "" },
      { time: "00:00 - 01:00", event: "Checkpoint 3", desc: "" },
      { time: "07:00 - 08:00", event: "Checkpoint 4", desc: "" },
      { time: "10:00 - 11:00", event: "Project Submission", desc: "" },
      { time: "11:00 - 14:00", event: "Solution Presentation", desc: "" },
      { time: "14:00 - 15:00", event: "Lunch", desc: "" },
      { time: "15:00 - 16:00", event: "Prize distribution + closing", desc: "" },
    ],
    judgingCriteria: [
      { title: "Problem Statement", desc: "Complexity & Relevance" },
      { title: "Approach & Implementation", desc: "Logical Thinking & Execution" },
      { title: "Solution Analysis", desc: "Code Quality & Efficiency" },
      { title: "Presentation", desc: "Clarity & Communication" },
      { title: "Innovation", desc: "Creativity & Uniqueness" },
    ]
  };

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax effect for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0]);

  const eventDetailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize any Firebase-dependent code here
  }, []);

  useEffect(() => {
    // Simulate loading time (you can remove this setTimeout if you have actual loading tasks)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen overflow-hidden">
      {/* Background Video - Added at the very top */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/bg.mp4"
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Loading Animation */}
      {loading && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 relative"
            >
              <motion.div 
                className="text-4xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34,211,238,0.5)",
                    "0 0 35px rgba(34,211,238,0.3)",
                    "0 0 20px rgba(34,211,238,0.5)"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                HACKRON_2025
              </motion.div>
              
              {/* Glitch effect */}
              <motion.div
                className="absolute inset-0 text-4xl md:text-6xl font-bold font-mono text-cyan-400/30"
                animate={{
                  x: [-2, 2, -2],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                HACKRON_2025
              </motion.div>
            </motion.div>
            
            {/* Loading bar */}
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Scanning effect */}
              <motion.div
                className="absolute top-0 left-0 h-full w-[20%] bg-white/50"
                animate={{ 
                  x: ["-100%", "500%"],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            {/* Loading text */}
            <motion.div 
              className="mt-4 font-mono text-cyan-400/70 flex items-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span>INITIALIZING</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.1 }}
                className="ml-1"
              >
                _
              </motion.span>
            </motion.div>
            
            {/* System messages */}
            <div className="mt-6 font-mono text-xs text-gray-500 max-w-xs text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                &gt; Loading system modules...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                &gt; Establishing secure connection...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                &gt; Preparing hackathon environment...
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Grid Pattern */}
      <motion.div 
        className="fixed inset-0 bg-grid-pattern pointer-events-none"
        style={{ opacity: gridOpacity, y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black/50 to-black pointer-events-none"></div>
      
      <Navbar />
      
      <main ref={scrollRef}>
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-[40vh] mb-12 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-yellow-900/10 to-black" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          
          {/* Animated Lines */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-yellow-400/20"
                style={{ top: `${20 * i}%`, left: 0, right: 0 }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scaleX: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Side - Text */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1"
              >
                <div className="inline-block mb-4 px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                  <span className="font-mono text-yellow-400 text-sm">Powered by</span>
                </div>
                <motion.div
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(234,179,8,0)",
                      "0 0 20px rgba(234,179,8,0.5)",
                      "0 0 20px rgba(234,179,8,0)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <h1 className="text-4xl md:text-6xl font-bold font-mono text-yellow-400 mb-2">
                    BLINKIT x HACKRON
                  </h1>
                  <p className="text-xl text-yellow-500/80">Delivering Innovation at Lightning Speed</p>
                </motion.div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl font-bold text-yellow-400"
                    >
                      10
                    </motion.div>
                    <div className="text-sm text-gray-400">Minute Delivery</div>
                  </div>
                  <div className="text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      className="text-3xl font-bold text-yellow-400"
                    >
                      24H
                    </motion.div>
                    <div className="text-sm text-gray-400">Innovation</div>
                  </div>
                  <div className="text-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      className="text-3xl font-bold text-yellow-400"
                    >
                      60K
                    </motion.div>
                    <div className="text-sm text-gray-400">Prize Pool</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Logo & Effects */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-64 h-64 md:w-96 md:h-96"
              >
                {/* Rotating circles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 border-2 border-dashed border-yellow-500/20 rounded-full"
                      style={{
                        transform: `scale(${0.8 + i * 0.2}) rotate(${i * 30}deg)`,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Blinkit Logo */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    filter: [
                      'drop-shadow(0 0 20px rgba(234,179,8,0.2))',
                      'drop-shadow(0 0 40px rgba(234,179,8,0.4))',
                      'drop-shadow(0 0 20px rgba(234,179,8,0.2))'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src="/logo.png"
                    alt="Blinkit Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </motion.div>

                {/* Lightning effects */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-b from-yellow-400 to-transparent"
                    style={{ 
                      transformOrigin: '50% 0%',
                      rotate: `${i * 90}deg`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scaleY: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Event Details Section */}
        <motion.section
          ref={eventDetailsRef}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative py-20 px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900 to-gray-900"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1])
            }}
          />
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="text-3xl font-mono">
                <span className="text-cyan-400">&gt; </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  24'Hrs Hackathon Event
                </span>
              </h2>
            </motion.div>

            {/* Event Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-8 mb-12"
            >
              {/* Main Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="text-cyan-400 font-mono text-sm mb-1">&gt; Date</div>
                  <div className="text-gray-300 font-mono">📅 5th March</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-mono text-sm mb-1">&gt; Venue</div>
                  <div className="text-gray-300 font-mono">📍 Lab 1 & 2</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-mono text-sm mb-1">&gt; Participants</div>
                  <div className="text-gray-300 font-mono">👥 UG students</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-mono text-sm mb-1">&gt; Prize_Pool</div>
                  <div className="text-gray-300 font-mono">💰 60k</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-12">
                <div className="text-xl font-mono text-cyan-400 mb-6 flex items-center">
                  <span>&gt; Event_Timeline</span>
                  <div className="h-[1px] flex-grow ml-4 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                </div>
                
                {/* Professional timeline with day separation */}
                <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                  {/* Day 1 */}
                  <div className="mb-6">
                    <div className="text-cyan-400 font-mono text-lg mb-3 border-b border-cyan-500/20 pb-2">Day 1</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventDetails.timeline.slice(0, 9).map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 * index }}
                          className="bg-gray-900/50 border border-gray-800 rounded p-3 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <div className="text-purple-400 font-mono text-sm">{item.time}</div>
                          </div>
                          <div className="text-gray-200 font-mono text-base mb-1">{item.event}</div>
                          <div className="text-gray-400 text-xs font-mono">{item.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Day 2 */}
                  <div>
                    <div className="text-cyan-400 font-mono text-lg mb-3 border-b border-cyan-500/20 pb-2">Day 2</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventDetails.timeline.slice(9).map((item, index) => (
                        <motion.div
                          key={index + 9}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 * (index + 9) }}
                          className="bg-gray-900/50 border border-gray-800 rounded p-3 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <div className="text-purple-400 font-mono text-sm">{item.time}</div>
                          </div>
                          <div className="text-gray-200 font-mono text-base mb-1">{item.event}</div>
                          <div className="text-gray-400 text-xs font-mono">{item.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Judging Criteria */}
              <div>
                <div className="text-xl font-mono text-cyan-400 mb-4">&gt; Judging_Criteria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">01</span>
                    <div>
                      <div className="text-gray-300">Problem Statement</div>
                      <div className="text-gray-500 text-sm">Complexity & Relevance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">02</span>
                    <div>
                      <div className="text-gray-300">Approach & Implementation</div>
                      <div className="text-gray-500 text-sm">Logical Thinking & Execution</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">03</span>
                    <div>
                      <div className="text-gray-300">Solution Analysis</div>
                      <div className="text-gray-500 text-sm">Code Quality & Efficiency</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">04</span>
                    <div>
                      <div className="text-gray-300">Presentation</div>
                      <div className="text-gray-500 text-sm">Clarity & Communication</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400">05</span>
                    <div>
                      <div className="text-gray-300">Innovation</div>
                      <div className="text-gray-500 text-sm">Creativity & Uniqueness</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Add Login Modal */}
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </main>
    </div>
  );
}
