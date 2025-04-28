import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Quote, AlignJustify, Terminal, BookText, Braces, Users, Hourglass, Brain, Keyboard, Trophy, RotateCcw, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAnimations } from "@/context/AnimationsContext";
import { MultiplayerModal } from "./multiplayer/MultiplayerModal";

interface PracticeModesProps {
  onModeSelect: (mode: string) => void;
  className?: string;
}

export function PracticeModes({ onModeSelect, className }: PracticeModesProps) {
  const { animationsEnabled } = useAnimations();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);

  const practiceModes = [
    {
      id: "word-practice",
      title: "Word Practice",
      description: "Improve typing common words and phrases",
      icon: <AlignJustify className="h-5 w-5 mr-2" />,
      color: "bg-blue-500/10 text-blue-500",
      difficulty: "Beginner"
    },
    {
      id: "quote-practice",
      title: "Quote Practice",
      description: "Type famous quotes from literature and history",
      icon: <Quote className="h-5 w-5 mr-2" />,
      color: "bg-purple-500/10 text-purple-500",
      difficulty: "Intermediate"
    },
    {
      id: "code-practice",
      title: "Code Practice",
      description: "Practice typing programming code snippets",
      icon: <Code className="h-5 w-5 mr-2" />,
      color: "bg-amber-500/10 text-amber-500",
      difficulty: "Advanced"
    }
  ];

  const specializedModes = [
    {
      id: "programming",
      title: "Programming",
      description: "Choose a language and practice coding syntax",
      icon: <Terminal className="h-6 w-6" />,
      languages: ["JavaScript", "Python", "Java", "C++", "TypeScript"]
    },
    {
      id: "literature",
      title: "Literature",
      description: "Classic excerpts from famous literary works",
      icon: <BookText className="h-6 w-6" />,
      authors: ["Shakespeare", "Austen", "Hemingway", "Dickens", "Orwell"]
    },
    {
      id: "symbols",
      title: "Symbols & Brackets",
      description: "Practice typing special characters and programming symbols",
      icon: <Braces className="h-6 w-6" />,
      categories: ["Brackets", "Math Symbols", "Currency", "Punctuation", "Arrows"]
    }
  ];

  const modes = [
    {
      id: "timed",
      title: "Timed Challenge",
      description: "Race against the clock to improve your speed.",
      icon: <Hourglass className="h-5 w-5 text-orange-500" />,
      color: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
    },
    {
      id: "accuracy",
      title: "Accuracy Focus",
      description: "Train to type with fewer mistakes.",
      icon: <Brain className="h-5 w-5 text-green-500" />,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
    },
    {
      id: "skill",
      title: "Skill Builder",
      description: "Exercises to improve specific typing skills.",
      icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
      color: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      id: "competition",
      title: "Competition Mode",
      description: "Challenge yourself against past records.",
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      color: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-500/30",
    },
    {
      id: "multiplayer",
      title: "Multiplayer Race",
      description: "Race against friends in real-time typing competitions.",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      color: "from-purple-500/20 to-fuchsia-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      id: "daily",
      title: "Daily Challenge",
      description: "New challenges every day to keep improving.",
      icon: <RotateCcw className="h-5 w-5 text-rose-500" />,
      color: "from-rose-500/20 to-pink-500/20",
      borderColor: "border-rose-500/30",
    },
  ];

  const handleSelect = (mode: string) => {
    setSelectedMode(mode);
    if (mode === "multiplayer") {
      setIsMultiplayerModalOpen(true);
    } else {
      onModeSelect(mode);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold tracking-tight">Practice Modes</h2>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic Practice</TabsTrigger>
          <TabsTrigger value="specialized">Specialized Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practiceModes.map((mode) => (
              <Card key={mode.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <div className={cn("p-2 rounded-md mr-2", mode.color)}>
                      {mode.icon}
                    </div>
                    {mode.title}
                  </CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Difficulty: {mode.difficulty}</span>
                  <Button 
                    size="sm" 
                    onClick={() => handleSelect(mode.id)}
                  >
                    Start
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="specialized" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specializedModes.map((mode) => (
              <Card key={mode.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      {mode.title}
                    </CardTitle>
                    <div className="bg-muted p-2 rounded-md">
                      {mode.icon}
                    </div>
                  </div>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {mode.languages && mode.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-muted text-xs rounded-md">
                        {lang}
                      </span>
                    ))}
                    {mode.authors && mode.authors.map((author) => (
                      <span key={author} className="px-2 py-1 bg-muted text-xs rounded-md">
                        {author}
                      </span>
                    ))}
                    {mode.categories && mode.categories.map((category) => (
                      <span key={category} className="px-2 py-1 bg-muted text-xs rounded-md">
                        {category}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleSelect(mode.id)}
                  >
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <MultiplayerModal 
        isOpen={isMultiplayerModalOpen} 
        onClose={() => setIsMultiplayerModalOpen(false)} 
      />
    </div>
  );
} 