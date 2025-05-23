import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { name: "Classic", value: "classic" },
  { name: "Classic Dark", value: "classicDark" },
  { name: "Ocean", value: "ocean" },
  { name: "Forest", value: "forest" },
  { name: "Sunset", value: "sunset" },
  { name: "Midnight", value: "midnight" },
  { name: "Neon Cyberpunk", value: "neonCyberpunk" },
  { name: "Earthy Tones", value: "earthyTones" },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={theme === t.value ? "bg-accent" : ""}
          >
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 