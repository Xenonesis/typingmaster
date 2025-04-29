import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, UserCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  returnPath: string;
}

export function AuthModal({ isOpen, onClose, feature, returnPath }: AuthModalProps) {
  const { createGuestUser } = useGuest();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { from: returnPath } });
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup', { state: { from: returnPath } });
  };

  const handleContinueAsGuest = () => {
    createGuestUser();
    onClose();
    
    toast({
      title: "Continuing as guest",
      description: "Your data will be stored locally on this device.",
    });
    
    navigate(returnPath);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to sign in or continue as a guest to use the {feature} feature.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-4">
            <Button onClick={handleLogin} className="flex items-center justify-between">
              <span>Sign in with your account</span>
              <UserCircle className="ml-2 h-4 w-4" />
            </Button>
            
            <Button onClick={handleSignup} variant="outline" className="flex items-center justify-between">
              <span>Create a new account</span>
              <UserPlus className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="mx-4 flex-shrink text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            
            <Button 
              onClick={handleContinueAsGuest} 
              variant="secondary"
              className="flex items-center justify-between"
            >
              <span>Continue as guest</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <p className="text-xs text-muted-foreground text-center">
            Guest data is stored only on this device and may be lost if you clear your browser data.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 