import { Moon, Sun, CloudMoon, Palmtree, Sunset, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@/context/ThemeContextDefinition";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Map theme to appropriate icon
  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5 text-primary animate-in fade-in" />;
      case "dark":
        return <Moon className="h-5 w-5 text-accent animate-in fade-in" />;
      case "ocean":
        return <CloudMoon className="h-5 w-5 text-primary animate-in fade-in" />;
      case "forest":
        return <Palmtree className="h-5 w-5 text-primary animate-in fade-in" />;
      case "sunset":
        return <Sunset className="h-5 w-5 text-primary animate-in fade-in" />;
      case "midnight":
        return <Star className="h-5 w-5 text-primary animate-in fade-in" />;
      default:
        return <Sun className="h-5 w-5 text-primary animate-in fade-in" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full p-2 hover:bg-secondary/80 transition-all duration-200"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
