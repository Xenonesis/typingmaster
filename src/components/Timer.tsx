
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Clock, Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  time: number;
  isRunning: boolean;
  onTimeEnd: () => void;
  onTimeChange: (time: number) => void;
  className?: string;
}

export function Timer({ time, isRunning, onTimeEnd, onTimeChange, className }: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(time);
  const [circumference] = useState(2 * Math.PI * 45);
  
  // Set time options
  const timeOptions = [15, 30, 60];

  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  useEffect(() => {
    let intervalId: number;
    
    if (isRunning && remainingTime > 0) {
      intervalId = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(intervalId);
            onTimeEnd();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, remainingTime, onTimeEnd]);

  const progressOffset = circumference - (remainingTime / time) * circumference;
  
  // Calculate percentage for color transition
  const percentage = (remainingTime / time) * 100;
  const timerColor = percentage > 50 
    ? "text-primary" 
    : percentage > 20 
      ? "text-amber-500" 
      : "text-destructive";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-24 h-24 flex items-center justify-center mb-4">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-muted stroke-current"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className={cn("stroke-current progress-ring", timerColor)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={isRunning ? progressOffset : 0}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("font-mono font-bold flex flex-col items-center justify-center", timerColor)}>
            <span className="text-2xl">
              {Math.floor(remainingTime / 60) > 0 ? `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}` : remainingTime}
            </span>
            <span className="text-xs uppercase mt-1">{Math.floor(remainingTime / 60) > 0 ? 'min:sec' : 'sec'}</span>
          </div>
        </div>
      </div>
      
      {!isRunning && (
        <div className="flex space-x-2">
          {timeOptions.map((option) => (
            <Button
              key={option}
              variant={time === option ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeChange(option)}
              className="w-14 transition-transform hover:scale-105 active:scale-95 font-medium"
            >
              {option}s
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
