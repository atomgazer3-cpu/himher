import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config.js';

export default function LoveTimer() {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const startDate = new Date(CONFIG.couple.relationshipStart);

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date();
      const diffMs = now - startDate;

      if (diffMs <= 0) {
        setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setAge({ years: 0, months: 0, days: 0 });
        return;
      }

      const diffSecs = Math.floor(diffMs / 1000);
      const d = Math.floor(diffSecs / (3600 * 24));
      const h = Math.floor((diffSecs % (3600 * 24)) / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = diffSecs % 60;

      setElapsed({ days: d, hours: h, minutes: m, seconds: s });

      // Calculate exact age of relationship in Years, Months, and Days
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
      }

      if (months < 0) {
        months += 12;
        years--;
      }

      setAge({ years, months, days });
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="timer" className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Heart beat indicator */}
        <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
          <Heart className="w-5 h-5 fill-red-500 stroke-transparent animate-heartbeat" />
          <span className="uppercase tracking-widest font-bold text-xs select-none">Live Connection Clock</span>
        </div>

        <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest mb-6 text-gradient-gold">
          We Have Loved Through
        </h2>

        {/* Relationship Age Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs md:text-sm uppercase tracking-widest mb-12 font-bold select-none backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 fill-gold stroke-transparent animate-pulse" />
          <span>
            {age.years} {age.years === 1 ? 'Year' : 'Years'} • {age.months} {age.months === 1 ? 'Month' : 'Months'} • {age.days} {age.days === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        {/* Dials Container */}
        <div className="glass-panel-glow max-w-4xl mx-auto p-8 md:p-12 relative overflow-hidden">
          {/* Subtle neon dust spots */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gold/5 blur-2xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-red-600/5 blur-2xl rounded-full"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {[
              { label: "Days", val: elapsed.days, color: "glow-text-gold text-white" },
              { label: "Hours", val: elapsed.hours, color: "glow-text-gold text-white" },
              { label: "Minutes", val: elapsed.minutes, color: "glow-text-gold text-white" },
              { label: "Seconds", val: elapsed.seconds, color: "glow-text-red text-red-400" }
            ].map((dial) => (
              <div 
                key={dial.label} 
                className="dial-container p-4 glass-panel border border-gold/10 hover:border-gold/30 transition-colors duration-500"
              >
                <span className={`font-cinzel text-4xl md:text-6xl font-black ${dial.color} tracking-tighter`}>
                  {String(dial.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold mt-3 font-semibold select-none flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 fill-red-500 stroke-transparent animate-pulse" />
                  {dial.label}
                </span>
              </div>
            ))}
          </div>

          <p className="font-playfair italic text-gray-400 text-sm md:text-base mt-10 tracking-widest select-none">
            "And every second with you feels like a beautiful eternity..."
          </p>
        </div>

      </div>
    </section>
  );
}
