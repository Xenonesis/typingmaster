import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

type Achievement = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
  requirement: number;
  progress: number;
};

interface AchievementsContextType {
  achievements: Achievement[];
  updateProgress: (id: string, amount: number) => void;
  resetProgress: () => void;
  refreshAchievements: () => void;
}

const defaultAchievements: Achievement[] = [
  // Test Completion Achievements
  {
    id: 'tests_completed_10',
    name: 'Novice Typist',
    description: 'Complete 10 typing tests',
    completed: false,
    icon: 'keyboard',
    requirement: 10,
    progress: 0
  },
  {
    id: 'tests_completed_50',
    name: 'Skilled Typist',
    description: 'Complete 50 typing tests',
    completed: false,
    icon: 'keyboard',
    requirement: 50,
    progress: 0
  },
  {
    id: 'tests_completed_100',
    name: 'Typing Veteran',
    description: 'Complete 100 typing tests',
    completed: false,
    icon: 'medal',
    requirement: 100,
    progress: 0
  },
  {
    id: 'tests_completed_500',
    name: 'Typing Elite',
    description: 'Complete 500 typing tests',
    completed: false,
    icon: 'medal',
    requirement: 500,
    progress: 0
  },
  {
    id: 'tests_completed_1000',
    name: 'Typing Legend',
    description: 'Complete 1000 typing tests',
    completed: false,
    icon: 'trophy',
    requirement: 1000,
    progress: 0
  },
  
  // Speed Achievements
  {
    id: 'wpm_40',
    name: 'Quick Fingers',
    description: 'Reach 40 WPM in a typing test',
    completed: false,
    icon: 'zap',
    requirement: 40,
    progress: 0
  },
  {
    id: 'wpm_70',
    name: 'Speed Demon',
    description: 'Reach 70 WPM in a typing test',
    completed: false,
    icon: 'flame',
    requirement: 70,
    progress: 0
  },
  {
    id: 'wpm_100',
    name: 'Typing Master',
    description: 'Reach 100 WPM in a typing test',
    completed: false,
    icon: 'trophy',
    requirement: 100,
    progress: 0
  },
  {
    id: 'wpm_120',
    name: 'Typing Legend',
    description: 'Reach 120 WPM in a typing test',
    completed: false,
    icon: 'trophy',
    requirement: 120,
    progress: 0
  },
  {
    id: 'wpm_150',
    name: 'Typing God',
    description: 'Reach 150 WPM in a typing test',
    completed: false,
    icon: 'trophy',
    requirement: 150,
    progress: 0
  },
  {
    id: 'wpm_180',
    name: 'Speed Wizard',
    description: 'Reach 180 WPM in a typing test',
    completed: false,
    icon: 'trophy',
    requirement: 180,
    progress: 0
  },
  {
    id: 'wpm_200',
    name: 'Typing Deity',
    description: 'Reach 200 WPM in a typing test',
    completed: false,
    icon: 'trophy',
    requirement: 200,
    progress: 0
  },
  
  // Accuracy Achievements
  {
    id: 'accuracy_95',
    name: 'Precision Typist',
    description: 'Complete a test with 95% accuracy',
    completed: false,
    icon: 'target',
    requirement: 95,
    progress: 0
  },
  {
    id: 'accuracy_98',
    name: 'Flawless Typist',
    description: 'Complete a test with 98% accuracy',
    completed: false,
    icon: 'target',
    requirement: 98,
    progress: 0
  },
  {
    id: 'accuracy_100',
    name: 'Perfect Typist',
    description: 'Complete a test with 100% accuracy',
    completed: false,
    icon: 'target',
    requirement: 100,
    progress: 0
  },
  {
    id: 'accuracy_100_wpm_100',
    name: 'Perfect Speedster',
    description: 'Complete a test with 100% accuracy at 100+ WPM',
    completed: false,
    icon: 'target',
    requirement: 1,
    progress: 0
  },
  
  // Streak Achievements
  {
    id: 'daily_streak_7',
    name: 'Weekly Warrior',
    description: 'Complete typing tests 7 days in a row',
    completed: false,
    icon: 'flame',
    requirement: 7,
    progress: 0
  },
  {
    id: 'daily_streak_30',
    name: 'Monthly Master',
    description: 'Complete typing tests 30 days in a row',
    completed: false,
    icon: 'flame',
    requirement: 30,
    progress: 0
  },
  {
    id: 'daily_streak_100',
    name: 'Century Streak',
    description: 'Complete typing tests 100 days in a row',
    completed: false,
    icon: 'flame',
    requirement: 100,
    progress: 0
  },
  {
    id: 'daily_streak_365',
    name: 'Yearly Dedication',
    description: 'Complete typing tests 365 days in a row',
    completed: false,
    icon: 'flame',
    requirement: 365,
    progress: 0
  },
  
  // Code Typing Achievements
  {
    id: 'code_tests_10',
    name: 'Code Apprentice',
    description: 'Complete 10 code typing tests',
    completed: false,
    icon: 'code',
    requirement: 10,
    progress: 0
  },
  {
    id: 'code_tests_50',
    name: 'Code Master',
    description: 'Complete 50 code typing tests',
    completed: false,
    icon: 'code',
    requirement: 50,
    progress: 0
  },
  {
    id: 'code_wpm_60',
    name: 'Swift Coder',
    description: 'Reach 60 WPM in a code typing test',
    completed: false,
    icon: 'code',
    requirement: 60,
    progress: 0
  },
  {
    id: 'code_wpm_80',
    name: 'Code Ninja',
    description: 'Reach 80 WPM in a code typing test',
    completed: false,
    icon: 'code',
    requirement: 80,
    progress: 0
  },
  {
    id: 'code_wpm_100',
    name: 'Code Virtuoso',
    description: 'Reach 100 WPM in a code typing test',
    completed: false,
    icon: 'code',
    requirement: 100,
    progress: 0
  },
  {
    id: 'code_language_variety',
    name: 'Polyglot Programmer',
    description: 'Complete tests in 5 different programming languages',
    completed: false,
    icon: 'code',
    requirement: 5,
    progress: 0
  },
  
  // Difficulty-based Achievements
  {
    id: 'advanced_tests_10',
    name: 'Advanced Challenger',
    description: 'Complete 10 advanced difficulty tests',
    completed: false,
    icon: 'award',
    requirement: 10,
    progress: 0
  },
  {
    id: 'expert_tests_5',
    name: 'Expert Typist',
    description: 'Complete 5 expert difficulty tests',
    completed: false,
    icon: 'award',
    requirement: 5,
    progress: 0
  },
  {
    id: 'master_tests_3',
    name: 'Typing Grandmaster',
    description: 'Complete 3 master difficulty tests',
    completed: false,
    icon: 'award',
    requirement: 3,
    progress: 0
  },
  
  // Time-based Achievements
  {
    id: 'long_test_completed',
    name: 'Endurance Typist',
    description: 'Complete a 5-minute typing test',
    completed: false,
    icon: 'clock',
    requirement: 1,
    progress: 0
  },
  {
    id: 'speed_burst',
    name: 'Speed Burst',
    description: 'Type at 100+ WPM for 30 seconds straight',
    completed: false,
    icon: 'zap',
    requirement: 1,
    progress: 0
  },
  {
    id: 'marathon_typer',
    name: 'Marathon Typer',
    description: 'Complete a 10-minute typing test',
    completed: false,
    icon: 'clock',
    requirement: 1,
    progress: 0
  },
  {
    id: 'ultra_marathon',
    name: 'Ultra Marathon',
    description: 'Complete a 20-minute typing test',
    completed: false,
    icon: 'clock',
    requirement: 1,
    progress: 0
  },
  
  // Consistency Achievements
  {
    id: 'consistent_speed_5',
    name: 'Consistent Performer',
    description: 'Maintain 70+ WPM in 5 consecutive tests',
    completed: false,
    icon: 'check-circle',
    requirement: 5,
    progress: 0
  },
  {
    id: 'consistent_speed_10',
    name: 'Reliable Speedster',
    description: 'Maintain a 100+ WPM in 10 consecutive tests',
    completed: false,
    icon: 'check-circle',
    requirement: 10,
    progress: 0
  },
  
  // Progress Achievements
  {
    id: 'improve_wpm_10',
    name: 'Speed Improver',
    description: 'Improve your average WPM by 10 in one week',
    completed: false,
    icon: 'zap',
    requirement: 10,
    progress: 0
  },
  {
    id: 'improve_wpm_20',
    name: 'Major Progress',
    description: 'Improve your average WPM by 20 in one month',
    completed: false,
    icon: 'zap',
    requirement: 20,
    progress: 0
  },
  
  // Challenge Achievements
  {
    id: 'blind_typing_test',
    name: 'Blind Maestro',
    description: 'Complete a test with the text hidden at 50+ WPM',
    completed: false,
    icon: 'keyboard',
    requirement: 1,
    progress: 0
  },
  {
    id: 'race_winner_5',
    name: 'Racing Champion',
    description: 'Win 5 multiplayer typing races',
    completed: false,
    icon: 'trophy',
    requirement: 5,
    progress: 0
  },
  {
    id: 'race_winner_25',
    name: 'Racing Legend',
    description: 'Win 25 multiplayer typing races',
    completed: false,
    icon: 'trophy',
    requirement: 25,
    progress: 0
  },
  
  // Special Mode Achievements
  {
    id: 'wordplay_master',
    name: 'Wordplay Master',
    description: 'Complete 20 word-based typing tests',
    completed: false,
    icon: 'keyboard',
    requirement: 20,
    progress: 0
  },
  {
    id: 'quote_enthusiast',
    name: 'Quote Enthusiast',
    description: 'Complete 30 quote-based typing tests',
    completed: false,
    icon: 'keyboard',
    requirement: 30,
    progress: 0
  },
  {
    id: 'special_chars_master',
    name: 'Symbol Master',
    description: 'Complete a test with 95%+ accuracy on a special characters test',
    completed: false,
    icon: 'keyboard',
    requirement: 1,
    progress: 0
  },
  
  // Miscellaneous Achievements
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete 10 typing tests between midnight and 5 AM',
    completed: false,
    icon: 'clock',
    requirement: 10,
    progress: 0
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete 20 typing tests during weekends',
    completed: false,
    icon: 'calendar',
    requirement: 20,
    progress: 0
  },
  {
    id: 'global_explorer',
    name: 'Global Explorer',
    description: 'Complete typing tests in 5 different languages',
    completed: false,
    icon: 'globe',
    requirement: 5,
    progress: 0
  }
];

