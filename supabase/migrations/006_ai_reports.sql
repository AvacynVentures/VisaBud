-- ============================================================================
-- AI REPORTS TABLE
-- Migration 006: Per-document AI confidence reports with FLAGS, SWOT, recommendations
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  application_id UUID,
  document_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  confidence_score INT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  swot JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_user ON public.ai_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_document ON public.ai_reports(user_id, document_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_generated ON public.ai_reports(generated_at DESC);

ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

-- Users can read their own reports
CREATE POLICY "Users can read own ai reports" ON public.ai_reports
  FOR SELECT USING (user_id = auth.uid());

-- Service role can insert
CREATE POLICY "Service role can insert ai reports" ON public.ai_reports
  FOR INSERT WITH CHECK (true);

-- Service role can update
CREATE POLICY "Service role can update ai reports" ON public.ai_reports
  FOR UPDATE USING (true);

-- Service role can delete (for regeneration)
CREATE POLICY "Service role can delete ai reports" ON public.ai_reports
  FOR DELETE USING (true);
