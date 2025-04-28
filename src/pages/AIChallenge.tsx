import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Bot, ChevronRight, Zap, RefreshCw, Clock, AlarmClock, CheckCircle, XCircle, Trophy, Settings, Flame } from "lucide-react";
import { useTypingTest } from "@/hooks/useTypingTest";
import { useTypingStats } from "@/context/TypingStatsContext";
import { TestResults } from "@/components/TestResults";
import { calculateWPM, calculateAccuracy, ChallengeType } from "@/utils/textGenerator";
import { ThemeProvider } from "@/context/ThemeContext";
import { CharacterDisplay } from "@/components/typing/CharacterDisplay";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { TestControls } from "@/components/typing/TestControls";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Define AI difficulty levels
const AI_DIFFICULTY_LEVELS = [
  { value: "adaptive", label: "Adaptive AI", description: "Difficulty adapts to your skill level" },
  { value: "beginner", label: "Easy", description: "Simple vocabulary, shorter passages" },
  { value: "intermediate", label: "Medium", description: "Moderate vocabulary and length" },
  { value: "advanced", label: "Hard", description: "Complex vocabulary, longer passages" },
  { value: "expert", label: "Expert", description: "Technical terms, challenging patterns" },
  { value: "code", label: "Coding", description: "Programming snippets and syntax" }
];

