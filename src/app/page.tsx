'use client'

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/utils/animations";
import { useRef, useEffect, useState } from "react";
import LoginModal from "@/components/LoginModal";
import { FaRocket, FaBullhorn, FaMapMarkerAlt, FaBolt, FaSearch, FaUtensils, FaGamepad, FaMoon, FaShieldAlt, FaCity, FaSun, FaBoxOpen, FaMicrophone, FaHamburger, FaTrophy, FaClock, FaCode } from 'react-icons/fa';

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
      { icon: "📅", label: "Date", value: "31st Jan - 1st Feb" },
      { icon: "📍", label: "Venue", value: "Lab 1 & 2" },
      { icon: "👥", label: "Participants", value: "UG students" },
      { icon: "💰", label: "Prize Pool", value: "75k" },
    ],
    timeline: [
      { time: "09:00 AM - 10:00 AM", event: "Onboarding", desc: "Day 1: Jan 31" },
      { time: "10:00 AM - 12:00 PM", event: "Workshop + Briefing", desc: "Day 1: Jan 31" },
      { time: "12:00 PM", event: "Hackathon Starts & Problem Statement Release", desc: "Day 1: Jan 31" },
      { time: "04:00 PM - 06:00 PM", event: "Checkpoint 1", desc: "Day 1: Jan 31" },
      { time: "06:30 PM - 09:00 PM", event: "Break (Concert Optional)", desc: "Day 1: Jan 31" },
      { time: "01:00 AM - 03:00 AM", event: "Checkpoint 2", desc: "Day 2: Feb 1" },
      { time: "09:00 AM - 10:00 AM", event: "Submission Window", desc: "Day 2: Feb 1" },
      { time: "10:00 AM - 12:30 PM", event: "Evaluation (Top 10)", desc: "Day 2: Feb 1" },
      { time: "01:00 PM - 03:00 PM", event: "Final Presentation & Prize Distribution", desc: "Day 2: Feb 1" },
    ],
    judgingCriteria: [
      { title: "Problem Statement", desc: "Complexity & Relevance" },
      { title: "Approach & Implementation", desc: "Logical Thinking & Execution" },
      { title: "Solution Analysis", desc: "Code Quality & Efficiency" },
      { title: "Presentation", desc: "Clarity & Communication" },
      { title: "Innovation", desc: "Creativity & Uniqueness" },
      { title: "Working Demo", desc: "Functionality & Usability" },
    ]
  };


  const dialogueMessage = "Welcome to HACKRON 2026! Join us for an innovation sprint on 31st Jan - 1st Feb at Lab 1 & 2. Compete for 75K prize pool, for any guidance or doubts please contact the POC's present there.";

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
                x: ((windowSize.width / 2 - mousePosition.x) * 0.07) + 'px',
                y: ((windowSize.height - mousePosition.y) * 0.07) + 'px'
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
                x: ((windowSize.width / 2 - mousePosition.x) * 0.06) + 'px',
                y: ((windowSize.height / 2 - mousePosition.y) * 0.06) + 'px'
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

                  {/* Ajeenkya DY Patil University Logo */}
                  <div className="relative">
                    <img
                      src="/images/adypu.png"
                      alt="Ajeenkya DY Patil University"
                      className="h-16 md:h-20 w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 0 10px rgba(160, 107, 255, 0.3))' }}
                    />
                  </div>
                  {/* X Separator */}
                  <div className="text-5xl md:text-7xl font-bold text-tekron-pink-neon opacity-60">
                    ×
                  </div>
                  {/* Newton School of Technology Logo */}
                  <div className="relative">
                    <img
                      src="/images/NST.png"
                      alt="Newton School of Technology"
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
                      <div className=" text-tekron-pink-neon-300 bg-purple-200 inline-flex items-center gap-2 bg-tekron-pink-neon border border-tekron-pink-neon/40 rounded-full px-4 py-2">
                        <span className="text-pink-500 font-pixel">THIS_YEAR // 2026</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-3xl leading-relaxed mb-6">
                      <span className="text-tekron-pink-neon font-bold">HACKRON</span> is back again with another banger event! Building on last year's incredible success, we're scaling up to create an even more impactful experience.
                    </p>
                    <p className="text-gray-300 text-3xl leading-relaxed">
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

              {/* Separator */}
              <motion.div
                variants={fadeInUp}
                className="relative py-12 my-8"
              >
                {/* Decorative line with glow */}
                <div className="relative flex items-center justify-center">
                  {/* Left line */}
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-cyan-400/80" />

                  {/* Center icon */}
                  <div className="relative mx-6">
                    <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border-2 border-cyan-400/40 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Right line */}
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400/50 to-cyan-400/80" />
                </div>
              </motion.div>

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
                      <div className="inline-flex items-center gap-2 border border-white-500/40 rounded-full px-4 py-2">
                        <span className="text-white-400 font-pixel text-sm">LAST_YEAR // 2025</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-gray-300 text-3xl leading-relaxed">
                          <span className="text-tekron-pink-neon font-bold">Hackron</span> was not just an event—it is a continuously evolving tech ecosystem. Built on innovation, collaboration, and scale, Hackron has established itself as a platform where ideas meet execution and talent meets opportunity.
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-300 text-3xl leading-relaxed">
                          With strong year-on growth, multi-college participation, and large-scale digital outreach, HACKRON last year was a banger event. Over the past edition, the event successfully positioned its impact by connecting with blinkit and solving their porblem statements in 24 Hours and was a huge success.
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
            <motion.div
              variants={fadeInUp}
              className="relative py-12 my-8"
            >
              {/* Decorative line with glow */}
              <div className="relative flex items-center justify-center">
                {/* Left line */}
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-cyan-400/80" />

                {/* Center icon */}
                <div className="relative mx-6">
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border-2 border-cyan-400/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* Right line */}
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400/50 to-cyan-400/80" />
              </div>
            </motion.div>
            {/* Quick Event Info */}
            <p className="text-center text-tekron-pink-neon font-pixel text-4xl mb-16">Quick Event Info</p>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {/* Date Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/90 to-purple-800/95 backdrop-blur-xl border-2 border-cyan-400/40 rounded-2xl p-8 hover:border-cyan-400/70 transition-all text-center shadow-xl">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border-2 border-cyan-400/40 flex items-center justify-center">
                      <FaClock className="text-cyan-400 text-3xl" />
                    </div>
                  </div>
                  <div className="text-cyan-300 font-pixel text-xl mb-3 tracking-wider">DATE</div>
                  <div className="text-white font-bold text-3xl mb-10">31st Jan - 1st Feb 2026</div>
                </div>
              </motion.div>

              {/* Venue Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/90 to-purple-800/95 backdrop-blur-xl border-2 border-purple-400/40 rounded-2xl p-8 hover:border-purple-400/70 transition-all text-center shadow-xl">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-600/20 border-2 border-purple-400/40 flex items-center justify-center">
                      <FaMapMarkerAlt className="text-purple-400 text-3xl" />
                    </div>
                  </div>
                  <div className="text-purple-300 font-pixel text-xl mb-3 tracking-wider">VENUE</div>
                  <div className="text-white font-bold text-3xl mb-2">4th and 5th Floor, <br /> School of Management , ADYPU</div>
                </div>
              </motion.div>

              {/* Duration Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-pink-400/30 to-rose-600/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/90 to-purple-800/95 backdrop-blur-xl border-2 border-pink-400/40 rounded-2xl p-8 hover:border-pink-400/70 transition-all text-center shadow-xl">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pink-400/20 to-rose-600/20 border-2 border-pink-400/40 flex items-center justify-center">
                      <FaBolt className="text-pink-400 text-3xl" />
                    </div>
                  </div>
                  <div className="text-pink-300 font-pixel text-xl mb-3 tracking-wider">DURATION</div>
                  <div className="text-white font-bold text-3xl mb-20">24 Hours</div>
                </div>
              </motion.div>

              {/* Prize Pool Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/30 to-orange-600/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/90 to-purple-800/95 backdrop-blur-xl border-2 border-yellow-400/40 rounded-2xl p-8 hover:border-yellow-400/70 transition-all text-center shadow-xl">
                  {/* Icon Container */}
                  <div className="flex justify-center mb-5">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-600/20 border-2 border-yellow-400/40 flex items-center justify-center">
                      <FaTrophy className="text-yellow-400 text-3xl" />
                    </div>
                  </div>
                  <div className="text-yellow-300 font-pixel text-xl mb-3 tracking-wider">PRIZE_POOL</div>
                  <div className="text-white font-bold text-3xl mb-20">₹75,000</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hackathon Playbook CTA */}
            <motion.div
              variants={fadeInUp}
              className="mb-20"
            >
              <Link href="/docs">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative group cursor-pointer max-w-4xl mx-auto"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/50 via-orange-500/50 to-yellow-500/50 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-yellow-900/80 via-orange-900/70 to-yellow-900/80 backdrop-blur-xl border-2 border-yellow-500/50 rounded-2xl p-12 hover:border-yellow-400/80 transition-all text-center shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400/30 to-orange-600/30 border-2 border-yellow-400/50 flex items-center justify-center">
                        <FaCode className="text-yellow-400 text-5xl" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 mb-4">
                      📖 HACKATHON PLAYBOOK
                    </h3>

                    {/* Description */}
                    <p className="text-gray-200 text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
                      Complete guide to rules, tech stack, evaluation workflow, and everything you need to know for the hackathon
                    </p>

                    {/* Button */}
                    <div className="inline-flex items-center gap-3 bg-yellow-500/20 border-2 border-yellow-400/50 rounded-full px-8 py-4 group-hover:bg-yellow-500/30 transition-all">
                      <span className="text-yellow-300 font-pixel text-lg">READ_NOW</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-yellow-400 text-xl"
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative py-12 my-8"
            >
              {/* Decorative line with glow */}
              <div className="relative flex items-center justify-center">
                {/* Left line */}
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-cyan-400/80" />

                {/* Center icon */}
                <div className="relative mx-6">
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border-2 border-cyan-400/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* Right line */}
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400/50 to-cyan-400/80" />
              </div>
            </motion.div>
            {/* Gamified Timeline - Central Branch Design */}
            <motion.div variants={fadeInUp} className="mb-20">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-pixel text-tekron-pink-neon mb-4">&gt; EVENT_TIMELINE</h3>
                <p className="text-gray-300 text-retro text-lg">Your 24-hour adventure roadmap</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-tekron-purple-deep/60 border border-tekron-pink-neon/30 rounded-full px-6 py-2">
                  <div className="w-2 h-2 rounded-full bg-tekron-pink-neon animate-pulse" />
                  <span className="text-tekron-pink-neon font-pixel text-sm">9 LEVELS TO CONQUER</span>
                </div>
              </div>

              {/* Central Branch Timeline */}
              <div className="relative max-w-6xl mx-auto px-4">
                {/* Central Curved Line - SVG */}
                <svg
                  className="absolute left-1/2 -translate-x-1/2 top-0 h-full pointer-events-none"
                  style={{ zIndex: 0 }}
                  width="200"
                  viewBox="0 0 200 6000"
                  preserveAspectRatio="xMidYMin meet"
                >
                  <defs>
                    <linearGradient id="centralGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00f5ff" stopOpacity="1" />
                      <stop offset="25%" stopColor="#00d4ff" stopOpacity="1" />
                      <stop offset="50%" stopColor="#00f5ff" stopOpacity="1" />
                      <stop offset="75%" stopColor="#00d4ff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#00f5ff" stopOpacity="1" />
                    </linearGradient>

                    <filter id="lineGlow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Main central curved path with more curves */}
                  <path
                    d="M 100 0 Q 40 200, 100 400 Q 160 600, 100 800 Q 40 1000, 100 1200 Q 160 1400, 100 1600 Q 40 1800, 100 2000 Q 160 2200, 100 2400 Q 40 2600, 100 2800 Q 160 3000, 100 3200 Q 40 3400, 100 3600 Q 160 3800, 100 4000 Q 40 4200, 100 4400 Q 160 4600, 100 4800 Q 40 5000, 100 5200 Q 120 5400, 100 5600 L 100 6000"
                    stroke="url(#centralGradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#lineGlow)"
                  />

                  {/* Outer glow path */}
                  <path
                    d="M 100 0 Q 40 200, 100 400 Q 160 600, 100 800 Q 40 1000, 100 1200 Q 160 1400, 100 1600 Q 40 1800, 100 2000 Q 160 2200, 100 2400 Q 40 2600, 100 2800 Q 160 3000, 100 3200 Q 40 3400, 100 3600 Q 160 3800, 100 4000 Q 40 4200, 100 4400 Q 160 4600, 100 4800 Q 40 5000, 100 5200 Q 120 5400, 100 5600 L 100 6000"
                    stroke="url(#centralGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>

                {/* Timeline Items */}
                <div className="relative space-y-32 py-12" style={{ zIndex: 1 }}>
                  {eventDetails.timeline.map((item, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                      <div
                        key={index}
                        className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
                      >
                        {/* Branch Line connecting to center */}
                        <div className={`absolute top-1/2 ${isLeft ? 'left-1/2 right-0' : 'left-0 right-1/2'} h-1`}>
                          <div className={`h-full bg-gradient-to-r ${isLeft ? 'from-cyan-400/80 to-transparent' : 'from-transparent to-cyan-400/80'}`} />
                        </div>

                        {/* Center Node */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                          <div className="w-6 h-6 rounded-full bg-cyan-400 border-4 border-tekron-purple-deep shadow-lg shadow-cyan-400/70">
                            <div className="w-full h-full rounded-full bg-cyan-300 animate-pulse" />
                          </div>
                        </div>

                        {/* Level Card */}
                        <div className={`relative group ${isLeft ? 'mr-auto pr-8 md:pr-16' : 'ml-auto pl-8 md:pl-16'} w-full md:w-[55%]`}>
                          {/* Glow Effect */}
                          <div className="absolute -inset-3 bg-gradient-to-br from-tekron-pink-neon/30 via-tekron-purple-accent/30 to-cyan-500/30 rounded-3xl blur-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                          {/* Level Card Container */}
                          <div className="relative bg-gradient-to-br from-purple-900/98 via-indigo-900/95 to-purple-800/98 backdrop-blur-xl border-2 border-cyan-400/50 rounded-3xl p-10 shadow-2xl hover:border-cyan-400/80 hover:shadow-cyan-400/20 transition-all duration-300">
                            {/* Inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-500/5 rounded-3xl" />

                            {/* Corner Accents */}
                            <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-cyan-400/70 rounded-tl-lg" />
                            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-cyan-400/70 rounded-tr-lg" />
                            <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-cyan-400/70 rounded-bl-lg" />
                            <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-cyan-400/70 rounded-br-lg" />

                            {/* Level Icon - Task Specific */}
                            <div className="flex justify-center mb-7 relative z-10">
                              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-purple-600/40 border-2 border-cyan-400/70 flex items-center justify-center backdrop-blur-sm shadow-xl shadow-cyan-400/30 hover:scale-105 transition-transform duration-300">
                                {index === 0 ? <FaBullhorn className="text-cyan-400 text-4xl" /> :
                                  index === 1 ? <FaCode className="text-purple-400 text-4xl" /> :
                                    index === 2 ? <FaSearch className="text-cyan-400 text-4xl" /> :
                                      index === 3 ? <FaMicrophone className="text-pink-400 text-4xl" /> :
                                        index === 4 ? <FaSearch className="text-cyan-400 text-4xl" /> :
                                          index === 5 ? <FaBoxOpen className="text-green-400 text-4xl" /> :
                                            index === 6 ? <FaTrophy className="text-yellow-400 text-4xl" /> :
                                              index === 7 ? <FaMicrophone className="text-purple-400 text-4xl" /> :
                                                <FaTrophy className="text-yellow-400 text-4xl" />}
                              </div>
                            </div>

                            {/* Time Badge */}
                            <div className="flex justify-center mb-5">
                              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400/30 to-blue-600/30 border-2 border-cyan-400/60 rounded-full px-6 py-3 backdrop-blur-sm shadow-md">
                                <FaClock className="text-cyan-300 text-lg" />
                                <span className="text-cyan-100 font-mono font-bold text-base tracking-wide">
                                  {item.time}
                                </span>
                              </div>
                            </div>

                            {/* Event Title */}
                            <h3 className="text-center text-3xl font-bold text-white mb-4 font-pixel tracking-wider relative z-10" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.3)' }}>
                              {item.event}
                            </h3>

                            {/* Day Label */}
                            {item.desc && (
                              <div className="flex justify-center relative z-10">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 border border-purple-400/60 rounded-full px-5 py-2.5 backdrop-blur-sm shadow-lg">
                                  <span className="text-purple-100 font-mono text-base font-bold tracking-wide">
                                    {item.desc}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Level Status */}
                            <div className="mt-4 text-center">
                              <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full px-5 py-2">
                                <span className="text-cyan-300 font-pixel text-xs tracking-wider">
                                  LEVEL {index + 1}/{eventDetails.timeline.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Final Trophy */}
                  <div className="relative flex justify-center pt-16 pb-8">
                    <div className="relative group">
                      {/* Trophy glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-500/40 to-yellow-600/40 rounded-full blur-2xl" />

                      {/* Trophy container */}
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 flex items-center justify-center border-[6px] border-yellow-200 shadow-2xl shadow-yellow-500/50">
                        {/* Inner glow */}
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200/40 to-transparent" />

                        {/* Trophy emoji */}
                        <span className="text-6xl relative z-10 drop-shadow-2xl">🏆</span>
                      </div>

                      {/* Victory text */}
                      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                        <span className="text-yellow-400 font-pixel text-2xl drop-shadow-lg tracking-wider">VICTORY!</span>
                        <div className="mt-2">
                          <span className="text-white-300 font-pixel text-xs">COMPLETE_ALL_LEVELS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Judging Criteria */}
            <motion.div variants={fadeInUp}>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-tekron-purple-deep/40 border border-cyan-400/30 rounded-full px-4 py-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 font-pixel text-sm">EVALUATION_METRICS</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-pixel text-white mb-4">&gt; JUDGING_CRITERIA</h3>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">What makes a winning project</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {eventDetails.judgingCriteria.map((criteria, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="relative group"
                  >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-300" />

                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/90 to-purple-800/95 backdrop-blur-xl border-2 border-cyan-400/40 rounded-2xl p-8 hover:border-cyan-400/70 transition-all h-full shadow-xl">
                      {/* Icon Container */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border-2 border-cyan-400/40 flex items-center justify-center">
                          {index === 0 ? <FaGamepad className="text-cyan-400 text-2xl" /> :
                            index === 1 ? <FaBolt className="text-cyan-400 text-2xl" /> :
                              <FaSearch className="text-cyan-400 text-2xl" />}
                        </div>

                        {/* Number Badge */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400/10 border-2 border-cyan-400/40">
                          <span className="text-cyan-300 font-pixel text-lg">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-white font-bold text-4xl mb-3 leading-tight">{criteria.title}</h4>

                      {/* Description */}
                      <p className="text-gray-300 text-2xl leading-relaxed mb-6">{criteria.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section >

        {/* Add Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </main>
    </div>
  );
}
