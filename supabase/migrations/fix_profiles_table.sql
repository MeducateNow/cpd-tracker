/*
  # Fix profiles table constraints

  1. Changes
    - Modify profiles table to ensure proper constraints
    - Add IF NOT EXISTS to avoid errors if table already exists
    - Ensure proper references to auth.users

  2. Security
    - No changes to RLS policies
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  profession text,
  license_number text,
  avatar_url text,
  total_cpd_points integer DEFAULT 0,
  required_annual_points integer DEFAULT 50
);

-- Enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);