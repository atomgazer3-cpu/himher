import React, { useState, useEffect, useRef } from 'react';
import OpeningPage from './components/OpeningPage.jsx';
import MainWebsite from './components/MainWebsite.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import { CONFIG } from './config.js';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  // Background Particles Engine in React
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let hearts = [];
    let sparkles = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Init stars
    const starCount = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }

    const spawnRisingHeart = () => {
      if (hearts.length < 20) {
        hearts.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          vy: -(Math.random() * 1.2 + 0.5),
          size: Math.random() * 14 + 6,
          alpha: Math.random() * 0.35 + 0.15,
          angle: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          wobbleDist: Math.random() * 1.5 + 0.5
        });
      }
    };

    const drawHeart = (x, y, size, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x, y + size / 4);
      ctx.quadraticCurveTo(x, y, x + size / 4, y);
      ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
      ctx.quadraticCurveTo(x + size / 2, y, x + (size * 3) / 4, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
      ctx.quadraticCurveTo(x + size, y + size / 2, x + (size * 3) / 4, y + (size * 3) / 4);
      ctx.lineTo(x + size / 2, y + size);
      ctx.lineTo(x + size / 4, y + (size * 3) / 4);
      ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x, y, size, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.3, y - size * 0.3);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.3, y + size * 0.3);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.3, y + size * 0.3);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size * 0.3, y - size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const handleMouseMove = (e) => {
      if (Math.random() < 0.25) {
        sparkles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 5 + 3,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(251, 191, 36, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.8 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
      });

      // Rising Hearts
      if (Math.random() < 0.05) spawnRisingHeart();
      hearts.forEach((heart, idx) => {
        heart.y += heart.vy;
        heart.angle += heart.wobbleSpeed;
        const drawX = heart.x + Math.sin(heart.angle) * heart.wobbleDist;
        drawHeart(drawX, heart.y, heart.size, heart.alpha);

        if (heart.y < -30) {
          hearts.splice(idx, 1);
        }
      });

      // Sparkles
      sparkles.forEach((sp, idx) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;
        drawSparkle(sp.x, sp.y, sp.size, sp.alpha);

        if (sp.alpha <= 0) {
          sparkles.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Audio Playback Manager
  useEffect(() => {
    audioRef.current = new Audio(CONFIG.music.url);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Music playback failed", err);
      });
    }
  };

  const handleUnlock = () => {
    setUnlocked(true);
    // Start music on unlock click (ensures autoplay approval)
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio autoplay blocked by browser policy.", err);
      });
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200 antialiased overflow-hidden select-none">
      {/* Dynamic Star & Heart Background Layer */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* View Coordinator */}
      {!unlocked ? (
        <OpeningPage onUnlock={handleUnlock} />
      ) : (
        <MainWebsite />
      )}

      {/* Floating Music Player Dashboard */}
      {unlocked && (
        <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
      )}
    </div>
  );
}
