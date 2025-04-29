import { supabase } from '../lib/supabase';
import { defaultAchievements } from '../data/achievements';

/**
 * This script initializes the achievements table in the Supabase database.
 * It should be run once to set up all achievements.
 */
async function initializeAchievements() {
  console.log('Initializing achievements in the database...');
  
  try {
    // Format achievements for insertion
    const achievementsForDB = defaultAchievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      requirement: achievement.requirement,
      category: achievement.id.split('_')[0] || 'misc',
    }));
    
    // Insert all achievements
    const { error } = await supabase
      .from('achievements')
      .upsert(achievementsForDB, { onConflict: 'id' });
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully initialized ${achievementsForDB.length} achievements!`);
  } catch (error) {
    console.error('Error initializing achievements:', error);
  }
}

// Run the initialization
initializeAchievements(); 