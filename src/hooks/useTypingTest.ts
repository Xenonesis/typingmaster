import { useState, useEffect, useRef, useCallback } from "react";
import { getRandomParagraph, calculateWPM, calculateCPM, calculateAccuracy, challengeTypes, ChallengeType } from "@/utils/textGenerator";
import { toast } from "@/hooks/use-toast";
import { TestResultsData } from "@/components/TestResults";
import { useAchievements } from "@/context/AchievementsContext";
import { useTypingStats } from "@/context/TypingStatsContext";

// Create a simple debounce function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Optimize character state updates for better performance
const createOptimizedCharStateUpdater = () => {
  let lastStates: Array<"neutral" | "correct" | "incorrect" | "current"> | null = null;
  
  return (
    text: string,
    index: number,
    isCorrect: boolean
  ): Array<"neutral" | "correct" | "incorrect" | "current"> => {
    // Create a new array only if needed for better memory performance
    if (!lastStates || lastStates.length !== text.length) {
      lastStates = text.split("").map((_, i) => (i === 0 ? "current" : "neutral"));
    }
    
    // Create a new array only for the modified characters
    const newStates = [...lastStates];
    
    // Update current index state
    if (index > 0) {
      newStates[index - 1] = isCorrect ? "correct" : "incorrect";
    }
    
    // Update the current character indicator
    if (index < text.length) {
      newStates[index] = "current";
    }
    
    lastStates = newStates;
    return newStates;
  };
};

// Implement a more efficient character state update
const updateCharStatesEfficiently = (
  text: string,
  input: string,
  index: number
): Array<"neutral" | "correct" | "incorrect" | "current"> => {
  // Create an array filled with initial values
  const result = new Array(text.length).fill('neutral') as Array<"neutral" | "correct" | "incorrect" | "current">;
  
  // Process the entire input for accuracy
  for (let i = 0; i < text.length; i++) {
    if (i < index) {
      // Character has been typed
      result[i] = text[i] === input[i] ? 'correct' : 'incorrect';
    } else if (i === index) {
      // Current character position
      result[i] = 'current';
    } else {
      // Not yet typed
      result[i] = 'neutral';
    }
  }
  
  // Handle case where input is longer than text (user typed too many characters)
  if (index >= text.length && text.length > 0) {
    result[text.length - 1] = 'incorrect';
  }
  
  return result;
};

