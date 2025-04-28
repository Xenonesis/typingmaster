import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BookOpen, Zap, Award, Code, Quote, BookMarked } from "lucide-react";
import { useState, useEffect } from "react";
import { ChallengeType } from "@/utils/textGenerator";

interface DifficultySelectorProps {
  value: ChallengeType;
  onChange: (value: ChallengeType) => void;
  className?: string;
  showAllOptions?: boolean;
}

type DifficultyInfo = {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
};

export function DifficultySelector({
  value,
  onChange,
  className,
  showAllOptions = false,
}: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeType>(value);
  
  // Update local state when prop changes
  useEffect(() => {
    setSelectedDifficulty(value);
  }, [value]);

  const difficulties: Record<ChallengeType, DifficultyInfo> = {
    beginner: {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Beginner",
      description: "Simple vocabulary, shorter sentences, common words.",
      color: "bg-emerald-500 dark:bg-emerald-600",
    },
    intermediate: {
      icon: <Zap className="h-4 w-4" />,
      label: "Intermediate",
      description: "Moderate vocabulary, varied sentence structures.",
      color: "bg-amber-500 dark:bg-amber-600",
    },
    advanced: {
      icon: <Award className="h-4 w-4" />,
      label: "Advanced",
      description: "Complex vocabulary, longer sentences, uncommon words.",
      color: "bg-rose-500 dark:bg-rose-600",
    },
    code: {
      icon: <Code className="h-4 w-4" />,
      label: "Code Mode",
      description: "Practice typing code snippets with syntax highlighting.",
      color: "bg-blue-500 dark:bg-blue-600",
    },
    quotes: {
      icon: <Quote className="h-4 w-4" />,
      label: "Quotes",
      description: "Famous quotes and sayings for inspirational typing",
      color: "bg-purple-500 dark:bg-purple-600",
    },
    poetry: {
      icon: <BookMarked className="h-4 w-4" />,
      label: "Poetry",
      description: "Poetic verses for rhythmic typing practice",
      color: "bg-pink-500 dark:bg-pink-600",
    }
  };

  const handleSelect = (difficulty: ChallengeType) => {
    setSelectedDifficulty(difficulty);
    onChange(difficulty);
  };

  // Determine which options to show
  const difficultyOptions = showAllOptions 
    ? Object.keys(difficulties) as ChallengeType[]
    : ["beginner", "intermediate", "advanced"] as ChallengeType[];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium leading-none">Difficulty</h4>
        <div className="h-4 w-4 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {difficultyOptions.map((difficulty) => (
          <TooltipProvider key={difficulty}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex-1 border min-w-20",
                    selectedDifficulty === difficulty && "border-2 border-primary"
                  )}
                  onClick={() => handleSelect(difficulty)}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className={cn("h-2 w-2 rounded-full", difficulties[difficulty].color)} />
                    <span>{difficulties[difficulty].label}</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{difficulties[difficulty].description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
} 
