'use client'

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
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isCharacterHovered, setIsCharacterHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [displayedText, setDisplayedText] = useState('');
  const [dialogueGlitch, setDialogueGlitch] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

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


  const dialogueMessage = "Welcome to HACKRON 2026! Join us for a 24-hour innovation sprint on 5th March at Lab 1 & 2. Compete for 75K prize pool, network with industry leaders, and build the future. Open to all UG students. Register now!";

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0]);

  const eventDetailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize any Firebase-dependent code here
  }, []);

  // Initialize window size and track resize
  useEffect(() => {
    // Set initial window size
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initialize on mount
    updateWindowSize();

    // Add resize listener
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Track mouse position for cloud parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing effect for dialogue
  useEffect(() => {
    setDisplayedText('');

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < dialogueMessage.length) {
        setDisplayedText(dialogueMessage.slice(0, currentIndex + 1));
        currentIndex++;

        if (Math.random() < 0.1) {
          setDialogueGlitch(true);
          setTimeout(() => setDialogueGlitch(false), 100);
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    // Simulate loading time (you can remove this setTimeout if you have actual loading tasks)
    const timer = setTimeout(() => {
      setLoading(false);
      // Show dialogue after loading is complete
      setTimeout(() => setIsDialogueOpen(true), 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gradient-to-b from-tekron-purple-deep via-tekron-purple-mid to-tekron-purple-deep min-h-screen overflow-hidden relative">

      {/* Cloud Background */}
      <div className="cloud-bg">
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
      </div>

      {/* Pixel Dust */}
      <div className="pixel-dust" />

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
        initial={{ opacity: 0.5 }}
        // animate={{ opacity: loading ? 0 : 1 }}
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
          {/* Background Clouds with Mouse Movement - Only in Hero */}
          <div className="absolute inset-0 -z-10">
            {/* Cloud 1 - Moves slower */}
            <motion.div
              className="absolute inset-0 z-20"
              animate={{
                x: (windowSize.width / 2 - mousePosition.x) * 0.03,
                y: (windowSize.height - mousePosition.y) * 0.03
              }}
            >
              <Image
                src="/images/1.webp"
                alt="Cloud 1"
                fill
                className="object-cover"
                style={{
                  imageRendering: 'auto'
                }}
                priority
              />
            </motion.div>

            {/* Cloud 2 - Moves faster for parallax effect */}
            <motion.div
              className="absolute inset-0 z-10"
              animate={{
                x: (windowSize.width / 2 - mousePosition.x) * 0.02,
                y: (windowSize.height / 2 - mousePosition.y) * 0.02
              }}
            >
              <Image
                src="/images/5.webp"
                alt="Cloud 2"
                fill
                className="object-cover"
                style={{
                  imageRendering: 'auto'
                }}
                priority
              />
            </motion.div>

            {/* Purple overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark-base/80 via-bg-deep-night/60 to-primary-dark-base/80" />
          </div>

          {/* Subtle Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark-base via-bg-deep-night/40 to-primary-dark-base" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

          {/* Subtle Depth Layer */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-primary-dark-base/50" />

          {/* Main Content - Centered */}
          <div className="relative max-w-6xl mx-auto px-8 py-24 text-center flex items-center justify-center min-h-[100vh]">
            <div className="space-y-12">



              {/* Partner Logos */}
              <motion.div
                variants={fadeInUp}
                className="mb-20"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-pixel text-tekron-pink-neon mb-2">&gt; ORGANIZED_BY</h3>
                </div>
                <div className="flex items-center justify-center gap-8">
                  {/* Newton School of Technology Logo */}
                  <div className="relative">
                    <img
                      src="/images/NST.png"
                      alt="Newton School of Technology"
                      className="h-16 md:h-20 w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(160, 107, 255, 0.3))' }}
                    />
                  </div>

                  {/* X Separator */}
                  <div className="text-5xl md:text-7xl font-bold text-tekron-pink-neon opacity-60">
                    ×
                  </div>

                  {/* Ajeenkya DY Patil University Logo */}
                  <div className="relative">
                    <img
                      src="/images/adypu.png"
                      alt="Ajeenkya DY Patil University"
                      className="h-16 md:h-20 w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(160, 107, 255, 0.3))' }}
                    />
                  </div>
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

              {/* Sponsor Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-12"
              >
                <div className="relative bg-gradient-to-r from-tekron-purple-deep via-tekron-purple-mid to-tekron-purple-deep border-2 border-tekron-pink-neon/30 rounded-2xl p-8 overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-tekron-pink-neon/10 via-transparent to-tekron-pink-neon/10 blur-xl" />

                  {/* Content */}
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left Side - Powered By */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-block bg-tekron-purple-deep/60 border border-tekron-pink-neon/30 rounded-full px-4 py-1 mb-3">
                        <span className="text-gray-400 font-pixel text-xs">Powered by</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
                        PLACEHOLDER x HACKRON
                      </h2>
                      <p className="text-gray-400 text-sm">Delivering Innovation at Lightning Speed</p>
                    </div>

                    {/* Right Side - Logo Placeholder */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl font-bold text-black font-pixel">SP</div>
                          <div className="text-xs text-black/70 font-bold">SPONSOR</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-tekron-pink-neon/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Character with Dialogue Bubble - Only in Hero */}
          {isDialogueOpen && (
            <div className="hidden sm:block absolute bottom-[630px] right-[10px] z-50">
              <div className="relative px-8 py-6 bg-primary-purple/90 border-2 border-accent-cyan rounded-lg" style={{
                boxShadow: '0 0 20px rgba(160, 107, 255, 0.5)',
                imageRendering: 'pixelated',
              }}>
                {/* Close button */}
                <button
                  onClick={() => setIsDialogueOpen(false)}
                  className="absolute top-2 right-2 text-pixel text-accent-cyan hover:text-ui-white transition-colors"
                  style={{ fontSize: '12px', cursor: 'pointer', lineHeight: '1' }}
                >
                  ×
                </button>

                {/* Dialogue text with typing effect */}
                <p className={`text-pixel mb-4 ${dialogueGlitch ? 'opacity-50' : ''}`} style={{
                  fontSize: '10px',
                  lineHeight: '1.8',
                  color: '#F0E4FF',
                  textShadow: '1px 1px 0px #000000, 0 0 10px rgba(160, 107, 255, 0.3)',
                  imageRendering: 'pixelated',
                  maxWidth: '300px',
                }}>
                  {displayedText}
                  {displayedText.length < dialogueMessage.length && (
                    <span className="inline-block animate-pulse">|</span>
                  )}
                </p>

                {/* Dialogue tail */}
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '16px solid transparent',
                    borderRight: '16px solid transparent',
                    borderTop: '16px solid rgba(160, 107, 255, 0.9)',
                    filter: 'drop-shadow(0 0 8px rgba(160, 107, 255, 0.4))',
                    imageRendering: 'pixelated',
                  }}
                />
              </div>
            </div>
          )}

          {/* Character - Only in Hero */}
          <div
            className="hidden sm:block absolute bottom-0 right-[-80px] z-30 cursor-pointer"
            onClick={() => setIsDialogueOpen(!isDialogueOpen)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const centerX = rect.width * 0.2;

              if (mouseX > centerX) {
                setIsCharacterHovered(true);
                setCursorPosition({ x: e.clientX, y: e.clientY });
              } else {
                setIsCharacterHovered(false);
              }
            }}
            onMouseLeave={() => setIsCharacterHovered(false)}
            style={{ cursor: isCharacterHovered ? 'none' : 'pointer' }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 'clamp(400px, 33vw, 800px)',
                position: 'relative',
                imageRendering: 'pixelated',
              }}
            >
              <Image
                src="/images/main_Chr.png"
                alt="Assistant character"
                width={800}
                height={800}
                className="w-full h-auto block"
                style={{ imageRendering: 'pixelated' }}
                priority
              />
            </motion.div>
          </div>

          {/* Custom cursor on character hover - Only in Hero */}
          {isCharacterHovered && (
            <div
              className="absolute pointer-events-none z-50 text-pixel"
              style={{
                left: `${cursorPosition.x + 15}px`,
                top: `${cursorPosition.y + 15}px`,
                transform: 'translate(0, 0)',
              }}
            >
              <div style={{
                background: 'rgba(160, 107, 255, 0.9)',
                color: '#F0E4FF',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                boxShadow: '0 0 15px rgba(160, 107, 255, 0.6)',
                whiteSpace: 'nowrap',
              }}>
                NEED HELP?
              </div>
            </div>
          )}
        </motion.section>


        {/* Event Details Section */}
        <motion.section
          ref={eventDetailsRef}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <motion.div variants={fadeInUp} className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 bg-tekron-purple-deep/40 border border-tekron-pink-neon/30 rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-tekron-pink-neon animate-pulse" />
                <span className="text-tekron-pink-neon font-pixel text-sm">SYSTEM_ACTIVE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-pixel text-white mb-4">
                HACKRON 2.0
              </h2>
              <p className="text-gray-400 text-retro max-w-2xl mx-auto">
                The next milestone in our journey—bigger reach, deeper engagement, and smarter brand integration.
              </p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="space-y-12 mb-20">
              {/* This Year Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Description Panel */}
                <motion.div
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-tekron-pink-neon/10 to-tekron-purple-accent/10 rounded-2xl blur-xl" />
                  <div className="relative bg-tekron-purple-deep/40 backdrop-blur-md border-2 border-tekron-pink-neon/30 rounded-2xl p-8 h-full">
                    <div className="mb-4">
                      <div className=" bg-tekron-purple-deep/40 inline-flex items-center gap-2 bg-tekron-pink-neon border border-tekron-pink-neon/40 rounded-full px-4 py-2">
                        <span className="text-tekron-pink-neon bg-tekron-purple-deep/40 font-pixel text-sm">THIS_YEAR // 2026</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-2xl leading-relaxed mb-6">
                      <span className="text-tekron-pink-neon font-bold">HACKRON</span> is back again with another banger event! Building on last year's incredible success, we're scaling up to create an even more impactful experience.
                    </p>
                    <p className="text-gray-300 text-2xl leading-relaxed">
                      Get ready for 24 hours of innovation, collaboration, and breakthrough solutions. This year, we're bringing together the brightest minds, cutting-edge challenges, and amazing prizes to push the boundaries of what's possible.
                    </p>
                  </div>
                </motion.div>

                {/* Right: This Year Stats */}
                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {/* Date */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-tekron-pink-neon/20 to-tekron-purple-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-gradient-to-br from-purple-900/60 to-pink-900/40 backdrop-blur-md border-2 border-tekron-pink-neon/30 rounded-2xl p-8 hover:border-tekron-pink-neon/60 transition-all h-full flex flex-col justify-center items-center text-center">
                      <div className="text-5xl mb-4">📆</div>
                      <div className="text-4xl md:text-5xl font-bold font-pixel bg-clip-text bg-gradient-to-br from-tekron-pink-neon to-tekron-purple-accent mb-2">
                        31st JAN
                      </div>
                      <div className="text-gray-300 font-pixel text-sm tracking-wider">2026</div>
                    </div>
                  </motion.div>

                  {/* Prize Pool */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-gradient-to-br from-yellow-900/60 to-orange-900/40 backdrop-blur-md border-2 border-yellow-500/30 rounded-2xl p-8 hover:border-yellow-500/60 transition-all h-full flex flex-col justify-center items-center text-center">
                      <div className="text-5xl mb-4">💰</div>
                      <div className="text-4xl md:text-5xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-400 mb-2">
                        75K
                      </div>
                      <div className="text-gray-300 font-pixel text-sm tracking-wider">PRIZE_POOL</div>
                    </div>
                  </motion.div>

                  {/* Duration */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group sm:col-span-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-gradient-to-br from-cyan-900/60 to-blue-900/40 backdrop-blur-md border-2 border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/60 transition-all h-full flex flex-col justify-center items-center text-center">
                      <div className="text-6xl mb-4">⏱️</div>
                      <div className="text-5xl md:text-6xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 mb-2">
                        24 HRS
                      </div>
                      <div className="text-gray-300 font-pixel text-sm tracking-wider">NON_STOP_INNOVATION</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Last Year Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Description Panel */}
                <motion.div
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-tekron-pink-neon/10 to-tekron-purple-accent/10 rounded-2xl blur-xl" />
                  <div className="relative bg-tekron-purple-deep/40 backdrop-blur-md border-2 border-tekron-pink-neon/30 rounded-2xl p-8 h-full">
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 bg-red-500 border border-red-500/40 rounded-full px-4 py-2">
                        <span className="text-white-400 font-pixel text-sm">LAST_YEAR // 2025</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-gray-300 text-2xl leading-relaxed">
                          <span className="text-tekron-pink-neon font-bold">Hackron</span> is not just an event—it is a continuously evolving tech ecosystem. Built on innovation, collaboration, and scale, Hackron has established itself as a platform where ideas meet execution and talent meets opportunity.
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-300 text-2xl leading-relaxed">
                          With strong year-on-year growth, multi-college participation, and large-scale digital outreach, <span className="text-cyan-400">Hackron has created a legacy</span>. Over the past editions, the event has successfully positioned its impact—connecting brands with a highly engaged, future-ready audience of engineers, developers, creators, and innovators.
                        </p>
                      </div>

                      {/* Footer Badge */}
                      <div className="pt-4 border-t border-tekron-pink-neon/20">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-tekron-pink-neon">📈</span>
                          <span className="font-pixel">RAPID_SCALING // YEAR_ON_YEAR_GROWTH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right: Last Year Stats Grid */}
                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {/* 300+ Students */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-gradient-to-br from-purple-900/60 to-pink-900/40 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 transition-all h-full flex flex-col justify-center items-center text-center">
                      <div className="text-5xl mb-4">👥</div>
                      <div className="text-5xl md:text-6xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400 mb-2">
                        300+
                      </div>
                      <div className="text-gray-300 font-pixel text-sm tracking-wider">STUDENTS</div>
                    </div>
                  </motion.div>

                  {/* 50+ Teams */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-gradient-to-br from-cyan-900/60 to-teal-900/40 backdrop-blur-md border-2 border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/60 transition-all h-full flex flex-col justify-center items-center text-center">
                      <div className="text-5xl mb-4">🏆</div>
                      <div className="text-5xl md:text-6xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-teal-400 mb-2">
                        50+
                      </div>
                      <div className="text-gray-300 font-pixel text-sm tracking-wider">TEAMS</div>
                    </div>
                  </motion.div>

                  {/* 60K Prize Pool */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group sm:col-span-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-gradient-to-br from-yellow-900/60 to-orange-900/40 backdrop-blur-md border-2 border-yellow-500/30 rounded-2xl p-8 hover:border-yellow-500/60 transition-all h-full flex flex-col justify-center items-center text-center">
                      <div className="text-6xl mb-4">💰</div>
                      <div className="text-6xl md:text-7xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-400 mb-2">
                        60K
                      </div>
                      <div className="text-gray-300 font-pixel text-sm tracking-wider">PRIZE_POOL</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Quick Event Info */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-tekron-purple-deep/40 backdrop-blur-sm border-2 border-tekron-pink-neon/30 rounded-xl p-6 hover:border-tekron-pink-neon/60 transition-all text-center"
              >
                <div className="text-3xl mb-2">📅</div>
                <div className="text-tekron-pink-neon font-pixel text-sm mb-1">DATE</div>
                <div className="text-white font-bold">5th March 2026</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-tekron-purple-deep/40 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/60 transition-all text-center"
              >
                <div className="text-3xl mb-2">📍</div>
                <div className="text-cyan-400 font-pixel text-sm mb-1">VENUE</div>
                <div className="text-white font-bold">Lab 1 & 2</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-tekron-purple-deep/40 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all text-center"
              >
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-purple-400 font-pixel text-sm mb-1">DURATION</div>
                <div className="text-white font-bold">24 Hours</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-tekron-purple-deep/40 backdrop-blur-sm border-2 border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/60 transition-all text-center"
              >
                <div className="text-3xl mb-2">💰</div>
                <div className="text-yellow-400 font-pixel text-sm mb-1">PRIZE_POOL</div>
                <div className="text-white font-bold">₹75,000</div>
              </motion.div>
            </motion.div>

            {/* Gamified Timeline */}
            <motion.div variants={fadeInUp} className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-pixel text-tekron-pink-neon mb-2">&gt; EVENT_TIMELINE</h3>
                <p className="text-gray-400 text-retro">Your 24-hour adventure roadmap</p>
              </div>

              {/* Timeline Container */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-tekron-pink-neon via-tekron-purple-accent to-tekron-pink-neon transform md:-translate-x-1/2" />

                {/* Timeline Items */}
                <div className="space-y-12">
                  {eventDetails.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        } flex-row`}
                    >
                      {/* Timeline Node */}
                      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          className="w-6 h-6 rounded-full bg-tekron-pink-neon border-4 border-tekron-purple-deep shadow-lg shadow-tekron-pink-neon/50"
                          style={{
                            boxShadow: '0 0 20px rgba(255, 0, 110, 0.6)'
                          }}
                        />
                      </div>

                      {/* Content Card */}
                      <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                        <motion.div
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="relative group"
                        >
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-tekron-pink-neon/10 to-tekron-purple-accent/10 rounded-lg blur-xl group-hover:blur-2xl transition-all" />

                          {/* Card */}
                          <div className="relative bg-tekron-purple-deep/60 backdrop-blur-md border-2 border-tekron-pink-neon/30 rounded-lg p-6 hover:border-tekron-pink-neon/60 transition-all">
                            {/* Time Badge */}
                            <div className="inline-block bg-tekron-pink-neon/20 border border-tekron-pink-neon/40 rounded-full px-4 py-1 mb-3">
                              <span className="text-tekron-pink-neon font-pixel text-sm">{item.time}</span>
                            </div>

                            {/* Event Title */}
                            <h4 className="text-white font-bold text-lg mb-2">{item.event}</h4>

                            {/* Description */}
                            <p className="text-gray-400 text-sm">{item.desc}</p>

                            {/* Progress Indicator */}
                            <div className="mt-4 flex items-center gap-2">
                              <div className="flex-grow h-1 bg-tekron-purple-mid rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: '100%' }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-tekron-pink-neon to-tekron-purple-accent"
                                />
                              </div>
                              <span className="text-tekron-pink-neon font-pixel text-xs">
                                {Math.round((index + 1) / eventDetails.timeline.length * 100)}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* End Marker */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative mt-12 flex justify-center md:justify-center"
                >
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tekron-pink-neon to-tekron-purple-accent flex items-center justify-center shadow-lg shadow-tekron-pink-neon/50">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Judging Criteria */}
            <motion.div variants={fadeInUp}>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-pixel text-tekron-pink-neon mb-2">&gt; JUDGING_CRITERIA</h3>
                <p className="text-gray-400 text-retro">What makes a winning project</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventDetails.judgingCriteria.map((criteria, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-tekron-pink-neon/10 to-tekron-purple-accent/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />

                    {/* Card */}
                    <div className="relative bg-tekron-purple-deep/40 backdrop-blur-sm border-2 border-tekron-pink-neon/30 rounded-xl p-6 hover:border-tekron-pink-neon/60 transition-all h-full">
                      {/* Number Badge */}
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-tekron-pink-neon/20 border-2 border-tekron-pink-neon mb-4">
                        <span className="text-tekron-pink-neon font-pixel text-lg">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-white font-bold text-xl mb-2">{criteria.title}</h4>

                      {/* Description */}
                      <p className="text-gray-400 text-sm">{criteria.desc}</p>

                      {/* Weight Indicator */}
                      <div className="mt-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${i < 3 ? 'bg-tekron-pink-neon' : 'bg-gray-700'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