export function useTypingTest() {
  const [text, setText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [charStates, setCharStates] = useState<Array<"neutral" | "correct" | "incorrect" | "current">>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const [time, setTime] = useState<number>(60);
  const [countdownValue, setCountdownValue] = useState<number | null>(null); // Add countdown state
  const [showCountdown, setShowCountdown] = useState(false); // Control whether to show countdown
  const [results, setResults] = useState<TestResultsData | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [typedCharsInfo, setTypedCharsInfo] = useState<Array<{char: string, correct: boolean}>>([]);
  const [difficulty, setDifficulty] = useState<ChallengeType>("intermediate");
  const [useCustomText, setUseCustomText] = useState(false);
  const [useMistralAI, setUseMistralAI] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedStartTime, setPausedStartTime] = useState<number | null>(null);
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [lastErrorKey, setLastErrorKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateProgress } = useAchievements();
  const { refreshStats, trackError } = useTypingStats();
  
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Replace the optimizedUpdateCharStates with our more efficient version
  const updateCharStatesRef = useRef(updateCharStatesEfficiently);
  
  // Use requestAnimationFrame for smoother UI updates
  const updateUIRef = useRef<number | null>(null);
  
  // Add performance tracking
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(performance.now());
  const [averageFrameTime, setAverageFrameTime] = useState(0);
  const frameTimesRef = useRef<number[]>([]);
  
  // Track performance metrics when enabled
  useEffect(() => {
    if (isRunning) {
      const now = performance.now();
      const elapsed = now - lastRenderTime;
      
      frameTimesRef.current.push(elapsed);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }
      
      // Calculate average frame time
      const avg = frameTimesRef.current.reduce((sum, time) => sum + time, 0) / 
                  frameTimesRef.current.length;
      
      setAverageFrameTime(avg);
      setLastRenderTime(now);
      setRenderCount(prev => prev + 1);
    }
  });
  
  // Define endTest at the beginning to avoid reference issues
  const endTest = useCallback(() => {
    if (!isRunning) return;
    
    // Immediately stop the test
    setIsRunning(false);
    setTestComplete(true);
    
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Force a small delay to ensure all state updates have completed
    setTimeout(() => {
      try {
        // Get accurate counts from the typedCharsInfo array to avoid state inconsistencies
        const typedCount = typedCharsInfo.length;
        
        // Filter only characters that were typed correctly
        const correctCount = typedCharsInfo.filter(info => info.correct).length;
        
        // Calculate final elapsed time, ensure at least 1 second for calculation
        const finalElapsedTime = Math.max(elapsedTime || 1, 1); 
        
        // Log final test values for debugging
        console.log("Final test values:", {
          typedCount,
          correctCount,
          elapsedTime: finalElapsedTime,
          typedCharsInfo
        });
        
        // Calculate results directly
        let wpm = 0, cpm = 0, accuracy = 0;
        
        // Only calculate if we have valid data
        if (typedCount > 0 && finalElapsedTime > 0) {
          wpm = calculateWPM(typedCount, correctCount, finalElapsedTime);
          cpm = calculateCPM(typedCount, finalElapsedTime);
          accuracy = calculateAccuracy(typedCount, correctCount);
        }
        
        // Ensure results are valid numbers
        wpm = isNaN(wpm) ? 0 : wpm;
        cpm = isNaN(cpm) ? 0 : cpm;
        accuracy = isNaN(accuracy) ? 0 : accuracy;
        
        const newResults: TestResultsData = {
          wpm,
          cpm,
          accuracy,
          time: finalElapsedTime,
          date: Date.now(),
          difficulty,
        };
        
        console.log("Calculated results:", newResults);
        
        // Set the results
        setResults(newResults);
        
        // Save results to localStorage only if they're valid
        if (wpm > 0 || cpm > 0) {
          try {
            const storedResultsJSON = localStorage.getItem("typingPersonalBests");
            const storedResults: TestResultsData[] = storedResultsJSON 
              ? JSON.parse(storedResultsJSON) 
              : [];
            const updatedResults = [...storedResults, newResults];
            
            localStorage.setItem("typingPersonalBests", JSON.stringify(updatedResults));
            
            // Update achievements only if we have valid results
            // Update test completion achievements
            updateProgress('tests_completed_10', updatedResults.length);
            updateProgress('tests_completed_50', updatedResults.length);
            updateProgress('tests_completed_100', updatedResults.length);
            updateProgress('tests_completed_500', updatedResults.length);
            
            // Update speed achievements
            if (wpm > 0) {
              updateProgress('wpm_40', wpm);
              updateProgress('wpm_70', wpm);
              updateProgress('wpm_100', wpm);
              updateProgress('wpm_120', wpm);
              updateProgress('wpm_150', wpm);
            }
            
            // Update accuracy achievements
            if (accuracy > 0) {
              updateProgress('accuracy_95', accuracy);
              updateProgress('accuracy_98', accuracy);
              if (accuracy === 100) {
                updateProgress('accuracy_100', accuracy);
              }
            }
            
            // Update difficulty-based achievements
            if (difficulty === 'advanced') {
              updateProgress('advanced_tests_10', 1);
            } else if (difficulty === 'expert') {
              updateProgress('expert_tests_5', 1);
            }
            
            // Update code typing achievements
            if (difficulty === 'code') {
              updateProgress('code_tests_10', 1);
              updateProgress('code_tests_50', 1);
              if (wpm > 0) {
                updateProgress('code_wpm_60', wpm);
              }
            }
            
            // Update time-based achievements
            if (finalElapsedTime >= 300) { // 5 minutes or more
              updateProgress('long_test_completed', 1);
            }
            
            // Check for new personal best
            const personalBest = storedResults.reduce(
              (max, result) => (result.wpm > max ? result.wpm : max),
              0
            );
            
            if (wpm > personalBest && wpm > 0) {
              toast({
                title: "🎉 New Personal Best!",
                description: `You beat your previous best of ${personalBest} WPM!`,
              });
            }
            
            // Refresh typing stats to update the UI with new data
            refreshStats();
          } catch (storageError) {
            console.error("Storage error:", storageError);
          }
        }
      } catch (error) {
        console.error("Error calculating results:", error);
        setError("An error occurred while calculating your results.");
        toast({
          title: "Error Calculating Results",
          description: "There was a problem calculating your results. Please try again.",
          variant: "destructive",
        });
        
        // Set empty results
        setResults({
          wpm: 0,
          cpm: 0,
          accuracy: 0,
          time: elapsedTime || 0,
          date: Date.now(),
          difficulty,
        });
      }
    }, 100); // Small delay to ensure state updates have completed
  }, [isRunning, typedCharsInfo, elapsedTime, difficulty, updateProgress, refreshStats]);

  // Initialize remainingTime whenever time changes
  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  // Replace the elapsedTime with remainingTime
  const [remainingTime, setRemainingTime] = useState<number>(time);

  // Memoize the initializeTest callback to prevent unnecessary rerenders
  const initializeTest = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Clear any existing timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      // Get the random paragraph based on difficulty and custom text preference
      const newText = await getRandomParagraph(difficulty, useCustomText, useMistralAI);
      
      if (!newText || newText.trim().length === 0) {
        throw new Error("Empty text generated");
      }
      
      if (newText.length < 10) {
        throw new Error("Text is too short for a proper typing test");
      }
      
      setText(newText);
      setUserInput("");
      setCurrentIndex(0);
      
      // Use optimized char states update
      setCharStates(newText.split("").map((_, i) => (i === 0 ? "current" : "neutral")));
      
      // Reset all states in a single batch update
      setTestComplete(false);
      setIsRunning(false);
      setIsPaused(false);
      setResults(null);
      setCorrectChars(0);
      setTotalTypedChars(0);
      setTypedCharsInfo([]);
      setIsFocused(false);
      setElapsedTime(0);
      setPausedStartTime(null);
      setLastPressedKey(null);
      setLastErrorKey(null);
      setError(null);
      setRemainingTime(time); // Initialize with full time
    } catch (error) {
      console.error("Error initializing test:", error);
      const fallbackText = "The quick brown fox jumps over the lazy dog.";
      setText(fallbackText);
      setCharStates(fallbackText.split("").map((_, i) => (i === 0 ? "current" : "neutral")));
      setError("Failed to initialize the typing test. Using fallback text.");
      toast({
        title: "Error Starting Test",
        description: "Could not set up the typing test with the desired text. Using fallback text instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, useCustomText, useMistralAI]);

  // Initialize on first render
  useEffect(() => {
    initializeTest();
    
    // Load countdown preference
    const savedShowCountdown = localStorage.getItem("typingShowCountdown");
    if (savedShowCountdown !== null) {
      setShowCountdown(savedShowCountdown === "true");
    } else {
      // Default to true if not set
      setShowCountdown(true);
      localStorage.setItem("typingShowCountdown", "true");
    }
  }, [initializeTest]);

  // Initialize when difficulty or useCustomText changes
  useEffect(() => {
    initializeTest();
  }, [difficulty, useCustomText, initializeTest]);

  // Focus input when test starts
  useEffect(() => {
    if (isRunning && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isRunning]);

  // Scroll to current character
  useEffect(() => {
    if (textContainerRef.current && currentIndex > 0) {
      const currentChar = textContainerRef.current.querySelector(`.char-${currentIndex}`);
      if (currentChar) {
        currentChar.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [currentIndex]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Skip if not running, test is complete, or paused
    if (!isRunning || testComplete || isPaused) return;
    
    const input = e.target.value;
    setUserInput(input);
    
    // Update currentIndex
    const newIndex = input.length;
    setCurrentIndex(newIndex);
    
    // Update last pressed key
    if (input.length > 0 && userInput.length < input.length) {
      const lastChar = input[input.length - 1];
      setLastPressedKey(lastChar);
      
      // Check if the key was correct
      const targetIndex = input.length - 1;
      const isValidIndex = targetIndex < text.length;
      const expectedChar = isValidIndex ? text[targetIndex] : null;
      
      if (isValidIndex && expectedChar !== lastChar) {
        setLastErrorKey(lastChar);
        
        // Track error through the context
        trackError(lastChar);
      }
    }
    
    // Record the character info for this keypress
    if (input.length > userInput.length) {
      const newChar = input[input.length - 1];
      const targetIndex = input.length - 1;
      
      // Only consider valid characters within the text bounds
      if (targetIndex < text.length) {
        const targetChar = text[targetIndex];
        const isCorrect = newChar === targetChar;
        
        setTypedCharsInfo(prev => [...prev, { char: newChar, correct: isCorrect }]);
        
        if (isCorrect) {
          setCorrectChars(prev => prev + 1);
        }
      } else {
        // If typing beyond text bounds, count as incorrect
        setTypedCharsInfo(prev => [...prev, { char: newChar, correct: false }]);
      }
      
      setTotalTypedChars(prev => prev + 1);
    }
    
    // Use requestAnimationFrame for smoother UI updates
    if (updateUIRef.current) {
      cancelAnimationFrame(updateUIRef.current);
    }
    
    updateUIRef.current = requestAnimationFrame(() => {
      // Update character states
      const newCharStates = updateCharStatesRef.current(text, input, newIndex);
      setCharStates(newCharStates);
      
      // Check if test is complete - only if user has reached the end of the text
      if (newIndex >= text.length) {
        endTest();
      }
    });
  }, [isRunning, testComplete, isPaused, text, userInput, endTest, trackError]);

  // Cleanup requestAnimationFrame on unmount
  useEffect(() => {
    return () => {
      if (updateUIRef.current) {
        cancelAnimationFrame(updateUIRef.current);
      }
    };
  }, []);

  // Track key presses for keyboard visualization
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isRunning) {
      if (isPaused) {
        resumeTest();
      } else {
        pauseTest();
      }
      return;
    }

    // Update last pressed key for keyboard visualization
    if (isRunning && !isPaused && !testComplete) {
      setLastPressedKey(e.key);
    }
  }, [isRunning, isPaused, testComplete]);

  // Start the test
  const startTest = () => {
    try {
      if (showCountdown) {
        // Start the countdown
        setCountdownValue(3);
        
        // Create countdown interval
        const countdownInterval = setInterval(() => {
          setCountdownValue((prevValue) => {
            if (prevValue === null || prevValue <= 1) {
              clearInterval(countdownInterval);
              
              // Start the actual test after countdown completes
              setCountdownValue(null);
              setIsRunning(true);
              setUserInput("");
              setIsFocused(true);
              setElapsedTime(0); // Reset elapsed time
              startTimer(); // Start the timer here
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
              
              return null;
            }
            return prevValue - 1;
          });
        }, 1000);
      } else {
        // Start test immediately without countdown
        setIsRunning(true);
        setUserInput("");
        setIsFocused(true);
        setElapsedTime(0); // Reset elapsed time
        startTimer(); // Start the timer here
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }
      
      setError(null);
      toast({
        title: "Test started!",
        description: `You have ${time} seconds to type the text.`,
      });
    } catch (error) {
      console.error("Error starting test:", error);
      setError("Failed to start the test.");
      setIsRunning(false);
      toast({
        title: "Error Starting Test",
        description: "Could not start the typing test. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Restart the test
  const restartTest = () => {
    try {
      // Clear any existing timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      setElapsedTime(0); // Reset elapsed time
      setIsRunning(false); // Stop the test
      setIsPaused(false); // Ensure not paused
      setTestComplete(false); // Reset completion status
      
      initializeTest();
      toast({
        title: "Test reset",
        description: "Ready for a new challenge!",
      });
    } catch (error) {
      console.error("Error restarting test:", error);
      setError("Failed to restart the test.");
      toast({
        title: "Error Restarting Test",
        description: "Could not restart the typing test. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  // Handle click on the text container
  const handleTextContainerClick = () => {
    if (isRunning && textInputRef.current) {
      textInputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Handle focus/blur
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Pause test
  const pauseTest = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      
      // Clear the timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // Resume test
  const resumeTest = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      
      // Restart the timer
      startTimer();
    }
  };

  // Start the timer function
  const startTimer = () => {
    // Clear existing timer if any
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Set new timer as countdown
    timerIntervalRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          endTest();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  // Set up key event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    // Create a reference to endTest to avoid dependency issues
    const handleEndTest = () => {
      endTest();
    };
    
    if (isRunning && !isPaused) {
      // Clear any existing interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      // Start a new timer
      timerIntervalRef.current = window.setInterval(() => {
        setRemainingTime(prevRemaining => {
          // If time is about to reach zero, clear the interval and end the test
          if (prevRemaining <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            
            // End the test on the next tick to ensure state consistency
            setTimeout(() => {
              handleEndTest();
            }, 0);
            
            return 0;
          }
          
          // Otherwise, decrement the time
          return prevRemaining - 1;
        });
        
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      // Stop the timer if not running or paused
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Cleanup
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRunning, isPaused]);

  return {
    text,
    charStates,
    isRunning,
    isPaused,
    testComplete,
    time,
    setTime,
    remainingTime,
    results,
    difficulty,
    useCustomText,
    useMistralAI,
    isFocused,
    isLoading,
    textContainerRef,
    textInputRef,
    userInput,
    lastPressedKey,
    lastErrorKey,
    error,
    countdownValue,
    showCountdown,
    setDifficulty,
    setUseCustomText,
    setUseMistralAI,
    endTest,
    handleInputChange,
    startTest,
    restartTest,
    handleTextContainerClick,
    handleFocus,
    handleBlur,
    pauseTest,
    resumeTest,
    averageFrameTime,
    renderCount,
    currentIndex,
    setRemainingTime
  };
}
