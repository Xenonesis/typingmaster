import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { useTypingStats } from "@/context/TypingStatsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Keyboard, BarChart2, RefreshCw, Trophy, Zap, BookOpen, Star, Save, Plus, X, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ThemeProvider } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { WordModeDisplay } from "@/components/typing/WordModeDisplay";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { calculateWPM, calculateAccuracy, calculateCPM } from "@/utils/textGenerator";

// Common English words categorized by length
const wordSets = {
  short: [
    "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use", "mom", "dad"
  ],
  medium: [
    "about", "above", "after", "again", "along", "begin", "being", "below", "dream", "drink", "earth", "every", "field", "first", "found", "great", "house", "large", "learn", "light", "money", "music", "never", "night", "often", "place", "plant", "point", "right", "small", "sound", "spell", "still", "study", "think", "water", "where", "which", "world", "would", "write"
  ],
  long: [
    "beautiful", "different", "difficult", "everyone", "favorite", "important", "interest", "knowledge", "mountain", "necessary", "practice", "question", "remember", "sentence", "something", "sometimes", "together", "wonderful", "yesterday", "adventure", "challenge", "chocolate", "community", "education", "experience", "furniture", "happiness", "influence", "introduce", "leadership", "management", "philosophy", "president", "professor", "restaurant", "scientist", "technology", "understand", "university", "vegetable"
  ],
  challenging: [
    "abbreviate", "accomplish", "acquisition", "articulate", "benevolent", "calculation", "certificate", "circulation", "commitment", "competitive", "consequence", "convenience", "development", "demonstrate", "environment", "fascinating", "fundamental", "immediately", "independent", "interesting", "maintenance", "measurement", "opportunity", "participant", "performance", "perspective", "probability", "psychology", "reasonable", "recognition", "significant", "subsequently", "substantial", "temperature", "theoretical", "unnecessary", "visualization", "undoubtedly", "unequivocally", "wheelbarrow"
  ]
};

// Interface for problematic words with spaced repetition metadata
interface ProblemWord {
  word: string;
  errorCount: number;
  lastPracticed: number | null; // timestamp
  nextPracticeDate: number | null; // timestamp
  interval: number; // in days
}

// Function to generate practice words based on the selected mode
const generateWordPractice = (
  mode: 'short' | 'medium' | 'long' | 'challenging' | 'adaptive' | 'personal' | 'spaced', 
  count: number = 25,
  personalWords: string[] = [],
  problemWords: ProblemWord[] = []
): string[] => {
  if (mode === 'personal' && personalWords.length > 0) {
    // Use personal word list if available
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * personalWords.length);
      words.push(personalWords[randomIndex]);
    }
    return words;
  } else if (mode === 'spaced' && problemWords.length > 0) {
    // Filter words due for practice based on spaced repetition
    const now = Date.now();
    const dueProblemWords = problemWords
      .filter(word => word.nextPracticeDate === null || word.nextPracticeDate <= now)
      .sort((a, b) => (b.errorCount || 0) - (a.errorCount || 0));
    
    if (dueProblemWords.length > 0) {
      const practiceWords = dueProblemWords.slice(0, count).map(w => w.word);
      
      // If we don't have enough problem words, fill with medium difficulty words
      if (practiceWords.length < count) {
        const additionalCount = count - practiceWords.length;
        const mediumWords = wordSets.medium;
        for (let i = 0; i < additionalCount; i++) {
          const randomIndex = Math.floor(Math.random() * mediumWords.length);
          practiceWords.push(mediumWords[randomIndex]);
        }
      }
      
      return practiceWords;
    }
  } else if (mode === 'adaptive') {
    // Mix words from different difficulty levels based on user's past performance
    const words: string[] = [];
    const allSets = [wordSets.short, wordSets.medium, wordSets.long, wordSets.challenging];
    const weights = [0.1, 0.3, 0.4, 0.2]; // Default weights if no performance data
    
    for (let i = 0; i < count; i++) {
      // Choose a difficulty level based on weights
      const randomValue = Math.random();
      let cumulativeWeight = 0;
      let selectedSet = wordSets.medium; // Default
      
      for (let j = 0; j < weights.length; j++) {
        cumulativeWeight += weights[j];
        if (randomValue <= cumulativeWeight) {
          selectedSet = allSets[j];
          break;
        }
      }
      
      const randomIndex = Math.floor(Math.random() * selectedSet.length);
      words.push(selectedSet[randomIndex]);
    }
    
    return words;
  }
  
  // Default case: use the standard word sets
  const selectedWordSet = wordSets[mode] || wordSets.medium;
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * selectedWordSet.length);
    words.push(selectedWordSet[randomIndex]);
  }
  
  return words;
};

