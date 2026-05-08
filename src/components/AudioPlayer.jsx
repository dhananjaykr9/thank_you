import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function AudioPlayer({ src, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const hasAutoPlayed = useRef(false);

  // Auto-play on mount when autoPlay is true
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current && audioRef.current) {
      hasAutoPlayed.current = true;
      // Small delay to ensure audio element is ready
      const timer = setTimeout(async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Autoplay blocked by browser, user can click to play");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback failed:", err);
      setIsPlaying(false);
    }
  };

  // Track progress
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
          setProgress(audio.currentTime / audio.duration);
        }
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Generate deterministic bar data ONCE (stable across renders)
  const bars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const h = 0.25 + (seed - Math.floor(seed)) * 0.75;
      const bounceScale = 0.5 + (Math.sin(i * 2.1 + 3.7) * 0.5 + 0.5) * 0.8;
      const dur = 0.3 + (Math.sin(i * 1.3 + 0.7) * 0.5 + 0.5) * 0.4;
      return { h, bounceScale, dur };
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="glass-card flex items-center gap-5 py-4 px-6 w-full relative z-[60] cursor-pointer select-none shadow-xl border border-white/60 bg-white/60 backdrop-blur-xl rounded-[2rem]"
      onClick={togglePlay}
    >
      <button
        type="button"
        className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform text-white shadow-lg"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying 
          ? <Pause size={18} fill="currentColor" /> 
          : <Play size={18} fill="currentColor" className="ml-0.5" />
        }
      </button>

      <div className="flex flex-col flex-1 overflow-hidden gap-1.5">
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-[var(--theme-primary)] flex-shrink-0" />
          <span className="text-sm font-bold text-slate-800 truncate">
            {isPlaying ? 'Now playing...' : 'Play my wish'}
          </span>
        </div>

        {/* Waveform Visualizer */}
        <div className="flex items-end gap-[2px] h-6 w-full mt-0.5">
          {bars.map((bar, i) => {
            const barPos = i / bars.length;
            const isActive = barPos <= progress;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-full origin-bottom"
                style={{
                  height: `${bar.h * 100}%`,
                  backgroundColor: isActive 
                    ? 'var(--theme-primary)' 
                    : 'rgba(0,0,0,0.08)',
                }}
                animate={isPlaying ? {
                  scaleY: [1, bar.bounceScale, 1],
                } : { scaleY: 1 }}
                transition={isPlaying ? {
                  duration: bar.dur,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.015,
                } : { duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={() => { setIsPlaying(false); setProgress(0); }}
      />
    </motion.div>
  );
}
