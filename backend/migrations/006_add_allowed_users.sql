-- Add allowed_users table for email-based authentication
-- This controls who can use the ORCHON mobile app

CREATE TABLE IF NOT EXISTS allowed_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_allowed_users_email ON allowed_users(email);

-- Seed with the primary user
INSERT INTO allowed_users (email, name) VALUES
  ('jasonleslieroberts@gmail.com', 'Jason')
ON CONFLICT (email) DO NOTHING;
