"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

const themes = [
  { id: "system", icon: FaDesktop },
  { id: "light", icon: FaSun },
  { id: "dark", icon: FaMoon },
] as const;

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].id);
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border hover:bg-muted-subtle transition-all duration-200"
        aria-label="Theme settings"
      >
        <span className="opacity-0">Loading...</span>
      </button>
    );
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-105 hover:shadow-lg"
      aria-label="Toggle theme"
      title={`Current theme: ${currentTheme.id}`}
    >
      <CurrentIcon className="w-4 h-4 flex-shrink-0" />
    </button>
  );
}
