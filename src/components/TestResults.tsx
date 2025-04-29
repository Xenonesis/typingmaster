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
import { useAuth } from "@/context/AuthContext";
import { saveTypingStats } from "@/services/userService";
import { useAchievements } from "@/context/AchievementsContext";

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
  const { user } = useAuth();
  const { updateProgress } = useAchievements();
  const [isCopied, setIsCopied] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);

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
        
        // Save results to Supabase if user is logged in
        saveResultsToDatabase();

        // Update achievements
        updateAchievements();
      }, 500);
    }
  }, [results]);
  
  // Update achievements based on test results
  const updateAchievements = () => {
    if (!results) return;
    
    try {
      // Get stored results to count total tests
      const storedResultsJSON = localStorage.getItem("typingPersonalBests");
      const storedResults: TestResultsData[] = storedResultsJSON 
        ? JSON.parse(storedResultsJSON)
        : [];
      
      // Test completion achievements
      const totalTests = storedResults.length;
      updateProgress('tests_completed_10', totalTests);
      updateProgress('tests_completed_50', totalTests);
      updateProgress('tests_completed_100', totalTests);
      updateProgress('tests_completed_500', totalTests);
      updateProgress('tests_completed_1000', totalTests);
      
      // Speed achievements
      if (results.wpm > 0) {
        updateProgress('wpm_40', results.wpm);
        updateProgress('wpm_70', results.wpm);
        updateProgress('wpm_100', results.wpm);
        updateProgress('wpm_120', results.wpm);
        updateProgress('wpm_150', results.wpm);
        updateProgress('wpm_180', results.wpm);
        updateProgress('wpm_200', results.wpm);
      }
      
      // Accuracy achievements
      if (results.accuracy > 0) {
        updateProgress('accuracy_95', results.accuracy);
        updateProgress('accuracy_98', results.accuracy);
        updateProgress('accuracy_100', results.accuracy);
        
        // Perfect accuracy at 100+ WPM
        if (results.accuracy === 100 && results.wpm >= 100) {
          updateProgress('accuracy_100_wpm_100', 1);
        }
      }
      
      // Difficulty achievements
      if (results.difficulty === 'advanced') {
        updateProgress('advanced_tests_10', 1);
      } else if (results.difficulty === 'expert') {
        updateProgress('expert_tests_5', 1);
      } else if (results.difficulty === 'master') {
        updateProgress('master_tests_3', 1);
      }
      
      // Code typing achievements
      if (results.difficulty === 'code') {
        updateProgress('code_tests_10', 1);
        updateProgress('code_tests_50', 1);
        
        if (results.wpm > 0) {
          updateProgress('code_wpm_60', results.wpm);
          updateProgress('code_wpm_80', results.wpm);
          updateProgress('code_wpm_100', results.wpm);
        }
      }
      
      // Time-based achievements
      if (results.time >= 300) { // 5+ minute test
        updateProgress('long_test_completed', 1);
      }
      if (results.time >= 600) { // 10+ minute test
        updateProgress('marathon_typer', 1);
      }
      if (results.time >= 1200) { // 20+ minute test
        updateProgress('ultra_marathon', 1);
      }
      
      // Special modes
      if (results.difficulty === 'words') {
        updateProgress('wordplay_master', 1);
      } else if (results.difficulty === 'quotes') {
        updateProgress('quote_enthusiast', 1);
      }
      
      // Time of day achievements (Night Owl: midnight to 5am)
      const currentHour = new Date().getHours();
      if (currentHour >= 0 && currentHour < 5) {
        updateProgress('night_owl', 1);
      }
      
      // Weekend warrior
      const currentDay = new Date().getDay();
      if (currentDay === 0 || currentDay === 6) { // 0 = Sunday, 6 = Saturday
        updateProgress('weekend_warrior', 1);
      }
      
    } catch (error) {
      console.error("Error updating achievements:", error);
    }
  };

  // Save results to Supabase if user is logged in
  const saveResultsToDatabase = async () => {
    if (!user || !results) return;
    
    try {
      setIsSavingToCloud(true);
      
      // Save the typing stats - the database trigger will automatically update the profile
      const savedStats = await saveTypingStats({
        user_id: user.id,
        date: new Date(results.date).toISOString(),
        wpm: results.wpm,
        accuracy: results.accuracy / 100,
        test_type: results.difficulty,
        duration: results.time,
        raw_wpm: results.cpm / 5,
        errors: Math.round(results.cpm * (1 - results.accuracy / 100)),
      });
      
      setSavedToCloud(true);
      
      toast({
        title: "Results saved",
        description: "Your test results have been saved to your profile.",
      });
      
      return savedStats;
    } catch (error) {
      console.error("Error saving results to database:", error);
      toast({
        title: "Error saving results",
        description: "There was a problem saving your results. Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSavingToCloud(false);
    }
  };

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
    switch (difficulty.toLowerCase()) {
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
    if (score >= 175) return "S";
    if (score >= 150) return "A+";
    if (score >= 125) return "A";
    if (score >= 100) return "B+";
    if (score >= 80) return "B";
    if (score >= 60) return "C+";
    if (score >= 40) return "C";
    if (score >= 30) return "D";
    return "F";
  }

  // Get color class based on grade
  function getGradeColor(grade: string): string {
    switch (grade[0]) {
      case 'S': return 'text-purple-500 dark:text-purple-400';
      case 'A': return 'text-green-500 dark:text-green-400';
      case 'B': return 'text-blue-500 dark:text-blue-400';
      case 'C': return 'text-yellow-500 dark:text-yellow-400';
      case 'D': return 'text-orange-500 dark:text-orange-400';
      case 'F': return 'text-red-500 dark:text-red-400';
      default: return '';
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
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Fullscreen Controls */}
          {isFullscreen && onExitFullscreen && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExitFullscreen}
            className="bg-background/80 hover:bg-background/90 transition-colors p-1 h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
        <p className="text-muted-foreground">
          {formatDate(new Date(results.date))}
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Score Animation */}
        <div className="relative h-32 mb-8">
              <AnimatePresence>
                {showScoreAnimation && (
                  <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20, 
                  delay: 0.2 
                }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div className="flex items-baseline">
                    <span className="text-5xl md:text-6xl font-bold">{finalScore}</span>
                    <span className="text-xl md:text-2xl ml-2">points</span>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                
                <div className="flex items-center mt-2">
                      <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                      >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground mr-1">Grade:</span>
                      <span className={`text-2xl font-bold ${gradeColor}`}>{grade}</span>
                    </div>
                  </motion.div>
              
              {personalBest !== null && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="ml-6 flex items-center gap-1.5"
                    >
                      <span className="text-sm font-medium text-muted-foreground">Best:</span>
                      <span className="font-medium">{personalBest}</span>
                      {isNewPersonalBest && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          New Best!
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
              )}
          </AnimatePresence>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Performance Score
            </CardTitle>
            <CardDescription>Your typing performance summary</CardDescription>
          </CardHeader>
          <CardContent>
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
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Button 
            onClick={onRestart} 
            size="lg" 
            className="gap-2 px-5"
          >
            <RefreshCw className="h-4 w-4" />
            New Test
          </Button>
          
          <Button 
            onClick={handleShareResults} 
            variant="outline" 
            size="lg" 
            className="gap-2 px-5"
          >
            <Share2 className="h-4 w-4" />
            {isCopied ? "Copied!" : "Share Results"}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="gap-2 px-5"
            asChild
          >
            <a href="/">
              <Home className="h-4 w-4" />
              Home
            </a>
          </Button>
      </div>
      
        {/* Cloud Save Status */}
        {user && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            {isSavingToCloud ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Saving results to your profile...
              </div>
            ) : savedToCloud ? (
              <div className="flex items-center justify-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                Results saved to your profile
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