// Interface for challenge data
interface ChallengeData {
  id: number;
  difficulty: ChallengeType | "adaptive";
  text: string;
  completed: boolean;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

const AIChallenge = () => {
  const [activeTab, setActiveTab] = useState("challenge");
  const [aiDifficulty, setAiDifficulty] = useState<ChallengeType | "adaptive">("adaptive");
  const [adaptiveLevel, setAdaptiveLevel] = useState(50);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [userInput, setUserInput] = useState("");
  const [charStates, setCharStates] = useState<Array<"neutral" | "correct" | "incorrect" | "current">>([]);
  const [aiPersonality, setAiPersonality] = useState("coach");
  const [challengeHistory, setChallengeHistory] = useState<ChallengeData[]>([]);
  const [skillLevel, setSkillLevel] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [enableTimePressure, setEnableTimePressure] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  
  // Use the existing typing test hook, but we'll modify its behavior
  const {
    text,
    isRunning,
    isPaused,
    testComplete,
    results,
    startTest,
    restartTest,
    endTest,
    handleInputChange,
    handleFocus,
    handleBlur,
    pauseTest,
    resumeTest,
    elapsedTime
  } = useTypingTest();
  
  // Load saved challenges from localStorage on component mount
  useEffect(() => {
    const savedChallenges = localStorage.getItem("aiChallenges");
    if (savedChallenges) {
      setChallengeHistory(JSON.parse(savedChallenges));
    }
    
    const savedStreak = localStorage.getItem("aiChallengeStreak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    
    const savedBestStreak = localStorage.getItem("aiChallengeBestStreak");
    if (savedBestStreak) {
      setBestStreak(parseInt(savedBestStreak));
    }
    
    // Calculate skill level based on past performance
    if (savedChallenges) {
      const completedChallenges = JSON.parse(savedChallenges).filter((c: ChallengeData) => c.completed);
      if (completedChallenges.length > 0) {
        const avgWpm = completedChallenges.reduce((sum: number, c: ChallengeData) => sum + c.wpm, 0) / completedChallenges.length;
        const avgAccuracy = completedChallenges.reduce((sum: number, c: ChallengeData) => sum + c.accuracy, 0) / completedChallenges.length;
        
        // Simple formula to calculate skill level (0-100)
        const calculatedSkill = Math.min(100, (avgWpm * (avgAccuracy / 100)) / 1.5);
        setSkillLevel(Math.round(calculatedSkill));
      }
    }
  }, []);
  
  // Update localStorage whenever challenges change
  useEffect(() => {
    if (challengeHistory.length > 0) {
      localStorage.setItem("aiChallenges", JSON.stringify(challengeHistory));
    }
  }, [challengeHistory]);
  
  // Update streak in localStorage
  useEffect(() => {
    localStorage.setItem("aiChallengeStreak", streak.toString());
    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem("aiChallengeBestStreak", streak.toString());
    }
  }, [streak, bestStreak]);
  
  // Timer effect for the challenge
  useEffect(() => {
    if (isRunning && !isPaused && currentChallenge && !testComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            completeChallenge();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, currentChallenge, testComplete]);
  
  // Generate a new AI challenge based on the current difficulty setting
  const generateChallenge = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call - in a real implementation, this would call your backend
      const difficultySetting = aiDifficulty === "adaptive" 
        ? determineAdaptiveDifficulty()
        : aiDifficulty;
        
      // Generate challenge text (simplified for this implementation)
      let challengeText = "";
      
      // Simulated challenge text generation based on difficulty
      switch (difficultySetting) {
        case "beginner":
          challengeText = "The quick brown fox jumps over the lazy dog. Type this sentence to improve your speed and accuracy with common English phrases.";
          break;
        case "intermediate":
          challengeText = "Typing proficiency is an essential skill in the digital age. Regular practice can significantly improve your speed and accuracy, leading to increased productivity.";
          break;
        case "advanced":
          challengeText = "The intricate relationship between technology and human cognitive development presents fascinating questions about neuroplasticity and our adaptability to rapidly evolving digital interfaces.";
          break;
        case "expert":
          challengeText = "The quintessential conundrum of artificial intelligence development lies in balancing algorithmic efficiency with ethical considerations, particularly regarding autonomous decision-making in unpredictable scenarios.";
          break;
        case "code":
          challengeText = "function calculateFactorial(n) {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(n - 1);\n}\n\nconst result = calculateFactorial(5);\nconsole.log(result); // 120";
          break;
        default:
          challengeText = "Welcome to the AI Challenge! Type this text to begin your typing journey with adaptive challenges that respond to your skill level.";
      }
      
      // Create new challenge
      const newChallenge: ChallengeData = {
        id: Date.now(),
        difficulty: difficultySetting,
        text: challengeText,
        completed: false,
        wpm: 0,
        accuracy: 0,
        timestamp: Date.now()
      };
      
      // Set as current challenge
      setCurrentChallenge(newChallenge);
      setChallenges(prev => [...prev, newChallenge]);
      
      // Reset UI state
      setUserInput("");
      setRemainingTime(60);
      setCharStates(challengeText.split("").map((_, i) => i === 0 ? "current" : "neutral"));
      setShowResults(false);
      
      // Focus input after a short delay
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        title: "Challenge Generation Failed",
        description: "Unable to generate a new challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Determine adaptive difficulty based on user's skill level
  const determineAdaptiveDifficulty = (): ChallengeType => {
    if (adaptiveLevel < 25) return "beginner";
    if (adaptiveLevel < 50) return "intermediate";
    if (adaptiveLevel < 75) return "advanced";
    if (adaptiveLevel < 90) return "expert";
    return "code";
  };
  
  // Handle user input during the challenge
  const handleChallengeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentChallenge || testComplete) return;
    
    const inputValue = e.target.value;
    setUserInput(inputValue);
    
    // Update character states
    const newCharStates = currentChallenge.text.split("").map((char, index) => {
      if (index >= inputValue.length) return index === inputValue.length ? "current" : "neutral";
      return char === inputValue[index] ? "correct" : "incorrect";
    });
    
    setCharStates(newCharStates);
    
    // Check if challenge is complete
    if (inputValue.length === currentChallenge.text.length) {
      completeChallenge();
    }
    
    // Start the test if it's not running
    if (!isRunning) {
      startTest();
    }
  };
  
