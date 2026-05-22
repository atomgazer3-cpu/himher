import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config.js';

function ReasonCard({ reason }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card w-full cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="flip-card-inner">
        {/* Front side */}
        <div className="flip-card-front flex flex-col items-center justify-center p-6 border border-gold/15 hover:border-gold/40 transition-all duration-300">
          <div className="text-4xl md:text-5xl mb-4 select-none filter drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
            {reason.emoji}
          </div>
          <h3 className="font-cinzel text-lg md:text-xl font-bold tracking-widest text-gradient-gold mb-2">
            {reason.title}
          </h3>
          <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-bold mt-4 animate-pulse select-none">
            Tap or Hover
          </p>
        </div>

        {/* Back side */}
        <div className="flip-card-back flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Heart watermark */}
          <Heart className="absolute w-24 h-24 text-red-500/5 -bottom-4 -right-4 stroke-transparent fill-red-500/5" />
          
          <h3 className="font-cinzel text-sm md:text-base font-bold tracking-widest text-red-400 mb-4 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-red-500 stroke-transparent animate-pulse" />
            {reason.title}
          </h3>
          <p className="font-playfair italic text-xs md:text-sm text-gray-200 leading-relaxed text-center">
            "{reason.description}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Reasons() {
  return (
    <section id="reasons" className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Background glow spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block select-none">
            Why My Heart Beats
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-gradient-gold mb-6 select-none">
            Reasons I Love You
          </h2>
          <p className="font-playfair text-gray-400 italic text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            "Eight beautiful pieces of the infinite puzzle of why you are my absolute favorite person in this universe."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONFIG.reasons.map((reason, idx) => (
            <ReasonCard key={idx} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
