import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Info, Loader2, Globe, Calendar, Clock, Users, UserPlus } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TestResultsData } from "@/components/TestResults";
import { format } from "date-fns";
import { getLeaderboard, getTypingStats } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const { user } = useAuth();
  const [personalBests, setPersonalBests] = useState<TestResultsData[]>([]);
  
  // Fetch global leaderboard from Supabase
  const { data: globalLeaderboard, isLoading: isLoadingGlobal } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      return await getLeaderboard(20);
    },
  });

  // Fetch personal stats from Supabase if user is logged in
  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getTypingStats(user.id, 10);
    },
    enabled: !!user?.id,
  });
  
  // Load personal best scores from localStorage for not logged-in users
  useEffect(() => {
    const loadPersonalBests = () => {
      try {
        const savedBests = localStorage.getItem('typingPersonalBests');
        if (savedBests) {
          const parsedBests = JSON.parse(savedBests) as TestResultsData[];
          // Sort by WPM in descending order
          parsedBests.sort((a, b) => b.wpm - a.wpm);
          setPersonalBests(parsedBests);
        }
      } catch (error) {
        console.error('Error loading personal bests:', error);
        setPersonalBests([]);
      }
    };
    
    if (!user) {
      loadPersonalBests();
    
      // Listen for storage changes in case scores are updated in another tab
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'typingPersonalBests') {
          loadPersonalBests();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [user]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <main className="flex-grow flex flex-col p-6 pt-24 pb-20">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8 text-yellow-500" />
                <h1 className="text-3xl md:text-4xl font-bold gradient-heading">Leaderboard</h1>
              </div>
              <p className="text-muted-foreground mt-2 md:mt-0">Compete with the best typists worldwide</p>
            </div>
            
            <Tabs defaultValue="personal" className="animate-fade-in">
              <TabsList className="mb-6 p-1 bg-background/80 backdrop-blur-sm border border-border/30 shadow-soft rounded-lg">
                <TabsTrigger value="personal" className="rounded-md">Your Scores</TabsTrigger>
                <TabsTrigger value="global" className="rounded-md">Global Rankings</TabsTrigger>
                <TabsTrigger value="daily" className="rounded-md">Daily Challenge</TabsTrigger>
                <TabsTrigger value="friends" className="rounded-md">Friends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Your Personal Bests
                    </CardTitle>
                    <CardDescription>
                      Track your typing progress and view your best scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {user ? (
                      isLoadingUserStats ? (
                        <div className="text-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground">Loading your typing stats...</p>
                        </div>
                      ) : userStats && userStats.length > 0 ? (
                        <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                          <Table>
                            <TableHeader className="bg-background/70">
                              <TableRow>
                                <TableHead className="w-16">Rank</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">WPM</TableHead>
                                <TableHead className="text-right">Accuracy</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                                <TableHead className="text-right">Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userStats.map((result, index) => (
                                <TableRow key={result.id} className="hover:bg-background/40 transition-colors">
                                  <TableCell className="font-medium">
                                    {index === 0 ? (
                                      <div className="flex items-center">
                                        <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                                        {index + 1}
                                      </div>
                                    ) : index === 1 ? (
                                      <div className="flex items-center">
                                        <Medal className="h-5 w-5 mr-1 text-gray-400" />
                                        {index + 1}
                                      </div>
                                    ) : index === 2 ? (
                                      <div className="flex items-center">
                                        <Award className="h-5 w-5 mr-1 text-amber-700" />
                                        {index + 1}
                                      </div>
                                    ) : (
                                      index + 1
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(result.date), 'MMM d, yyyy')}
                                  </TableCell>
                                  <TableCell className="text-right font-bold">{result.wpm}</TableCell>
                                  <TableCell className="text-right">{(result.accuracy * 100).toFixed(1)}%</TableCell>
                                  <TableCell className="text-right">{result.duration}s</TableCell>
                                  <TableCell className="text-right capitalize">{result.test_type}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Info className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">No Tests Completed Yet</h3>
                          <p className="text-muted-foreground max-w-md mx-auto mb-4">
                            Take a typing test to start tracking your progress and see your results here.
                          </p>
                          <Button onClick={() => window.location.hash = "#/typing-test"}>
                            Start Typing Test
                          </Button>
                        </div>
                      )
                    ) : (
                      // Not logged in - show localStorage results or login prompt
                      personalBests.length > 0 ? (
                        <div>
                          <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                            <Table>
                              <TableHeader className="bg-background/70">
                                <TableRow>
                                  <TableHead className="w-16">Rank</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead className="text-right">WPM</TableHead>
                                  <TableHead className="text-right">Accuracy</TableHead>
                                  <TableHead className="text-right">Time</TableHead>
                                  <TableHead className="text-right">Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {personalBests.map((result, index) => (
                                  <TableRow key={index} className="hover:bg-background/40 transition-colors">
                                    <TableCell className="font-medium">
                                      {index === 0 ? (
                                        <div className="flex items-center">
                                          <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                                          {index + 1}
                                        </div>
                                      ) : index === 1 ? (
                                        <div className="flex items-center">
                                          <Medal className="h-5 w-5 mr-1 text-gray-400" />
                                          {index + 1}
                                        </div>
                                      ) : index === 2 ? (
                                        <div className="flex items-center">
                                          <Award className="h-5 w-5 mr-1 text-amber-700" />
                                          {index + 1}
                                        </div>
                                      ) : (
                                        index + 1
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {result.date ? format(new Date(result.date), 'MMM d, yyyy') : 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">{result.wpm}</TableCell>
                                    <TableCell className="text-right">{result.accuracy}%</TableCell>
                                    <TableCell className="text-right">{result.time}s</TableCell>
                                    <TableCell className="text-right capitalize">{result.difficulty}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex justify-center mt-6">
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 p-4 rounded-lg max-w-lg">
                              <p className="text-sm">
                                <strong>Sign in to save your scores!</strong> Create an account to track your progress across devices and compete on the global leaderboard.
                              </p>
                              <div className="mt-3 flex gap-2">
                                <Button size="sm" variant="default" onClick={() => window.location.hash = "#/signup"}>
                                  Sign Up
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => window.location.hash = "#/login"}>
                                  Log In
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Info className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">No Tests Completed Yet</h3>
                          <p className="text-muted-foreground max-w-md mx-auto mb-4">
                            Take a typing test to start tracking your progress and see your results here.
                          </p>
                          <Button onClick={() => window.location.hash = "#/typing-test"}>
                            Start Typing Test
                          </Button>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="global" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Global Leaderboard
                    </CardTitle>
                    <CardDescription>
                      The fastest typists from around the world
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoadingGlobal ? (
                      <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading leaderboard data...</p>
                      </div>
                    ) : globalLeaderboard && globalLeaderboard.length > 0 ? (
                      <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                        <Table>
                          <TableHeader className="bg-background/70">
                            <TableRow>
                              <TableHead className="w-16">Rank</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead className="text-right">Best WPM</TableHead>
                              <TableHead className="text-right">Tests</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {globalLeaderboard.map((entry, index) => (
                              <TableRow key={entry.id} className="hover:bg-background/40 transition-colors">
                                <TableCell className="font-medium">
                                  {index === 0 ? (
                                    <div className="flex items-center">
                                      <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                                      {index + 1}
                                    </div>
                                  ) : index === 1 ? (
                                    <div className="flex items-center">
                                      <Medal className="h-5 w-5 mr-1 text-gray-400" />
                                      {index + 1}
                                    </div>
                                  ) : index === 2 ? (
                                    <div className="flex items-center">
                                      <Award className="h-5 w-5 mr-1 text-amber-700" />
                                      {index + 1}
                                    </div>
                                  ) : (
                                    index + 1
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage 
                                        src={entry.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${entry.username}`} 
                                        alt={entry.username || "User"} 
                                      />
                                      <AvatarFallback>
                                        {(entry.username || "U")[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{entry.username || "Anonymous User"}</span>
                                    {entry.best_wpm > 130 && (
                                      <Badge className="ml-2 bg-gradient-to-r from-primary to-accent text-white">Pro</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-bold">{entry.best_wpm}</TableCell>
                                <TableCell className="text-right">{entry.total_tests}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Info className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No leaderboard data available yet.</p>
                      </div>
                    )}
                    
                    {!user && (
                      <div className="flex justify-center mt-6">
                        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-lg max-w-lg">
                          <p className="text-sm">
                            <strong>Join the competition!</strong> Create an account to appear on the global leaderboard and track your worldwide ranking.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="default" onClick={() => window.location.hash = "#/signup"}>
                              Sign Up
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => window.location.hash = "#/login"}>
                              Log In
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="daily" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Daily Challenge
                    </CardTitle>
                    <CardDescription>
                      Complete today's challenge and compare your score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 text-center py-10">
                    <Clock className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Daily typing challenges are coming soon. Check back later!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="friends" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Friends Leaderboard
                    </CardTitle>
                    <CardDescription>
                      Compete with your friends
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 text-center py-10">
                    <UserPlus className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Friend connections and social features are coming soon!
                    </p>
                    {!user && (
                      <Button onClick={() => window.location.hash = "#/signup"}>
                        Create Account
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
} 