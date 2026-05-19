"use client";

import { useEffect, useState } from "react";

export default function CockroachEasterEgg() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: -50, angle: 90 });

  useEffect(() => {
    // 1 in 5 chance to appear
    const shouldAppear = Math.random() < 0.2;
    if (!shouldAppear) return;

    // Wait random time before appearing (5s to 20s)
    const appearTimer = setTimeout(() => {
      // Pick random height percentage
      const randomTop = Math.random() * 80 + 10;
      setPosition(prev => ({ ...prev, top: randomTop }));
      setIsVisible(true);

      // Start crawling animation across screen
      let currentLeft = -50;
      let wiggle = 0;

      const crawlInterval = setInterval(() => {
        currentLeft += 2; // Speed
        wiggle = Math.sin(currentLeft * 0.2) * 5; // Wiggle effect
        
        setPosition(prev => ({
          ...prev,
          left: currentLeft,
          angle: 90 + wiggle
        }));

        // Remove if off screen
        if (currentLeft > window.innerWidth + 50) {
          clearInterval(crawlInterval);
          setIsVisible(false);
        }
      }, 50);

      return () => clearInterval(crawlInterval);
    }, Math.random() * 15000 + 5000);

    return () => clearTimeout(appearTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 pointer-events-none mix-blend-multiply opacity-40 transition-all duration-75"
      style={{ 
        top: `${position.top}vh`, 
        left: `${position.left}px`,
        transform: `rotate(${position.angle}deg)`,
      }}
    >
      <div className="relative w-8 h-8">
        {/* Simple realistic cockroach shape via SVG */}
        <svg viewBox="0 0 24 24" fill="#111" className="w-full h-full">
          <ellipse cx="12" cy="12" rx="4" ry="8" />
          <path d="M12 4 L10 0 M12 4 L14 0" stroke="#111" strokeWidth="0.5" fill="none" />
          <path d="M8 10 L4 8 M16 10 L20 8 M8 14 L4 16 M16 14 L20 16 M9 18 L6 22 M15 18 L18 22" stroke="#111" strokeWidth="0.8" fill="none" />
        </svg>

        {/* The flag message, only occasionally visible */}
        {Math.random() > 0.5 && (
          <div className="absolute -top-6 -right-24 bg-black/10 backdrop-blur-sm px-2 py-0.5 text-[8px] font-english text-black/60 border border-black/10 whitespace-nowrap -rotate-90 origin-bottom-left">
            "Tumko cockroach bola CJI ne"
          </div>
        )}
      </div>
    </div>
  );
}
