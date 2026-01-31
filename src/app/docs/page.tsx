'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FaBook, FaCode, FaGithub, FaRobot, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaTimes, FaClock, FaTrophy, FaFileAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Docs() {
    const [activeSection, setActiveSection] = useState('playbook');

    const sections = [
        { id: 'playbook', label: 'Hackathon Playbook', icon: FaBook },
        { id: 'rules', label: 'Development Rules', icon: FaExclamationTriangle },
        { id: 'tech-stack', label: 'Tech Stack', icon: FaCode },
        { id: 'ai-assistants', label: 'AI Assistants', icon: FaRobot },
        { id: 'github', label: 'GitHub Monitoring', icon: FaGithub },
        { id: 'problems', label: 'Problem Allocation', icon: FaLightbulb },
        { id: 'workflow', label: 'Evaluation Workflow', icon: FaClock },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-black font-sans selection:bg-cyan-500/30">
            <Navbar />

            {/* Sidebar Navigation */}
            <div className="fixed left-0 top-24 h-[calc(100vh-6rem)] w-64 bg-black/40 backdrop-blur-md border-r border-purple-500/20 z-40 hidden lg:block overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-cyan-400 font-mono text-sm mb-6 uppercase tracking-wider">Documentation</h3>
                    <nav className="space-y-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === section.id
                                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                                        }`}
                                >
                                    <Icon className="text-lg flex-shrink-0" />
                                    <span className="text-sm font-medium text-left">{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content with left margin for sidebar */}
            <div className="lg:ml-64">
                {/* Hero Section */}
                <div id="playbook" className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 border-b border-purple-500/20">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-16 pt-32 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
                                <FaBook className="text-purple-400" />
                                <span className="text-purple-300 font-mono text-sm">Official Documentation</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 mb-6">
                                Hackathon Playbook
                            </h1>
                            <p className="text-2xl md:text-3xl text-cyan-400 font-mono mb-6">Agentic AI Challenge</p>
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                                This hackathon evaluates real agentic AI system design, reasoning, and implementation.
                                Move beyond no-code automations toward thoughtful, explainable agent architectures.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Development Rules */}
                <section id="rules" className="relative border-b border-red-500/20 bg-gradient-to-br from-red-900/10 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                    <FaExclamationTriangle className="text-red-400 text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-red-400">Development Rules</h2>
                                    <p className="text-red-300 font-mono text-sm mt-1">⚠️ Very Important - Read Carefully</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-red-400 mb-4">❌ NOT Allowed</h3>
                                    <p className="text-gray-300 mb-6">
                                        No-code or low-code automation tools are <span className="text-red-400 font-bold">strictly prohibited</span>:
                                    </p>

                                    <div className="space-y-3">
                                        {['n8n', 'Zapier', 'Make (Integromat)', 'Any drag-and-drop workflow builders'].map((tool, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                                                <FaTimes className="text-red-500 flex-shrink-0" />
                                                <span className="font-mono text-red-300">{tool}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-8 flex items-center">
                                    <div>
                                        <div className="text-6xl mb-4">🚫</div>
                                        <p className="text-red-300 text-lg leading-relaxed">
                                            These tools <span className="text-red-400 font-bold">abstract away core reasoning and decision logic</span>,
                                            which defeats the purpose of this challenge.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section id="tech-stack" className="relative border-b border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                                    <FaCode className="text-cyan-400 text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-cyan-400">Recommended Tech Stack</h2>
                                    <p className="text-cyan-300 font-mono text-sm mt-1">Code-first approaches preferred</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-lg mb-12 max-w-3xl">
                                Build using <span className="text-cyan-400 font-bold">code-first approaches</span>, preferably in Python,
                                with clear and explainable agent architecture.
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <FaRobot className="text-purple-400 text-2xl" />
                                        <h3 className="text-xl font-bold text-purple-400">Agent Frameworks</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {['LangChain', 'LangGraph', 'CrewAI'].map((framework, idx) => (
                                            <div key={idx} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center hover:bg-purple-500/20 transition-colors">
                                                <span className="text-purple-300 font-mono font-bold">{framework}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <FaLightbulb className="text-green-400 text-2xl" />
                                        <h3 className="text-xl font-bold text-green-400">LLMs</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {['LLaMA', 'Mistral', 'Phi', 'Gemini', 'Open Source'].map((llm, idx) => (
                                            <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center hover:bg-green-500/20 transition-colors">
                                                <span className="text-green-300 font-mono">{llm}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <FaCode className="text-yellow-400 text-2xl" />
                                        <h3 className="text-xl font-bold text-yellow-400">APIs & Tools</h3>
                                    </div>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">→</span>
                                            <span>Public/free APIs</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">→</span>
                                            <span>File system tools</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">→</span>
                                            <span>Email/messaging APIs</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">→</span>
                                            <span>Free tiers only</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
                                <p className="text-cyan-300 text-center">
                                    <span className="font-bold">Note:</span> Other open-source frameworks allowed if agent logic is clearly implemented and explained.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* AI Assistants */}
                <section id="ai-assistants" className="relative border-b border-purple-500/20 bg-gradient-to-br from-purple-900/10 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                                    <FaRobot className="text-purple-400 text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-purple-400">AI Coding Assistants</h2>
                                    <p className="text-purple-300 font-mono text-sm mt-1">Allowed with conditions</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <FaCheckCircle /> Allowed Tools
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Cursor', 'Copilot', 'Antigravity'].map((tool, idx) => (
                                            <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center hover:bg-green-500/20 transition-colors">
                                                <span className="text-green-300 font-mono font-bold">{tool}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Critical Rules</h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>Use for <span className="text-yellow-400 font-bold">assistance only</span></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>Must <span className="text-yellow-400 font-bold">explain all logic</span></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400 mt-1">•</span>
                                            <span>No blind copy-paste</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 text-center">
                                <p className="text-2xl font-bold text-red-400 mb-2">
                                    This is NOT a "prompt and ship" challenge
                                </p>
                                <p className="text-red-300">
                                    Unexplainable AI-generated code may result in <span className="font-bold">disqualification</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* GitHub Monitoring */}
                <section id="github" className="relative border-b border-green-500/20 bg-gradient-to-br from-green-900/10 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                                    <FaGithub className="text-green-400 text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-green-400">GitHub & Code Monitoring</h2>
                                    <p className="text-green-300 font-mono text-sm mt-1">Continuous evaluation</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-cyan-400 mb-4">Before Start</h3>
                                    <p className="text-gray-300">
                                        Share an <span className="text-cyan-400 font-bold">empty GitHub repository</span> with organizers
                                    </p>
                                </div>

                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-purple-400 mb-4">During Event</h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li className="flex items-center gap-2">
                                            <span className="text-purple-400">✓</span>
                                            <span>Regular monitoring</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-purple-400">✓</span>
                                            <span>Frequent commits</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold text-yellow-400 mb-4">Evaluation</h3>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li>• Commit history</li>
                                        <li>• Code quality</li>
                                        <li>• Evolution</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <FaCheckCircle /> Good Practices
                                    </h3>
                                    <ul className="space-y-3 text-gray-300">
                                        {[
                                            'Incremental development',
                                            'Clear architectural decisions',
                                            'Refactoring & improvements',
                                            'Thoughtful commit messages'
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 bg-green-500/5 rounded-lg p-3">
                                                <span className="text-green-400 text-xl">✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                                        <FaTimes /> Bad Practices
                                    </h3>
                                    <ul className="space-y-3 text-gray-300">
                                        {[
                                            'One large code dump',
                                            'Vibe coding without structure',
                                            'Unexplained generated code'
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-3 bg-red-500/5 rounded-lg p-3">
                                                <span className="text-red-400 text-xl">✗</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Problem Allocation */}
                <section id="problems" className="relative border-b border-orange-500/20 bg-gradient-to-br from-orange-900/10 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
                                    <FaLightbulb className="text-orange-400 text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-orange-400">Problem Statement Allocation</h2>
                                    <p className="text-orange-300 font-mono text-sm mt-1">First come, first serve</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    { icon: '5️⃣', text: '5 problem statements available' },
                                    { icon: '🎯', text: 'Limited slots per statement' },
                                    { icon: '⚡', text: 'First come, first serve allocation' },
                                    { icon: '🔄', text: 'Choose another if full' }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 flex items-center gap-6 hover:bg-orange-500/5 transition-colors">
                                        <div className="text-5xl">{item.icon}</div>
                                        <p className="text-gray-300 text-lg">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
                                <p className="text-orange-300 text-xl">
                                    This ensures <span className="text-orange-400 font-bold">diversity of solutions</span> and <span className="text-orange-400 font-bold">fair evaluation</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Evaluation Workflow - NEW SECTION */}
                <section id="workflow" className="relative bg-gradient-to-br from-blue-900/10 via-black to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                                    <FaClock className="text-blue-400 text-4xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-blue-400">Evaluation Deliverables</h2>
                                    <p className="text-blue-300 font-mono text-sm mt-1">Three-stage comprehensive review</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-lg mb-12">
                                The hackathon features three stages of evaluation to ensure a comprehensive review of all projects.
                            </p>

                            {/* First Evaluation */}
                            <div className="mb-12">
                                <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-4xl font-bold text-purple-400">1</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-purple-400">First Evaluation</h3>
                                            <p className="text-cyan-400 font-mono">3:00 PM - 6:00 PM</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mt-4">Focus: Project conceptualization and initial setup</p>
                                </div>

                                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-purple-500/10">
                                            <tr>
                                                <th className="text-left p-4 text-purple-400 font-mono">Deliverable</th>
                                                <th className="text-left p-4 text-purple-400 font-mono">Requirement</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            <tr className="border-t border-purple-500/20">
                                                <td className="p-4 font-semibold">Problem understanding</td>
                                                <td className="p-4">A brief description of the understanding of the problem being solved</td>
                                            </tr>
                                            <tr className="border-t border-purple-500/20">
                                                <td className="p-4 font-semibold">Proposed Solution/Approach</td>
                                                <td className="p-4">Initial thoughts and relevance of Solution</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Break Time */}
                            <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 mb-12 text-center">
                                <div className="text-4xl mb-4">🎵</div>
                                <h3 className="text-2xl font-bold text-green-400 mb-2">Break Time</h3>
                                <p className="text-cyan-400 font-mono mb-4">6:30 PM - 9:00 PM</p>
                                <p className="text-gray-300">
                                    Teams can attend the concert and go through the stalls for snacks near swimming pool area.
                                </p>
                            </div>

                            {/* Second Evaluation */}
                            <div className="mb-12">
                                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-4xl font-bold text-cyan-400">2</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-cyan-400">Second Evaluation</h3>
                                            <p className="text-blue-400 font-mono">1:00 AM - 4:00 AM</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mt-4">Focus: Technical execution and progress towards working prototype</p>
                                </div>

                                <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-2xl overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-cyan-500/10">
                                            <tr>
                                                <th className="text-left p-4 text-cyan-400 font-mono">Deliverable</th>
                                                <th className="text-left p-4 text-cyan-400 font-mono">Requirement</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            <tr className="border-t border-cyan-500/20">
                                                <td className="p-4 font-semibold">Tech stack/architecture</td>
                                                <td className="p-4">Description about tools used</td>
                                            </tr>
                                            <tr className="border-t border-cyan-500/20">
                                                <td className="p-4 font-semibold">Implementation of proposed solution</td>
                                                <td className="p-4">Precision of Solution with respect to proposed solution</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Final Evaluation */}
                            <div className="mb-12">
                                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-4xl font-bold text-yellow-400">3</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-yellow-400">Final Evaluation</h3>
                                            <p className="text-orange-400 font-mono">10:00 AM - 12:30 PM</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mt-4">Focus: Comprehensive submission and live presentation for top teams</p>
                                </div>

                                {/* Submission Requirements */}
                                <div className="mb-8">
                                    <h4 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                                        <FaFileAlt /> Submission Requirements (9:00 AM - 10:00 AM)
                                    </h4>
                                    <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-2xl overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-yellow-500/10">
                                                <tr>
                                                    <th className="text-left p-4 text-yellow-400 font-mono">Deliverable</th>
                                                    <th className="text-left p-4 text-yellow-400 font-mono">Requirement</th>
                                                    <th className="text-left p-4 text-yellow-400 font-mono">Format</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-300">
                                                <tr className="border-t border-yellow-500/20">
                                                    <td className="p-4 font-semibold">Working Product (Bonus)</td>
                                                    <td className="p-4">Deployed link</td>
                                                    <td className="p-4 text-green-400">URL</td>
                                                </tr>
                                                <tr className="border-t border-yellow-500/20">
                                                    <td className="p-4 font-semibold">Demo Video</td>
                                                    <td className="p-4">A max 2-minute video demonstrating the project's features</td>
                                                    <td className="p-4 text-cyan-400">Video file</td>
                                                </tr>
                                                <tr className="border-t border-yellow-500/20">
                                                    <td className="p-4 font-semibold">Presentation Deck</td>
                                                    <td className="p-4">Slides outlining the problem, solution, technology, and future scope</td>
                                                    <td className="p-4 text-purple-400">PDF/PPT</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Top 10 Presentation */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 mb-8">
                                    <h4 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                                        <FaTrophy /> Top 10 Team Presentation
                                    </h4>
                                    <p className="text-pink-400 font-mono mb-6">12:30 PM - 3:00 PM</p>
                                    <p className="text-gray-300 mb-6">
                                        The top 10 teams will be required to present their projects live to the panel of judges.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                            <h5 className="text-purple-400 font-bold mb-2">Demo</h5>
                                            <p className="text-gray-300">5 minutes for a live demonstration of the solution</p>
                                        </div>
                                        <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                                            <h5 className="text-pink-400 font-bold mb-2">Q&A</h5>
                                            <p className="text-gray-300">5 minutes of questioning by the judges</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Winner Announcement */}
                                <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-500/50 rounded-2xl p-8 text-center">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <h4 className="text-3xl font-bold text-yellow-400 mb-2">Winner Announcement</h4>
                                    <p className="text-orange-400 font-mono text-xl mb-4">3:00 PM - 3:30 PM</p>
                                    <p className="text-gray-300 text-lg mb-2">Main Stage</p>
                                    <p className="text-red-400 font-bold">The judges' decision is final.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
}
