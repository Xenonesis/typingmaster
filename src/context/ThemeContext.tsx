import React, { useState, useEffect } from "react";
import { Theme, ThemeColors, ThemeContext, ThemeContextType, themeConfigs } from "./ThemeContextDefinition";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    () => {
      const storedTheme = localStorage.getItem("theme") as Theme;
      const validThemes: Theme[] = ["light", "dark", "ocean", "forest", "sunset", "midnight"];
      return validThemes.includes(storedTheme) ? storedTheme : "light";
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "ocean", "forest", "sunset", "midnight");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
    
    // Apply theme colors to CSS variables
    const colors = themeConfigs[theme];
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "ocean", "forest", "sunset", "midnight"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme hook moved to src/hooks/useTheme.ts
