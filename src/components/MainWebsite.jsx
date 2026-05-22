import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';
import { CONFIG } from '../config.js';
import LoveTimer from './LoveTimer.jsx';
import Gallery from './Gallery.jsx';
import Stats from './Stats.jsx';
import Reasons from './Reasons.jsx';
import LoveLetter from './LoveLetter.jsx';
import SecretMessage from './SecretMessage.jsx';
import Countdowns from './Countdowns.jsx';
import Footer from './Footer.jsx';

export default function MainWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle sticky header background & scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll Spy logic
      const sections = ['hero', 'timer', 'gallery', 'stats', 'reasons', 'letter', 'secret'];
      let currentActive = 'hero';
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 150;
          const bottom = top + el.offsetHeight;
          if (window.scrollY >= top && window.scrollY < bottom) {
            currentActive = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'Love Timer', href: '#timer', id: 'timer' },
    { label: 'Moments', href: '#gallery', id: 'gallery' },
    { label: 'Stats', href: '#stats', id: 'stats' },
    { label: 'Reasons', href: '#reasons', id: 'reasons' },
    { label: 'Love Letter', href: '#letter', id: 'letter' },
    { label: 'Secret Pad', href: '#secret', id: 'secret' },
  ];

  return (
    <div className="relative w-full min-h-screen pt-20 z-10 cinematic-bg">
      {/* Floating Navigation Header */}
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-royal-dark/90 backdrop-blur-md border-b-gold/15 py-3' 
          : 'bg-transparent border-b-white/5 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#hero" className="font-cinzel text-xl md:text-2xl font-bold tracking-widest text-gradient-gold select-none">
            OUR INFINITY
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex gap-6 text-xs md:text-sm uppercase tracking-widest font-semibold">
            {navLinks.map(link => (
              <a 
                key={link.href}
                href={link.href}
                className={`transition-colors duration-300 relative py-1 ${
                  activeSection === link.id ? 'text-gold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-royal-dark/98 border-b border-gold/15 p-6 glass-panel rounded-none">
            <nav className="flex flex-col gap-5 text-sm uppercase tracking-widest font-semibold text-center">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors duration-200 ${
                    activeSection === link.id ? 'text-gold' : 'text-gray-300 hover:text-gold'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-[85vh] flex items-center justify-center relative px-6 text-center overflow-hidden">
        {/* Ambient starglow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gold/5 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5 fill-gold stroke-transparent animate-heartbeat text-gold" />
            <span>An Infinite Recognition</span>
          </div>

          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-black text-gradient-gold mb-6 tracking-wide select-none">
            {CONFIG.couple.partner1} <span className="text-red-500 text-3xl md:text-5xl lg:text-6xl align-middle">❤️</span> {CONFIG.couple.partner2}
          </h1>

          <p className="font-playfair text-xl md:text-3xl text-gray-200 italic mb-6 tracking-wide max-w-3xl mx-auto leading-relaxed">
            "Some souls don’t just meet... they recognize each other."
          </p>

          <p className="font-light text-xs md:text-sm text-gray-400 max-w-xl mx-auto uppercase tracking-[0.25em] mb-4">
            Since April 23, 2025 — 4:40 PM
          </p>
          
          <p className="font-playfair text-sm md:text-base text-gold italic tracking-widest mb-12">
            The moment my forever found its name.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#timer" 
              className="btn-shimmer px-8 py-3.5 rounded-full font-cinzel text-xs uppercase tracking-widest font-bold"
            >
              See Our Time Together
            </a>
            <a 
              href="#gallery" 
              className="px-8 py-3.5 rounded-full border border-white/20 hover:border-gold/50 bg-white/5 text-xs font-cinzel uppercase tracking-widest font-bold hover:text-gold transition-all duration-300"
            >
              Browse Gallery
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 select-none pointer-events-none">
          <span className="text-[9px] tracking-[0.4em] uppercase text-gray-500 font-bold animate-pulse">Begin the Story</span>
          <ChevronDown className="w-4 h-4 text-gold animate-bounce" />
        </div>
      </section>

      {/* Main Website Sections */}
      <LoveTimer />
      <Gallery />
      <Stats />
      <Reasons />
      <LoveLetter />
      <SecretMessage />
      <Countdowns />
      <Footer />
    </div>
  );
}