// Create the context
const AchievementsContext = createContext<AchievementsContextType | null>(null);

// Provider component
export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedAchievements = localStorage.getItem('typingAchievements');
    
    if (savedAchievements) {
      // Get saved achievements
      const savedAchievementsArray = JSON.parse(savedAchievements) as Achievement[];
      
      // Create a map of existing achievements by ID
      const savedAchievementsMap = new Map(
        savedAchievementsArray.map(achievement => [achievement.id, achievement])
      );
      
      // Merge default achievements with saved achievements
      // This ensures new achievements are added while preserving progress on existing ones
      return defaultAchievements.map(defaultAchievement => {
        const savedAchievement = savedAchievementsMap.get(defaultAchievement.id);
        return savedAchievement || defaultAchievement;
      });
    }
    
    return defaultAchievements;
  });

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('typingAchievements', JSON.stringify(achievements));
    } catch (error) {
      console.error("Failed to save achievements to localStorage:", error);
    }
  }, [achievements]);

  const updateProgress = (id: string, amount: number) => {
    setAchievements(prevAchievements => {
      return prevAchievements.map(achievement => {
        if (achievement.id === id) {
          const newProgress = Math.max(achievement.progress, amount);
          const completed = !achievement.completed && newProgress >= achievement.requirement;
          
          // Show notification if newly completed
          if (completed && !achievement.completed) {
            toast({
              title: `Achievement Unlocked: ${achievement.name}`,
              description: achievement.description,
              variant: "default"
            });
          }
          
          return {
            ...achievement,
            progress: newProgress,
            completed: completed
          };
        }
        return achievement;
      });
    });
  };

  const resetProgress = () => {
    setAchievements(defaultAchievements);
  };

  // Function to refresh achievements and add any new ones
  const refreshAchievements = () => {
    setAchievements(prev => {
      // Create a map of existing achievements by ID
      const existingAchievementsMap = new Map(
        prev.map(achievement => [achievement.id, achievement])
      );
      
      // Merge default achievements with existing achievements
      return defaultAchievements.map(defaultAchievement => {
        const existingAchievement = existingAchievementsMap.get(defaultAchievement.id);
        return existingAchievement || defaultAchievement;
      });
    });
    
    toast({
      title: "Achievements Updated",
      description: "New achievements have been added to your profile.",
      variant: "default"
    });
  };

  return (
    <AchievementsContext.Provider value={{ achievements, updateProgress, resetProgress, refreshAchievements }}>
      {children}
    </AchievementsContext.Provider>
  );
};

// Custom hook to use the achievements context
export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};