import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  contact_number?: string;
  user_type?: 'student' | 'professional';
  university?: string;
  class_name?: string;
  university_address?: string;
  company_name?: string;
  designation?: string;
  avatar_url?: string;
  bio?: string;
  average_wpm?: number;
  best_wpm?: number;
  total_tests?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserStats {
  id?: string;
  user_id: string;
  date: string;
  wpm: number;
  accuracy: number;
  test_type: string;
  duration: number;
  raw_wpm?: number;
  errors?: number;
}

/**
 * Create or update a user profile
 */
export async function upsertProfile(profile: Partial<UserProfile> & { user_id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'user_id' })
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Get a user profile by user_id
 */
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    // PGRST116 means no rows returned (user profile not found)
    if (error) {
      if (error.code === 'PGRST116') {
        // Return empty data for a new user without a profile yet
        return null;
      }
      // Rethrow any other errors
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}

/**
 * Create or update user typing stats
 */
export async function saveTypingStats(stats: UserStats) {
  // Validate required fields
  if (
    !stats.user_id ||
    !stats.date ||
    stats.wpm === undefined || stats.wpm === null ||
    stats.accuracy === undefined || stats.accuracy === null ||
    !stats.test_type ||
    stats.duration === undefined || stats.duration === null
  ) {
    console.error("Missing required fields for typing stats:", stats);
    throw new Error("Missing required fields for typing stats");
  }
  
  try {
    // Ensure numeric values are valid
    const validatedStats: UserStats = {
      ...stats,
      wpm: Math.max(0, Number(stats.wpm)),
      accuracy: Math.min(1, Math.max(0, Number(stats.accuracy))),
      duration: Math.max(1, Number(stats.duration)),
      raw_wpm: stats.raw_wpm ? Math.max(0, Number(stats.raw_wpm)) : undefined,
      errors: stats.errors ? Math.max(0, Number(stats.errors)) : undefined
    };
    
    // Insert with retry logic (max 3 attempts)
    let attempts = 0;
    let data = null;
    let lastError = null;
    
    while (attempts < 3 && !data) {
      attempts++;
      try {
        const result = await supabase
          .from('typing_stats')
          .insert(validatedStats)
          .select('*')
          .single();
          
        if (result.error) {
          lastError = result.error;
          // Wait briefly before retry
          if (attempts < 3) await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          data = result.data;
        }
      } catch (err) {
        lastError = err;
        // Wait briefly before retry
        if (attempts < 3) await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!data && lastError) {
      console.error("Failed to save typing stats after multiple attempts:", lastError);
      throw lastError;
    }
    
    // For local development and testing, also update localStorage
    try {
      const storedResultsJSON = localStorage.getItem("typingPersonalBests");
      if (storedResultsJSON) {
        const storedResults = JSON.parse(storedResultsJSON);
        const testResult = {
          wpm: stats.wpm,
          cpm: stats.raw_wpm ? stats.raw_wpm * 5 : stats.wpm * 5,
          accuracy: stats.accuracy * 100,
          time: stats.duration,
          date: new Date(stats.date).getTime(),
          difficulty: stats.test_type
        };
        localStorage.setItem("typingPersonalBests", JSON.stringify([...storedResults, testResult]));
      }
    } catch (storageError) {
      // Non-fatal error, just log
      console.warn("Could not update localStorage:", storageError);
    }
    
    return data;
  } catch (error) {
    console.error("Error saving typing stats:", error);
    throw error;
  }
}

/**
 * Get typing stats for a user
 */
export async function getTypingStats(userId: string, limit = 100) {
  const { data, error } = await supabase
    .from('typing_stats')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return data;
}

/**
 * Get leaderboard data (highest WPM)
 */
export async function getLeaderboard(limit = 20) {
  try {
    // First try to get from profiles table (validated data)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, username, full_name, avatar_url, best_wpm, total_tests, updated_at')
      .order('best_wpm', { ascending: false })
      .limit(limit);
      
    if (profileError) {
      console.error('Error fetching leaderboard from profiles:', profileError);
      throw profileError;
    }
    
    // Enhance with recent activity data
    const enhancedLeaderboard = await Promise.all(
      profileData.map(async (profile) => {
        try {
          // Get the user's most recent test date
          const { data: recentTest, error: recentError } = await supabase
            .from('typing_stats')
            .select('date')
            .eq('user_id', profile.user_id)
            .order('date', { ascending: false })
            .limit(1)
            .single();
            
          return {
            ...profile,
            last_active: recentTest?.date || profile.updated_at
          };
        } catch (error) {
          console.warn('Error fetching recent activity for user:', profile.user_id, error);
          return {
            ...profile,
            last_active: profile.updated_at
          };
        }
      })
    );
    
    return enhancedLeaderboard;
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    // Return empty array as fallback
    return [];
  }
}

/**
 * Get real-time typing stats for a specific time period
 */
export async function getTypingStatsByPeriod(userId: string, period: 'day' | 'week' | 'month' = 'week') {
  try {
    // Calculate the start date based on the period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    const { data, error } = await supabase
      .from('typing_stats')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true });
      
    if (error) {
      console.error(`Error fetching typing stats for period ${period}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTypingStatsByPeriod:', error);
    return [];
  }
}

/**
 * Get daily leaderboard data (best performances today)
 */
export async function getDailyLeaderboard(limit = 10) {
  try {
    // Calculate the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's best performances
    const { data, error } = await supabase
      .from('typing_stats')
      .select(`
        id,
        wpm,
        accuracy,
        test_type,
        duration,
        date,
        profiles(id, user_id, username, avatar_url)
      `)
      .gte('date', today.toISOString())
      .order('wpm', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching daily leaderboard:', error);
      throw error;
    }
    
    // Format the response to a more usable structure
    return data.map(entry => ({
      id: entry.id,
      user_id: entry.profiles?.user_id,
      username: entry.profiles?.username || 'Anonymous',
      avatar_url: entry.profiles?.avatar_url,
      wpm: entry.wpm,
      accuracy: entry.accuracy,
      test_type: entry.test_type,
      duration: entry.duration,
      date: entry.date
    }));
  } catch (error) {
    console.error('Error in getDailyLeaderboard:', error);
    return [];
  }
}

/**
 * Update a user's profile after completing a typing test
 */
export async function updateProfileStats(userId: string, wpm: number) {
  // First get the current profile
  const profile = await getProfile(userId);
  
  if (!profile) {
    // Create new profile with stats
    return upsertProfile({
      user_id: userId,
      average_wpm: wpm,
      best_wpm: wpm,
      total_tests: 1,
      updated_at: new Date().toISOString()
    });
  }
  
  // Calculate new average WPM
  const newTotalTests = (profile.total_tests || 0) + 1;
  const currentTotalWpm = (profile.average_wpm || 0) * (profile.total_tests || 0);
  const newAverageWpm = (currentTotalWpm + wpm) / newTotalTests;
  
  // Update profile with new stats
  return upsertProfile({
    user_id: userId,
    average_wpm: parseFloat(newAverageWpm.toFixed(2)),
    best_wpm: Math.max(profile.best_wpm || 0, wpm),
    total_tests: newTotalTests,
    updated_at: new Date().toISOString()
  });
}

/**
 * Synchronize user statistics between local storage and database
 * This ensures all typing data is consistent between online and offline usage
 */
export async function syncUserStatistics(userId: string) {
  try {
    // Step 1: Get user profile from database
    const profile = await getProfile(userId);
    
    // Step 2: Get local storage typing stats
    const localStatsJSON = localStorage.getItem("typingPersonalBests");
    if (!localStatsJSON) return; // No local stats to sync
    
    const localStats = JSON.parse(localStatsJSON);
    if (!Array.isArray(localStats) || localStats.length === 0) return;
    
    // Step 3: Get database typing stats
    const dbStats = await getTypingStats(userId);
    
    // Step 4: Find local stats that aren't in the database
    // Use date as the comparison key (convert to ISO string for comparison)
    const dbDates = new Set(dbStats.map(stat => new Date(stat.date).toISOString().split('T')[0]));
    
    const statsToSync = localStats.filter(localStat => {
      const localDate = new Date(localStat.date).toISOString().split('T')[0];
      return !dbDates.has(localDate);
    });
    
    if (statsToSync.length === 0) return; // Nothing to sync
    
    // Step 5: Sync missing stats to database
    let syncedCount = 0;
    for (const stat of statsToSync) {
      try {
        await saveTypingStats({
          user_id: userId,
          date: new Date(stat.date).toISOString(),
          wpm: stat.wpm,
          accuracy: stat.accuracy / 100,
          test_type: stat.difficulty || 'standard',
          duration: stat.time || 60,
          raw_wpm: stat.cpm ? stat.cpm / 5 : undefined,
          errors: stat.accuracy < 100 ? Math.round((stat.cpm || stat.wpm * 5) * (1 - stat.accuracy / 100)) : 0
        });
        syncedCount++;
      } catch (err) {
        console.error("Error syncing individual stat:", err);
        // Continue with next stat
      }
    }
    
    // Step 6: Update profile with latest statistics
    if (syncedCount > 0) {
      // Recalculate best WPM from all stats
      const allStats = [...dbStats, ...statsToSync.map(stat => ({
        wpm: stat.wpm,
        accuracy: stat.accuracy / 100,
        test_type: stat.difficulty || 'standard'
      }))];
      
      const bestWpm = Math.max(...allStats.map(stat => Number(stat.wpm)));
      const totalTests = allStats.length;
      const averageWpm = allStats.reduce((sum, stat) => sum + Number(stat.wpm), 0) / totalTests;
      
      // Only update if we have better values
      if (!profile || 
          bestWpm > (profile.best_wpm || 0) || 
          totalTests > (profile.total_tests || 0)) {
        
        await upsertProfile({
          user_id: userId,
          best_wpm: bestWpm,
          average_wpm: parseFloat(averageWpm.toFixed(2)),
          total_tests: totalTests,
          updated_at: new Date().toISOString()
        });
      }
      
      return {
        synced: syncedCount,
        totalTests,
        bestWpm,
        averageWpm: parseFloat(averageWpm.toFixed(2))
      };
    }
    
    return { synced: 0 };
  } catch (error) {
    console.error("Error syncing user statistics:", error);
    throw error;
  }
} 