"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Global singleton to prevent multiple instances
let globalLenis: Lenis | null = null;
let refCount = 0;

export function useLenis() {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    refCount++;

    // Only create if no instance exists
    if (!globalLenis) {
      globalLenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        globalLenis?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }

      rafRef.current = requestAnimationFrame(raf);
    }

    return () => {
      refCount--;

      // Only destroy when all consumers unmount
      if (refCount === 0 && globalLenis) {
        cancelAnimationFrame(rafRef.current);
        globalLenis.destroy();
        globalLenis = null;
      }
    };
  }, []);

  return globalLenis;
}
