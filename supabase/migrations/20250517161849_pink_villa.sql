/*
  # Create subscriptions table
  
  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `last_sent_at` (timestamp)
  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_sent_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert subscriptions"
  ON subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);