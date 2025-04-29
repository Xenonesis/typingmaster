import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AchievementsProvider } from "./context/AchievementsContext";
import { AnimationsProvider } from "./context/AnimationsContext";
import { TypingStatsProvider } from "./context/TypingStatsContext";
import { AuthProvider } from "./context/AuthContext";
import { GuestProvider } from "./context/GuestContext";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Stats = lazy(() => import("./pages/Stats"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Updates = lazy(() => import("./pages/Updates"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TypingTest = lazy(() => import("./pages/TypingTest"));
const TypingPractice = lazy(() => import("./pages/TypingPractice"));
const WordPractice = lazy(() => import("./pages/WordPractice"));
const Multiplayer = lazy(() => import("./pages/Multiplayer"));
const AIChallenge = lazy(() => import("./pages/AIChallenge"));

// Auth pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

// App with routes wrapped in providers
const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route path="/typing-test" element={<ProtectedRoute><TypingTest /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><TypingPractice /></ProtectedRoute>} />
      <Route path="/word-practice" element={<ProtectedRoute><WordPractice /></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/updates" element={<ProtectedRoute><Updates /></ProtectedRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="/multiplayer" element={<ProtectedRoute><Multiplayer /></ProtectedRoute>} />
      <Route path="/ai-challenge" element={<ProtectedRoute><AIChallenge /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure app only renders after mount to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Return nothing on the server
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <GuestProvider>
            <AchievementsProvider>
              <AnimationsProvider>
                <TypingStatsProvider>
                  <Toaster />
                  <Sonner />
                  <HashRouter>
                    <AppRoutes />
                  </HashRouter>
                </TypingStatsProvider>
              </AnimationsProvider>
            </AchievementsProvider>
          </GuestProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