  // Complete the current challenge and calculate results
  const completeChallenge = () => {
    if (!currentChallenge) return;
    
    // Stop the timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate results
    const totalChars = currentChallenge.text.length;
    const typed = userInput.length;
    const correct = userInput.split("").reduce((count, char, i) => 
      i < totalChars && char === currentChallenge.text[i] ? count + 1 : count, 0);
    
    const wpm = calculateWPM(typed, correct, 60 - remainingTime);
    const accuracy = calculateAccuracy(typed, correct);
    
    // Update challenge with results
    const completedChallenge: ChallengeData = {
      ...currentChallenge,
      completed: true,
      wpm,
      accuracy,
      timestamp: Date.now()
    };
    
    // Update state
    setCurrentChallenge(completedChallenge);
    setChallenges(prev => prev.map(c => 
      c.id === completedChallenge.id ? completedChallenge : c
    ));
    setChallengeHistory(prev => [...prev, completedChallenge]);
    setShowResults(true);
    
    // Update streak
    if (accuracy >= 90) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    // Update skill level based on performance
    const performanceFactor = (wpm * (accuracy / 100)) / 150; // Normalized to 0-1 range
    setSkillLevel(prev => {
      const newSkill = Math.max(0, Math.min(100, prev + (performanceFactor * 10 - 5)));
      return Math.round(newSkill);
    });
    
    // Recalculate adaptive level
    setAdaptiveLevel(skillLevel);
    
    // Call the endTest function from the hook
    endTest();
    
    // Show toast with results
    toast({
      title: "Challenge Complete!",
      description: `WPM: ${wpm} | Accuracy: ${accuracy}%`,
      variant: "default"
    });
  };
  
  // Start a new challenge
  const startChallenge = () => {
    generateChallenge();
  };
  
