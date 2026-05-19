"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINE_DURATION = 1500; // Slower timing: 1.5s per line to allow full legibility

export default function LoadingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const totalLines = 5;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === totalLines - 1) {
          clearInterval(interval);
          // Wait longer on the final slogan before fading out the screen
          setTimeout(() => setIsVisible(false), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, LINE_DURATION);

    // Failsafe hide after 10 seconds total
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const renderContextualAnimation = (index: number) => {
    switch (index) {
      case 0:
        // "System loading..." - Terminal/Monospace blinking cursor
        return (
          <div className="flex items-center justify-center font-mono text-xl sm:text-2xl text-stone-700 tracking-wider">
            <span>System loading...</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              className="inline-block w-2.5 h-5 bg-stone-700 ml-1.5 align-middle"
            />
          </div>
        );

      case 1:
        // "Public waiting..." - Breathing, stretching tracking
        return (
          <motion.div
            initial={{ letterSpacing: "1px", opacity: 0.4 }}
            animate={{ letterSpacing: "6px", opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            className="font-english text-stone-500 uppercase tracking-widest text-2xl sm:text-3xl font-light"
          >
            Public waiting...
          </motion.div>
        );

      case 2:
        // "Roads still broken..." - Fractured, wobbling text letters
        const roadText = "Roads still broken...";
        return (
          <div className="flex items-center justify-center font-english text-2xl sm:text-3xl font-medium text-red/80 tracking-wide">
            {roadText.split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                animate={{
                  y: [0, Math.random() * 4 - 2, 0],
                  rotate: [0, Math.random() * 6 - 3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.3 + Math.random() * 0.4,
                  ease: "easeInOut",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        );

      case 3:
        // "Paani abhi bhi nahi aaya..." - Wavy liquid rippling text
        const waterText = "Paani abhi bhi nahi aaya...";
        return (
          <div className="flex items-center justify-center font-hindi text-2xl sm:text-3xl font-medium text-blue/70 tracking-wide">
            {waterText.split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  delay: i * 0.06,
                  ease: "easeInOut",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        );

      case 4:
        // "काम दिखना चाहिए." - Slogan punch: spring bounce, bold impact, expanding underline
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1.05], opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-hindi text-4xl sm:text-6xl text-black font-bold tracking-wide mb-3 drop-shadow-sm"
            >
              काम दिखना चाहिए.
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
              className="h-1 bg-red max-w-[200px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-off-white flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 film-grain opacity-55 mix-blend-overlay"></div>
          
          <div className="relative z-10 px-4 text-center w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderContextualAnimation(currentIndex)}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
