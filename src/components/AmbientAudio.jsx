import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientAudio({ src }) {
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser policies
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Low ambient volume
      if (!isMuted) {
        audioRef.current.play().catch(e => console.log("Audio playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-6 right-6 z-[200] w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-800 shadow-xl hover:scale-110 active:scale-95 transition-all"
        aria-label="Toggle ambient sound"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </>
  );
}
