# Database Setup Instructions

This project uses Supabase for authentication and database storage. Follow these instructions to set up your database tables.

## Prerequisites

- A Supabase account and project
- Access to the SQL Editor in your Supabase dashboard

## Steps to Set Up the Database

1. Log in to your Supabase dashboard and navigate to your project.
2. Go to the SQL Editor section.
3. Create a new query.
4. Copy the contents of the `schema.sql` file in this directory.
5. Paste the SQL into the query editor and run the query.

This will create the following database structure:

### Tables

1. **profiles**
   - Stores user profile information
   - Linked to Supabase auth users via `user_id`
   - Includes typing statistics like average WPM and best WPM

2. **typing_stats**
   - Stores individual typing test results
   - Tracks WPM, accuracy, and other test metrics
   - Links to users via `user_id`

### Views

1. **public_leaderboard**
   - Provides an easy way to query leaderboard data

### Functions

1. **get_user_recent_stats**
   - Returns recent typing stats for a specific user

### Row Level Security (RLS)

The schema includes Row Level Security policies to ensure:
- Users can read each other's profiles (for leaderboards)
- Users can only update their own profiles
- Users can only read and write their own typing stats

## Authentication Setup

Make sure to enable the following in your Supabase Auth settings:

1. Enable Email/Password sign-up method
2. Configure email templates for account confirmation and password reset
3. Set up redirect URLs for your application

## Environment Variables

After setting up your Supabase project, update the `supabase.ts` file in the `src/lib` directory with your project URL and anon key. 