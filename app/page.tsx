"use client";

import React, { useState, useEffect, useCallback } from "react";
import Snowfall from "react-snowfall";
import { motion, AnimatePresence } from "framer-motion";
import { Music, SkipForward, SkipBack, Play, X, ChevronLeft, ChevronRight } from "lucide-react";

// --- CONFIGURATION ---
// 1. Go to your Spotify Playlist
// 2. Click "Share" -> "Copy Link to Playlist"
// 3. The link looks like: https://open.spotify.com/playlist/37i9dQZF1DX0Yxoavh5qJV?si=...
// 4. Copy JUST the ID part (e.g., 37i9dQZF1DX0Yxoavh5qJV) and paste it below:
const SPOTIFY_PLAYLIST_ID = "1yoloAg5DbRkWQQ1s3KiPw";

export default function TyrellWinterFestival() {
  const [mounted, setMounted] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);

  // Prevent hydration mismatch for snowfall/animations
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-slate-900 min-h-screen"></div>;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* 1. Snowfall Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Snowfall
          snowflakeCount={150}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      </div>

      {/* 2. Background Atmosphere (Glowing Orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* 3. Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center h-[85vh] w-full text-center p-4">
        {/* Christmas Lights Decoration */}
        <ChristmasLights />

        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="z-30 relative"
        >
          <h1
            className="text-7xl md:text-9xl font-black tracking-tighter text-white font-serif mb-4"
            style={{
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.6),
                0 0 40px rgba(255, 255, 255, 0.4),
                0 0 60px rgba(200, 220, 255, 0.3),
                0 0 80px rgba(200, 220, 255, 0.2)
              `,
            }}
          >
            Tyrrell
          </h1>
          <h2
            className="text-5xl md:text-7xl font-bold tracking-widest text-white uppercase"
            style={{
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.5),
                0 0 40px rgba(255, 255, 255, 0.3),
                0 0 60px rgba(200, 220, 255, 0.2)
              `,
            }}
          >
            Winter Festival
          </h2>
        </motion.div>

        {/* Floating Decor Items */}
        <FloatingDecorations />
      </main>

      {/* 4. Slideshow Button */}
      <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-40">
        <motion.button
          onClick={() => setShowSlideshow(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5" />
          Slideshow
        </motion.button>
      </div>

      {/* 5. Fullscreen Slideshow */}
      <AnimatePresence>
        {showSlideshow && (
          <Slideshow onClose={() => setShowSlideshow(false)} />
        )}
      </AnimatePresence>

      {/* 6. Fixed Bottom Player */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-black/60 backdrop-blur-xl border-t border-white/10 p-2 shadow-2xl">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4 pl-4">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-red-500 animate-[bounce_1s_infinite]"></span>
              <span className="w-1 h-6 bg-green-500 animate-[bounce_1.2s_infinite]"></span>
              <span className="w-1 h-3 bg-blue-500 animate-[bounce_0.8s_infinite]"></span>
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Now Streaming
            </p>
          </div>

          <div className="w-full md:w-[600px] h-[80px] rounded-md overflow-hidden shadow-lg border border-white/5">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="bg-[#191414]"
            ></iframe>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Fullscreen Slideshow Component ---
function Slideshow({ onClose }: { onClose: () => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  // Fetch images from the slideshow folder and preload them
  useEffect(() => {
    fetch("/api/slideshow")
      .then((res) => res.json())
      .then((data) => {
        const imageList = data.images || [];
        setImages(imageList);

        if (imageList.length === 0) {
          setLoading(false);
          return;
        }

        // Preload all images
        let loadedCount = 0;
        const loaded = new Set<number>();

        imageList.forEach((src: string, idx: number) => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            loaded.add(idx);
            setImagesLoaded(new Set(loaded));
            // Start showing once first image is loaded
            if (loadedCount === 1) {
              setLoading(false);
            }
          };
          img.onerror = () => {
            loadedCount++;
            if (loadedCount === 1) {
              setLoading(false);
            }
          };
          img.src = src;
        });
      })
      .catch(() => setLoading(false));
  }, []);

  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance slides every 10 seconds (doubled from 5)
  useEffect(() => {
    if (isPaused || images.length === 0) return;
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, nextSlide, prevSlide]);

  // Show loading or empty state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      >
        <div className="text-white text-xl">Loading...</div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-8 h-8 text-white" />
        </button>
      </motion.div>
    );
  }

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      >
        <div className="text-center text-white">
          <p className="text-2xl mb-4">No images found</p>
          <p className="text-gray-400">
            Add images to <code className="bg-white/10 px-2 py-1 rounded">public/slideshow/</code>
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-8 h-8 text-white" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onClick={() => setIsPaused((p) => !p)}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-[110] p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <X className="w-8 h-8 text-white" />
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-4 z-[110] p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-4 z-[110] p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Preload next and previous images for seamless transitions */}
      <div className="hidden">
        {images.map((src, idx) => (
          <img key={idx} src={src} alt="" />
        ))}
      </div>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="max-h-full max-w-full object-contain"
        />
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-[110]">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          Paused - Click to resume
        </div>
      )}
    </motion.div>
  );
}

