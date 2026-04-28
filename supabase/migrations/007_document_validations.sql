-- ============================================================================
-- Migration 007: Async Document Validation Queue
-- ============================================================================
-- Creates the document_validations table used by the async upload system.
-- Documents are uploaded to Supabase Storage bucket "documents" and a row
-- is inserted here with status='pending'. Background validation updates the
-- row to valid/invalid/error. Frontend polls GET /api/documents/{id}/status.
-- ============================================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS document_validations (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  doc_id        text NOT NULL,                        -- frontend document slot ID (e.g. "passport")
  requirement   text NOT NULL,                        -- requirement description for AI prompt
  file_name     text NOT NULL,                        -- original file name
  storage_path  text NOT NULL,                        -- path in Supabase Storage "documents" bucket
  mime_type     text NOT NULL,
  status        text NOT NULL DEFAULT 'pending'       -- pending | processing | valid | invalid | error
    CHECK (status IN ('pending', 'processing', 'valid', 'invalid', 'error')),
  feedback      text,                                 -- human-readable AI feedback
  validation_result jsonb,                            -- full AI response payload
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. Index for fast status polling (by ID — already PK, but status filter helps)
CREATE INDEX IF NOT EXISTS idx_document_validations_status
  ON document_validations(status)
  WHERE status IN ('pending', 'processing');

-- 3. Index for listing a user's documents
CREATE INDEX IF NOT EXISTS idx_document_validations_user_doc
  ON document_validations(user_id, doc_id);

-- 4. Ensure the Storage bucket exists (idempotent — will no-op if it already exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 5. RLS: Users can read their own documents
ALTER TABLE document_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own document validations"
  ON document_validations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Service role (used by the API routes) bypasses RLS automatically.

-- 6. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_document_validations_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_document_validations_updated_at
  BEFORE UPDATE ON document_validations
  FOR EACH ROW
  EXECUTE FUNCTION update_document_validations_updated_at();
