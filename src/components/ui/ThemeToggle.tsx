"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-6 h-6" />; // placeholder to prevent layout shift
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="text-black/70 hover:text-red transition-colors duration-300 p-1"
      aria-label="Toggle Dark Mode"
    >
      {currentTheme === "dark" ? (
        <Sun size={20} strokeWidth={1.5} />
      ) : (
        <Moon size={20} strokeWidth={1.5} />
      )}
    </button>
  );
}
