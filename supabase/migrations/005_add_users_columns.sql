-- Add premium tier columns to users table for future features
-- This migration is optional: the app works without it since payments table is the source of truth
-- But these columns are useful for caching tier status and future features

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS unlocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_tier TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create an index on premium_tier for faster queries
CREATE INDEX IF NOT EXISTS idx_users_premium_tier ON public.users(premium_tier);

-- Add comment for clarity
COMMENT ON COLUMN public.users.unlocked IS 'True if user has paid for any tier (Standard/Premium/Expert)';
COMMENT ON COLUMN public.users.premium_tier IS 'Current tier: standard, premium, or expert';
