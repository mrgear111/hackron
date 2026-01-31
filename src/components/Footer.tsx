import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaRocket, FaCode, FaTrophy, FaBook, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    event: [
      { name: 'Team Dashboard', href: '/team-dashboard' },
      { name: 'Problems', href: '/problems' },
      { name: 'Rulebook', href: '/docs' },
      { name: 'Leaderboard', href: '/leaderboard' },
    ],
    resources: [
      { name: 'Admin Dashboard', href: '/admin-dashboard' },
      { name: 'Register', href: '/register' },
    ],
    connect: [
      { name: 'Prabhav', href: 'https://github.com/Prabhav1437', icon: FaGithub },
      { name: 'Daksh', href: 'https://github.com/mrgear111', icon: FaGithub },
      { name: 'DevClub', href: 'https://github.com/nst-sdc', icon: FaCode },
    ]
  };

  return (
    <footer className="relative bg-gradient-to-b from-tekron-purple-deep via-primary-dark-base to-black border-t-2 border-tekron-pink-neon/30 overflow-hidden">
      {/* Animated Background - matching hero */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-tekron-purple-deep/80 to-transparent"></div>

      {/* Glowing orbs - purple/pink theme */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-tekron-pink-neon/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-purple/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaTrophy className="text-yellow-400 text-4xl" />
              <h3 className="text-4xl font-pixel bg-clip-text bg-gradient-to-r from-pink-500 via-purple-300 to-accent-cyan">
                HACKRON 2.0
              </h3>
            </div>
            <p className="text-text-soft-lavender text-xl leading-relaxed max-w-xs">
              24-hour innovation sprint. Build the future with cutting-edge technology.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-text-soft-lavender text-lg">
                <FaMapMarkerAlt className="text-accent-cyan text-xl" />
                <span>Lab 1 & 2, NST Campus</span>
              </div>
              <div className="flex items-center space-x-3 text-text-soft-lavender text-lg">
                <FaEnvelope className="text-accent-cyan text-xl" />
                <span>31st Jan - 1st Feb 2026</span>
              </div>
            </div>
          </motion.div>

          {/* Event Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-2xl font-pixel text-accent-cyan mb-4">
              <span className="text-tekron-pink-neon">&gt;</span> EVENT
            </h4>
            <ul className="space-y-3">
              {footerLinks.event.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-text-soft-lavender hover:text-accent-cyan transition-colors duration-200 text-lg flex items-center group"
                  >
                    <motion.span
                      className="text-tekron-pink-neon/50 mr-2 group-hover:text-tekron-pink-neon text-xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      &gt;
                    </motion.span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-2xl font-pixel text-accent-cyan mb-4">
              <span className="text-tekron-pink-neon">&gt;</span> RESOURCES
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-text-soft-lavender hover:text-accent-cyan transition-colors duration-200 text-lg flex items-center group"
                  >
                    <motion.span
                      className="text-tekron-pink-neon/50 mr-2 group-hover:text-tekron-pink-neon text-xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      &gt;
                    </motion.span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-2xl font-pixel text-accent-cyan mb-4">
              <span className="text-tekron-pink-neon">&gt;</span> CONNECT
            </h4>
            <div className="space-y-3">
              {footerLinks.connect.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-text-soft-lavender hover:text-accent-cyan transition-colors duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border-2 border-accent-cyan/30 flex items-center justify-center group-hover:bg-accent-cyan/20 group-hover:border-accent-cyan/50 transition-all">
                      <Icon className="text-accent-cyan text-xl" />
                    </div>
                    <span className="text-lg">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-tekron-pink-neon/20"></div>
          </div>
          <motion.div
            className="absolute top-1/2 left-0 w-full h-0.5"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 0, 110, 0.8), rgba(160, 107, 255, 0.8), transparent)'
            }}
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-lg">
            {/* Crafted By */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 flex-wrap justify-center md:justify-start"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 10px rgba(160, 107, 255, 0)",
                    "0 0 20px rgba(160, 107, 255, 0.8)",
                    "0 0 10px rgba(160, 107, 255, 0)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-text-soft-lavender"
              >
                <span className="text-accent-cyan text-xl">&gt;</span> Crafted_by
              </motion.span>
              <motion.span
                animate={{
                  color: ["#a06bff", "#ff006e", "#a06bff"],
                  textShadow: [
                    "0 0 10px rgba(160, 107, 255, 0.5)",
                    "0 0 20px rgba(255, 0, 110, 0.8)",
                    "0 0 10px rgba(160, 107, 255, 0.5)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-bold font-pixel"
              >
                <a
                  href="https://github.com/Prabhav1437"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-cyan transition-colors duration-200"
                >
                  Prabhav
                </a>
              </motion.span>
              <span className="text-text-soft-lavender text-xl">&</span>
              <motion.span
                animate={{
                  color: ["#a06bff", "#ff006e", "#a06bff"],
                  textShadow: [
                    "0 0 10px rgba(160, 107, 255, 0.5)",
                    "0 0 20px rgba(255, 0, 110, 0.8)",
                    "0 0 10px rgba(160, 107, 255, 0.5)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="font-bold font-pixel"
              >
                <a
                  href="https://github.com/mrgear111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-cyan transition-colors duration-200"
                >
                  Daksh | NST-SDC
                </a>
              </motion.span>
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-text-soft-lavender"
            >
              <span className="text-tekron-pink-neon/50 text-xl">&gt;</span>
              <span>© {currentYear} HACKRON. All rights reserved</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-accent-cyan text-xl"
              >
                _
              </motion.span>
            </motion.div>

            {/* Hosted By */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 10px rgba(160, 107, 255, 0)",
                    "0 0 20px rgba(160, 107, 255, 0.8)",
                    "0 0 10px rgba(160, 107, 255, 0)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-text-soft-lavender"
              >
                <span className="text-accent-cyan text-xl">&gt;</span> Hosted_by
              </motion.span>
              <motion.span
                animate={{
                  color: ["#a06bff", "#ff006e", "#a06bff"],
                  textShadow: [
                    "0 0 10px rgba(160, 107, 255, 0.5)",
                    "0 0 20px rgba(255, 0, 110, 0.8)",
                    "0 0 10px rgba(160, 107, 255, 0.5)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-bold font-pixel"
              >
                <a
                  href="https://www.newtonschool.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-cyan transition-colors duration-200"
                >
                  NST
                </a>
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;