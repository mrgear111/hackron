'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Leaderboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page since leaderboard is locked
    router.push('/');
  }, [router]);

  const shortlistedTeams = [
    { name: "Humorous", color: "text-cyan-400" },
    { name: "Hack O' Giants", color: "text-cyan-400" },
    { name: "Coding Knights", color: "text-cyan-400" },
    { name: "402", color: "text-cyan-400" },
    { name: "Red Renegades", color: "text-cyan-400" },
    { name: "Int main", color: "text-cyan-400" },
    { name: "The Neural Network", color: "text-cyan-400" },
    { name: "Fantastic Four", color: "text-cyan-400" },
    { name: "Pixel_Perfect", color: "text-cyan-400" },
    { name: "codemonk", color: "text-cyan-400" },
    { name: "Skittles", color: "text-cyan-400" },
    { name: "JHC hub", color: "text-cyan-400" },
    { name: "Senorita", color: "text-cyan-400" },
    { name: "Techies", color: "text-cyan-400" },
    { name: "8 bit", color: "text-cyan-400" },
    { name: "localhost:8080", color: "text-cyan-400" }
  ];

  return null;
} 