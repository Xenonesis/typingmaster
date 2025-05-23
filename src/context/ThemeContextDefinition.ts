import { createContext } from "react";

export type Theme = "classic" | "classicDark" | "ocean" | "forest" | "sunset" | "midnight" | "neonCyberpunk" | "earthyTones";

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const themeConfigs: Record<Theme, ThemeColors> = {
  classic: {
    primary: "hsl(221 83% 53%)", /* Bright blue for primary buttons/accents */
    secondary: "hsl(217 100% 97%)", /* Very light blue for secondary elements */
    accent: "hsl(190 90% 50%)", /* Cyan accent for highlights */
    background: "hsl(210 50% 98%)", /* Slightly blue-tinted white background */
    text: "hsl(222 47% 11%)" /* Dark blue text for readability */
  },
  classicDark: {
    primary: "hsl(221 83% 53%)", /* Bright blue for primary buttons/accents */
    secondary: "hsl(215 28% 17%)", /* Dark blue-gray for secondary elements */
    accent: "hsl(190 90% 50%)", /* Cyan accent for highlights */
    background: "hsl(222 47% 5%)", /* Very dark blue-black background */
    text: "hsl(210 40% 98%)" /* Very light blue-white text for readability */
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
  },
  neonCyberpunk: {
    primary: "hsl(320 100% 60%)", // Bright pink
    secondary: "hsl(200 100% 50%)", // Bright blue
    accent: "hsl(135 100% 50%)", // Bright green
    background: "hsl(260 30% 10%)", // Dark purple
    text: "hsl(180 100% 80%)" // Cyan
  },
  earthyTones: {
    primary: "hsl(35 80% 50%)", // Warm orange-brown
    secondary: "hsl(90 40% 50%)", // Muted green
    accent: "hsl(45 70% 60%)", // Soft gold
    background: "hsl(30 30% 15%)", // Deep brown
    text: "hsl(40 30% 90%)" // Warm off-white
  }
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
