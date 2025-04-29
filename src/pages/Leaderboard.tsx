import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Info, Loader2, Globe, Calendar, Clock, Users, UserPlus, RefreshCcw } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TestResultsData } from "@/components/TestResults";
import { format } from "date-fns";
import { getLeaderboard, getTypingStats, getDailyLeaderboard } from "@/services/userService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useTypingStats } from "@/context/TypingStatsContext";

export default function Leaderboard() {
  const { user } = useAuth();
  const [personalBests, setPersonalBests] = useState<TestResultsData[]>([]);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);
  const { stats, compareWithLeaderboard } = useTypingStats();
  const [performanceInsights, setPerformanceInsights] = useState<any>(null);
  
  // Fetch global leaderboard from Supabase
  const { data: globalLeaderboard, isLoading: isLoadingGlobal, refetch: refetchGlobal } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      setLastUpdated(new Date());
      return await getLeaderboard(20);
    },
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds if enabled
  });

  // Fetch personal stats from Supabase if user is logged in
  const { data: userStats, isLoading: isLoadingUserStats, refetch: refetchUserStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      setLastUpdated(new Date());
      return await getTypingStats(user.id, 10);
    },
    enabled: !!user?.id,
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds if enabled
  });
  
  // Add daily leaderboard fetch
  const { data: dailyLeaderboard, isLoading: isLoadingDaily, refetch: refetchDaily } = useQuery({
    queryKey: ['dailyLeaderboard'],
    queryFn: async () => {
      return await getDailyLeaderboard(15);
    },
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds if enabled
  });
  
  // Manual refresh function
  const handleManualRefresh = async () => {
    toast({
      title: "Refreshing leaderboard...",
      description: "Fetching the latest data from the server.",
    });
    
    if (user?.id) {
      await refetchUserStats();
    }
    await refetchGlobal();
    await refetchDaily();
    
    toast({
      title: "Leaderboard refreshed",
      description: "The latest data has been loaded.",
    });
  };
  
  // Subscribe to real-time updates from Supabase
  useEffect(() => {
    // Subscribe to changes on the typing_stats table
    const typingStatsSubscription = supabase
      .channel('typing_stats_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'typing_stats' 
        }, 
        (payload) => {
          // When a new record is inserted, invalidate the queries
          queryClient.invalidateQueries({ queryKey: ['userStats'] });
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          setLastUpdated(new Date());
      })
      .subscribe();
      
    // Subscribe to changes on the profiles table
    const profilesSubscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        (payload) => {
          // When a profile is updated, invalidate the leaderboard query
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          setLastUpdated(new Date());
      })
      .subscribe();
    
    return () => {
      // Clean up subscriptions
      supabase.removeChannel(typingStatsSubscription);
      supabase.removeChannel(profilesSubscription);
    };
  }, [queryClient]);
  
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

  // Load friends data (simulated for now)
  useEffect(() => {
    if (!user) return;
    
    const loadFriendsData = async () => {
      setIsLoadingFriends(true);
      try {
        // In a future implementation, this would be a real API call
        // For now, we'll filter the global leaderboard to get some sample data
        if (globalLeaderboard && globalLeaderboard.length > 0) {
          // Take 5 random entries from the global leaderboard as "friends"
          const randomFriends = [...globalLeaderboard]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(5, globalLeaderboard.length));
            
          // Add a simulated "friend" status field
          const friendsData = randomFriends.map(friend => ({
            ...friend,
            relation: Math.random() > 0.5 ? 'friend' : 'following',
            last_test_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          }));
          
          setFriends(friendsData);
        }
      } catch (error) {
        console.error('Error loading friends data:', error);
      } finally {
        setIsLoadingFriends(false);
      }
    };
    
    // Only load friends data when global leaderboard is available
    if (globalLeaderboard) {
      loadFriendsData();
    }
  }, [user, globalLeaderboard]);

  // Calculate performance insights when global leaderboard data is available
  useEffect(() => {
    if (globalLeaderboard && globalLeaderboard.length > 0) {
      const insights = compareWithLeaderboard(globalLeaderboard);
      setPerformanceInsights(insights);
    }
  }, [globalLeaderboard, compareWithLeaderboard]);

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
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <p className="text-muted-foreground">
                  Last updated: {format(lastUpdated, 'HH:mm:ss')}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleManualRefresh}
                    title="Refresh data manually"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={autoRefresh ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className="text-xs"
                  >
                    {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
                  </Button>
                </div>
              </div>
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
                      Global Rankings
                    </CardTitle>
                    <CardDescription>
                      Top typists from around the world
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {user && performanceInsights && (
                      <div className="mb-6 p-4 bg-background/80 rounded-lg border border-border/50 shadow-soft">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          Your Global Performance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="p-3 bg-background/50 rounded border border-border/30">
                            <p className="text-muted-foreground mb-1">Your Rank</p>
                            <p className="text-2xl font-bold">
                              {performanceInsights.userRank > 0 
                                ? `#${performanceInsights.userRank}` 
                                : 'Unranked'}
                            </p>
                          </div>
                          <div className="p-3 bg-background/50 rounded border border-border/30">
                            <p className="text-muted-foreground mb-1">Percentile</p>
                            <p className="text-2xl font-bold">
                              {performanceInsights.percentile > 0 
                                ? `${performanceInsights.percentile}%` 
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 bg-background/50 rounded border border-border/30">
                            <p className="text-muted-foreground mb-1">
                              {performanceInsights.wpmDifferenceToAverage >= 0 
                                ? 'Above Average By' 
                                : 'Below Average By'}
                            </p>
                            <p className="text-2xl font-bold">
                              {Math.abs(performanceInsights.wpmDifferenceToAverage)} WPM
                            </p>
                          </div>
                          <div className="p-3 bg-background/50 rounded border border-border/30">
                            <p className="text-muted-foreground mb-1">
                              {performanceInsights.userRank === 1 
                                ? 'You are #1!' 
                                : 'To Reach Next Rank'}
                            </p>
                            <p className="text-2xl font-bold">
                              {performanceInsights.userRank === 1 
                                ? '🏆' 
                                : `+${performanceInsights.improvementNeeded} WPM`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
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
                      Daily Challenge Leaderboard
                    </CardTitle>
                    <CardDescription>
                      Top performances from today - updated in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoadingDaily ? (
                      <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading daily challenge data...</p>
                      </div>
                    ) : dailyLeaderboard && dailyLeaderboard.length > 0 ? (
                      <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                        <Table>
                          <TableHeader className="bg-background/70">
                            <TableRow>
                              <TableHead className="w-16">Rank</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead className="text-right">WPM</TableHead>
                              <TableHead className="text-right">Accuracy</TableHead>
                              <TableHead className="text-right">Time</TableHead>
                              <TableHead className="text-right">Type</TableHead>
                              <TableHead className="text-right">Achieved At</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dailyLeaderboard.map((entry, index) => (
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
                                        alt={entry.username} 
                                      />
                                      <AvatarFallback>
                                        {(entry.username || "U")[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{entry.username}</span>
                                    {entry.wpm > 130 && (
                                      <Badge className="ml-2 bg-gradient-to-r from-primary to-accent text-white">Pro</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-bold">{entry.wpm}</TableCell>
                                <TableCell className="text-right">{(entry.accuracy * 100).toFixed(1)}%</TableCell>
                                <TableCell className="text-right">{entry.duration}s</TableCell>
                                <TableCell className="text-right capitalize">{entry.test_type}</TableCell>
                                <TableCell className="text-right">{format(new Date(entry.date), 'HH:mm:ss')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Info className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No Daily Challenge Data Yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-4">
                          Be the first to complete a typing test today and appear on the daily leaderboard!
                        </p>
                        <Button onClick={() => window.location.hash = "#/typing-test"}>
                          Take the Challenge
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="friends" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Friends & Following
                    </CardTitle>
                    <CardDescription>
                      Compare your progress with friends and users you follow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {!user ? (
                      <div className="text-center py-10">
                        <UserPlus className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">Sign In to Connect</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-4">
                          Create an account to connect with friends and follow other typists to see their progress.
                        </p>
                        <div className="flex justify-center gap-3">
                          <Button variant="default" onClick={() => window.location.hash = "#/signup"}>
                            Sign Up
                          </Button>
                          <Button variant="outline" onClick={() => window.location.hash = "#/login"}>
                            Log In
                          </Button>
                        </div>
                      </div>
                    ) : isLoadingFriends ? (
                      <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading friends data...</p>
                      </div>
                    ) : friends.length > 0 ? (
                      <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                        <Table>
                          <TableHeader className="bg-background/70">
                            <TableRow>
                              <TableHead>Friend</TableHead>
                              <TableHead className="text-right">Best WPM</TableHead>
                              <TableHead className="text-right">Tests</TableHead>
                              <TableHead className="text-right">Last Active</TableHead>
                              <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {friends.map((friend) => (
                              <TableRow key={friend.id} className="hover:bg-background/40 transition-colors">
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage 
                                        src={friend.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}`} 
                                        alt={friend.username || "Friend"} 
                                      />
                                      <AvatarFallback>
                                        {(friend.username || "F")[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{friend.username || "Anonymous User"}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-bold">{friend.best_wpm}</TableCell>
                                <TableCell className="text-right">{friend.total_tests}</TableCell>
                                <TableCell className="text-right">
                                  {format(new Date(friend.last_active || friend.last_test_date), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={friend.relation === 'friend' ? "default" : "secondary"}>
                                    {friend.relation === 'friend' ? 'Friend' : 'Following'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Users className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No Friends Yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-4">
                          You haven't connected with any friends yet. Start by adding friends to see their typing progress.
                        </p>
                        <Button variant="default">
                          Find Friends
                        </Button>
                      </div>
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