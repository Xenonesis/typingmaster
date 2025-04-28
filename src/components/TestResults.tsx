import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Trophy, Home, Minimize2, Rocket, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";

export interface TestResultsData {
  wpm: number;
  cpm: number;
  accuracy: number;
  time: number;
  date: number;
  difficulty: string;
}

interface TestResultsProps {
  results: TestResultsData | null;
  onRestart: () => void;
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
}

export function TestResults({ results, onRestart, isFullscreen, onExitFullscreen }: TestResultsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);

  useEffect(() => {
    if (results) {
      // Calculate score after a slight delay for animation
      setTimeout(() => {
        const calculatedScore = calculateScore(results);
        setFinalScore(calculatedScore);
        
        // Retrieve personal best from localStorage
        try {
          const storedResultsJSON = localStorage.getItem("typingPersonalBests");
          const storedResults: TestResultsData[] = storedResultsJSON 
            ? JSON.parse(storedResultsJSON) 
            : [];
          
          if (storedResults.length > 0) {
            // Find highest score from previous tests
            const previousBest = storedResults
              .filter(r => r.wpm > 0) // Only consider valid results
              .reduce((maxScore, result) => {
                const score = calculateScore(result);
                return score > maxScore ? score : maxScore;
              }, 0);
            
            setPersonalBest(previousBest);
            
            // Check if current score is a new personal best
            if (calculatedScore > previousBest) {
              setIsNewPersonalBest(true);
            }
          }
        } catch (error) {
          console.error("Error retrieving personal best:", error);
        }
        
        setShowScoreAnimation(true);
      }, 500);
    }
  }, [results]);

  // Calculate a score based on WPM, accuracy, and difficulty
  function calculateScore(result: TestResultsData): number {
    if (!result || result.wpm <= 0) return 0;
    
    // Base score is WPM
    let score = result.wpm;
    
    // Apply accuracy multiplier (0.5x to 1.2x)
    const accuracyMultiplier = Math.min(1.2, Math.max(0.5, result.accuracy / 100));
    score *= accuracyMultiplier;
    
    // Apply difficulty multiplier
    const difficultyMultiplier = getDifficultyMultiplier(result.difficulty);
    score *= difficultyMultiplier;
    
    // Apply time bonus for longer tests
    const timeMultiplier = 1 + (Math.min(300, result.time) / 600); // Max 1.5x for 5-minute tests
    score *= timeMultiplier;
    
    return Math.round(score);
  }
  
  // Get difficulty multiplier based on difficulty level
  function getDifficultyMultiplier(difficulty: string): number {
    switch(difficulty) {
      case 'beginner': return 0.8;
      case 'intermediate': return 1.0;
      case 'advanced': return 1.2;
      case 'expert': return 1.4;
      case 'code': return 1.5;
      default: return 1.0;
    }
  }

  // Get letter grade based on score
  function getGrade(score: number): string {
    if (score >= 200) return "S+";
    if (score >= 180) return "S";
    if (score >= 160) return "A+";
    if (score >= 140) return "A";
    if (score >= 120) return "B+";
    if (score >= 100) return "B";
    if (score >= 80) return "C+";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F";
  }

  // Get color class based on grade
  function getGradeColor(grade: string): string {
    switch(grade) {
      case "S+": return "text-purple-500 dark:text-purple-300";
      case "S": return "text-indigo-500 dark:text-indigo-300";
      case "A+":
      case "A": return "text-green-500 dark:text-green-300";
      case "B+":
      case "B": return "text-blue-500 dark:text-blue-300";
      case "C+":
      case "C": return "text-orange-500 dark:text-orange-300";
      case "D": return "text-amber-500 dark:text-amber-300";
      case "F": return "text-red-500 dark:text-red-300";
      default: return "text-foreground";
    }
  }

  const handleShareResults = async () => {
    if (!results) return;

    try {
      const shareText = `🚀 Typing Test Results 🚀\n\n⌨️ ${results.wpm} WPM\n🎯 ${results.accuracy.toFixed(1)}% Accuracy\n📊 Score: ${finalScore}\n🔥 ${formatDifficulty(results.difficulty)} difficulty\n\nTest your typing speed at typist.app`;

      if (navigator.share) {
        await navigator.share({
          title: 'My Typing Test Results',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        toast({
          title: "Copied to clipboard!",
          description: "Your results have been copied to your clipboard.",
        });
        
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sharing results:", error);
      toast({
        title: "Sharing failed",
        description: "Could not share your results.",
        variant: "destructive",
      });
    }
  };
  
  function formatDifficulty(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>No results to display.</p>
      </div>
    );
  }

  const grade = getGrade(finalScore);
  const gradeColor = getGradeColor(grade);

  return (
    <div className="results-container p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Test Results</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isFullscreen && onExitFullscreen && (
            <Button variant="outline" size="sm" onClick={onExitFullscreen}>
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleShareResults}>
            {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
            {isCopied ? "Copied!" : "Share"}
          </Button>
          <Button variant="default" size="sm" onClick={onRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Card */}
        <Card className="shadow-card border-border/30 overflow-hidden md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Final Score</span>
              {isNewPersonalBest && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  New Personal Best!
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Based on speed, accuracy, and difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <AnimatePresence>
                {showScoreAnimation && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center"
                  >
                    <div className="relative">
                      <motion.div 
                        className={cn("text-7xl font-bold", gradeColor)}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        {finalScore}
                      </motion.div>
                      
                      <motion.div 
                        className="absolute -top-4 -right-4 bg-background border border-border/50 rounded-full px-2 py-1 text-sm font-bold"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <span className={gradeColor}>{grade}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {personalBest !== null && (
                <div className="text-sm text-muted-foreground mt-2">
                  {isNewPersonalBest 
                    ? `Previous best: ${personalBest}` 
                    : `Personal best: ${personalBest}`}
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Speed</span>
                  <span className="font-medium">{results.wpm} WPM</span>
                </div>
                <Progress value={Math.min(100, (results.wpm / 2))} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium">{results.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={results.accuracy} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium">{formatDifficulty(results.difficulty)}</span>
                </div>
                <Progress 
                  value={
                    results.difficulty === 'beginner' ? 20 :
                    results.difficulty === 'intermediate' ? 40 :
                    results.difficulty === 'advanced' ? 60 :
                    results.difficulty === 'expert' ? 80 :
                    results.difficulty === 'code' ? 100 : 40
                  } 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-border/30">
          <CardHeader className="pb-2">
            <CardTitle>Speed</CardTitle>
            <CardDescription>Words per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-bold">{results.wpm}</span>
              <span className="text-xl ml-1">WPM</span>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-1">
              {results.cpm} CPM (Characters per minute)
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-border/30">
          <CardHeader className="pb-2">
            <CardTitle>Accuracy</CardTitle>
            <CardDescription>Percentage of correct keystrokes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-bold">{results.accuracy.toFixed(1)}</span>
              <span className="text-xl ml-1">%</span>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-1">
              {results.accuracy >= 98 ? "Excellent!" : 
               results.accuracy >= 95 ? "Very Good" : 
               results.accuracy >= 90 ? "Good" : 
               results.accuracy >= 85 ? "Fair" : "Needs Improvement"}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card border-border/30">
          <CardHeader className="pb-2">
            <CardTitle>Time</CardTitle>
            <CardDescription>Test duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-bold">{results.time}</span>
              <span className="text-xl ml-1">s</span>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-1">
              {formatDate(new Date(results.date))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button variant="default" size="lg" onClick={onRestart}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Take Another Test
        </Button>
      </div>
    </div>
  );
}
