import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyophpmybhlpkpnujohd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b3BocG15YmhscGtwbnVqb2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDg4NjQsImV4cCI6MjA1OTA4NDg2NH0.Cf6mOglLPkZ805dBk3ctHqgxwjeIGRwGtlU8T5p0Dlw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Disable all redirects from Supabase to prevent unwanted navigation
    detectSessionInUrl: false, // We'll handle session detection ourselves
  },
});

// Custom function to handle login that bypasses Supabase's redirect mechanism
export const customSignIn = async (email: string, password: string) => {
  try {
    // Clear all stored auth data first
    clearSupabaseData();
    
    // Direct sign-in with no redirects
    return await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
  } catch (error) {
    console.error('Custom sign in error:', error);
    return { error, data: { user: null, session: null } };
  }
};

// Add a custom password reset function that doesn't use redirects
export const customResetPassword = async (email: string) => {
  try {
    // We don't use redirects at all for password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: null as any, // Force no redirect
    });
    return { error };
  } catch (error) {
    console.error('Custom reset password error:', error);
    return { error };
  }
};

// Helper function to clear all Supabase-related data
export const clearSupabaseData = () => {
  // Clear auth-related localStorage items
  const keysToRemove = [
    'supabase.auth.token',
    'supabase.auth.refreshToken',
    'supabase.auth.redirectUrl',
    'supabase.auth.redirectUri',
    'supabase.auth.callbackUrl',
    'supabase.auth.event',
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  // Also clear any cookies related to auth
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name.includes('sb-')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
  });
}; 