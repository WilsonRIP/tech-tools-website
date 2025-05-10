'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10"></div>; // Placeholder to prevent layout shift
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center"
      whileTap={{ scale: 0.85 }}
      aria-label="Toggle dark mode"
    >
      {/* Sun icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`absolute w-5 h-5 text-yellow-500 transition-all ${
          theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </motion.svg>

      {/* Moon icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`absolute w-5 h-5 text-slate-300 transition-all ${
          theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        animate={{ rotate: theme === 'dark' ? 0 : -180 }}
        transition={{ duration: 0.5 }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </motion.svg>
    </motion.button>
  );
} 