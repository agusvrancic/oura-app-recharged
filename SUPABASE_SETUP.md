# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and give your project a name
4. Set a strong database password
5. Choose a region close to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy your Project URL and anon public key
3. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up the Database Schema

Run this SQL in your Supabase SQL Editor (Database → SQL Editor):

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(name, user_id)
);

-- Create tasks table with category, priority, and status support
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  due_date TIMESTAMPTZ,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  priority TEXT CHECK (priority IN ('High', 'Mid', 'Low')),
  time_range TEXT, -- e.g., "10:00 - 12:00"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create updated_at trigger for tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Row Level Security for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create default categories for new users (optional)
-- You can run this after creating your first user, or create a trigger
INSERT INTO categories (name, icon, color, user_id) VALUES 
  ('Personal', '👤', '#3B82F6', 'YOUR_USER_ID_HERE'),
  ('Work', '💼', '#10B981', 'YOUR_USER_ID_HERE'),
  ('Health', '🏥', '#EF4444', 'YOUR_USER_ID_HERE'),
  ('Learning', '📚', '#8B5CF6', 'YOUR_USER_ID_HERE');
```

## 4. Board Functionality Migration (Required for Board View)

If you already have an existing database, run this migration to add board support:

```sql
-- Add status column to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done'));

-- Update existing tasks to have proper status based on completed field
UPDATE tasks SET status = CASE 
  WHEN completed = true THEN 'done'
  ELSE 'todo'
END WHERE status IS NULL;

-- Make status NOT NULL after setting default values
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;
```

## 5. Database Migration (If you already have existing data)

If you already have tasks in your database, run this migration:

```sql
-- Add new columns to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('High', 'Mid', 'Low'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_range TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done'));

-- Update existing tasks to have proper status based on completed field
UPDATE tasks SET status = CASE 
  WHEN completed = true THEN 'done'
  ELSE 'todo'
END WHERE status IS NULL;

-- Make status NOT NULL after setting default values
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(name, user_id)
);

-- Enable RLS and create policies if not already done
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);
```

## 6. Configure Google OAuth

1. In your Supabase dashboard, go to Authentication → Providers
2. Enable Google provider
3. Follow the instructions to set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your Supabase redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

## 7. Set Up Default Categories (Optional)

After you create your first user account, you can run this SQL to create default categories:

```sql
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users table
INSERT INTO categories (name, icon, color, user_id) VALUES 
  ('Personal', '👤', '#3B82F6', 'YOUR_USER_ID_HERE'),
  ('Work', '💼', '#10B981', 'YOUR_USER_ID_HERE'),
  ('Health', '🏥', '#EF4444', 'YOUR_USER_ID_HERE'),
  ('Learning', '📚', '#8B5CF6', 'YOUR_USER_ID_HERE');
```

To find your user ID:
1. Go to Authentication → Users in your Supabase dashboard
2. Find your user and copy the ID
3. Replace 'YOUR_USER_ID_HERE' in the SQL above

## 8. Test Your Setup

1. Start your development server: `pnpm dev`
2. Visit your app and try signing in with Google
3. Create a test task to verify everything works

## Troubleshooting

- Make sure your `.env.local` file is in the project root
- Verify your Supabase URL and keys are correct
- Check that RLS policies are properly set up
- Ensure Google OAuth is configured correctly 