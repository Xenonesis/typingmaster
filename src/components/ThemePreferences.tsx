import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { useAnimations } from "@/context/AnimationsContext";
import { motion } from "framer-motion";
import { themeConfigs, Theme } from "@/context/ThemeContextDefinition";
import "@/styles/theme-previews.css";

// Theme options with display names
const themes = [
  { name: "Classic", value: "classic" as Theme, description: "Light theme with classic colors" },
  { name: "Classic Dark", value: "classicDark" as Theme, description: "Dark version of the classic theme" },
  { name: "Ocean", value: "ocean" as Theme, description: "Cool blue tones inspired by the sea" },
  { name: "Forest", value: "forest" as Theme, description: "Earthy green palette from nature" },
  { name: "Sunset", value: "sunset" as Theme, description: "Warm orange and red tones" },
  { name: "Midnight", value: "midnight" as Theme, description: "Deep purple night sky theme" },
  { name: "Neon Cyberpunk", value: "neonCyberpunk" as Theme, description: "Vibrant neon colors on dark background" },
  { name: "Earthy Tones", value: "earthyTones" as Theme, description: "Natural calm colors from earth" },
];

interface ThemePreferencesProps {
  className?: string;
  showDescription?: boolean;
}

export function ThemePreferences({ className, showDescription = true }: ThemePreferencesProps) {
  const { theme, setTheme } = useTheme();
  const { animationsEnabled } = useAnimations();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Theme Preferences</h3>
      </div>
      
      {showDescription && (
        <p className="text-sm text-muted-foreground mb-4">
          Choose a theme that suits your style. Your preference will be saved automatically.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {themes.map((t) => (
          <ThemeOption
            key={t.value}
            name={t.name}
            value={t.value}
            description={t.description}
            selected={theme === t.value}
            onClick={() => setTheme(t.value)}
            animationsEnabled={animationsEnabled}
          />
        ))}
      </div>
    </div>
  );
}

interface ThemeOptionProps {
  name: string;
  value: Theme;
  description: string;
  selected: boolean;
  onClick: () => void;
  animationsEnabled: boolean;
}

function ThemeOption({ name, value, description, selected, onClick, animationsEnabled }: ThemeOptionProps) {
  const colors = themeConfigs[value];
  
  return (
    <motion.div
      whileHover={animationsEnabled ? { scale: 1.02 } : {}}
      whileTap={animationsEnabled ? { scale: 0.98 } : {}}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer border-2 transition-all duration-200 theme-option-card",
          selected ? "selected" : "border-transparent hover:border-muted"
        )}
        onClick={onClick}
      >
        {/* Color Preview */}
        <div className="h-20 w-full relative theme-preview-container">
          {/* Background color */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: colors.background }}
          />
          
          {/* Color Samples */}
          <div className="absolute inset-0 p-2 flex flex-col justify-between">
            <div className="flex space-x-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.secondary }} />
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colors.accent }} />
            </div>
            <div
              className="text-xs font-medium truncate"
              style={{ color: colors.text }}
            >
              {name}
            </div>
          </div>
          
          {/* Selected indicator */}
          {selected && (
            <div className="theme-preview-indicator">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
        
        {/* Theme name and description */}
        <div className="p-3">
          <h4 className="text-sm font-medium">{name}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}
