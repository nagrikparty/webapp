"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";

export default function CockroachEasterEgg() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: -50, angle: 90 });
  const [messageIndex, setMessageIndex] = useState(0);
  const t = useTranslations("Cockroach");

  // Read all messages into an array
  const messages = [
    t("messages.0"),
    t("messages.1"),
    t("messages.2"),
    t("messages.3"),
    t("messages.4")
  ];

  useEffect(() => {
    // 1 in 4 chance to appear
    const shouldAppear = Math.random() < 0.25;
    if (!shouldAppear) return;

    // Wait random time before appearing (5s to 15s)
    const appearTimer = setTimeout(() => {
      // Pick random height percentage
      const randomTop = Math.random() * 80 + 10;
      setPosition(prev => ({ ...prev, top: randomTop }));
      
      // Select random message
      setMessageIndex(Math.floor(Math.random() * messages.length));
      setIsVisible(true);

      // Start crawling animation across screen
      let currentLeft = -50;
      let wiggle = 0;
      let isRunning = true;

      const crawl = () => {
        if (!isRunning) return;
        
        currentLeft += 1.5; // Speed
        wiggle = Math.sin(currentLeft * 0.1) * 8; // Wiggle effect
        
        setPosition(prev => ({
          ...prev,
          left: currentLeft,
          angle: 90 + wiggle
        }));

        // Remove if off screen
        if (currentLeft > window.innerWidth + 50) {
          setIsVisible(false);
          isRunning = false;
        } else {
          requestAnimationFrame(crawl);
        }
      };
      
      requestAnimationFrame(crawl);

      return () => {
        isRunning = false;
      };
    }, Math.random() * 10000 + 5000);

    return () => clearTimeout(appearTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 pointer-events-none mix-blend-multiply opacity-50"
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

        {/* The message */}
        <div 
          className="absolute -top-4 right-10 bg-black/10 backdrop-blur-sm px-2.5 py-1 text-[9px] font-hindi font-medium text-black/70 border border-black/10 rounded whitespace-nowrap"
          style={{ transform: `rotate(${-position.angle}deg)` }}
        >
          {messages[messageIndex]}
        </div>
      </div>
    </div>
  );
}
