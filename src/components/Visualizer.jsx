import { useEffect, useRef } from 'react';

export default function Visualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    // Initialize Audio Context and Analyser only once
    const initAudio = () => {
      try {
        if (!contextRef.current) {
          // Use global context if available to prevent multiple contexts
          if (!window.__audioContext) {
            window.__audioContext = new (window.AudioContext || window.webkitAudioContext)();
          }
          contextRef.current = window.__audioContext;
          
          if (!analyserRef.current) {
            analyserRef.current = contextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
          }

          // CRITICAL: createMediaElementSource can ONLY be called once per element
          if (!audioRef.current._source) {
            audioRef.current._source = contextRef.current.createMediaElementSource(audioRef.current);
            audioRef.current._source.connect(analyserRef.current);
            analyserRef.current.connect(contextRef.current.destination);
          }
          
          sourceRef.current = audioRef.current._source;
        }
      } catch (e) {
        console.error("Visualizer initialization failed:", e);
      }
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      if (!analyserRef.current) return;
      
      animationRef.current = requestAnimationFrame(draw);
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      // Get theme primary color
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '#a855f7';

      for(let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = dataArray[i] / 255;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
      ctx.globalAlpha = 1;
    };

    if (isPlaying) {
      initAudio();
      if (contextRef.current && contextRef.current.state === 'suspended') {
        contextRef.current.resume();
      }
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-10 mt-1" 
      width={300} 
      height={40}
    />
  );
}
