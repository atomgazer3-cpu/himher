import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { CONFIG } from '../config.js';

export default function MusicPlayer({ isPlaying, onToggle }) {
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Sync volume with global audio object
  useEffect(() => {
    const audios = document.getElementsByTagName('audio');
    if (audios.length > 0) {
      audios[0].volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 glass-panel p-3 flex items-center gap-3 max-w-xs md:max-w-sm border border-gold/20 hover:border-gold/40 shadow-xl select-none transition-all duration-300">
      {/* Play/Pause Button */}
      <button 
        onClick={onToggle}
        className="w-10 h-10 rounded-full bg-gold hover:bg-gold-light text-royal-dark flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-royal-dark stroke-royal-dark" />
        ) : (
          <Play className="w-5 h-5 fill-royal-dark stroke-royal-dark pl-0.5" />
        )}
      </button>

      {/* Music metadata */}
      <div className="flex flex-col text-left">
        <span className="font-semibold text-xs text-white truncate max-w-[100px] md:max-w-[130px]">
          {CONFIG.music.title}
        </span>
        <span className="text-[9px] text-gray-400 truncate max-w-[100px] md:max-w-[130px]">
          {CONFIG.music.artist}
        </span>
      </div>

      {/* Mute/Volume controls */}
      <div className="flex items-center gap-2 border-l border-white/10 pl-3">
        <button 
          onClick={handleMuteToggle}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 md:w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gold"
        />
      </div>

      {/* Visualizer bars */}
      <div className="flex gap-0.5 items-end h-6 w-8 pb-1">
        {[
          'animate-[barBounce_1s_infinite_0.1s]',
          'animate-[barBounce_1.2s_infinite_0.3s]',
          'animate-[barBounce_0.8s_infinite_0.5s]',
          'animate-[barBounce_1.1s_infinite_0.2s]'
        ].map((anim, idx) => (
          <div 
            key={idx}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            className={`w-1 bg-gold rounded-full h-1 ${isPlaying ? anim : 'h-1'}`}
          />
        ))}
      </div>

      {/* CSS injection for visualizer animation */}
      <style>{`
        @keyframes barBounce {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
      `}</style>
    </div>
  );
}
