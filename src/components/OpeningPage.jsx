import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { CONFIG } from '../config.js';

export default function OpeningPage({ onUnlock }) {
  const [introStep, setIntroStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Storytelling sequence timings
  useEffect(() => {
    const steps = [
      { delay: 3000 }, // "A love story written by destiny..."
      { delay: 3000 }, // "Before the world knew us..."
      { delay: 2500 }, // "There was Chinnoda."
      { delay: 2500 }, // "There was Mattooooo."
      { delay: 3000 }, // "And then... forever began ❤️"
    ];

    let timer;
    const runIntro = (index) => {
      if (index < steps.length) {
        timer = setTimeout(() => {
          setIntroStep(index + 1);
          runIntro(index + 1);
        }, steps[index].delay);
      }
    };

    runIntro(0);

    return () => clearTimeout(timer);
  }, []);

  // Anniversary Countdown Timer Calculations
  useEffect(() => {
    const targetDate = new Date(CONFIG.countdownTargetDate);

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Story texts array
  const introTexts = [
    "A love story written by destiny...",
    "Before the world knew us...",
    "There was Chinnoda.",
    "There was Mattooooo.",
    "And then... forever began ❤️"
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-radial-gradient px-6 z-10 overflow-hidden">
      {/* Moonlight Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none select-none"></div>

      <AnimatePresence mode="wait">
        {introStep < 5 ? (
          // Sequential Storytelling Screens
          <motion.div
            key={introStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="text-center max-w-2xl"
          >
            <h1 className={`font-cinzel text-3xl md:text-5xl font-semibold tracking-wider leading-relaxed select-none ${
              introStep >= 2 ? "text-gradient-gold font-bold" : "text-gray-300"
            }`}>
              {introTexts[introStep]}
            </h1>
          </motion.div>
        ) : (
          // Target Countdown & Entrance Screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-center w-full max-w-4xl"
          >
            {/* Header Badge */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs uppercase tracking-widest mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 fill-gold animate-pulse text-gold" />
              <span>Chinnoda & Mattooooo</span>
            </motion.div>

            {/* Sub-label */}
            <h2 className="font-playfair text-xl md:text-2xl text-gray-300 italic mb-6 tracking-wide select-none">
              {CONFIG.countdownLabel}
            </h2>

            {/* Giant Glowing Countdown Timer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto mb-16 px-4">
              {[
                { label: "Days", val: timeLeft.days, colorClass: "glow-text-gold text-white" },
                { label: "Hours", val: timeLeft.hours, colorClass: "glow-text-gold text-white" },
                { label: "Minutes", val: timeLeft.minutes, colorClass: "glow-text-gold text-white" },
                { label: "Seconds", val: timeLeft.seconds, colorClass: "glow-text-red text-red-400 animate-pulse" }
              ].map((dial, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.15, duration: 0.8 }}
                  key={dial.label} 
                  className="glass-panel border-gold/15 p-6 flex flex-col justify-center items-center relative overflow-hidden"
                >
                  <span className={`font-cinzel text-4xl md:text-5xl lg:text-6xl font-black ${dial.colorClass} tracking-tighter`}>
                    {String(dial.val).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gold mt-3 font-semibold select-none">{dial.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Trigger Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <button
                onClick={onUnlock}
                className="btn-shimmer px-10 py-4 rounded-full font-cinzel text-xs md:text-sm uppercase tracking-widest font-bold border border-gold/40 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Unlock Our Love Story ❤️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
