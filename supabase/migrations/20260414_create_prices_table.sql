-- ============================================================================
-- Migration: Create prices table for database-backed pricing
-- Source of truth: Stripe → webhook → Supabase prices table
-- ============================================================================

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier TEXT NOT NULL UNIQUE,
  price_gbp DECIMAL(10, 2) NOT NULL,
  price_pence INTEGER NOT NULL,
  stripe_price_id TEXT NOT NULL UNIQUE,
  stripe_product_id TEXT NOT NULL,
  currency TEXT DEFAULT 'gbp',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_tier CHECK (tier IN ('standard', 'premium', 'expert'))
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_prices_tier ON public.prices(tier);
CREATE INDEX IF NOT EXISTS idx_prices_active ON public.prices(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_prices_stripe_price_id ON public.prices(stripe_price_id);

-- Enable RLS (read-only for anon, full access for service role)
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

-- Anyone can read active prices (public pricing page)
CREATE POLICY "Anyone can read active prices"
  ON public.prices
  FOR SELECT
  USING (is_active = true);

-- Only service role can insert/update (webhook handler uses service key)
CREATE POLICY "Service role can manage prices"
  ON public.prices
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prices_updated_at
  BEFORE UPDATE ON public.prices
  FOR EACH ROW
  EXECUTE FUNCTION update_prices_updated_at();