// Function to update spaced repetition schedule for a word
const updateSpacedRepetition = (
  word: string, 
  wasCorrect: boolean, 
  problemWords: ProblemWord[]
): ProblemWord[] => {
  const now = Date.now();
  const existingWordIndex = problemWords.findIndex(w => w.word === word);
  
  if (existingWordIndex >= 0) {
    const updatedWords = [...problemWords];
    const existingWord = {...updatedWords[existingWordIndex]};
    
    if (wasCorrect) {
      // If correct, increase interval (spaced repetition)
      existingWord.interval = existingWord.interval * 2 || 1;
      existingWord.errorCount = Math.max(0, existingWord.errorCount - 1);
    } else {
      // If incorrect, reset interval and increase error count
      existingWord.interval = 1;
      existingWord.errorCount = (existingWord.errorCount || 0) + 1;
    }
    
    // Update practice timestamps
    existingWord.lastPracticed = now;
    existingWord.nextPracticeDate = now + (existingWord.interval * 24 * 60 * 60 * 1000); // Convert days to ms
    
    updatedWords[existingWordIndex] = existingWord;
    return updatedWords;
  } else if (!wasCorrect) {
    // Add new problematic word
    return [
      ...problemWords, 
      {
        word,
        errorCount: 1,
        lastPracticed: now,
        nextPracticeDate: now + (24 * 60 * 60 * 1000), // Practice again tomorrow
        interval: 1
      }
    ];
  }
  
  return problemWords;
};

