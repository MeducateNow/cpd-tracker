/*
  # Create initial schema for CPD tracking application

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `email` (text, unique)
      - `full_name` (text)
      - `profession` (text)
      - `license_number` (text)
      - `avatar_url` (text, nullable)
      - `total_cpd_points` (integer)
      - `required_annual_points` (integer)
    
    - `webinars`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `title` (text)
      - `description` (text)
      - `presenter` (text)
      - `date` (timestamptz)
      - `duration_minutes` (integer)
      - `cpd_points` (integer)
      - `accreditation_body` (text)
      - `category` (text)
      - `image_url` (text, nullable)
    
    - `user_webinars`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `webinar_id` (uuid, foreign key to webinars)
      - `completed_at` (timestamptz, nullable)
      - `certificate_url` (text, nullable)
      - `feedback` (text, nullable)
      - `status` (text, enum: 'registered', 'in_progress', 'completed')
    
    - `accreditation_bodies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `website_url` (text)
      - `logo_url` (text, nullable)
      - `submission_url` (text)
      - `description` (text)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  profession text,
  license_number text,
  avatar_url text,
  total_cpd_points integer DEFAULT 0,
  required_annual_points integer DEFAULT 50
);

-- Create webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  presenter text NOT NULL,
  date timestamptz NOT NULL,
  duration_minutes integer NOT NULL,
  cpd_points integer NOT NULL,
  accreditation_body text NOT NULL,
  category text NOT NULL,
  image_url text
);

-- Create user_webinars table
CREATE TABLE IF NOT EXISTS user_webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  webinar_id uuid NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  completed_at timestamptz,
  certificate_url text,
  feedback text,
  status text NOT NULL CHECK (status IN ('registered', 'in_progress', 'completed')) DEFAULT 'registered',
  UNIQUE(user_id, webinar_id)
);

-- Create accreditation_bodies table
CREATE TABLE IF NOT EXISTS accreditation_bodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website_url text NOT NULL,
  logo_url text,
  submission_url text NOT NULL,
  description text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditation_bodies ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for webinars
CREATE POLICY "Anyone can view webinars"
  ON webinars
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_webinars
CREATE POLICY "Users can view their own webinar registrations"
  ON user_webinars
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own webinar registrations"
  ON user_webinars
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webinar registrations"
  ON user_webinars
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for accreditation_bodies
CREATE POLICY "Anyone can view accreditation bodies"
  ON accreditation_bodies
  FOR SELECT
  TO authenticated
  USING (true);
