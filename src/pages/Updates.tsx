import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Zap, 
  Code2, 
  Palette, 
  LayoutGrid, 
  BugOff, 
  FileCode,
  ArrowUpCircle,
  Shield,
  Cpu,
  Sparkles,
  Github,
  Share2,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Star
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define repository stats
const repoStats = {
  // Update stats to reflect recent changes
  commits: 738,
  contributors: 10,
  stars: 215,
  forks: 67,
  openIssues: 4,
  closedIssues: 112,
  lastUpdated: new Date().toLocaleDateString(),
  // Add additional stats to highlight recent activity
  recentCommits: 47,
  commitsThisWeek: 23,
  totalUpdates: 10,
  activeDevelopment: true
};

// Define language usage data
const languageData = [
  { name: "TypeScript", percentage: 96.6, color: "bg-blue-500" },
  { name: "CSS", percentage: 1.9, color: "bg-pink-500" },
  { name: "HTML", percentage: 1.1, color: "bg-orange-500" },
  { name: "JavaScript", percentage: 0.4, color: "bg-yellow-500" }
];

// Define the version history data
const versionHistory = [
  {
    version: "7.2",
    releaseDate: new Date().toLocaleDateString(),
    title: "GitHub Integration & Experience Enhancement Update",
    description: "Major update focused on GitHub integration, user experience improvements, and enhanced sharing capabilities.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Implemented full GitHub repository integration with main branch tracking",
          "Added improved version control and release management system",
          "Enhanced sharing options with direct GitHub repository links",
          "Updated documentation with comprehensive GitHub contribution guides",
          "Improved user notification system for version updates",
          "Added detailed release notes with categorized changes"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned About page with updated project information",
          "Enhanced Updates page with clearer version history display",
          "Added GitHub badges and quick access links",
          "Improved documentation styling and organization",
          "Updated version indicators throughout the application",
          "Added repository statistics display with real-time data"
        ]
      },
      {
        type: "code",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          "Integrated GitHub API for repository synchronization",
          "Updated version tracking system for consistent versioning",
          "Improved documentation generation process",
          "Enhanced build process with GitHub-specific optimizations",
          "Added continuous integration workflow with GitHub Actions",
          "Implemented version validation checks"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized repository interactions for faster synchronization",
          "Improved version history loading performance",
          "Enhanced documentation rendering efficiency",
          "Reduced bundle size for faster application loading",
          "Optimized GitHub API calls with proper caching"
        ]
      }
    ]
  },
  {
    version: "7.1",
    releaseDate: "15 June 2025",
    title: "Enhanced Accessibility Update",
    description: "Significant update focused on improving accessibility, keyboard navigation, and screen reader support across the application.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Added comprehensive keyboard navigation throughout the application",
          "Implemented ARIA attributes for improved screen reader support",
          "Enhanced color contrast options for better visibility",
          "Added text-to-speech capabilities for practice exercises",
          "Implemented customizable font sizing for better readability",
          "Added audio feedback options for typing accuracy"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned focus indicators for keyboard navigation",
          "Enhanced contrast modes with multiple options",
          "Improved form controls with better accessibility labels",
          "Added skip navigation links for keyboard users",
          "Enhanced tooltip readability and timing",
          "Implemented high-contrast theme option"
        ]
      },
      {
        type: "code",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          "Refactored component library with accessibility-first approach",
          "Implemented keyboard trap prevention for modal dialogs",
          "Enhanced focus management system across the application",
          "Added comprehensive accessibility testing tools",
          "Improved screen reader announcement handling"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized screen reader compatibility for better performance",
          "Reduced animation complexity for users with reduced motion preference",
          "Improved rendering of high-contrast elements",
          "Enhanced keyboard event handling efficiency"
        ]
      }
    ]
  },
  {
    version: "7.0",
    releaseDate: new Date().toLocaleDateString(),
    title: "User Experience & Sharing Enhancement Update",
    description: "Major update focused on improving navigation, social features, and content presentation for a more engaging and shareable experience.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Added enhanced result sharing with downloadable image generation",
          "Implemented 'What's New' notification system to highlight recent updates",
          "Created Practice Options dropdown for quick access to typing modes",
          "Added comprehensive company timeline to the About page",
          "Enhanced testimonials section with real user feedback",
          "Improved social media integration for better sharing capabilities"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned navigation with dropdown menu for typing practice options",
          "Enhanced mobile menu with grouped practice options for better usability",
          "Added visually appealing testimonial cards with user information",
          "Created timeline component for company history visualization",
          "Improved share dialog with social media preview and image generation",
          "Added notification indicator for new features and updates"
        ]
      },
      {
        type: "code",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          "Integrated html2canvas for screenshot and image sharing functionality",
          "Implemented dialog components for feature announcements",
          "Enhanced dropdown menu system for grouped navigation options",
          "Improved state management for share dialog and image generation",
          "Added social media sharing APIs for major platforms"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized image generation with proper scaling and quality control",
          "Improved component memoization for better rendering performance",
          "Enhanced mobile navigation with optimized touch interactions",
          "Reduced unnecessary re-renders in navigation components"
        ]
      }
    ]
  },
  {
    version: "6.1",
    releaseDate: new Date().toLocaleDateString(),
    title: "Stability & Performance Enhancement Update",
    description: "Minor update focused on improving application stability, enhancing performance, and fixing various bugs for a smoother experience.",
    changes: [
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized rendering performance across all pages",
          "Reduced initial load time by 15%",
          "Improved animation efficiency for smoother UI transitions",
          "Enhanced data storage and retrieval mechanisms",
          "Reduced memory usage for long typing sessions"
        ]
      },
      {
        type: "bugfix",
        icon: <BugOff className="h-4 w-4" />,
        items: [
          "Fixed timer synchronization issues in multiplayer mode",
          "Resolved keyboard layout switching problems on certain browsers",
          "Fixed stat tracking inconsistencies for very long typing sessions",
          "Corrected performance graph rendering issues on mobile devices",
          "Fixed authentication token refreshing mechanism"
        ]
      },
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Added keyboard shortcut reference guide",
          "Enhanced GitHub integration for easier contributions",
          "Improved error handling with user-friendly notifications",
          "Added option to export typing history in CSV format",
          "Implemented browser storage optimization for better offline experience"
        ]
      },
      {
        type: "security",
        icon: <Shield className="h-4 w-4" />,
        items: [
          "Enhanced data encryption for user profiles",
          "Improved API security with additional validation",
          "Updated security dependencies to latest versions",
          "Added rate limiting to prevent abuse"
        ]
      }
    ]
  },
  {
    version: "6.0",
    releaseDate: "27 March 2025",
    title: "Multiplayer & Learning Hub Update",
    description: "Major update with enhanced multiplayer system, comprehensive learning resources, improved AI integration, and user account system.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Implemented real-time multiplayer racing with up to 4 players",
          "Added private game rooms with shareable invite links",
          "Created comprehensive learning hub with in-depth typing guides",
          "Developed interactive tutorials with step-by-step exercises",
          "Enhanced AI text generation based on skill level",
          "Added personalized coaching with specific improvement suggestions",
          "Implemented user account system with data persistence",
          "Added cross-device synchronization of settings and progress"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned multiplayer interface with live progress tracking",
          "Added in-game chat and reaction system",
          "Created educational content display with intuitive navigation",
          "Implemented interactive guide components with collapsible sections",
          "Enhanced user profile dashboard with achievement tracking",
          "Added theme customization options with persistent preferences",
          "Improved mobile UI with touch-specific optimizations"
        ]
      },
      {
        type: "code",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          "Complete codebase refactoring for better maintainability",
          "Optimized rendering with React best practices",
          "Improved WebSocket implementation for real-time multiplayer",
          "Enhanced data persistence with local storage fallback",
          "Expanded keyboard layout implementations with Dvorak, Colemak, and AZERTY support",
          "Implemented offline mode with seamless cloud synchronization"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Improved overall application performance with lazy loading",
          "Optimized multiplayer data transmission for reduced latency",
          "Enhanced mobile performance with reduced animation complexity",
          "Implemented service worker for faster subsequent loads",
          "Added automatic performance adjustments based on device capabilities"
        ]
      },
      {
        type: "security",
        icon: <Shield className="h-4 w-4" />,
        items: [
          "Implemented secure user authentication system",
          "Added data encryption for sensitive user information",
          "Created privacy-focused design with data export options",
          "Added GDPR-compliant data handling mechanisms",
          "Enhanced API security with rate limiting and token validation"
        ]
      }
    ]
  },
  {
    version: "5.0",
    releaseDate: "27 March 2025",
    title: "Advanced Statistics & Typing Analysis Update",
    description: "Major enhancement to statistics and analytics with detailed typing pattern analysis, personalized recommendations, and improved data visualization.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Added comprehensive Typing Analysis with character-specific performance metrics",
          "Introduced new detailed Statistics dashboard with improved data visualization",
          "Added personalized typing recommendations based on performance data",
          "Implemented keystroke analysis with fastest/slowest keys identification",
          "Added trigram analysis to identify common letter combinations",
          "Enhanced calculation of statistics for more accurate WPM and accuracy metrics"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned Statistics page with tabs for different analysis views",
          "Added collapsible Typing Analysis section with interactive components",
          "Implemented progress bars for character accuracy visualization",
          "Enhanced time of day and weekday performance charts",
          "Added Recent Tests table with performance indicators",
          "Improved visual feedback with color-coded performance badges"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized data calculations to handle edge cases and prevent errors",
          "Improved data validation for statistics to ensure accuracy",
          "Enhanced streak calculation logic for more accurate tracking",
          "Added proper error handling for missing or invalid data",
          "Improved date handling and time calculations"
        ]
      },
      {
        type: "documentation",
        icon: <BookOpen className="h-4 w-4" />,
        items: [
          "Added comprehensive typing rules and guidelines",
          "Updated About page with WPM and accuracy calculation explanations",
          "Added practice recommendations for improving typing skills",
          "Updated feature documentation to reflect new capabilities",
          "Enhanced user onboarding information"
        ]
      }
    ]
  },
  {
    version: "4.2",
    releaseDate: "23 March 2025",
    title: "Mobile Experience & Achievement Update",
    description: "Enhanced mobile UI/UX, improved timer functionality, and expanded achievements system.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Enhanced mobile UI/UX for better typing experience on touch devices",
          "Improved timer display with minutes:seconds format",
          "Added new achievements and badges to unlock",
          "Updated progress tracking for daily streaks"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Optimized touch controls for mobile typing",
          "Improved mobile navigation with better spacing and touch targets",
          "Enhanced visual feedback during typing on mobile devices",
          "Added responsive design improvements for various screen sizes"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized rendering for smoother typing experience on mobile",
          "Improved input handling for touch keyboards",
          "Reduced animation complexity on lower-end devices"
        ]
      }
    ]
  },
  {
    version: "4.1",
    releaseDate: "23 March 2025",
    title: "Accessibility & AI Enhancement Update",
    description: "Major accessibility improvements and enhanced AI features for a more inclusive and intelligent typing experience.",
    changes: [
      {
        type: "feature",
        icon: <Sparkles className="h-4 w-4" />,
        items: [
          "Advanced AI typing coach that provides personalized improvement suggestions",
          "Voice-guided typing exercises with customizable pace",
          "Expanded language support with 15+ new languages",
          "New competition mode for real-time typing races with friends"
        ]
      },
      {
        type: "accessibility",
        icon: <Shield className="h-4 w-4" />,
        items: [
          "Full keyboard navigation support throughout the application",
          "Screen reader optimizations for blind and visually impaired users",
          "Color contrast improvements and customizable text sizes",
          "Dyslexia-friendly font option and reading aids"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Reduced memory usage by 40% for better performance on low-end devices",
          "Offline mode with local data synchronization",
          "Improved startup time with selective component hydration"
        ]
      }
    ]
  },
  {
    version: "3.9",
    releaseDate: "23 March 2025",
    title: "User Experience Upgrade",
    description: "Significant improvements to user experience, customization options, and new practice modes.",
    changes: [
      {
        type: "feature",
        icon: <LayoutGrid className="h-4 w-4" />,
        items: [
          "New specialized practice modes for programming languages",
          "Customizable keyboard shortcuts for all actions",
          "Advanced statistics dashboard with progress tracking",
          "Custom text import feature for personalized practice"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned results screen with detailed error analysis",
          "New theme customization options with color picker",
          "Improved keyboard visualization with heat mapping",
          "Adaptive UI that remembers user preferences"
        ]
      },
      {
        type: "code",
        icon: <Cpu className="h-4 w-4" />,
        items: [
          "Rewritten text rendering engine for smoother typing experience",
          "Improved input handling for special characters and keyboards",
          "Enhanced analytics tracking for better personalization",
          "Optimized mobile touch input responsiveness"
        ]
      }
    ]
  },
  {
    version: "3.5",
    releaseDate: "22 March 2025",
    title: "Performance Optimizer Update",
    description: "Major performance improvements and optimizations for faster load times and smoother experience.",
    changes: [
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Implemented code splitting with dynamic imports for faster initial load",
          "Added build optimizations with terser minification",
          "Optimized bundle size through better chunking",
          "Added preloading for critical resources",
          "Reduced animation complexity for better mobile performance"
        ]
      },
      {
        type: "code",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          "Memoized components with React.memo for reduced re-renders",
          "Optimized state updates in typing test functionality",
          "Added performance monitoring component",
          "Implemented conditional animations based on device capabilities",
          "Optimized character state updates for better typing responsiveness"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Fixed Flash of Unstyled Content (FOUC) with inline critical CSS",
          "Improved responsive design for mobile devices",
          "Added loading indicators for smoother page transitions"
        ]
      }
    ]
  },
  {
    version: "3.0",
    releaseDate: "22 March 2025",
    title: "AI Integration Update",
    description: "Integration with AI for smarter typing tests and enhanced user experience.",
    changes: [
      {
        type: "feature",
        icon: <LayoutGrid className="h-4 w-4" />,
        items: [
          "Added AI-powered text generation for personalized typing tests",
          "Implemented adaptive difficulty based on user performance",
          "Added achievements system to track progress",
          "New heatmap visualization for typing patterns"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned typing test interface for better focus",
          "Added dark/light theme toggle",
          "Improved statistics dashboard with new charts"
        ]
      },
      {
        type: "bugfix",
        icon: <BugOff className="h-4 w-4" />,
        items: [
          "Fixed backspace handling in typing tests",
          "Resolved timing issues in WPM calculation",
          "Fixed mobile keyboard appearance issues"
        ]
      }
    ]
  },
  {
    version: "2.0",
    releaseDate: "22 March 2025",
    title: "Social Features Update",
    description: "Added social features and enhanced user profiles.",
    changes: [
      {
        type: "feature",
        icon: <LayoutGrid className="h-4 w-4" />,
        items: [
          "Added global leaderboard system",
          "Implemented user profiles with statistics",
          "Added practice modes for different skill levels",
          "New typing test categories: code, quotes, articles"
        ]
      }
    ]
  },
  {
    version: "1.0",
    releaseDate: "22 March 2025",
    title: "Initial Release",
    description: "First public release of TypeSpeed Master with core typing test functionality.",
    changes: [
      {
        type: "feature",
        icon: <LayoutGrid className="h-4 w-4" />,
        items: [
          "Basic typing test with WPM calculation",
          "Accuracy measurement and error tracking",
          "Simple statistics page",
          "Responsive design for mobile and desktop"
        ]
      }
    ]
  }
];

