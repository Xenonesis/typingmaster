import React, { useState, useEffect } from "react";
import { Theme, ThemeColors, ThemeContext, ThemeContextType, themeConfigs } from "./ThemeContextDefinition";

// Helper function to extract HSL values from an HSL color string
function convertHslToValues(hslString: string): string {
  // Handle hsl(210 40% 98%) format
  const match = hslString.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
  if (match) {
    return `${match[1]} ${match[2]}% ${match[3]}%`;
  }
  
  // If it's already in the format we need (e.g., "210 40% 98%")
  return hslString;
}

// Helper function to adjust lightness of a color
function adjustLightness(hslValues: string, adjustment: number): string {
  const parts = hslValues.split(' ');
  if (parts.length === 3) {
    const h = parts[0];
    const s = parts[1];
    let l = parseInt(parts[2], 10);
    l = Math.max(0, Math.min(100, l + adjustment));
    return `${h} ${s} ${l}%`;
  }
  return hslValues;
}

// Helper function to convert HSL to RGB for CSS variables
function hslToRgb(hslString: string): string {
  // Extract h, s, l values from the HSL string
  const match = hslString.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
  if (!match) return "0, 0, 0";
  
  const h = parseInt(match[1], 10) / 360;
  const s = parseInt(match[2], 10) / 100;
  const l = parseInt(match[3], 10) / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    () => {
      const storedTheme = localStorage.getItem("theme") as Theme;
      const validThemes: Theme[] = ["classic", "classicDark", "ocean", "forest", "sunset", "midnight", "neonCyberpunk", "earthyTones"];
      return validThemes.includes(storedTheme) ? storedTheme : "classic";
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("classic", "classicDark", "ocean", "forest", "sunset", "midnight", "neonCyberpunk", "earthyTones");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
    
    // Apply theme colors to CSS variables
    const colors = themeConfigs[theme];
    // Make sure colors exists before trying to use Object.entries
    if (colors) {
      // Apply all theme colors as CSS variables
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
      
      // Apply colors to standard CSS variables used by Tailwind and other components
      // Map theme colors to application's color system
      const hslValues = {
        background: convertHslToValues(colors.background),
        foreground: convertHslToValues(colors.text),
        primary: convertHslToValues(colors.primary),
        secondary: convertHslToValues(colors.secondary),
        accent: convertHslToValues(colors.accent),
        border: convertHslToValues(colors.secondary),
        card: convertHslToValues(colors.background),
        "card-foreground": convertHslToValues(colors.text),
        muted: adjustLightness(convertHslToValues(colors.secondary), theme.includes("Dark") ? 10 : -10),
        "muted-foreground": adjustLightness(convertHslToValues(colors.text), theme.includes("Dark") ? -20 : 20),
        destructive: "0 84% 60%",
        "destructive-foreground": "0 0% 100%",
        current: convertHslToValues(colors.accent)
      };
      
      // Apply these values to CSS variables
      Object.entries(hslValues).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      
      // Set RGB variables for special effects
      const primaryRgb = hslToRgb(colors.primary);
      const accentRgb = hslToRgb(colors.accent);
      root.style.setProperty("--primary-rgb", primaryRgb);
      root.style.setProperty("--accent-rgb", accentRgb);
      root.style.setProperty("--current-rgb", accentRgb);
    } else {
      // Fallback to classic theme if the current theme doesn't exist in configs
      const fallbackColors = themeConfigs["classic"];
      Object.entries(fallbackColors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
      // Update theme to a valid one
      setTheme("classic" as Theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ["classic", "classicDark", "ocean", "forest", "sunset", "midnight", "neonCyberpunk", "earthyTones"];
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
