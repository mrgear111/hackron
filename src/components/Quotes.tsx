import { useEffect, useState } from 'react';

const quotes = [
  "Code is like humor. When you have to explain it, it's bad. – Cory House",
  "Simplicity is the soul of efficiency. – Austin Freeman",
  "The best way to predict the future is to invent it. – Alan Kay",
  "First, solve the problem. Then, write the code. – John Johnson",
  "Experience is the name everyone gives to their mistakes. – Oscar Wilde",
  "In programming, the hard part isn't solving problems, but deciding what problems to solve. – Paul Graham",
  "The only way to go fast is to go well. – Robert C. Martin",
];

const Quotes = () => {
  const [quote, setQuote] = useState<string>(quotes[0]);
  const [fade, setFade] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
        setFade(true);
      }, 300); // Delay for fade-out effect
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center my-6">
      <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gray-900 border border-green-500 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105 relative overflow-hidden">
          <p className="text-center text-lg font-mono text-green-400 font-bold animate-pulse">{quote}</p>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-20 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Quotes; 