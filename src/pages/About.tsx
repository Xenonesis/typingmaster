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
  BarChart3,
  Database,
  FileCode,
  LayoutGrid
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
              <h3 className="font-semibold text-primary mb-2">Latest Updates in v7.3:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Comprehensive authentication system with protected routes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Full GitHub integration with main branch tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Enhanced version control and release management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  <span>Improved documentation and contribution guides</span>
                </li>
              </ul>
              
              <Separator className="my-4" />
              
              <div className="bg-accent/10 p-3 rounded-md border border-accent/20 text-sm">
                <p className="mb-2 text-center font-medium">Contribute to our project on GitHub!</p>
                <p className="text-muted-foreground">
                  We're now on GitHub! Visit our repository at <a href="https://github.com/Xenonesis/speed-typist-challenge" className="text-primary underline" target="_blank" rel="noopener noreferrer">github.com/Xenonesis/speed-typist-challenge</a> to contribute, 
                  report issues, or submit feature requests.
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
        
        {/* New Hero Section */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                Elevate Your Typing Skills
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                About TypeSpeed Master
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Your journey to faster, more accurate typing starts here. 
                Discover our mission, features, and the technology that powers TypeSpeed Master.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="rounded-full gap-2">
                  <Keyboard className="h-4 w-4" />
                  Start Practicing
                </Button>
                <Button size="lg" variant="outline" className="rounded-full gap-2">
                  <Users className="h-4 w-4" />
                  Join Community
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
        </section>
        
        <main className="flex-1 py-10">
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
                            <span>Next.js 15.3 with App Router for powerful React framework</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>TypeScript for robust, type-safe code</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>Supabase for database, authentication, and storage</span>
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
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Tech Stack Section */}
            <section id="tech-stack" className="mb-10">
              <div className={containerClasses}>
                <div className="space-y-3">
                  <h2 className={headingClasses}>
                    <Cpu className="h-6 w-6 text-primary" />
                    Technology Stack
                  </h2>
                  <p className={paragraphClasses}>
                    TypeSpeed Master is built with modern web technologies to ensure maximum performance, 
                    reliability, and user experience.
                  </p>
                </div>
                
                <div className={`${sectionClasses} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}>
                  {/* Frontend Framework */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">React 18.3</h3>
                        <p className="text-xs text-muted-foreground">Frontend Framework</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* TypeScript */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">TypeScript 5.5</h3>
                        <p className="text-xs text-muted-foreground">Type-safe JavaScript</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Vite */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-purple-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.286 10.578l-1.732 3.464h6.547l2.598-4.93-4.012-7.533-3.334 8.338.934.66zm12.522 2.741l-2.384-4.935-2.196 3.658h-6.552l-2.374 4.936 3.161 5.789 3.19-7.162 8.027.073-.872-2.359z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">Vite 5.4</h3>
                        <p className="text-xs text-muted-foreground">Next-Gen Build Tool</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tailwind CSS */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-cyan-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">Tailwind CSS 3.4</h3>
                        <p className="text-xs text-muted-foreground">Utility-First CSS</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* shadcn/ui */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-zinc-500/10 flex items-center justify-center mb-3">
                          <div className="h-6 w-6 bg-foreground rounded-full"></div>
                        </div>
                        <h3 className="text-base font-semibold mb-1">shadcn/ui</h3>
                        <p className="text-xs text-muted-foreground">UI Component Library</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Supabase */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.932 12.17a.396.396 0 0 0 .284.662h9.361v8.959a.396.396 0 0 0 .716.233l8.353-12.006a.396.396 0 0 0-.284-.662z"/>
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">Supabase</h3>
                        <p className="text-xs text-muted-foreground">Auth & Database</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Framer Motion */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 0h16v8h-8v8h-8V0zm0 16h8v8H4v-8z"/>
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">Framer Motion</h3>
                        <p className="text-xs text-muted-foreground">Animation Library</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tanstack Query */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.403 11.997l-5.679 5.676-1.228 1.23s-.347.347-.953.347c-.604 0-.953-.347-.953-.347L4.92 16.235s-.363-.347-.363-.933c0-.564.347-.922.347-.922l2.67-2.664s.347-.347.953-.347c.604 0 .953.347.953.347l.3.303 6.135 6.124.367.365s1.008.993 1.008 2.014c0 1.073-1.004 2.014-1.004 2.014zm2.032-8.003s-1.032 0-1.032 1.014c0 1.05 1.031 1.05 1.031 1.05v4.892s0 1.014-1.018 1.014c-1.062 0-1.018-1.032-1.018-1.032h-1.018s0 2.048 2.036 2.048 2.018-2.048 2.018-2.048V4.012c.017-.018-1-.018-1-.018z"/>
                          </svg>
                        </div>
                        <h3 className="text-base font-semibold mb-1">TanStack Query</h3>
                        <p className="text-xs text-muted-foreground">Async State Management</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* GitHub */}
                  <Card className="bg-background/50 border border-border/30 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-gray-500/10 flex items-center justify-center mb-3">
                          <Github className="h-6 w-6 text-gray-500" />
                        </div>
                        <h3 className="text-base font-semibold mb-1">GitHub</h3>
                        <p className="text-xs text-muted-foreground">Version Control</p>
                        <a 
                          href="https://github.com/Xenonesis/speed-typist-challenge"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary mt-2 hover:underline flex items-center"
                        >
                          <span>Visit Repository</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
            
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

            {/* Add Call-to-Action section before Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-12 mb-16"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-10">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
                  <div className="h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl"></div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4">
                  <div className="h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl"></div>
                </div>
                <div className="relative max-w-3xl mx-auto text-center text-primary-foreground">
                  <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Typing Skills?</h2>
                  <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                    Join thousands of users who are improving their typing speed and accuracy with TypeSpeed Master. Start your journey today!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Keyboard className="h-4 w-4" />
                      Start Practicing
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 gap-2">
                      <Eye className="h-4 w-4" />
                      See Your Progress
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
        
        {/* Quick Navigation Floating Button */}
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                Back to top
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}