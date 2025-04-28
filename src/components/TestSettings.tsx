import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Cog, Timer, PencilRuler, AlertCircle, Save, Bot, Info, Eye, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { addCustomText, clearCustomTexts, challengeTypes, ChallengeType } from "@/utils/textGenerator";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAnimations } from "@/context/AnimationsContext";
import { DifficultySelector } from "./DifficultySelector";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Time options in seconds
const TIME_OPTIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1m" },
  { value: 120, label: "2m" },
  { value: 300, label: "5m" }
];

export interface TestSettingsProps {
  difficulty: ChallengeType;
  onDifficultyChange: (value: string) => void;
  useCustomText: boolean;
  onCustomTextChange: (value: boolean) => void;
  useMistralAI: boolean;
  onMistralAIChange: (value: boolean) => void;
  displayMode: string;
  onDisplayModeChange: (value: string) => void;
  time?: number;
  onTimeChange?: (value: number) => void;
}

export function TestSettings({
  difficulty,
  onDifficultyChange,
  useCustomText,
  onCustomTextChange,
  useMistralAI,
  onMistralAIChange,
  displayMode,
  onDisplayModeChange,
  time = 60,
  onTimeChange
}: TestSettingsProps) {
  const [customText, setCustomText] = useState(() => {
    // Load from localStorage on initial render
    return localStorage.getItem("typingCustomText") || "";
  });

  const [activeTab, setActiveTab] = useState<string>("general");
  const { animationsEnabled } = useAnimations();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const contentRef = useRef<HTMLDivElement>(null);

  // Save custom text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("typingCustomText", customText);
  }, [customText]);

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setCustomText(newText);
  };

  const handleSaveCustomText = () => {
    if (customText.trim()) {
      clearCustomTexts();
      addCustomText(customText);
      toast({
        title: "Custom text saved",
        description: "Your text has been saved and will be used for typing tests.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter some text before saving.",
        variant: "destructive"
      });
    }
  };

  // Handle toggle of custom text
  const handleCustomTextToggle = (checked: boolean) => {
    if (checked && customText.trim()) {
      clearCustomTexts();
      addCustomText(customText);
    }
    if (checked && useMistralAI) {
      // Can't use both custom text and Mistral AI
      onMistralAIChange(false);
    }
    onCustomTextChange(checked);
  };

  // Handle toggle of Mistral AI
  const handleMistralAIToggle = (checked: boolean) => {
    if (checked && useCustomText) {
      // Can't use both custom text and Mistral AI
      onCustomTextChange(false);
    }
    onMistralAIChange(checked);
  };

  // Load custom text when component mounts
  useEffect(() => {
    clearCustomTexts();
    if (customText.trim()) {
      addCustomText(customText);
    }
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const renderContent = () => (
    <motion.div 
      className={cn(
        "space-y-5",
        isMobile && "pb-4" // Add padding at bottom for mobile
      )}
      initial={animationsEnabled ? { opacity: 0, y: 10 } : {}}
      animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
      transition={animationsEnabled ? { duration: 0.3 } : {}}
    >
      <div className={cn(
        "flex items-center justify-between mb-3",
        isMobile && "px-1" // Add horizontal padding for mobile
      )}>
        <div className="flex items-center space-x-2">
          <motion.div 
            whileHover={animationsEnabled ? { rotate: 180 } : {}}
            transition={animationsEnabled ? { duration: 0.6 } : {}}
          >
            <Cog className="h-5 w-5 text-primary" />
          </motion.div>
          <Label className="font-medium text-lg">Test Settings</Label>
        </div>
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 text-sm">Configure your typing test settings here. Choose difficulty, duration, and content type.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className={cn(
          "grid grid-cols-2 mb-4",
          isMobile && "sticky top-0 z-10 bg-background/95 mobile-tabs-header"
        )}>
          <TabsTrigger 
            value="general"
            className={cn(
              "px-3 py-2 text-sm", 
              isMobile && "h-10 text-xs"
            )}
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            className={cn(
              "px-3 py-2 text-sm",
              isMobile && "h-10 text-xs"
            )}
          >
            Content Source
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea 
          className={cn(
            isMobile && "settings-scroll-area"
          )}
        >
          <div ref={contentRef} className="overflow-y-auto">
            <TabsContent value="general" className="space-y-4 pt-2">
              <SettingCard 
                icon={<PencilRuler className="h-4 w-4 text-primary/80" />}
                title="Difficulty"
                description="Choose the complexity level of the test text"
                isMobile={isMobile}
              >
                <DifficultySelector 
                  value={difficulty}
                  onChange={onDifficultyChange}
                  showAllOptions={useMistralAI}
                />
              </SettingCard>

              {/* Test Duration */}
              {onTimeChange && (
                <SettingCard 
                  icon={<Timer className="h-4 w-4 text-primary/80" />}
                  title="Test Duration"
                  description="Set how long your typing test will run"
                  isMobile={isMobile}
                >
                  <div className="w-full pt-2">
                    <RadioGroup
                      id="time-selector"
                      defaultValue={time.toString()}
                      onValueChange={(value) => onTimeChange(parseInt(value))}
                      className="flex flex-wrap gap-2"
                    >
                      {TIME_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-1">
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`time-${option.value}`}
                            className="peer sr-only radio-group-item"
                          />
                          <Label
                            htmlFor={`time-${option.value}`}
                            className={cn(
                              "flex h-10 w-14 cursor-pointer items-center justify-center rounded-md border border-muted bg-popover text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground",
                              time === option.value && "bg-primary text-primary-foreground"
                            )}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </SettingCard>
              )}
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4 pt-2">
              <SettingCard 
                icon={<Eye className="h-4 w-4 text-primary/80" />}
                title="Display Mode"
                description="Choose how the text is displayed during the test"
                isMobile={isMobile}
              >
                <div className="w-full pt-2">
                  <Select 
                    value={displayMode} 
                    onValueChange={(value) => onDisplayModeChange(value as string)}
                  >
                    <SelectTrigger className={cn(
                      isMobile && "h-12 text-base"
                    )}>
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="character">Character</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Choose how the text is displayed during the typing test.
                  </p>
                </div>
              </SettingCard>
              
              <SettingCard 
                icon={<Bot className="h-4 w-4 text-primary/80" />}
                title="Use Mistral AI"
                description="Generate texts using AI for varied content"
                toggle
                checked={useMistralAI}
                onCheckedChange={handleMistralAIToggle}
                disabled={useCustomText}
                isMobile={isMobile}
              />

              <SettingCard 
                icon={<AlertCircle className="h-4 w-4 text-primary/80" />}
                title="Use Custom Text"
                description="Provide your own text for typing practice"
                toggle
                checked={useCustomText}
                onCheckedChange={handleCustomTextToggle}
                disabled={useMistralAI}
                isMobile={isMobile}
              />

              <AnimatePresence>
                {useCustomText && (
                  <motion.div 
                    className="space-y-2"
                    initial={animationsEnabled ? { opacity: 0, height: 0 } : {}}
                    animate={animationsEnabled ? { opacity: 1, height: "auto" } : {}}
                    exit={animationsEnabled ? { opacity: 0, height: 0 } : {}}
                    transition={animationsEnabled ? { duration: 0.3 } : {}}
                  >
                    <Textarea
                      id="custom-text-input"
                      placeholder="Enter your custom text here..."
                      value={customText}
                      onChange={handleCustomTextChange}
                      className={cn(
                        "min-h-24 bg-background/70 border-border/60",
                        isMobile && "min-h-32 text-base"
                      )}
                    />
                    <Button 
                      onClick={handleSaveCustomText}
                      className={cn(
                        "w-full",
                        isMobile && "mobile-button"
                      )}
                      variant="outline"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Custom Text
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Note: Custom text will override the difficulty setting.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </motion.div>
  );

  return renderContent();
}

// Helper component for settings
interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  toggle?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

function SettingCard({
  icon,
  title,
  description,
  children,
  toggle = false,
  checked,
  onCheckedChange,
  disabled = false,
  isMobile = false
}: SettingCardProps) {
  const [expanded, setExpanded] = useState(!isMobile);

  // Always expand when not on mobile
  useEffect(() => {
    if (!isMobile) {
      setExpanded(true);
    }
  }, [isMobile]);

  return (
    <motion.div 
      className={cn(
        "bg-background/70 rounded-lg border border-border/30",
        isMobile ? "setting-card" : "p-4" 
      )}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div 
        className={cn(
          "flex items-start justify-between gap-4",
          isMobile && children && "cursor-pointer"
        )}
        onClick={() => isMobile && children && setExpanded(prev => !prev)}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {icon}
            <Label className={cn(
              "font-medium",
              isMobile && "text-base"
            )}>
              {title}
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {toggle ? (
          <Switch 
            checked={checked} 
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className={cn(isMobile && "setting-toggle")}
          />
        ) : isMobile && children ? (
          <ChevronRight 
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform", 
              expanded && "rotate-90 expand-indicator"
            )} 
          />
        ) : null}
      </div>
      
      <AnimatePresence>
        {(expanded && children) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
