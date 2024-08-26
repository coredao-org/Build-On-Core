"use client";
import { HalfMoon, SunLight } from "iconoir-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme("dark");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-full text-xs inline-flex items-center justify-center text-black dark:text-white hover:text-purple-600 transition-all duration-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <HalfMoon strokeWidth={2} />
      ) : (
        <SunLight strokeWidth={2} />
      )}
    </button>
  );
};

export default ThemeToggler;
