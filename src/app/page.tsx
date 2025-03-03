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
      { time: "07:30 - 09:00", event: "Registration", desc: "Rashi Tulshyan" },
      { time: "09:00 - 10:00", event: "Opening and briefing", desc: "Blinkit Introduction" },
      { time: "10:00 - 10:30", event: "Settling down and allocation", desc: "Wifi setup" },
      { time: "10:30", event: "Start of Hackathon", desc: "Rashi Tulshyan" },
      { time: "13:00 - 13:30", event: "Checkpoint 1", desc: "Krushn Dayshmookh" },
      { time: "14:00 - 15:00", event: "Lunch", desc: "Rashi Tulshyan" },
      { time: "18:00 - 19:00", event: "Checkpoint 2", desc: "Krushn Dayshmookh" },
      { time: "20:30 - 21:00", event: "Dinner", desc: "Rashi Tulshyan" },
      { time: "22:00 - 22:30", event: "Security Check", desc: "Checking teams inside campus" },
      { time: "00:00 - 01:00", event: "Checkpoint 3", desc: "Raghav Khandelwal" },
      { time: "07:00 - 08:00", event: "Checkpoint 4", desc: "Raghav Khandelwal" },
      { time: "10:00 - 11:00", event: "Project Submission", desc: "Rashi Tulshyan" },
      { time: "11:00 - 14:00", event: "Solution Presentation", desc: "w Blinkit team" },
      { time: "14:00 - 15:00", event: "Lunch", desc: "Rashi Tulshyan" },
      { time: "15:00 - 16:00", event: "Prize distribution + closing", desc: "Blinkit team" },
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
      
      {/* Animated Background Elements */}
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
          {/* Video Background with Enhanced Effects */}
          <div className="absolute inset-0">
            {/* Single video background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute w-full h-full object-cover opacity-40"
              style={{ pointerEvents: "none" }}
            >
              <source src="/bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Enhanced overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/80"></div>
            
            {/* Animated scan lines */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-full h-[1px] bg-cyan-400/50"
                  style={{ top: `${i * 10}%` }}
                  animate={{
                    x: ["-100%", "100%"],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 3 + i % 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            
            {/* Matrix-style vertical data streams */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-[1px] h-screen bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
                  style={{ left: `${i * 5}%` }}
                  animate={{
                    y: ["-100%", "100%"],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 7 + i % 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            {/* Enhanced Glowing Accent Line */}
            <div className="relative">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5 }}
                className="h-px w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              />
              
              {/* Scanning effect */}
              <motion.div
                className="absolute top-0 left-0 h-full w-[30%] bg-cyan-400/80"
                animate={{ 
                  x: ["-100%", "400%"],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Enhanced Title with Glitch Effect */}
            <div className="relative mb-6">
              <motion.div
                className="absolute -inset-8 rounded-full opacity-20 blur-3xl"
                animate={{
                  background: [
                    "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)"
                  ],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold font-mono relative"
              >
                <motion.span
                  className="text-cyan-400 inline-block"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34,211,238,0.5)",
                      "0 0 20px rgba(34,211,238,0.8)",
                      "0 0 10px rgba(34,211,238,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  &gt;
                </motion.span>{" "}
                
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    HACKRON_2025
                  </span>
                  
                  {/* Glitch effect layers */}
                  <motion.span
                    className="absolute left-0 top-0 text-cyan-400/30"
                    animate={{
                      x: [-2, 2, -2],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      times: [0, 0.2, 1]
                    }}
                  >
                    HACKRON_2025
                  </motion.span>
                  
                  <motion.span
                    className="absolute left-0 top-0 text-blue-400/30"
                    animate={{
                      x: [2, -2, 2],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      times: [0, 0.2, 1],
                      delay: 0.1
                    }}
                  >
                    HACKRON_2025
                  </motion.span>
                </span>
                
                <motion.span
                  animate={{ 
                    opacity: [1, 0],
                    textShadow: [
                      "0 0 10px rgba(34,211,238,0.7)",
                      "0 0 5px rgba(34,211,238,0.3)"
                    ]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-cyan-400 ml-2"
                >
                  |
                </motion.span>
              </motion.h1>
            </div>

            {/* Enhanced Animated Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="text-gray-300 text-lg md:text-xl mb-12 font-mono flex items-center justify-center gap-2">
                <motion.span
                  className="text-cyan-400"
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(34,211,238,0.3)",
                      "0 0 10px rgba(34,211,238,0.7)",
                      "0 0 5px rgba(34,211,238,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  $
                </motion.span>
                
                <motion.span
                  animate={{
                    color: ["#94a3b8", "#22d3ee", "#94a3b8"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Initialize_Innovation.exe
                </motion.span>
                
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-cyan-400 inline-block"
                >
                  _
                </motion.span>
              </div>
              
              {/* Enhanced border with animation */}
              <div className="relative h-[1px] w-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                
                <motion.div
                  className="absolute inset-0 w-[40%] bg-cyan-400/50"
                  animate={{ 
                    x: ["-100%", "300%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1.5
                  }}
                />
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLoginModalOpen(true)}
                className="group relative px-8 py-3 bg-cyan-500/10 border border-cyan-500/30
                  rounded-md text-cyan-400 hover:bg-cyan-500/20 font-mono overflow-hidden"
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400/50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-400/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-400/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-400/50" />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Scan line effect */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[1px] bg-cyan-400/80 w-0"
                  animate={{ 
                    width: ["0%", "100%", "0%"],
                    x: ["0%", "0%", "100%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {`> Register_Now`}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  eventDetailsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-3 bg-purple-500/10 border border-purple-500/30
                  rounded-md text-purple-400 hover:bg-purple-500/20 font-mono overflow-hidden"
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-purple-400/50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-purple-400/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-purple-400/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-purple-400/50" />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Scan line effect */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[1px] bg-purple-400/80 w-0"
                  animate={{ 
                    width: ["0%", "100%", "0%"],
                    x: ["0%", "0%", "100%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5
                  }}
                />
                
                {`> Learn_More`}
              </motion.button>
            </motion.div>
          </div>

          {/* Enhanced Corner Decorations */}
          <div className="absolute top-4 left-4 font-mono text-cyan-500/50 text-sm">
            <motion.div
              animate={{
                opacity: [1, 0.5, 1],
                textShadow: [
                  "0 0 5px rgba(0,255,255,0.5)",
                  "0 0 10px rgba(0,255,255,0.3)",
                  "0 0 5px rgba(0,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <span>[sys.hack.init]</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ●
              </motion.span>
            </motion.div>
          </div>
          
          <div className="absolute top-4 right-4 font-mono text-cyan-500/50 text-sm">
            <motion.div
              animate={{
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              [status: online]
            </motion.div>
          </div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <div className="text-cyan-400/70 font-mono text-sm mb-2">scroll_down</div>
              <motion.div
                animate={{ 
                  height: ["20px", "30px", "20px"],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-[1px] bg-gradient-to-b from-cyan-400 to-transparent"
              />
            </motion.div>
          </motion.div>
        </section>

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
