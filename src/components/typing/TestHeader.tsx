import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Clock, PlayCircle, PauseCircle, Keyboard, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAnimations } from "@/context/AnimationsContext";
import { cn } from "@/lib/utils";

interface TestHeaderProps {
  time: number;
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isLoading: boolean;
  focusModeActive?: boolean;
  isFullscreen?: boolean;
  isMobile?: boolean;
  onTimeEnd: () => void;
  onStartTest: () => void;
  onEndTest: () => void;
}

export function TestHeader({
  time,
  remainingTime,
  isRunning,
  isPaused,
  isLoading,
  focusModeActive = false,
  isFullscreen = false,
  isMobile: propIsMobile,
  onTimeEnd,
  onStartTest,
  onEndTest
}: TestHeaderProps) {
  const componentIsMobile = useMediaQuery("(max-width: 640px)");
  const isMobile = propIsMobile !== undefined ? propIsMobile : componentIsMobile;
  const { animationsEnabled } = useAnimations();
  
  const progress = isRunning ? 100 - (remainingTime / time) * 100 : 0;
  const formattedTime = remainingTime < 60 
    ? `${remainingTime.toFixed(0)}s` 
    : `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`;

  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 sm:gap-4 test-header",
        focusModeActive && isRunning ? "focus-mode-header" : "",
        isFullscreen ? "fullscreen-header" : "",
        isMobile && "mobile-test-header"
      )}
    >
      <div className={cn(
        "flex items-center space-x-3 w-full sm:w-auto",
        isMobile && "space-x-2"
      )}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        ) : isRunning ? (
          <motion.div 
            className={cn(
              "flex items-center space-x-2",
              isMobile && "space-x-1 test-duration"
            )}
            initial={animationsEnabled ? { opacity: 0, scale: 0.9 } : {}}
            animate={animationsEnabled ? { opacity: 1, scale: 1 } : {}}
          >
            <Clock className="h-4 w-4 text-primary" />
            <span className={cn(
              "text-sm font-medium mr-1",
              isMobile && "text-xs"
            )}>Time:</span>
            <Badge 
              variant={remainingTime < 10 ? "destructive" : "outline"} 
              className={cn(
                "px-3 py-1 text-base font-mono timer-badge",
                isMobile && "px-2 py-0.5 text-sm",
                isPaused && "bg-yellow-500/20"
              )}
            >
              {formattedTime} {isPaused && "(Paused)"}
            </Badge>
            
            {focusModeActive && !isMobile && (
              <div className="ml-2 px-2 py-1 rounded-md bg-background/50 text-xs flex items-center gap-1">
                <Keyboard className="h-3 w-3 text-primary" />
                <span>Focus Mode</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={animationsEnabled ? { scale: 1.02 } : {}}
          >
            <PlayCircle className="h-4 w-4 text-primary" />
            <span className={cn(
              "text-sm font-medium",
              isMobile && "text-xs"
            )}>
              {isMobile ? "Tap to start" : "Ready to start"}
            </span>
          </motion.div>
        )}
      </div>
      
      {isRunning && (
        <div className={cn(
          "w-full sm:max-w-[200px] flex items-center space-x-2",
          isMobile && "space-x-1 max-w-full"
        )}>
          <Progress value={progress} className={cn(
            "h-3",
            isMobile && "h-2",
            isPaused && "opacity-70"
          )} />
          <span className={cn(
            "text-xs text-muted-foreground w-16 text-right font-mono",
            isMobile && "text-[10px] w-10"
          )}>
            {Math.floor(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}
