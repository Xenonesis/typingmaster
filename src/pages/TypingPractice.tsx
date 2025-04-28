import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { useTypingStats } from "@/context/TypingStatsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Keyboard, BarChart2, XCircle, Trophy, Zap, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ThemeProvider } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

// Generate practice text for problematic keys
const generatePracticeText = (problemKeys: string[], length: number = 50): string => {
  if (problemKeys.length === 0) {
    return "The quick brown fox jumps over the lazy dog. Practice typing to improve your speed and accuracy.";
  }

  // Common words containing each problem key
  const keyWords: Record<string, string[]> = {
    a: ["apple", "amazing", "avocado", "dance", "master", "canvas", "after"],
    b: ["because", "build", "bring", "about", "better", "bubble", "brother"],
    c: ["card", "chance", "choice", "color", "accept", "fact", "practice"],
    d: ["design", "data", "drink", "during", "idea", "found", "made"],
    e: ["every", "enter", "effect", "before", "between", "else", "these"],
    f: ["find", "factory", "funny", "after", "life", "effort", "future"],
    g: ["great", "going", "game", "good", "again", "long", "language"],
    h: ["house", "hotel", "happy", "health", "what", "this", "those"],
    i: ["idea", "inside", "if", "item", "think", "this", "wind"],
    j: ["just", "jump", "join", "major", "project", "object", "adjust"],
    k: ["kind", "keep", "know", "key", "make", "book", "skill"],
    l: ["long", "later", "level", "life", "all", "well", "still"],
    m: ["make", "more", "most", "many", "from", "time", "some"],
    n: ["name", "need", "next", "new", "than", "and", "under"],
    o: ["over", "open", "only", "other", "work", "not", "for"],
    p: ["part", "place", "point", "page", "type", "help", "open"],
    q: ["quick", "quiet", "quality", "question", "quite", "require", "unique"],
    r: ["right", "red", "room", "real", "after", "work", "order"],
    s: ["some", "same", "see", "say", "this", "those", "use"],
    t: ["time", "take", "talk", "team", "right", "what", "that"],
    u: ["under", "up", "use", "until", "about", "out", "but"],
    v: ["very", "value", "voice", "view", "over", "have", "live"],
    w: ["with", "work", "want", "when", "where", "two", "now"],
    x: ["next", "mix", "box", "expect", "extend", "excel", "exist"],
    y: ["your", "year", "yes", "you", "may", "any", "by"],
    z: ["zero", "zone", "size", "lazy", "puzzle", "freeze", "buzz"]
  };

  // Connectors to make sentences flow
  const connectors = ["and", "or", "but", "while", "when", "because", "if", "though", "since", "as"];
  
  let practice = "";
  let wordCount = 0;

  // Generate text with focus on problem keys
  while (practice.length < length * 5) {
    // Select a problem key
    const keyIndex = Math.floor(Math.random() * problemKeys.length);
    const key = problemKeys[keyIndex].toLowerCase();
    
    // Get words for this key
    const words = keyWords[key] || ["the", "and", "that"];
    
    // Add some words with this key
    for (let i = 0; i < 3 && practice.length < length * 5; i++) {
      const wordIndex = Math.floor(Math.random() * words.length);
      practice += words[wordIndex] + " ";
      wordCount++;
      
      // Add a connector occasionally
      if (wordCount % 4 === 0) {
        const connectorIndex = Math.floor(Math.random() * connectors.length);
        practice += connectors[connectorIndex] + " ";
      }
      
      // Add punctuation occasionally
      if (wordCount % 7 === 0) {
        practice = practice.trim() + ". ";
      }
      
      if (wordCount % 15 === 0) {
        practice = practice.trim() + ".\n";
      }
    }
  }
  
  // Clean up and capitalize sentences
  return practice
    .split(". ")
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0)
    .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join(". ")
    .trim() + ".";
};

