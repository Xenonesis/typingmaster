import { useState, useEffect } from "react";
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
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getProfile, upsertProfile, UserProfile } from "@/services/userService";
import { RecentAchievements } from "@/components/profile/RecentAchievements";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Settings, Calendar, BarChart, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Main Profile component without ThemeProvider
function ProfileContent() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [themePreference, setThemePreference] = useState<string>(() => 
    localStorage.getItem("theme") || "system"
  );
  
  // Profile state
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    user_id: user?.id || '',
    username: '',
    full_name: '',
    contact_number: '',
    user_type: 'student',
    university: '',
    class_name: '',
    university_address: '',
    company_name: '',
    designation: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Calculate profile completion percentage
  useEffect(() => {
    if (profile) {
      const fields = [
        'username', 
        'full_name', 
        'contact_number',
        ...(profile.user_type === 'student' 
          ? ['university', 'class_name', 'university_address'] 
          : ['company_name', 'designation'])
      ];
      
      const filledFields = fields.filter(field => 
        profile[field as keyof typeof profile] && 
        String(profile[field as keyof typeof profile]).trim() !== ''
      );
      
      setCompletionPercentage(Math.round((filledFields.length / fields.length) * 100));
    }
  }, [profile]);

  // Initialize theme when component mounts
  useEffect(() => {
    // Apply theme based on preference
    if (themePreference === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    } else {
      // Make sure we only set valid themes
      const validThemes = ["light", "dark", "ocean", "forest", "sunset", "midnight"];
      if (validThemes.includes(themePreference)) {
        setTheme(themePreference as "light" | "dark" | "ocean" | "forest" | "sunset" | "midnight");
      } else {
        setTheme("light");
      }
    }
  }, [themePreference, setTheme]);
  
  // Fetch user profile data
  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      getProfile(user.id)
        .then(data => {
          if (data) {
            // Existing profile found, update state
            setProfile(prev => ({
              ...prev,
              ...data
            }));
          } else {
            // No profile found, initialize with default values and the user ID
            setProfile(prev => ({
              ...prev,
              user_id: user.id
            }));
            console.log("No existing profile found, initialized with defaults");
          }
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data. " + (error.message || ''),
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, toast]);

  // Sync local typing statistics with database when profile is viewed
  useEffect(() => {
    if (user && user.id) {
      const syncStats = async () => {
        try {
          const { syncUserStatistics } = await import('@/services/userService');
          const result = await syncUserStatistics(user.id);
          
          if (result && result.synced > 0) {
            // Refresh profile data if we synced new statistics
            getProfile(user.id)
              .then(data => {
                if (data) {
                  setProfile(prev => ({
                    ...prev,
                    ...data
                  }));
                  
                  toast({
                    title: "Statistics synchronized",
                    description: `${result.synced} test results synchronized with your profile.`
                  });
                }
              })
              .catch(error => {
                console.error("Error refreshing profile after sync:", error);
              });
          }
        } catch (error) {
          console.error("Error syncing user statistics:", error);
        }
      };
      
      syncStats();
    }
  }, [user, toast]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle user type change
  const handleUserTypeChange = (value: string) => {
    setProfile(prev => ({
      ...prev,
      user_type: value as 'student' | 'professional'
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle theme preference change
  const handleThemeChange = (value: string) => {
    setThemePreference(value);
    localStorage.setItem("theme", value);
    // Apply theme based on preference
    if (value === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    } else {
      // Make sure we only set valid themes
      const validThemes = ["light", "dark", "ocean", "forest", "sunset", "midnight"];
      if (validThemes.includes(value)) {
        setTheme(value as "light" | "dark" | "ocean" | "forest" | "sunset" | "midnight");
      } else {
        setTheme("light");
      }
    }
  };
  
  // Save profile
  const handleSaveProfile = async () => {
    if (!user || !user.id) return;
    
    setLoading(true);
    try {
      const savedProfile = await upsertProfile({
        ...profile,
        user_id: user.id
      });
      
      setProfile(prev => ({
        ...prev,
        ...savedProfile
      }));
      
      toast({
        title: "Profile Saved",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. " + (error.message || ''),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect after sign out
      window.location.hash = "#/login";
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile.full_name) {
      return profile.full_name.split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    }
    if (profile.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 pt-24 pb-20">
          <Card className="w-full max-w-md shadow-card border-border/30">
            <CardHeader className="bg-background/50">
              <CardTitle className="text-center">Authentication Required</CardTitle>
              <CardDescription className="text-center">
                Please log in to view and manage your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <Button 
                onClick={() => window.location.hash = "#/login"} 
                className="w-full"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.hash = "#/signup"} 
                className="w-full"
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <Header />
      <main className="flex-grow flex flex-col p-6 pt-24 pb-20">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Profile Header */}
            <Card className="col-span-1 lg:col-span-12 shadow-card border-border/30">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src="" alt={profile.full_name || profile.username || user.email} />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold">
                      {profile.full_name || profile.username || user.email}
                    </h1>
                    <p className="text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span>{user.email}</span>
                      {profile.user_type && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="capitalize">{profile.user_type}</span>
                        </>
                      )}
                    </p>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="text-sm">Profile completion: {completionPercentage}%</span>
                        {completionPercentage < 100 && (
                          <Badge variant="outline" className="text-xs bg-primary/5">
                            Incomplete
                          </Badge>
                        )}
                        {completionPercentage === 100 && (
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500">
                            Complete
                          </Badge>
                        )}
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1 text-sm"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sidebar - Quick Stats */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <Card className="shadow-card border-border/30">
                <CardHeader className="bg-background/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart className="h-5 w-5 text-primary" />
                    Typing Performance
                  </CardTitle>
                  <CardDescription>
                    Your typing statistics at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-border/30">
                      <h3 className="text-sm font-medium text-primary/80">Average WPM</h3>
                      <p className="text-3xl font-bold mt-1">{profile.average_wpm || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-border/30">
                      <h3 className="text-sm font-medium text-primary/80">Best WPM</h3>
                      <p className="text-3xl font-bold mt-1">{profile.best_wpm || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-border/30 col-span-2">
                      <h3 className="text-sm font-medium text-primary/80">Tests Completed</h3>
                      <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold mt-1">{profile.total_tests || 0}</p>
                        {profile.total_tests > 0 && (
                          <Link to="/stats" className="text-xs text-primary underline underline-offset-2">
                            View history
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link to="/stats">
                      <Button variant="outline" className="w-full">
                        View Detailed Stats
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <RecentAchievements />
            </div>
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-8">
              <Card className="shadow-card border-border/30">
                <Tabs defaultValue="personal" onValueChange={setActiveTab} className="w-full">
                  <CardHeader className="bg-background/50 pb-2">
                    <TabsList className="w-full">
                      <TabsTrigger value="personal" className="flex items-center gap-1 flex-1">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Personal Info</span>
                        <span className="sm:hidden">Info</span>
                      </TabsTrigger>
                      <TabsTrigger value="professional" className="flex items-center gap-1 flex-1">
                        <Briefcase className="h-4 w-4" />
                        <span className="hidden sm:inline">Professional Details</span>
                        <span className="sm:hidden">Details</span>
                      </TabsTrigger>
                      <TabsTrigger value="preferences" className="flex items-center gap-1 flex-1">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Preferences</span>
                        <span className="sm:hidden">Prefs</span>
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <TabsContent value="personal" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user.email || ''}
                          disabled
                          className="bg-muted/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={profile.username || ''}
                          onChange={handleChange}
                          placeholder="Enter your username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={profile.full_name || ''}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input
                          id="contact_number"
                          name="contact_number"
                          value={profile.contact_number || ''}
                          onChange={handleChange}
                          placeholder="Enter your contact number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>User Type</Label>
                        <RadioGroup
                          value={profile.user_type || 'student'}
                          onValueChange={handleUserTypeChange}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="student" />
                            <Label htmlFor="student">Student</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="professional" id="professional" />
                            <Label htmlFor="professional">Professional</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="professional" className="mt-0 space-y-4">
                      {profile.user_type === 'student' ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="class_name">Class</Label>
                            <Input
                              id="class_name"
                              name="class_name"
                              value={profile.class_name || ''}
                              onChange={handleChange}
                              placeholder="Enter your class"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="university">University Name</Label>
                            <Input
                              id="university"
                              name="university"
                              value={profile.university || ''}
                              onChange={handleChange}
                              placeholder="Enter your university name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="university_address">University Address</Label>
                            <Input
                              id="university_address"
                              name="university_address"
                              value={profile.university_address || ''}
                              onChange={handleChange}
                              placeholder="Enter your university address"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                              id="company_name"
                              name="company_name"
                              value={profile.company_name || ''}
                              onChange={handleChange}
                              placeholder="Enter your company name"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                              id="designation"
                              name="designation"
                              value={profile.designation || ''}
                              onChange={handleChange}
                              placeholder="Enter your designation"
                            />
                          </div>
                        </>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="preferences" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme Preference</Label>
                        <Select
                          value={themePreference}
                          onValueChange={handleThemeChange}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </CardContent>
                  
                  <CardFooter className="px-6 pb-6">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </CardFooter>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
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
