-- ============================================================
-- VisaBud Applications — Multi-Application Support
-- ============================================================
-- Each user can have multiple visa applications.
-- Each application owns its wizard answers, checklist, documents, payments.
-- ============================================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Display
  name TEXT, -- User-editable label, auto-generated if null
  
  -- Wizard answers
  visa_type TEXT NOT NULL CHECK (visa_type IN ('spouse', 'skilled_worker', 'citizenship')),
  nationality TEXT,
  relationship_status TEXT,
  currently_in_uk BOOLEAN,
  relationship_duration_months INTEGER,
  annual_income_range TEXT,
  employment_status TEXT,
  urgency TEXT CHECK (urgency IN ('urgent', 'normal', 'ahead')),
  target_application_date TEXT,
  has_previous_refusal BOOLEAN,
  has_previous_overstay BOOLEAN,
  
  -- Progress
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  checklist_progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Payment (per application)
  purchased_tier TEXT NOT NULL DEFAULT 'none' CHECK (purchased_tier IN ('none', 'standard', 'premium')),
  stripe_payment_id TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'submitted', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_user_active ON applications(user_id) WHERE status = 'active';

-- Auto-update trigger
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on applications"
  ON applications FOR ALL
  USING (auth.role() = 'service_role');

-- Add application_id to document_uploads (nullable for backwards compat)
ALTER TABLE document_uploads ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES applications(id);
CREATE INDEX IF NOT EXISTS idx_doc_uploads_application ON document_uploads(application_id);

-- Add application_id to payments (nullable for backwards compat)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'application_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN application_id UUID;
  END IF;
END $$;

COMMENT ON TABLE applications IS 'Visa applications — one user can have multiple';
COMMENT ON COLUMN applications.purchased_tier IS 'Payment tier for THIS application (none/standard/premium)';
COMMENT ON COLUMN applications.checklist_progress IS 'JSON map of checklist item IDs to boolean checked state';
