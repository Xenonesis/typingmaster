import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 hover:bg-secondary/80 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-accent animate-in fade-in" />
      ) : (
        <Sun className="h-5 w-5 text-primary animate-in fade-in" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
