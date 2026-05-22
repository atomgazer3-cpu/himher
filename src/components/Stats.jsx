import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config.js';

// Animated count-up sub-component
function AnimatedCounter({ targetValue, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = parseFloat(targetValue);
    if (isNaN(end)) {
      setCount(targetValue);
      return;
    }

    const totalFrames = Math.round(duration / 16.6); // ~60fps
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * end);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentValue);
      }
    }, 16.6);

    return () => clearInterval(timer);
  }, [isVisible, targetValue, duration]);

  // Format number with commas
  const formatNumber = (num) => {
    if (typeof num === 'number') {
      if (num % 1 !== 0) return num.toFixed(1); // Keep float decimals (e.g. 99.9)
      return num.toLocaleString();
    }
    return num;
  };

  return (
    <span ref={elementRef} className="font-cinzel text-3xl md:text-5xl font-black text-white glow-text-gold tracking-tight">
      {formatNumber(count)}
    </span>
  );
}

export default function Stats() {
  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const startDate = new Date(CONFIG.couple.relationshipStart);
    const calculateDays = () => {
      const now = new Date();
      const diffMs = now - startDate;
      const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      setDaysTogether(days);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="stats" className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block select-none">
            Our Little Universe
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-gradient-gold mb-6 select-none">
            Love By The Numbers
          </h2>
          <p className="font-playfair text-gray-400 italic text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            "We build our own infinity out of quiet seconds, spoken secrets, and shared laughter."
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CONFIG.stats.map((stat, idx) => {
            const targetVal = stat.id === 'stat-days' ? daysTogether : stat.value;
            return (
              <div 
                key={stat.id || idx}
                className="glass-panel p-6 border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_15px_rgba(218,165,32,0.15)] transition-all duration-500 rounded-lg text-center flex flex-col justify-between group"
              >
                <div className="text-2xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {stat.prefix}
                </div>
                
                <div className="my-3">
                  <AnimatedCounter targetValue={targetVal} />
                  <span className="font-cinzel text-xl md:text-2xl font-black text-gold ml-0.5 select-none">
                    {stat.suffix}
                  </span>
                </div>

                <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400 mt-4 leading-relaxed border-t border-white/5 pt-4 group-hover:text-gold transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
