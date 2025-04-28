import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StopCircle, 
  KeyRound,
  AlertCircle,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useAnimations } from "@/context/AnimationsContext";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface TestControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isFocused: boolean;
  isLoading: boolean;
  isFullscreen?: boolean;
  focusModeActive?: boolean;
  isMobile?: boolean;
  onStartTest: () => void;
  onEndTest: () => void;
  onRestartTest: () => void;
  onPauseTest: () => void;
  onResumeTest: () => void;
  onToggleFullscreen?: () => void;
}

export function TestControls({
  isRunning,
  isPaused,
  isFocused,
  isLoading,
  isFullscreen = false,
  focusModeActive = false,
  isMobile: propIsMobile,
  onStartTest,
  onEndTest,
  onRestartTest,
  onPauseTest,
  onResumeTest,
  onToggleFullscreen
}: TestControlsProps) {
  const { animationsEnabled } = useAnimations();
  const componentIsMobile = useMediaQuery("(max-width: 640px)");
  const isMobile = propIsMobile !== undefined ? propIsMobile : componentIsMobile;
  
  return (
    <motion.div 
      className={cn(
        "flex flex-wrap justify-center sm:justify-between gap-2 sm:gap-4 test-controls",
        isMobile ? "mt-2 gap-1" : "",
        focusModeActive && isRunning ? "focus-mode-controls" : "",
        isMobile && "mobile-test-controls"
      )}
      initial={animationsEnabled ? { opacity: 0, y: 10 } : {}}
      animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        "flex flex-wrap justify-center sm:justify-start gap-2",
        isMobile && "gap-1 w-full"
      )}>
        {!isRunning ? (
          <Button 
            onClick={onStartTest} 
            disabled={isLoading}
            className={cn(
              "gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-glow text-white",
              isMobile && "flex-1 min-h-[44px]"
            )}
            size={isMobile ? "sm" : "default"}
          >
            <Play className="h-4 w-4" />
            <span>Start Test</span>
          </Button>
        ) : isPaused ? (
          <Button 
            onClick={onResumeTest}
            className={cn(
              "gap-2",
              isMobile && "flex-1 min-h-[44px]"
            )}
            variant="default"
            size={isMobile ? "sm" : "default"}
          >
            <Play className="h-4 w-4" />
            <span>Resume</span>
          </Button>
        ) : (
          <Button 
            onClick={onPauseTest}
            className={cn(
              "gap-2",
              isMobile && "flex-1 min-h-[44px]"
            )}
            variant="outline"
            size={isMobile ? "sm" : "default"}
          >
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </Button>
        )}
        
        {isRunning && (
          <Button 
            onClick={onEndTest}
            className={cn(
              "gap-2",
              isMobile && "flex-1 min-h-[44px]"
            )}
            variant="destructive"
            size={isMobile ? "sm" : "default"}
          >
            <StopCircle className="h-4 w-4" />
            <span>End Test</span>
          </Button>
        )}
        
        <Button 
          onClick={onRestartTest}
          className={cn(
            "gap-2",
            isMobile && "flex-1 min-h-[44px]"
          )}
          variant="outline"
          size={isMobile ? "sm" : "default"}
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restart</span>
        </Button>

        {onToggleFullscreen && !isMobile && (
          <Button
            onClick={onToggleFullscreen}
            className="gap-2"
            variant="outline"
            size={isMobile ? "sm" : "default"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </Button>
        )}
      </div>
      
      {!isFocused && isRunning && !isPaused && (
        <div className={cn(
          "w-full sm:w-auto flex justify-center",
          isMobile && "mt-2"
        )}>
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm p-2 rounded-lg flex items-center gap-2 max-w-md">
            <AlertCircle className={cn(
              "h-4 w-4 flex-shrink-0",
              isMobile && "h-3 w-3"
            )} />
            <span className={cn(
              isMobile && "text-xs py-2"
            )}>
              {isMobile ? "Tap to focus" : "Click on the text to continue typing"}
            </span>
          </div>
        </div>
      )}

      {focusModeActive && isRunning && (
        <div className={cn(
          "opacity-0 hover:opacity-100 transition-opacity duration-300 absolute bottom-4 right-4 p-2 bg-background/50 backdrop-blur-sm rounded-lg text-xs text-muted-foreground",
          isMobile && "text-[10px] bottom-2 right-2"
        )}>
          Press ESC to exit focus mode
        </div>
      )}
    </motion.div>
  );
}
