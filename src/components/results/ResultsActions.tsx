
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy } from "lucide-react";

interface ResultsActionsProps {
  showLeaderboard: boolean;
  onToggleLeaderboard: () => void;
  onRestart: () => void;
}

export function ResultsActions({
  showLeaderboard,
  onToggleLeaderboard,
  onRestart,
}: ResultsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <Button
        variant="outline"
        className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        onClick={onToggleLeaderboard}
      >
        {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
        <Trophy className="h-4 w-4" />
      </Button>
      
      <Button 
        className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        onClick={onRestart}
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
