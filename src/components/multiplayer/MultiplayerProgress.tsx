import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Flag, Trophy } from "lucide-react";

interface Participant {
  id: string | number;
  name: string;
  avatar?: string;
  progress: number;
  wpm: number;
  accuracy: number;
  isCurrentUser?: boolean;
  status: "waiting" | "racing" | "finished";
}

interface MultiplayerProgressProps {
  participants: Participant[];
  raceStarted: boolean;
  raceFinished: boolean;
}

export function MultiplayerProgress({
  participants,
  raceStarted,
  raceFinished
}: MultiplayerProgressProps) {
  // Sort participants by progress (highest first)
  const sortedParticipants = [...participants].sort((a, b) => b.progress - a.progress);
  
  // Find the winner (first participant with 100% progress or highest progress if race finished)
  const winner = raceFinished ? sortedParticipants[0] : sortedParticipants.find(p => p.progress === 100);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Race Progress</h3>
      
      <div className="space-y-4">
        {sortedParticipants.map((participant) => (
          <div 
            key={participant.id}
            className={cn(
              "p-3 rounded-lg transition-all",
              participant.isCurrentUser ? "bg-primary/10 border border-primary/30" : "bg-secondary/50",
              winner && winner.id === participant.id && "bg-amber-500/10 border border-amber-500/30"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{participant.name}</span>
                    {participant.isCurrentUser && <Badge variant="outline" className="text-xs">You</Badge>}
                    {winner && winner.id === participant.id && (
                      <Badge className="bg-amber-500 text-white gap-1">
                        <Trophy className="h-3 w-3" />
                        <span>Winner</span>
                      </Badge>
                    )}
                  </div>
                  {raceStarted && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{participant.wpm} WPM</span>
                      <span>•</span>
                      <span>{participant.accuracy}% Accuracy</span>
                    </div>
                  )}
                </div>
              </div>
              
              <StatusBadge status={participant.status} />
            </div>
            
            <div className="relative">
              <Progress 
                value={participant.progress} 
                className={cn(
                  "h-2.5",
                  winner && winner.id === participant.id ? "bg-amber-500/30" : ""
                )}
              />
              
              {participant.progress > 0 && (
                <motion.div
                  className={cn(
                    "absolute top-0 bottom-0 left-0 h-2.5 rounded-full",
                    winner && winner.id === participant.id ? "bg-amber-500" : "bg-primary"
                  )}
                  style={{ width: `${participant.progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${participant.progress}%` }}
                  transition={{ type: "spring", damping: 15 }}
                />
              )}
              
              {participant.progress === 100 && (
                <motion.div 
                  className="absolute -right-1 top-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Flag className="h-4 w-4 text-green-500" />
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "waiting" | "racing" | "finished" }) {
  let color = "bg-muted text-muted-foreground";
  let label = "Waiting";

  if (status === "racing") {
    color = "bg-blue-500/10 text-blue-500 border-blue-500/30";
    label = "Racing";
  } else if (status === "finished") {
    color = "bg-green-500/10 text-green-500 border-green-500/30";
    label = "Finished";
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${color}`}>
      {label}
    </span>
  );
} 