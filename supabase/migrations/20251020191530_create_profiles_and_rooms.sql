/*
  # BoltShare - Initial Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique, user's display name)
      - `avatar_url` (text, profile picture URL)
      - `created_at` (timestamptz, account creation timestamp)
    
    - `rooms`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, room display name)
      - `password_hash` (text, optional bcrypt hash for protected rooms)
      - `created_by` (uuid, references profiles.id)
      - `created_at` (timestamptz, room creation timestamp)

  2. Security
    - Enable RLS on both tables
    - Profiles: Users can read all profiles, but only update their own
    - Profiles: Users can insert their own profile on signup
    - Rooms: Anyone authenticated can create rooms
    - Rooms: Anyone authenticated can read rooms (for joining)
    - Rooms: Only room creators can update/delete their rooms

  3. Important Notes
    - Profiles are automatically created via trigger when user signs up
    - Room passwords are hashed using bcrypt before storage
    - No file data is stored - this is P2P only
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  password_hash text DEFAULT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Authenticated users can view all rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can delete their rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS rooms_created_by_idx ON rooms(created_by);
CREATE INDEX IF NOT EXISTS rooms_created_at_idx ON rooms(created_at DESC);