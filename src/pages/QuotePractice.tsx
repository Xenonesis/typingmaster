import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";
import { useTypingStats } from "@/context/TypingStatsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Keyboard, BarChart2, RefreshCw, Trophy, Zap, BookOpen, MessageSquareQuote, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ThemeProvider } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { getRandomQuote, getCategories } from "@/data/quotes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { calculateWPM, calculateCPM } from "@/utils/textGenerator";

const QuotePractice = () => {
  const { stats, trackError } = useTypingStats();
  const [quoteCategory, setQuoteCategory] = useState<string>("all");
  const [quoteLength, setQuoteLength] = useState<'short' | 'medium' | 'long'>('short');
  const [practiceText, setPracticeText] = useState<string>("");
  const [quoteAuthor, setQuoteAuthor] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingEndTime, setTypingEndTime] = useState<number | null>(null);
  const [typingStats, setTypingStats] = useState<{wpm: number, accuracy: number, errors: number} | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    const saved = localStorage.getItem('quoteAutoAdvance');
    return saved ? JSON.parse(saved) : true;
  });
  const [showAuthor, setShowAuthor] = useState<boolean>(() => {
    const saved = localStorage.getItem('quoteShowAuthor');
    return saved ? JSON.parse(saved) : true;
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Get all available categories
  useEffect(() => {
    const categories = getCategories();
    setAvailableCategories(categories);
  }, []);
  
  // Memoize the generateNewQuote function to avoid dependency issues
  const generateNewQuote = React.useCallback(() => {
    const quote = getRandomQuote(
      quoteCategory === "all" ? undefined : quoteCategory,
      quoteLength
    );
    setPracticeText(quote.text);
    setQuoteAuthor(quote.author);
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
  }, [quoteCategory, quoteLength]);



  // Load initial quote
  useEffect(() => {
    generateNewQuote();
  }, [quoteCategory, quoteLength, generateNewQuote]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('quoteAutoAdvance', JSON.stringify(autoAdvance));
  }, [autoAdvance]);

  useEffect(() => {
    localStorage.setItem('quoteShowAuthor', JSON.stringify(showAuthor));
  }, [showAuthor]);

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
      const endTime = Date.now();
      setTypingEndTime(endTime);
      setIsTyping(false);
      
      const stats = calculateStats(input, endTime);
      if (stats) {
        setTypingStats(stats);
        
        // Track errors for problematic characters
        for (let i = 0; i < Math.min(input.length, practiceText.length); i++) {
          if (input[i] !== practiceText[i]) {
            trackError(practiceText[i]);
          }
        }
        
        // We would update global stats here if there was an updateStats function
        // For now, we'll just store quote stats in localStorage
        try {
          const storedQuoteStats = localStorage.getItem('quoteTypingStats');
          const quoteStats = storedQuoteStats ? JSON.parse(storedQuoteStats) : {
            quoteWpm: 0,
            quoteAccuracy: 0,
            quotesCompleted: 0,
            bestQuoteWpm: 0
          };
          
          // Update stats
          quoteStats.quotesCompleted++;
          quoteStats.quoteWpm = Math.round((quoteStats.quoteWpm * (quoteStats.quotesCompleted - 1) + stats.wpm) / quoteStats.quotesCompleted);
          quoteStats.quoteAccuracy = Math.round((quoteStats.quoteAccuracy * (quoteStats.quotesCompleted - 1) + stats.accuracy) / quoteStats.quotesCompleted);
          quoteStats.bestQuoteWpm = Math.max(quoteStats.bestQuoteWpm, stats.wpm);
          
          localStorage.setItem('quoteTypingStats', JSON.stringify(quoteStats));
        } catch (error) {
          console.error('Error saving quote stats:', error);
        }
      }
      
      setShowResults(true);
      
      // Auto advance to next quote after 3 seconds if enabled
      if (autoAdvance) {
        setTimeout(() => {
          generateNewQuote();
        }, 3000);
      }
    }
  };

  // Calculate typing statistics
  const calculateStats = (input: string, endTime: number) => {
    if (!typingStartTime) return null;
    
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
    const wpm = calculateWPM(input.length, errorCount, elapsedTimeInMinutes * 60);
    
    // Calculate accuracy
    const accuracy = Math.round(((input.length - errorCount) / input.length) * 100);
    
    // Calculate CPM
    const cpm = calculateCPM(input.length, elapsedTimeInMinutes * 60);
    
    return {
      wpm,
      accuracy,
      errors: errorCount
    };
  };

  // Get character classes for highlighting
  const getCharacterClass = (index: number): string => {
    if (index >= userInput.length) {
      return "text-muted-foreground";
    }
    
    if (userInput[index] === practiceText[index]) {
      return "text-primary";
    }
    
    return "text-destructive font-bold";
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Quote Practice</h1>
                <p className="text-muted-foreground">
                  Improve your typing skills with famous and inspirational quotes
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/practice')}
                >
                  <Keyboard className="mr-2 h-4 w-4" />
                  Basic Practice
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/word-practice')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Word Practice
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/typing-test')}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Typing Test
                </Button>
              </div>
            </div>
            
            {/* Settings panel */}
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquareQuote className="mr-2 h-5 w-5" />
                    Quote Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Quote Category</Label>
                    <Select 
                      value={quoteCategory} 
                      onValueChange={setQuoteCategory}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {availableCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="length">Quote Length</Label>
                    <Select 
                      value={quoteLength} 
                      onValueChange={(value: 'short' | 'medium' | 'long') => setQuoteLength(value)}
                    >
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (under 100 chars)</SelectItem>
                        <SelectItem value="medium">Medium (100-200 chars)</SelectItem>
                        <SelectItem value="long">Long (over 200 chars)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-advance" 
                      checked={autoAdvance}
                      onCheckedChange={setAutoAdvance}
                    />
                    <Label htmlFor="auto-advance">Auto-advance to next quote</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-author" 
                      checked={showAuthor}
                      onCheckedChange={setShowAuthor}
                    />
                    <Label htmlFor="show-author">Show author</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. WPM (All)</p>
                      <p className="text-2xl font-bold">{stats.wpm || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Accuracy</p>
                      <p className="text-2xl font-bold">{stats.accuracy || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                      <p className="text-2xl font-bold">{stats.totalTestsCompleted || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Best WPM</p>
                      <p className="text-2xl font-bold">{stats.bestWpm || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quote display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquareQuote className="mr-2 h-5 w-5" />
                    Quote Practice
                  </span>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateNewQuote}
                    className="ml-auto"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Quote
                  </Button>
                </CardTitle>
                {showAuthor && quoteAuthor && (
                  <CardDescription className="italic text-right">
                    — {quoteAuthor}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-md bg-muted font-mono text-lg leading-relaxed">
                  {practiceText.split('').map((char, index) => (
                    <span key={index} className={getCharacterClass(index)}>
                      {char}
                    </span>
                  ))}
                </div>
                
                {isTyping && typingStartTime && (
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{Math.round((userInput.length / practiceText.length) * 100)}%</span> complete
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time: <span className="font-medium">{Math.round((Date.now() - typingStartTime) / 1000)}s</span>
                    </div>
                  </div>
                )}
                
                <Progress value={(userInput.length / practiceText.length) * 100} />
                
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Start typing the quote above..."
                  rows={3}
                  disabled={showResults}
                />
                
                {showResults && typingStats && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-bold">Results</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Zap className="mx-auto h-8 w-8 text-primary mb-2" />
                            <p className="text-3xl font-bold">{typingStats.wpm}</p>
                            <p className="text-sm text-muted-foreground">WPM</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Trophy className="mx-auto h-8 w-8 text-primary mb-2" />
                            <p className="text-3xl font-bold">{typingStats.accuracy}%</p>
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <XCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                            <p className="text-3xl font-bold">{typingStats.errors}</p>
                            <p className="text-sm text-muted-foreground">Errors</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={generateNewQuote}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Practice Another Quote
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default QuotePractice;