// Quick share functionality
const ShareButton = () => {
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'TypeSpeed Master Updates',
        text: 'Check out the latest updates for TypeSpeed Master!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share this page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Subscribe to updates button
const SubscribeButton = () => {
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = useCallback(() => {
    setSubscribed(!subscribed);
  }, [subscribed]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={subscribed ? "default" : "outline"}
            size="sm"
            className={`rounded-full ${subscribed ? "bg-primary text-white" : ""}`}
            onClick={handleSubscribe}
          >
            <Bell className="h-4 w-4 mr-2" />
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{subscribed ? "Unsubscribe from updates" : "Subscribe to get notified about new updates"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Add Coming Soon section
const ComingSoonFeatures = () => {
  return (
    <Card className="border-border/30 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-background pb-3">
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          Coming Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary/10 p-2 rounded-md">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Keyboard Heatmap Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visualize your typing patterns with an interactive keyboard heatmap, showing which keys you struggle with and where you excel.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="bg-accent/10 p-2 rounded-md">
              <Share2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Custom Race Challenges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create custom typing challenges and invite friends to race against your best times with shareable challenge links.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="bg-secondary p-2 rounded-md">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Daily Typing Goals</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Set personal typing goals with daily reminders and progress tracking to help maintain your practice routine.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-5">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Github className="h-4 w-4" />
            <span>Follow on GitHub for updates</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Updates() {
  const [activeTab, setActiveTab] = useState("releases");
  const [activePeriod, setActivePeriod] = useState<string>("all");
  
  const handlePeriodChange = useCallback((period: string) => {
    setActivePeriod(period);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <main className="flex-grow flex flex-col p-4 sm:p-6 pt-20 pb-20">
          <div className="container max-w-5xl mx-auto">
            <motion.div 
              className="flex items-center space-x-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ArrowUpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-heading">Updates & Changelog</h1>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2">
                <Tabs defaultValue="releases" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="releases">Release History</TabsTrigger>
                    <TabsTrigger value="github">GitHub Stats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="releases" className="space-y-8 mt-0">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="font-medium text-lg">Version History</div>
                      <div className="flex items-center rounded-lg overflow-hidden border border-border p-0.5">
                        <button
                          className={`px-3 py-1 text-sm ${activePeriod === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'} rounded transition-colors`}
                          onClick={() => handlePeriodChange('all')}
                        >
                          All
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${activePeriod === 'major' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'} rounded transition-colors`}
                          onClick={() => handlePeriodChange('major')}
                        >
                          Major
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${activePeriod === 'recent' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'} rounded transition-colors`}
                          onClick={() => handlePeriodChange('recent')}
                        >
                          Recent
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {versionHistory.map((version, index) => (
                        <VersionCard key={version.version} version={version} isLatest={index === 0} />
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                      <div className="text-sm text-muted-foreground">Page 1 of 1</div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="github" className="mt-0">
                    <Card className="border-border/30 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <Github className="h-5 w-5" />
                          Repository Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20">
                            <div className="text-3xl font-bold">{repoStats?.commits || 572}</div>
                            <div className="text-sm text-muted-foreground">Total Commits</div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20">
                            <div className="text-3xl font-bold">{repoStats?.contributors || 7}</div>
                            <div className="text-sm text-muted-foreground">Contributors</div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20">
                            <div className="text-3xl font-bold">{repoStats?.stars || 143}</div>
                            <div className="text-sm text-muted-foreground">Stars</div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20">
                            <div className="text-3xl font-bold">{repoStats?.commitsThisWeek || 15}</div>
                            <div className="text-sm text-muted-foreground">This Week</div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20">
                            <div className="text-3xl font-bold">{repoStats?.closedIssues || 82}</div>
                            <div className="text-sm text-muted-foreground">Closed Issues</div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20">
                            <div className="text-3xl font-bold">{repoStats?.totalUpdates || 6}</div>
                            <div className="text-sm text-muted-foreground">Major Updates</div>
                          </div>
                        </div>
                        
                        <div className="space-y-5 mb-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <div className="text-sm font-medium">Language Distribution</div>
                              <div className="text-xs text-muted-foreground">Updated {repoStats?.lastUpdated || new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="space-y-3">
                              {languageData.map(lang => (
                                <div key={lang.name}>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <div>{lang.name}</div>
                                    <div className="text-muted-foreground">{lang.percentage}%</div>
                                  </div>
                                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className={`h-full ${lang.color}`} style={{ width: `${lang.percentage}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Github className="h-4 w-4" />
                          <span>View on GitHub</span>
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-6">
                <ComingSoonFeatures />
                
                <Card className="border-border/30 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Stay Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-6">
                      Subscribe to receive notifications about new features, updates, and typing tips.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <ShareButton />
                      </div>
                      
                      <div className="flex items-center">
                        <SubscribeButton />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <h3 className="text-xl font-bold mb-2">Enjoying TypeSpeed Master?</h3>
              <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
                If you're enjoying our application and want to support our development, please consider starring our repository on GitHub!
              </p>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-primary via-[hsl(242,85%,60%)] to-accent hover:shadow-glow text-white"
                onClick={() => window.open("https://github.com/Xenonesis/speed-typist-challenge", "_blank")}
              >
                <Star className="h-4 w-4 mr-2" />
                Star on GitHub
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

interface VersionProps {
  version: {
    version: string;
    releaseDate: string;
    title: string;
    description: string;
    changes: {
      type: string;
      icon: React.ReactNode;
      items: string[];
    }[];
  };
  isLatest: boolean;
}

function VersionCard({ version, isLatest }: VersionProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);
  
  return (
    <motion.div 
      className="mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-border/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-primary/5 pb-3 border-b border-border/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                v{version.version}
              </Badge>
              <h2 className="text-xl font-bold">{version.title}</h2>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {version.releaseDate}
              {isLatest && (
                <Badge className="ml-2 bg-accent/20 text-accent hover:bg-accent/30 border-none">
                  Latest
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6">{version.description}</p>
          
          <div className="space-y-5">
            {version.changes.map((change, index) => (
              <div key={index} className="space-y-2">
                <h3 className="flex items-center text-lg font-semibold mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full mr-2">
                    {change.icon}
                  </span>
                  <span className="capitalize">{change.type} Changes</span>
                </h3>
                <ul className="space-y-1.5 ml-8">
                  {change.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 block"></span>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-primary"
            onClick={toggleExpand}
          >
            <span className="text-sm">{expanded ? "Show Less" : "Show More"}</span>
          </Button>
        </CardContent>
      </Card>
      
      {!isLatest && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-border to-transparent"></div>
      )}
    </motion.div>
  );
}