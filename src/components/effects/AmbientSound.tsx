"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for the ambient sound (rain/city noise)
    // Using a reliable public domain/free ambient sound URL as a placeholder
    const audio = new Audio("https://cdn.freesound.org/previews/515/515354_11283626-lq.mp3");
    audio.loop = true;
    audio.volume = 0.3; // Low ambient volume
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-black/5 hover:bg-black/10 backdrop-blur-md p-3 rounded-full transition-colors border border-black/10 flex items-center justify-center text-black/60 hover:text-black shadow-lg mix-blend-multiply"
      aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
