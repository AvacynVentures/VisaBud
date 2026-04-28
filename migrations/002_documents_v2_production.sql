-- Production-grade documents table
-- Includes atomic transaction safety, proper indexing, and audit fields

DROP TABLE IF EXISTS documents CASCADE;

CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  document_id TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  requirement TEXT,
  mime_type TEXT CHECK (mime_type IN ('image/jpeg', 'image/png', 'application/pdf')),
  
  -- Validation state machine
  validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'error')),
  validation_feedback TEXT,
  validation_attempts INTEGER DEFAULT 0,
  validation_started_at TIMESTAMP WITH TIME ZONE,
  validation_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit and tracing
  request_id TEXT, -- For tracing related requests
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_document_id CHECK (length(document_id) > 0),
  CONSTRAINT valid_file_path CHECK (length(file_path) > 0),
  CONSTRAINT valid_file_name CHECK (length(file_name) > 0)
);

-- Indexes for query efficiency
CREATE INDEX idx_documents_document_id ON documents(document_id);
CREATE INDEX idx_documents_status ON documents(validation_status);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_request_id ON documents(request_id);
CREATE INDEX idx_documents_pending ON documents(created_at DESC) WHERE validation_status = 'pending';

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE documents;

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_update_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE documents IS 'Document uploads with async validation tracking';
COMMENT ON COLUMN documents.document_id IS 'Unique identifier for this document';
COMMENT ON COLUMN documents.file_path IS 'Location in visabud-documents Supabase Storage bucket';
COMMENT ON COLUMN documents.validation_status IS 'Current validation state: pending | valid | invalid | error';
COMMENT ON COLUMN documents.request_id IS 'UUID for request tracing, maps to API request logs';