const TypingPractice = () => {
  const { stats, hasRealData } = useTypingStats();
  const [practiceMode, setPracticeMode] = useState<'problem-keys' | 'accuracy' | 'speed'>('problem-keys');
  const [practiceText, setPracticeText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingEndTime, setTypingEndTime] = useState<number | null>(null);
  const [typingStats, setTypingStats] = useState<{wpm: number, accuracy: number, errors: number} | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Get problem keys from stats
  useEffect(() => {
    let problemKeys: string[] = [];
    
    if (hasRealData && Object.keys(stats.errorData).length > 0) {
      // Get top 5 problem keys
      problemKeys = Object.entries(stats.errorData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([key]) => key);
    }
    
    // Generate practice text based on problem keys
    setPracticeText(generatePracticeText(problemKeys));
  }, [hasRealData, stats.errorData]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setUserInput(input);
    
    // Start typing timer on first input
    if (!isTyping && input.length === 1) {
      setIsTyping(true);
      setTypingStartTime(Date.now());
    }
    
    // Check if typing is complete
    if (input.length >= practiceText.length) {
      setTypingEndTime(Date.now());
      calculateStats(input);
      setShowResults(true);
      setIsTyping(false);
    }
  };

  // Calculate typing statistics
  const calculateStats = (input: string) => {
    if (!typingStartTime) return;
    
    const endTime = Date.now();
    const elapsedTimeInMinutes = (endTime - typingStartTime) / 60000;
    
    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < Math.min(input.length, practiceText.length); i++) {
      if (input[i] !== practiceText[i]) {
        errorCount++;
      }
    }
    
    // Calculate WPM (5 characters = 1 word)
    const words = input.length / 5;
    const wpm = Math.round(words / elapsedTimeInMinutes);
    
    // Calculate accuracy
    const accuracy = Math.round(((input.length - errorCount) / input.length) * 100);
    
    setTypingStats({
      wpm,
      accuracy,
      errors: errorCount
    });
  };

  // Generate new practice text
  const regeneratePracticeText = () => {
    let problemKeys: string[] = [];
    
    if (hasRealData && Object.keys(stats.errorData).length > 0) {
      problemKeys = Object.entries(stats.errorData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([key]) => key);
    }
    
    setPracticeText(generatePracticeText(problemKeys));
    setUserInput("");
    setIsTyping(false);
    setTypingStartTime(null);
    setTypingEndTime(null);
    setShowResults(false);
    setTypingStats(null);
    
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Get character classes for highlighting
  const getCharClass = (index: number) => {
    if (index >= userInput.length) {
      return "text-muted-foreground";
    }
    
    if (userInput[index] === practiceText[index]) {
      return "text-green-500 dark:text-green-400";
    }
    
    return "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-950/30";
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <main className="flex-grow container px-4 sm:px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Typing Practice</h1>
              <p className="text-muted-foreground">Focus on your problem areas and improve your typing skills</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/typing-test')}
                className="hidden sm:flex"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Full Typing Test
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={regeneratePracticeText}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Practice
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-border/30 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/30">
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-primary" />
                    Practice Exercise
                  </CardTitle>
                  <CardDescription>
                    {hasRealData 
                      ? "Customized practice based on your typing analysis" 
                      : "General typing practice to build your skills"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6">
                  {/* Show typing results */}
                  {showResults && typingStats && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Practice Complete!</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{typingStats.wpm}</div>
                          <div className="text-sm text-green-600 dark:text-green-500">WPM</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{typingStats.accuracy}%</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{typingStats.errors}</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Errors</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={regeneratePracticeText} variant="outline" className="border-green-300 dark:border-green-800">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Practice Again
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Practice text */}
                  <div className="mb-4 p-4 bg-muted/30 rounded-lg text-lg leading-relaxed font-mono">
                    {practiceText.split("").map((char, i) => (
                      <span key={i} className={getCharClass(i)}>
                        {char}
                      </span>
                    ))}
                  </div>
                  
                  {/* Input area */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type the text above:</label>
                    <textarea
                      ref={inputRef}
                      value={userInput}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md bg-background h-32 font-mono text-base resize-none focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      placeholder="Start typing here..."
                      disabled={showResults}
                    />
                    
                    {/* Progress indicator */}
                    {isTyping && !showResults && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{Math.round((userInput.length / practiceText.length) * 100)}%</span>
                        </div>
                        <Progress value={(userInput.length / practiceText.length) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border border-border/30 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/30">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Problem Areas
                  </CardTitle>
                  <CardDescription>
                    Keys you need to practice more
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6">
                  {hasRealData && Object.keys(stats.errorData).length > 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
                          Problematic Keys
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(stats.errorData)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([key, count]) => (
                              <Badge key={key} variant="outline" className="flex gap-1.5">
                                <span className="font-mono bg-primary/10 px-1.5 rounded">{key}</span>
                                <span>{count} errors</span>
                              </Badge>
                            ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">Tips to Improve</h3>
                        <ul className="text-sm space-y-1.5 list-disc list-inside text-muted-foreground">
                          <li>Focus on accuracy first, then speed</li>
                          <li>Practice the problem keys regularly</li>
                          <li>Try to maintain a steady rhythm</li>
                          <li>Take breaks to avoid fatigue</li>
                          <li>Complete daily practice sessions</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <XCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-4">No problem key data available yet.</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/typing-test')}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Take a full typing test
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default TypingPractice; 