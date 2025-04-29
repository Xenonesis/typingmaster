import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { 
  Achievement as AchievementType, 
  initializeAchievements, 
  getUserAchievements, 
  updateAchievementProgress as updateAchievementProgressDB,
  resetUserAchievements as resetUserAchievementsDB,
  subscribeToUserAchievements
} from '@/services/achievementsService';
import { defaultAchievements } from '@/data/achievements';
import { RealtimeChannel } from '@supabase/supabase-js';

interface AchievementsContextType {
  achievements: AchievementType[];
  updateProgress: (id: string, amount: number) => void;
  resetProgress: () => void;
  refreshAchievements: () => void;
  isLoading: boolean;
}

// Create the context
const AchievementsContext = createContext<AchievementsContextType | null>(null);

// Provider component
export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  // Initialize achievements in the database
  useEffect(() => {
    const initialize = async () => {
      await initializeAchievements(defaultAchievements);
    };
    
    initialize();
  }, []);

  // Fetch achievements when user changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAchievements = async () => {
      if (!user) {
        // If not logged in, use local storage as fallback
        const savedAchievements = localStorage.getItem('typingAchievements');
    if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        } else {
          // Set default with 0 progress
          setAchievements(
            defaultAchievements.map(a => ({ ...a, progress: 0, completed: false }))
          );
        }
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const userAchievements = await getUserAchievements(user.id);
        if (isMounted) {
          setAchievements(userAchievements);
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
        toast({
          title: "Error loading achievements",
          description: "Your achievements could not be loaded. Using local data.",
          variant: "destructive"
        });
        
        // Fallback to local storage
        const savedAchievements = localStorage.getItem('typingAchievements');
        if (savedAchievements && isMounted) {
          setAchievements(JSON.parse(savedAchievements));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAchievements();
    
    return () => {
      isMounted = false;
    };
  }, [user]);
  
  // Set up real-time subscription for achievements
  useEffect(() => {
    if (!user) {
      // Clean up previous subscription
      if (subscription) {
        subscription.unsubscribe();
        setSubscription(null);
      }
      return;
    }
    
    // Subscribe to real-time updates
    const newSubscription = subscribeToUserAchievements(user.id, (updatedAchievements) => {
      setAchievements(updatedAchievements);
  });

    setSubscription(newSubscription);
    
    // Clean up subscription on unmount
    return () => {
      if (newSubscription) {
        newSubscription.unsubscribe();
      }
    };
  }, [user]);

  // For non-authenticated users, persist to local storage
  useEffect(() => {
    if (!user && achievements.length > 0) {
    try {
      localStorage.setItem('typingAchievements', JSON.stringify(achievements));
    } catch (error) {
      console.error("Failed to save achievements to localStorage:", error);
    }
    }
  }, [achievements, user]);

  const updateProgress = async (id: string, amount: number) => {
    // Find the achievement
    const achievement = achievements.find(a => a.id === id);
    if (!achievement) return;
    
    // Calculate new progress and completion status
    const newProgress = Math.max(achievement.progress, amount);
    const wasCompletedBefore = achievement.completed;
    const newCompleted = newProgress >= achievement.requirement;
    
    // Optimistically update UI first for responsive feel
    setAchievements(prevAchievements => {
      return prevAchievements.map(a => {
        if (a.id === id) {
          return {
            ...a,
            progress: newProgress,
            completed: newCompleted
          };
        }
        return a;
      });
    });
          
          // Show notification if newly completed
    if (newCompleted && !wasCompletedBefore) {
            toast({
              title: `Achievement Unlocked: ${achievement.name}`,
              description: achievement.description,
              variant: "default"
            });
          }
          
    // Update database if user is logged in
    if (user) {
      try {
        const isNewlyCompleted = await updateAchievementProgressDB(user.id, id, amount);
        // The notification is already shown by the optimistic UI update above
      } catch (error) {
        console.error('Error updating achievement in database:', error);
        toast({
          title: "Error updating achievement",
          description: "Your progress could not be saved to the server.",
          variant: "destructive"
        });
      }
    }
  };

  const resetProgress = async () => {
    // Reset achievements in state
    setAchievements(prevAchievements => 
      prevAchievements.map(a => ({ ...a, progress: 0, completed: false }))
    );
    
    // Reset in database if user is logged in
    if (user) {
      try {
        await resetUserAchievementsDB(user.id);
      } catch (error) {
        console.error('Error resetting achievements in database:', error);
        toast({
          title: "Error resetting achievements",
          description: "Your achievements could not be reset on the server.",
          variant: "destructive"
        });
        }
    } else {
      // Clear local storage for non-authenticated users
      localStorage.removeItem('typingAchievements');
    }
    
    toast({
      title: "Achievements Reset",
      description: "All your achievement progress has been reset.",
      variant: "default"
    });
  };

  // Function to refresh achievements and add any new ones
  const refreshAchievements = async () => {
    if (user) {
      // For authenticated users, achievements are managed in the database
      setIsLoading(true);
      try {
        // Make sure all achievement types are in the database
        await initializeAchievements(defaultAchievements);
        
        // Fetch latest user achievements
        const userAchievements = await getUserAchievements(user.id);
        setAchievements(userAchievements);
        
        toast({
          title: "Achievements Updated",
          description: "Your achievements have been refreshed from the server.",
          variant: "default"
        });
      } catch (error) {
        console.error('Error refreshing achievements:', error);
        toast({
          title: "Error refreshing achievements",
          description: "Your achievements could not be refreshed from the server.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // For non-authenticated users, ensure all default achievements exist
    setAchievements(prev => {
      // Create a map of existing achievements by ID
      const existingAchievementsMap = new Map(
        prev.map(achievement => [achievement.id, achievement])
      );
      
      // Merge default achievements with existing achievements
        const updatedAchievements = defaultAchievements.map(defaultAchievement => {
        const existingAchievement = existingAchievementsMap.get(defaultAchievement.id);
          if (existingAchievement) {
            return existingAchievement;
          } else {
            // Add new achievement with 0 progress
            return { 
              ...defaultAchievement, 
              progress: 0, 
              completed: false 
            };
          }
        });
        
        // Save to local storage
        try {
          localStorage.setItem('typingAchievements', JSON.stringify(updatedAchievements));
        } catch (error) {
          console.error("Failed to save achievements to localStorage:", error);
        }
        
        return updatedAchievements;
    });
    
    toast({
      title: "Achievements Updated",
      description: "New achievements have been added to your profile.",
      variant: "default"
    });
    }
  };

  return (
    <AchievementsContext.Provider value={{ 
      achievements, 
      updateProgress, 
      resetProgress, 
      refreshAchievements,
      isLoading
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};