import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman"
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "In programming, the hard part isn't solving problems, but deciding what problems to solve.",
    author: "Paul Graham"
  },
  {
    text: "The only way to go fast is to go well.",
    author: "Robert C. Martin"
  },
];

const Quotes = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="my-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-black/60 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 overflow-hidden">
        {/* Animated scan line */}
        <motion.div 
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"
          animate={{ 
            y: [0, 200],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "linear" 
          }}
        />
        
        {/* Quote content */}
        <div className="flex flex-col items-center text-center">
          <div className="min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-cyan-400 font-mono leading-relaxed"
              >
                "{quotes[currentQuote].text}"
              </motion.p>
            </AnimatePresence>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2 text-purple-400 font-mono text-sm"
            >
              — {quotes[currentQuote].author}
            </motion.p>
          </AnimatePresence>
        </div>
        
        {/* Quote navigation dots */}
        <div className="mt-4 flex justify-center space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuote(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                currentQuote === index 
                  ? 'bg-cyan-500' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Quotes; 