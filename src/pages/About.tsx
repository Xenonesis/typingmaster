import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Instagram, 
  Linkedin, 
  Mail, 
  Heart, 
  Keyboard,
  Info,
  Award,
  BookOpen,
  Code,
  Briefcase,
  Users,
  BadgeCheck,
  Sparkles,
  Share2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  MapPin,
  Bell,
  FileText,
  Cpu,
  Globe,
  Link2,
  User,
  Library,
  GraduationCap,
  Trophy,
  Shield,
  Network,
  Search,
  ShieldCheck,
  Gamepad2,
  MessageSquare,
  Settings,
  Download,
  Eye,
  BrainCircuit,
  Rocket,
  Flame,
  Clock,
  Hexagon,
  BarChart3
} from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function About() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [showPopup, setShowPopup] = useState(false);
  const [developerExpanded, setDeveloperExpanded] = useState<string | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileSettings, setProfileSettings] = useState({
    showEmail: true,
    showSocials: true,
    darkMode: false,
    notificationsEnabled: true,
    showBadges: true
  });

  const containerClasses = "grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 max-w-7xl mx-auto px-4 py-12";
  const sectionClasses = "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl shadow-sm border border-border/20 hover:shadow-md transition-shadow duration-200";
  const headingClasses = "text-2xl font-semibold mb-4 text-primary flex items-center gap-2 hover:text-primary/90 transition-colors duration-200";
  const paragraphClasses = "text-muted-foreground leading-relaxed hover:text-muted-foreground/90 transition-colors duration-200";
  const cardHoverClasses = "hover:scale-[1.02] transition-transform duration-300 ease-in-out";
  const iconHoverClasses = "hover:scale-110 transition-transform duration-200 ease-in-out";
  
  const toggleSection = useCallback((section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  }, [expandedSection]);

  const toggleDeveloperSection = useCallback((section: string) => {
    if (developerExpanded === section) {
      setDeveloperExpanded(null);
    } else {
      setDeveloperExpanded(section);
    }
  }, [developerExpanded]);

  useEffect(() => {
    // Check if user has seen the popup in this session
    const hasSeenPopup = localStorage.getItem('hasSeenUpdatePopup');
    
    if (!hasSeenPopup) {
      // Delay showing the popup by 2 seconds
      const timer = setTimeout(() => {
        setShowPopup(true);
        // Mark that user has seen the popup in this session
        localStorage.setItem('hasSeenUpdatePopup', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const scrollToFeedbackForm = () => {
    document.getElementById('feedback-form')?.scrollIntoView({ behavior: 'smooth' });
    setShowPopup(false);
  };

  const handleProfileSettingChange = (setting: string, value: boolean) => {
    setProfileSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        {/* Feedback and Updates Popup */}
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent className="sm:max-w-[500px] border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Bell className="h-5 w-5 text-primary" />
                What's New at TypeSpeed Master
              </DialogTitle>
              <DialogDescription>
                Recent updates and improvements to enhance your typing experience
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="font-semibold text-primary mb-2">Latest Updates:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>New multiplayer typing race mode with live competition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Expanded text library with programming and technical content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Improved analytics dashboard with progress tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Dark mode and customizable UI themes</span>
                </li>
              </ul>
              
              <Separator className="my-4" />
              
              <div className="bg-accent/10 p-3 rounded-md border border-accent/20 text-sm">
                <p className="mb-2 text-center font-medium">Your feedback helps us improve!</p>
                <p className="text-muted-foreground">
                  We're constantly working to make TypeSpeed Master better. 
                  Please share your thoughts and suggestions through our feedback form.
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handlePopupClose}
                className="sm:flex-1"
              >
                Dismiss
              </Button>
              <Button 
                onClick={scrollToFeedbackForm} 
                className="bg-primary hover:bg-primary/90 text-white sm:flex-1"
              >
                <Heart className="h-4 w-4 mr-2" />
                Provide Feedback
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Profile Settings Dialog */}
        <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Profile Settings
              </DialogTitle>
              <DialogDescription>
                Configure how your profile information is displayed
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-email">Show Email Address</Label>
                  <p className="text-xs text-muted-foreground">Display your email publicly on your profile</p>
                </div>
                <Switch 
                  id="show-email" 
                  checked={profileSettings.showEmail}
                  onCheckedChange={(checked) => handleProfileSettingChange('showEmail', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-socials">Show Social Links</Label>
                  <p className="text-xs text-muted-foreground">Display social media links on your profile</p>
                </div>
                <Switch 
                  id="show-socials" 
                  checked={profileSettings.showSocials}
                  onCheckedChange={(checked) => handleProfileSettingChange('showSocials', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={profileSettings.darkMode}
                  onCheckedChange={(checked) => handleProfileSettingChange('darkMode', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications about profile updates</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={profileSettings.notificationsEnabled}
                  onCheckedChange={(checked) => handleProfileSettingChange('notificationsEnabled', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-badges">Display Achievement Badges</Label>
                  <p className="text-xs text-muted-foreground">Show your earned badges on your profile</p>
                </div>
                <Switch 
                  id="show-badges" 
                  checked={profileSettings.showBadges}
                  onCheckedChange={(checked) => handleProfileSettingChange('showBadges', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setShowProfileSettings(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <main className="flex-grow flex flex-col p-4 sm:p-6 pt-20 pb-20">
          <div className="container max-w-4xl mx-auto">
            <motion.div 
              className="flex items-center space-x-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Info className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-heading">About Us</h1>
            </motion.div>
            
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-12 animate-fade-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-lg"></div>
                <div className="relative bg-primary/10 p-4 rounded-full">
                  <Keyboard className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">TypeSpeed Master</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're dedicated to helping people improve their typing skills through engaging, 
                interactive typing tests and exercises.
              </p>
              <div className="flex flex-wrap items-center justify-center mt-6 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full flex items-center gap-2"
                  onClick={() => window.open("https://github.com/Xenonesis/speed-typist-challenge", "_blank")}
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full flex items-center gap-2"
                  onClick={() => window.open("#/updates", "_self")}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Badge className="bg-primary/10 text-primary border-none py-1.5 flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </Badge>
                <Badge className="bg-accent/10 text-accent border-none py-1.5 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>10K+ Users</span>
                </Badge>
              </div>
            </motion.div>
            
            {/* Mission & Why Practice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col h-full"
              >
                <Card className="shadow-sm border-border/30 overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-background pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Our mission is to make typing practice engaging and effective. In today's digital world, 
                      typing proficiency is more important than ever. Whether you're a student, professional, or casual typist, 
                      we're here to help you enhance your typing speed and accuracy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col h-full"
              >
                <Card className="shadow-sm border-border/30 overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="bg-gradient-to-r from-background to-accent/10 pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-accent" />
                      Why Practice Typing?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Improve work productivity and efficiency</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Reduce fatigue during long typing sessions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Enhance focus and reduce errors in communication</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Develop a valuable skill for almost any career</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Our Story */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="shadow-sm border-border/30 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-background pb-3 flex flex-row items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('story')}
                >
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Our Story
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    {expandedSection === 'story' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                {(expandedSection === 'story' || window.innerWidth >= 768) && (
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      TypeSpeed Master was founded in 2025 by Aditya, a passionate cybersecurity professional and educator
                      with a strong interest in typing efficiency. What started as a small project to help friends 
                      improve their typing skills has grown into a platform used by thousands of people worldwide.
                    </p>
                    
                    <div className="relative mt-8 mb-6 pl-4 border-l-2 border-primary/30">
                      {/* Timeline */}
                      <div className="space-y-8">
                        <div className="relative">
                          <div className="absolute -left-[21px] mt-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                          <div>
                            <h3 className="text-base font-medium">2025 - The Beginning</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              TypeSpeed Master launches as a personal project with a simple interface focused on accuracy metrics.
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[21px] mt-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                          <div>
                            <h3 className="text-base font-medium">2025 - Growing Community</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              The platform expands to include leaderboards, achievements, and a growing library of typing content.
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[21px] mt-1.5 h-4 w-4 rounded-full border-2 border-accent bg-background"></div>
                          <div>
                            <h3 className="text-base font-medium">2025 - Major Redesign</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              A complete UI overhaul introduces the modern interface, along with advanced analytics and multiplayer features.
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[21px] mt-1.5 h-4 w-4 rounded-full border-2 border-primary/60 bg-primary/20"></div>
                          <div>
                            <h3 className="text-base font-medium">Today & Beyond</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              We continue to refine the platform with new typing exercises, AI-powered recommendations, and community-driven improvements.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      We continuously update our platform with new features, text content, and improvements based 
                      on user feedback. Our typing tests are designed to be both challenging and enjoyable, helping 
                      you make consistent progress.
                    </p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
            
            {/* Features & Technology */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="shadow-sm border-border/30 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <CardHeader className="bg-gradient-to-r from-background to-primary/10 pb-3 flex flex-row items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('features')}
                >
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Features & Technology
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:hidden">
                    {expandedSection === 'features' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                {(expandedSection === 'features' || window.innerWidth >= 768) && (
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <BadgeCheck className="h-5 w-5 text-primary mr-2" />
                          Core Features
                        </h3>
                        <ul className="space-y-2 text-muted-foreground leading-relaxed">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Interactive typing tests with real-time WPM and accuracy metrics</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Advanced statistics tracking with detailed performance analysis</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Character-specific performance metrics and recommendations</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Daily typing challenges and achievements</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>Customizable practice modes with varying difficulty levels</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>AI-powered text generation for varied practice material</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                          <Zap className="h-5 w-5 text-accent mr-2" />
                          Technology Stack
                        </h3>
                        <ul className="space-y-2 text-muted-foreground leading-relaxed">
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>React with TypeScript for robust, type-safe code</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>Tailwind CSS for modern, responsive styling</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>Shadcn/UI for accessible and customizable components</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>Framer Motion for smooth animations and transitions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>Recharts for interactive data visualization</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>Modern API integration for AI-powered features</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Tech Stack Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Card className="shadow-sm border-border/30 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-background pb-3 flex flex-row items-center justify-between cursor-pointer">
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary animate-spin-slow" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* React */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 rounded-xl border border-blue-200/30 dark:border-blue-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="mb-3"
                      >
                        {/* Fallback icon if image fails */}
                        <div className="relative">
                          <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" 
                            alt="React" 
                            className="h-10 w-10 text-blue-500" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'block';
                            }}
                          />
                          <div className="hidden">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <div className="text-blue-500 font-bold">R</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <span className="font-medium text-sm">React</span>
                      <span className="text-xs text-muted-foreground">UI library</span>
                    </motion.div>

                    {/* TypeScript */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl border border-blue-200/30 dark:border-blue-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="mb-3"
                      >
                        <div className="relative">
                          <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" 
                            alt="TypeScript" 
                            className="h-10 w-10" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'block';
                            }}
                          />
                          <div className="hidden">
                            <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                              <div className="text-white font-bold">TS</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <span className="font-medium text-sm">TypeScript</span>
                      <span className="text-xs text-muted-foreground">Type-safe JS</span>
                    </motion.div>

                    {/* Vite */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30 p-4 rounded-xl border border-purple-200/30 dark:border-purple-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ 
                          scale: 1.2,
                          transition: { duration: 0.2 }
                        }}
                        className="mb-3 relative"
                      >
                        <motion.div
                          animate={{ 
                            opacity: [1, 0.5, 1],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-yellow-500/20 rounded-full filter blur-md"
                        />
                        <div className="relative z-10">
                          <img 
                            src="https://vitejs.dev/logo.svg" 
                            alt="Vite" 
                            className="h-10 w-10" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'block';
                            }}
                          />
                          <div className="hidden">
                            <div className="h-10 w-10 flex items-center justify-center">
                              <Zap className="h-8 w-8 text-purple-500" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <span className="font-medium text-sm">Vite</span>
                      <span className="text-xs text-muted-foreground">Build tool</span>
                    </motion.div>

                    {/* Tailwind CSS */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-sky-50/50 to-teal-50/50 dark:from-sky-950/30 dark:to-teal-950/30 p-4 rounded-xl border border-sky-200/30 dark:border-sky-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ 
                          scale: 1.2, 
                          boxShadow: "0 0 8px rgba(56, 189, 248, 0.6)"
                        }}
                        className="mb-3 rounded-lg"
                      >
                        <div className="relative">
                          <img 
                            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" 
                            alt="Tailwind CSS" 
                            className="h-10 w-10" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'block';
                            }}
                          />
                          <div className="hidden">
                            <div className="h-10 w-10 rounded-md bg-sky-500 flex items-center justify-center">
                              <div className="text-white font-bold">TW</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <span className="font-medium text-sm">Tailwind CSS</span>
                      <span className="text-xs text-muted-foreground">Utility-first CSS</span>
                    </motion.div>

                    {/* shadcn/ui */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-gray-50/50 to-zinc-50/50 dark:from-gray-950/30 dark:to-zinc-950/30 p-4 rounded-xl border border-gray-200/30 dark:border-gray-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="mb-3"
                      >
                        <motion.div
                          animate={{ 
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap className="h-10 w-10 text-accent" />
                        </motion.div>
                      </motion.div>
                      <span className="font-medium text-sm">shadcn/ui</span>
                      <span className="text-xs text-muted-foreground">UI components</span>
                    </motion.div>

                    {/* Framer Motion */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/30 dark:to-rose-950/30 p-4 rounded-xl border border-pink-200/30 dark:border-pink-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ 
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5, repeat: 1 }
                        }}
                        className="mb-3"
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -5, 0] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="relative">
                            <svg className="h-10 w-10" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0V21H14V0H0Z" fill="#0055FF"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M7.30827 5.80566H11.3301V9.02193H7.30827V5.80566ZM3.26877 13.4332H7.30827V9.02193H3.26877V13.4332ZM3.26877 5.80566V9.02193L0 9.02193V5.80566H3.26877Z" fill="white"/>
                            </svg>
                            <div className="hidden">
                              <div className="h-10 w-10 rounded-md bg-pink-500 flex items-center justify-center">
                                <div className="text-white font-bold">FM</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                      <span className="font-medium text-sm">Framer Motion</span>
                      <span className="text-xs text-muted-foreground">Animations</span>
                    </motion.div>

                    {/* Recharts */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/30 p-4 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 5
                        }}
                        className="mb-3"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <div className="relative">
                            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#40C9A2"/>
                              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="#40C9A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className="hidden">
                              <div className="h-10 w-10 flex items-center justify-center">
                                <BarChart3 className="h-8 w-8 text-emerald-500" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                      <span className="font-medium text-sm">Recharts</span>
                      <span className="text-xs text-muted-foreground">Data visualization</span>
                    </motion.div>

                    {/* Lucide React */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/30 p-4 rounded-xl border border-orange-200/30 dark:border-orange-800/30 flex flex-col items-center"
                    >
                      <motion.div 
                        whileHover={{ 
                          scale: 1.2,
                          color: "#f97316"
                        }}
                        className="mb-3"
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 180, 360]
                          }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="relative">
                            <Cpu className="h-10 w-10 text-orange-500" />
                          </div>
                        </motion.div>
                      </motion.div>
                      <span className="font-medium text-sm">Lucide React</span>
                      <span className="text-xs text-muted-foreground">Icon library</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Testimonials Section */}
            <Card className="shadow-sm border-border/30 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-background to-background pb-3 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleDeveloperSection('testimonials')}
              >
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Testimonials
                </CardTitle>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  {developerExpanded === 'testimonials' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              {developerExpanded === 'testimonials' && (
                <CardContent className="pt-4">
                  <div className="flex overflow-x-auto pb-4 space-x-4 custom-scrollbar">
                    <div className="bg-card p-5 rounded-lg border border-border/30 relative shadow-md min-w-[300px] max-w-[350px] flex-shrink-0">
                      <div className="absolute -top-3 -left-2">
                        <span className="text-5xl text-primary opacity-50">"</span>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                          Aditya is a stellar student and proficient future technology professional..he has all the qualities to become an influential leader and a professional game changer... he is actively able to perform the most daunting tasks with enormous ease....as a mentor it is a privilege to impart professional skills to this stupendous future leader and top performer.... 11 on 10 to Aditya...keep rocking and kick ass..👍👍👍
                        </p>
                        <div className="flex items-center mt-4 pt-4 border-t border-border/30">
                          <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center text-primary font-semibold mr-3">SA</div>
                          <div>
                            <p className="font-medium text-sm">Siddharth Anand</p>
                            <p className="text-xs text-muted-foreground">Aditya's Teacher</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-lg border border-border/30 relative shadow-md min-w-[300px] max-w-[350px] flex-shrink-0">
                      <div className="absolute -top-3 -left-2">
                        <span className="text-5xl text-accent opacity-50">"</span>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                          Aditya exemplifies resilience, curiosity, and purpose-driven learning. With a rare blend of humility and leadership, he turns challenges into opportunities for growth, inspiring those around him. A lifelong learner, Aditya is destined to make a meaningful impact, reminding us that true success is built with purpose, Practice and heart...
                        </p>
                        <div className="flex items-center mt-4 pt-4 border-t border-border/30">
                          <div className="bg-accent/10 h-12 w-12 rounded-full flex items-center justify-center text-accent font-semibold mr-3">PY</div>
                          <div>
                            <p className="font-medium text-sm">Prateek Yadav</p>
                            <p className="text-xs text-muted-foreground">Aditya's Teacher</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-5 rounded-lg border border-border/30 relative shadow-md min-w-[300px] max-w-[350px] flex-shrink-0">
                      <div className="absolute -top-3 -left-2">
                        <span className="text-5xl text-primary opacity-50">"</span>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                          Aditya's dedication and passion for learning is truly inspiring. He is always eager to tackle new challenges with enthusiasm and determination...
                        </p>
                        <div className="flex items-center mt-4 pt-4 border-t border-border/30">
                          <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center text-primary font-semibold mr-3">RS</div>
                          <div>
                            <p className="font-medium text-sm">Rahul Sharma</p>
                            <p className="text-xs text-muted-foreground">Mentor</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Experience Showcase */}
            <Card className="shadow-sm border-border/30 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 mt-4">
              <CardHeader className="bg-gradient-to-r from-accent/5 via-background to-background pb-3 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleDeveloperSection('showcase')}
              >
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-accent" />
                  Experience Showcase
                </CardTitle>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  {developerExpanded === 'showcase' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              {developerExpanded === 'showcase' && (
                <CardContent className="pt-4">
                  <div className="space-y-8">
                    {/* Timeline Section */}
                    <div className="relative border-l-2 border-primary/30 pl-6 ml-4">
                      <div className="mb-8 relative">
                        <div className="absolute -left-[28px] top-0 h-6 w-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                          <Clock className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/3">
                            <h3 className="text-base font-medium">June 2024 - Present</h3>
                            <p className="text-sm text-primary font-medium">Cybersecurity Intern</p>
                            <p className="text-xs text-muted-foreground">Null, Remote</p>
                          </div>
                          <div className="md:w-2/3">
                            <p className="text-sm text-muted-foreground mb-3">
                              Working on vulnerability assessments and network security implementations for client systems. Focusing on intrusion detection and incident response.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Vulnerability Assessment</Badge>
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Network Security</Badge>
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">SIEM Tools</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8 relative">
                        <div className="absolute -left-[28px] top-0 h-6 w-6 rounded-full border-2 border-accent bg-background flex items-center justify-center">
                          <Clock className="h-3 w-3 text-accent" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/3">
                            <h3 className="text-base font-medium">Oct 2024 - Present</h3>
                            <p className="text-sm text-accent font-medium">Cybersecurity and AI/ML Intern</p>
                            <p className="text-xs text-muted-foreground">Quantam Pvt. Ltd., Gurugram</p>
                          </div>
                          <div className="md:w-2/3">
                            <p className="text-sm text-muted-foreground mb-3">
                              Working on projects that combine cybersecurity with AI/ML applications, learning about data protection and advanced security protocols.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Cybersecurity</Badge>
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">AI/ML</Badge>
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Data Protection</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[28px] top-0 h-6 w-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                          <Clock className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/3">
                            <h3 className="text-base font-medium">Aug 2024 - Present</h3>
                            <p className="text-sm text-primary font-medium">Mentor (Part-time)</p>
                            <p className="text-xs text-muted-foreground">JhaMobii Technologies Pvt. Ltd., Remote</p>
                          </div>
                          <div className="md:w-2/3">
                            <p className="text-sm text-muted-foreground mb-3">
                              Providing technical mentorship in cybersecurity to junior professionals and interns, guiding them through assessments and security strategies.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Mentorship</Badge>
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Security Frameworks</Badge>
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">Training</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="border-border/20 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-4 text-center">
                          <Hexagon className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h3 className="text-2xl font-bold text-primary">3+</h3>
                          <p className="text-xs text-muted-foreground">Cybersecurity Projects</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-border/20 bg-gradient-to-br from-accent/5 to-accent/10">
                        <CardContent className="p-4 text-center">
                          <Flame className="h-8 w-8 mx-auto mb-2 text-accent" />
                          <h3 className="text-2xl font-bold text-accent">8+</h3>
                          <p className="text-xs text-muted-foreground">Web Development Projects</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-border/20 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h3 className="text-2xl font-bold text-primary">20+</h3>
                          <p className="text-xs text-muted-foreground">Certifications</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-border/20 bg-gradient-to-br from-accent/5 to-accent/10">
                        <CardContent className="p-4 text-center">
                          <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
                          <h3 className="text-2xl font-bold text-accent">120+</h3>
                          <p className="text-xs text-muted-foreground">Team Members Led</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                        onClick={() => window.open("https://iaddy.netlify.app/", "_blank")}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Portfolio Website
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
          
          {/* Feedback and Contribute Section */}
          <motion.div 
            className="container max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold gradient-heading">Join Our Community</h2>
              <p className="text-muted-foreground mt-2">We welcome your feedback and contributions</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => document.getElementById('feedback-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Heart className="h-4 w-4 mr-2" />
                Provide Feedback
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => window.open("https://github.com/Xenonesis/speed-typist-challenge", "_blank")}
              >
                <Github className="h-4 w-4 mr-2" />
                Contribute on GitHub
              </Button>
            </div>
            
            <div id="feedback-form" className="bg-card border border-border/30 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-center">Your Feedback Matters</h3>
              <div className="flex justify-center">
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSccSvSOjT1YHODo7HauelLIf0L2s7ZRxjKKB16qirJ1AjAy7w/viewform?embedded=true" 
                  width="100%" 
                  height="1286" 
                  style={{ border: 'none' }}
                  title="Feedback Form"
                >
                  Loading…
                </iframe>
              </div>
            </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}