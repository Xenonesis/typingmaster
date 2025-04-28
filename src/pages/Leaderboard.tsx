import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Info } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TestResultsData } from "@/components/TestResults";
import { format } from "date-fns";

// Mock data for leaderboards
const globalLeaderboard = [
  { position: 1, name: "speedDemon", wpm: 145, accuracy: 99.2, date: "2023-10-15" },
  { position: 2, name: "typeNinja", wpm: 138, accuracy: 98.7, date: "2023-10-12" },
  { position: 3, name: "keyboardWarrior", wpm: 134, accuracy: 97.8, date: "2023-10-14" },
  { position: 4, name: "swiftFingers", wpm: 128, accuracy: 98.1, date: "2023-10-10" },
  { position: 5, name: "typographerPro", wpm: 125, accuracy: 97.5, date: "2023-10-13" },
  { position: 6, name: "quickTypist", wpm: 122, accuracy: 96.9, date: "2023-10-11" },
  { position: 7, name: "keyMaster", wpm: 118, accuracy: 97.2, date: "2023-10-09" },
  { position: 8, name: "typestar", wpm: 115, accuracy: 96.5, date: "2023-10-08" },
  { position: 9, name: "rapidTyper", wpm: 112, accuracy: 96.1, date: "2023-10-07" },
  { position: 10, name: "keyWhiz", wpm: 110, accuracy: 95.8, date: "2023-10-06" },
];

const dailyLeaderboard = [
  { position: 1, name: "flashFingers", wpm: 132, accuracy: 97.8, date: "2023-10-15" },
  { position: 2, name: "speedDemon", wpm: 129, accuracy: 98.2, date: "2023-10-15" },
  { position: 3, name: "typeWhisperer", wpm: 125, accuracy: 96.5, date: "2023-10-15" },
  { position: 4, name: "keyMaster", wpm: 119, accuracy: 97.1, date: "2023-10-15" },
  { position: 5, name: "swiftKeys", wpm: 117, accuracy: 96.8, date: "2023-10-15" },
];

export default function Leaderboard() {
  const [personalBests, setPersonalBests] = useState<TestResultsData[]>([]);
  
  // Load personal best scores from localStorage
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
    
    loadPersonalBests();
    
    // Listen for storage changes in case scores are updated in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'typingPersonalBests') {
        loadPersonalBests();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
                    <CardTitle>Your Personal Best</CardTitle>
                    <CardDescription>Track your progress and see how you improve over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {personalBests.length > 0 ? (
                      <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                        <Table>
                          <TableHeader className="bg-background/70">
                            <TableRow>
                              <TableHead className="w-16">Rank</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">WPM</TableHead>
                              <TableHead className="text-right">Accuracy</TableHead>
                              <TableHead className="text-right">Time</TableHead>
                              <TableHead className="text-right">Difficulty</TableHead>
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
                    ) : (
                      <div className="text-center py-8 flex flex-col items-center">
                        <Info className="h-8 w-8 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No scores yet</h3>
                        <p className="text-muted-foreground mb-4">Complete some typing tests to see your results here!</p>
                        <Button 
                          onClick={() => window.location.href = '/'} 
                          className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow transition-all"
                        >
                          Take a Test
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="global" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle>Global Top Performers</CardTitle>
                    <CardDescription>The fastest typists from around the world</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                      <Table>
                        <TableHeader className="bg-background/70">
                          <TableRow>
                            <TableHead className="w-16">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">WPM</TableHead>
                            <TableHead className="text-right">Accuracy</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {globalLeaderboard.map((entry) => (
                            <TableRow key={entry.position} className="hover:bg-background/40 transition-colors">
                              <TableCell className="font-medium">
                                {entry.position === 1 ? (
                                  <div className="flex items-center">
                                    <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                                    {entry.position}
                                  </div>
                                ) : entry.position === 2 ? (
                                  <div className="flex items-center">
                                    <Medal className="h-5 w-5 mr-1 text-gray-400" />
                                    {entry.position}
                                  </div>
                                ) : entry.position === 3 ? (
                                  <div className="flex items-center">
                                    <Award className="h-5 w-5 mr-1 text-amber-700" />
                                    {entry.position}
                                  </div>
                                ) : (
                                  entry.position
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="font-medium">{entry.name}</span>
                                  {entry.wpm > 130 && (
                                    <Badge className="ml-2 bg-gradient-to-r from-primary to-accent text-white">Pro</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-bold">{entry.wpm}</TableCell>
                              <TableCell className="text-right">{entry.accuracy}%</TableCell>
                              <TableCell className="text-right text-muted-foreground">{entry.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="daily" className="animate-scale-in">
                <Card className="shadow-card border-border/30 overflow-hidden">
                  <CardHeader className="bg-background/50">
                    <CardTitle>Today's Top Performers</CardTitle>
                    <CardDescription>Daily challenge leaderboard - Resets every 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="rounded-xl overflow-hidden shadow-soft border border-border/30">
                      <Table>
                        <TableHeader className="bg-background/70">
                          <TableRow>
                            <TableHead className="w-16">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">WPM</TableHead>
                            <TableHead className="text-right">Accuracy</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dailyLeaderboard.map((entry) => (
                            <TableRow key={entry.position} className="hover:bg-background/40 transition-colors">
                              <TableCell className="font-medium">
                                {entry.position === 1 ? (
                                  <div className="flex items-center">
                                    <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                                    {entry.position}
                                  </div>
                                ) : entry.position === 2 ? (
                                  <div className="flex items-center">
                                    <Medal className="h-5 w-5 mr-1 text-gray-400" />
                                    {entry.position}
                                  </div>
                                ) : entry.position === 3 ? (
                                  <div className="flex items-center">
                                    <Award className="h-5 w-5 mr-1 text-amber-700" />
                                    {entry.position}
                                  </div>
                                ) : (
                                  entry.position
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{entry.name}</div>
                              </TableCell>
                              <TableCell className="text-right font-bold">{entry.wpm}</TableCell>
                              <TableCell className="text-right">{entry.accuracy}%</TableCell>
                              <TableCell className="text-right text-muted-foreground">Today</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="friends" className="animate-scale-in">
                <Card className="shadow-card border-border/30 flex flex-col items-center justify-center py-16">
                  <div className="text-center max-w-md">
                    <h3 className="text-2xl font-semibold mb-4">Connect with friends</h3>
                    <p className="text-muted-foreground mb-8">
                      Create an account to add friends and compete directly with people you know.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow transition-all">
                        Sign Up
                      </Button>
                      <Button variant="outline" className="hover:border-primary/50 transition-all">
                        Login
                      </Button>
                    </div>
                  </div>
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