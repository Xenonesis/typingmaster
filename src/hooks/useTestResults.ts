import { useState, useEffect } from "react";
import { TestResultsData } from "@/components/TestResults";

export function useTestResults(results: TestResultsData | null) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [personalBests, setPersonalBests] = useState<TestResultsData[]>([]);
  
  useEffect(() => {
    if (results) {
      // Get existing personal bests from localStorage
      const existingBests = JSON.parse(localStorage.getItem("typingPersonalBests") || "[]");
      
      // Add new result
      const newBests = [...existingBests, results];
      
      // Sort by WPM in descending order
      newBests.sort((a, b) => b.wpm - a.wpm);
      
      // Keep only the top 10
      const topBests = newBests.slice(0, 10);
      
      // Update localStorage
      localStorage.setItem("typingPersonalBests", JSON.stringify(topBests));
      
      // Update state
      setPersonalBests(topBests);
    } else {
      // Just load data from localStorage
      const existingBests = JSON.parse(localStorage.getItem("typingPersonalBests") || "[]");
      setPersonalBests(existingBests);
    }
  }, [results]);

  const toggleLeaderboard = () => setShowLeaderboard(!showLeaderboard);

  return {
    showLeaderboard,
    personalBests,
    toggleLeaderboard
  };
}
