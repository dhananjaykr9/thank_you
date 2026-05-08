import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { getGreetingTime, messages } from '../data/content';
import AudioPlayer from '../components/AudioPlayer';
import WishTree from '../components/WishTree';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import LoadingScreen from '../components/LoadingScreen';
import useMagnetic from '../hooks/useMagnetic';
import JourneySlide from '../components/JourneySlide';
import voiceClip from '../data/voice.mp3';
import TypewriterText from '../components/TypewriterText';
import AmbientAudio from '../components/AmbientAudio';
import { Coffee, Sparkles, Code, Heart } from 'lucide-react';

const HandwrittenSignature = () => {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div 
      ref={ref}
      className="mt-8 mb-4 cursor-pointer relative z-50 p-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <svg width="200" height="80" viewBox="0 0 200 80" fill="none" className="mx-auto overflow-visible pointer-events-none">
        <motion.path
          d="M 20 40 Q 40 10 60 40 T 100 40 Q 120 70 140 40 T 180 40"
          stroke="var(--theme-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.text
          x="100" y="70"
          textAnchor="middle"
          fill="var(--theme-primary)"
          className="font-handwriting text-2xl opacity-60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Dhananjay
        </motion.text>
      </svg>
    </motion.div>
  );
};

const HandwrittenLetter = ({ text, sub }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 10 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 10 });

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

  const playRustle = () => {
    const rustle = new Audio("https://cdn.freesound.org/previews/240/240776_4107740-lq.mp3");
    rustle.volume = 0.2;
    rustle.play().catch(() => {});
  };
  
  return (
    <div className="w-full max-w-lg mx-auto my-24 perspective-2000 z-20 relative">
      <motion.div 
        ref={ref}
        initial={{ rotateX: 90, opacity: 0, scale: 0.7 }}
        animate={isInView ? { rotateX: 0, opacity: 1, scale: 1 } : {}}
        transition={{ 
          duration: 2, 
          type: "spring", 
          stiffness: 40, 
          damping: 15, 
          mass: 1.5 
        }}
        onMouseEnter={playRustle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="letter-paper p-8 md:p-12 min-h-[400px] flex flex-col justify-between origin-bottom shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative transition-shadow hover:shadow-[0_60px_120px_rgba(0,0,0,0.2)]"
        style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
      >
        {/* Paper crease effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-sm" />
        
        <div className="space-y-6 relative" style={{ transform: "translateZ(40px)" }}>
          <TypewriterText 
            text={text}
            speed={0.03}
            delay={1}
            className="font-handwriting text-2xl md:text-3xl text-slate-800 leading-relaxed drop-shadow-sm"
          />
          <TypewriterText 
            text={sub}
            speed={0.05}
            delay={3}
            className="font-handwriting text-xl md:text-2xl text-[var(--theme-primary)] italic mt-4 block"
          />
        </div>
        
        <motion.p 
          className="font-handwriting text-lg text-slate-400 mt-12 text-right"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 4 }}
          style={{ transform: "translateZ(20px)" }}
        >
          — Dhananjay
        </motion.p>

        {/* 3D shadows */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-slate-900/10 blur-xl rounded-full" />
      </motion.div>
    </div>
  );
};

import { useMotionValue, useTransform } from 'framer-motion';

const TimelineNode = ({ title, text, isLeft, delay = 0 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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
    <div className={`relative w-full flex justify-end md:justify-between py-4 perspective-1000`}>
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
        className="absolute left-6 md:left-1/2 top-10 w-5 h-5 rounded-full bg-[var(--theme-primary)] shadow-[0_0_15px_var(--theme-primary)] transform -translate-x-1/2 z-10 border-4 border-slate-50" 
      />
      <div className={`hidden md:block w-5/12 ${isLeft ? '' : 'order-first'}`} />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 15 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay, type: 'spring', bounce: 0.2 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full md:w-5/12 pl-12 md:pl-0 z-20 ${isLeft ? 'md:pr-10 md:text-right text-left' : 'md:pl-10 text-left'}`}
      >
        <div className="glass-card p-6 md:p-8 hover:shadow-2xl transition-shadow border-[var(--theme-line)]" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl md:text-2xl font-black mb-3 text-[var(--theme-primary)]">{title}</h3>
          <TypewriterText text={text} speed={0.02} delay={delay + 0.3} className="text-sm md:text-base text-slate-800 font-medium leading-relaxed" />
        </div>
      </motion.div>
    </div>
  );
};

const LifeStats = ({ path }) => {
  const getEnergyStat = () => {
    if (path === 'friends') {
      return { value: "30+ Papers", sub: "Thesis & Research" };
    }
    if (path === 'family') {
      return { value: "Unlimited", sub: "आंब्याचा रस ✨" };
    }
    if (path === 'relatives') {
      return { value: "1000+ आठवणी", sub: "आणि तुमचे आशीर्वाद" };
    }
    if (path === 'special') {
      return { value: "1000+ Memories", sub: "And many more to come" };
    }
    return { value: "1000+ Cups", sub: "Chai is Life" };
  };

  const energy = getEnergyStat();

  const stats = [
    { icon: <Sparkles className="text-purple-500" />, label: "Age", value: "22 Years", sub: "Est. 2004" },
    { icon: <Coffee className="text-amber-600" />, label: "Energy", value: energy.value, sub: energy.sub },
    { icon: <Code className="text-blue-500" />, label: "Passion", value: "50+ Projects", sub: "Always Building" },
    { icon: <Heart className="text-red-500" />, label: "Love", value: "Infinite", sub: "For the Fam" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32 px-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card p-6 flex flex-col items-center text-center group"
        >
          <div className="mb-4 p-3 rounded-2xl bg-white/50 group-hover:bg-white transition-colors shadow-sm">
            {stat.icon}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
          <h4 className="text-xl font-black text-slate-800 mb-1">{stat.value}</h4>
          <p className="text-[10px] font-medium text-[var(--theme-primary)] opacity-70 uppercase tracking-tight">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
};


export default function ExperienceController() {
  const location = useLocation();

  const screenRef = useRef(null);
  
  const [nameInput, setNameInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [madeWish, setMadeWish] = useState(false);
  const [showToast, setShowToast] = useState(null); // { message, type }
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastSignature, setLastSignature] = useState(null); // { name, message, date }
  
  // Scroll to top when experience starts
  useEffect(() => {
    if (madeWish) {
      window.scrollTo(0, 0);
    }
  }, [madeWish]);

  // Bulletproof Category Detection (Scans entire URL)
  const getCategory = () => {
    const url = window.location.href.toLowerCase();
    
    // Priority order for detection
    if (url.includes('/friends') || url.includes('friends.')) return 'friends';
    if (url.includes('/family') || url.includes('family.')) return 'family';
    if (url.includes('/special') || url.includes('special.')) return 'special';
    if (url.includes('/relatives') || url.includes('relatives.')) return 'relatives';

    return 'default';
  };

  const path = getCategory();
  const categoryParams = messages[path] || messages['default'];
  
  const greeting = getGreetingTime();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const themeClass = `theme-${path}`;

  const handleJoinTree = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSubmitting(true);
    
    if (!supabase) {
      setShowToast({ message: "Supabase not configured!", type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('wishers').insert([{ 
        name: nameInput.trim(),
        message: messageInput.trim() || null
      }]);
      
      if (error) throw error;
      
      const currentSignature = { name: nameInput.trim(), message: messageInput.trim(), date: new Date().toLocaleDateString() };
      
      setMessageInput(''); 
      setNameInput('');
      setLastSignature(currentSignature);
      setShowToast({ message: "Moment saved to the tree! ✨", type: 'success' });
      setRefreshKey(prev => prev + 1); // Trigger tree refresh
      
      // Massive custom confetti blast
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const colors = ['#a855f7', '#ec4899', '#3b82f6'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      
      // Auto hide toast
      setTimeout(() => setShowToast(null), 3500);
      
    } catch (err) {
      console.error("Failed to add to wish tree:", err);
      setShowToast({ message: err.message || 'Verification failed.', type: 'error' });
      setTimeout(() => setShowToast(null), 4000);
    }
    
    setIsSubmitting(false);
  };


  const downloadSouvenir = async () => {
    const node = document.getElementById('souvenir-card');
    if (node) {
      try {
        const dataUrl = await toPng(node, { 
          cacheBust: true, 
          style: { opacity: 1, visibility: 'visible', position: 'static' } 
        });
        download(dataUrl, `birthday-souvenir-${lastSignature?.name}.png`);
      } catch (err) {
        console.error("Souvenir capture failed", err);
      }
    }
  };

  return (
    <>
    <AnimatePresence>
      {!madeWish && <LoadingScreen onComplete={() => setMadeWish(true)} />}
    </AnimatePresence>

    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm"
        >
          <div className={`glass-card p-4 flex items-center gap-3 shadow-2xl border-2 ${showToast.type === 'success' ? 'border-green-100' : 'border-red-100'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${showToast.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              {showToast.type === 'success' ? '✨' : '⚠️'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {showToast.message}
              </p>
              {showToast.type === 'success' && lastSignature && (
                <button 
                  onClick={downloadSouvenir}
                  className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-primary)] hover:underline flex items-center gap-1"
                >
                  Download Souvenir <span>↓</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Hidden Souvenir Template - Using specialized capture container */}
    <div 
      className="fixed opacity-0 pointer-events-none" 
      style={{ left: '-1000vw', top: 0, zIndex: -100 }}
    >
      <div 
        id="souvenir-card" 
        className="w-[400px] p-10 bg-white flex flex-col items-center text-center border-[20px] border-slate-50 shadow-2xl"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <div className="w-full aspect-square bg-slate-50 flex items-center justify-center p-8 border border-slate-100 rounded-lg mb-8 shadow-inner">
          <div className="text-center">
            <h4 className="font-handwriting text-4xl text-slate-800 mb-3">{lastSignature?.name}</h4>
            <p className="font-handwriting text-2xl text-slate-400 max-w-[280px] leading-relaxed italic">
              "{lastSignature?.message || 'Signed the ledger'}"
            </p>
          </div>
        </div>
        <div className="w-full text-left">
          <div className="h-px w-12 bg-[var(--theme-primary)] mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--theme-primary)] mb-2">
            Birthday Keepsake
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1 text-[var(--theme-primary)]">Dhananjay's Birthday</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lastSignature?.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: madeWish ? 1 : 0 }}
      className={`relative w-full bg-[#fafafa] text-slate-800 font-sans overflow-x-hidden pb-64 selection:bg-[var(--theme-bg-soft)] z-10 ${themeClass}`} 
      ref={screenRef}
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px]" />
      </div>

      {/* Sticky Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--theme-primary)] via-[var(--theme-secondary)] to-purple-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="max-w-5xl mx-auto px-4 py-24 relative">
        {/* Intro Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-48 md:mb-64 px-4 pt-12 md:pt-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center py-2 pr-6 pl-5 rounded-full bg-white shadow-xl shadow-purple-500/5 text-[var(--theme-primary)] text-[11px] md:text-sm font-bold tracking-[0.25em] uppercase mb-12 border border-slate-100"
            >
              <span className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white rounded-full px-3 py-1 mr-4 shadow-md text-[10px]">
                {categoryParams.badge}
              </span> 
              Note • Est. 2004
            </motion.span>

            <TypewriterText 
              text="Dhananjay's Thank You Note."
              speed={0.03}
              delay={0.5}
              animateImmediately={true}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 mb-12 leading-[0.85] md:leading-[0.85] drop-shadow-sm relative z-10 break-words"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-6 w-full max-w-sm justify-center">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--theme-line)] to-transparent" />
                <span className="text-xs md:text-sm font-bold tracking-[0.4em] text-[var(--theme-primary)] uppercase opacity-80">
                  Chapter 22
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[var(--theme-line)] to-transparent" />
              </div>
              <p className="text-2xl md:text-4xl text-slate-500 font-medium italic opacity-60 font-handwriting">
                (हे थोडं जास्त personal आहे...)
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 3D Wish Tree & Ledger Section */}
        <div className="mb-48 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent -z-10 blur-3xl rounded-full" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-12 relative z-20 px-4"
          >
            {/* Form Side */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center">
              <form onSubmit={handleJoinTree} className="w-full text-left bg-white/70 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white group transition-all duration-500 hover:shadow-[0_60px_120px_-25px_rgba(168,85,247,0.15)]">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Guest Ledger</h3>
                <p className="text-sm text-slate-400 mb-10 font-bold uppercase tracking-wider">(तुझं नाव इथे लिहून आठवण साठवून ठेव)</p>
                
                <div className="flex flex-col w-full gap-6 relative">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-3">Your Name</label>
                    <input 
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your name..." 
                      required
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[1.5rem] py-5 px-6 focus:outline-none focus:border-[var(--theme-primary)] focus:bg-white text-slate-900 placeholder:text-slate-300 shadow-sm transition-all font-bold text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-3">Short Wish (Optional)</label>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Leave a message..."
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[1.5rem] py-5 px-6 focus:outline-none focus:border-[var(--theme-primary)] focus:bg-white text-slate-900 placeholder:text-slate-300 shadow-sm resize-none h-40 transition-all font-handwriting text-2xl"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white py-5 px-8 rounded-[1.5rem] text-lg font-black shadow-2xl hover:bg-[var(--theme-primary)] hover:-translate-y-2 active:translate-y-0 transition-all duration-300 disabled:opacity-50 mt-6 overflow-hidden relative group"
                  >
                    <span className="relative z-10">{isSubmitting ? 'Signing...' : 'Sign & Hang on Tree'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </form>
            </div>

            {/* Tree Side */}
            <div className="w-full lg:w-[65%] h-[500px] md:h-[600px] lg:h-[800px] relative">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white shadow-2xl overflow-hidden">
                <WishTree refreshTrigger={refreshKey} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fun Facts Section */}
        <LifeStats path={path} />

        {/* The Timeline Foundation */}
        <div className="relative w-full pb-48">
          <div className="absolute left-6 md:left-1/2 top-4 bottom-0 w-1.5 bg-slate-100 transform -translate-x-1/2 rounded-full" />
          <motion.div 
            className="absolute left-6 md:left-1/2 top-4 bottom-0 w-1.5 bg-gradient-to-b from-[var(--theme-primary)] via-[var(--theme-secondary)] to-purple-600 transform -translate-x-1/2 rounded-full origin-top"
            style={{ scaleY }}
          />

          <div className="space-y-24 md:space-y-32">
            {categoryParams.timeline.map((item, idx) => (
              <TimelineNode 
                key={idx} 
                isLeft={idx % 2 === 0} 
                delay={0.2}
                title={item.title}
                text={item.text}
              />
            ))}
          </div>
        </div>

        {/* Handwritten Letter Section - Unique Addition */}
        <HandwrittenLetter 
          text={categoryParams.timeline[0].text}
          sub={categoryParams.timeline[categoryParams.timeline.length - 1].sub}
        />

        {/* Conclusion Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -200px 0px" }}
          onViewportEnter={() => {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.8 },
              colors: ['#A855F7', '#EC4899', '#3B82F6', '#F59E0B']
            });
          }}
          transition={{ duration: 0.8 }}
          className="mt-24 flex flex-col items-center bg-white/80 backdrop-blur-3xl rounded-[4rem] p-10 md:p-16 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border-4 border-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 w-1.5 h-16 bg-gradient-to-b from-[var(--theme-primary)] to-transparent transform -translate-x-1/2 hidden md:block" />

          <p className="text-[11px] md:text-sm font-black tracking-[0.4em] text-[var(--theme-primary)] uppercase mb-6 mt-4 md:mt-0 opacity-70">
            {greeting}
          </p>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-snug md:leading-tight mb-12 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-[var(--theme-secondary)] max-w-3xl">
            Having you in my life, <br className="hidden sm:block" />
            हीच माझ्यासाठी real gift आहे.
          </h1>
          
          <HandwrittenSignature />
          
          <div className="w-full h-px bg-slate-100 my-12 max-w-md" />

          <div className="w-full max-w-md flex flex-col items-center justify-center scale-110">
            <AudioPlayer src={voiceClip} autoPlay={madeWish} />
          </div>
        </motion.div>
      </div>
      
      {/* Background Ambient Audio */}
      <AmbientAudio src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" />
    </motion.div>
    </>
  );
}
