import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, clearAuthData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear auth data on component mount
  useEffect(() => {
    clearAuthData();
  }, [clearAuthData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clear auth data before password reset
      clearAuthData();
      
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message,
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for the reset link.",
        });
        
        // Clear auth data after successful reset request
        clearAuthData();
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
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-background/30 backdrop-blur-lg rounded-xl border border-border/30 shadow-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-2" 
        onClick={() => navigate('/login')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to login
      </Button>
      
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-sm text-muted-foreground">
          {isSuccess 
            ? "Check your email for a reset link." 
            : "Enter your email and we'll send you a reset link."}
        </p>
      </div>
      
      {isSuccess ? (
        <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <span>Reset link sent! Check your email.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Remember your password?</span>{' '}
        <Button 
          variant="link" 
          className="p-0" 
          onClick={() => navigate('/login')}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
} 