import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function TypewriterText({ text, className = "", delay = 0, speed = 0.03, once = true, animateImmediately = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-5%" });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView || animateImmediately) {
      setShouldAnimate(true);
    }
  }, [isInView, animateImmediately]);

  // Split text into words, keeping track of spaces
  const words = text.split(" ");

  const child = {
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay: delay + (i * speed)
      },
    }),
    hidden: {
      opacity: 0,
      y: 15,
      scale: 1.1,
      filter: "blur(4px)",
    },
  };

  let globalIndex = 0;

  return (
    <div
      ref={ref}
      style={{ display: "block", width: "100%" }}
      className={className}
    >
      {words.map((word, wordIndex) => {
        // Use Intl.Segmenter to properly handle complex scripts like Devanagari (Marathi)
        let letters = [];
        try {
          const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
          letters = Array.from(segmenter.segment(word)).map(s => s.segment);
        } catch (e) {
          letters = Array.from(word);
        }
        
        return (
          <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
            {letters.map((letter, letterIndex) => {
              const currentIndex = globalIndex++;
              return (
                <motion.span 
                  variants={child} 
                  custom={currentIndex}
                  initial="hidden"
                  animate={shouldAnimate ? "visible" : "hidden"}
                  key={`char-${currentIndex}`} 
                  className="inline-block" 
                >
                  {letter}
                </motion.span>
              );
            })}
            
            {/* Add the space back after the word, unless it's the last word */}
            {wordIndex < words.length - 1 && (
              <motion.span
                variants={child}
                custom={globalIndex++}
                initial="hidden"
                animate={shouldAnimate ? "visible" : "hidden"}
                className="inline-block"
                style={{ whiteSpace: "pre" }}
              >
                {" "}
              </motion.span>
            )}
          </span>
        );
      })}
    </div>
  );
}