  // Restart the current challenge
  const restartCurrentChallenge = () => {
    if (!currentChallenge) return;
    
    // Reset state
    setUserInput("");
    setRemainingTime(60);
    setCharStates(currentChallenge.text.split("").map((_, i) => i === 0 ? "current" : "neutral"));
    setShowResults(false);
    
    // Focus input
    if (inputRef.current) inputRef.current.focus();
    
    // Restart the typing test
    restartTest();
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <div className="flex-grow container mx-auto px-4 py-6 md:py-8">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center mb-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full text-sm text-primary font-medium shadow-sm mb-4">
                <Brain className="h-4 w-4" />
                <span>AI-Powered Challenges</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="gradient-heading">AI Challenge</span> Mode
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Face off against AI-generated typing challenges that adapt to your skill level.
                Complete challenges to improve your streak and skill rating.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label>Skill Level</Label>
                      <Badge variant="outline">{skillLevel}/100</Badge>
                    </div>
                    <Progress value={skillLevel} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Streak</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {streak}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Best Streak</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {bestStreak}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Challenges Completed</span>
                    <Badge variant="secondary">{challengeHistory.length}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Difficulty</Label>
                    <Select
                      value={aiDifficulty}
                      onValueChange={(value) => setAiDifficulty(value as ChallengeType | "adaptive")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_DIFFICULTY_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex flex-col">
                              <span>{level.label}</span>
                              <span className="text-xs text-muted-foreground">{level.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {aiDifficulty === "adaptive" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Adaptive Level</Label>
                        <span className="text-sm text-muted-foreground">{adaptiveLevel}%</span>
                      </div>
                      <Slider
                        value={[adaptiveLevel]}
                        onValueChange={(value) => setAdaptiveLevel(value[0])}
                        min={0}
                        max={100}
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Easier</span>
                        <span>Harder</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="time-pressure" className="flex flex-col">
                      <span>Time Pressure</span>
                      <span className="font-normal text-xs text-muted-foreground">Add a countdown timer</span>
                    </Label>
                    <Switch
                      id="time-pressure"
                      checked={enableTimePressure}
                      onCheckedChange={setEnableTimePressure}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card className="mb-4">
                <CardContent className="p-6">
                  {!currentChallenge ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                      <div className="text-center space-y-3">
                        <Bot className="h-12 w-12 mx-auto text-primary opacity-90" />
                        <h3 className="text-xl font-semibold">Ready for an AI Challenge?</h3>
                        <p className="text-muted-foreground max-w-md">
                          Test your typing skills against AI-generated challenges that adapt to your ability.
                          Complete challenges to increase your streak and skill level.
                        </p>
                      </div>
                      
                      <Button
                        onClick={startChallenge}
                        disabled={isGenerating}
                        size="lg"
                        className="gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Generating Challenge...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Start AI Challenge
                          </>
                        )}
                      </Button>
                    </div>
                  ) : showResults ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Challenge Results</h3>
                        <Badge variant={currentChallenge.accuracy >= 95 ? "success" : 
                               currentChallenge.accuracy >= 80 ? "warning" : "destructive"}>
                          {currentChallenge.accuracy}% Accuracy
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl font-bold mb-2">{currentChallenge.wpm}</div>
                            <div className="text-muted-foreground">Words Per Minute</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6 flex flex-col items-center justify-center">
                            <div className="text-5xl font-bold mb-2">{60 - remainingTime}s</div>
                            <div className="text-muted-foreground">Completion Time</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={startChallenge} className="gap-2">
                          <RefreshCw className="h-4 w-4" />
                          New Challenge
                        </Button>
                        <Button onClick={restartCurrentChallenge} variant="outline" className="gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Retry Challenge
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {AI_DIFFICULTY_LEVELS.find(d => d.value === currentChallenge.difficulty)?.label || "Challenge"}
                          </Badge>
                          
                          {enableTimePressure && (
                            <Badge variant={remainingTime > 30 ? "success" : remainingTime > 10 ? "warning" : "destructive"} 
                              className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {remainingTime}s
                            </Badge>
                          )}
                        </div>
                        
                        <Button variant="ghost" size="sm" onClick={pauseTest}>
                          {isPaused ? "Resume" : "Pause"}
                        </Button>
                      </div>
                      
                      <div className="bg-card/50 border rounded-md p-4 font-mono text-base leading-relaxed">
                        {currentChallenge.text.split("").map((char, i) => (
                          <span 
                            key={i} 
                            className={
                              charStates[i] === "correct" ? "text-success" :
                              charStates[i] === "incorrect" ? "text-destructive" :
                              charStates[i] === "current" ? "text-primary border-b-2 border-primary animate-pulse" :
                              "text-muted-foreground"
                            }
                          >
                            {char === "\n" ? "↵\n" : char}
                          </span>
                        ))}
                      </div>
                      
                      <Textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={handleChallengeInput}
                        placeholder="Start typing here..."
                        className="font-mono h-32 resize-none"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        disabled={isPaused}
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {userInput.length} / {currentChallenge.text.length} characters
                        </div>
                        
                        <Button 
                          onClick={completeChallenge} 
                          size="sm" 
                          variant="outline"
                          className="gap-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Skip
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {challengeHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge History</CardTitle>
                    <CardDescription>Your recent AI challenges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {challengeHistory.slice().reverse().map((challenge) => (
                        <div 
                          key={challenge.id} 
                          className="flex justify-between items-center p-3 rounded-md border bg-card/60 hover:bg-card/90 transition-colors"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {AI_DIFFICULTY_LEVELS.find(d => d.value === challenge.difficulty)?.label || "Challenge"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(challenge.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-1 text-xs line-clamp-1 text-muted-foreground max-w-sm">
                              {challenge.text}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                              <span className="font-semibold">{challenge.wpm} WPM</span>
                              <span className="text-xs text-muted-foreground">{challenge.accuracy}% accuracy</span>
                            </div>
                            {challenge.accuracy >= 95 ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : challenge.accuracy < 80 ? (
                              <XCircle className="h-5 w-5 text-destructive" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AIChallenge; 