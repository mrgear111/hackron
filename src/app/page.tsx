'use client';  // Add this at the top since we're using client-side features

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/utils/animations";

export default function Home() {
  const features = [
    {
      title: "For Teams",
      color: "cyan",
      icon: "/globe.svg",
      text: "Join the revolution. Build the future. Win big.",
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      title: "For Admins",
      color: "purple",
      icon: "/globe.svg",
      text: "Control the matrix. Monitor submissions. Lead innovation.",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Easy Submission",
      color: "emerald",
      icon: "/globe.svg",
      text: "Upload. Share. Conquer. Simple as binary.",
      gradient: "from-emerald-500/20 to-teal-500/20"
    }
  ];

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black/50 to-black pointer-events-none"></div>
      
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background with Effects */}
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute w-full h-full object-cover"
              style={{ opacity: 0.6 }}
            >
              <source src="/bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Darker overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15)_0%,transparent_50%)]"></div>
            
            {/* Matrix Rain Effect */}
            <div className="absolute inset-0 matrix-bg"></div>
            
            {/* Moving Grid Overlay */}
            <motion.div 
              animate={{ 
                backgroundPosition: ["0px 0px", "100px 100px"],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-grid-pattern opacity-20"
            />
            
            {/* Animated Scan Line */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-full h-1 bg-cyan-500/20 blur-sm"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center space-y-12"
            >
              {/* Glitch Effect Title */}
              <motion.div variants={fadeInUp} className="space-y-6">
                <h2 className="text-cyan-400 font-mono text-xl tracking-[0.2em] glitch-text">
                  &lt;SYSTEM_BREACH_INITIATED&gt;
                </h2>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter glitch">
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                      HACK
                    </span>
                    <motion.span
                      animate={{
                        opacity: [1, 0.5, 1],
                        x: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="absolute top-0 left-0 w-full h-full bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
                    >
                      HACK
                    </motion.span>
                  </span>
                  <span className="relative">
                    <span className="text-white">RON</span>
                    <span className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-xl opacity-50"></span>
                  </span>
                </h1>
                <motion.p 
                  className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed font-mono"
                  animate={{
                    textShadow: ["0 0 8px rgba(0,255,255,0.5)", "0 0 16px rgba(0,255,255,0.2)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  &gt; 24 Hours_
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >|</motion.span>
                </motion.p>
              </motion.div>

              {/* Prize Pool with Terminal Effect */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="inline-block relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
                  <div className="relative px-8 py-4 bg-black/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                    <div className="font-mono text-cyan-400 text-lg">&gt; PRIZE_POOL.exe</div>
                    <motion.div 
                      className="text-4xl font-bold text-purple-400"
                      animate={{
                        textShadow: ["0 0 10px rgba(147,51,234,0.5)", "0 0 20px rgba(147,51,234,0.2)"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      ₹80,000
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button with Cyber Effect */}
              <motion.div variants={fadeInUp}>
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 
                  bg-gradient-to-r from-cyan-500 to-blue-500 
                  rounded-lg text-white font-mono text-lg 
                  overflow-hidden transition-all duration-300
                  hover:shadow-[0_0_30px_rgba(0,183,255,0.3)] hover:scale-105
                  border border-cyan-400/30"
                >
                  <span className="relative z-10">&gt; Initialize_Hack</span>
                  <motion.span
                    animate={{ x: [-20, 0] }}
                    transition={{ 
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    _
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Terminal-style Corner Decorations */}
          <div className="absolute top-4 left-4 font-mono text-cyan-500/50 text-sm">[sys.hack.init]</div>
          <div className="absolute top-4 right-4 font-mono text-cyan-500/50 text-sm">
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ●
            </motion.span>
            {" "}LIVE
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative z-10 py-32">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`group relative p-8 rounded-2xl border border-gray-800 
                    bg-gradient-to-b ${feature.gradient} backdrop-blur-sm
                    hover:border-gray-700 transition-all duration-500 
                    hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-2xl"></div>
                  <div className="relative z-10">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={40}
                      height={40}
                      className={`mb-6 text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}
                    />
                    <h3 className={`text-2xl font-bold mb-4 text-${feature.color}-400 group-hover:text-${feature.color}-300`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300">{feature.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