// --- Christmas Lights Component ---
function ChristmasLights() {
  const colors = [
    { bulb: "#ff4444", glow: "rgba(255, 68, 68, 0.8)" },   // Red
    { bulb: "#44ff44", glow: "rgba(68, 255, 68, 0.8)" },   // Green
    { bulb: "#4488ff", glow: "rgba(68, 136, 255, 0.8)" },  // Blue
    { bulb: "#ffaa00", glow: "rgba(255, 170, 0, 0.8)" },   // Orange/Yellow
    { bulb: "#ff44ff", glow: "rgba(255, 68, 255, 0.8)" },  // Pink
  ];

  // Create a string of lights that drapes across
  const lights = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: i * 0.15,
  }));

  return (
    <div className="absolute top-4 left-0 right-0 z-20 pointer-events-none overflow-hidden">
      {/* Wire/String */}
      <svg
        className="w-full h-32 md:h-40"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
      >
        {/* The drooping wire */}
        <path
          d="M -20 20 Q 250 80, 500 60 Q 750 40, 1020 70"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Light bulbs along the wire */}
        {lights.map((light, i) => {
          // Calculate position along the curve
          const t = i / (lights.length - 1);
          const x = t * 1000;
          // Approximate y position on the curve
          const y = 20 + Math.sin(t * Math.PI) * 40 + (t > 0.5 ? (t - 0.5) * 40 : -t * 20);

          return (
            <g key={light.id}>
              {/* Wire to bulb */}
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={y + 15}
                stroke="#333"
                strokeWidth="1"
              />
              {/* Bulb glow */}
              <motion.circle
                cx={x}
                cy={y + 25}
                r="12"
                fill={light.color.glow}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  r: [10, 14, 10],
                }}
                transition={{
                  duration: 1.5,
                  delay: light.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ filter: `blur(4px)` }}
              />
              {/* Bulb */}
              <motion.ellipse
                cx={x}
                cy={y + 25}
                rx="6"
                ry="8"
                fill={light.color.bulb}
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  delay: light.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  filter: `drop-shadow(0 0 6px ${light.color.glow})`,
                }}
              />
              {/* Bulb cap */}
              <rect
                x={x - 3}
                y={y + 12}
                width="6"
                height="5"
                fill="#666"
                rx="1"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Helper Component for Scattered Items ---
function FloatingDecorations() {
  // Items scattered around the screen
  const items = [
    { emoji: "🎅", top: "10%", left: "5%", size: "text-8xl", duration: 6 },
    { emoji: "🎄", top: "20%", right: "10%", size: "text-9xl", duration: 7 },
    { emoji: "⛄", bottom: "30%", left: "15%", size: "text-8xl", duration: 8 },
    { emoji: "🎁", bottom: "40%", right: "20%", size: "text-7xl", duration: 5 },
    { emoji: "❄️", top: "15%", left: "40%", size: "text-5xl", duration: 9 },
    { emoji: "🦌", top: "5%", right: "35%", size: "text-7xl", duration: 6.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.size} drop-shadow-2xl opacity-90`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
