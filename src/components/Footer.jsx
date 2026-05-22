import React from 'react';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-black via-[#040000] to-transparent pt-32 pb-16 px-6 z-10 text-center select-none overflow-hidden">
      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-16">
        <div className="h-[1px] bg-gradient-to-r from-transparent to-gold/30 flex-1"></div>
        <Heart className="w-4 h-4 fill-gold stroke-transparent animate-pulse text-gold" />
        <div className="h-[1px] bg-gradient-to-l from-transparent to-gold/30 flex-1"></div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Cinematic Final Phrase */}
        <h3 className="font-greatvibes text-4xl md:text-6xl text-gradient-gold font-bold mb-8 tracking-wide drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]">
          To Infinity & Beyond...
        </h3>

        <p className="font-cinzel text-xs md:text-sm tracking-[0.25em] text-gray-500 uppercase font-bold mb-10 max-w-xl leading-relaxed">
          Our love is written in the stars, and this is only our first chapter.
        </p>

        {/* Small copyright text */}
        <div className="text-[10px] text-gray-600 uppercase tracking-widest flex flex-col md:flex-row items-center gap-1.5 md:gap-3">
          <span>Made with love by {CONFIG.couple.partner1}</span>
          <span className="hidden md:inline text-gold">•</span>
          <span>© {currentYear} Our Infinite Story</span>
          <span className="hidden md:inline text-gold">•</span>
          <span className="flex items-center gap-1">
            Locked forever in the matrix
            <Heart className="w-2.5 h-2.5 fill-red-600 stroke-transparent animate-pulse" />
          </span>
        </div>
      </div>
    </footer>
  );
}
