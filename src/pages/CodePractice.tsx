import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTypingStats } from "@/context/TypingStatsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Keyboard, BarChart2, RefreshCw, Trophy, Zap, BookOpen, Code, XCircle, CodepenIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ThemeProvider } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { getRandomCodeSnippet, getLanguages, getLanguageDisplayName } from "@/data/codeSnippets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { calculateWPM, calculateCPM } from "@/utils/textGenerator";
// We're going to use a simpler approach to syntax highlighting
// by using CSS classes for basic syntax highlighting

const CodePractice = () => {
  const { stats, trackError } = useTypingStats();
  const [codeLanguage, setCodeLanguage] = useState<string>("javascript");
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [practiceText, setPracticeText] = useState<string>("");
  const [snippetTitle, setSnippetTitle] = useState<string>("");
  const [snippetDescription, setSnippetDescription] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingEndTime, setTypingEndTime] = useState<number | null>(null);
  const [typingStats, setTypingStats] = useState<{wpm: number, accuracy: number, errors: number} | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(() => {
    const saved = localStorage.getItem('codeAutoAdvance');
    return saved ? JSON.parse(saved) : true;
  });
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(() => {
    const saved = localStorage.getItem('codeShowLineNumbers');
    return saved ? JSON.parse(saved) : true;
  });
  const [inlineErrors, setInlineErrors] = useState<boolean>(() => {
    const saved = localStorage.getItem('codeInlineErrors');
    return saved ? JSON.parse(saved) : true;
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  // Get all available languages
  useEffect(() => {
    const languages = getLanguages();
    setAvailableLanguages(languages);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('codeAutoAdvance', JSON.stringify(autoAdvance));
  }, [autoAdvance]);

  useEffect(() => {
    localStorage.setItem('codeShowLineNumbers', JSON.stringify(showLineNumbers));
  }, [showLineNumbers]);

  useEffect(() => {
    localStorage.setItem('codeInlineErrors', JSON.stringify(inlineErrors));
  }, [inlineErrors]);



  // Generate a new code snippet
  const generateNewSnippet = React.useCallback(() => {
    const snippet = getRandomCodeSnippet(codeLanguage, difficulty);
    setPracticeText(snippet.code);
    setSnippetTitle(snippet.title);
    setSnippetDescription(snippet.description);
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


  }, [codeLanguage, difficulty]);

  // Load initial code snippet
  useEffect(() => {
    generateNewSnippet();
  }, [codeLanguage, difficulty, generateNewSnippet]);

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
        
        // Store code stats in localStorage
        try {
          const storedCodeStats = localStorage.getItem('codeTypingStats');
          const codeStats = storedCodeStats ? JSON.parse(storedCodeStats) : {
            codeWpm: 0,
            codeAccuracy: 0,
            snippetsCompleted: 0,
            bestCodeWpm: 0,
            languageStats: {}
          };
          
          // Update overall stats
          codeStats.snippetsCompleted++;
          codeStats.codeWpm = Math.round((codeStats.codeWpm * (codeStats.snippetsCompleted - 1) + stats.wpm) / codeStats.snippetsCompleted);
          codeStats.codeAccuracy = Math.round((codeStats.codeAccuracy * (codeStats.snippetsCompleted - 1) + stats.accuracy) / codeStats.snippetsCompleted);
          codeStats.bestCodeWpm = Math.max(codeStats.bestCodeWpm, stats.wpm);
          
          // Update language-specific stats
          if (!codeStats.languageStats[codeLanguage]) {
            codeStats.languageStats[codeLanguage] = {
              completed: 0,
              avgWpm: 0,
              avgAccuracy: 0,
              bestWpm: 0
            };
          }
          
          const langStats = codeStats.languageStats[codeLanguage];
          langStats.completed++;
          langStats.avgWpm = Math.round((langStats.avgWpm * (langStats.completed - 1) + stats.wpm) / langStats.completed);
          langStats.avgAccuracy = Math.round((langStats.avgAccuracy * (langStats.completed - 1) + stats.accuracy) / langStats.completed);
          langStats.bestWpm = Math.max(langStats.bestWpm, stats.wpm);
          
          localStorage.setItem('codeTypingStats', JSON.stringify(codeStats));
        } catch (error) {
          console.error('Error saving code stats:', error);
        }
      }
      
      setShowResults(true);
      
      // Auto advance to next snippet after 3 seconds if enabled
      if (autoAdvance) {
        setTimeout(() => {
          generateNewSnippet();
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

  // Get language stats from localStorage
  const getLanguageStats = (language: string) => {
    try {
      const storedCodeStats = localStorage.getItem('codeTypingStats');
      if (!storedCodeStats) return { completed: 0, avgWpm: 0, avgAccuracy: 0, bestWpm: 0 };
      
      const codeStats = JSON.parse(storedCodeStats);
      return codeStats.languageStats[language] || { completed: 0, avgWpm: 0, avgAccuracy: 0, bestWpm: 0 };
    } catch (error) {
      console.error('Error retrieving language stats:', error);
      return { completed: 0, avgWpm: 0, avgAccuracy: 0, bestWpm: 0 };
    }
  };

  // Get overall code typing stats
  const getOverallCodeStats = () => {
    try {
      const storedCodeStats = localStorage.getItem('codeTypingStats');
      if (!storedCodeStats) return { codeWpm: 0, codeAccuracy: 0, snippetsCompleted: 0, bestCodeWpm: 0 };
      
      return JSON.parse(storedCodeStats);
    } catch (error) {
      console.error('Error retrieving code stats:', error);
      return { codeWpm: 0, codeAccuracy: 0, snippetsCompleted: 0, bestCodeWpm: 0 };
    }
  };

  // Get character class for inline error highlighting
  const getCharacterClass = (index: number): string => {
    if (!inlineErrors) return "";
    
    if (index >= userInput.length) {
      return "";
    }
    
    if (userInput[index] === practiceText[index]) {
      return "code-correct";
    }
    
    return "code-error";
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Code Practice</h1>
                <p className="text-muted-foreground">
                  Improve your programming typing skills with real code snippets
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
                  onClick={() => navigate('/quote-practice')}
                >
                  <CodepenIcon className="mr-2 h-4 w-4" />
                  Quote Practice
                </Button>
              </div>
            </div>
            
            {/* Settings panel */}
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    Code Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Programming Language</Label>
                    <Select 
                      value={codeLanguage} 
                      onValueChange={setCodeLanguage}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLanguages.map(language => (
                          <SelectItem key={language} value={language}>
                            {getLanguageDisplayName(language)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={difficulty} 
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setDifficulty(value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-advance" 
                      checked={autoAdvance}
                      onCheckedChange={setAutoAdvance}
                    />
                    <Label htmlFor="auto-advance">Auto-advance to next snippet</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-line-numbers" 
                      checked={showLineNumbers}
                      onCheckedChange={setShowLineNumbers}
                    />
                    <Label htmlFor="show-line-numbers">Show line numbers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="inline-errors" 
                      checked={inlineErrors}
                      onCheckedChange={setInlineErrors}
                    />
                    <Label htmlFor="inline-errors">Highlight errors in code</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    {codeLanguage ? getLanguageDisplayName(codeLanguage) : 'Overall'} Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {codeLanguage ? (
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const langStats = getLanguageStats(codeLanguage);
                        return (
                          <>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Avg. WPM</p>
                              <p className="text-2xl font-bold">{langStats.avgWpm || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Avg. Accuracy</p>
                              <p className="text-2xl font-bold">{langStats.avgAccuracy || 0}%</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Snippets Completed</p>
                              <p className="text-2xl font-bold">{langStats.completed || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Best WPM</p>
                              <p className="text-2xl font-bold">{langStats.bestWpm || 0}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const codeStats = getOverallCodeStats();
                        return (
                          <>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Avg. WPM</p>
                              <p className="text-2xl font-bold">{codeStats.codeWpm || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Avg. Accuracy</p>
                              <p className="text-2xl font-bold">{codeStats.codeAccuracy || 0}%</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Snippets Completed</p>
                              <p className="text-2xl font-bold">{codeStats.snippetsCompleted || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Best WPM</p>
                              <p className="text-2xl font-bold">{codeStats.bestCodeWpm || 0}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Code snippet display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    {snippetTitle} 
                    <Badge variant="outline" className="ml-2">{getLanguageDisplayName(codeLanguage)}</Badge>
                    <Badge variant="outline" className="ml-2 capitalize">{difficulty}</Badge>
                  </span>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateNewSnippet}
                    className="ml-auto"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Snippet
                  </Button>
                </CardTitle>
                {snippetDescription && (
                  <CardDescription>
                    {snippetDescription}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="code-wrapper relative">
                  <pre className={`code-snippet ${showLineNumbers ? 'with-line-numbers' : ''} rounded-md`}>
                    <code className="code-content">
                      {practiceText}
                    </code>
                  </pre>
                  
                  {/* Progress overlay */}
                  <div className="absolute top-0 left-0 h-full bg-primary/10 pointer-events-none" 
                       style={{ width: `${(userInput.length / practiceText.length) * 100}%`, transition: 'width 0.2s ease-in-out' }}/>
                  
                  {/* Error highlighting */}
                  {inlineErrors && userInput.length > 0 && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none error-overlay">
                      {Array.from({length: Math.min(userInput.length, practiceText.length)}).map((_, index) => {
                        if (userInput[index] !== practiceText[index]) {
                          // Calculate position (this is an approximation)
                          const lineHeight = 24; // Approximate line height
                          const charWidth = 9.6; // Approximate character width for monospace font
                          
                          // Count newlines before this character to determine y position
                          const textBeforeChar = practiceText.substring(0, index);
                          const newlines = (textBeforeChar.match(/\n/g) || []).length;
                          
                          // Find the last newline to determine x position
                          const lastNewline = textBeforeChar.lastIndexOf('\n');
                          const charsInLine = lastNewline >= 0 ? index - lastNewline - 1 : index;
                          
                          return (
                            <div 
                              key={index}
                              className="absolute bg-red-500/30 border-b-2 border-red-500"
                              style={{
                                top: `${newlines * lineHeight}px`,
                                left: `${charsInLine * charWidth}px`,
                                width: `${charWidth}px`,
                                height: `${lineHeight}px`
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
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
                  className="w-full p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-[var(--code-bg)]"
                  placeholder={`Start typing the ${getLanguageDisplayName(codeLanguage)} code above...`}
                  rows={8}
                  disabled={showResults}
                  spellCheck={false}
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
                      <Button onClick={generateNewSnippet}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Practice Another Snippet
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
      
      <style dangerouslySetInnerHTML={{ __html: `
        .code-wrapper {
          position: relative;
          max-height: 400px;
          overflow: auto;
          background-color: #1e1e1e;
          border-radius: 0.5rem;
        }
        
        .code-snippet {
          margin: 0;
          padding: 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          border-radius: 0.5rem;
          overflow: auto;
          white-space: pre;
          tab-size: 4;
        }
        
        .with-line-numbers {
          counter-reset: line;
          padding-left: 3.8rem;
          position: relative;
        }
        
        .with-line-numbers > code {
          position: relative;
        }
        
        .with-line-numbers > code::before {
          content: counter(line);
          counter-increment: line;
          position: absolute;
          left: -3.5rem;
          width: 3rem;
          text-align: right;
          color: #858585;
        }
        
        .error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          padding: 1rem;
        }
        
        /* Simple syntax highlighting */
        /* For all languages */
        .code-content {
          color: #d4d4d4;
        }
        
        /* Add more specific syntax highlighting rules if needed */
        
        /* For dark mode adjustments */
        .dark .code-wrapper {
          background-color: #1e1e1e;
        }
        
        .dark .code-snippet {
          background: #1e1e1e;
          color: #d4d4d4;
        }
      `}} />
    </ThemeProvider>
  );
};

export default CodePractice;
