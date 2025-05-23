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
  Star,
  ChevronUp,
  ChevronDown,
  Users,
  Brain,
  Mic,
  BarChart3,
  Globe,
  Search,
  Filter,
  Download,
  ExternalLink,
  TrendingUp,
  Calendar,
  GitBranch,
  Activity,
  Eye,
  Copy,
  Check
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

// Define repository stats
const repoStats = {
  commits: 943,
  contributors: 17,
  stars: 328,
  forks: 126,
  openIssues: 3,
  closedIssues: 159,
  lastUpdated: new Date().toLocaleDateString(),
  // Add additional stats to highlight recent activity
  recentCommits: 112,
  commitsThisWeek: 67,
  totalUpdates: 14,
  activeDevelopment: true,
  repositoryUrl: "https://github.com/Xenonesis/speed-typist-challenge",
  mainBranch: "main"
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
    version: "8.0",
    releaseDate: new Date().toLocaleDateString(),
    title: "Advanced Analytics & Interactive Challenges Update",
    description: "Major update introducing comprehensive typing analytics, interactive challenge modes, and enhanced collaboration features for teams.",
    changes: [
      {
        type: "feature",
        icon: <Cpu className="h-4 w-4" />,
        items: [
          "Implemented advanced typing analytics with detailed keystroke pattern analysis",
          "Added new interactive challenge modes with progressive difficulty",
          "Introduced team collaboration features for group typing competitions",
          "Added customizable typing tests with adjustable parameters",
          "Implemented cross-device synchronization for seamless experience",
          "Added voice-controlled navigation and commands",
          "Introduced AI-powered typing coach with personalized recommendations"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned analytics dashboard with interactive visualizations",
          "Enhanced dark mode with customizable color themes",
          "Improved keyboard layout display with key usage heatmap",
          "Added animated transitions between typing challenges",
          "Implemented responsive design improvements for all device sizes",
          "Added new achievement badges and visual rewards",
          "Enhanced focus mode with distraction-free environment"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized rendering engine for smoother typing experience",
          "Reduced latency in multiplayer typing competitions",
          "Improved data processing for real-time analytics",
          "Enhanced offline capabilities with local data storage",
          "Optimized memory usage for better performance on low-end devices",
          "Improved load times through advanced code splitting"
        ]
      },
      {
        type: "code",
        icon: <Github className="h-4 w-4" />,
        items: [
          "Updated GitHub repository with version 8.0 release",
          "Improved code documentation and examples",
          "Enhanced component architecture for better maintainability",
          "Updated dependencies to latest stable versions",
          "Implemented comprehensive unit and integration tests",
          "Added new developer tools for plugin creation"
        ]
      }
    ]
  },
  {
    version: "7.5",
    releaseDate: "23 May 2025",
    title: "Word Practice & Accessibility Improvements",
    description: "Major update adding a dedicated Word Practice page with adaptive learning features and improved dark mode accessibility.",
    changes: [
      {
        type: "feature",
        icon: <BookOpen className="h-4 w-4" />,
        items: [
          "Added new Word Practice page for focused word-by-word typing practice",
          "Implemented four difficulty levels: Short, Medium, Long, and Challenging words",
          "Added adaptive difficulty system that adjusts based on user performance",
          "Implemented spaced repetition learning system for problematic words",
          "Created personal word list feature for custom practice sessions",
          "Added audio feedback system for immediate typing response",
          "Implemented detailed word practice results with accuracy tracking"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Improved dark mode contrast for better text visibility while typing",
          "Enhanced input field styling with proper contrast ratios",
          "Optimized navigation bar organization by combining related items",
          "Added Progress dropdown menu for better navigation structure",
          "Improved mobile navigation with better organization of options",
          "Enhanced word display with proper color contrast in dark mode",
          "Added visual indicators for correct and incorrect words during practice"
        ]
      },
      {
        type: "code",
        icon: <Github className="h-4 w-4" />,
        items: [
          "Updated GitHub repository with version 7.5 tag",
          "Enhanced data persistence with localStorage for user preferences",
          "Implemented proper state management for practice sessions",
          "Added performance tracking for adaptive difficulty adjustments",
          "Updated main branch with all new features and improvements",
          "Enhanced component reusability across practice types"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized word generation algorithms for faster loading",
          "Implemented efficient spaced repetition calculation",
          "Enhanced response time for typing feedback",
          "Reduced unnecessary re-renders in practice components",
          "Improved audio feedback performance with optimized sound files"
        ]
      }
    ]
  },
  {
    version: "7.4",
    releaseDate: new Date("2025-07-10").toLocaleDateString(),
    title: "Performance & Collaboration Enhancement Update",
    description: "Major update focusing on performance optimization and enhanced collaborative features for a better multiplayer experience.",
    changes: [
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Improved application load time by 35% through advanced code splitting",
          "Optimized rendering pipeline for smoother typing experience",
          "Reduced memory usage by 28% for better mobile performance",
          "Enhanced API response time with improved caching strategies",
          "Implemented dynamic imports for on-demand loading of features",
          "Added progressive loading for large typing tests"
        ]
      },
      {
        type: "feature",
        icon: <Users className="h-4 w-4" />,
        items: [
          "Implemented real-time multiplayer typing races with WebSocket integration",
          "Added live leaderboard updates during multiplayer sessions",
          "Enhanced user matching system based on skill level",
          "Implemented typing replay system to review completed races",
          "Added friend invitation system for private typing competitions",
          "Improved result sharing with detailed performance metrics"
        ]
      },
      {
        type: "code",
        icon: <Github className="h-4 w-4" />,
        items: [
          "Enhanced GitHub repository integration with improved contribution workflow",
          "Implemented semantic versioning system for better release tracking",
          "Updated documentation with comprehensive contribution guidelines",
          "Added automated testing workflows for pull requests",
          "Improved code quality through enhanced linting rules",
          "Streamlined deployment pipeline for faster updates"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Redesigned multiplayer race interface with real-time opponent indicators",
          "Enhanced performance metrics visualization with animated charts",
          "Improved loading states with skeleton screens throughout the application",
          "Added subtle animations for typing feedback and race completion",
          "Enhanced responsive design for better cross-device experience"
        ]
      }
    ]
  },
  {
    version: "7.3",
    releaseDate: new Date("2025-07-01").toLocaleDateString(),
    title: "Authentication & GitHub Repository Update",
    description: "Major update implementing comprehensive authentication protection and GitHub repository integration.",
    changes: [
      {
        type: "feature",
        icon: <Shield className="h-4 w-4" />,
        items: [
          "Implemented protected routes requiring user authentication",
          "Added secure redirect system for unauthenticated users",
          "Enhanced login system with return URL preservation",
          "Improved session handling and token management",
          "Added comprehensive authentication context",
          "Enhanced user privacy with protected data access"
        ]
      },
      {
        type: "ui",
        icon: <Palette className="h-4 w-4" />,
        items: [
          "Updated navigation to reflect authentication state",
          "Added smooth loading indicators during authentication checks",
          "Enhanced login and signup forms with better feedback",
          "Improved redirect experience for better user flow",
          "Added authenticated user indicators in the header"
        ]
      },
      {
        type: "code",
        icon: <Github className="h-4 w-4" />,
        items: [
          "Set up official GitHub repository at github.com/Xenonesis/speed-typist-challenge",
          "Integrated project with main branch as primary development line",
          "Updated version tracking system to 7.3",
          "Enhanced documentation with GitHub-specific information",
          "Added contribution guidelines and issue templates",
          "Implemented ProtectedRoute component for route-level authentication"
        ]
      },
      {
        type: "performance",
        icon: <Zap className="h-4 w-4" />,
        items: [
          "Optimized authentication checks for faster page transitions",
          "Improved session persistence mechanisms",
          "Enhanced route protection with minimal performance impact",
          "Reduced authentication-related re-renders"
        ]
      }
    ]
  },
  {
    version: "7.2",
    releaseDate: new Date("2025-06-25").toLocaleDateString(),
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

// Enhanced share functionality
const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TypeSpeed Master Updates',
          text: 'Check out the latest updates for TypeSpeed Master!',
          url: window.location.href,
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "The page URL has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers without clipboard API
        toast({
          title: "Share not supported",
          description: "Your browser doesn't support sharing or clipboard operations.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Could not share the page.",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-300"
              onClick={handleShare}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Share2 className="h-4 w-4 text-blue-600" />
              )}
              <span className="ml-2 text-sm font-medium">Share</span>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied to clipboard!" : "Share this page"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Enhanced GitHub Repository Button
const GitHubButton = () => {
  const [stars, setStars] = useState(328);
  const [starred, setStarred] = useState(false);

  const handleStarRepo = useCallback(() => {
    setStarred(!starred);
    setStars(prev => starred ? prev - 1 : prev + 1);
    toast({
      title: starred ? "Unstarred repository" : "Starred repository!",
      description: starred ? "Thanks for your feedback!" : "Thank you for supporting our project!",
    });
  }, [starred]);

  return (
    <div className="flex gap-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href="https://github.com/Xenonesis/speed-typist-challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Github className="h-4 w-4" />
          <span className="text-sm">View on GitHub</span>
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full transition-all duration-300 ${starred ? 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-700 dark:text-yellow-400' : 'hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-950/20'}`}
          onClick={handleStarRepo}
        >
          <Star className={`h-4 w-4 mr-2 ${starred ? 'fill-current' : ''}`} />
          <span className="text-sm">{stars}</span>
        </Button>
      </motion.div>
    </div>
  );
};

// Enhanced Subscribe to updates button
const SubscribeButton = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubscribed(!subscribed);
    setLoading(false);

    toast({
      title: subscribed ? "Unsubscribed successfully" : "Subscribed successfully!",
      description: subscribed
        ? "You won't receive update notifications anymore."
        : "You'll now receive notifications about new updates and features.",
    });
  }, [subscribed]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={subscribed ? "default" : "outline"}
              size="sm"
              className={`rounded-full transition-all duration-300 ${
                subscribed
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 hover:shadow-md"
              }`}
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-4 w-4 mr-2 border-2 border-t-transparent border-current rounded-full"
                />
              ) : (
                <Bell className={`h-4 w-4 mr-2 ${subscribed ? 'text-white' : 'text-purple-600'}`} />
              )}
              <span className={`text-sm font-medium ${subscribed ? 'text-white' : 'text-purple-600'}`}>
                {subscribed ? "Subscribed" : "Subscribe"}
              </span>
            </Button>
          </motion.div>
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
          Coming Soon in v8.0
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="bg-blue-500/10 p-2 rounded-md">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Real-time Multiplayer Racing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join live typing competitions with players worldwide. Race in real-time with up to 10 players, complete with live leaderboards and spectator mode.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="bg-purple-500/10 p-2 rounded-md">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">AI-Powered Personalized Training</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced machine learning algorithms analyze your typing patterns to create personalized exercises targeting your specific weaknesses and skill gaps.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="bg-green-500/10 p-2 rounded-md">
              <Mic className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Voice-to-Text Challenge Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Practice typing what you hear with audio dictation challenges. Perfect for improving listening skills and real-world typing scenarios.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="bg-amber-500/10 p-2 rounded-md">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Advanced Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprehensive performance insights with predictive analytics, progress forecasting, and detailed breakdowns of your typing evolution over time.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="bg-teal-500/10 p-2 rounded-md">
              <Globe className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <h3 className="text-base font-medium mb-1">Multi-Language & Layout Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Support for 20+ languages and keyboard layouts including QWERTY, Dvorak, Colemak, and international layouts with native character sets.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <a
            href="https://github.com/Xenonesis/speed-typist-challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md bg-[#24292e] hover:bg-[#1d2125] text-white text-sm transition-colors duration-200"
          >
            <Github className="h-4 w-4" />
            <span>Follow on GitHub for updates</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Updates() {
  const [activeTab, setActiveTab] = useState("releases");
  const [activePeriod, setActivePeriod] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVersions, setFilteredVersions] = useState(versionHistory);

  const handlePeriodChange = useCallback((period: string) => {
    setActivePeriod(period);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredVersions(versionHistory);
      return;
    }

    const filtered = versionHistory.filter(version =>
      version.title.toLowerCase().includes(query.toLowerCase()) ||
      version.description.toLowerCase().includes(query.toLowerCase()) ||
      version.version.includes(query) ||
      version.changes.some(change =>
        change.items.some(item =>
          item.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
    setFilteredVersions(filtered);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
        <Header />

        <main className="flex-grow flex flex-col p-4 sm:p-6 pt-20 pb-20">
          <div className="container max-w-6xl mx-auto">
            {/* Enhanced Header Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-lg"></div>
                  <ArrowUpCircle className="h-10 w-10 text-primary relative" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Updates & Changelog
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Stay up-to-date with the latest features, improvements, and fixes in TypeSpeed Master
              </p>

              {/* Search and Stats Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search updates..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 bg-background/80 border-border/60 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">Active Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">{versionHistory.length} Releases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-accent" />
                    <span className="font-medium">Weekly Updates</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              <div className="lg:col-span-3">
                <Tabs defaultValue="releases" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="mb-6 bg-card/50 backdrop-blur-sm border border-border/50">
                    <TabsTrigger value="releases" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Release History
                    </TabsTrigger>
                    <TabsTrigger value="github" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub Stats
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="releases" className="space-y-8 mt-0">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">Version History</h2>
                        {searchQuery && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {filteredVersions.length} result{filteredVersions.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm p-1">
                          <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              activePeriod === 'all'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => handlePeriodChange('all')}
                          >
                            All
                          </button>
                          <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              activePeriod === 'major'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => handlePeriodChange('major')}
                          >
                            Major
                          </button>
                          <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              activePeriod === 'recent'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => handlePeriodChange('recent')}
                          >
                            Recent
                          </button>
                        </div>
                      </div>
                    </div>

                    {filteredVersions.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No updates found</h3>
                        <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {filteredVersions.map((version, index) => (
                          <VersionCard key={version.version} version={version} isLatest={index === 0 && !searchQuery} />
                        ))}
                      </div>
                    )}

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
                    <Card className="border-border/30 shadow-sm overflow-hidden">
                      <CardHeader className="pb-3 bg-gradient-to-r from-[#24292e]/10 to-background">
                        <CardTitle className="flex items-center gap-2">
                          <Github className="h-5 w-5" />
                          Repository Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20 hover:border-primary/30 transition-colors duration-300 hover:shadow-sm">
                            <div className="text-3xl font-bold text-primary">{repoStats?.commits || 572}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Code2 className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                              Total Commits
                            </div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20 hover:border-primary/30 transition-colors duration-300 hover:shadow-sm">
                            <div className="text-3xl font-bold text-purple-500">{repoStats?.contributors || 7}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1.5 text-purple-500/70" />
                              Contributors
                            </div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20 hover:border-primary/30 transition-colors duration-300 hover:shadow-sm">
                            <div className="text-3xl font-bold text-amber-500">{repoStats?.stars || 143}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Star className="h-3.5 w-3.5 mr-1.5 text-amber-500/70" />
                              Stars
                            </div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20 hover:border-primary/30 transition-colors duration-300 hover:shadow-sm">
                            <div className="text-3xl font-bold text-green-500">{repoStats?.commitsThisWeek || 15}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-green-500/70" />
                              This Week
                            </div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20 hover:border-primary/30 transition-colors duration-300 hover:shadow-sm">
                            <div className="text-3xl font-bold text-teal-500">{repoStats?.closedIssues || 82}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <BugOff className="h-3.5 w-3.5 mr-1.5 text-teal-500/70" />
                              Closed Issues
                            </div>
                          </div>
                          <div className="bg-background/60 p-4 rounded-lg border border-border/20 hover:border-primary/30 transition-colors duration-300 hover:shadow-sm">
                            <div className="text-3xl font-bold text-blue-500">{repoStats?.totalUpdates || 6}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <ArrowUpCircle className="h-3.5 w-3.5 mr-1.5 text-blue-500/70" />
                              Major Updates
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5 mb-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <div className="text-sm font-medium flex items-center">
                                <FileCode className="h-4 w-4 mr-1.5 text-primary/70" />
                                Language Distribution
                              </div>
                              <div className="text-xs text-muted-foreground">Updated {repoStats?.lastUpdated || new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="space-y-3">
                              {languageData.map(lang => (
                                <div key={lang.name}>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <div>{lang.name}</div>
                                    <div className="text-muted-foreground">{lang.percentage}%</div>
                                  </div>
                                  <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                                    <div className={`h-full ${lang.color}`} style={{ width: `${lang.percentage}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="p-4 rounded-lg bg-[#24292e]/5 border border-[#24292e]/10 text-sm">
                            <p className="mb-2 flex items-center">
                              <Github className="h-4 w-4 mr-2 text-[#24292e]" />
                              <span className="font-medium">Repository Information</span>
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground">
                              <div className="flex items-center">
                                <span className="text-xs">Main Branch:</span>
                              </div>
                              <div>
                                <Badge variant="outline" className="font-mono text-xs">{repoStats?.mainBranch || "main"}</Badge>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs">Last Updated:</span>
                              </div>
                              <div>
                                <span className="text-xs">{repoStats?.lastUpdated || new Date().toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs">Status:</span>
                              </div>
                              <div>
                                <Badge variant="outline" className={`${repoStats?.activeDevelopment ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-amber-500/10 border-amber-500/30 text-amber-600"}`}>
                                  {repoStats?.activeDevelopment ? "Active Development" : "Maintenance"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#1d2125] text-white border-0">
                            <Github className="h-4 w-4" />
                            <span>View Repository</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Enhanced Sidebar */}
              <div className="space-y-6">
                <ComingSoonFeatures />

                {/* Quick Actions Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-border/30 shadow-lg bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        Stay Connected
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground mb-6">
                        Join our community and never miss an update. Get notified about new features, improvements, and typing tips.
                      </p>

                      <div className="space-y-3">
                        <ShareButton />
                        <GitHubButton />
                        <SubscribeButton />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="border-border/30 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Development Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-background/60 border border-border/30">
                          <div className="text-2xl font-bold text-primary">{versionHistory.length}</div>
                          <div className="text-xs text-muted-foreground">Releases</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/60 border border-border/30">
                          <div className="text-2xl font-bold text-accent">328</div>
                          <div className="text-xs text-muted-foreground">GitHub Stars</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/60 border border-border/30">
                          <div className="text-2xl font-bold text-green-600">943</div>
                          <div className="text-xs text-muted-foreground">Commits</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/60 border border-border/30">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-xs text-muted-foreground">Contributors</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Call-to-Action Section */}
            <motion.div
              className="text-center mt-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                        <Github className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Enjoying TypeSpeed Master?
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Join our growing community of developers and typing enthusiasts! Your support helps us continue building amazing features and improving the typing experience for everyone.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-gradient-to-r from-primary via-[hsl(242,85%,60%)] to-accent hover:shadow-xl text-white font-medium"
                        onClick={() => window.open("https://github.com/Xenonesis/speed-typist-challenge", "_blank")}
                      >
                        <Star className="h-5 w-5 mr-2" />
                        Star on GitHub
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-primary/30 hover:bg-primary/10 font-medium"
                        onClick={() => window.open("https://github.com/Xenonesis/speed-typist-challenge/issues", "_blank")}
                      >
                        <GitBranch className="h-5 w-5 mr-2" />
                        Contribute
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>1.2k+ users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>328 stars</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4" />
                      <span>12 contributors</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
  const [expanded, setExpanded] = useState(isLatest);
  const [isHovered, setIsHovered] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <motion.div
      className="mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`border ${
        isLatest
          ? 'border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5'
          : 'border-border/30 bg-card/80'
      } overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>

        {/* Animated background glow for latest version */}
        {isLatest && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
        )}

        <div className="relative">
          <CardHeader className={`${
            isLatest
              ? 'bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10'
              : 'bg-primary/5'
          } pb-4 border-b border-border/30`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge className={`${
                    isLatest
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                      : 'bg-primary/15 text-primary hover:bg-primary/25'
                  } border-none font-semibold px-3 py-1`}>
                    v{version.version}
                  </Badge>
                </motion.div>
                <h2 className="text-xl font-bold">{version.title}</h2>
                {isLatest && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="bg-gradient-to-r from-accent to-primary text-white shadow-md border-none">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Latest
                    </Badge>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{version.releaseDate}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6 leading-relaxed">{version.description}</p>

            <div className="space-y-6">
              {version.changes.map((change, index) => (
                <motion.div
                  key={index}
                  className={`space-y-3 ${!expanded && index > 1 ? 'hidden' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center w-8 h-8 ${
                      change.type === 'feature' ? 'bg-gradient-to-r from-primary/20 to-primary/30' :
                      change.type === 'ui' ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/30' :
                      change.type === 'code' ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/30' :
                      change.type === 'performance' ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/30' :
                      change.type === 'bugfix' ? 'bg-gradient-to-r from-red-500/20 to-red-500/30' :
                      change.type === 'security' ? 'bg-gradient-to-r from-green-500/20 to-green-500/30' :
                      'bg-gradient-to-r from-secondary/20 to-secondary/30'
                    } rounded-xl shadow-sm`}>
                      {change.icon}
                    </div>
                    <h3 className="text-lg font-semibold capitalize">
                      {change.type} Changes
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {change.items.length} item{change.items.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="ml-11 space-y-2">
                    {(expanded ? change.items : change.items.slice(0, 3)).map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex items-start gap-3 p-3 rounded-lg bg-background/60 border border-border/30 hover:border-border/50 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                      >
                        <div className={`w-2 h-2 ${
                          change.type === 'feature' ? 'bg-primary' :
                          change.type === 'ui' ? 'bg-purple-500' :
                          change.type === 'code' ? 'bg-blue-500' :
                          change.type === 'performance' ? 'bg-orange-500' :
                          change.type === 'bugfix' ? 'bg-red-500' :
                          change.type === 'security' ? 'bg-green-500' :
                          'bg-secondary'
                        } rounded-full mt-2 flex-shrink-0`}></div>
                        <span className="text-sm text-foreground leading-relaxed">{item}</span>
                      </motion.div>
                    ))}

                    {!expanded && change.items.length > 3 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-primary font-medium">
                          and {change.items.length - 3} more improvement{change.items.length - 3 !== 1 ? 's' : ''}...
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-6 pt-4 border-t border-border/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary hover:bg-primary/10 font-medium"
                onClick={toggleExpand}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    <span>Show Less Details</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    <span>Show All Changes</span>
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </div>
      </Card>

      {!isLatest && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-border to-transparent"></div>
      )}
    </motion.div>
  );
}