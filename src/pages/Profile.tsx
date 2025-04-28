import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  User, 
  Settings, 
  Bell, 
  Keyboard, 
  LogOut, 
  Edit3,
  UserCircle,
  Trophy,
  Medal,
  Award,
  Save,
  BadgeCheck,
  Sparkles,
  History,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Code
} from "lucide-react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TestResultsData } from "@/components/TestResults";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAnimations } from "@/context/AnimationsContext";
import { useAchievements } from "@/context/AchievementsContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  bio: z.string().max(160).optional(),
});

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.enum(["small", "medium", "large"]),
  soundEffects: z.boolean(),
  animations: z.boolean(),
  showCountdown: z.boolean(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  achievementNotifications: z.boolean(),
  goalNotifications: z.boolean(),
  challengeNotifications: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

// Main Profile component without ThemeProvider
function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState({
    testsCompleted: 0,
    averageWPM: 0,
    highestWPM: 0,
    bestAccuracy: 0,
    longestStreak: 0
  });
  const [profileData, setProfileData] = useState({
    username: localStorage.getItem("typingUsername") || "User",
    email: localStorage.getItem("typingEmail") || "",
    bio: localStorage.getItem("typingBio") || "",
  });
  const [customTexts, setCustomTexts] = useState<string[]>(() => {
    const savedTexts = localStorage.getItem('typingCustomTexts');
    return savedTexts ? JSON.parse(savedTexts) : [];
  });
  const [currentCustomText, setCurrentCustomText] = useState(() => {
    return localStorage.getItem("typingCustomText") || "";
  });
  const [customTextSaved, setCustomTextSaved] = useState(false);
  const { animationsEnabled, setAnimationsEnabled } = useAnimations();
  const { achievements } = useAchievements();
  const completedAchievements = achievements.filter(a => a.completed);
  const [recentResults, setRecentResults] = useState<TestResultsData[]>([]);
  const [themePreference, setThemePreference] = useState<string>(() => 
    localStorage.getItem("typingTheme") || "system"
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customTextError, setCustomTextError] = useState("");
  const customTextRef = useRef<HTMLTextAreaElement>(null);
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
  const [keyboardShortcutsVisible, setKeyboardShortcutsVisible] = useState(false);

  const { theme, setTheme } = useTheme();

  // Move the form declarations above their usage in useEffect hooks
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profileData.username,
      email: profileData.email,
      bio: profileData.bio,
    },
  });

  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: themePreference as "light" | "dark" | "system",
      fontSize: localStorage.getItem("typingFontSize") as "small" | "medium" | "large" || "medium",
      soundEffects: localStorage.getItem("typingSoundEffects") === "true",
      animations: animationsEnabled,
      showCountdown: localStorage.getItem("typingShowCountdown") === "true",
    },
  });

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      achievementNotifications: true,
      goalNotifications: true,
      challengeNotifications: true,
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    // Save profile data to localStorage
    localStorage.setItem("typingUsername", data.username);
    localStorage.setItem("typingEmail", data.email);
    localStorage.setItem("typingBio", data.bio || "");
    
    // Update state
    setProfileData({
      username: data.username,
      email: data.email,
      bio: data.bio || "",
    });
    
    // Close editing mode
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  }

  function onAppearanceSubmit(data: AppearanceFormValues) {
    // Save all appearance settings to localStorage
    localStorage.setItem("typingTheme", data.theme);
    localStorage.setItem("typingFontSize", data.fontSize);
    localStorage.setItem("typingSoundEffects", data.soundEffects.toString());
    localStorage.setItem("typingShowCountdown", data.showCountdown.toString());
    
    // Update state
    setThemePreference(data.theme);
    setAnimationsEnabled(data.animations);
    
    // Apply theme setting based on selection
    if (data.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    } else if (data.theme === "light" || data.theme === "dark") {
      setTheme(data.theme);
    }
    
    // Apply font size
    applyFontSize(data.fontSize);
    
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been saved successfully.",
    });
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    // Save notification settings to localStorage
    localStorage.setItem("typingEmailNotifications", data.emailNotifications.toString());
    localStorage.setItem("typingAchievementNotifications", data.achievementNotifications.toString());
    localStorage.setItem("typingGoalNotifications", data.goalNotifications.toString());
    localStorage.setItem("typingChallengeNotifications", data.challengeNotifications.toString());
    
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved successfully.",
    });
  }
  
  // Separate font size application from theme handling
  const applyFontSize = (fontSize: string) => {
    const rootElement = document.documentElement;
    switch (fontSize) {
      case "small":
        rootElement.style.fontSize = "14px";
        break;
      case "medium":
        rootElement.style.fontSize = "16px";
        break;
      case "large":
        rootElement.style.fontSize = "18px";
        break;
    }
  };

  useEffect(() => {
    // Load user statistics from localStorage
    const storedData = localStorage.getItem("typingPersonalBests");
    if (storedData) {
      const typingResults = JSON.parse(storedData);
      if (typingResults.length > 0) {
        const totalWPM = typingResults.reduce((sum: number, test: TestResultsData) => sum + test.wpm, 0);
        const highestWPM = Math.max(...typingResults.map((test: TestResultsData) => test.wpm));
        const bestAccuracy = Math.max(...typingResults.map((test: TestResultsData) => test.accuracy));
        
        setUserStats({
          testsCompleted: typingResults.length,
          averageWPM: Math.round(totalWPM / typingResults.length),
          highestWPM: Math.round(highestWPM),
          bestAccuracy: Math.round(bestAccuracy),
          longestStreak: parseInt(localStorage.getItem("typingLongestStreak") || "0", 10)
        });
        
        // Get recent results (last 5)
        setRecentResults(typingResults.slice(-5).reverse());
      }
    }

    // Load appearance settings
    const savedTheme = localStorage.getItem("typingTheme") || "system";
    const savedFontSize = localStorage.getItem("typingFontSize") || "medium";
    const savedSoundEffects = localStorage.getItem("typingSoundEffects");
    const savedShowCountdown = localStorage.getItem("typingShowCountdown");
    
    // Apply theme based on user preference
    if (savedTheme === "system") {
      // Use system preference for theme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    } else if (savedTheme === "light" || savedTheme === "dark") {
      // Use explicit light/dark preference
      setTheme(savedTheme);
    }
    
    // Apply font size
    applyFontSize(savedFontSize);
    
    // Update form with saved settings
    appearanceForm.reset({
      theme: savedTheme as "light" | "dark" | "system",
      fontSize: savedFontSize as "small" | "medium" | "large",
      soundEffects: savedSoundEffects ? savedSoundEffects === "true" : true,
      animations: animationsEnabled,
      showCountdown: savedShowCountdown ? savedShowCountdown === "true" : true,
    });

    // Load notification settings
    const emailNotifs = localStorage.getItem("typingEmailNotifications");
    const achievementNotifs = localStorage.getItem("typingAchievementNotifications");
    const goalNotifs = localStorage.getItem("typingGoalNotifications");
    const challengeNotifs = localStorage.getItem("typingChallengeNotifications");

    notificationForm.reset({
      emailNotifications: emailNotifs ? emailNotifs === "true" : true,
      achievementNotifications: achievementNotifs ? achievementNotifs === "true" : true,
      goalNotifications: goalNotifs ? goalNotifs === "true" : true,
      challengeNotifications: challengeNotifs ? challengeNotifs === "true" : true,
    });

    // Listen for system theme changes if using system preference
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (savedTheme === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [setTheme, appearanceForm, animationsEnabled]);

  // Fix the keyboard event listener typing with proper types
  useEffect(() => {
    const handleKeyDown = (e: Event) => {
      const event = e as globalThis.KeyboardEvent;
      // ? key to show keyboard shortcuts
      if (event.key === "?" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        setKeyboardShortcutsVisible(prev => !prev);
      }
      
      // Esc to close keyboard shortcuts
      if (event.key === "Escape" && keyboardShortcutsVisible) {
        setKeyboardShortcutsVisible(false);
      }
      
      // Ctrl+S or Cmd+S for save (when in edit mode)
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        if (isEditing) {
          event.preventDefault();
          profileForm.handleSubmit(onProfileSubmit)();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, keyboardShortcutsVisible, profileForm, onProfileSubmit]);

  // Group achievements by category for better display
  const achievementsByCategory = completedAchievements.reduce((acc, achievement) => {
    const category = achievement.id.split('_')[0];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, typeof completedAchievements>);
  
  // Get achievement categories in a readable format
  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'tests': 'Test Completion',
      'wpm': 'Speed',
      'accuracy': 'Accuracy',
      'daily': 'Streaks',
      'code': 'Code Typing'
    };
    return categoryMap[category] || category;
  };

  // Enhanced handler for custom text changes
  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setCurrentCustomText(newText);
    localStorage.setItem("typingCustomText", newText);
    
    // Clear any previous error when text is entered
    if (newText.trim() && customTextError) {
      setCustomTextError("");
    }
  };
  
  // Handle keyboard shortcuts in custom text area
  const handleCustomTextKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSaveCustomText();
    }
  };
  
  // Enhanced save custom text handler
  const handleSaveCustomText = () => {
    const text = currentCustomText.trim();
    
    if (!text) {
      setCustomTextError("Please enter some text before saving.");
      return;
    }
    
    if (text.length < 10) {
      setCustomTextError("Text must be at least 10 characters long.");
      return;
    }
    
    if (editingTextIndex !== null) {
      // Update existing text
      const updatedTexts = [...customTexts];
      updatedTexts[editingTextIndex] = text;
      setCustomTexts(updatedTexts);
      localStorage.setItem('typingCustomTexts', JSON.stringify(updatedTexts));
      
      toast({
        title: "Custom text updated",
        description: "Your text has been updated successfully.",
      });
      
      // Reset editing state
      setEditingTextIndex(null);
    } else {
      // Add new text
      const updatedTexts = [...customTexts, text];
      setCustomTexts(updatedTexts);
      localStorage.setItem('typingCustomTexts', JSON.stringify(updatedTexts));
      
      toast({
        title: "Custom text saved",
        description: "Your text has been saved and will be used for typing tests.",
      });
    }
    
    // Clear input
    setCurrentCustomText("");
    setCustomTextSaved(true);
    setCustomTextError("");
  };
  
  // Handler for editing a custom text
  const handleEditCustomText = (index: number) => {
    setCurrentCustomText(customTexts[index]);
    setEditingTextIndex(index);
    // Focus the textarea
    if (customTextRef.current) {
      customTextRef.current.focus();
    }
  };
  
  // Handler for canceling edit
  const handleCancelEdit = () => {
    setCurrentCustomText("");
    setEditingTextIndex(null);
    setCustomTextError("");
  };

  // Handler for signing out
  const handleSignOut = () => {
    // Clear relevant localStorage items
    localStorage.removeItem("typingUsername");
    localStorage.removeItem("typingEmail");
    localStorage.removeItem("typingBio");
    
    // Show toast notification
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    
    // Refresh the page
    window.location.reload();
  };

  // Reset all settings to default
  const handleResetSettings = () => {
    // Reset appearance settings in the form
    appearanceForm.reset({
      theme: "system",
      fontSize: "medium",
      soundEffects: true,
      animations: true,
      showCountdown: true,
    });
    
    // Reset notification settings
    notificationForm.reset({
      emailNotifications: true,
      achievementNotifications: true,
      goalNotifications: true,
      challengeNotifications: true,
    });
    
    // Clear all settings from localStorage
    localStorage.removeItem("typingTheme");
    localStorage.removeItem("typingFontSize");
    localStorage.removeItem("typingSoundEffects");
    localStorage.removeItem("typingShowCountdown");
    localStorage.removeItem("typingEmailNotifications");
    localStorage.removeItem("typingAchievementNotifications");
    localStorage.removeItem("typingGoalNotifications");
    localStorage.removeItem("typingChallengeNotifications");
    
    // Update state with default values
    setThemePreference("system");
    setAnimationsEnabled(true);
    
    // Apply system theme based on system preference
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(systemTheme);
    
    // Apply default medium font size
    applyFontSize("medium");
    
    // Hide confirm dialog
    setShowResetConfirm(false);
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to their default values."
    });
  };

  // Add handleDeleteCustomText function
  const handleDeleteCustomText = (index: number) => {
    const updatedTexts = customTexts.filter((_, i) => i !== index);
    setCustomTexts(updatedTexts);
    localStorage.setItem('typingCustomTexts', JSON.stringify(updatedTexts));
    
    toast({
      title: "Custom text deleted",
      description: "The custom text has been removed successfully.",
    });
  };

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        <main className="flex-grow flex flex-col p-6 pt-24 pb-20">
          <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <UserCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-heading">Your Profile</h1>
            </div>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/achievements">
                <Badge className="h-5 w-5 text-primary" />
                View All Achievements
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
              <div className="space-y-6">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Profile
                  </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-soft">
                          <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${profileData.username}`} alt="Profile Image" />
                          <AvatarFallback className="text-xl">{profileData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button 
                          size="icon" 
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-soft"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      <h2 className="text-xl font-bold mb-1">{profileData.username}</h2>
                      {profileData.bio && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 text-center">{profileData.bio}</p>
                      )}
                    <div className="grid grid-cols-2 gap-2 w-full mb-6 text-center">
                        <div className="p-3 rounded-xl bg-background/70 border border-border/30 shadow-soft">
                          <p className="text-sm text-muted-foreground">Tests</p>
                          <p className="text-xl font-bold">{userStats.testsCompleted}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-background/70 border border-border/30 shadow-soft">
                          <p className="text-sm text-muted-foreground">Avg WPM</p>
                          <p className="text-xl font-bold">{userStats.averageWPM}</p>
                        </div>
                      </div>
                    <div className="grid grid-cols-1 gap-2 w-full mb-6">
                      <div className="p-3 rounded-xl bg-background/70 border border-border/30 shadow-soft">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-muted-foreground">Best WPM</p>
                          <p className="text-lg font-bold text-primary">{userStats.highestWPM}</p>
                        </div>
                        <Progress value={userStats.highestWPM / 2} className="h-1.5" />
                      </div>
                      <div className="p-3 rounded-xl bg-background/70 border border-border/30 shadow-soft">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-muted-foreground">Best Accuracy</p>
                          <p className="text-lg font-bold text-primary">{userStats.bestAccuracy}%</p>
                        </div>
                        <Progress value={userStats.bestAccuracy} className="h-1.5" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      Achievements
                    </CardTitle>
                    <Badge variant="outline" className="px-2 py-0 h-5">
                      {completedAchievements.length}/{achievements.length}
                    </Badge>
                  </div>
                  </CardHeader>
                <CardContent className="p-0">
                  <div className="py-3 px-4 border-b flex justify-between items-center">
                    <p className="text-sm font-medium">Recent Badges</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setKeyboardShortcutsVisible(true)}
                    >
                      Keyboard Shortcuts (?)
                    </Button>
                  </div>
                  <ScrollArea className="h-[240px]">
                    {completedAchievements.length > 0 ? (
                      <div className="space-y-4 p-3">
                        {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
                          <div key={category}>
                            <h4 className="text-xs font-medium uppercase text-muted-foreground px-2 mb-1">
                              {getCategoryName(category)}
                            </h4>
                            <div className="space-y-1">
                              {categoryAchievements.map((achievement) => (
                                <div 
                                  key={achievement.id} 
                                  className="flex items-center p-2 rounded-lg hover:bg-background/70 transition-colors"
                                  title={`${achievement.name}: ${achievement.description}`}
                                >
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                    {achievement.icon === 'trophy' && <Trophy className="h-5 w-5 text-primary" />}
                                    {achievement.icon === 'medal' && <Medal className="h-5 w-5 text-primary" />}
                                    {achievement.icon === 'target' && <BadgeCheck className="h-5 w-5 text-primary" />}
                                    {achievement.icon === 'flame' && <Sparkles className="h-5 w-5 text-primary" />}
                                    {achievement.icon === 'zap' && <ArrowUpRight className="h-5 w-5 text-primary" />}
                                    {achievement.icon === 'keyboard' && <Keyboard className="h-5 w-5 text-primary" />}
                                    {achievement.icon === 'code' && <Code className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                                    <p className="font-medium">{achievement.name}</p>
                                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                              ))}
                        </div>
                        </div>
                            ))}
                      </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                          <BadgeCheck className="h-8 w-8 text-muted-foreground/50 mb-3" />
                          <p className="text-sm font-medium mb-1">No achievements yet</p>
                          <p className="text-xs text-muted-foreground">Complete typing tests to earn badges</p>
                        </div>
                      )}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card className="shadow-card border-border/30 overflow-hidden">
                <CardHeader className="bg-background/50">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[200px]">
                    {recentResults.length > 0 ? (
                      <div className="space-y-1">
                        {recentResults.map((result, index) => (
                          <div key={index} className="flex items-center p-3 hover:bg-muted/10 border-b last:border-b-0">
                            <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center mr-3 border">
                              <Keyboard className="h-4 w-4 text-muted-foreground" />
                        </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <p className="font-medium">{result.wpm} WPM</p>
                                <p className="text-xs text-muted-foreground">{new Date(result.date).toLocaleDateString()}</p>
                      </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {result.accuracy}% accuracy
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Standard
                                </Badge>
                    </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                        <Calendar className="h-8 w-8 text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium mb-1">No recent activity</p>
                        <p className="text-xs text-muted-foreground">Complete typing tests to see your history</p>
                      </div>
                    )}
                  </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Tabs defaultValue="profile" className="animate-fade-in">
                  <TabsList className="mb-6 p-1 bg-background/80 backdrop-blur-sm border border-border/30 shadow-soft rounded-lg">
                    <TabsTrigger value="profile" className="rounded-md">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-md">
                      <Settings className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-md">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="custom-text" className="rounded-md">
                      <Keyboard className="h-4 w-4 mr-2" />
                      Custom Text
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="animate-scale-in">
                    <Card className="shadow-card border-border/30 overflow-hidden">
                      <CardHeader className="bg-background/50">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Profile Information
                      </CardTitle>
                        <CardDescription>
                          Update your profile information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                              control={profileForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your username" 
                                      {...field} 
                                      disabled={!isEditing} 
                                    className="bg-background/80"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    This is your public display name.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your email" 
                                      {...field} 
                                      disabled={!isEditing}
                                    className="bg-background/80"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Your email address is used for notifications.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                  <Textarea
                                      placeholder="Tell us about yourself" 
                                      {...field} 
                                      disabled={!isEditing}
                                    className="bg-background/80 min-h-[80px]"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Write a short bio about yourself.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          {isEditing ? (
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setIsEditing(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  type="submit" 
                                  className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow"
                                >
                                  Save Changes
                                </Button>
                              </div>
                          ) : (
                            <Button 
                              type="button" 
                              onClick={() => setIsEditing(true)}
                              className="w-full"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                            )}
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="animate-scale-in">
                    <Card className="shadow-card border-border/30 overflow-hidden">
                      <CardHeader className="bg-background/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-primary" />
                            Appearance
                          </CardTitle>
                        <CardDescription>
                          Customize how the app looks and feels
                        </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => setShowResetConfirm(true)}
                          >
                            Reset to Defaults
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        {showResetConfirm ? (
                          <div className="p-4 border rounded-lg mb-6 bg-muted/20">
                            <h4 className="font-medium mb-2">Reset all settings?</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              This will reset all appearance and notification settings to their default values.
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowResetConfirm(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleResetSettings}
                              >
                                Reset All Settings
                              </Button>
                            </div>
                          </div>
                        ) : null}
                        
                        <Form {...appearanceForm}>
                          <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
                            <div className="grid gap-6">
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Theme</h3>
                                <FormField
                                  control={appearanceForm.control}
                                  name="theme"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                <div className="grid grid-cols-3 gap-4">
                                          <div 
                                            className={`p-4 border rounded-xl cursor-pointer transition-all hover:border-primary/70 hover:bg-background/70 flex items-center justify-center ${field.value === 'light' ? 'border-primary bg-background/70' : ''}`}
                                            onClick={() => field.onChange('light')}
                                          >
                                    <div className="text-center">
                                      <div className="mb-2 flex justify-center">
                                        <div className="h-10 w-10 rounded-full bg-white border"></div>
                                      </div>
                                      <p className="font-medium">Light</p>
                                    </div>
                                  </div>
                                          <div 
                                            className={`p-4 border rounded-xl cursor-pointer transition-all hover:border-primary/70 hover:bg-background/70 flex items-center justify-center ${field.value === 'dark' ? 'border-primary bg-background/70' : ''}`}
                                            onClick={() => field.onChange('dark')}
                                          >
                                    <div className="text-center">
                                      <div className="mb-2 flex justify-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-900 border"></div>
                                      </div>
                                      <p className="font-medium">Dark</p>
                                    </div>
                                  </div>
                                          <div 
                                            className={`p-4 border rounded-xl cursor-pointer transition-all hover:border-primary/70 hover:bg-background/70 flex items-center justify-center ${field.value === 'system' ? 'border-primary bg-background/70' : ''}`}
                                            onClick={() => field.onChange('system')}
                                          >
                                    <div className="text-center">
                                      <div className="mb-2 flex justify-center">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white to-gray-900 border"></div>
                                      </div>
                                      <p className="font-medium">System</p>
                                    </div>
                                  </div>
                                </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Font Size</h3>
                                <FormField
                                  control={appearanceForm.control}
                                  name="fontSize"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select font size" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="small">Small</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="large">Large</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="space-y-4">
                                <h3 className="text-lg font-medium">Interface Settings</h3>
                                <FormField
                                  control={appearanceForm.control}
                                  name="soundEffects"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Sound Effects</FormLabel>
                                        <FormDescription>
                                          Enable sound effects during typing tests
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={appearanceForm.control}
                                  name="animations"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Animations</FormLabel>
                                        <FormDescription>
                                          Enable animations throughout the interface
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={appearanceForm.control}
                                  name="showCountdown"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                        <FormLabel className="text-base">Typing Countdown</FormLabel>
                                        <FormDescription>
                                          Show a 3-second countdown before starting typing tests
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="animate-scale-in">
                    <Card className="shadow-card border-border/30 overflow-hidden">
                      <CardHeader className="bg-background/50">
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" />
                          Notification Settings
                        </CardTitle>
                        <CardDescription>
                          Configure how and when you want to be notified
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Form {...notificationForm}>
                          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                            <div className="space-y-4">
                              <FormField
                                control={notificationForm.control}
                                name="emailNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-soft">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Email Notifications</FormLabel>
                                      <FormDescription>
                                        Receive email notifications for important updates
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="achievementNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-soft">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Achievement Notifications</FormLabel>
                                      <FormDescription>
                                        Get notified when you unlock a new achievement
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="goalNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-soft">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Goal Notifications</FormLabel>
                                      <FormDescription>
                                        Get notified when you reach a typing goal
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="challengeNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-soft">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Challenge Notifications</FormLabel>
                                      <FormDescription>
                                        Get notified about new typing challenges
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="custom-text" className="animate-scale-in">
                    <Card className="shadow-card border-border/30 overflow-hidden">
                      <CardHeader className="bg-background/50">
                        <CardTitle className="flex items-center gap-2">
                          <Keyboard className="h-4 w-4 text-primary" />
                          Custom Text
                        </CardTitle>
                        <CardDescription>
                          Create and manage your custom typing texts
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="custom-text-input">
                                {editingTextIndex !== null ? "Edit Custom Text" : "Enter Custom Text"}
                              </Label>
                              <p className="text-xs text-muted-foreground">Press Ctrl+Enter to save</p>
                            </div>
                            <Textarea
                              id="custom-text-input"
                              ref={customTextRef}
                              placeholder="Enter your custom text here..."
                              value={currentCustomText}
                              onChange={handleCustomTextChange}
                              onKeyDown={handleCustomTextKeyDown}
                              className={`min-h-24 bg-background/80 ${customTextError ? 'border-destructive' : ''}`}
                            />
                            {customTextError && (
                              <p className="text-sm text-destructive mt-1">{customTextError}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              {editingTextIndex !== null && (
                                <Button
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              )}
                            <Button 
                              onClick={handleSaveCustomText}
                                className={`${editingTextIndex !== null ? 'flex-1' : 'w-full'} bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow`}
                            >
                              <Save className="h-4 w-4 mr-2" />
                                {editingTextIndex !== null ? "Update Text" : "Save Custom Text"}
                            </Button>
                            </div>
                          </div>
                          
                          {customTexts.length > 0 ? (
                            <div className="mt-6">
                              <h3 className="text-lg font-medium mb-3">Saved Custom Texts</h3>
                              <div className="space-y-3">
                                {customTexts.map((text, index) => (
                                  <div key={index} className="bg-muted/20 p-4 rounded-lg relative">
                                    <p className="text-sm line-clamp-2 pr-20">{text}</p>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                        className="h-6 w-6 hover:bg-background/70"
                                        onClick={() => handleEditCustomText(index)}
                                      >
                                        <Edit3 className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 hover:bg-destructive/10 text-destructive"
                                      onClick={() => handleDeleteCustomText(index)}
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                    </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 mt-4 bg-muted/10 rounded-lg border border-dashed">
                              <Keyboard className="h-10 w-10 text-muted-foreground/40 mb-3" />
                              <p className="text-center text-muted-foreground">
                                No custom texts saved yet.<br />
                                Add your first custom text above.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
        
        {/* Keyboard shortcuts dialog */}
        {keyboardShortcutsVisible && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="w-full max-w-md bg-card border rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setKeyboardShortcutsVisible(false)}
                >
                  ×
                </Button>
      </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">General</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Show/hide shortcuts</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs">?</kbd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Close dialogs</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Esc</kbd>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Profile</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Save profile changes</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Custom Text</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Save custom text</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+Enter</kbd>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full mt-6"
                onClick={() => setKeyboardShortcutsVisible(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    );
}

// Wrapper component that provides ThemeProvider
export default function Profile() {
  return (
    <ThemeProvider>
      <ProfileContent />
    </ThemeProvider>
  );
} 