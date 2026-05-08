import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import pfp from '../assets/pfp.png';

const PARTY_EMOJIS = ['🎉', '🎂', '🥳', '🎈', '✨', '🎁', '💫', '🪩', '🎊', '💖', '🍰', '🕺'];

const DancingEmoji = ({ emoji, index }) => {
  const x = 10 + (index * 37) % 80;
  const y = 10 + (index * 53) % 70;
  const size = 20 + (index % 3) * 10;
  const delay = index * 0.15;

  return (
    <motion.span
      className="absolute select-none pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}px` }}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ 
        opacity: [0, 0.8, 0.5, 0.8],
        scale: [0, 1.2, 0.9, 1],
        rotate: [-180, 10, -10, 0],
        y: [0, -15, 5, -10, 0],
      }}
      transition={{ 
        delay,
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {emoji}
    </motion.span>
  );
};

const PulseRing = ({ delay, size }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 rounded-full border-2 border-purple-400/20"
    style={{ width: size, height: size }}
    initial={{ x: "-50%", y: "-50%", scale: 0.8, opacity: 0 }}
    animate={{ x: "-50%", y: "-50%", scale: 1.5, opacity: [0, 0.5, 0] }}
    transition={{ 
      delay, 
      duration: 3, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  />
);

export default function LoadingScreen({ onComplete }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 100, damping: 10 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 100, damping: 10 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden cursor-pointer perspective-1000 bg-slate-50 pt-16 pb-20`}
      onClick={onComplete}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Orbs - Matching main screen palette */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--theme-primary), transparent)', left: '10%', top: '10%' }}
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, var(--theme-secondary), transparent)', right: '10%', bottom: '10%' }}
        animate={{ x: [0, -50, 30, 0], y: [0, 30, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Elements Background */}
      {PARTY_EMOJIS.map((emoji, i) => (
        <DancingEmoji key={i} emoji={emoji} index={i} />
      ))}

      {/* Center Content */}
      <div className="relative z-10 text-center flex flex-col items-center max-w-4xl px-6">
        
        <div className="relative flex items-center justify-center mb-16">
          <PulseRing delay={0} size={window?.innerWidth > 768 ? 420 : 300} />
          <PulseRing delay={1} size={window?.innerWidth > 768 ? 500 : 340} />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="relative z-20 w-44 h-44 md:w-72 md:h-72 rounded-[3rem] border-[6px] border-white p-2 bg-white/40 backdrop-blur-xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] overflow-hidden rotate-3"
          >
            <img 
              src={pfp} 
              alt="Thank You" 
              className="w-full h-full object-cover rounded-[2.5rem]"
              style={{ transform: "translateZ(50px) scale(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/10 to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="space-y-6 max-w-3xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
             <span className="inline-flex items-center py-1.5 pr-4 pl-3 rounded-full bg-white/80 text-[var(--theme-primary)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-sm border border-slate-100">
              <span className="bg-[var(--theme-primary)] text-white rounded-full px-2 py-0.5 mr-2 shadow-sm">22nd</span> 
              Birthday Note • २०२४
            </span>

            <h1 className="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
              A Personal <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)]">आभार.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-500 font-medium tracking-wide max-w-lg mx-auto leading-relaxed">
              Birthday wishes बद्दल खूप खूप धन्यवाद. <br className="hidden md:block" />
              I've created this special experience just for you.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-10"
          >
            <button 
              onClick={() => {
                new Audio("https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3").play().catch(() => {});
                onComplete();
              }}
              className="group relative inline-flex items-center gap-3 text-sm font-black text-white uppercase tracking-[0.2em] px-12 py-5 rounded-2xl bg-slate-900 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:bg-[var(--theme-primary)] hover:-translate-y-1 active:translate-y-0 transition-all overflow-hidden"
            >
              <span className="relative z-10">Start Experience</span>
              <motion.span 
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ✨
              </motion.span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

