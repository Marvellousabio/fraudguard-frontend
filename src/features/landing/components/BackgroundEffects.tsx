import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const BackgroundEffects: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar Top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Mouse Spotlight / Torch Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-30 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`
        }}
      />

      {/* Background Animated Glowing Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Right Indigo Orb */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        
        {/* Bottom Left Cyan Orb */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-float" />
        
        {/* Center Purple Orb */}
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Radial Dark Masking */}
        <div className="absolute inset-0 bg-radial-gradient" />
      </div>
    </>
  );
};
