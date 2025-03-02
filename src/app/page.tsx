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
  const eventDetails = {
    mainInfo: [
      { icon: "🚀", label: "24'Hrs Hackathon", value: "Non-Stop Coding" },
      { icon: "📅", label: "Date", value: "5th March" },
      { icon: "📍", label: "Venue", value: "Lab 1 & 2" },
      { icon: "👥", label: "Participants", value: "UG students" },
      { icon: "💰", label: "Prize Pool", value: "80k" },
    ],
    timeline: [
      { time: "07:00 AM", event: "Participant Reporting", desc: "Check-in & Registration" },
      { time: "08:30 AM", event: "Briefing Session", desc: "Rules, Guidelines & Problem Statements" },
      { time: "09:00 AM", event: "Hackathon Begins", desc: "🔥" },
      { time: "12:30 PM", event: "Lunch", desc: "Coupon Distribution 🍱" },
      { time: "05:30 PM", event: "Snacks", desc: "Coupon Distribution ☕" },
      { time: "07:45 PM", event: "Dinner", desc: "Coupon Distribution 🍽️" },
      { time: "09:30 PM", event: "Security Check", desc: "Campus Attendance" },
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

  return (
    <div className="bg-gray-900 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 bg-grid-pattern pointer-events-none"
        style={{ opacity: gridOpacity, y: bgY }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black/50 to-black pointer-events-none"></div>
      
      <Navbar />
      
      <main ref={scrollRef}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
          {/* Video Background with Effects */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute w-full h-full object-cover opacity-40"
            >
              <source src="/bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Enhanced overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/80"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            {/* Glowing Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              className="h-px w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 font-mono"
            >
              <span className="text-cyan-400">&gt; </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                HACKRON_2024
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-cyan-400 ml-2"
              >
                |
              </motion.span>
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="text-gray-300 text-lg md:text-xl mb-12 font-mono">
                <span className="text-cyan-400">$</span> Initialize_Innovation.exe
              </div>
              <motion.div
                className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.div>

            {/* CTA Buttons */}
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
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
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
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                />
                {`> Learn_More`}
              </motion.button>
            </motion.div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 font-mono text-cyan-500/50 text-sm">
            <motion.span
              animate={{
                opacity: [1, 0.5, 1],
                textShadow: [
                  "0 0 5px rgba(0,255,255,0.5)",
                  "0 0 10px rgba(0,255,255,0.3)",
                  "0 0 5px rgba(0,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              [sys.hack.init]
            </motion.span>
          </div>

          {/* Scroll Indicator */}
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
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-8 bg-gradient-to-b from-cyan-400/50 to-transparent"
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
                  <div className="text-gray-300 font-mono">💰 80k</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8">
                <div className="text-xl font-mono text-cyan-400 mb-4">&gt; Event_Timeline</div>
                <div className="space-y-3 font-mono">
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">07:00 AM</div>
                    <div className="text-gray-300">Participant Reporting</div>
                    <div className="text-gray-500 text-sm">Check-in & Registration</div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">08:30 AM</div>
                    <div className="text-gray-300">Briefing Session</div>
                    <div className="text-gray-500 text-sm">Rules, Guidelines & Problem Statements</div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">09:00 AM</div>
                    <div className="text-gray-300">Hackathon Begins</div>
                    <div className="text-emerald-400">🔥</div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">12:30 PM</div>
                    <div className="text-gray-300">Lunch Break</div>
                    <div className="text-gray-500 text-sm">🍱</div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">05:30 PM</div>
                    <div className="text-gray-300">Snacks Break</div>
                    <div className="text-gray-500 text-sm">☕</div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">07:45 PM</div>
                    <div className="text-gray-300">Dinner Break</div>
                    <div className="text-gray-500 text-sm">🍽️</div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-purple-400 w-24">09:30 PM</div>
                    <div className="text-gray-300">Security Check</div>
                    <div className="text-gray-500 text-sm">Campus Attendance</div>
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
