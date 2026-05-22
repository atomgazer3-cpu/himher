import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Heart, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config.js';

export default function SecretMessage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isError, setIsError] = useState(false);
  const targetCode = CONFIG.secret.passcode;

  // Check sessionStorage so it stays unlocked if refreshed during this session
  useEffect(() => {
    const unlockedSession = sessionStorage.getItem('love_story_unlocked');
    if (unlockedSession === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanInput = password.trim();
    
    if (cleanInput === targetCode) {
      setIsUnlocked(true);
      sessionStorage.setItem('love_story_unlocked', 'true');
      // Confetti explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#ffffff']
      });
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setPassword('');
      }, 500); // Wait for shake animation to finish
    }
  };

  return (
    <section id="secret" className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16">
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block select-none">
            Locked Chamber
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-gradient-gold mb-6 select-none">
            Our Secret Sanctuary
          </h2>
          <p className="font-playfair text-gray-400 italic text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            "A box of promises meant only for your eyes. Guarded by the date our forever truly began."
          </p>
        </div>

        {!isUnlocked ? (
          /* Padlock view */
          <form 
            onSubmit={handleSubmit}
            className={`glass-panel p-8 md:p-10 border max-w-sm w-full mx-auto flex flex-col items-center relative overflow-hidden transition-all duration-300 ${
              isError ? 'border-red-500/50 animate-shake shadow-[0_0_25px_rgba(239,68,68,0.2)]' : 'border-gold/15'
            }`}
          >
            {/* Padlock icon */}
            <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 transition-all duration-300 ${
              isError ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-gold/30 bg-gold/5 text-gold'
            }`}>
              <Lock className="w-6 h-6 animate-pulse" />
            </div>

            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold text-center mb-8 px-4 leading-relaxed">
              {CONFIG.secret.lockedMessage}
            </p>

            {/* Alphanumeric Password Input */}
            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode..."
                disabled={isError}
                className="w-full px-5 py-3.5 rounded-full font-sans text-sm border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all duration-200 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Decrypt Button */}
            <button
              type="submit"
              disabled={isError || !password.trim()}
              className="w-full py-3.5 rounded-full font-cinzel text-xs uppercase tracking-widest font-bold border border-gold/30 bg-gold/15 text-gold hover:bg-gold/25 hover:border-gold/50 active:scale-98 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
            >
              Decrypt Promise
            </button>
          </form>
        ) : (
          /* Unlocked Message view */
          <div className="glass-panel-glow p-8 md:p-12 border border-gold/30 max-w-2xl w-full mx-auto text-center relative overflow-hidden transition-all duration-1000 transform translate-y-0 opacity-100 animate-fadeIn">
            {/* Heart Watermarks */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-600/5 blur-xl rounded-full"></div>

            <div className="w-16 h-16 rounded-full border border-gold/40 bg-gold/10 text-gold flex items-center justify-center mb-6 mx-auto shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Unlock className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="font-cinzel text-2xl md:text-3xl font-black text-gradient-gold mb-6 select-none">
              {CONFIG.secret.unlockedTitle}
            </h3>

            <div className="font-playfair text-base md:text-lg text-gray-200 leading-relaxed max-w-xl mx-auto space-y-6 select-text mb-8">
              <p className="whitespace-pre-line">
                {CONFIG.secret.unlockedText}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1 text-red-500 select-none">
              <Heart className="w-4 h-4 fill-red-500 stroke-transparent animate-heartbeat" />
              <span className="font-cinzel text-[10px] tracking-[0.3em] font-bold text-gold">Chinnoda ❤️ Mattooooo</span>
              <Heart className="w-4 h-4 fill-red-500 stroke-transparent animate-heartbeat" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
