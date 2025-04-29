export interface AchievementData {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: string;
}

export const defaultAchievements: AchievementData[] = [
  // Test Completion Achievements
  {
    id: 'tests_completed_10',
    name: 'Novice Typist',
    description: 'Complete 10 typing tests',
    icon: 'keyboard',
    requirement: 10,
    category: 'tests'
  },
  {
    id: 'tests_completed_50',
    name: 'Skilled Typist',
    description: 'Complete 50 typing tests',
    icon: 'keyboard',
    requirement: 50,
    category: 'tests'
  },
  {
    id: 'tests_completed_100',
    name: 'Typing Veteran',
    description: 'Complete 100 typing tests',
    icon: 'medal',
    requirement: 100,
    category: 'tests'
  },
  {
    id: 'tests_completed_500',
    name: 'Typing Elite',
    description: 'Complete 500 typing tests',
    icon: 'medal',
    requirement: 500,
    category: 'tests'
  },
  {
    id: 'tests_completed_1000',
    name: 'Typing Legend',
    description: 'Complete 1000 typing tests',
    icon: 'trophy',
    requirement: 1000,
    category: 'tests'
  },
  
  // Speed Achievements
  {
    id: 'wpm_40',
    name: 'Quick Fingers',
    description: 'Reach 40 WPM in a typing test',
    icon: 'zap',
    requirement: 40,
    category: 'wpm'
  },
  {
    id: 'wpm_70',
    name: 'Speed Demon',
    description: 'Reach 70 WPM in a typing test',
    icon: 'flame',
    requirement: 70,
    category: 'wpm'
  },
  {
    id: 'wpm_100',
    name: 'Typing Master',
    description: 'Reach 100 WPM in a typing test',
    icon: 'trophy',
    requirement: 100,
    category: 'wpm'
  },
  {
    id: 'wpm_120',
    name: 'Typing Legend',
    description: 'Reach 120 WPM in a typing test',
    icon: 'trophy',
    requirement: 120,
    category: 'wpm'
  },
  {
    id: 'wpm_150',
    name: 'Typing God',
    description: 'Reach 150 WPM in a typing test',
    icon: 'trophy',
    requirement: 150,
    category: 'wpm'
  },
  {
    id: 'wpm_180',
    name: 'Speed Wizard',
    description: 'Reach 180 WPM in a typing test',
    icon: 'trophy',
    requirement: 180,
    category: 'wpm'
  },
  {
    id: 'wpm_200',
    name: 'Typing Deity',
    description: 'Reach 200 WPM in a typing test',
    icon: 'trophy',
    requirement: 200,
    category: 'wpm'
  },
  
  // Accuracy Achievements
  {
    id: 'accuracy_95',
    name: 'Precision Typist',
    description: 'Complete a test with 95% accuracy',
    icon: 'target',
    requirement: 95,
    category: 'accuracy'
  },
  {
    id: 'accuracy_98',
    name: 'Flawless Typist',
    description: 'Complete a test with 98% accuracy',
    icon: 'target',
    requirement: 98,
    category: 'accuracy'
  },
  {
    id: 'accuracy_100',
    name: 'Perfect Typist',
    description: 'Complete a test with 100% accuracy',
    icon: 'target',
    requirement: 100,
    category: 'accuracy'
  },
  {
    id: 'accuracy_100_wpm_100',
    name: 'Perfect Speedster',
    description: 'Complete a test with 100% accuracy at 100+ WPM',
    icon: 'target',
    requirement: 1,
    category: 'accuracy'
  },
  
  // Streak Achievements
  {
    id: 'daily_streak_7',
    name: 'Weekly Warrior',
    description: 'Complete typing tests 7 days in a row',
    icon: 'flame',
    requirement: 7,
    category: 'streak'
  },
  {
    id: 'daily_streak_30',
    name: 'Monthly Master',
    description: 'Complete typing tests 30 days in a row',
    icon: 'flame',
    requirement: 30,
    category: 'streak'
  },
  {
    id: 'daily_streak_100',
    name: 'Century Streak',
    description: 'Complete typing tests 100 days in a row',
    icon: 'flame',
    requirement: 100,
    category: 'streak'
  },
  {
    id: 'daily_streak_365',
    name: 'Yearly Dedication',
    description: 'Complete typing tests 365 days in a row',
    icon: 'flame',
    requirement: 365,
    category: 'streak'
  },
  
  // Code Typing Achievements
  {
    id: 'code_tests_10',
    name: 'Code Apprentice',
    description: 'Complete 10 code typing tests',
    icon: 'code',
    requirement: 10,
    category: 'code'
  },
  {
    id: 'code_tests_50',
    name: 'Code Master',
    description: 'Complete 50 code typing tests',
    icon: 'code',
    requirement: 50,
    category: 'code'
  },
  {
    id: 'code_wpm_60',
    name: 'Swift Coder',
    description: 'Reach 60 WPM in a code typing test',
    icon: 'code',
    requirement: 60,
    category: 'code'
  },
  {
    id: 'code_wpm_80',
    name: 'Code Ninja',
    description: 'Reach 80 WPM in a code typing test',
    icon: 'code',
    requirement: 80,
    category: 'code'
  },
  {
    id: 'code_wpm_100',
    name: 'Code Virtuoso',
    description: 'Reach 100 WPM in a code typing test',
    icon: 'code',
    requirement: 100,
    category: 'code'
  },
  {
    id: 'code_language_variety',
    name: 'Polyglot Programmer',
    description: 'Complete tests in 5 different programming languages',
    icon: 'code',
    requirement: 5,
    category: 'code'
  },
  
  // Difficulty-based Achievements
  {
    id: 'advanced_tests_10',
    name: 'Advanced Challenger',
    description: 'Complete 10 advanced difficulty tests',
    icon: 'award',
    requirement: 10,
    category: 'advanced'
  },
  {
    id: 'expert_tests_5',
    name: 'Expert Typist',
    description: 'Complete 5 expert difficulty tests',
    icon: 'award',
    requirement: 5,
    category: 'expert'
  },
  {
    id: 'master_tests_3',
    name: 'Typing Grandmaster',
    description: 'Complete 3 master difficulty tests',
    icon: 'award',
    requirement: 3,
    category: 'master'
  },
  
  // Time-based Achievements
  {
    id: 'long_test_completed',
    name: 'Endurance Typist',
    description: 'Complete a 5-minute typing test',
    icon: 'clock',
    requirement: 1,
    category: 'long'
  },
  {
    id: 'speed_burst',
    name: 'Speed Burst',
    description: 'Type at 100+ WPM for 30 seconds straight',
    icon: 'zap',
    requirement: 1,
    category: 'speed'
  },
  {
    id: 'marathon_typer',
    name: 'Marathon Typer',
    description: 'Complete a 10-minute typing test',
    icon: 'clock',
    requirement: 1,
    category: 'marathon'
  },
  {
    id: 'ultra_marathon',
    name: 'Ultra Marathon',
    description: 'Complete a 20-minute typing test',
    icon: 'clock',
    requirement: 1,
    category: 'ultra'
  },
  
  // Consistency Achievements
  {
    id: 'consistent_speed_5',
    name: 'Consistent Performer',
    description: 'Maintain 70+ WPM in 5 consecutive tests',
    icon: 'check-circle',
    requirement: 5,
    category: 'consistent'
  },
  {
    id: 'consistent_speed_10',
    name: 'Reliable Speedster',
    description: 'Maintain a 100+ WPM in 10 consecutive tests',
    icon: 'check-circle',
    requirement: 10,
    category: 'consistent'
  },
  
  // Progress Achievements
  {
    id: 'improve_wpm_10',
    name: 'Speed Improver',
    description: 'Improve your average WPM by 10 in one week',
    icon: 'zap',
    requirement: 10,
    category: 'improve'
  },
  {
    id: 'improve_wpm_20',
    name: 'Major Progress',
    description: 'Improve your average WPM by 20 in one month',
    icon: 'zap',
    requirement: 20,
    category: 'improve'
  },
  
  // Challenge Achievements
  {
    id: 'blind_typing_test',
    name: 'Blind Maestro',
    description: 'Complete a test with the text hidden at 50+ WPM',
    icon: 'keyboard',
    requirement: 1,
    category: 'blind'
  },
  {
    id: 'race_winner_5',
    name: 'Racing Champion',
    description: 'Win 5 multiplayer typing races',
    icon: 'trophy',
    requirement: 5,
    category: 'race'
  },
  {
    id: 'race_winner_25',
    name: 'Racing Legend',
    description: 'Win 25 multiplayer typing races',
    icon: 'trophy',
    requirement: 25,
    category: 'race'
  },
  
  // Special Mode Achievements
  {
    id: 'wordplay_master',
    name: 'Wordplay Master',
    description: 'Complete 20 word-based typing tests',
    icon: 'keyboard',
    requirement: 20,
    category: 'wordplay'
  },
  {
    id: 'quote_enthusiast',
    name: 'Quote Enthusiast',
    description: 'Complete 30 quote-based typing tests',
    icon: 'keyboard',
    requirement: 30,
    category: 'quote'
  },
  {
    id: 'special_chars_master',
    name: 'Symbol Master',
    description: 'Complete a test with 95%+ accuracy on a special characters test',
    icon: 'keyboard',
    requirement: 1,
    category: 'special'
  },
  
  // Miscellaneous Achievements
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete 10 typing tests between midnight and 5 AM',
    icon: 'clock',
    requirement: 10,
    category: 'night'
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete 20 typing tests during weekends',
    icon: 'calendar',
    requirement: 20,
    category: 'weekend'
  },
  {
    id: 'global_explorer',
    name: 'Global Explorer',
    description: 'Complete typing tests in 5 different languages',
    icon: 'globe',
    requirement: 5,
    category: 'global'
  }
]; 