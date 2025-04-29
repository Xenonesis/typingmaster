import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, UserCircle, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserButton() {
  const { user, signOut } = useAuth();
  const { guestUser, isGuest, clearGuestData } = useGuest();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later.",
      });
    }
  };

  const handleClearGuestData = () => {
    clearGuestData();
    toast({
      title: "Guest data cleared",
      description: "All your local data has been removed.",
    });
    navigate('/');
  };

  // Show Sign In/Sign Up buttons if neither authenticated nor guest
  if (!user && !isGuest) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/login')}
          className="text-sm"
        >
          Sign In
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => navigate('/signup')}
          className="text-sm"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  // Handle authenticated user
  if (user) {
    // Extract first letter of email for avatar
    const emailFirstLetter = user.email?.[0]?.toUpperCase() || 'U';
    
    // Get username from email (remove @domain.com)
    const username = user.email?.split('@')[0] || 'User';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={username} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {emailFirstLetter}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => navigate('/profile')}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 focus:text-red-500" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Handle guest user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              G
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">Guest User</p>
          <p className="text-xs text-muted-foreground truncate flex items-center">
            <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
            Data stored locally only
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => navigate('/profile')}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Guest Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => navigate('/login')}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Create Account</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-500 focus:text-red-500" 
          onClick={handleClearGuestData}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Clear Guest Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 