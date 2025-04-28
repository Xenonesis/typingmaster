import React, { createContext, useState, useEffect, useContext } from "react";

type Theme = "dark" | "light" | "ocean" | "forest" | "sunset" | "midnight";

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const themeConfigs: Record<Theme, ThemeColors> = {
  light: {
    primary: "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(210 40% 98%)",
    background: "hsl(0 0% 100%)",
    text: "hsl(222.2 47.4% 11.2%)"
  },
  dark: {
    primary: "hsl(210 40% 98%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(222.2 47.4% 11.2%)",
    background: "hsl(222.2 84% 4.9%)",
    text: "hsl(210 40% 98%)"
  },
  ocean: {
    primary: "hsl(200 70% 50%)",
    secondary: "hsl(200 60% 60%)",
    accent: "hsl(190 80% 40%)",
    background: "hsl(200 30% 10%)",
    text: "hsl(200 15% 95%)"
  },
  forest: {
    primary: "hsl(150 60% 40%)",
    secondary: "hsl(140 50% 50%)",
    accent: "hsl(160 70% 30%)",
    background: "hsl(140 15% 10%)",
    text: "hsl(140 15% 95%)"
  },
  sunset: {
    primary: "hsl(20 80% 50%)",
    secondary: "hsl(30 70% 60%)",
    accent: "hsl(10 90% 40%)",
    background: "hsl(20 30% 10%)",
    text: "hsl(20 15% 95%)"
  },
  midnight: {
    primary: "hsl(250 60% 50%)",
    secondary: "hsl(260 50% 60%)",
    accent: "hsl(270 70% 40%)",
    background: "hsl(250 30% 10%)",
    text: "hsl(250 15% 95%)"
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
