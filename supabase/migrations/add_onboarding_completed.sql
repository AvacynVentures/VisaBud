-- Add onboarding_completed column to users table
ALTER TABLE public.users
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX idx_users_onboarding_completed ON public.users(onboarding_completed);
