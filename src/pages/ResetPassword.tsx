import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuthData } = useAuth();

  // Clear any lingering redirect URLs on component mount
  useEffect(() => {
    // Clear all Supabase-related data to prevent unwanted redirects
    clearAuthData();
    
    // Deliberately avoiding any URL parameter checking to prevent unwanted redirects
    // Just handling this as a standalone page
  }, [clearAuthData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please check your password confirmation.",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password should be at least 6 characters.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clear any redirect URLs before updating password
      clearAuthData();
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message,
        });
      } else {
        // Clear any redirect URLs 
        clearAuthData();
        
        setIsSuccess(true);
        toast({
          title: "Password reset successful",
          description: "Your password has been updated.",
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          // Use hard navigation to ensure clean state
          window.location.href = '/#/login';
        }, 2000);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header />
      <div className="container max-w-screen-xl mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[70vh]"
        >
          <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-background/30 backdrop-blur-lg rounded-xl border border-border/30 shadow-sm">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Reset Your Password</h1>
              <p className="text-sm text-muted-foreground">
                {isSuccess 
                  ? "Password reset successful. Redirecting to login..." 
                  : "Enter your new password below."}
              </p>
            </div>
            
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 