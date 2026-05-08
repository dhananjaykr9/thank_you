import { useState, useRef } from 'react';

export default function useMagnetic() {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const range = 200; // Increased range for better feel

    if (distance < range) {
      // Calculate pull factor - stronger closer to center
      const power = 0.5;
      setPosition({ x: distanceX * power, y: distanceY * power });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return { ref, position, handleMouseMove, handleMouseLeave };
}
