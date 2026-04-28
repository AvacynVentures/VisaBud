-- ============================================================
-- VisaBud Document Uploads v3 — Final Production Schema
-- ============================================================
-- Architecture: Upload (instant, free) → AI Check (async, Premium)
-- No AI on upload. AI only triggered by Premium "AI Ready Check" button.
-- ============================================================

-- Drop old tables if they exist (from previous iterations)
DROP TABLE IF EXISTS document_validations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;

-- Core table
CREATE TABLE document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document identity
  checklist_item_id TEXT NOT NULL,      -- e.g. 'sp-valid-passport'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,              -- Path in Supabase Storage bucket
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'application/pdf')),
  file_size_bytes INTEGER NOT NULL,
  
  -- AI analysis status (only runs when Premium user clicks "AI Ready Check")
  ai_status TEXT NOT NULL DEFAULT 'none'
    CHECK (ai_status IN ('none', 'queued', 'classifying', 'analyzing', 'complete', 'failed')),
  -- none: no AI run yet (free users, or Premium before clicking check)
  -- queued: AI check requested, waiting to start
  -- classifying: Step 1 — is this a valid document?
  -- analyzing: Step 2 — full checklist + scoring
  -- complete: AI analysis finished
  -- failed: AI analysis failed (document still saved)
  
  -- Classification result (Step 1)
  is_document BOOLEAN,                  -- Is this actually a document (not a selfie, etc)?
  is_visa_relevant BOOLEAN,             -- Is it relevant to visa applications?
  detected_type TEXT,                   -- What Claude thinks it is (e.g. "UK passport")
  classification_feedback TEXT,         -- Brief human-readable classification
  
  -- Scoring result (Step 2)
  confidence_score INTEGER,             -- 0-100 overall score
  checklist_items JSONB,                -- [{requirement, met, evidence, suggestedFix, govLink}]
  critical_missing JSONB,               -- ["expiry date not visible", ...]
  recommendations JSONB,                -- ["Re-scan with better lighting", ...]
  flags JSONB,                          -- [{text, severity}]
  scoring_feedback TEXT,                -- Overall summary paragraph
  
  -- Metadata
  replaced_by UUID REFERENCES document_uploads(id),
  ai_requested_at TIMESTAMPTZ,         -- When user clicked "AI Ready Check"
  ai_completed_at TIMESTAMPTZ,         -- When AI pipeline finished
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_doc_uploads_user ON document_uploads(user_id);
CREATE INDEX idx_doc_uploads_user_item ON document_uploads(user_id, checklist_item_id)
  WHERE replaced_by IS NULL;
CREATE INDEX idx_doc_uploads_ai_pending ON document_uploads(ai_status)
  WHERE ai_status IN ('queued', 'classifying', 'analyzing');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS doc_uploads_updated_at ON document_uploads;
CREATE TRIGGER doc_uploads_updated_at
  BEFORE UPDATE ON document_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own documents
CREATE POLICY "Users can view own documents"
  ON document_uploads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents"
  ON document_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for backend API)
CREATE POLICY "Service role full access"
  ON document_uploads FOR ALL
  USING (auth.role() = 'service_role');

-- Comments
COMMENT ON TABLE document_uploads IS 'User-uploaded visa documents with optional Premium AI analysis';
COMMENT ON COLUMN document_uploads.ai_status IS 'AI pipeline: none → queued → classifying → analyzing → complete/failed';
COMMENT ON COLUMN document_uploads.checklist_item_id IS 'Maps to frontend checklist item ID (e.g. sp-valid-passport)';
