import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PracticeModes } from "@/components/PracticeModes";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTypingStats } from "@/context/TypingStatsContext";
import { useState, useEffect, memo, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowDown, 
  Keyboard, 
  Clock,
  Trophy, 
  BarChart2, 
  Github, 
  Star, 
  Code, 
  Users, 
  Sparkles, 
  Zap, 
  HeartHandshake, 
  Settings,
  Rocket,
  Award,
  BookOpen,
  UsersRound,
  TrendingUp,
  Brain
} from "lucide-react";
import { useAnimations } from "@/context/AnimationsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypingFundamentals, SpeedTechniques, ProTips } from "@/components/guides";

// Memoize stat cards for better performance
const StatCard = memo(({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <motion.div 
    className="bg-card rounded-xl p-4 text-center shadow-md backdrop-blur-sm border border-border/30 relative overflow-hidden"
    whileHover={{ y: -5, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
    <div className="flex justify-center mb-3 relative z-10">
      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shadow-inner transform transition-transform group-hover:rotate-12">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold mb-1 relative z-10 font-mono tracking-tight">{value}</div>
    <div className="text-xs font-medium text-muted-foreground relative z-10">{label}</div>
  </motion.div>
));

// Memoize feature card for better performance
const FeatureCard = memo(({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <motion.div 
    className="glass-card p-6 text-center card-3d border border-border/30 rounded-xl relative overflow-hidden group"
    whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all duration-500"></div>
    
    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner relative z-10 group-hover:transform group-hover:scale-110 transition-all duration-300">
      <div className="text-primary transform group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3 relative z-10 group-hover:text-primary transition-colors duration-300">{title}</h3>
    <p className="text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">{description}</p>
  </motion.div>
));

// Enhanced quick action buttons
const QuickAction = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-md relative overflow-hidden group"
          onClick={onClick}
          aria-label={label}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative z-10 text-foreground group-hover:text-primary transition-colors duration-300">
            {icon}
          </div>
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs font-medium">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Memoize hero section for better performance
const HeroSection = memo(({ scrollToTest }: { scrollToTest: () => void }) => {
  const { animationsEnabled } = useAnimations();
  const { stats, hasRealData } = useTypingStats();
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll detection for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reduce animation complexity when disabled
  const animationProps = animationsEnabled 
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      } 
    : { initial: {}, animate: {}, transition: {} };

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Determine default values if no real data
  const displayValues = {
    wpm: hasRealData ? stats.wpm : 0,
    accuracy: hasRealData ? stats.accuracy : 0,
    rank: hasRealData ? stats.rank : 0,
    bestWpm: hasRealData ? stats.bestWpm : 0,
    streakDays: hasRealData ? stats.streakDays : 0,
    improvementRate: hasRealData ? stats.improvementRate : 0,
    totalCharactersTyped: hasRealData ? stats.totalCharactersTyped : 0
  };

  return (
    <div className="w-full hero-section bg-gradient-to-b from-primary/10 via-[hsl(242,85%,60%/0.05)] to-accent/10 py-12 md:py-28 border-b border-border/20 relative overflow-hidden">
      <div className="hero-pattern"></div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute top-20 left-[10%] w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-[15%] w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-[25%] w-24 h-24 bg-primary/8 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <motion.div 
        className="container px-4 sm:px-6 relative z-10"
        {...animationProps}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <motion.div 
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full text-sm font-medium shadow-md backdrop-blur-sm border border-primary/10"
              initial={{ opacity: animationsEnabled ? 0 : 1, scale: animationsEnabled ? 0.8 : 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Keyboard className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-primary">Master Your Typing Skills</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              initial={{ opacity: animationsEnabled ? 0 : 1, y: animationsEnabled ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Elevate your <span className="gradient-heading relative">keyboard <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full"></span></span> skills, boost your <span className="gradient-heading">productivity</span>
            </motion.h1>
            
            <motion.p 
              className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: animationsEnabled ? 0 : 1, y: animationsEnabled ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Enhance your typing speed and accuracy with our advanced, interactive typing tests. 
              Challenge yourself, track your progress, and watch your WPM soar to new heights!
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-6"
              initial={{ opacity: animationsEnabled ? 0 : 1, y: animationsEnabled ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary via-[hsl(242,85%,60%)] to-accent hover:shadow-glow text-white w-full sm:w-auto group transition-all duration-300 rounded-full h-12"
                onClick={scrollToTest}
              >
                <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Start Typing Test
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 w-full sm:w-auto hover:bg-primary/5 transition-all duration-300 rounded-full border-primary/20 h-12"
                onClick={() => window.location.hash = "#/leaderboard"}
              >
                <Trophy className="h-5 w-5 text-amber-500" />
                View Leaderboard
              </Button>
            </motion.div>
            
            <motion.div
              className="flex items-center justify-center md:justify-start gap-2 mt-6 pt-2 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Badge variant="outline" className="flex items-center gap-1 py-1.5 bg-background/50 backdrop-blur-sm">
                <Github className="h-3 w-3" />
                <a 
                  href="https://github.com/Xenonesis/speed-typist-challenge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5 bg-background/50 backdrop-blur-sm">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5 bg-background/50 backdrop-blur-sm">
                <Users className="h-3 w-3" />
                <span>10K+ Users</span>
              </Badge>
            </motion.div>
          </div>
          
          <div className="md:col-span-5">
            {animationsEnabled ? (
              <motion.div 
                className="flex flex-col gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {/* New typing preview component */}
                <TypingPreview />
                
                <div className="relative float">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-[hsl(242,85%,60%)] to-accent opacity-30 rounded-xl blur"></div>
                  <div className="relative glass rounded-xl p-4 sm:p-5 flex items-center justify-center card-3d border border-border/20">
                    {!hasRealData && (
                      <div className="absolute top-0 right-0 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10 backdrop-blur-sm shadow-sm">
                        Sample Data
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 sm:p-3 max-w-md w-full">
                      <StatCard 
                        label="WPM" 
                        value={displayValues.wpm ? displayValues.wpm.toString() : "--"} 
                        icon={<Keyboard className="h-5 w-5 text-primary" />} 
                      />
                      <StatCard 
                        label="Accuracy" 
                        value={displayValues.accuracy ? `${displayValues.accuracy}%` : "--%"} 
                        icon={<BarChart2 className="h-5 w-5 text-accent" />} 
                      />
                      <StatCard 
                        label="Rank" 
                        value={displayValues.rank ? `#${displayValues.rank}` : "#--"} 
                        icon={<Trophy className="h-5 w-5 text-amber-500" />} 
                      />
                      {hasRealData && stats.totalTestsCompleted > 0 && (
                        <>
                          <StatCard 
                            label="Best WPM" 
                            value={`${displayValues.bestWpm}`} 
                            icon={<Award className="h-5 w-5 text-green-500" />} 
                          />
                          {stats.streakDays > 0 && (
                            <StatCard 
                              label="Day Streak" 
                              value={`${displayValues.streakDays}d`} 
                              icon={<Zap className="h-5 w-5 text-orange-500" />} 
                            />
                          )}
                          {stats.improvementRate !== 0 && (
                            <StatCard 
                              label="Progress" 
                              value={`${displayValues.improvementRate > 0 ? '+' : ''}${displayValues.improvementRate}%`} 
                              icon={<TrendingUp className="h-5 w-5 text-blue-500" />} 
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* New typing preview component */}
                <TypingPreview />
                
                <div className="relative float">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-[hsl(242,85%,60%)] to-accent opacity-30 rounded-xl blur"></div>
                  <div className="relative glass rounded-xl p-4 sm:p-5 flex items-center justify-center card-3d border border-border/20">
                    {!hasRealData && (
                      <div className="absolute top-0 right-0 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10 backdrop-blur-sm shadow-sm">
                        Sample Data
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 sm:p-3 max-w-md w-full">
                      <StatCard 
                        label="WPM" 
                        value={displayValues.wpm ? displayValues.wpm.toString() : "--"} 
                        icon={<Keyboard className="h-5 w-5 text-primary" />} 
                      />
                      <StatCard 
                        label="Accuracy" 
                        value={displayValues.accuracy ? `${displayValues.accuracy}%` : "--%"} 
                        icon={<BarChart2 className="h-5 w-5 text-accent" />} 
                      />
                      <StatCard 
                        label="Rank" 
                        value={displayValues.rank ? `#${displayValues.rank}` : "#--"} 
                        icon={<Trophy className="h-5 w-5 text-amber-500" />} 
                      />
                      {hasRealData && stats.totalTestsCompleted > 0 && (
                        <>
                          <StatCard 
                            label="Best WPM" 
                            value={`${displayValues.bestWpm}`} 
                            icon={<Award className="h-5 w-5 text-green-500" />} 
                          />
                          {stats.streakDays > 0 && (
                            <StatCard 
                              label="Day Streak" 
                              value={`${displayValues.streakDays}d`} 
                              icon={<Zap className="h-5 w-5 text-orange-500" />} 
                            />
                          )}
                          {stats.improvementRate !== 0 && (
                            <StatCard 
                              label="Progress" 
                              value={`${displayValues.improvementRate > 0 ? '+' : ''}${displayValues.improvementRate}%`} 
                              icon={<TrendingUp className="h-5 w-5 text-blue-500" />} 
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add total characters typed counter for user motivation */}
            {hasRealData && displayValues.totalCharactersTyped > 0 && (
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-muted-foreground text-sm">
                  <span className="font-medium">Total Typed: </span>
                  <span className="font-bold">{formatNumber(displayValues.totalCharactersTyped)}</span> characters
                </div>
              </motion.div>
            )}

            {!hasRealData && (
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary border-primary/30 hover:bg-primary/10 relative z-10"
                    onClick={scrollToTest}
                  >
                    <Keyboard className="h-4 w-4 mr-2 animate-pulse" />
                    Take your first typing test
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Decorative keyboard floating in the background */}
        <div className="absolute bottom-0 right-[5%] w-32 h-32 opacity-10 hidden lg:block">
          <div className="animate-float">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-primary">
              <rect x="10" y="20" width="80" height="60" rx="5" />
              <rect x="20" y="30" width="10" height="10" rx="2" />
              <rect x="35" y="30" width="10" height="10" rx="2" />
              <rect x="50" y="30" width="10" height="10" rx="2" />
              <rect x="65" y="30" width="10" height="10" rx="2" />
              <rect x="20" y="45" width="10" height="10" rx="2" />
              <rect x="35" y="45" width="10" height="10" rx="2" />
              <rect x="50" y="45" width="10" height="10" rx="2" />
              <rect x="65" y="45" width="10" height="10" rx="2" />
              <rect x="25" y="60" width="45" height="10" rx="2" />
            </svg>
          </div>
        </div>
        
        {/* Floating WPM indicator */}
        <div className="absolute top-[25%] left-[10%] opacity-10 hidden lg:block">
          <div className="animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full font-mono">
              <span className="text-xl font-bold text-primary">85 WPM</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions - Improved for both mobile and desktop */}
        <motion.div
          className="mt-12 flex justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <QuickAction 
            icon={<Keyboard className="h-5 w-5 md:h-6 md:w-6" />} 
            label="Quick Test" 
            onClick={scrollToTest}
          />
          <QuickAction 
            icon={<Sparkles className="h-5 w-5 md:h-6 md:w-6" />} 
            label="Practice" 
            onClick={() => window.location.hash = "#/practice"}
          />
          <QuickAction 
            icon={<UsersRound className="h-5 w-5 md:h-6 md:w-6" />} 
            label="Multiplayer" 
            onClick={() => window.location.hash = "#/multiplayer"}
          />
          <QuickAction 
            icon={<Trophy className="h-5 w-5 md:h-6 md:w-6" />} 
            label="Leaderboard" 
            onClick={() => window.location.hash = "#/leaderboard"}
          />
          <QuickAction 
            icon={<BarChart2 className="h-5 w-5 md:h-6 md:w-6" />} 
            label="Statistics" 
            onClick={() => window.location.hash = "#/stats"}
          />
          <QuickAction 
            icon={<Settings className="h-5 w-5 md:h-6 md:w-6" />} 
            label="Settings" 
            onClick={() => window.location.hash = "#/profile?tab=appearance"}
          />
        </motion.div>
        
        {animationsEnabled && (
          <motion.div 
            className="flex justify-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full animate-bounce backdrop-blur-sm bg-background/30" 
              onClick={scrollToTest}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

// Interactive typing preview component with enhanced design and animations
const TypingPreview = memo(() => {
  const [texts] = useState([
    {
      content: "The quick brown fox jumps over the lazy dog. Practice your typing to increase speed and accuracy.",
      author: "Typing Master Pro",
      difficulty: 1
    },
    {
      content: "Mastering touch typing can boost your productivity by 20-40%. Start your journey today!",
      author: "Productivity Expert",
      difficulty: 2
    },
    {
      content: "Every expert was once a beginner. Your typing speed will improve with regular practice.",
      author: "Typing Coach",
      difficulty: 3
    }
  ]);
  
  const [textIndex, setTextIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);

  const currentText = texts[textIndex];
  const difficultyColors = [
    'from-emerald-500 to-teal-400',
    'from-amber-500 to-yellow-400',
    'from-rose-500 to-pink-400'
  ];
  const difficultyLabels = ['Beginner', 'Intermediate', 'Advanced'];
  const difficulty = currentText?.difficulty || 1;
  
  // Animation variants for text container
  const containerVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.02,
        delayChildren: 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.99,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Animation variants for individual characters
  const charVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.95,
      filter: 'blur(1px)'
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.3,
        delay: i * 0.015,
        ease: [0.22, 1, 0.36, 1]
      },
    }),
  };

  // Animation for the progress bar with gradient
  const progressBarVariants = {
    initial: { 
      width: '0%',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    animate: (i: number) => ({
      width: `${i}%`,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        delay: 0.2
      }
    })
  };
  
  // Animation for difficulty indicator
  const difficultyVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${(difficulty / 3) * 100}%`,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    }
  };

  useEffect(() => {
    if (!isActive) return;
    
    // Calculate typing metrics
    const calculateMetrics = () => {
      // Simulate realistic WPM (words per minute) based on difficulty
      const baseWPM = 30 + (difficulty * 15) + Math.random() * 10;
      const currentWPM = Math.min(120, Math.max(20, baseWPM + (Math.random() * 10 - 5)));
      
      // Calculate accuracy with some variation
      const baseAccuracy = 95 - (difficulty * 2);
      const currentAccuracy = Math.max(85, Math.min(100, baseAccuracy + (Math.random() * 5 - 2.5)));
      
      setTypingSpeed(Math.round(currentWPM));
      setAccuracy(parseFloat(currentAccuracy.toFixed(1)));
    };
    
    // Variable typing speed based on character type and difficulty
    const getTypingSpeed = (char: string, pos: number) => {
      // Base speed affected by difficulty
      const baseDelay = 30 + (difficulty * 5) + (Math.random() * 30);
      
      // Slow down for special characters
      if (/[A-Z]/.test(char)) return baseDelay * 1.5; // Slower for uppercase
      if (/[^\w\s]/.test(char)) return baseDelay * 1.3; // Slower for symbols
      
      // Natural variation in typing speed
      return baseDelay * (0.8 + Math.random() * 0.4);
    };
    
    let typingTimeout: NodeJS.Timeout;
    let lastMetricUpdate = 0;
    
    const typeNextCharacter = () => {
      if (!isActive) return;
      
      const nextPos = currentPosition + 1;
      const currentChar = currentText.content[currentPosition];
      const elapsedTime = Date.now() - lastMetricUpdate;
      
      // Update metrics every 500ms for performance
      if (elapsedTime > 500 || lastMetricUpdate === 0) {
        calculateMetrics();
        lastMetricUpdate = Date.now();
      }
      
      setCurrentPosition(nextPos);
      // Ensure progress calculation is accurate
      const calculatedProgress = Math.min(100, Math.max(0, (nextPos / currentText.content.length) * 100));
      setProgress(calculatedProgress);
      
      // Show metrics when reaching certain progress points
      if (nextPos === 1) setShowMetrics(true);
      
      if (nextPos >= currentText.content.length) {
        // Complete typing, show final metrics
        calculateMetrics();
        
        // Pause at the end of text
        setTimeout(() => {
          setIsActive(false);
          
          // Switch to next text after a pause
          setTimeout(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
            setCurrentPosition(0);
            setProgress(0);
            setShowMetrics(false);
            setIsActive(true);
          }, 1200);
        }, 1000);
        return;
      }
      
      // Schedule next character with variable delay
      const speed = getTypingSpeed(currentChar, nextPos);
      typingTimeout = setTimeout(typeNextCharacter, speed);
    };
    
    // Start typing with a slight delay
    typingTimeout = setTimeout(typeNextCharacter, 200);
    
    // Cursor blink animation with smooth transition
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, isHovered ? 1000 : 600); // Slower blink when hovered
    
    return () => {
      clearTimeout(typingTimeout);
      clearInterval(cursorInterval);
    };
  }, [currentPosition, isActive, currentText, isHovered, difficulty, texts.length]);
  
  // Split text into characters for animation
  const typedText = currentText.content.substring(0, currentPosition);
  const untypedText = currentText.content.substring(currentPosition);
  
  // Split text into characters for animation
  const chars = currentText.content.split('');
  
  return (
    <motion.div 
      className="group w-full rounded-xl bg-background/95 border border-border/30 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 overflow-hidden font-mono relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        y: -4,
        boxShadow: '0 15px 30px -5px rgba(var(--primary), 0.15), 0 10px 15px -6px rgba(var(--primary), 0.1)',
        scale: 1.01,
        transition: { 
          y: { type: 'spring', stiffness: 400, damping: 15 },
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          boxShadow: { duration: 0.4 }
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Simplified terminal header */}
      <div className="relative z-10 h-10 bg-muted/60 border-b border-border/20 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/90" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
          <div className="w-3 h-3 rounded-full bg-green-500/90" />
        </div>
        <div className="absolute left-0 right-0 flex justify-center">
          <div className="text-xs font-medium bg-background/80 px-3 py-1 rounded-full border border-border/20 flex items-center gap-1.5">
            <span className="text-green-400">➜</span>
            <span className="text-primary font-medium">typing-master</span>
            <span className="mx-1 text-muted-foreground/60">•</span>
            <span className="text-amber-500">{difficultyLabels[difficulty - 1]}</span>
          </div>
        </div>
      </div>
      
      {/* Terminal content */}
      <div className="relative p-5 pt-6 pb-8 min-h-[180px] flex flex-col">
        {/* Simplified metrics section with improved clarity */}
        {showMetrics && (
          <motion.div 
            className="grid grid-cols-3 gap-4 mb-6 bg-muted/10 rounded-lg p-4 border border-border/20"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* WPM Metric */}
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-primary"
                key={typingSpeed}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {typingSpeed}
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">
                WPM
              </div>
            </div>
            
            {/* Accuracy Metric */}
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-foreground"
                key={accuracy}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {accuracy}%
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">
                Accuracy
              </div>
            </div>
            
            {/* Difficulty Metric */}
            <div className="text-center">
              <div className="flex justify-center">
                {[1, 2, 3].map((level) => (
                  <div 
                    key={level}
                    className={`h-1.5 w-5 rounded-full mx-0.5 ${
                      level <= difficulty 
                        ? 'bg-amber-500' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">
                {difficultyLabels[difficulty - 1]}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Simplified typing area with better contrast */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Typing text with better readability */}
          <div className="relative text-base md:text-[15px] leading-relaxed tracking-wide font-mono p-4 rounded-md bg-muted/10 border border-border/20 shadow-sm">
            {/* Typed text with better contrast */}
            <span className="text-foreground font-medium">
              {typedText}
            </span>
            
            {/* Simple cursor with reliable animation */}
            <motion.span 
              className="inline-block w-[2px] h-4 -mb-[1px] mx-[1px] rounded-sm bg-primary"
              animate={{
                opacity: cursorVisible ? [0.7, 1, 0.7] : 0
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            {/* Untyped text with better visibility */}
            <span className="text-muted-foreground">
              {untypedText}
            </span>
          </div>
          
          {/* Simplified progress bar */}
          <div className="mt-4 h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            />
          </div>
        </motion.div>
        
        {/* Simplified status bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium">Live Preview</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Author badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="opacity-70">Author:</span>
              <span className="font-medium text-primary">{currentText.author}</span>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3 text-primary" />
              <span className="font-medium">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
        </div>
      
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
    </motion.div>
  );
});

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const { animationsEnabled } = useAnimations();
  const { stats } = useTypingStats();
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const handleModeSelect = useCallback((mode: string) => {
    setSelectedMode(mode);
    
    // Handle different practice modes
    switch(mode) {
      case "word-practice":
        window.location.hash = "#/word-practice";
        break;
      case "quote-practice":
        window.location.hash = "#/quote-practice";
        break;
      case "code-practice":
        window.location.hash = "#/code-practice";
        break;
      default:
        toast({
          title: "Practice Mode Selected",
          description: `You've selected the ${mode} practice mode. This feature is coming soon!`,
        });
    }
  }, []);


  const navigateToTypingTest = useCallback(() => {
    window.location.hash = "#/typing-test";
  }, []);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Conditionally apply animations based on system preferences
  const baseAnimation = animationsEnabled ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 }
  } : {};

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <main className="flex-grow flex flex-col items-center justify-center p-0 pt-16 pb-20">
          {/* Hero Section */}
          <HeroSection scrollToTest={navigateToTypingTest} />
          
          {/* Main Content Section */}
          <div className="container px-4 sm:px-6 py-16">
            {/* Why Choose Us Section */}
            <div className="mb-24" ref={featuresRef}>
              <motion.div 
                className="text-center mb-12"
                {...baseAnimation}
              >
                <h2 className="text-3xl sm:text-4xl font-bold gradient-heading mb-4">Why Choose TypeSpeed Master?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Our platform offers the most comprehensive typing practice experience with features designed to maximize your progress.</p>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
                {...baseAnimation}
              >
                {/* Decorative elements */}
                <div className="hidden lg:block absolute -left-20 top-1/2 transform -translate-y-1/2 -z-10">
                  <div className="w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
                </div>
                <div className="hidden lg:block absolute -right-20 top-1/3 transform -translate-y-1/2 -z-10">
                  <div className="w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
                </div>
                
                <FeatureCard 
                  title="Real-time Analytics" 
                  description="Get instant feedback on your typing speed, accuracy, and areas for improvement."
                  icon={<BarChart2 className="h-6 w-6 text-primary" />}
                />
                <FeatureCard 
                  title="AI-Powered Training" 
                  description="Smart algorithms adapt to your skill level and provide personalized exercises."
                  icon={<Sparkles className="h-6 w-6 text-primary" />}
                />
                <FeatureCard 
                  title="Code Typing Practice" 
                  description="Special exercises for developers to improve coding speed and accuracy."
                  icon={<Code className="h-6 w-6 text-primary" />}
                />
                <FeatureCard 
                  title="Achievement System" 
                  description="Earn badges and rewards as you improve, keeping you motivated on your journey."
                  icon={<Award className="h-6 w-6 text-primary" />}
                />
              </motion.div>
            </div>
            
            {/* GitHub Repository Card - Redesigned */}
            <motion.div
              className="mb-20"
              {...baseAnimation}
            >
              <Card className="bg-gradient-to-r from-background to-card border border-border/30 overflow-hidden shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-full">
                        <Github className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">TypeSpeed Master is Open Source!</h3>
                        <p className="text-muted-foreground">Contribute, report issues, or star our repository</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-primary to-accent hover:shadow-glow text-white w-full md:w-auto group"
                      onClick={() => window.open("https://github.com/Xenonesis/speed-typist-challenge", "_blank")}
                    >
                      <Github className="mr-2 h-4 w-4 group-hover:animate-spin transition-all duration-700" />
                      Visit Repository
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Practice Modes and Heatmap Section - Improved with tabs for mobile */}
            <motion.div
              className="mb-20"
              {...baseAnimation}
            >
              <div className="md:hidden mb-8">
                <Tabs defaultValue="practice" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="practice">Practice Modes</TabsTrigger>
                    <TabsTrigger value="heatmap">Performance</TabsTrigger>
                  </TabsList>
                  <TabsContent value="practice" className="mt-4">
                    <Card className="border border-border/30 overflow-hidden shadow-sm">
                      <CardHeader className="bg-primary/5 pb-3 border-b border-border/30">
                        <CardTitle className="flex items-center text-lg">
                          <Code className="h-5 w-5 mr-2 text-primary" />
                          Practice Modes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <PracticeModes onModeSelect={handleModeSelect} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="heatmap" className="mt-4">
                    <Card className="border border-border/30 overflow-hidden shadow-sm">
                      <CardHeader className="bg-primary/5 pb-3 border-b border-border/30">
                        <CardTitle className="flex items-center text-lg">
                          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                          Performance Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <div className="text-center py-8">
                          <div className="mb-4">
                            <Trophy className="h-12 w-12 mx-auto text-primary/60" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Track Your Progress</h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Complete typing tests to see your performance analysis
                          </p>
                          <Button
                            size="sm"
                            onClick={() => window.location.hash = "#/typing-test"}
                            className="rounded-full"
                          >
                            Take a Test
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="border border-border/30 overflow-hidden shadow-sm h-full">
                    <CardHeader className="bg-primary/5 pb-3 border-b border-border/30">
                      <CardTitle className="flex items-center text-lg">
                        <Code className="h-5 w-5 mr-2 text-primary" />
                        Practice Modes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <PracticeModes onModeSelect={handleModeSelect} />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="border border-border/30 overflow-hidden shadow-sm h-full">
                    <CardHeader className="bg-primary/5 pb-3 border-b border-border/30">
                      <CardTitle className="flex items-center text-lg">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Typing Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center py-8">
                        <div className="mb-4">
                          <BarChart2 className="h-12 w-12 mx-auto text-primary/60" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Detailed Analysis</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          View comprehensive statistics in the Stats page
                        </p>
                        <Button
                          size="sm"
                          onClick={() => window.location.hash = "#/stats"}
                          className="rounded-full"
                        >
                          View Stats
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
            
            {/* Learning Resources - New section */}
            <motion.div
              className="mb-24"
              {...baseAnimation}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold gradient-heading mb-3">Learning Resources</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Enhance your typing skills with these expert-crafted guides and tips
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="bg-card border border-border/30 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <div className="p-6">
                    <div className="bg-blue-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors duration-300">Typing Fundamentals</h3>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                      Learn proper hand positioning, ergonomics, and core typing techniques from expert typists.
                    </p>
                    <div className="mt-auto">
                      <TypingFundamentals />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-card border border-border/30 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  <div className="p-6">
                    <div className="bg-purple-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors duration-300">
                      <Rocket className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-500 transition-colors duration-300">Speed Techniques</h3>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                      Advanced methods and drills designed to break through plateaus and dramatically increase your WPM.
                    </p>
                    <div className="mt-auto">
                      <SpeedTechniques />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-card border border-border/30 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-3 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                  <div className="p-6">
                    <div className="bg-amber-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                      <Award className="h-6 w-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-amber-500 transition-colors duration-300">Pro Tips & Tricks</h3>
                    <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                      Insider secrets from professional typists who've mastered the art of ultra-fast, accurate typing.
                    </p>
                    <div className="mt-auto">
                      <ProTips />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Call-to-Action - Enhanced */}
            <motion.div
              className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 md:p-12 text-center border border-border/20 relative overflow-hidden"
              {...baseAnimation}
            >
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDJjMTQgMCAyOCA1IDQwIDEzIDExIDggMjAgMjAgMjYgMzMgNSAxNCA2IDI5IDIgNDNzLTEzIDI3LTI1IDM3Yy0xMiA5LTI3IDE0LTQzIDE0LTE2IDAtMzEtNS00My0xNC0xMi0xMC0yMS0yMy0yNS0zNy00LTE0LTMtMjkgMi00MyA2LTEzIDE1LTI1IDI2LTMzIDEyLTggMjYtMTMgNDAtMTN6IiBzdHJva2U9InJnYmEoMTI5LCA3OCwgMjQ0LCAwLjEpIiBmaWxsPSJub25lIiB0cmFuc2Zvcm09Im1hdHJpeCgiLiwiLiIsLSUvMiwiPSR7MDEyMywhX2B9KiIvPjwvc3ZnPg==')] bg-repeat opacity-10 -z-10"></div>
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-70 animate-pulse-slow"></div>
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10"
              >
                <div className="flex justify-center mb-8">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center shadow-inner">
                    <HeartHandshake className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 gradient-heading">Ready to Become a Typing Master?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                  Join thousands of users who have significantly improved their typing speed and accuracy. 
                  Practice with our adaptive lessons or challenge friends in our multiplayer mode!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow text-base md:text-lg font-medium group rounded-full h-14 px-8"
                    onClick={navigateToTypingTest}
                  >
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Start Practicing Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 text-base md:text-lg font-medium group rounded-full h-14 px-8"
                    onClick={() => window.location.hash = "#/multiplayer"}
                  >
                    <UsersRound className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Try Multiplayer Mode
                  </Button>
                </div>
              </motion.div>
              
              <div className="mt-10 bg-background/50 backdrop-blur-sm rounded-xl p-4 max-w-lg mx-auto border border-border/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">NEW</Badge>
                  <h3 className="font-medium">Daily Typing Challenges</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete daily challenges to earn bonus points and climb the leaderboard rankings faster!
                </p>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
