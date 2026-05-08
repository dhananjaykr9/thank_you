import { motion, useScroll, useTransform } from 'framer-motion';
import img1 from '../data/IMG-20250129-WA0018.jpg';
import img2 from '../data/IMG-20250129-WA0023.jpg';
import img3 from '../data/Picsart_25-02-21_20-10-06-798.jpg';
import img4 from '../data/Picsart_25-02-21_20-12-41-229.jpg';

const IMAGES = [img1, img2, img3, img4];

export default function FloatingPolaroid({ index, isLeft }) {
  const { scrollYProgress } = useScroll();
  
  // Unique parallax for each based on index
  const yParallax = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, (index + 1) * -150]
  );

  const image = IMAGES[index % IMAGES.length];
  
  return (
    <motion.div
      className={`absolute w-32 md:w-48 p-2 bg-white shadow-2xl z-0 pointer-events-auto border border-slate-100 hidden sm:block
        ${isLeft ? '-left-24 md:-left-48' : '-right-24 md:-right-48'}
      `}
      style={{
        y: yParallax,
        rotate: isLeft ? -12 : 12,
        top: '20%'
      }}
      whileHover={{
        scale: 1.1,
        rotate: 0,
        zIndex: 50,
        boxShadow: '0 30px 60px rgba(0,0,0,0.25)'
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <div className="aspect-[4/5] overflow-hidden bg-slate-100 mb-2">
        <img
          src={image}
          alt="Memory"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <div className="h-4 w-2/3 bg-slate-100/50 rounded-sm" />
    </motion.div>
  );
}
