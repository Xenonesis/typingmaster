import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { 
  BarChart2,
  Trophy, 
  User, 
  HelpCircle, 
  Info,
  Menu, 
  X,
  Keyboard,
  Award,
  History,
  Home,
  Star,
  Moon, 
  Sun,
  Settings,
  BellRing,
  UsersRound,
  ChevronDown,
  Code,
  BookOpen,
  Clock,
  Bot,
  Target,
  Brain,
  Sparkles,
  Type
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@/components/auth/UserButton";

// Add CSS for text shadow if not already in your global CSS
const textShadowStyle = `
  .text-shadow-sm {
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
`;

export function Header() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [testCount, setTestCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Add scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track test completions and show popup after 2 tests
  useEffect(() => {
    // This would typically be connected to your test completion logic
    // For now, we'll use a simulated approach
    const storedTestCount = parseInt(localStorage.getItem('testCount') || '0');
    setTestCount(storedTestCount);

    // Set up event listener for test completions
    const handleTestComplete = () => {
      const newCount = testCount + 1;
      setTestCount(newCount);
      localStorage.setItem('testCount', newCount.toString());
      
      if (newCount >= 2) {
        setShowPopup(true);
      }
    };

    // For demonstration, we'd typically connect to an event
    // window.addEventListener('testCompleted', handleTestComplete);
    
    // This is for demonstration only - in real app, connect to your test completion event
    const hash = window.location.hash;
    if (hash.includes('typing-test') && !localStorage.getItem('listenersSet')) {
      const testButton = document.querySelector('button[aria-label="Start Test"]');
      if (testButton) {
        testButton.addEventListener('click', handleTestComplete);
        localStorage.setItem('listenersSet', 'true');
      }
    }

    return () => {
      // Cleanup would remove the event listener
      // window.removeEventListener('testCompleted', handleTestComplete);
    };
  }, [testCount]);

  // If user is not logged in and not on an auth page, redirect to login
  useEffect(() => {
    const authPages = ['/login', '/signup', '/forgot-password'];
    const currentPath = location.pathname;
    
    if (!user && !authPages.includes(currentPath)) {
      // Don't redirect when on auth pages to prevent loops
      if (!currentPath.startsWith('/login') && 
          !currentPath.startsWith('/signup') && 
          !currentPath.startsWith('/forgot-password')) {
        // This is just a fallback - the ProtectedRoute component handles this primarily
        // navigate('/login', { state: { from: location } });
      }
    }
  }, [user, location]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Typing Test", href: "#/typing-test" },
    { label: "Stats", href: "#/stats" },
    { label: "Leaderboard", href: "#/leaderboard" },
    { label: "Achievements", href: "#/achievements" },
    { label: "Multiplayer", href: "#/multiplayer" },
    { label: "Updates", href: "#/updates" },
    { label: "About", href: "#/about" },
  ];

  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur transition-all duration-300",
        scrolled 
          ? "bg-background/30 border-border/20 shadow-sm py-2 border-b" 
          : "bg-transparent border-transparent py-3"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <style dangerouslySetInnerHTML={{ __html: textShadowStyle }} />
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <Link 
            to="/" 
            className="flex items-center space-x-3 font-bold text-xl transition-all duration-300 hover:opacity-80"
          >
            <motion.div 
              whileHover={{ rotate: 20, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-primary relative"
            >
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 via-[hsl(242,85%,60%)/30] to-accent/30 rounded-full blur-md opacity-70"></div>
              <div className="bg-background/50 backdrop-blur-sm p-1.5 rounded-full relative">
                <Keyboard className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <motion.span 
              className="bg-gradient-to-r from-primary via-[hsl(242,85%,60%)] to-accent bg-clip-text text-transparent font-bold hidden sm:block text-shadow-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              TypeSpeed Master
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-background/10 backdrop-blur-sm px-2 py-1 rounded-full border border-border/10">
            <NavLink to="/" active={location.pathname === "/"} icon={<Home className="h-4 w-4" />}>
              Home
            </NavLink>
            
            {/* Typing Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 h-auto relative group",
                    (location.pathname === "/typing-test" || location.pathname === "/practice" || location.pathname === "/multiplayer") 
                      ? "bg-background/50 text-primary font-semibold text-shadow-sm" 
                      : "hover:bg-background/30 hover:text-primary text-foreground font-medium"
                  )}
                >
                  <span className={cn(
                    "mr-2 transition-transform duration-300 group-hover:scale-110",
                    (location.pathname === "/typing-test" || location.pathname === "/practice" || location.pathname === "/multiplayer")
                      ? "text-primary"
                      : "text-primary/80 group-hover:text-primary"
                  )}>
                    <Keyboard className="h-4 w-4" />
                  </span>
                  <span className="text-shadow-sm">Practice</span>
                  <ChevronDown className="h-3 w-3 ml-1 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-56 backdrop-blur-lg bg-background/70 border-border/50 shadow-md rounded-xl overflow-hidden"
                sideOffset={5}
              >
                <div className="py-1 overflow-hidden">
                  {/* Typing Test */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/typing-test"}>
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">Typing Test</div>
                        <div className="text-xs text-foreground/80">Measure your WPM and accuracy</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  {/* Practice Mode */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/practice"}>
                      <Target className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium">Practice Mode</div>
                        <div className="text-xs text-foreground/80">Improve with targeted exercises</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  {/* Word Practice */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.125 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/word-practice"}>
                      <Type className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">Word Practice</div>
                        <div className="text-xs text-foreground/80">Master common and difficult words</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  {/* Multiplayer */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/multiplayer"}>
                      <UsersRound className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Multiplayer</div>
                        <div className="text-xs text-foreground/80">Compete with friends in real-time</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  <DropdownMenuSeparator />
                  
                  {/* AI Challenge */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/ai-challenge"}>
                      <Brain className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium">AI Challenge</div>
                        <div className="text-xs text-foreground/80">Face adaptive AI-powered challenges</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  {/* Updates */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/updates"}>
                      <History className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Updates</div>
                        <div className="text-xs text-foreground/80">See latest features and improvements</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Progress Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 h-auto relative group",
                    (location.pathname === "/stats" || location.pathname === "/leaderboard" || location.pathname === "/achievements") 
                      ? "bg-background/50 text-primary font-semibold text-shadow-sm" 
                      : "hover:bg-background/30 hover:text-primary text-foreground font-medium"
                  )}
                >
                  <span className={cn(
                    "mr-2 transition-transform duration-300 group-hover:scale-110",
                    (location.pathname === "/stats" || location.pathname === "/leaderboard" || location.pathname === "/achievements")
                      ? "text-primary"
                      : "text-primary/80 group-hover:text-primary"
                  )}>
                    <BarChart2 className="h-4 w-4" />
                  </span>
                  <span className="text-shadow-sm">Progress</span>
                  <ChevronDown className="h-3 w-3 ml-1 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-56 backdrop-blur-lg bg-background/70 border-border/50 shadow-md rounded-xl overflow-hidden"
                sideOffset={5}
              >
                <div className="py-1 overflow-hidden">
                  {/* Statistics */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/stats"}>
                      <BarChart2 className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">Statistics</div>
                        <div className="text-xs text-foreground/80">Track your typing performance</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  {/* Leaderboard */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/leaderboard"}>
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">Leaderboard</div>
                        <div className="text-xs text-foreground/80">Compare with other typists</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                  
                  {/* Achievements */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-foreground hover:text-foreground hover:bg-background/50" onClick={() => window.location.hash = "#/achievements"}>
                      <Award className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Achievements</div>
                        <div className="text-xs text-foreground/80">Unlock rewards and badges</div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="h-5 w-px bg-border/30 mx-1"></div>
            <NavLink to="/profile" active={location.pathname === "/profile"} icon={<User className="h-4 w-4" />}>
              Profile
            </NavLink>
            <NavLink to="/about" active={location.pathname === "/about"} icon={<Info className="h-4 w-4" />}>
              About
            </NavLink>
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <UserButton />
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container py-3 pb-4 space-y-1 bg-background/30 backdrop-blur-lg rounded-b-xl shadow-sm border-x border-b border-border/20">
              <div className="flex justify-end px-4 py-1">
                <ThemeToggle />
              </div>
              <MobileNavLink to="/" active={location.pathname === "/"} icon={<Home className="h-5 w-5" />}>
                Home
              </MobileNavLink>
              
              {/* Mobile Practice Options with Visual Separator */}
              <div className="px-4 py-2 bg-background/20 mx-2 my-2 rounded-xl">
                <div className="flex items-center text-sm font-medium text-foreground mb-2">
                  <Keyboard className="h-4 w-4 mr-2 text-primary" />
                  <span>Practice Options</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/typing-test"}
                  >
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Typing Test</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/practice"}
                  >
                    <Target className="h-4 w-4 text-accent" />
                    <span>Practice</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/word-practice"}
                  >
                    <Type className="h-4 w-4 text-yellow-500" />
                    <span>Word Practice</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/multiplayer"}
                  >
                    <UsersRound className="h-4 w-4 text-green-500" />
                    <span>Multiplayer</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/ai-challenge"}
                  >
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span>AI Challenge</span>
                  </Button>
                  <motion.div
                    className="col-span-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start gap-2 h-auto py-2 w-full text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                      onClick={() => window.location.hash = "#/updates"}
                    >
                      <History className="h-4 w-4 text-blue-500" />
                      <span>Updates</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Progress Options Group */}
              <div className="px-4 py-2 bg-background/20 mx-2 my-2 rounded-xl">
                <div className="flex items-center text-sm font-medium text-foreground mb-2">
                  <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Progress & Stats</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/stats"}
                  >
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                    <span>Statistics</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/leaderboard"}
                  >
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>Leaderboard</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-2 h-auto py-2 text-foreground border-border/30 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/70"
                    onClick={() => window.location.hash = "#/achievements"}
                  >
                    <Award className="h-4 w-4 text-green-500" />
                    <span>Achievements</span>
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-border/20 my-2"></div>
              <MobileNavLink to="/profile" active={location.pathname === "/profile"} icon={<User className="h-5 w-5" />}>
                Profile
              </MobileNavLink>
              <MobileNavLink to="/about" active={location.pathname === "/about"} icon={<Info className="h-5 w-5" />}>
                About
              </MobileNavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup after 2 tests */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-background/95 backdrop-blur-md p-6 rounded-xl border border-border/30 shadow-lg max-w-md w-[90%]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Great Progress!</h3>
              <p className="text-foreground/80 mb-4">
                You've completed 2 typing tests! Ready to challenge yourself further?
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowPopup(false);
                    // Reset count if desired
                    // setTestCount(0);
                    // localStorage.setItem('testCount', '0');
                  }}
                >
                  Maybe Later
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setShowPopup(false);
                    window.location.hash = "#/practice";
                  }}
                >
                  Try Practice Mode
                </Button>
              </div>
            </div>
            <button 
              className="absolute top-2 right-2 text-foreground/50 hover:text-foreground transition-colors"
              onClick={() => setShowPopup(false)}
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ to, children, icon, active = false }: { to: string; children: React.ReactNode; icon: React.ReactNode; active?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 relative group",
        active 
          ? "bg-background/50 text-primary font-semibold text-shadow-sm" 
          : "hover:bg-background/30 hover:text-primary text-foreground font-medium"
      )}
    >
      <span className={cn(
        "mr-2 transition-transform duration-300 group-hover:scale-110",
        active ? "text-primary" : "text-primary/80 group-hover:text-primary"
      )}>
        {icon}
      </span>
      <span>{children}</span>
      {active && (
        <motion.div 
          className="absolute -bottom-0.5 left-1/2 w-1.5 h-1.5 rounded-full bg-primary -translate-x-1/2"
          layoutId="activeNavIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, children, icon, active = false }: { to: string; children: React.ReactNode; icon: React.ReactNode; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        to={to}
        className={cn(
          "flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300",
          active 
            ? "bg-background/50 text-foreground font-semibold shadow-sm" 
            : "hover:bg-background/40 text-foreground"
        )}
      >
        <span className={cn(
          "mr-3 transition-all",
          active ? "text-primary" : "text-primary/80"
        )}>
          {icon}
        </span>
        <span>{children}</span>
        {active && (
          <motion.div 
            className="ml-auto flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="h-2 w-2 rounded-full bg-primary"></span>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}
