import { useTypingTest } from "@/hooks/useTypingTest";
import { TestSettings } from "./TestSettings";
import { TestResults } from "./TestResults";
import { CharacterDisplay } from "./typing/CharacterDisplay";
import { CodeDisplay } from "./typing/CodeDisplay";
import { WordModeDisplay } from "./typing/WordModeDisplay";
import { TestControls } from "./typing/TestControls";
import { TestHeader } from "./typing/TestHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { VirtualKeyboard } from "./keyboard/VirtualKeyboard";
import { Keyboard as KeyboardIcon, Loader2, X, Maximize2, Minimize2, PauseCircle, Settings } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "./ui/alert";
import { ChallengeType } from "@/utils/textGenerator";
import { useAnimations } from "@/context/AnimationsContext";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "./ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// Type definitions
interface Cursor {
  position: number;
  visible: boolean;
}

type CharacterStatus = "neutral" | "correct" | "incorrect" | "current";

type KeyboardLayoutType = "qwerty" | "azerty" | "dvorak" | "colemak";

const keyboardLayouts = [
  { label: "QWERTY", value: "qwerty" },
  { label: "AZERTY", value: "azerty" },
  { label: "DVORAK", value: "dvorak" },
  { label: "COLEMAK", value: "colemak" },
] as const;

