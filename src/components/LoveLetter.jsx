import React, { useState, useEffect, useRef } from 'react';
import { Mail, Heart } from 'lucide-react';
import { CONFIG } from '../config.js';

export default function LoveLetter() {
  const [visibleParagraphs, setVisibleParagraphs] = useState([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const sectionRef = useRef(null);
  const letterData = CONFIG.letter;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted || isDone) return;

    const paragraphs = letterData.paragraphs;
    if (currentParagraphIndex >= paragraphs.length) {
      setIsDone(true);
      return;
    }

    const fullText = paragraphs[currentParagraphIndex];
    let charIndex = 0;
    setTypedText('');

    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText[charIndex]);
      charIndex++;

      if (charIndex >= fullText.length) {
        clearInterval(interval);
        // Save completed paragraph
        setVisibleParagraphs((prev) => [...prev, fullText]);
        setTypedText('');
        // Move to the next paragraph
        setTimeout(() => {
          setCurrentParagraphIndex((prev) => prev + 1);
        }, 500);
      }
    }, 15); // Fast typing speed for readability

    return () => clearInterval(interval);
  }, [hasStarted, currentParagraphIndex, isDone, letterData.paragraphs]);

  return (
    <section 
      ref={sectionRef} 
      id="letter" 
      className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gold/5 border border-gold/20 mb-4 text-gold animate-pulse">
            <Mail className="w-6 h-6" />
          </div>
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 block select-none">
            From My Soul To Yours
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-gradient-gold select-none">
            {letterData.title || "If My Heart Could Write..."}
          </h2>
        </div>

        {/* Paper Glass Panel */}
        <div className="glass-panel p-8 md:p-16 border border-gold/15 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.8)] relative max-w-3xl mx-auto">
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/30"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/30"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/30"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/30"></div>

          <div className="font-playfair text-base md:text-lg text-gray-200 leading-relaxed space-y-6 md:space-y-8 select-text">
            {/* Render completed paragraphs */}
            {visibleParagraphs.map((para, idx) => (
              <p key={idx} className="whitespace-pre-line text-justify md:text-left transition-opacity duration-500 opacity-100">
                {para}
              </p>
            ))}

            {/* Render current typing paragraph */}
            {!isDone && currentParagraphIndex < letterData.paragraphs.length && (
              <p className="whitespace-pre-line text-justify md:text-left typewriter-cursor relative">
                {typedText}
              </p>
            ))}

            {/* Render valediction and signature */}
            {isDone && (
              <div className="pt-8 border-t border-white/5 flex flex-col items-end text-right select-none transition-all duration-1000 ease-out opacity-100 transform translate-y-0">
                <span className="text-sm md:text-base italic text-gold font-medium mb-3">
                  {letterData.valediction}
                </span>
                <span className="font-greatvibes text-3xl md:text-4xl text-gradient-gold font-bold tracking-wide">
                  {letterData.signature}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
