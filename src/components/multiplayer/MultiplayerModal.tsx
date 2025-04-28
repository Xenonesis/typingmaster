import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Copy, Share2, Users, Play, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MultiplayerProgress } from "./MultiplayerProgress";

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MultiplayerModal({ isOpen, onClose }: MultiplayerModalProps) {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("typingUsername") || "");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [raceStarted, setRaceStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [raceFinished, setRaceFinished] = useState(false);
  
  // Mock data for participants
  const [participants, setParticipants] = useState([
    { 
      id: 1, 
      name: "User1", 
      avatar: "", 
      status: "ready" as const, 
      progress: 0,
      wpm: 0,
      accuracy: 0
    },
    { 
      id: 2, 
      name: "User2", 
      avatar: "", 
      status: "waiting" as const,
      progress: 0,
      wpm: 0,
      accuracy: 0
    },
    {
      id: 3,
      name: username || "You",
      avatar: "",
      status: "ready" as const,
      progress: 0,
      wpm: 0,
      accuracy: 0,
      isCurrentUser: true
    }
  ]);
  
  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to create a room",
        variant: "destructive",
      });
      return;
    }
    
    // Save username in localStorage
    localStorage.setItem("typingUsername", username);
    
    // Update the current user's name in participants
    setParticipants(prev => 
      prev.map(p => p.isCurrentUser ? { ...p, name: username } : p)
    );
    
    // Mock room creation
    setIsCreatingRoom(true);
    setTimeout(() => {
      const generatedId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomId(generatedId);
      setIsCreatingRoom(false);
      toast({
        title: "Room Created!",
        description: `Your room ID is ${generatedId}. Share it with friends to join!`,
      });
    }, 1000);
  };
  
  const handleJoinRoom = () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to join a room",
        variant: "destructive",
      });
      return;
    }
    
    if (!joinRoomId.trim()) {
      toast({
        title: "Room ID Required",
        description: "Please enter a room ID to join",
        variant: "destructive",
      });
      return;
    }
    
    // Save username in localStorage
    localStorage.setItem("typingUsername", username);
    
    // Update the current user's name in participants
    setParticipants(prev => 
      prev.map(p => p.isCurrentUser ? { ...p, name: username } : p)
    );
    
    // Mock room joining
    setIsJoiningRoom(true);
    setTimeout(() => {
      setRoomId(joinRoomId);
      setIsJoiningRoom(false);
      toast({
        title: "Room Joined!",
        description: `You've joined room ${joinRoomId}!`,
      });
    }, 1000);
  };
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard",
    });
  };
  
  const startRace = () => {
    // Start countdown
    setCountdown(3);
    
    // Update participants status to racing
    setParticipants(prev => 
      prev.map(p => ({ ...p, status: "racing" as const }))
    );
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setRaceStarted(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Mock race progress updates
    if (!raceStarted) {
      const progressInterval = setInterval(() => {
        setParticipants(prev => {
          // Race is finished when at least one participant reaches 100%
          const isFinished = prev.some(p => p.progress >= 100);
          
          if (isFinished) {
            clearInterval(progressInterval);
            
            // Set race as finished after a short delay
            setTimeout(() => {
              setRaceFinished(true);
              setParticipants(prevParticipants => 
                prevParticipants.map(p => ({
                  ...p,
                  status: "finished" as const
                }))
              );
            }, 1000);
            
            return prev;
          }
          
          // Otherwise update progress randomly for each participant
          return prev.map(p => {
            // Faster progress for User1, medium for current user, slower for User2
            const progressIncrease = p.id === 1 
              ? Math.random() * 5 + 3
              : p.isCurrentUser 
                ? Math.random() * 4 + 2 
                : Math.random() * 3 + 1;
                
            const newProgress = Math.min(100, p.progress + progressIncrease);
            
            // Generate realistic WPM and accuracy
            const wpm = Math.floor(30 + (newProgress * 0.7));
            const accuracy = Math.floor(85 + (Math.random() * 10));
            
            return {
              ...p,
              progress: newProgress,
              wpm,
              accuracy
            };
          });
        });
      }, 500);
    }
  };
  
  const resetRace = () => {
    setRaceStarted(false);
    setRaceFinished(false);
    setCountdown(null);
    setParticipants(prev => 
      prev.map(p => ({
        ...p,
        progress: 0,
        wpm: 0,
        accuracy: 0,
        status: p.isCurrentUser ? "ready" as const : "waiting" as const
      }))
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={raceStarted ? "sm:max-w-lg" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Multiplayer Typing Race
          </DialogTitle>
          <DialogDescription>
            {raceStarted 
              ? "Race in progress! Type as fast as you can!" 
              : "Challenge your friends to a real-time typing competition!"}
          </DialogDescription>
        </DialogHeader>
        
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
            <div className="text-7xl font-bold animate-pulse">{countdown}</div>
          </div>
        )}
        
        {!roomId ? (
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Your Display Name</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateRoom} 
                  disabled={isCreatingRoom}
                >
                  {isCreatingRoom ? "Creating..." : "Create Room"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="join" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-username">Your Display Name</Label>
                <Input
                  id="join-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room-id">Room ID</Label>
                <Input
                  id="room-id"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  placeholder="Enter room ID (e.g., ABC123)"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleJoinRoom} 
                  disabled={isJoiningRoom}
                >
                  {isJoiningRoom ? "Joining..." : "Join Room"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : raceStarted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Room: {roomId}</span>
              </div>
              {raceFinished && (
                <Badge variant="outline" className="gap-1">
                  <span>Race Completed</span>
                </Badge>
              )}
            </div>
            
            <MultiplayerProgress 
              participants={participants}
              raceStarted={raceStarted}
              raceFinished={raceFinished}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-md flex justify-between items-center">
              <div>
                <Label className="text-sm text-muted-foreground">Room ID</Label>
                <p className="text-xl font-mono font-bold">{roomId}</p>
              </div>
              <Button variant="outline" size="icon" onClick={copyRoomId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Participants</Label>
              <div className="space-y-2">
                {participants
                  .filter(p => !p.isCurrentUser)
                  .map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{participant.name}</span>
                      </div>
                      <Badge variant={participant.status === "ready" ? "default" : "outline"}>
                        {participant.status === "ready" ? "Ready" : "Waiting"}
                      </Badge>
                    </div>
                  ))}
                
                <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md border border-primary/30">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={username} />
                      <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{username} (You)</span>
                  </div>
                  <Badge>Ready</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex sm:justify-between">
          {roomId && !raceStarted && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRoomId("")}>
                Back
              </Button>
              <Button variant="outline" onClick={() => window.open(`https://typespeedmaster.netlify.app/#/multiplayer?room=${roomId}`, '_blank')}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>
          )}
          
          {roomId && !raceStarted && (
            <Button onClick={startRace}>
              <Play className="h-4 w-4 mr-2" />
              Start Race
            </Button>
          )}
          
          {raceFinished && (
            <Button onClick={resetRace}>
              Restart Race
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 