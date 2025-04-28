import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { KeyboardLayouts } from "./keyboardLayouts";
import { useResponsive } from '@/hooks/useResponsive';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface VirtualKeyboardProps {
  currentKey: string | null;
  errorKey: string | null;
  keyboardLayout: "qwerty" | "azerty" | "dvorak" | "colemak";
  compact?: boolean;
}

export function VirtualKeyboard({ 
  currentKey, 
  errorKey,
  keyboardLayout = "qwerty",
  compact = false
}: VirtualKeyboardProps) {
  const layouts = KeyboardLayouts;
  const layout = layouts[keyboardLayout] || layouts.qwerty;
  const { isMobile, isTablet } = useResponsive();
  const [scale, setScale] = useState(1);
  const [touchKey, setTouchKey] = useState<string | null>(null);
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');
  
  // Adjust scale based on viewport width
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setScale(0.65);
      } else if (width < 640) {
        setScale(0.75);
      } else if (width < 768) {
        setScale(0.85);
      } else if (compact) {
        setScale(0.9);
      } else {
        setScale(1);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [compact]);

  const handleTouchStart = (key: string) => {
    setTouchKey(key);
  };

  const handleTouchEnd = () => {
    setTouchKey(null);
  };

  return (
    <div className={cn(
      "virtual-keyboard w-full max-w-full overflow-x-auto pb-2",
      isMobile && "touch-pan-x"
    )}>
      <div 
        className="keyboard-container w-full transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          minWidth: compact ? '540px' : '640px',
          maxWidth: '100%'
        }}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1 gap-[2px] sm:gap-1">
            {row.map((key, keyIndex) => {
              const isCurrentKey = currentKey === key.key;
              const isErrorKey = errorKey === key.key;
              const isTouched = touchKey === key.key;
              
              let width = compact ? "w-8 sm:w-10" : "w-10 sm:w-12";
              let height = "h-8 sm:h-10";
              
              if (key.key === "Backspace") width = compact ? "w-14 sm:w-16" : "w-16 sm:w-20";
              if (key.key === "Tab") width = compact ? "w-12 sm:w-14" : "w-14 sm:w-16";
              if (key.key === "CapsLock") width = compact ? "w-14 sm:w-16" : "w-16 sm:w-20";
              if (key.key === "Enter") width = compact ? "w-14 sm:w-16" : "w-16 sm:w-20";
              if (key.key === "Shift") width = compact ? "w-16 sm:w-20" : "w-20 sm:w-24";
              if (key.key === " ") width = compact ? "w-36 sm:w-48" : "w-48 sm:w-64";
              
              // Increase height for touch devices
              if (isTouchDevice) {
                height = "h-10 sm:h-12";
              }
              
              return (
                <div 
                  key={keyIndex}
                  className={cn(
                    "keyboard-key rounded-md flex items-center justify-center text-xs sm:text-sm font-medium transition-all",
                    width,
                    height,
                    isCurrentKey ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    isErrorKey ? "bg-destructive text-destructive-foreground animate-shake" : "",
                    isTouched ? "bg-primary/70 text-primary-foreground scale-95 shadow-inner" : "",
                    key.key === "Backspace" || key.key === "Tab" || key.key === "CapsLock" || 
                    key.key === "Enter" || key.key === "Shift" ? "text-xs" : "",
                    "shadow-sm hover:shadow active:scale-95 active:shadow-inner"
                  )}
                  onTouchStart={() => handleTouchStart(key.key)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                >
                  {key.display || key.key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <style>
        {`
        .virtual-keyboard {
          -webkit-overflow-scrolling: touch;
          overflow-y: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
        }

        .virtual-keyboard::-webkit-scrollbar {
          height: 6px;
        }

        .virtual-keyboard::-webkit-scrollbar-track {
          background: transparent;
        }

        .virtual-keyboard::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        
        .keyboard-key {
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        @media (hover: none) and (pointer: coarse) {
          .keyboard-key {
            min-width: 36px;
            min-height: 40px;
          }
        }
        `}
      </style>
    </div>
  );
}
