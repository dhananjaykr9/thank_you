import { motion } from 'framer-motion';

const CircularText = ({ text, radius = 80, fontSize = "16px", color = "white", duration = 20 }) => {
  const diameter = radius * 2 + 50; 
  const center = diameter / 2;
  
  // Create a long enough string to ensure it wraps around
  const repeatedText = (text + " ").repeat(10);

  return (
    <div className="relative flex items-center justify-center pointer-events-none" style={{ width: diameter, height: diameter }}>
      <motion.svg
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="w-full h-full overflow-visible"
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="textCirclePath"
            d={`M ${center}, ${center} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text 
          style={{ 
            fontSize, 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            fill: color
          }}
        >
          <textPath href="#textCirclePath" startOffset="0%">
            {repeatedText}
          </textPath>
        </text>
      </motion.svg>
    </div>
  );
};

export default CircularText;
