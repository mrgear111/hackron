import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative bg-black/90 border-t border-cyan-500/20 py-12 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-xl font-bold font-mono"
            >
              <span className="text-cyan-400">&gt; </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                HACKRON_
              </span>
            </motion.h3>
            <p className="text-gray-400 font-mono">
              Empowering innovation through technology
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-mono text-white">
              <span className="text-purple-400">&gt; </span>
              Quick_Links
            </h4>
            <ul className="space-y-2 font-mono">
              {['Projects', 'Teams', 'Submit Project'].map((item, index) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="text-cyan-500/50">$</span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-mono text-white">
              <span className="text-cyan-400">&gt; </span>
              Contact_Info
            </h4>
            <ul className="space-y-2 font-mono text-gray-400">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-purple-500/50">$</span>
                info@hackron.com
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="text-purple-500/50">$</span>
                @hackron
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-400 font-mono">
            <span className="text-cyan-500/50">&gt; </span>
            © 2024 Hackron. All rights reserved_
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-cyan-400"
            >
              |
            </motion.span>
          </p>
        </motion.div>
      </div>

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
    </footer>
  );
};

export default Footer; 