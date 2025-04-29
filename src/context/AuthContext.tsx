import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, customSignIn, customResetPassword, clearSupabaseData } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  clearAuthData: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Clear any existing redirects on app load
    clearSupabaseData();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Clear any potential redirect URL to prevent unwanted redirects
        clearSupabaseData();
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Use our custom sign-in function that prevents redirects
    const { data, error } = await customSignIn(email, password);
    
    if (!error) {
      setSession(data.session);
      setUser(data.user);
    } else {
      setError(error);
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    // Clear any existing auth data first
    clearSupabaseData();
    
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error);
    return { error, user: data.user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearSupabaseData();
  };

  const resetPassword = async (email: string) => {
    // Use custom reset password function with no redirects
    const { error } = await customResetPassword(email);
    
    if (error) setError(error);
    return { error };
  };
  
  // Expose function to clear auth data directly
  const clearAuthData = () => {
    clearSupabaseData();
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 