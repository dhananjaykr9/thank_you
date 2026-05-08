import { motion, useScroll, useTransform } from 'framer-motion';
import img1 from '../data/IMG-20250129-WA0018.jpg';
import img2 from '../data/IMG-20250129-WA0023.jpg';
import img3 from '../data/Picsart_25-02-21_20-10-06-798.jpg';
import img4 from '../data/Picsart_25-02-21_20-12-41-229.jpg';

const IMAGES = [img1, img2, img3, img4, img1, img2, img3, img4]; // Duplicated for a longer reel

export default function JourneySlide() {
  const { scrollYProgress } = useScroll();
  
  // Transform vertical scroll to horizontal slide
  // Moves from right to left
  const xTranslate = useTransform(scrollYProgress, [0, 1], ['25%', '-50%']);

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 h-40 pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50/95 via-slate-50/40 to-transparent pointer-events-none" />
      
      <motion.div 
        style={{ x: xTranslate }}
        className="flex items-center gap-6 px-12 h-full pointer-events-auto"
      >
        {IMAGES.map((img, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-32 md:w-44 aspect-[4/5] bg-white p-1.5 shadow-xl border border-slate-100 rounded-sm relative"
            style={{
              rotate: (i % 2 === 0 ? 3 : -3) + (Math.random() * 2 - 1)
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 0, 
              zIndex: 50,
              y: -10 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-full h-full overflow-hidden bg-slate-50 rounded-xs">
              <img 
                src={img} 
                alt={`Journey ${i}`} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* The Polaroid "Footer" space */}
            <div className="h-4 mt-1 flex items-center px-1">
               <div className="h-1 w-1/2 bg-slate-100 rounded-full" />
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Edge Blurs for Cinema feel */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
    </div>
  );
}
