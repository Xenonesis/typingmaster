import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { AchievementData } from '@/data/achievements';

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement extends AchievementData {
  progress: number;
  completed: boolean;
  completed_at?: string | null;
}

/**
 * Initialize achievements in the database based on the default achievements array
 */
export async function initializeAchievements(achievements: AchievementData[]) {
  try {
    // Upsert achievements to the database
    const { error } = await supabase
      .from('achievements')
      .upsert(
        achievements.map(achievement => ({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          requirement: achievement.requirement,
          category: achievement.category
        })),
        { onConflict: 'id' }
      );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error initializing achievements:', error);
    return false;
  }
}

/**
 * Get all achievements for the current user with their progress
 */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  try {
    // First get all achievements
    const { data: achievementsData, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');

    if (achievementsError) throw achievementsError;

    if (!achievementsData || achievementsData.length === 0) {
      return [];
    }

    // Then get the user's progress for these achievements
    const { data: userAchievements, error: userError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (userError) throw userError;

    // Map user progress to achievements, default to 0 progress if not found
    return achievementsData.map(achievement => {
      const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
      return {
        ...achievement,
        progress: userAchievement?.progress || 0,
        completed: userAchievement?.completed || false,
        completed_at: userAchievement?.completed_at || null
      };
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
}

/**
 * Update achievement progress for a user
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number
): Promise<boolean> {
  try {
    // Get the achievement to check its requirement
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (achievementError) throw achievementError;

    const completed = progress >= achievement.requirement;
    const now = new Date().toISOString();

    // Check if user achievement already exists
    const { data: existingUserAchievement, error: existingError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw existingError;
    }

    if (existingUserAchievement) {
      // Update existing achievement
      const newProgress = Math.max(existingUserAchievement.progress, progress);
      const wasCompletedBefore = existingUserAchievement.completed;
      const newCompleted = newProgress >= achievement.requirement;

      const { error } = await supabase
        .from('user_achievements')
        .update({
          progress: newProgress,
          completed: newCompleted,
          completed_at: newCompleted && !wasCompletedBefore ? now : existingUserAchievement.completed_at,
          updated_at: now
        })
        .eq('id', existingUserAchievement.id);

      if (error) throw error;
      return newCompleted && !wasCompletedBefore; // Return true if newly completed
    } else {
      // Insert new achievement
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          progress,
          completed,
          completed_at: completed ? now : null
        });

      if (error) throw error;
      return completed; // Return true if completed on first insert
    }
  } catch (error) {
    console.error('Error updating achievement progress:', error);
    return false;
  }
}

/**
 * Reset all achievements for a user
 */
export async function resetUserAchievements(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_achievements')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resetting user achievements:', error);
    return false;
  }
}

/**
 * Subscribe to user achievement changes in real-time
 */
export function subscribeToUserAchievements(
  userId: string,
  callback: (achievements: Achievement[]) => void
) {
  return supabase
    .channel('user-achievements-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_achievements',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        // When changes happen, fetch the complete set of achievements
        const achievements = await getUserAchievements(userId);
        callback(achievements);
      }
    )
    .subscribe();
} 