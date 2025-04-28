import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  Keyboard, 
  BarChart2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info,
  TrendingUp,
  Timer,
  Target,
  Fingerprint,
  Activity,
  Lightbulb,
  BarChart,
  LineChart,
  ArrowDownRight,
  ArrowUpRight,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypingStats } from "@/context/TypingStatsContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TypingHeatmapProps {
  errorData?: Record<string, number>;
  className?: string;
}

export function TypingHeatmap({ errorData = {}, className }: TypingHeatmapProps) {
  const [selectedView, setSelectedView] = useState<'characters' | 'statistics' | 'keyboard' | 'insights'>('characters');
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>(errorData);
  const [isRealData, setIsRealData] = useState(false);
  const [errorHistory, setErrorHistory] = useState<Array<{date: number, count: number}>>([]);
  const { stats } = useTypingStats();
  
  // Sample data for demonstration purposes
  const sampleData = {
    'a': 12,
    's': 18,
    'd': 7,
    'f': 23,
    'g': 9,
    't': 15,
    'r': 11,
    'e': 5,
    'w': 10,
    'i': 8,
    'o': 6,
    'n': 14,
    'h': 17,
    'l': 8,
    'y': 13,
    'u': 9
  };

  useEffect(() => {
    // First check if there's data passed via props
    if (errorData && Object.keys(errorData).length > 0) {
      setHeatmapData(errorData);
      setIsRealData(true);
    } 
    // Then check if there's data available in the context
    else if (stats.errorData && Object.keys(stats.errorData).length > 0) {
      setHeatmapData(stats.errorData);
      setIsRealData(true);
    }
    // Otherwise use sample data for demonstration
    else {
      setHeatmapData(sampleData);
      setIsRealData(false);
    }
  }, [errorData, stats.errorData]);

  useEffect(() => {
    try {
      // Load error history from localStorage
      const storedHistory = localStorage.getItem("typingErrorHistory");
      let history: Array<{date: number, count: number}> = storedHistory ? JSON.parse(storedHistory) : [];
      
      // Check if we need to add a new entry (current day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      
      // Get total error count from current data
      const totalErrors = Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
      
      if (totalErrors > 0) {
        // Check if we already have an entry for today
        const existingEntryIndex = history.findIndex(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === todayTimestamp;
        });
        
        if (existingEntryIndex >= 0) {
          // Update today's entry
          history[existingEntryIndex].count = totalErrors;
        } else {
          // Add new entry for today
          history.push({
            date: todayTimestamp,
            count: totalErrors
          });
        }
        
        // Keep only last 14 days
        if (history.length > 14) {
          history = history.sort((a, b) => b.date - a.date).slice(0, 14);
        }
        
        // Save back to localStorage
        localStorage.setItem("typingErrorHistory", JSON.stringify(history));
      }
      
      // Sort history by date (oldest first for charting)
      setErrorHistory(history.sort((a, b) => a.date - b.date));
      
    } catch (error) {
      console.error("Error loading/saving error history:", error);
    }
  }, [heatmapData]);

  const errorTrend = useMemo(() => {
    if (errorHistory.length < 2) return { trend: 'neutral', percentage: 0 };
    
    // Get the first and last entries
    const first = errorHistory[0];
    const last = errorHistory[errorHistory.length - 1];
    
    // Calculate change percentage
    const change = first.count > 0 
      ? ((last.count - first.count) / first.count) * 100 
      : 0;
    
    // Determine trend
    let trend: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (change < -5) trend = 'positive'; // Fewer errors is positive
    else if (change > 5) trend = 'negative'; // More errors is negative
    
    return {
      trend,
      percentage: Math.abs(Math.round(change))
    };
  }, [errorHistory]);

  // Get the most problematic keys (top 8)
  const problemKeys = useMemo(() => {
    return Object.entries(heatmapData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [heatmapData]);

  // Calculate max errors for color scaling
  const maxErrors = useMemo(() => {
    return Math.max(...Object.values(heatmapData), 1);
  }, [heatmapData]);

  // Calculate categories of problematic keys
  const keyCategories = useMemo(() => {
    const leftHandKeys = "qwertasdfgzxcv".split("");
    const rightHandKeys = "yuiophjklbnm".split("");
    const upperRowKeys = "qwertyuiop".split("");
    const homeRowKeys = "asdfghjkl".split("");
    const lowerRowKeys = "zxcvbnm".split("");
    const numberRowKeys = "1234567890".split("");
    
    // Count errors for each category
    const leftHandErrors = Object.entries(heatmapData)
      .filter(([key]) => leftHandKeys.includes(key.toLowerCase()))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const rightHandErrors = Object.entries(heatmapData)
      .filter(([key]) => rightHandKeys.includes(key.toLowerCase()))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const upperRowErrors = Object.entries(heatmapData)
      .filter(([key]) => upperRowKeys.includes(key.toLowerCase()))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const homeRowErrors = Object.entries(heatmapData)
      .filter(([key]) => homeRowKeys.includes(key.toLowerCase()))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const lowerRowErrors = Object.entries(heatmapData)
      .filter(([key]) => lowerRowKeys.includes(key.toLowerCase()))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const numberRowErrors = Object.entries(heatmapData)
      .filter(([key]) => numberRowKeys.includes(key))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const totalErrors = Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
    
    // Calculate finger assignments (approximate)
    const leftPinkyKeys = "qaz1`".split("");
    const leftRingKeys = "wsx2".split("");
    const leftMiddleKeys = "edc3".split("");
    const leftIndexKeys = "rfvtgb45".split("");
    const rightIndexKeys = "yhnujm67".split("");
    const rightMiddleKeys = "ik8".split("");
    const rightRingKeys = "ol9".split("");
    const rightPinkyKeys = "p;['\\/0-=".split("");
    
    const fingerErrors = {
      leftPinky: Object.entries(heatmapData)
        .filter(([key]) => leftPinkyKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      leftRing: Object.entries(heatmapData)
        .filter(([key]) => leftRingKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      leftMiddle: Object.entries(heatmapData)
        .filter(([key]) => leftMiddleKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      leftIndex: Object.entries(heatmapData)
        .filter(([key]) => leftIndexKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      rightIndex: Object.entries(heatmapData)
        .filter(([key]) => rightIndexKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      rightMiddle: Object.entries(heatmapData)
        .filter(([key]) => rightMiddleKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      rightRing: Object.entries(heatmapData)
        .filter(([key]) => rightRingKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      rightPinky: Object.entries(heatmapData)
        .filter(([key]) => rightPinkyKeys.includes(key.toLowerCase()))
        .reduce((sum, [_, count]) => sum + count, 0),
      thumbs: Object.entries(heatmapData)
        .filter(([key]) => key.toLowerCase() === " ")
        .reduce((sum, [_, count]) => sum + count, 0),
    };
    
    // Find the most problematic finger
    const mostProblematicFinger = Object.entries(fingerErrors)
      .sort((a, b) => b[1] - a[1])[0];
    
    return {
      leftHand: { 
        errors: leftHandErrors, 
        percentage: totalErrors ? Math.round((leftHandErrors / totalErrors) * 100) : 0 
      },
      rightHand: { 
        errors: rightHandErrors, 
        percentage: totalErrors ? Math.round((rightHandErrors / totalErrors) * 100) : 0 
      },
      upperRow: { 
        errors: upperRowErrors, 
        percentage: totalErrors ? Math.round((upperRowErrors / totalErrors) * 100) : 0 
      },
      homeRow: { 
        errors: homeRowErrors, 
        percentage: totalErrors ? Math.round((homeRowErrors / totalErrors) * 100) : 0 
      },
      lowerRow: { 
        errors: lowerRowErrors, 
        percentage: totalErrors ? Math.round((lowerRowErrors / totalErrors) * 100) : 0 
      },
      numberRow: {
        errors: numberRowErrors,
        percentage: totalErrors ? Math.round((numberRowErrors / totalErrors) * 100) : 0
      },
      total: totalErrors,
      fingerErrors,
      mostProblematicFinger: mostProblematicFinger?.[0] || null
    };
  }, [heatmapData]);

  // Get personalized insights based on error patterns
  const typingInsights = useMemo(() => {
    const insights = [];
    
    // Only provide detailed insights for real data
    if (isRealData) {
      // Hand balance issues
      const handDifference = Math.abs(keyCategories.leftHand.percentage - keyCategories.rightHand.percentage);
      if (handDifference > 20) {
        const weakerHand = keyCategories.leftHand.percentage > keyCategories.rightHand.percentage 
          ? "right" : "left";
        insights.push({
          id: "hand-balance",
          icon: <Fingerprint className="h-4 w-4 text-blue-500" />,
          title: `${weakerHand.charAt(0).toUpperCase() + weakerHand.slice(1)} Hand Accuracy`,
          description: `Your ${weakerHand} hand has fewer errors. Consider practicing more with your ${weakerHand === "right" ? "left" : "right"} hand.`,
          priority: 1
        });
      }
      
      // Row issues
      if (keyCategories.upperRow.percentage > 40) {
        insights.push({
          id: "upper-row",
          icon: <Target className="h-4 w-4 text-indigo-500" />,
          title: "Upper Row Challenges",
          description: "You're making many errors on the upper row. Practice reaching up without looking at the keyboard.",
          priority: 2
        });
      } else if (keyCategories.lowerRow.percentage > 40) {
        insights.push({
          id: "lower-row",
          icon: <Target className="h-4 w-4 text-indigo-500" />,
          title: "Lower Row Challenges",
          description: "You're making many errors on the lower row. Try positioning your hands to reach these keys more comfortably.",
          priority: 2
        });
      } else if (keyCategories.homeRow.percentage > 40) {
        insights.push({
          id: "home-row",
          icon: <Target className="h-4 w-4 text-indigo-500" />,
          title: "Home Row Challenges",
          description: "You're making many errors on the home row. Focus on proper finger positioning for these frequently used keys.",
          priority: 2
        });
      }
      
      // Finger-specific insights
      if (keyCategories.mostProblematicFinger) {
        const fingerNames = {
          leftPinky: "Left Pinky",
          leftRing: "Left Ring Finger",
          leftMiddle: "Left Middle Finger",
          leftIndex: "Left Index Finger",
          rightIndex: "Right Index Finger",
          rightMiddle: "Right Middle Finger",
          rightRing: "Right Ring Finger",
          rightPinky: "Right Pinky",
          thumbs: "Thumbs"
        };
        
        const fingerName = fingerNames[keyCategories.mostProblematicFinger as keyof typeof fingerNames];
        
        if (fingerName && keyCategories.fingerErrors[keyCategories.mostProblematicFinger] > 5) {
          insights.push({
            id: "finger-issue",
            icon: <Fingerprint className="h-4 w-4 text-pink-500" />,
            title: `${fingerName} Accuracy`,
            description: `Your ${fingerName.toLowerCase()} is making more errors than others. Focus on exercises that strengthen this finger.`,
            priority: 2
          });
        }
      }
      
      // Add general insights if we have enough data
      if (keyCategories.total > 20) {
        insights.push({
          id: "slow-down",
          icon: <Timer className="h-4 w-4 text-amber-500" />,
          title: "Accuracy First",
          description: "Slow down slightly to improve accuracy before working on speed.",
          priority: 3
        });
      }
    }
    
    // If no specific insights, add general tips
    if (insights.length === 0) {
      insights.push({
        id: "practice",
        icon: <Activity className="h-4 w-4 text-green-500" />,
        title: "Consistent Practice",
        description: "Keep practicing consistently to build muscle memory.",
        priority: 3
      });
      
      insights.push({
        id: "rhythm",
        icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
        title: "Rhythm Matters",
        description: "Try to maintain a steady rhythm while typing.",
        priority: 3
      });
    }
    
    // Sort insights by priority
    return insights.sort((a, b) => a.priority - b.priority);
  }, [keyCategories, isRealData]);

  // Get improvement tips based on analysis
  const improvementTips = useMemo(() => {
    const tips = [
      {
        id: "problem-keys",
        icon: <Target className="h-4 w-4 text-red-500" />,
        title: "Target Problem Keys",
        description: "Practice problematic keys with focused exercises"
      },
      {
        id: "finger-position",
        icon: <Fingerprint className="h-4 w-4 text-blue-500" />,
        title: "Finger Positioning",
        description: "Pay attention to finger positioning for commonly mistyped keys"
      },
      {
        id: "slow-down",
        icon: <Timer className="h-4 w-4 text-amber-500" />,
        title: "Accuracy Over Speed",
        description: "Try slowing down to increase accuracy before building speed"
      },
      {
        id: "practice-modes",
        icon: <Target className="h-4 w-4 text-purple-500" />,
        title: "Targeted Practice",
        description: "Use specialized practice modes to target your weak spots"
      },
      {
        id: "daily-practice",
        icon: <Activity className="h-4 w-4 text-green-500" />,
        title: "Consistent Practice",
        description: "Set aside 10-15 minutes daily for deliberate practice"
      }
    ];
    
    // Add specific tips based on analysis if we have real data
    if (isRealData && problemKeys.length > 0) {
      const problemKeysStr = problemKeys.slice(0, 3).map(([key]) => key).join(", ");
      tips.unshift({
        id: "specific-keys",
        icon: <Keyboard className="h-4 w-4 text-primary" />,
        title: "Focus on Specific Keys",
        description: `Practice these keys especially: ${problemKeysStr}`
      });
    }
    
    return tips;
  }, [isRealData, problemKeys]);

  // Generate personalized practice exercises based on error patterns
  const personalizedExercises = useMemo(() => {
    const exercises = [];
    
    if (!isRealData || Object.keys(heatmapData).length === 0) {
      return [
        {
          id: "general-practice",
          title: "Basic Finger Positioning",
          description: "Practice home row key positions (asdf jkl;) to build muscle memory",
          example: "asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj",
          difficulty: "beginner"
        },
        {
          id: "common-patterns",
          title: "Common Word Patterns",
          description: "Practice common letter combinations in English",
          example: "the and that with have this from they",
          difficulty: "beginner"
        }
      ];
    }
    
    // Get the top 4 problem keys
    const topProblemKeys = Object.entries(heatmapData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key]) => key);
    
    // If we have problem keys, create targeted exercises
    if (topProblemKeys.length > 0) {
      const problemKeysStr = topProblemKeys.join('');
      
      // Create an exercise focusing on problem keys
      exercises.push({
        id: "problem-keys",
        title: `Problem Keys: ${topProblemKeys.join(', ')}`,
        description: `Focus practice on your most problematic keys`,
        example: generatePracticeSequence(topProblemKeys),
        difficulty: "targeted"
      });
      
      // Add specific hand exercise if needed
      if (keyCategories.leftHand.percentage > 65) {
        exercises.push({
          id: "left-hand-focus",
          title: "Left Hand Focus",
          description: "Strengthen your left hand typing with this exercise",
          example: "qwert asdfg zxcvb qa ws ed rf tg",
          difficulty: "intermediate"
        });
      } else if (keyCategories.rightHand.percentage > 65) {
        exercises.push({
          id: "right-hand-focus",
          title: "Right Hand Focus",
          description: "Strengthen your right hand typing with this exercise",
          example: "yuiop hjkl; bnm, yh uj ik ol p;",
          difficulty: "intermediate"
        });
      }
      
      // Add row-specific exercise if needed
      if (keyCategories.upperRow.percentage > 40) {
        exercises.push({
          id: "upper-row-practice",
          title: "Upper Row Practice",
          description: "Improve accuracy on the top row of keys",
          example: "qwerty uiop qwerty uiop qwer tyui opqw",
          difficulty: "intermediate"
        });
      } else if (keyCategories.homeRow.percentage > 40) {
        exercises.push({
          id: "home-row-practice",
          title: "Home Row Precision",
          description: "Improve accuracy on the home row keys",
          example: "asdf ghjkl; asdf ghjkl; asdsa ;lkjg fdsa",
          difficulty: "beginner"
        });
      } else if (keyCategories.lowerRow.percentage > 40) {
        exercises.push({
          id: "lower-row-practice",
          title: "Lower Row Practice",
          description: "Improve accuracy on the bottom row of keys",
          example: "zxcvb nm, zxcvb nm, zx cv bn m, zxc vbn m,",
          difficulty: "advanced"
        });
      }
      
      // Add a finger-specific exercise if applicable
      if (keyCategories.mostProblematicFinger) {
        const fingerMapping: Record<string, {keys: string[], name: string}> = {
          leftPinky: { keys: ['q', 'a', 'z'], name: "Left Pinky" },
          leftRing: { keys: ['w', 's', 'x'], name: "Left Ring" },
          leftMiddle: { keys: ['e', 'd', 'c'], name: "Left Middle" },
          leftIndex: { keys: ['r', 'f', 'v', 't', 'g', 'b'], name: "Left Index" },
          rightIndex: { keys: ['y', 'h', 'n', 'u', 'j', 'm'], name: "Right Index" },
          rightMiddle: { keys: ['i', 'k', ','], name: "Right Middle" },
          rightRing: { keys: ['o', 'l', '.'], name: "Right Ring" },
          rightPinky: { keys: ['p', ';', '/', '[', ']', "'"], name: "Right Pinky" }
        };
        
        const fingerInfo = fingerMapping[keyCategories.mostProblematicFinger];
        if (fingerInfo) {
          exercises.push({
            id: `${keyCategories.mostProblematicFinger}-practice`,
            title: `${fingerInfo.name} Finger Practice`,
            description: `Strengthen your ${fingerInfo.name.toLowerCase()} finger accuracy`,
            example: generateFingerPractice(fingerInfo.keys),
            difficulty: "targeted"
          });
        }
      }
    }
    
    // Add a rhythm exercise for everyone
    exercises.push({
      id: "rhythm-practice",
      title: "Typing Rhythm Exercise",
      description: "Practice maintaining a steady rhythm while typing",
      example: "the quick brown fox jumps over the lazy dog",
      difficulty: "all-levels"
    });
    
    return exercises;
  }, [heatmapData, isRealData, keyCategories]);
  
  // Helper function to generate practice sequences
  function generatePracticeSequence(keys: string[]): string {
    if (keys.length === 0) return "";
    
    // Mix the problem keys with common letters
    const commonLetters = "etaoin shrdlu";
    const sequence = keys.join(' ') + ' ' + 
      keys.map(k => k + k + k).join(' ') + ' ' + 
      keys.map(k => k + commonLetters.charAt(Math.floor(Math.random() * commonLetters.length))).join(' ');
    
    return sequence;
  }
  
  // Helper function to generate finger-specific practice
  function generateFingerPractice(keys: string[]): string {
    if (keys.length === 0) return "";
    
    const sequences = [
      keys.join(' '),
      keys.map(k => k + k + k).join(' '),
      keys.map((k, i) => k + keys[(i + 1) % keys.length]).join(' ')
    ];
    
    return sequences.join(' ');
  }

  // Get color intensity based on error count
  const getHeatColor = (errors: number) => {
    const intensity = Math.min(0.9, errors / maxErrors * 0.9);
    return `rgba(255, 59, 48, ${intensity + 0.1})`;
  };

  const getKeySize = (errors: number) => {
    const baseSize = 40;
    const maxSize = 60;
    const size = baseSize + (errors / maxErrors) * (maxSize - baseSize);
    return Math.min(maxSize, size);
  };

  const hasData = Object.keys(heatmapData).length > 0;
  
  // Set up keyboard layout for visualization
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <TooltipProvider>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Typing Analysis
          </CardTitle>
          <CardDescription>Visualize your typing patterns and track improvement areas</CardDescription>
        </CardHeader>
        
        <CardContent>
          {!isRealData && (
            <div className="mb-3 p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm rounded-md flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Sample data shown. Complete typing tests to see your actual statistics.</span>
            </div>
          )}
        
          <Tabs value={selectedView} onValueChange={(val) => setSelectedView(val as any)}>
            <TabsList className="mb-4 grid grid-cols-4 w-full">
              <TabsTrigger value="characters">Heatmap</TabsTrigger>
              <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="characters" className="mt-0">
              <div className="h-[220px] bg-muted/50 rounded-md p-4 flex items-center justify-center relative">
                {hasData ? (
                  <div className="flex flex-wrap justify-center gap-2 max-w-[600px]">
                    {Object.entries(heatmapData).map(([key, errors]) => (
                      <div 
                        key={key}
                        className="relative flex items-center justify-center rounded-md font-mono font-bold uppercase transform hover:scale-105 transition-transform cursor-pointer"
                        style={{
                          backgroundColor: getHeatColor(errors),
                          width: `${getKeySize(errors)}px`,
                          height: `${getKeySize(errors)}px`,
                        }}
                      >
                        <span className="text-white mix-blend-difference">{key}</span>
                        <span className="absolute -top-1 -right-1 text-xs bg-background text-foreground rounded-full w-4 h-4 flex items-center justify-center">
                          {errors}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No error data available yet. Complete typing tests to see your results.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => window.location.hash = "#/typing-test"}
                    >
                      Take a typing test
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-1.5">
                <span className="text-xs font-medium">Heat scale:</span>
                <div className="flex">
                  <div className="w-5 h-3 bg-red-100 rounded-l-sm"></div>
                  <div className="w-5 h-3 bg-red-200"></div>
                  <div className="w-5 h-3 bg-red-300"></div>
                  <div className="w-5 h-3 bg-red-400"></div>
                  <div className="w-5 h-3 bg-red-500"></div>
                  <div className="w-5 h-3 bg-red-600"></div>
                  <div className="w-5 h-3 bg-red-700 rounded-r-sm"></div>
                </div>
                <span className="text-xs text-muted-foreground">More errors</span>
              </div>
            </TabsContent>
            
            <TabsContent value="keyboard" className="mt-0">
              <div className="h-[220px] bg-muted/50 rounded-md p-4 flex flex-col items-center justify-center gap-1 relative">
                {hasData ? (
                  <div className="flex flex-col gap-1">
                    {keyboardRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-1">
                        {rowIndex === 1 && <div className="w-6"></div>}
                        {row.map(key => {
                          const errors = heatmapData[key] || 0;
                          const heatColor = getHeatColor(errors);
                          return (
                            <TooltipProvider key={key}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className="w-10 h-10 rounded flex items-center justify-center font-mono font-medium uppercase bg-background/80 border border-border/50 shadow-sm cursor-pointer"
                                    style={{
                                      backgroundColor: errors > 0 ? heatColor : undefined,
                                    }}
                                  >
                                    <span className={errors > 0 ? "text-white mix-blend-difference" : ""}>{key}</span>
                                    {errors > 0 && (
                                      <span className="absolute -top-1 -right-1 text-xs bg-background text-foreground rounded-full w-4 h-4 flex items-center justify-center">
                                        {errors}
                                      </span>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <div className="text-xs">
                                    {errors > 0 ? `${errors} errors with ${key}` : `No errors with ${key}`}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                        {rowIndex === 1 && <div className="w-6"></div>}
                      </div>
                    ))}
                    <div className="flex justify-center mt-1">
                      <div className="w-48 h-10 rounded bg-background/80 border border-border/50 shadow-sm flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">space bar</span>
                        {heatmapData[" "] && heatmapData[" "] > 0 && (
                          <span className="absolute -top-1 -right-1 text-xs bg-background text-foreground rounded-full w-4 h-4 flex items-center justify-center">
                            {heatmapData[" "]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No keyboard data available yet. Complete typing tests to see your results.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => window.location.hash = "#/typing-test"}
                    >
                      Take a typing test
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                  Most Problematic Keys
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {problemKeys.map(([key, errors]) => (
                    <Badge key={key} variant="outline" className="flex gap-1.5">
                      <span className="font-mono bg-primary/10 px-1.5 rounded">{key === " " ? "space" : key}</span>
                      <span>{errors} errors</span>
                    </Badge>
                  ))}
                  {problemKeys.length === 0 && (
                    <span className="text-sm text-muted-foreground">No error data available</span>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Fingerprint className="h-4 w-4 mr-1.5 text-indigo-500" />
                  Finger Heatmap
                </h4>
                
                <div className="flex justify-center items-center gap-4">
                  {/* Left Hand */}
                  <div className="relative">
                    {/* Hand shape background */}
                    <div className="w-36 h-40 bg-background/80 rounded-2xl border border-border/50 flex flex-col items-center pt-3">
                      <div className="text-xs text-muted-foreground mb-1">Left Hand</div>
                      
                      {/* Fingers */}
                      <div className="flex gap-1 justify-center">
                        {['leftPinky', 'leftRing', 'leftMiddle', 'leftIndex'].map(finger => {
                          const errors = keyCategories.fingerErrors[finger] || 0;
                          const intensity = errors > 0 ? Math.min(0.9, errors / maxErrors * 0.9) : 0;
                          const errorColor = `rgba(255, 59, 48, ${intensity + 0.1})`;
                          const percentage = keyCategories.total > 0 ? Math.round((errors / keyCategories.total) * 100) : 0;
                          
                          return (
                            <Tooltip key={finger}>
                              <TooltipTrigger>
                                <div 
                                  className="w-6 h-20 rounded-t-full cursor-pointer"
                                  style={{ backgroundColor: errors > 0 ? errorColor : 'rgba(0,0,0,0.05)' }}
                                >
                                  {errors > 0 && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-white mix-blend-difference">
                                        {percentage}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="text-xs">
                                  <p className="font-medium">{
                                    finger === 'leftPinky' ? 'Left Pinky' :
                                    finger === 'leftRing' ? 'Left Ring' :
                                    finger === 'leftMiddle' ? 'Left Middle' : 'Left Index'
                                  }</p>
                                  <p>{errors} errors ({percentage}%)</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                      
                      {/* Palm */}
                      <div className="w-[95%] h-14 bg-background/50 rounded-b-xl mt-1 border-t border-border/30 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          {keyCategories.leftHand.percentage}% errors
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Hand */}
                  <div className="relative">
                    {/* Hand shape background */}
                    <div className="w-36 h-40 bg-background/80 rounded-2xl border border-border/50 flex flex-col items-center pt-3">
                      <div className="text-xs text-muted-foreground mb-1">Right Hand</div>
                      
                      {/* Fingers */}
                      <div className="flex gap-1 justify-center">
                        {['rightIndex', 'rightMiddle', 'rightRing', 'rightPinky'].map(finger => {
                          const errors = keyCategories.fingerErrors[finger] || 0;
                          const intensity = errors > 0 ? Math.min(0.9, errors / maxErrors * 0.9) : 0;
                          const errorColor = `rgba(255, 59, 48, ${intensity + 0.1})`;
                          const percentage = keyCategories.total > 0 ? Math.round((errors / keyCategories.total) * 100) : 0;
                          
                          return (
                            <Tooltip key={finger}>
                              <TooltipTrigger>
                                <div 
                                  className="w-6 h-20 rounded-t-full cursor-pointer"
                                  style={{ backgroundColor: errors > 0 ? errorColor : 'rgba(0,0,0,0.05)' }}
                                >
                                  {errors > 0 && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-white mix-blend-difference">
                                        {percentage}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="text-xs">
                                  <p className="font-medium">{
                                    finger === 'rightIndex' ? 'Right Index' :
                                    finger === 'rightMiddle' ? 'Right Middle' :
                                    finger === 'rightRing' ? 'Right Ring' : 'Right Pinky'
                                  }</p>
                                  <p>{errors} errors ({percentage}%)</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                      
                      {/* Palm */}
                      <div className="w-[95%] h-14 bg-background/50 rounded-b-xl mt-1 border-t border-border/30 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          {keyCategories.rightHand.percentage}% errors
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Thumbs */}
                {keyCategories.fingerErrors.thumbs > 0 && (
                  <div className="mt-2 flex justify-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="px-4 py-1 bg-background/80 border border-border/50 rounded-full">
                          <span className="text-xs">Thumbs: {keyCategories.fingerErrors.thumbs} errors</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Space bar errors</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-0">
              <div className="space-y-5">
                {hasData && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                        Most Problematic Keys
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {problemKeys.map(([key, errors]) => (
                          <Badge key={key} variant="outline" className="flex gap-1.5">
                            <span className="font-mono bg-primary/10 px-1.5 rounded">{key === " " ? "space" : key}</span>
                            <span>{errors} errors</span>
                          </Badge>
                        ))}
                        {problemKeys.length === 0 && (
                          <span className="text-sm text-muted-foreground">No error data available</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <BarChart2 className="h-4 w-4 mr-1.5 text-blue-500" />
                        Error Distribution
                      </h4>
                      
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Left Hand</span>
                            <span>{keyCategories.leftHand.percentage}% ({keyCategories.leftHand.errors} errors)</span>
                          </div>
                          <Progress value={keyCategories.leftHand.percentage} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Right Hand</span>
                            <span>{keyCategories.rightHand.percentage}% ({keyCategories.rightHand.errors} errors)</span>
                          </div>
                          <Progress value={keyCategories.rightHand.percentage} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Upper Row</span>
                            <span>{keyCategories.upperRow.percentage}% ({keyCategories.upperRow.errors} errors)</span>
                          </div>
                          <Progress value={keyCategories.upperRow.percentage} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Home Row</span>
                            <span>{keyCategories.homeRow.percentage}% ({keyCategories.homeRow.errors} errors)</span>
                          </div>
                          <Progress value={keyCategories.homeRow.percentage} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-xs">
                            <span>Lower Row</span>
                            <span>{keyCategories.lowerRow.percentage}% ({keyCategories.lowerRow.errors} errors)</span>
                          </div>
                          <Progress value={keyCategories.lowerRow.percentage} className="h-2" />
                        </div>
                        
                        {keyCategories.numberRow.errors > 0 && (
                          <div>
                            <div className="flex justify-between mb-1 text-xs">
                              <span>Number Row</span>
                              <span>{keyCategories.numberRow.percentage}% ({keyCategories.numberRow.errors} errors)</span>
                            </div>
                            <Progress value={keyCategories.numberRow.percentage} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Fingerprint className="h-4 w-4 mr-1.5 text-indigo-500" />
                        Finger Analysis
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(keyCategories.fingerErrors)
                          .filter(([_, errors]) => errors > 0)
                          .sort((a, b) => b[1] - a[1])
                          .map(([finger, errors]) => {
                            const fingerName = {
                              leftPinky: "Left Pinky",
                              leftRing: "Left Ring",
                              leftMiddle: "Left Middle",
                              leftIndex: "Left Index",
                              rightIndex: "Right Index",
                              rightMiddle: "Right Middle",
                              rightRing: "Right Ring",
                              rightPinky: "Right Pinky",
                              thumbs: "Thumbs"
                            }[finger];
                            const percentage = Math.round((errors / keyCategories.total) * 100);
                            
                            return (
                              <div key={finger} className="text-xs">
                                <div className="flex justify-between mb-1">
                                  <span>{fingerName}</span>
                                  <span>{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-1.5" />
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  </>
                )}
                
                {hasData && errorHistory.length > 1 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <LineChart className="h-4 w-4 mr-1.5 text-green-500" />
                      Error Trends
                    </h4>
                    
                    <div className="p-3 bg-background/50 rounded-md border border-border/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {errorTrend.trend === 'positive' ? (
                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                          ) : errorTrend.trend === 'negative' ? (
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                          ) : (
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          
                          <span className={cn(
                            "text-sm font-medium",
                            errorTrend.trend === 'positive' && "text-green-600 dark:text-green-500",
                            errorTrend.trend === 'negative' && "text-red-600 dark:text-red-500"
                          )}>
                            {errorTrend.trend === 'positive' 
                              ? `${errorTrend.percentage}% fewer errors`
                              : errorTrend.trend === 'negative'
                              ? `${errorTrend.percentage}% more errors`
                              : "No significant change"}
                          </span>
                        </div>
                        
                        <span className="text-xs text-muted-foreground">
                          Last {errorHistory.length} days
                        </span>
                      </div>
                      
                      <div className="mt-2 h-20 flex items-end justify-between gap-0.5">
                        {errorHistory.map((entry, index) => {
                          const height = `${Math.max(15, Math.min(100, (entry.count / Math.max(...errorHistory.map(e => e.count))) * 100))}%`;
                          const date = new Date(entry.date);
                          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
                          
                          return (
                            <Tooltip key={entry.date}>
                              <TooltipTrigger className="h-full flex items-end">
                                <div className="w-full flex flex-col items-center">
                                  <div 
                                    className={cn(
                                      "w-3 sm:w-5 rounded-t-sm transition-all",
                                      index === errorHistory.length - 1 ? "bg-primary" : "bg-primary/30"
                                    )}
                                    style={{ height }}
                                  ></div>
                                  {index % 2 === 0 && (
                                    <div className="text-[8px] sm:text-[10px] mt-1 text-muted-foreground rotate-45 sm:rotate-0">
                                      {formattedDate}
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="text-xs">
                                  <p className="font-medium">{formattedDate}</p>
                                  <p>{entry.count} total errors</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {!hasData && (
                  <div className="text-muted-foreground text-center py-6">
                    <BarChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No statistics available yet. Complete typing tests to see your detailed analysis.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => window.location.hash = "#/typing-test"}
                    >
                      Take a typing test
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-1.5 text-amber-500" />
                    Personalized Insights
                  </h4>
                  {typingInsights.length > 0 ? (
                    <div className="space-y-3">
                      {typingInsights.map((insight) => (
                        <div 
                          key={insight.id} 
                          className="bg-background/50 p-3 rounded-md border border-border/30 shadow-sm"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">{insight.icon}</div>
                            <div>
                              <h5 className="text-sm font-medium mb-0.5">{insight.title}</h5>
                              <p className="text-xs text-muted-foreground">{insight.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-3 bg-background/50 rounded-md border border-border/30">
                      Complete more typing tests to receive personalized insights.
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1.5 text-green-500" />
                    Improvement Tips
                  </h4>
                  <div className="space-y-2">
                    {improvementTips.map((tip) => (
                      <div 
                        key={tip.id} 
                        className="bg-background/50 p-3 rounded-md border border-border/30 shadow-sm"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">{tip.icon}</div>
                          <div>
                            <h5 className="text-sm font-medium mb-0.5">{tip.title}</h5>
                            <p className="text-xs text-muted-foreground">{tip.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-1.5 text-blue-500" />
                    Personalized Practice Exercises
                  </h4>
                  
                  <div className="space-y-3">
                    {personalizedExercises.map((exercise) => (
                      <div 
                        key={exercise.id} 
                        className="bg-background/50 p-3 rounded-md border border-border/30 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <h5 className="text-sm font-medium mb-1">{exercise.title}</h5>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            exercise.difficulty === "beginner" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                            exercise.difficulty === "intermediate" && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                            exercise.difficulty === "advanced" && "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                            exercise.difficulty === "targeted" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                            exercise.difficulty === "all-levels" && "bg-primary/10 text-primary border-primary/20"
                          )}>
                            {exercise.difficulty === "all-levels" ? "All Levels" : exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{exercise.description}</p>
                        <div className="bg-background p-2 rounded border border-border/50 font-mono text-xs">
                          {exercise.example}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.location.hash = "#/typing-practice"}
                    >
                      Start Guided Practice
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
} 