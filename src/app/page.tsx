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
      { icon: "💰", label: "Prize Pool", value: "75k" },
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
    <div className="bg-gradient-to-b from-tekron-purple-deep via-tekron-purple-mid to-tekron-purple-deep min-h-screen overflow-hidden relative">
      {/* CRT Scanlines Overlay */}
      <div className="crt-scanlines" />

      {/* Cloud Background */}
      <div className="cloud-bg">
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
      </div>

      {/* Pixel Dust */}
      <div className="pixel-dust" />

      {/* Background Video with Pixelation */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/bg.mp4"
          className="w-full h-full object-cover opacity-20"
          style={{
            filter: 'blur(2px) contrast(1.2)',
            imageRendering: 'pixelated'
          }}
        >
          <source src="/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Purple overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e]/80 via-[#2d1b4e]/60 to-[#1a0b2e]/80" />
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
                className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#ff4db8] to-[#00f5ff]"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,0,110,0.5)",
                    "0 0 35px rgba(255,0,110,0.3)",
                    "0 0 20px rgba(255,0,110,0.5)"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                HACKRON_2026
              </motion.div>

              {/* Glitch effect */}
              <motion.div
                className="absolute inset-0 text-4xl md:text-6xl font-bold text-[#ff006e]/30"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
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
                HACKRON_2026
              </motion.div>
            </motion.div>

            {/* Loading bar */}
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff006e] to-[#9d4edd]"
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
              className="mt-4 text-retro text-[#ff4db8]/70 flex items-center"
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
            <div className="mt-6 text-retro text-xs text-[#6b3d99] max-w-xs text-center">
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
      <div className="fixed inset-0 pointer-events-none"></div>

      <Navbar />

      <main ref={scrollRef}>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-[100vh] mb-20 overflow-hidden"
        >
          {/* Subtle Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark-base via-bg-deep-night/40 to-primary-dark-base" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

          {/* Subtle Depth Layer */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-primary-dark-base/50" />

          {/* Main Content - Centered */}
          <div className="relative max-w-6xl mx-auto px-8 py-24 text-center flex items-center justify-center min-h-[100vh]">
            <div className="space-y-12">

              {/* Partner Logos at Top */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center justify-center gap-8 mb-8"
              >
                {/* Newton School of Technology Logo */}
                <div className="relative">
                  <img
                    src="/images/NST.png"
                    alt="Newton School of Technology"
                    className="h-16 md:h-20 w-auto object-contain mr-12"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(160, 107, 255, 0.3))' }}
                  />
                </div>

                {/* X Separator */}
                <div className="text-5xl md:text-7xl font-bold text-primary-purple opacity-60">
                  ×
                </div>

                {/* Ajeenkya DY Patil University Logo */}
                <div className="relative">
                  <img
                    src="/images/adypu.png"
                    alt="Ajeenkya DY Patil University"
                    className="h-16 md:h-20 w-auto object-contain ml-12"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(160, 107, 255, 0.3))' }}
                  />
                </div>
              </motion.div>

              {/* Main Title - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="space-y-6"
              >
                <h1 className="text-6xl md:text-8xl font-bold text-pixel leading-tight tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-purple via-primary-purple-deep to-primary-purple">
                    HACKRON
                  </span>
                  <br />
                  <span className="text-accent-cyan">2026</span>
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-retro text-text-soft-lavender/90 font-normal leading-relaxed max-w-2xl mx-auto">
                  24-hour innovation sprint. Build the future.
                </p>
              </motion.div>

              {/* Stats - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                className="grid grid-cols-3 gap-12 mt-16 max-w-3xl mx-auto"
              >
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold text-pixel text-primary-purple">
                    24H
                  </div>
                  <div className="text-sm text-retro text-text-muted uppercase tracking-wider">Duration</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold text-pixel text-primary-purple">
                    50+
                  </div>
                  <div className="text-sm text-retro text-text-muted uppercase tracking-wider">Teams</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="text-5xl font-bold text-pixel text-primary-purple">
                    75K
                  </div>
                  <div className="text-sm text-retro text-text-muted uppercase tracking-wider">Prize Pool</div>
                </div>
              </motion.div>

              {/* Code Symbol - Centered Below */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="flex items-center justify-center mt-16"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-primary-purple/20 via-transparent to-transparent blur-3xl" />

                  {/* Clean Geometric Design */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Outer Ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute inset-0 border border-primary-purple/30 rounded-full" />
                    </motion.div>

                    {/* Inner Ring */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8"
                    >
                      <div className="absolute inset-0 border border-accent-cyan/40 rounded-full" />
                    </motion.div>

                    {/* Center Code Symbol */}
                    <div className="relative z-10 text-5xl md:text-6xl font-mono font-bold text-primary-purple" style={{ filter: 'drop-shadow(0 0 15px rgba(160, 107, 255, 0.4))' }}>
                      &lt;/&gt;
                    </div>
                  </div>

                  {/* Subtle Accent Dots */}
                  <div className="absolute top-1/4 right-4 w-2 h-2 rounded-full bg-accent-cyan opacity-70" />
                  <div className="absolute bottom-1/4 left-4 w-2 h-2 rounded-full bg-primary-purple opacity-70" />
                </div>
              </motion.div>

            </div>
          </div>
        </motion.section>


        {/* Event Details Section */}
        < motion.section
          ref={eventDetailsRef}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative py-20 px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            className="absolute inset-0"
          />
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="text-3xl text-retro">
                <span className="text-tekron-pink-neon">&gt; </span>
                <span className="text-tekron-pink-neon bg-clip-text bg-gradient-to-r from-tekron-pink-neon to-tekron-purple-accent">
                  24'Hrs Hackathon Event
                </span>
              </h2>
            </motion.div>

            {/* Event Card */}
            <motion.div
              variants={fadeInUp}
              className="pixel-box backdrop-blur-sm p-8 mb-12"
            >
              {/* Main Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="text-tekron-pink-neon text-retro text-sm mb-1">&gt; Date</div>
                  <div className="text-gray-300 text-retro">📅 5th March</div>
                </div>
                <div>
                  <div className="text-tekron-pink-neon text-retro text-sm mb-1">&gt; Venue</div>
                  <div className="text-gray-300 text-retro">📍 Lab 1 & 2</div>
                </div>
                <div>
                  <div className="text-tekron-pink-neon text-retro text-sm mb-1">&gt; Participants</div>
                  <div className="text-gray-300 text-retro">👥 UG students</div>
                </div>
                <div>
                  <div className="text-tekron-pink-neon text-retro text-sm mb-1">&gt; Prize_Pool</div>
                  <div className="text-gray-300 text-retro">💰 75k</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-12">
                <div className="text-xl text-retro text-tekron-pink-neon mb-6 flex items-center">
                  <span>&gt; Event_Timeline</span>
                  <div className="h-[1px] flex-grow ml-4 bg-gradient-to-r from-tekron-pink-neon/50 to-transparent"></div>
                </div>

                {/* Professional timeline with day separation */}
                <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                  {/* Day 1 */}
                  <div className="mb-6">
                    <div className="text-tekron-purple-accent text-retro text-lg mb-3 border-b border-tekron-pink-neon/20 pb-2">Day 1</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventDetails.timeline.slice(0, 9).map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 * index }}
                          className="bg-tekron-purple-mid/50 border-2 border-tekron-pink-neon/30 rounded p-3 hover:border-tekron-pink-neon/60 transition-colors"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 rounded-full bg-tekron-pink-neon mr-2"></div>
                            <div className="text-tekron-purple-accent text-retro text-sm">{item.time}</div>
                          </div>
                          <div className="text-gray-200 text-retro text-base mb-1">{item.event}</div>
                          <div className="text-gray-400 text-xs text-retro">{item.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Day 2 */}
                  <div>
                    <div className="text-tekron-purple-accent text-retro text-lg mb-3 border-b border-tekron-pink-neon/20 pb-2">Day 2</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventDetails.timeline.slice(9).map((item, index) => (
                        <motion.div
                          key={index + 9}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 * (index + 9) }}
                          className="bg-tekron-purple-mid/50 border-2 border-tekron-pink-neon/30 rounded p-3 hover:border-tekron-pink-neon/60 transition-colors"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 rounded-full bg-tekron-pink-neon mr-2"></div>
                            <div className="text-tekron-purple-accent text-retro text-sm">{item.time}</div>
                          </div>
                          <div className="text-gray-200 text-retro text-base mb-1">{item.event}</div>
                          <div className="text-gray-400 text-xs text-retro">{item.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Judging Criteria */}
              <div>
                <div className="text-xl text-retro text-tekron-pink-neon mb-4">&gt; Judging_Criteria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-retro">
                  <div className="flex items-start gap-3">
                    <span className="text-pixel text-tekron-purple-accent">01</span>
                    <div>
                      <div className="text-gray-300">Problem Statement</div>
                      <div className="text-gray-500 text-sm">Complexity & Relevance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-pixel text-tekron-purple-accent">02</span>
                    <div>
                      <div className="text-gray-300">Approach & Implementation</div>
                      <div className="text-gray-500 text-sm">Logical Thinking & Execution</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-pixel text-tekron-purple-accent">03</span>
                    <div>
                      <div className="text-gray-300">Solution Analysis</div>
                      <div className="text-gray-500 text-sm">Code Quality & Efficiency</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-pixel text-tekron-purple-accent">04</span>
                    <div>
                      <div className="text-gray-300">Presentation</div>
                      <div className="text-gray-500 text-sm">Clarity & Communication</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-pixel text-tekron-purple-accent">05</span>
                    <div>
                      <div className="text-gray-300">Innovation</div>
                      <div className="text-gray-500 text-sm">Creativity & Uniqueness</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section >

        {/* Add Login Modal */}
        < LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)
          }
        />
      </main >
    </div >
  );
}
