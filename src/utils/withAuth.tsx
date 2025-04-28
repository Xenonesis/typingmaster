import { ComponentType, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

/**
 * A higher-order component that redirects to the login page if the user is not authenticated.
 * 
 * @param WrappedComponent The component to wrap with authentication protection
 * @param redirectPath The path to redirect to if not authenticated (default: /login)
 * @returns A new component with authentication protection
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectPath = '/login'
) {
  // Return a new component with auth check
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
      // Wait until auth is loaded to avoid flash redirects
      if (!loading && !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        
        // Use hash router style navigation
        window.location.hash = redirectPath.startsWith('#') 
          ? redirectPath
          : `#${redirectPath}`;
      }
    }, [user, loading, navigate, toast]);

    // Show nothing while loading or after redirect is initiated
    if (loading || !user) {
      return null;
    }

    // Render the protected component if authenticated
    return <WrappedComponent {...props} />;
  };
} 