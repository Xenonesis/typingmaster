import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, BarChart2, Clock, BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestResultsData } from "../TestResults";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useAnimations } from "@/context/AnimationsContext";

interface ResultCardProps {
  results: TestResultsData;
}

export function ResultCard({ results }: ResultCardProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [wpmValue, setWpmValue] = useState(0);
  const [cpmValue, setCpmValue] = useState(0);
  const [accuracyValue, setAccuracyValue] = useState(0);
  const { animationsEnabled } = useAnimations();

  useEffect(() => {
    // Trigger animation after component mounts
    setShowAnimation(true);
    
    // Only animate counters if animations are enabled
    if (!animationsEnabled) {
      // Set final values immediately if animations are disabled
      setWpmValue(results.wpm);
      setCpmValue(results.cpm);
      setAccuracyValue(results.accuracy);
      return;
    }
    
    // Animate counters from 0 to result values
    const duration = 1500; // Animation duration in ms
    const steps = 30; // Number of steps
    const wpmStep = results.wpm / steps;
    const cpmStep = results.cpm / steps;
    const accuracyStep = results.accuracy / steps;
    
    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        setWpmValue(Math.min(results.wpm, Math.round(wpmStep * i)));
        setCpmValue(Math.min(results.cpm, Math.round(cpmStep * i)));
        setAccuracyValue(Math.min(results.accuracy, Number((accuracyStep * i).toFixed(1))));
      }, (duration / steps) * i);
    }
  }, [results.wpm, results.cpm, results.accuracy, animationsEnabled]);

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case "beginner": return "text-green-500";
      case "advanced": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Intermediate";
  };
  
  const getProgressColor = (value: number, metric: 'wpm' | 'accuracy') => {
    if (metric === 'wpm') {
      if (value >= 80) return "bg-success";
      if (value >= 50) return "bg-accent";
      return "bg-primary";
    } else {
      if (value >= 95) return "bg-success";
      if (value >= 85) return "bg-accent";
      return "bg-primary";
    }
  };

  const getWpmRating = (wpm: number) => {
    if (wpm >= 100) return "Expert";
    if (wpm >= 80) return "Advanced";
    if (wpm >= 60) return "Professional";
    if (wpm >= 40) return "Intermediate";
    if (wpm >= 20) return "Beginner";
    return "Novice";
  };

  return (
    <Card className={cn("glass mb-8 overflow-hidden transition-all duration-500", 
      showAnimation ? "opacity-100 transform-none" : "opacity-0 translate-y-4")}>
      <div className="bg-primary/10 py-3 px-6 border-b border-border">
        <CardTitle className="text-2xl text-center font-medium flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Results
        </CardTitle>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col items-center bg-background/40 p-5 rounded-lg shadow-soft border border-border/30">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-lg font-medium">Words Per Minute</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground ml-2" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">WPM measures how many words you can type in a minute,<br />accounting for errors and using a standard word length of 5 characters.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-5xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {wpmValue}
            </span>
            <span className="text-muted-foreground">Rating: {getWpmRating(results.wpm)}</span>
            <div className="w-full mt-4">
              <Progress value={(results.wpm / 120) * 100} max={100} className={cn("h-2", getProgressColor(results.wpm, 'wpm'))} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>40</span>
                <span>80</span>
                <span>120+</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-background/40 p-5 rounded-lg shadow-soft border border-border/30">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-6 w-6 text-accent mr-2" />
              <h3 className="text-lg font-medium">Accuracy & Speed</h3>
            </div>
            <div className="flex justify-between w-full mb-4">
              <div className="text-center">
                <span className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {accuracyValue}%
                </span>
                <p className="text-muted-foreground mt-1">Accuracy</p>
                <div className="w-32 mt-2">
                  <Progress value={accuracyValue} max={100} className={cn("h-2", getProgressColor(results.accuracy, 'accuracy'))} />
                </div>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {cpmValue}
                </span>
                <p className="text-muted-foreground mt-1">CPM</p>
              </div>
            </div>
            <div className="flex justify-between w-full mt-2">
              <div className="text-center">
                <span className="text-3xl font-bold font-mono">
                  {results.time}s
                </span>
                <p className="text-muted-foreground mt-1">Duration</p>
              </div>
              <div className="text-center">
                <span className={cn("text-3xl font-bold font-mono", getDifficultyColor(results.difficulty))}>
                  {getDifficultyLabel(results.difficulty)}
                </span>
                <p className="text-muted-foreground mt-1">Difficulty</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-background/40 p-4 rounded-lg shadow-soft border border-border/30">
          <h3 className="text-center text-lg font-medium mb-3">Test Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(results.date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Typing Speed Rate:</span>
              <span>{results.wpm > 60 ? "Fast" : results.wpm > 30 ? "Average" : "Slow"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Errors Penalty:</span>
              <span>{Math.round(((results.cpm / 5) - results.wpm) * 0.5)} errors</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Keystroke Time:</span>
              <span>{(results.time / (results.cpm / 60)).toFixed(2)}ms</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
