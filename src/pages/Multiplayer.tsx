import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MultiplayerModal } from "@/components/multiplayer/MultiplayerModal";
import { Users, Trophy, Zap, Swords, UserRoundPlus, Link2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAnimations } from "@/context/AnimationsContext";
import { motion } from "framer-motion";

const Multiplayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { animationsEnabled } = useAnimations();
  
  // Simulate getting username from local storage or user context
  useEffect(() => {
    const storedUsername = localStorage.getItem("typingUsername") || "";
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleCreateGame = () => {
    if (!username) {
      toast({
        title: "Username Required",
        description: "Please enter a username to create a game.",
        variant: "destructive"
      });
      return;
    }
    
    // Save username to local storage
    localStorage.setItem("typingUsername", username);
    
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleJoinGame = () => {
    if (!username) {
      toast({
        title: "Username Required",
        description: "Please enter a username to join a game.",
        variant: "destructive"
      });
      return;
    }
    
    if (!gameId) {
      toast({
        title: "Game ID Required",
        description: "Please enter a valid game ID to join.",
        variant: "destructive"
      });
      return;
    }
    
    // Save username to local storage
    localStorage.setItem("typingUsername", username);
    
    setIsJoining(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsJoining(false);
    setIsCreating(false);
  };

  const copyInviteLink = (id: string) => {
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/#/multiplayer?gameId=${id}`;
    
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toast({
          title: "Invite Link Copied",
          description: "Share this link with friends to join your game!"
        });
      })
      .catch(() => {
        toast({
          title: "Failed to Copy",
          description: "Please copy the game ID manually.",
          variant: "destructive"
        });
      });
  };

  // Extract game ID from URL query params if present
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const gameIdParam = hashParams.get('gameId');
    
    if (gameIdParam) {
      setGameId(gameIdParam);
      // Automatically focus the join game section
      const joinTab = document.getElementById('join-tab');
      if (joinTab) {
        joinTab.click();
      }
    }
  }, []);

  // Animation variants
  const containerVariants = animationsEnabled ? {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  } : {};
  
  const itemVariants = animationsEnabled ? {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  } : {};

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <main className="flex-grow py-16 pt-24 container px-4 sm:px-6">
          {/* Page header */}
          <motion.div 
            className="mb-10 max-w-3xl mx-auto text-center"
            initial={animationsEnabled ? { opacity: 0, y: 20 } : {}}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-3 py-1 mb-4 bg-primary/10">
              <Users className="w-3 h-3 mr-1" />
              <span>Multiplayer Mode</span>
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Challenge Your Friends</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compete in real-time typing races against friends or players from around the world. 
              Create a private match or join an existing game to show off your typing skills!
            </p>
          </motion.div>
          
          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create">Create Game</TabsTrigger>
                <TabsTrigger value="join" id="join-tab">Join Game</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserRoundPlus className="h-5 w-5" />
                          Create a New Game
                        </CardTitle>
                        <CardDescription>
                          Set up a multiplayer typing race and invite friends to join.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="username" className="text-sm font-medium">
                            Your Display Name
                          </label>
                          <Input 
                            id="username" 
                            placeholder="Enter your name" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={handleCreateGame}
                        >
                          <Swords className="mr-2 h-4 w-4" />
                          Create New Game
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Alert className="bg-primary/5 border-primary/20">
                      <Zap className="h-4 w-4" />
                      <AlertTitle>Game Features</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Race against up to 4 players simultaneously</li>
                          <li>Real-time progress tracking</li>
                          <li>Multiple difficulty levels</li>
                          <li>Customizable game settings</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="join">
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Link2 className="h-5 w-5" />
                          Join an Existing Game
                        </CardTitle>
                        <CardDescription>
                          Enter a game ID to join a friend's typing race.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="display-name" className="text-sm font-medium">
                            Your Display Name
                          </label>
                          <Input 
                            id="display-name" 
                            placeholder="Enter your name" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="game-id" className="text-sm font-medium">
                            Game ID
                          </label>
                          <Input 
                            id="game-id" 
                            placeholder="Enter game ID" 
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={handleJoinGame}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Join Game
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Alert className="bg-accent/5 border-accent/20">
                      <Trophy className="h-4 w-4" />
                      <AlertTitle>Multiplayer Benefits</AlertTitle>
                      <AlertDescription>
                        <p className="mt-2">
                          Competing against others is one of the best ways to improve your typing speed. 
                          The friendly competition creates just enough pressure to push your limits!
                        </p>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-10" />
            
            <motion.div
              className="text-center py-4"
              initial={animationsEnabled ? { opacity: 0 } : {}}
              animate={animationsEnabled ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-2">How It Works</h3>
              <p className="text-muted-foreground">
                Create a game, share the link with friends, and start typing when everyone's ready. 
                See who can type the fastest and most accurately in real-time!
              </p>
            </motion.div>
          </div>
        </main>
        
        {isModalOpen && (
          <MultiplayerModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isCreating={isCreating}
            isJoining={isJoining}
            gameId={isJoining ? gameId : undefined}
            username={username}
            onCopyInvite={copyInviteLink}
          />
        )}
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Multiplayer; 