export function TypingTest() {
  // UI state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayoutType>("qwerty");
  const [displayMode, setDisplayMode] = useState<string>("character");
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showMiniControls, setShowMiniControls] = useState(false);
  const [mobileFocusMode, setMobileFocusMode] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive state
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  
  // Animation context
  const { animationsEnabled } = useAnimations();
  
  // Get typing test hook state
  const {
    text,
    charStates,
    isRunning,
    isPaused,
    testComplete,
    time,
    setTime,
    remainingTime,
    results,
    difficulty,
    useCustomText,
    useMistralAI,
    isFocused,
    isLoading,
    textContainerRef,
    textInputRef,
    userInput,
    lastPressedKey,
    lastErrorKey,
    error,
    countdownValue,
    showCountdown,
    setDifficulty,
    setUseCustomText,
    setUseMistralAI,
    endTest,
    handleInputChange,
    startTest,
    restartTest,
    handleTextContainerClick,
    handleFocus,
    handleBlur,
    pauseTest,
    resumeTest,
    averageFrameTime,
    renderCount,
    currentIndex
  } = useTypingTest();

  // Fullscreen handlers
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error("Error entering fullscreen:", err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
    }
  }, []);

  // Listen for fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto enter fullscreen mode when test starts - only on desktop
  useEffect(() => {
    if (isRunning && !isPaused) {
      // Always enable focus mode when test is running
      setFocusMode(true);
      
      if (isMobile) {
        setMobileFocusMode(true);
      } else {
        // Only enter fullscreen on desktop devices
        if (!isFullscreen) {
          enterFullscreen();
        }
      }
    } else if (!isRunning && !testComplete) {
      // Disable focus mode when not running and not showing results
      setFocusMode(false);
      setMobileFocusMode(false);
    }
  }, [isRunning, isPaused, isFullscreen, enterFullscreen, testComplete, isMobile]);

  // Display mini controls after a few seconds in focus mode
  useEffect(() => {
    let timer: number;
    if (isRunning && !isPaused) {
      // After 2 seconds, show the mini controls
      timer = window.setTimeout(() => {
        setShowMiniControls(true);
      }, 2000);
    } else {
      setShowMiniControls(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, isPaused]);

  // Disable keyboard on mobile
  useEffect(() => {
    if (isMobile && showKeyboard) {
      setShowKeyboard(false);
    }
  }, [isMobile, showKeyboard]);

  // Touch handlers
  const handleTouchStart = () => {
    setTouchActive(true);
  };
  
  const handleTouchEnd = () => {
    setTouchActive(false);
  };

  // Auto-focus on mobile devices when test starts
  useEffect(() => {
    if (isMobile && isRunning && !isPaused && textInputRef.current) {
      textInputRef.current.focus();
      
      // Add a slight delay to focus to ensure smooth transitions
      const timer = setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, isRunning, isPaused]);

  // Add a function to handle keyboard visibility changes on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    // Create a viewport meta tag with fixed height to prevent resizing
    const setViewportMetaTag = () => {
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      
      if (isRunning) {
        // When typing, lock the viewport height to prevent jumps
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, height=device-height');
        
        // Apply a fixed position to the container when test is running on mobile
        if (containerRef.current) {
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.top = '0';
          containerRef.current.style.left = '0';
          containerRef.current.style.right = '0';
          containerRef.current.style.bottom = '0';
          containerRef.current.style.overflow = 'auto';
        }
      } else {
        // When not typing, allow normal viewport behavior
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover');
        
        // Reset container position when test is not running
        if (containerRef.current) {
          containerRef.current.style.position = '';
          containerRef.current.style.top = '';
          containerRef.current.style.left = '';
          containerRef.current.style.right = '';
          containerRef.current.style.bottom = '';
          containerRef.current.style.overflow = '';
        }
      }
    };
    
    setViewportMetaTag();
    
    return () => {
      // Reset viewport on unmount
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover');
      }
      
      // Clean up container styles
      if (containerRef.current) {
        containerRef.current.style.position = '';
        containerRef.current.style.top = '';
        containerRef.current.style.left = '';
        containerRef.current.style.right = '';
        containerRef.current.style.bottom = '';
        containerRef.current.style.overflow = '';
      }
    };
  }, [isMobile, isRunning]);

  // Custom startTest wrapper to handle focus mode and fullscreen
  const handleStartTest = () => {
    // Always enable focus mode when starting test
    setFocusMode(true);
    
    if (isMobile) {
      setMobileFocusMode(true);
      // Start the test immediately on mobile without fullscreen
      startTest();
    } else {
      // Only enter fullscreen on desktop
      enterFullscreen().then(() => {
        startTest();
      }).catch(err => {
        console.error("Error entering fullscreen:", err);
        // Still start the test even if fullscreen fails
        startTest();
      });
    }
  };

  // Process text before displaying to handle special characters
  const processTextForDisplay = useCallback((rawText: string) => {
    if (!rawText) return '';
    
    // Normalize line endings
    const normalizedText = rawText.replace(/\r\n/g, '\n');
    
    // Replace tabs with spaces for consistent display
    return normalizedText.replace(/\t/g, '    ');
  }, []);

  // Use processed text for display
  const displayText = useMemo(() => {
    return processTextForDisplay(text);
  }, [text, processTextForDisplay]);

  const handleCustomTextChange = (checked: boolean) => {
    setUseCustomText(checked);
  };

  const handleMistralAIChange = (checked: boolean) => {
    setUseMistralAI(checked);
  };

  const handleDisplayModeChange = (value: string) => {
    setDisplayMode(value);
  };

  const handleTimeChange = (value: number) => {
    setTime(value);
  };

  const changeDifficulty = (value: string) => {
    setDifficulty(value as ChallengeType);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full transition-all duration-300 max-w-full typing-container",
        focusMode && isRunning && "focus-mode",
        isFullscreen && "fullscreen-mode",
        isMobile && "mobile-typing-test",
        isMobile && isRunning && "mobile-fixed-height",
        touchActive && "touch-active"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={isMobile && isRunning ? { minHeight: '100vh', height: '100vh' } : {}}
    >
      {/* Mobile focus mode overlay */}
      <AnimatePresence>
        {isRunning && mobileFocusMode && isMobile && !isPaused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-background/95 pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Floating back to typing button for mobile focus mode */}
      <AnimatePresence>
        {isRunning && mobileFocusMode && isMobile && !textInputRef.current?.matches(':focus') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <Button 
              onClick={() => textInputRef.current?.focus()}
              className="mobile-button shadow-lg px-6"
              size="lg"
            >
              Back to Typing
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={cn(
        "relative flex flex-col h-full w-full",
        (isRunning && mobileFocusMode && isMobile && !isPaused) && "z-40"
      )}>
        {/* Display any errors */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!testComplete ? (
          <div className={cn(
            "typing-test-container space-y-4 p-4 bg-card rounded-xl shadow-md",
            isMobile && "p-3 space-y-3"
          )}>
            {/* Settings Bar */}
            {isMobile ? (
              <motion.div 
                className={cn(
                  "transition-all",
                  (focusMode && isRunning) || mobileFocusMode ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Drawer
                  open={showSettingsDrawer}
                  onOpenChange={setShowSettingsDrawer}
                >
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-9 w-9 p-0",
                        isMobile && "h-12 w-12 mt-1"
                      )}
                    >
                      <Settings
                        className={cn(
                          "h-5 w-5",
                          isMobile && "h-6 w-6"
                        )}
                      />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className={cn(
                    "max-h-[90vh] flex flex-col",
                    isMobile && "drawer-content pb-safe"
                  )}>
                    <div className="mx-auto w-full max-w-2xl px-4">
                      <DrawerHeader className="relative pb-1">
                        <DrawerTitle className="flex items-center">
                          <Settings className="h-5 w-5 mr-2" />
                          Test Settings
                        </DrawerTitle>
                        <DrawerDescription>
                          Configure your typing test experience
                        </DrawerDescription>
                        <div className="absolute right-0 top-2">
                          <DrawerClose asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "h-8 w-8 p-0 rounded-full",
                                isMobile && "h-10 w-10"
                              )}
                            >
                              <X
                                className={cn(
                                  "h-4 w-4",
                                  isMobile && "h-5 w-5"
                                )}
                              />
                              <span className="sr-only">Close</span>
                            </Button>
                          </DrawerClose>
                        </div>
                      </DrawerHeader>
                      <div className="px-1">
                        <TestSettings
                          difficulty={difficulty}
                          onDifficultyChange={changeDifficulty}
                          useCustomText={useCustomText}
                          onCustomTextChange={handleCustomTextChange}
                          useMistralAI={useMistralAI}
                          onMistralAIChange={handleMistralAIChange}
                          displayMode={displayMode}
                          onDisplayModeChange={handleDisplayModeChange}
                          time={time}
                          onTimeChange={handleTimeChange}
                        />
                        
                        {/* Keyboard Settings Section in the drawer */}
                        <div className="mt-6 bg-background/70 rounded-lg border border-border/30 p-4 setting-card">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <KeyboardIcon className="h-4 w-4 text-primary/80" />
                                <Label className="font-medium text-base">Keyboard Settings</Label>
                              </div>
                              <p className="text-xs text-muted-foreground">Configure the virtual keyboard</p>
                            </div>
                            <Switch 
                              checked={showKeyboard} 
                              onCheckedChange={setShowKeyboard}
                              className={isMobile && "setting-toggle"}
                            />
                          </div>
                          
                          {showKeyboard && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <Label htmlFor="mobile-keyboard-layout" className="mb-2 block">Keyboard Layout</Label>
                                <Select 
                                  value={keyboardLayout}
                                  onValueChange={(value) => setKeyboardLayout(value as KeyboardLayoutType)}
                                >
                                  <SelectTrigger id="mobile-keyboard-layout" className={isMobile && "h-12 text-base"}>
                                    <SelectValue placeholder="Select keyboard layout" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {keyboardLayouts.map((layout) => (
                                      <SelectItem key={layout.value} value={layout.value} className={isMobile && "text-base"}>
                                        {layout.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="show-performance" className="flex-1">Show Performance Monitor</Label>
                                <Switch
                                  id="show-performance"
                                  checked={showPerformanceMonitor}
                                  onCheckedChange={setShowPerformanceMonitor}
                                  className={isMobile && "setting-toggle"}
                                />
                              </div>
                              
                              {isMobile && (
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <Label htmlFor="mobile-focus-mode" className="block">Mobile Focus Mode</Label>
                                    <p className="text-xs text-muted-foreground">Hide UI elements while typing</p>
                                  </div>
                                  <Switch
                                    id="mobile-focus-mode"
                                    checked={mobileFocusMode}
                                    onCheckedChange={setMobileFocusMode}
                                    className="setting-toggle"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center pb-4">
                        <Button
                          type="button"
                          className={cn(
                            "px-8",
                            isMobile && "mobile-button w-full"
                          )}
                          onClick={() => setShowSettingsDrawer(false)}
                        >
                          Apply Settings
                        </Button>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </motion.div>
            ) : (
              <motion.div 
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-4 transition-all",
                  focusMode && isRunning ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Test Settings */}
                <div className="bg-background/50 p-4 rounded-xl shadow-sm border border-border/30">
                  <TestSettings
                    difficulty={difficulty}
                    onDifficultyChange={changeDifficulty}
                    useCustomText={useCustomText}
                    onCustomTextChange={handleCustomTextChange}
                    useMistralAI={useMistralAI}
                    onMistralAIChange={handleMistralAIChange}
                    displayMode={displayMode}
                    onDisplayModeChange={handleDisplayModeChange}
                    time={time}
                    onTimeChange={handleTimeChange}
                  />
                </div>
                
                {/* Keyboard Settings */}
                <div className="bg-background/50 p-4 rounded-xl shadow-sm border border-border/30 space-y-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <KeyboardIcon className="h-4 w-4 text-primary" />
                    <Label className="font-medium">Keyboard Settings</Label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyboard-layout" className="mb-1 block">Keyboard Layout</Label>
                      <Select 
                        defaultValue="qwerty"
                        onValueChange={(value) => setKeyboardLayout(value as KeyboardLayoutType)}
                      >
                        <SelectTrigger id="keyboard-layout">
                          <SelectValue placeholder="Select keyboard layout" />
                        </SelectTrigger>
                        <SelectContent>
                          {keyboardLayouts.map((layout) => (
                            <SelectItem key={layout.value} value={layout.value}>
                              {layout.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-keyboard" className="flex-1">Show Virtual Keyboard</Label>
                      <Switch
                        id="show-keyboard"
                        checked={showKeyboard}
                        onCheckedChange={setShowKeyboard}
                        disabled={isMobile}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-performance" className="flex-1">Show Performance Monitor</Label>
                      <Switch
                        id="show-performance"
                        checked={showPerformanceMonitor}
                        onCheckedChange={setShowPerformanceMonitor}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Timer Header */}
            <div className="mb-3">
              <TestHeader
                time={time}
                remainingTime={remainingTime}
                isRunning={isRunning}
                isPaused={isPaused}
                isLoading={isLoading} 
                onTimeEnd={endTest}
                onStartTest={handleStartTest}
                onEndTest={endTest}
                focusModeActive={focusMode}
                isFullscreen={isFullscreen}
                isMobile={isMobile}
              />
            </div>
            
            {/* Main Typing Area */}
            <div className={cn(
              "typing-content w-full space-y-3",
              isFullscreen && "fullscreen-typing-content",
              focusMode && "focus-mode-typing-content"
            )}>
              {/* Test Controls */}
              {!focusMode && <TestControls 
                isRunning={isRunning}
                isPaused={isPaused}
                isFocused={isFocused}
                isLoading={isLoading}
                isFullscreen={isFullscreen}
                focusModeActive={focusMode}
                onStartTest={handleStartTest}
                onEndTest={endTest}
                onRestartTest={restartTest}
                onPauseTest={pauseTest}
                onResumeTest={resumeTest}
                onToggleFullscreen={toggleFullscreen}
                isMobile={isMobile}
              />}
              
              {/* Typing Area */}
              <div
                className={cn(
                  "typing-area w-full rounded-lg bg-card/60 backdrop-blur relative transition-all p-3 sm:p-4 md:p-6",
                  isRunning && "running-container",
                  isPaused && "paused-container",
                  isMobile && "mobile-text-container",
                  isMobile && isRunning && "mobile-fixed-container",
                  isFullscreen && "fullscreen-text-container",
                  focusMode && "focus-mode-text-container",
                  isMobile && !isFullscreen && "mobile-optimized-container"
                )}
                onClick={handleTextContainerClick}
                style={isMobile && isRunning ? { paddingBottom: '100px' } : {}}
              >
                {/* Pause overlay */}
                {isPaused && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg">
                    <div className="bg-background/80 backdrop-blur p-4 rounded-xl shadow-lg text-center">
                      <PauseCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-base font-medium">Test Paused</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={resumeTest}
                      >
                        Resume
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Character Display based on display mode */}
                {displayMode === "code" ? (
                  <CodeDisplay
                    text={displayText}
                    charStates={charStates}
                    onContainerClick={handleTextContainerClick}
                    isFocused={isFocused}
                    isRunning={isRunning}
                    textContainerRef={textContainerRef}
                    countdownValue={countdownValue}
                  />
                ) : displayMode === "word" ? (
                  <WordModeDisplay 
                    text={displayText}
                    charStates={charStates}
                    onContainerClick={handleTextContainerClick}
                    isFocused={isFocused}
                    isRunning={isRunning}
                    textContainerRef={textContainerRef}
                    countdownValue={countdownValue}
                  />
                ) : (
                  <CharacterDisplay
                    text={displayText}
                    charStates={charStates}
                    onContainerClick={handleTextContainerClick}
                    isFocused={isFocused}
                    isRunning={isRunning}
                    time={time}
                    textContainerRef={textContainerRef}
                    countdownValue={countdownValue}
                    currentIndex={currentIndex}
                    typed={userInput}
                    status={null}
                    cursor={null}
                    isMobile={isMobile}
                    isFullscreen={isFullscreen}
                    focusMode={focusMode}
                    isPaused={isPaused}
                    isLoading={isLoading}
                  />
                )}
                
                {/* Hidden input for typing */}
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={textInputRef}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Typing input"
                  className="sr-only"
                />
              </div>
              
              {/* Floating controls for fullscreen/mobile */}
              <AnimatePresence>
                {(isFullscreen || (isMobile && mobileFocusMode)) && showMiniControls && isRunning && (
                  <motion.div 
                    className={cn(
                      "fixed z-40 transition-opacity",
                      isMobile ? "bottom-6 right-4 left-4 flex justify-center" : "bottom-6 right-6"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-background/80 backdrop-blur-md rounded-full shadow-lg p-1.5 flex items-center gap-1">
                      <TooltipProvider>
                        {/* Pause/Resume Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full"
                              onClick={isPaused ? resumeTest : pauseTest}
                            >
                              <span className="sr-only">{isPaused ? "Resume" : "Pause"}</span>
                              {isPaused ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <rect x="6" y="4" width="4" height="16"></rect>
                                  <rect x="14" y="4" width="4" height="16"></rect>
                                </svg>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isPaused ? "Resume Test" : "Pause Test"}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {/* End Test Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full"
                              onClick={endTest}
                            >
                              <span className="sr-only">End Test</span>
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>End Test</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {/* Fullscreen Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full"
                              onClick={toggleFullscreen}
                            >
                              <span className="sr-only">Toggle Fullscreen</span>
                              {isFullscreen ? (
                                <Minimize2 className="h-4 w-4" />
                              ) : (
                                <Maximize2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Countdown Overlay */}
            {countdownValue !== null && (
              <motion.div 
                className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="text-6xl sm:text-8xl font-bold text-primary"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {countdownValue}
                </motion.div>
              </motion.div>
            )}
            
            {/* Virtual Keyboard (desktop only) */}
            {showKeyboard && !isMobile && (
              <div className="mt-4">
                <VirtualKeyboard 
                  currentKey={lastPressedKey} 
                  errorKey={lastErrorKey}
                  keyboardLayout={keyboardLayout}
                  compact={true}
                />
              </div>
            )}
            
            {/* Performance Monitor */}
            {showPerformanceMonitor && (
              <div className={cn(
                "mt-4",
                isFullscreen && "fixed bottom-4 right-4 z-30 w-80",
                focusMode && "opacity-70 hover:opacity-100 transition-opacity"
              )}>
                <PerformanceMonitor 
                  averageFrameTime={averageFrameTime}
                  renderCount={renderCount}
                />
              </div>
            )}
          </div>
        ) : (
          /* Results screen */
          <TestResults 
            results={results} 
            onRestart={restartTest} 
            isFullscreen={isFullscreen} 
            onExitFullscreen={exitFullscreen}
          />
        )}
      </div>
    </div>
  );
} 