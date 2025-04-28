import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface WordModeDisplayProps {
  text: string;
  charStates: Array<"neutral" | "correct" | "incorrect" | "current">;
  onContainerClick: () => void;
  isFocused: boolean;
  isRunning: boolean;
  textContainerRef: React.RefObject<HTMLDivElement>;
  countdownValue: number | null;
}

export function WordModeDisplay({
  text,
  charStates,
  onContainerClick,
  isFocused,
  isRunning,
  textContainerRef,
  countdownValue
}: WordModeDisplayProps) {
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Split text into words
  const words = text.split(' ');
  
  // Group character states by word
  const wordStates = words.map((word, wordIndex) => {
    const startCharIndex = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0);
    return {
      word,
      charStates: charStates.slice(startCharIndex, startCharIndex + word.length)
    };
  });
  
  // Find active word index
  const findActiveWordIndex = () => {
    for (let i = 0; i < wordStates.length; i++) {
      if (wordStates[i].charStates.some(state => state === 'current')) {
        return i;
      }
    }
    return 0;
  };
  
  const activeWordIndex = findActiveWordIndex();
  
  // Check if a word is complete (all characters are correct or incorrect)
  const isWordComplete = (wordState: { word: string, charStates: Array<"neutral" | "correct" | "incorrect" | "current"> }) => {
    return wordState.charStates.every(state => state === 'correct' || state === 'incorrect');
  };
  
  // Determine the status of a word
  const getWordStatus = (wordState: { word: string, charStates: Array<"neutral" | "correct" | "incorrect" | "current"> }) => {
    if (wordState.charStates.some(state => state === 'current')) return 'active';
    if (wordState.charStates.every(state => state === 'correct')) return 'correct';
    if (wordState.charStates.some(state => state === 'incorrect')) return 'incorrect';
    return 'neutral';
  };

  return (
    <div
      ref={textContainerRef}
      className={cn(
        "relative font-mono text-sm sm:text-base p-6 rounded-md transition-all",
        "cursor-text min-h-40 max-h-96 overflow-auto typing-area word-mode",
        !isFocused && isRunning && "ring-2 ring-primary/50 animate-pulse",
        isMobile && "p-3 sm:p-4"
      )}
      onClick={onContainerClick}
      aria-label="Typing test area"
    >
      {countdownValue !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className={cn(
            "text-6xl font-bold countdown-number",
            isMobile && "text-4xl"
          )}>{countdownValue}</div>
        </div>
      )}

      <AnimatePresence>
        <div className={cn(
          "flex flex-wrap gap-2 leading-loose",
          isMobile && "gap-1.5"
        )}>
          {wordStates.map((wordState, index) => {
            const status = getWordStatus(wordState);
            const isActive = status === 'active';
            
            return (
              <motion.span
                key={`${index}-${wordState.word}`}
                ref={isActive ? activeWordRef : null}
                className={cn(
                  "px-1 py-0.5 rounded-md transition-all",
                  status === 'correct' && 'text-green-500 bg-green-500/10',
                  status === 'incorrect' && 'text-red-500 bg-red-500/10',
                  status === 'active' && 'bg-primary/20 font-semibold relative',
                  status === 'neutral' && 'text-muted-foreground',
                  isMobile && "text-xs sm:text-sm py-1"
                )}
                animate={isActive && !isMobile ? { 
                  scale: [1, 1.05, 1],
                  transition: { duration: 0.4, repeat: Infinity, repeatType: 'reverse' }
                } : {}}
              >
                {wordState.word}
                
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeWordUnderline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.span>
            );
          })}
        </div>
      </AnimatePresence>
      
      {/* Active word character breakdown */}
      {isRunning && (
        <div className={cn(
          "mt-6 p-4 bg-secondary/30 rounded-md",
          isMobile && "mt-3 p-2"
        )}>
          <div className={cn(
            "text-sm text-muted-foreground mb-2",
            isMobile && "text-xs mb-1"
          )}>Current Word:</div>
          <div className={cn(
            "flex items-center justify-center text-xl tracking-wide",
            isMobile && "text-base"
          )}>
            {activeWordIndex < words.length && words[activeWordIndex].split('').map((char, charIndex) => {
              const charState = wordStates[activeWordIndex].charStates[charIndex];
              return (
                <span
                  key={charIndex}
                  className={cn(
                    "px-0.5 transition-all",
                    charState === 'correct' && 'text-green-500',
                    charState === 'incorrect' && 'text-red-500',
                    charState === 'current' && 'text-primary font-bold relative',
                    charState === 'neutral' && 'text-foreground',
                    isMobile && charState === 'current' && 'bg-primary/10 rounded-sm px-1'
                  )}
                >
                  {char}
                  {charState === 'current' && (
                    <motion.div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-0.5 bg-primary",
                        isMobile && "h-[2px]"
                      )}
                      layoutId="activeCharUnderline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background/80 to-transparent",
        "pointer-events-none",
        isMobile && "h-4"
      )}></div>
    </div>
  );
} 