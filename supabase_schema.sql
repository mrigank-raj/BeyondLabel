-- Supabase SQL Schema for BeyondLabel

-- 1. Create the analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id), -- Nullable for guests
  guest_id UUID, -- For anonymous users
  product_name TEXT,
  image_url TEXT,
  goal_id TEXT NOT NULL,
  verdict JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the user_preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  default_goal TEXT,
  daily_scan_count INT DEFAULT 0,
  scan_count_reset_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS) policies

-- Enable RLS on analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own analyses
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id OR guest_id = current_setting('request.jwt.claims', true)::json->>'guest_id');

-- Allow users to insert their own analyses
CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow public inserts for guests (since we don't have a secure guest token yet, a simpler approach for MVP is to allow anon inserts, but lock down reads to the creator if possible)
-- For a true frictionless guest mode, you can allow anon inserts:
CREATE POLICY "Anon can insert analyses" ON analyses
  FOR INSERT TO anon WITH CHECK (true);
