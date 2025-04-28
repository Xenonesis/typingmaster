import { useEffect, useRef, useState, useCallback } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import { cn } from '@/lib/utils';
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAnimations } from "@/context/AnimationsContext";
import { motion, AnimatePresence } from "framer-motion";

// Import for line numbers
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

interface CodeDisplayProps {
  text: string;
  charStates: Array<"neutral" | "correct" | "incorrect" | "current">;
  onContainerClick: () => void;
  isFocused: boolean;
  isRunning: boolean;
  textContainerRef: React.RefObject<HTMLDivElement>;
  countdownValue: number | null;
}

export function CodeDisplay({
  text,
  charStates,
  onContainerClick,
  isFocused,
  isRunning,
  textContainerRef,
  countdownValue
}: CodeDisplayProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { animationsEnabled } = useAnimations();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Determine language based on text content
  const detectLanguage = (code: string): string => {
    if (code.includes('function') || code.includes('const') || code.includes('let') || code.includes('class')) {
      return 'javascript';
    } else if (code.includes('def ') || code.includes('import ') && code.includes('print(')) {
      return 'python';
    } else if (code.includes('<') && code.includes('/>')) {
      return 'jsx';
    } else if (code.includes('#include') || code.includes('int main')) {
      return 'cpp';
    } else {
      return 'javascript'; // Default fallback
    }
  };

  // Find current character index
  useEffect(() => {
    const currentIndex = charStates.findIndex(state => state === 'current');
    if (currentIndex !== -1) {
      setCurrentCharIndex(currentIndex);
    }
  }, [charStates]);

  // Set up resize observer for container
  useEffect(() => {
    if (!textContainerRef.current) return;
    
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    };
    
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(textContainerRef.current);
    
    const { width, height } = textContainerRef.current.getBoundingClientRect();
    setContainerSize({ width, height });
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [textContainerRef]);

  // Scroll to current character
  useEffect(() => {
    if (!overlayRef.current || !isRunning || currentCharIndex <= 0) return;
    
    const container = textContainerRef.current;
    const currentCharEl = overlayRef.current.querySelector(`.char-${currentCharIndex}`);
    
    if (currentCharEl && container) {
      const containerRect = container.getBoundingClientRect();
      const charRect = currentCharEl.getBoundingClientRect();
      
      // Adjust scroll position to keep cursor visible
      const verticalOffset = isMobile ? 0.3 : 0.4;
      const optimalTop = charRect.top - containerRect.top - containerRect.height * verticalOffset;
      
      if (isMobile) {
        container.scrollTo({
          top: optimalTop,
          behavior: animationsEnabled ? 'smooth' : 'auto'
        });
      } else {
        container.scrollTop = optimalTop;
      }
    }
  }, [currentCharIndex, isRunning, animationsEnabled, isMobile, textContainerRef]);

  useEffect(() => {
    if (text && codeRef.current) {
      // Initialize Prism for syntax highlighting
      Prism.highlightElement(codeRef.current);
    }
  }, [text]);

  // Create an overlay of character spans with correct/incorrect states
  const renderCharacterOverlay = () => {
    return (
      <div 
        ref={overlayRef}
        className="absolute top-0 left-0 pointer-events-none font-mono"
      >
        {text.split('').map((char, index) => {
          const isCurrentChar = charStates[index] === 'current';
          return (
            <span
              key={index}
              className={cn(
                `char-${index}`,
                charStates[index] === 'correct' && 'text-green-400 bg-green-400/10',
                charStates[index] === 'incorrect' && 'text-red-400 bg-red-400/10',
                isCurrentChar && 'text-purple-400 relative',
                isMobile && isCurrentChar && 'bg-purple-400/20 px-1 rounded-sm'
              )}
            >
              {char === ' ' ? '\u00A0' : char}
              {isCurrentChar && !isMobile && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-purple-400"
                  layoutId="activeCodeChar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const getContainerStyle = useCallback(() => {
    const baseClasses = "relative font-mono rounded-md transition-all cursor-text overflow-auto typing-area";
    
    // Responsive sizing
    const sizeClasses = isMobile 
      ? "text-xs min-h-[200px] max-h-[70vh]" 
      : isTablet 
        ? "text-sm min-h-[250px] max-h-[75vh]" 
        : "text-base min-h-[300px] max-h-[80vh]";
    
    // Focus styles
    const focusClasses = !isFocused && isRunning 
      ? "ring-2 ring-primary/50 animate-pulse" 
      : "ring-1 ring-border/50";
    
    return cn(baseClasses, sizeClasses, focusClasses);
  }, [isFocused, isRunning, isMobile, isTablet]);

  return (
    <div
      ref={textContainerRef}
      className={getContainerStyle()}
      onClick={onContainerClick}
      aria-label="Code typing test area"
    >
      <AnimatePresence>
        {countdownValue !== null && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={cn(
                "text-6xl font-bold countdown-number text-primary",
                isMobile && "text-4xl"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {countdownValue}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative code-container">
        <pre className={cn(
          "line-numbers",
          "backdrop-blur-[1px]",
          "p-4",
          isMobile && "text-xs p-2",
          isTablet && "text-sm p-3"
        )}>
          <code ref={codeRef} className={`language-${detectLanguage(text)}`}>
            {text}
          </code>
        </pre>
        {isRunning && renderCharacterOverlay()}
      </div>
      
      {/* Status indicator */}
      {isRunning && (
        <div className={cn(
          "absolute right-3 top-3 px-2 py-1 text-xs font-medium rounded-full",
          "bg-primary/20 text-primary border border-primary/20",
          "animate-pulse",
          isMobile && "right-2 top-2 text-[10px] px-1.5 py-0.5"
        )}>
          typing
        </div>
      )}
      
      {/* Bottom fade gradient */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/90 to-transparent",
        "pointer-events-none",
        isMobile && "h-6"
      )}></div>
    </div>
  );
} 