const WordPractice = () => {
  // Main state for the practice session
  const [wordMode, setWordMode] = useState<'short' | 'medium' | 'long' | 'challenging' | 'adaptive' | 'personal' | 'spaced'>('medium');
  const [practiceWords, setPracticeWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingEndTime, setTypingEndTime] = useState<number | null>(null);
  const [typingStats, setTypingStats] = useState<{wpm: number, accuracy: number, errors: number} | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Feature: Personal word list
  const [personalWords, setPersonalWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('personalWordList');
    return saved ? JSON.parse(saved) : [];
  });
  const [newWord, setNewWord] = useState<string>("");
  
  // Feature: Problematic words with spaced repetition
  const [problemWords, setProblemWords] = useState<ProblemWord[]>(() => {
    const saved = localStorage.getItem('problemWords');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Feature: Settings
  const [audioFeedback, setAudioFeedback] = useState<boolean>(() => {
    const saved = localStorage.getItem('wordPracticeAudioFeedback');
    return saved ? JSON.parse(saved) : true;
  });
  const [wordCount, setWordCount] = useState<number>(() => {
    const saved = localStorage.getItem('wordPracticeCount');
    return saved ? parseInt(JSON.parse(saved)) : 25;
  });
  
  // Track word correctness
  const [wordResults, setWordResults] = useState<{word: string, correct: boolean}[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const correctAudioRef = useRef<HTMLAudioElement>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const { stats } = useTypingStats();

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('personalWordList', JSON.stringify(personalWords));
  }, [personalWords]);
  
  useEffect(() => {
    localStorage.setItem('problemWords', JSON.stringify(problemWords));
  }, [problemWords]);
  
  useEffect(() => {
    localStorage.setItem('wordPracticeAudioFeedback', JSON.stringify(audioFeedback));
  }, [audioFeedback]);
  
  useEffect(() => {
    localStorage.setItem('wordPracticeCount', JSON.stringify(wordCount));
  }, [wordCount]);

  // Generate practice words when mode changes
  useEffect(() => {
    generateNewPractice();
  }, [wordMode, personalWords, problemWords, wordCount]);

  // Generate new practice words
  const generateNewPractice = () => {
    setPracticeWords(generateWordPractice(wordMode, wordCount, personalWords, problemWords));
    setCurrentWordIndex(0);
    setUserInput("");
    setIsTyping(false);
    setTypingStartTime(null);
    setTypingEndTime(null);
    setShowResults(false);
    setTypingStats(null);
    setWordResults([]);
    
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);
    
    // Start typing timer on first input
    if (!isTyping && input.length === 1) {
      setIsTyping(true);
      setTypingStartTime(Date.now());
    }
  };

  // Handle space key to move to next word
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      
      // Check if current word is completed
      if (userInput.trim() !== "") {
        // Check if current word matches the expected word
        const isCorrect = userInput.trim() === practiceWords[currentWordIndex];
        
        // Update word results
        setWordResults(prev => [...prev, {
          word: practiceWords[currentWordIndex],
          correct: isCorrect
        }]);
        
        // Update spaced repetition data
        if (wordMode === 'spaced' || wordMode === 'personal' || wordMode === 'adaptive') {
          setProblemWords(prev => 
            updateSpacedRepetition(practiceWords[currentWordIndex], isCorrect, prev)
          );
        }
        
        // Play audio feedback if enabled
        if (audioFeedback) {
          if (isCorrect && correctAudioRef.current) {
            correctAudioRef.current.play();
          } else if (!isCorrect && incorrectAudioRef.current) {
            incorrectAudioRef.current.play();
          }
        }
        
        // Move to next word
        if (currentWordIndex < practiceWords.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setUserInput("");
        } else {
          // End of practice
          setTypingEndTime(Date.now());
          calculateStats();
          setShowResults(true);
          setIsTyping(false);
        }
      }
    }
  };

  // Add a word to personal list
  const addPersonalWord = () => {
    if (newWord.trim() && !personalWords.includes(newWord.trim())) {
      setPersonalWords(prev => [...prev, newWord.trim()]);
      setNewWord("");
      toast({
        title: "Word Added",
        description: `"${newWord.trim()}" has been added to your personal word list.`,
        duration: 3000
      });
    }
  };

  // Remove a word from personal list
  const removePersonalWord = (word: string) => {
    setPersonalWords(prev => prev.filter(w => w !== word));
  };

  // Calculate typing statistics
  const calculateStats = () => {
    if (!typingStartTime) return;
    
    const endTime = Date.now();
    const elapsedTimeInMinutes = (endTime - typingStartTime) / 60000;
    const elapsedTimeInSeconds = elapsedTimeInMinutes * 60;
    
    // Calculate WPM
    const words = practiceWords.length;
    const wpm = calculateWPM(typedCharacters, correctCharacters, elapsedTimeInSeconds);
    
    // Calculate errors and accuracy
    let errorCount = 0;
    let totalChars = 0;
    
    // Count errors for completed words based on word results
    const completedWords = wordResults.length;
    let correctWords = 0;
    
    wordResults.forEach(result => {
      if (!result.correct) {
        errorCount++;
      } else {
        correctWords++;
      }
      totalChars += result.word.length;
    });
    
    // Calculate accuracy
    const accuracy = calculateAccuracy(totalCharacters, correctCharacters);
    
    // Calculate CPM
    const cpm = calculateCPM(typedCharacters, elapsedTimeInSeconds);
    
    setTypingStats({
      wpm,
      accuracy,
      errors: errorCount
    });
    
    // Update adaptive mode metrics in localStorage based on performance
    if (wordMode === 'adaptive') {
      // Store the user's performance with this difficulty level
      const adaptiveStats = JSON.parse(localStorage.getItem('adaptiveWordStats') || '{}');
      adaptiveStats.lastWpm = wpm;
      adaptiveStats.lastAccuracy = accuracy;
      adaptiveStats.lastTimestamp = Date.now();
      localStorage.setItem('adaptiveWordStats', JSON.stringify(adaptiveStats));
    }
  };

  // Get the due count for spaced repetition
  const getDueCount = () => {
    const now = Date.now();
    return problemWords.filter(w => w.nextPracticeDate === null || w.nextPracticeDate <= now).length;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <main className="flex-grow container px-4 sm:px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Word Practice</h1>
              <p className="text-muted-foreground">Improve your typing by practicing with words of different difficulty levels</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/practice')}
                className="hidden sm:flex"
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Full Practice
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={generateNewPractice}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Words
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-border/30 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/30">
                  <div className="flex justify-between items-center">
                    <CardTitle>Word Practice</CardTitle>
                    <Tabs value={wordMode} onValueChange={(v) => setWordMode(v as any)} className="w-full max-w-md">
                      <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full">
                        <TabsTrigger value="short">Short</TabsTrigger>
                        <TabsTrigger value="medium">Medium</TabsTrigger>
                        <TabsTrigger value="long">Long</TabsTrigger>
                        <TabsTrigger value="challenging">Hard</TabsTrigger>
                        <TabsTrigger value="adaptive" className="hidden sm:block">Adaptive</TabsTrigger>
                        <TabsTrigger value="personal" className="hidden sm:block">Personal</TabsTrigger>
                        <TabsTrigger value="spaced" className="hidden sm:block">
                          Spaced
                          {getDueCount() > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
                              {getDueCount()}
                            </Badge>
                          )}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardDescription>
                    {wordMode === 'adaptive' ? 'Adaptive difficulty based on your performance' :
                     wordMode === 'personal' ? 'Practice with your custom word list' :
                     wordMode === 'spaced' ? 'Spaced repetition for problematic words' :
                     `Practice typing words of ${wordMode} length to improve your speed and accuracy`}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {!showResults ? (
                    <>
                      <div className="mb-6 p-6 bg-muted/30 rounded-md">
                        <div className="flex flex-wrap gap-3 mb-4">
                          {practiceWords.map((word, index) => (
                            <span 
                              key={index}
                              className={`text-lg font-mono ${
                                index === currentWordIndex 
                                  ? 'bg-primary/20 text-primary-foreground px-1 py-0.5 rounded dark:bg-primary/30 dark:text-primary-foreground'
                                  : index < currentWordIndex 
                                    ? wordResults[index]?.correct 
                                      ? 'text-green-500 dark:text-green-400 line-through'
                                      : 'text-red-500 dark:text-red-400 line-through' 
                                    : 'text-foreground dark:text-slate-200'
                              }`}
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">
                            Word {currentWordIndex + 1} of {practiceWords.length}
                          </Badge>
                          
                          {isTyping && typingStartTime && (
                            <Badge variant="secondary">
                              <Zap className="h-3 w-3 mr-1" />
                              Typing...
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-2 flex justify-between">
                          <label htmlFor="word-input" className="text-sm font-medium">
                            Current word: <span className="font-bold text-primary dark:text-primary-foreground">{practiceWords[currentWordIndex]}</span>
                          </label>
                          <span className="text-xs text-muted-foreground dark:text-slate-400">
                            Press Space or Enter to continue to the next word
                          </span>
                        </div>
                        
                        <input
                          id="word-input"
                          ref={inputRef}
                          value={userInput}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className={`w-full p-4 rounded-md font-mono text-lg border ${
                            userInput && userInput.trim() === practiceWords[currentWordIndex]
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300'
                              : userInput && userInput.trim() !== practiceWords[currentWordIndex].substring(0, userInput.length)
                                ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                                : 'border-border dark:border-border/50 bg-background dark:bg-slate-800/50 dark:text-slate-200'
                          }`}
                          placeholder="Type the word here..."
                          autoComplete="off"
                          spellCheck="false"
                        />
                        
                        <div className="mt-4">
                          <Progress value={(currentWordIndex / practiceWords.length) * 100} className="h-2" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 bg-muted/30 rounded-md">
                      <h3 className="text-xl font-bold mb-4">Practice Results</h3>
                      
                      {typingStats && (
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-card p-4 rounded-md shadow-sm border border-border/50">
                            <div className="text-muted-foreground text-sm">Speed</div>
                            <div className="text-2xl font-bold">{typingStats.wpm} WPM</div>
                          </div>
                          
                          <div className="bg-card p-4 rounded-md shadow-sm border border-border/50">
                            <div className="text-muted-foreground text-sm">Accuracy</div>
                            <div className="text-2xl font-bold">{typingStats.accuracy}%</div>
                          </div>
                          
                          <div className="bg-card p-4 rounded-md shadow-sm border border-border/50">
                            <div className="text-muted-foreground text-sm">Errors</div>
                            <div className="text-2xl font-bold">{typingStats.errors}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Show problematic words from this session */}
                      {wordResults.filter(r => !r.correct).length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-2">Words to Practice:</h4>
                          <div className="flex flex-wrap gap-2">
                            {wordResults
                              .filter(r => !r.correct)
                              .map((result, i) => (
                                <Badge key={i} variant="outline" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                                  {result.word}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-3">
                        <Button onClick={generateNewPractice}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Practice
                        </Button>
                        <Button variant="outline" onClick={() => setWordMode(wordMode === 'challenging' ? 'short' : 
                          wordMode === 'long' ? 'challenging' : 
                          wordMode === 'medium' ? 'long' : 'medium')}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Change Level
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Settings Panel */}
              <Card className="border border-border/30 shadow-sm mt-6">
                <CardHeader className="pb-3 border-b border-border/30">
                  <CardTitle className="text-base">Practice Settings</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="audio-feedback" className="flex items-center space-x-2">
                        {audioFeedback ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <span>Audio Feedback</span>
                      </Label>
                      <Switch
                        id="audio-feedback"
                        checked={audioFeedback}
                        onCheckedChange={setAudioFeedback}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="word-count" className="flex items-center space-x-2">
                        <span>Word Count:</span>
                        <strong>{wordCount}</strong>
                      </Label>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setWordCount(Math.max(10, wordCount - 5))}
                        >-</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setWordCount(Math.min(50, wordCount + 5))}
                        >+</Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Audio elements for feedback */}
                  <audio ref={correctAudioRef} src="/assets/sounds/correct.mp3" />
                  <audio ref={incorrectAudioRef} src="/assets/sounds/incorrect.mp3" />
                </CardContent>
              </Card>
            </div>
            
            <div>
              {/* Word Practice Tips Card */}
              <Card className="border border-border/30 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Word Practice Tips
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Why Practice Words?</h3>
                      <p className="text-sm text-muted-foreground">
                        Word-by-word practice helps you develop muscle memory for common words and improves overall typing fluency.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">How to Use This Practice</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Type each word completely before pressing Space or Enter</li>
                        <li>• Focus on accuracy first, then speed</li>
                        <li>• Practice regularly with increasing difficulty</li>
                        <li>• Start with short words and progress to longer ones</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Practice Modes</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• <span className="font-medium">Short/Medium/Long/Hard</span>: Fixed difficulty levels</li>
                        <li>• <span className="font-medium">Adaptive</span>: Adjusts to your skill level</li>
                        <li>• <span className="font-medium">Personal</span>: Your custom word list</li>
                        <li>• <span className="font-medium">Spaced</span>: Review difficult words at optimal intervals</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Personal Word List Card */}
              <Dialog>
                <Card className="border border-border/30 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Personal Word List 
                      <Badge variant="secondary" className="ml-2">{personalWords.length}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Add your own words to practice
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input 
                        placeholder="Add a word..." 
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPersonalWord()}
                      />
                      <Button onClick={addPersonalWord} size="sm" className="whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    {personalWords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {personalWords.slice(0, 5).map((word, i) => (
                          <Badge key={i} variant="secondary" className="flex gap-1 items-center">
                            {word}
                            <button 
                              onClick={() => removePersonalWord(word)}
                              className="h-3 w-3 rounded-full hover:bg-muted flex items-center justify-center"
                              aria-label={`Remove ${word}`}
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </Badge>
                        ))}
                        {personalWords.length > 5 && (
                          <DialogTrigger asChild>
                            <Badge variant="outline" className="cursor-pointer hover:bg-muted/50">
                              +{personalWords.length - 5} more...
                            </Badge>
                          </DialogTrigger>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        Add words you want to practice
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Personal Word List</DialogTitle>
                    <DialogDescription>
                      Manage your custom words for practice
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Add a word..." 
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addPersonalWord()}
                    />
                    <Button onClick={addPersonalWord} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto">
                    {personalWords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {personalWords.map((word, i) => (
                          <Badge key={i} variant="secondary" className="flex gap-1 items-center">
                            {word}
                            <button 
                              onClick={() => removePersonalWord(word)}
                              className="h-3 w-3 rounded-full hover:bg-muted flex items-center justify-center"
                              aria-label={`Remove ${word}`}
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        Your personal word list is empty
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter className="sm:justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setPersonalWords([])}
                      className="sm:mt-0"
                    >
                      Clear All
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => setWordMode('personal')}
                    >
                      Practice These Words
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default WordPractice; 