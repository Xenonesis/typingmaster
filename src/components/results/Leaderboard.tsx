
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestResultsData } from "../TestResults";

interface LeaderboardProps {
  personalBests: TestResultsData[];
}

export function Leaderboard({ personalBests }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<"recent" | "best">("best");

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case "beginner": return "text-green-500";
      case "advanced": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Intermediate";
  };

  return (
    <Card className="glass mb-8 animate-scale-in overflow-hidden">
      <div className="bg-accent/10 py-3 px-6 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Personal Records
          </CardTitle>
          
          <div className="flex rounded-md overflow-hidden">
            <Button 
              variant={activeTab === "best" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setActiveTab("best")}
            >
              Best
            </Button>
            <Button 
              variant={activeTab === "recent" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setActiveTab("recent")}
            >
              Recent
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40">
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Rank</th>
                <th className="text-right py-3 px-4 font-medium">WPM</th>
                <th className="text-right py-3 px-4 font-medium">CPM</th>
                <th className="text-right py-3 px-4 font-medium">Accuracy</th>
                <th className="text-right py-3 px-4 font-medium">Difficulty</th>
                <th className="text-right py-3 px-4 font-medium">Time</th>
                <th className="text-right py-3 px-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "best" ? 
                [...personalBests].sort((a, b) => b.wpm - a.wpm) : 
                [...personalBests].sort((a, b) => b.date - a.date)
              ).map((best, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-background/20 transition-colors">
                  <td className="py-3 px-4 font-medium">
                    {activeTab === "best" && index === 0 ? (
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary">1</span>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="text-right py-3 px-4 font-mono">{best.wpm}</td>
                  <td className="text-right py-3 px-4 font-mono">{best.cpm}</td>
                  <td className="text-right py-3 px-4 font-mono">{best.accuracy}%</td>
                  <td className={cn("text-right py-3 px-4", getDifficultyColor(best.difficulty))}>
                    {getDifficultyLabel(best.difficulty)}
                  </td>
                  <td className="text-right py-3 px-4 font-mono">{best.time}s</td>
                  <td className="text-right py-3 px-4">
                    {new Date(best.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
