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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden cursor-pointer perspective-1000 bg-[#fafafa] pt-16 pb-20`}
      onClick={onComplete}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]" />

      {/* Enhanced Background Orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15] blur-[140px]"
        style={{ background: 'radial-gradient(circle, var(--theme-primary), transparent)', left: '-10%', top: '-10%' }}
        animate={{ 
          x: [0, 100, -50, 0], 
          y: [0, -50, 100, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--theme-secondary), transparent)', right: '-10%', bottom: '-10%' }}
        animate={{ 
          x: [0, -100, 50, 0], 
          y: [0, 50, -100, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Particles / Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTY_EMOJIS.map((emoji, i) => (
          <DancingEmoji key={i} emoji={emoji} index={i} />
        ))}
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center flex flex-col items-center max-w-5xl px-6">
        
        <div className="relative flex items-center justify-center mb-20 scale-90 md:scale-100 transition-transform">
          <PulseRing delay={0} size={window?.innerWidth > 768 ? 420 : 300} />
          <PulseRing delay={0.5} size={window?.innerWidth > 768 ? 500 : 340} />
          <PulseRing delay={1} size={window?.innerWidth > 768 ? 580 : 380} />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="relative z-20 w-48 h-48 md:w-80 md:h-80 rounded-[4rem] border-[8px] border-white p-2 bg-white/40 backdrop-blur-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden rotate-2"
          >
            <img 
              src={pfp} 
              alt="Thank You" 
              className="w-full h-full object-cover rounded-[3.5rem]"
              style={{ transform: "translateZ(60px) scale(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-primary)]/20 via-transparent to-white/10 pointer-events-none" />
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="space-y-8 max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
             <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center py-2 pr-5 pl-4 rounded-full bg-white shadow-lg shadow-purple-500/5 text-[var(--theme-primary)] text-[11px] md:text-sm font-bold tracking-[0.25em] uppercase mb-10 border border-slate-100"
            >
              <span className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white rounded-full px-3 py-1 mr-3 shadow-md text-[10px]">22nd</span> 
              Birthday Note • २०२४
            </motion.span>

            <h1 className="text-5xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8">
              A Personal <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--theme-primary)] via-[var(--theme-secondary)] to-purple-600 animate-gradient-x">आभार.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 font-medium tracking-normal max-w-2xl mx-auto leading-relaxed opacity-90">
              Birthday wishes बद्दल खूप खूप धन्यवाद. <br className="hidden md:block" />
              Your love made my day complete. I've built this interactive <br className="hidden md:block" /> 3D world just to say thanks.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-12"
          >
            <button 
              onClick={() => {
                new Audio("https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3").play().catch(() => {});
                onComplete();
              }}
              className="group relative inline-flex items-center gap-4 text-sm md:text-base font-black text-white uppercase tracking-[0.25em] px-14 py-6 rounded-[2rem] bg-slate-900 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] hover:bg-[var(--theme-primary)] hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-20px_rgba(168,85,247,0.4)] active:translate-y-0 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">Experience the Magic</span>
              <motion.span 
                className="relative z-10 text-xl"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ✨
              </motion.span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            </button>
            
            <p className="mt-8 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
              Scroll to explore • Tap to begin
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

