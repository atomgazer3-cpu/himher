import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ChevronLeft, ChevronRight, X, Sparkle, Upload, Trash2, Heart } from 'lucide-react';
import { CONFIG } from '../config.js';

const SUGGESTED_CAPTIONS = [
  "The smile that stole my peace ❤️",
  "My favorite chaos ✨",
  "One photo, infinite heartbeats 🔮",
  "Us, in our own universe 💓",
  "My favorite place is inside your hug 🤗",
  "Every moment with you is a fairytale 👑",
  "Forever isn't long enough with you ⏳",
  "My heart beats only for you 💓"
];

export default function Gallery() {
  const [allMemories, setAllMemories] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customCaption, setCustomCaption] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Initialize memories from localStorage + CONFIG
  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    const stored = localStorage.getItem('anniv_uploads');
    let uploaded = [];
    if (stored) {
      try {
        uploaded = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse uploaded images", e);
      }
    }
    // Combine custom uploads first, then predefined config memories
    setAllMemories([...uploaded, ...CONFIG.memories]);
  };

  // Auto-scroll featured carousel
  useEffect(() => {
    const featuredCount = Math.min(6, allMemories.length);
    if (featuredCount <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [allMemories.length]);

  const handlePrevCarousel = () => {
    const featuredCount = Math.min(6, allMemories.length);
    setCarouselIndex((prev) => (prev - 1 + featuredCount) % featuredCount);
  };

  const handleNextCarousel = () => {
    const featuredCount = Math.min(6, allMemories.length);
    setCarouselIndex((prev) => (prev + 1) % featuredCount);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allMemories.length]);

  const handlePrevLightbox = () => {
    if (allMemories.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + allMemories.length) % allMemories.length);
  };

  const handleNextLightbox = () => {
    if (allMemories.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % allMemories.length);
  };

  // Client-side image compression
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress as JPEG quality 0.7 to minimize storage size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFiles = async (files) => {
    setUploadError('');
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      
      const captionText = customCaption.trim() || SUGGESTED_CAPTIONS[Math.floor(Math.random() * SUGGESTED_CAPTIONS.length)];
      const newMemory = {
        url: compressedBase64,
        caption: captionText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isUserUploaded: true,
        id: 'user_' + Date.now()
      };

      const stored = localStorage.getItem('anniv_uploads');
      let uploaded = [];
      if (stored) {
        uploaded = JSON.parse(stored);
      }
      
      uploaded = [newMemory, ...uploaded];
      localStorage.setItem('anniv_uploads', JSON.stringify(uploaded));
      
      // Reset inputs & refresh list
      setCustomCaption('');
      loadMemories();
    } catch (e) {
      console.error(e);
      setUploadError('Failed to process image. Try a smaller image.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDeleteMemory = (id, e) => {
    e.stopPropagation(); // Avoid triggering lightbox click
    const stored = localStorage.getItem('anniv_uploads');
    if (!stored) return;

    try {
      let uploaded = JSON.parse(stored);
      uploaded = uploaded.filter(mem => mem.id !== id);
      localStorage.setItem('anniv_uploads', JSON.stringify(uploaded));
      loadMemories();
      
      // If lightbox is open, close it
      setLightboxIndex(null);
    } catch (err) {
      console.error("Failed to delete memory", err);
    }
  };

  const featuredMemories = allMemories.slice(0, 6);

  return (
    <section id="gallery" className="py-24 md:py-32 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-gradient-gold">
            Moments My Heart Will Never Forget ❤️
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-4">Snaps of our laughter, milestones, and endless joy</p>
        </div>

        {/* 1. Drag & Drop Upload Zone */}
        <div className="max-w-3xl mx-auto mb-16">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`glass-panel border-2 border-dashed p-8 rounded-2xl text-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'border-gold bg-gold/10 scale-[1.01] shadow-[0_0_20px_rgba(218,165,32,0.15)]' 
                : 'border-gold/30 hover:border-gold/60 bg-white/5'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-5 h-5 text-gold animate-bounce" />
            </div>
            
            <h4 className="font-cinzel text-sm md:text-base font-bold text-white tracking-widest mb-2">
              Drag & Drop a Memory Here
            </h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
              Or click to browse from your device. Images are compressed locally and stored in your browser.
            </p>

            {/* Custom Caption Input */}
            <div className="max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder="Type a romantic caption... (or leave blank for random)"
                className="w-full px-4 py-2 text-xs rounded-full border border-white/10 bg-royal-dark/80 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 text-center"
              />
            </div>
            
            {uploadError && (
              <p className="text-xs text-red-500 font-semibold mt-3">{uploadError}</p>
            )}
          </div>
        </div>

        {/* 2. Featured Memories Carousel */}
        {featuredMemories.length > 0 && (
          <div className="mb-24">
            <h3 className="font-cinzel text-lg md:text-xl font-bold tracking-widest text-center text-white mb-8 flex items-center justify-center gap-2">
              <Sparkle className="w-4 h-4 text-gold fill-gold/25 animate-pulse" />
              <span>Our Love Carousel</span>
              <Sparkle className="w-4 h-4 text-gold fill-gold/25 animate-pulse" />
            </h3>

            <div className="relative max-w-4xl mx-auto group">
              <div className="overflow-hidden rounded-2xl glass-panel-glow border border-gold/30 aspect-[16/9] relative shadow-2xl">
                
                {/* Carousel Track */}
                <div 
                  className="w-full h-full flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {featuredMemories.map((mem, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 relative">
                      <img className="w-full h-full object-cover" src={mem.url} alt={mem.caption} />
                    </div>
                  ))}
                </div>

                {/* Bottom Caption overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-royal-dark/95 via-royal-dark/70 to-transparent flex flex-col justify-end text-left select-none">
                  <span className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-gold stroke-transparent" />
                    {featuredMemories[carouselIndex]?.date}
                  </span>
                  <p className="text-sm md:text-lg text-white font-medium font-playfair italic">
                    "{featuredMemories[carouselIndex]?.caption}"
                  </p>
                </div>
              </div>

              {/* Left/Right Buttons */}
              {featuredMemories.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevCarousel}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-royal-dark/80 hover:bg-gold text-white hover:text-royal-dark flex items-center justify-center border border-gold/20 hover:border-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextCarousel}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-royal-dark/80 hover:bg-gold text-white hover:text-royal-dark flex items-center justify-center border border-gold/20 hover:border-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              {featuredMemories.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {featuredMemories.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === carouselIndex ? 'w-6 bg-gold' : 'w-2 bg-gray-600 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Photo Grid Gallery (Masonry style using Columns) */}
        <div className="mb-10">
          <h3 className="font-cinzel text-lg md:text-xl font-bold tracking-widest text-center text-white mb-10">
            📚 Full Memories Log
          </h3>

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {allMemories.map((mem, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                key={mem.id || index}
                onClick={() => setLightboxIndex(index)}
                className="group relative overflow-hidden rounded-xl glass-panel border border-white/5 cursor-pointer shadow-md break-inside-avoid block"
              >
                <img 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={mem.url} 
                  alt={mem.caption} 
                  loading="lazy"
                />
                
                {/* Floating caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/90 via-royal-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 text-left">
                  <p className="text-xs text-white font-medium font-playfair italic pr-6 leading-relaxed">
                    "{mem.caption}"
                  </p>
                </div>

                {/* Delete button (only show for custom user uploads) */}
                {mem.isUserUploaded && (
                  <button
                    onClick={(e) => handleDeleteMemory(mem.id, e)}
                    className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-md"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && allMemories[lightboxIndex] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-royal-dark/95 backdrop-blur-md z-50 flex flex-col justify-center items-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxIndex(null);
            }}
          >
            {/* Close */}
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-all duration-200 p-2 bg-white/5 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left */}
            {allMemories.length > 1 && (
              <button 
                onClick={handlePrevLightbox}
                className="absolute left-4 md:left-8 text-white/50 hover:text-gold hover:scale-110 transition-all duration-300 p-2 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Right */}
            {allMemories.length > 1 && (
              <button 
                onClick={handleNextLightbox}
                className="absolute right-4 md:right-8 text-white/50 hover:text-gold hover:scale-110 transition-all duration-300 p-2 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Lightbox Content Card */}
            <motion.div 
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center select-none relative"
            >
              <img 
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-gold/20 shadow-2xl" 
                src={allMemories[lightboxIndex].url} 
                alt={allMemories[lightboxIndex].caption} 
              />
              <span className="text-xs text-gold uppercase tracking-widest font-bold mt-5 block">
                {allMemories[lightboxIndex].date}
              </span>
              <p className="text-sm md:text-lg text-gray-200 mt-2 text-center max-w-xl italic font-light font-playfair px-4">
                "{allMemories[lightboxIndex].caption}"
              </p>

              {allMemories[lightboxIndex].isUserUploaded && (
                <button
                  onClick={(e) => handleDeleteMemory(allMemories[lightboxIndex].id, e)}
                  className="mt-4 flex items-center gap-1 px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full font-cinzel text-xs uppercase tracking-widest font-bold transition-colors duration-200 shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Memory
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
