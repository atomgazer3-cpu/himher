import React, { useState, useEffect } from 'react';
import { Calendar, Award, Heart } from 'lucide-react';
import { CONFIG } from '../config.js';

export default function Countdowns() {
  const [monthlyTimeLeft, setMonthlyTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [yearlyTimeLeft, setYearlyTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [yearlyNumber, setYearlyNumber] = useState(2);
  const [monthlyLabel, setMonthlyLabel] = useState('');

  const startDate = new Date(CONFIG.couple.relationshipStart);

  useEffect(() => {
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const updateCountdowns = () => {
      const now = new Date();
      
      // Calculate Next Monthly
      const day = startDate.getDate();
      let nextMonthly = new Date(now.getFullYear(), now.getMonth(), day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
      if (nextMonthly <= now) {
        nextMonthly = new Date(now.getFullYear(), now.getMonth() + 1, day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
      }
      
      // Monthly milestone index (how many months total)
      const diffMonths = (nextMonthly.getFullYear() - startDate.getFullYear()) * 12 + (nextMonthly.getMonth() - startDate.getMonth());
      setMonthlyLabel(`${getOrdinal(diffMonths)} Monthly Milestone`);

      // Calculate Next Yearly
      const month = startDate.getMonth();
      let nextYearly = new Date(now.getFullYear(), month, day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
      if (nextYearly <= now) {
        nextYearly = new Date(now.getFullYear() + 1, month, day, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
      }
      const diffYears = nextYearly.getFullYear() - startDate.getFullYear();
      setYearlyNumber(diffYears);

      // Calculations
      const calcTimeLeft = (target) => {
        const diffMs = target - now;
        if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const diffSecs = Math.floor(diffMs / 1000);
        return {
          days: Math.floor(diffSecs / (3600 * 24)),
          hours: Math.floor((diffSecs % (3600 * 24)) / 3600),
          minutes: Math.floor((diffSecs % 3600) / 60),
          seconds: diffSecs % 60
        };
      };

      setMonthlyTimeLeft(calcTimeLeft(nextMonthly));
      setYearlyTimeLeft(calcTimeLeft(nextYearly));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const getOrdinalSuffix = (num) => {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  return (
    <section className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Background glow spots */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block select-none">
            What We're Waiting For
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-gradient-gold mb-6 select-none">
            Future Milestones
          </h2>
          <p className="font-playfair text-gray-400 italic text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            "Counting down the chapters yet to be written, knowing every single one will be beautiful."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Countdown Card */}
          <div className="glass-panel p-8 border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all duration-500 rounded-2xl flex flex-col justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-xl rounded-full"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-gold/10 text-gold border border-gold/25 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white tracking-widest">
                    Monthly Anniversary
                  </h3>
                  <p className="text-[10px] text-gold uppercase tracking-wider font-semibold mt-0.5">
                    {monthlyLabel}
                  </p>
                </div>
              </div>

              {/* Time display */}
              <div className="grid grid-cols-4 gap-3 my-6">
                {[
                  { label: 'Days', val: monthlyTimeLeft.days },
                  { label: 'Hours', val: monthlyTimeLeft.hours },
                  { label: 'Mins', val: monthlyTimeLeft.minutes },
                  { label: 'Secs', val: monthlyTimeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="bg-royal-dark/50 border border-white/5 rounded-lg py-3 text-center">
                    <span className="font-cinzel text-xl md:text-2xl font-black text-white block">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-playfair text-xs italic text-gray-400 text-center mt-4">
              "Another month of falling in love all over again."
            </p>
          </div>

          {/* Yearly Countdown Card */}
          <div className="glass-panel p-8 border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all duration-500 rounded-2xl flex flex-col justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-xl rounded-full"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white tracking-widest">
                    Yearly Anniversary
                  </h3>
                  <p className="text-[10px] text-red-400 uppercase tracking-wider font-semibold mt-0.5">
                    Our {yearlyNumber}{getOrdinalSuffix(yearlyNumber)} Anniversary
                  </p>
                </div>
              </div>

              {/* Time display */}
              <div className="grid grid-cols-4 gap-3 my-6">
                {[
                  { label: 'Days', val: yearlyTimeLeft.days },
                  { label: 'Hours', val: yearlyTimeLeft.hours },
                  { label: 'Mins', val: yearlyTimeLeft.minutes },
                  { label: 'Secs', val: yearlyTimeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="bg-royal-dark/50 border border-white/5 rounded-lg py-3 text-center">
                    <span className="font-cinzel text-xl md:text-2xl font-black text-white block">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-playfair text-xs italic text-gray-400 text-center mt-4">
              "To many more years of written stars and cosmic destinies."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
