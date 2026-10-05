"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always start with "dark" on both server and client to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage only after hydration
  useEffect(() => {
    const stored = localStorage.getItem("newdashboard-theme") as Theme;
    if (stored) {
      setTheme(stored);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("newdashboard-theme", theme);

      // Also sync with ai-builder's theme key for consistency
      localStorage.setItem("isDarkMode", String(theme === "dark"));

      // Apply theme to document
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    // Disable transitions during theme switch
    document.documentElement.classList.add("no-transitions");

    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    // Re-enable transitions after theme has been applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
