-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  full_name TEXT,
  contact_number TEXT,
  user_type TEXT, -- 'student' or 'professional'
  university TEXT,
  class_name TEXT,
  university_address TEXT,
  company_name TEXT,
  designation TEXT,
  avatar_url TEXT,
  bio TEXT,
  average_wpm NUMERIC(6, 2),
  best_wpm NUMERIC(6, 2),
  total_tests INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create typing_stats table to store user typing test results
CREATE TABLE typing_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  wpm NUMERIC(6, 2) NOT NULL,
  accuracy NUMERIC(6, 4) NOT NULL,
  test_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  raw_wpm NUMERIC(6, 2),
  errors INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security for typing_stats
ALTER TABLE typing_stats ENABLE ROW LEVEL SECURITY;

-- Create leaderboard view for public leaderboard
CREATE OR REPLACE VIEW public_leaderboard AS 
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.best_wpm,
  p.total_tests
FROM profiles p
ORDER BY p.best_wpm DESC;

-- Create Row Level Security Policies

-- Profiles policies
-- Users can read everyone's profile
CREATE POLICY "Allow public read access to profiles" 
ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Allow users to update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Allow users to insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Typing stats policies
-- Users can read their own typing stats
CREATE POLICY "Allow users to read their own typing stats" 
ON typing_stats FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own typing stats
CREATE POLICY "Allow users to insert their own typing stats" 
ON typing_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create custom function to get recent typing stats for a user
CREATE OR REPLACE FUNCTION get_user_recent_stats(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  date TIMESTAMP WITH TIME ZONE,
  wpm NUMERIC(6, 2),
  accuracy NUMERIC(6, 4),
  test_type TEXT,
  duration INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ts.id, 
    ts.date, 
    ts.wpm, 
    ts.accuracy, 
    ts.test_type, 
    ts.duration
  FROM typing_stats ts
  WHERE ts.user_id = user_uuid
  ORDER BY ts.date DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql; 

-- Create trigger function to update profile statistics automatically
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
DECLARE
  profile_record RECORD;
  new_total_tests INTEGER;
  current_total_wpm NUMERIC(6, 2);
  new_average_wpm NUMERIC(6, 2);
BEGIN
  -- First check if a profile exists for this user
  SELECT * INTO profile_record FROM profiles WHERE user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    -- Create a new profile with initial stats from this test
    INSERT INTO profiles (
      user_id,
      average_wpm,
      best_wpm,
      total_tests,
      updated_at
    ) VALUES (
      NEW.user_id,
      NEW.wpm,
      NEW.wpm,
      1,
      now()
    );
  ELSE
    -- Update existing profile stats
    new_total_tests := (profile_record.total_tests + 1);
    current_total_wpm := (profile_record.average_wpm * profile_record.total_tests);
    new_average_wpm := (current_total_wpm + NEW.wpm) / new_total_tests;
    
    UPDATE profiles 
    SET 
      average_wpm = ROUND(new_average_wpm::numeric, 2),
      best_wpm = GREATEST(profile_record.best_wpm, NEW.wpm),
      total_tests = new_total_tests,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the typing_stats table
CREATE TRIGGER update_profile_after_test_insert
AFTER INSERT ON typing_stats
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats(); 