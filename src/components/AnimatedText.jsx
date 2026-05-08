import { motion } from 'framer-motion';

export default function AnimatedText({ text, delay = 0, className = "" }) {
  // Split words or lines depending on usage, but simple line-based fade is robust for emotional pacing.
  // We'll fade in the whole text block, or lines if an array is passed.

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 1.2,
        delayChildren: delay,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: "easeOut" } 
    }
  };

  if (Array.isArray(text)) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className={`flex flex-col gap-6 w-full ${className}`}>
        {text.map((line, index) => (
          <motion.div key={index} variants={item} className="whitespace-pre-wrap text-xl md:text-3xl font-medium tracking-wide text-slate-800 drop-shadow-sm leading-relaxed text-center px-4">
            {line}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Single text line fade in with blur
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, delay, ease: "easeOut" }}
      className={`whitespace-pre-wrap text-slate-800 drop-shadow-sm ${className}`}
    >
      {text}
    </motion.div>
  );
}
