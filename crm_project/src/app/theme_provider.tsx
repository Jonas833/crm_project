"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "colorblind";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  logout: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: any) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  // Theme aus LocalStorage ziehen
  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  function setTheme(mode: ThemeMode) {
    localStorage.setItem("theme", mode);
    document.documentElement.setAttribute("data-theme", mode);
    setThemeState(mode);
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/sign-in";
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, logout }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
