-- ============================================================================
-- VISA APPLICATION TRACKING + FRAUD MONITORING
-- Migration 004: visa_applications + feature_access_logs
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- Enable uuid extension (should already exist)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- VISA APPLICATIONS TABLE (Silent tracking of application submissions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  payment_id UUID NOT NULL REFERENCES public.payments(id),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_passport_id TEXT,
  visa_type TEXT NOT NULL,
  application_status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT visa_app_unique UNIQUE(payment_id, applicant_email, visa_type),
  CONSTRAINT valid_visa_type CHECK (visa_type IN ('spouse', 'skilled', 'citizenship')),
  CONSTRAINT valid_app_status CHECK (application_status IN ('draft', 'submitted', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_visa_apps_user ON public.visa_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_visa_apps_payment ON public.visa_applications(payment_id);
CREATE INDEX IF NOT EXISTS idx_visa_apps_submitted ON public.visa_applications(submitted_at DESC);

ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own visa applications
CREATE POLICY "Users can read own visa apps" ON public.visa_applications
  FOR SELECT USING (user_id = auth.uid());

-- Service role can insert (used by API routes with service key)
CREATE POLICY "Service role can insert visa apps" ON public.visa_applications
  FOR INSERT WITH CHECK (true);

-- Service role can update
CREATE POLICY "Service role can update visa apps" ON public.visa_applications
  FOR UPDATE USING (true);

-- ============================================================================
-- FEATURE ACCESS LOGS TABLE (Track PDF exports, template downloads, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.feature_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  feature TEXT NOT NULL,
  visa_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_feature CHECK (feature IN ('pdf_export', 'template_download', 'expert_review'))
);

CREATE INDEX IF NOT EXISTS idx_access_logs_user ON public.feature_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON public.feature_access_logs(logged_at DESC);

ALTER TABLE public.feature_access_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own access logs
CREATE POLICY "Users can read own access logs" ON public.feature_access_logs
  FOR SELECT USING (user_id = auth.uid());

-- Service role can insert
CREATE POLICY "Service role can insert access logs" ON public.feature_access_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- FRAUD AUDIT VIEW (For weekly reporting)
-- ============================================================================

CREATE OR REPLACE VIEW public.fraud_audit_summary AS
SELECT 
  va.user_id,
  u.email as user_email,
  p.id as payment_id,
  p.amount_pence,
  p.created_at as paid_at,
  COUNT(va.id) as total_visas,
  STRING_AGG(DISTINCT va.applicant_name, ', ') as applicant_names,
  MIN(va.submitted_at) as first_submission,
  MAX(va.submitted_at) as last_submission,
  EXTRACT(EPOCH FROM (MAX(va.submitted_at) - MIN(va.submitted_at))) / 3600 as hours_span
FROM public.visa_applications va
JOIN public.users u ON va.user_id = u.id
JOIN public.payments p ON va.payment_id = p.id
WHERE va.submitted_at > NOW() - INTERVAL '7 days'
GROUP BY va.user_id, u.email, p.id, p.amount_pence, p.created_at
HAVING COUNT(va.id) >= 5
ORDER BY COUNT(va.id) DESC;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables were created
SELECT 'visa_applications' as table_name, COUNT(*) as row_count FROM public.visa_applications
UNION ALL
SELECT 'feature_access_logs', COUNT(*) FROM public.feature_access_logs;
