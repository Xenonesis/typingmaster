import React, { createContext, useState, useEffect, useContext } from "react";
import { TestResultsData } from "@/components/TestResults";
import { toast } from "@/hooks/use-toast";

// Enhanced interface for user typing statistics
interface TypingStats {
  wpm: number;
  accuracy: number;
  rank: number;
  errorData: Record<string, number>;
  recentTests: TestResultsData[];
  totalTestsCompleted: number;
  totalCharactersTyped: number;
  bestWpm: number;
  bestAccuracy: number;
  improvementRate: number;
  streakDays: number;
  lastActive: number;
  dataLastUpdated: number; // Timestamp to track when data was last updated
}

// Interface for the context
interface TypingStatsContextType {
  stats: TypingStats;
  refreshStats: () => void;
  trackError: (character: string) => void;
  clearErrorData: () => void;
  hasRealData: boolean;
  compareWithLeaderboard: (leaderboardData: any[]) => LeaderboardComparison;
}

// Add a new interface for leaderboard comparison results
interface LeaderboardComparison {
  userRank: number;
  percentile: number;
  wpmDifferenceToTop: number;
  wpmDifferenceToAverage: number;
  improvementNeeded: number;
  comparisonDate: Date;
}

// Default values
const defaultStats: TypingStats = {
  wpm: 0,
  accuracy: 0,
  rank: 0,
  errorData: {},
  recentTests: [],
  totalTestsCompleted: 0,
  totalCharactersTyped: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  improvementRate: 0,
  streakDays: 0,
  lastActive: Date.now(),
  dataLastUpdated: 0
};

// Create the context
const TypingStatsContext = createContext<TypingStatsContextType | undefined>(undefined);

