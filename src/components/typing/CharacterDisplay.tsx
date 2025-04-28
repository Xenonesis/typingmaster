import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAnimations } from "@/context/AnimationsContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";

interface CharacterDisplayProps {
  text: string;
  charStates: Array<"neutral" | "correct" | "incorrect" | "current">;
  onContainerClick: () => void;
  isFocused: boolean;
  isRunning: boolean;
  time: number;
  textContainerRef: React.RefObject<HTMLDivElement>;
  countdownValue: number | null;
  currentIndex: number;
  typed: string;
  status: CharacterStatus | null;
  cursor: Cursor | null;
  isMobile: boolean;
  isFullscreen: boolean;
  focusMode: boolean;
  isPaused: boolean;
  isLoading: boolean;
}

type CharacterStatus = "neutral" | "correct" | "incorrect" | "current";

interface Cursor {
  position: number;
  visible: boolean;
}

export const CharacterDisplay = React.memo(function CharacterDisplay({
  text,
  charStates,
  onContainerClick,
  isFocused,
  isRunning,
  time,
  textContainerRef,
  countdownValue,
  currentIndex,
  typed,
  status,
  cursor,
  isMobile,
  isFullscreen,
  focusMode,
  isPaused,
  isLoading
}: CharacterDisplayProps) {
  const { animationsEnabled } = useAnimations();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [hasMounted, setHasMounted] = useState(false);
  const [textSize, setTextSize] = useState("text-base");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const textRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [optimizedVisibleRange, setOptimizedVisibleRange] = useState({ start: 0, end: 0 });
  const [touchActive, setTouchActive] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  
  // Set hasMounted to true after component mounts
  useEffect(() => {
    setHasMounted(true);
    setViewportHeight(window.visualViewport?.height || window.innerHeight);
    
    const handleViewportResize = () => {
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };
    
    window.visualViewport?.addEventListener('resize', handleViewportResize);
    window.addEventListener('resize', handleViewportResize);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      window.removeEventListener('resize', handleViewportResize);
    };
  }, []);
  
  // Set up resize observer for more efficient size tracking
  useEffect(() => {
    if (!textContainerRef.current) return;
    
    const updateSize = (width: number) => {
      if (isMobile && isFullscreen) {
        setTextSize("text-lg");
      } else if (isMobile) {
        setTextSize("text-base");
      } else if (width < 350) {
        setTextSize("text-sm");
      } else if (width < 500) {
        setTextSize("text-base");
      } else if (width < 768) {
        setTextSize("text-lg");
      } else if (width < 1024) {
        setTextSize("text-xl");
      } else {
        setTextSize("text-2xl");
      }
    };
    
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
        updateSize(width);
      }
    };
    
    // Create and attach the resize observer
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(textContainerRef.current);
    
    // Initial size calculation
    const { width, height } = textContainerRef.current.getBoundingClientRect();
    setContainerSize({ width, height });
    updateSize(width);
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [textContainerRef, isMobile, isFullscreen]);
  
  // Calculate optimal visible range for rendering efficiency
  useEffect(() => {
    if (!text) return;
    
    // Calculate the optimal range based on current index
    const bufferSize = isMobile ? 50 : 100; // Smaller buffer for mobile devices
    const start = Math.max(0, currentIndex - bufferSize);
    const end = Math.min(text.length, currentIndex + bufferSize);
    
    setOptimizedVisibleRange({ start, end });
  }, [text, currentIndex, isMobile]);
  
  // Scroll to current character
  useEffect(() => {
    if (!textRef.current || !isRunning || currentIndex <= 0) return;
    
    const container = textRef.current;
    const currentCharEl = container.querySelector(`.char-${currentIndex}`);
    
    if (currentCharEl) {
      // Find the optimal position to scroll to
      const containerRect = container.getBoundingClientRect();
      const charRect = currentCharEl.getBoundingClientRect();
      
      // Calculate the scrolling position to center the character vertically
      // and keep a comfortable distance from the top
      // For mobile, position the current character higher up in the container
      const verticalOffset = isMobile ? 0.3 : 0.4;
      const optimalTop = charRect.top - containerRect.top - containerRect.height * verticalOffset;
      
      if (isMobile && isFullscreen) {
        // Smoother scroll for mobile fullscreen
        container.scrollTo({
          top: optimalTop,
          behavior: animationsEnabled ? 'smooth' : 'auto'
        });
      } else {
        // On mobile, use smooth scrolling for better UX
        if (isMobile) {
          container.scrollTo({
            top: optimalTop,
            behavior: 'smooth'
          });
        } else {
          // Standard scroll
          container.scrollTop = optimalTop;
        }
      }
    }
  }, [currentIndex, isRunning, animationsEnabled, isMobile, isFullscreen]);
  
  // Calculate optimal character display size based on text length and container size
  const getOptimalSize = useCallback(() => {
    if (!text) return {};
    
    const textLength = text.length;
    const isLongText = textLength > 200;
    const isMediumText = textLength > 100 && textLength <= 200;
    
    // Adjust based on container width and mode
    const isWideContainer = containerSize.width > 900;
    const isNarrowContainer = containerSize.width <= 600;
    
    // Optimize for mobile fullscreen
    const mobileFullscreenClass = isMobile && isFullscreen ? "mobile-fullscreen-text" : "";
    
    // Additional class for focus mode
    const focusModeClass = focusMode ? "focus-mode-text" : "";
    const fullscreenClass = isFullscreen ? "fullscreen-mode-text" : "";
    
    // Calculate max height based on device and mode
    let maxHeight = "max-h-[60vh]";
    if (isMobile && isFullscreen) {
      // Use more screen real estate on mobile fullscreen
      maxHeight = `max-h-[85vh]`;
    } else if (isFullscreen) {
      maxHeight = "max-h-[75vh]";
    } else if (focusMode) {
      maxHeight = "max-h-[70vh]";
    } else if (isMobile) {
      // Increase max height for mobile to use more space
      maxHeight = "max-h-[65vh]";
    }
    
    // For long text, we use smaller text size to fit more content
    // For short text, we can use larger text for better visibility
    if (isLongText) {
      return { 
        containerClass: cn(
          maxHeight,
          focusModeClass,
          fullscreenClass,
          mobileFullscreenClass,
          isMobile && "mobile-enhanced-container"
        ),
        charClass: isMobile ? "tracking-normal mobile-char" : (isWideContainer ? "" : "tracking-tight")
      };
    } else if (isMediumText) {
      return { 
        containerClass: cn(
          maxHeight,
          focusModeClass,
          fullscreenClass,
          mobileFullscreenClass,
          isMobile && "mobile-enhanced-container"
        ),
        charClass: isMobile ? "tracking-normal mobile-char" : (isWideContainer ? "tracking-normal" : "")
      };
    } else {
      return { 
        containerClass: cn(
          maxHeight,
          focusModeClass,
          fullscreenClass,
          mobileFullscreenClass,
          isMobile && "mobile-enhanced-container"
        ),
        charClass: isMobile ? "tracking-normal mobile-char" : (isNarrowContainer ? "" : "tracking-wide")
      };
    }
  }, [text, isMobile, containerSize, focusMode, isFullscreen, viewportHeight]);
  
  const optimalSize = useMemo(() => getOptimalSize(), [getOptimalSize]);
  
  const getCharClassName = useCallback((state: "neutral" | "correct" | "incorrect" | "current", index: number) => {
    const isCurrentChar = index === currentIndex;
    const isCursor = cursor && index === cursor.position;
    return cn(
      "typing-char",
      state,
      `char-${index}`,
      optimalSize.charClass,
      {
        "animate-pulse": state === "current" && isFocused,
        "mobile-current-char": state === "current" && isMobile,
        "space-char": text[index] === ' ',
        "dynamic-highlight": state === "current" && isRunning,
        "current-char": isCurrentChar,
        "cursor-char": isCursor,
        "focus-char": focusMode && state === "current",
        "fullscreen-char": isFullscreen && state === "current",
        "mobile-focus-char": isMobile && focusMode && state === "current",
        "mobile-fullscreen-char": isMobile && isFullscreen && state === "current"
      }
    );
  }, [isFocused, isMobile, text, optimalSize.charClass, isRunning, currentIndex, cursor, focusMode, isFullscreen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isMobile) {
      setTouchActive(true);
      onContainerClick();
    }
  }, [isMobile, onContainerClick]);
  
  const handleTouchEnd = useCallback(() => {
    setTouchActive(false);
  }, []);

  // Create a safe display for characters
  const getDisplayChar = useCallback((char: string) => {
    if (char === ' ') return '\u00A0'; // Non-breaking space
    if (char === '\n') return '\u21B5'; // Return symbol
    if (char === '\t') return '\u2192\u2192'; // Tab representation
    if (char === '\r') return '\u21B5'; // Return symbol for carriage return
    
    // Handle other invisible/special characters
    if (char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) {
      return `\u2395`; // Special character symbol
    }
    
    // Handle zero-width spaces and other problematic unicode
    if (char.charCodeAt(0) === 8203 || char.charCodeAt(0) === 8204 || char.charCodeAt(0) === 8205) {
      return '\u2423'; // Open box symbol
    }
    
    return char;
  }, []);

  const renderedCharacters = useMemo(() => {
    // Handle case where text might not be loaded yet
    if (!text) return null;
    
    // Optimize rendering for very long texts by only rendering characters near the current position
    const { start, end } = optimizedVisibleRange;
    
    // Create leading indicator if we're not starting from the beginning
    const leadingIndicator = start > 0 ? (
      <span className="text-muted-foreground opacity-50 mr-2">...</span>
    ) : null;
    
    // Create trailing indicator if we're not rendering until the end
    const trailingIndicator = end < text.length ? (
      <span className="text-muted-foreground opacity-50 ml-2">...</span>
    ) : null;
    
    // Render the visible portion of the text
    const visibleChars = text.substring(start, end).split('').map((char, localIndex) => {
      const globalIndex = start + localIndex;
      const state = charStates[globalIndex] || "neutral";
      
      // Special handling for spaces and newlines
      const isSpecial = char === ' ' || char === '\n' || char === '\t' || 
                      char === '\r' || char.charCodeAt(0) < 32;
      
      return (
        <span
          key={`char-${globalIndex}-${char.charCodeAt(0)}`}
          className={cn(
            getCharClassName(state, globalIndex),
            isSpecial && "special-char"
          )}
          aria-label={`Character ${char}, ${state}`}
          data-char-index={globalIndex}
          data-char-state={state}
          data-testid={`typing-char-${globalIndex}`}
          data-char-code={char.charCodeAt(0)}
        >
          {getDisplayChar(char)}
        </span>
      );
    });
    
    // Combine the leading indicator, visible chars, and trailing indicator
    return (
      <>
        {leadingIndicator}
        {visibleChars}
        {trailingIndicator}
      </>
    );
  }, [text, charStates, getCharClassName, getDisplayChar, optimizedVisibleRange]);

  const needsBottomGradient = (text?.length > 100) || isMobile || focusMode;

  // Guard against rendering with incomplete data
  if (!hasMounted || !text) {
    return (
      <div 
        ref={textContainerRef}
        className="relative font-mono text-sm sm:text-base p-6 rounded-md typing-area min-h-40"
        aria-label="Loading typing test"
      >
        <div className="animate-pulse bg-secondary/50 h-4 w-3/4 rounded mb-2"></div>
        <div className="animate-pulse bg-secondary/50 h-4 w-full rounded mb-2"></div>
        <div className="animate-pulse bg-secondary/50 h-4 w-2/3 rounded"></div>
      </div>
    );
  }

  return (
    <div
      ref={textContainerRef}
      className={cn(
        "relative font-mono p-3 sm:p-4 rounded-md transition-all",
        textSize,
        "cursor-text overflow-auto typing-area",
        optimalSize.containerClass,
        !isFocused && isRunning && "ring-2 ring-primary/50 animate-pulse",
        isMobile && "p-3 sm:p-4 mobile-typing-area",
        isRunning && "dynamic-text-container",
        focusMode && "focus-mode-container",
        isFullscreen && "fullscreen-mode-container",
        isMobile && isFullscreen && "mobile-fullscreen-container",
        isMobile && focusMode && "mobile-focus-container",
        isPaused && "paused-container",
        touchActive && "touch-active-container"
      )}
      onClick={onContainerClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Typing test area"
      data-testid="typing-test-container"
      style={{
        // Use dynamic scaling based on container width with clamp for smoother transitions
        fontSize: isMobile && isFullscreen 
          ? `clamp(1rem, ${Math.min(containerSize.width / 65, 1)}vw + 0.5rem, 1.5rem)` 
          : focusMode || isFullscreen 
            ? `clamp(1rem, ${Math.min(containerSize.width / 80, 0.8)}vw + 0.5rem, 1.5rem)` 
            : `clamp(1rem, ${Math.min(containerSize.width / 90, 0.7)}vw + 0.5rem, 1.4rem)`,
      }}
    >
      <AnimatePresence>
        {countdownValue !== null && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            data-testid="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={cn(
                "text-6xl font-bold countdown-number",
                isMobile && "text-4xl"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {countdownValue}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        ref={textRef}
        className={cn(
          "typing-text", 
          isRunning && "running",
          isMobile && "mobile-typing-text",
          isMobile && isFullscreen && "mobile-fullscreen-typing-text",
          "dynamic-text",
          focusMode && "focus-mode-text",
          isFullscreen && "fullscreen-text"
        )}
        data-testid="typing-text"
      >
        {renderedCharacters}
      </div>
      
      {needsBottomGradient && (
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent",
            "pointer-events-none",
            isMobile && isFullscreen ? "h-10" : isMobile ? "h-6" : focusMode ? "h-8" : "h-6"
          )}
          data-testid="bottom-gradient"
        />
      )}
      
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-2xl font-medium text-muted-foreground"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              Paused
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile touch overlay indicator when screen is touched */}
      <AnimatePresence>
        {touchActive && isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-md z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