export const TypingStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<TypingStats>(defaultStats);
  const [hasRealData, setHasRealData] = useState(false);

  // Function to track errors when typing
  const trackError = (character: string) => {
    if (!character) return;
    
    setStats(prevStats => {
      const newErrorData = { ...prevStats.errorData };
      newErrorData[character] = (newErrorData[character] || 0) + 1;
      
      // Store the updated error data to persist between sessions
      try {
        localStorage.setItem("typingErrorData", JSON.stringify(newErrorData));
      } catch (error) {
        console.error("Error saving error data:", error);
      }
      
      return {
        ...prevStats,
        errorData: newErrorData,
        dataLastUpdated: Date.now()
      };
    });
    
    setHasRealData(true);
  };
  
  // Function to clear error data (for testing or resetting)
  const clearErrorData = () => {
    setStats(prevStats => {
      const updatedStats = {
        ...prevStats,
        errorData: {},
        dataLastUpdated: Date.now()
      };
      
      try {
        localStorage.removeItem("typingErrorData");
        toast({
          title: "Error data cleared",
          description: "Your typing error data has been reset."
        });
      } catch (error) {
        console.error("Error clearing error data:", error);
      }
      
      return updatedStats;
    });
  };

  // Function to calculate streak days
  const calculateStreakDays = (tests: TestResultsData[]): number => {
    if (tests.length === 0) return 0;
    
    // Sort tests by date (newest first)
    const sortedTests = [...tests].sort((a, b) => b.date - a.date);
    
    // Check if there's a test from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const hasTestToday = sortedTests.some(test => {
      const testDate = new Date(test.date);
      testDate.setHours(0, 0, 0, 0);
      return testDate.getTime() === todayTimestamp;
    });
    
    if (!hasTestToday) return 0;
    
    // Count consecutive days with tests
    let streakCount = 1;
    let currentDay = todayTimestamp;
    
    while (true) {
      // Check previous day
      const previousDay = new Date(currentDay - 86400000); // 24 hours in milliseconds
      previousDay.setHours(0, 0, 0, 0);
      const previousDayTimestamp = previousDay.getTime();
      
      const hasTestOnPreviousDay = sortedTests.some(test => {
        const testDate = new Date(test.date);
        testDate.setHours(0, 0, 0, 0);
        return testDate.getTime() === previousDayTimestamp;
      });
      
      if (hasTestOnPreviousDay) {
        streakCount++;
        currentDay = previousDayTimestamp;
      } else {
        break;
      }
    }
    
    return streakCount;
  };

  // Function to calculate improvement rate (% change in WPM over last 5 tests)
  const calculateImprovementRate = (tests: TestResultsData[]): number => {
    if (tests.length < 5) return 0;
    
    // Sort tests by date (oldest first)
    const sortedTests = [...tests].sort((a, b) => a.date - b.date);
    
    // Take the first and last tests from the last 5 tests
    const recentTests = sortedTests.slice(-5);
    const firstTest = recentTests[0];
    const lastTest = recentTests[recentTests.length - 1];
    
    // Calculate improvement percentage
    if (firstTest.wpm === 0) return 0;
    return Math.round(((lastTest.wpm - firstTest.wpm) / firstTest.wpm) * 100);
  };

  // Function to load and calculate stats from localStorage
  const refreshStats = () => {
    try {
      // Load personal bests from localStorage
      const storedData = localStorage.getItem("typingPersonalBests");
      const typingResults: TestResultsData[] = storedData ? JSON.parse(storedData) : [];

      // Load error data from localStorage
      const storedErrorData = localStorage.getItem("typingErrorData");
      const errorData: Record<string, number> = storedErrorData ? JSON.parse(storedErrorData) : {};

      // Check if we have real data
      const hasErrors = Object.keys(errorData).length > 0;
      const hasTests = typingResults.length > 0;
      
      setHasRealData(hasErrors || hasTests);

      if (!hasTests && !hasErrors) {
        // If no data at all, just set default stats
        setStats({
          ...defaultStats,
          dataLastUpdated: Date.now()
        });
        return;
      }

      // Process typing test results if available
      if (hasTests) {
        // Sort by date (newest first)
        const sortedByDate = [...typingResults].sort((a, b) => b.date - a.date);
        
        // Sort by WPM (highest first) for best performance
        const sortedByWpm = [...typingResults].sort((a, b) => b.wpm - a.wpm);
        
        // Calculate average WPM from last 5 tests (or fewer if not enough)
        const recentTestCount = Math.min(sortedByDate.length, 5);
        const recentTests = sortedByDate.slice(0, recentTestCount);
        const avgWpm = recentTests.reduce((sum, test) => sum + test.wpm, 0) / recentTestCount;
        
        // Calculate average accuracy
        const avgAccuracy = recentTests.reduce((sum, test) => sum + test.accuracy, 0) / recentTestCount;
        
        // Determine rank (simplified for now)
        // This would typically involve a server call or a more complex algorithm
        let rank = Math.max(1, Math.min(99, Math.floor(avgWpm / 10)));
        
        // Calculate total characters typed - more accurate calculation
        const totalCharactersTyped = typingResults.reduce((sum, test) => {
          // Better estimate of characters from WPM and time
          const testChars = test.time * (test.cpm / 60);
          return sum + Math.round(testChars);
        }, 0);
        
        // Get best scores
        const bestWpm = sortedByWpm.length > 0 ? sortedByWpm[0].wpm : 0;
        const sortedByAccuracy = [...typingResults].sort((a, b) => b.accuracy - a.accuracy);
        const bestAccuracy = sortedByAccuracy.length > 0 ? sortedByAccuracy[0].accuracy : 0;
        
        // Calculate improvement rate
        const improvementRate = calculateImprovementRate(typingResults);
        
        // Calculate streak days
        const streakDays = calculateStreakDays(typingResults);
        
        // Update state with calculated stats
        setStats({
          wpm: Math.round(avgWpm),
          accuracy: Math.round(avgAccuracy * 10) / 10, // Round to 1 decimal place
          rank,
          errorData,
          recentTests: sortedByDate.slice(0, 10), // Keep last 10 tests
          totalTestsCompleted: typingResults.length,
          totalCharactersTyped,
          bestWpm,
          bestAccuracy,
          improvementRate,
          streakDays,
          lastActive: Date.now(),
          dataLastUpdated: Date.now()
        });
      } else if (hasErrors) {
        // If we only have error data, update just that part
        setStats(prevStats => ({
          ...prevStats,
          errorData,
          dataLastUpdated: Date.now()
        }));
      }
    } catch (error) {
      console.error("Error loading typing stats:", error);
      // On error, set to default values to prevent crashes
      setStats({
        ...defaultStats,
        dataLastUpdated: Date.now()
      });
    }
  };

  /**
   * Compare user's performance with a leaderboard and calculate ranking metrics
   */
  const compareWithLeaderboard = (leaderboardData: any[]): LeaderboardComparison => {
    if (!leaderboardData || leaderboardData.length === 0) {
      return {
        userRank: 0,
        percentile: 0,
        wpmDifferenceToTop: 0,
        wpmDifferenceToAverage: 0,
        improvementNeeded: 0,
        comparisonDate: new Date()
      };
    }
    
    // Default comparison object
    const comparison: LeaderboardComparison = {
      userRank: leaderboardData.length + 1, // Default to last place
      percentile: 0,
      wpmDifferenceToTop: 0,
      wpmDifferenceToAverage: 0,
      improvementNeeded: 0,
      comparisonDate: new Date()
    };
    
    // Extract WPM values from leaderboard and sort them in descending order
    const leaderboardWpms = leaderboardData
      .map(entry => typeof entry.best_wpm === 'number' ? entry.best_wpm : 
                   (typeof entry.wpm === 'number' ? entry.wpm : 0))
      .filter(wpm => wpm > 0)
      .sort((a, b) => b - a);
    
    if (leaderboardWpms.length === 0) return comparison;
    
    // Get the top WPM and calculate average
    const topWpm = leaderboardWpms[0];
    const averageWpm = leaderboardWpms.reduce((sum, wpm) => sum + wpm, 0) / leaderboardWpms.length;
    
    // User's best WPM from stats
    const userBestWpm = stats.bestWpm;
    
    // Calculate the user's rank and percentile
    let userRank = leaderboardWpms.findIndex(wpm => userBestWpm >= wpm);
    if (userRank === -1) {
      // User's WPM is lower than all entries
      userRank = leaderboardWpms.length;
    }
    // Add 1 because array indices are 0-based
    userRank += 1;
    
    // Calculate percentile (higher is better)
    const percentile = ((leaderboardWpms.length - userRank + 1) / leaderboardWpms.length) * 100;
    
    // Calculate WPM differences
    const wpmDifferenceToTop = topWpm - userBestWpm;
    const wpmDifferenceToAverage = userBestWpm - averageWpm;
    
    // Calculate improvement needed to reach next rank
    let improvementNeeded = 0;
    if (userRank > 1) {
      const nextRankWpm = leaderboardWpms[userRank - 2]; // -2 because of 0-index and we want the entry above
      improvementNeeded = nextRankWpm - userBestWpm + 1; // +1 to ensure overtaking
    }
    
    return {
      userRank,
      percentile: parseFloat(percentile.toFixed(1)),
      wpmDifferenceToTop: Math.max(0, Math.round(wpmDifferenceToTop)),
      wpmDifferenceToAverage: Math.round(wpmDifferenceToAverage),
      improvementNeeded: Math.max(0, Math.round(improvementNeeded)),
      comparisonDate: new Date()
    };
  };

  // Load stats on mount
  useEffect(() => {
    refreshStats();
    
    // Set up a listener for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "typingPersonalBests" || e.key === "typingErrorData") {
        refreshStats();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Auto-refresh stats every 5 minutes if the page stays open
    const intervalId = setInterval(refreshStats, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <TypingStatsContext.Provider
      value={{
        stats,
        refreshStats,
        trackError,
        clearErrorData,
        hasRealData,
        compareWithLeaderboard
      }}
    >
      {children}
    </TypingStatsContext.Provider>
  );
};

export const useTypingStats = (): TypingStatsContextType => {
  const context = useContext(TypingStatsContext);
  if (context === undefined) {
    throw new Error("useTypingStats must be used within a TypingStatsProvider");
  }
  return context;
}; 