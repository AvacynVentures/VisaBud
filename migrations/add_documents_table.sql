-- Create documents table for async validation
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  document_id TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  requirement TEXT,
  file_data TEXT, -- base64 encoded
  mime_type TEXT,
  validation_status TEXT NOT NULL DEFAULT 'pending', -- pending | valid | invalid | error
  validation_feedback TEXT,
  validation_attempts INTEGER DEFAULT 0,
  validation_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on document_id for fast lookups
CREATE INDEX idx_documents_document_id ON documents(document_id);

-- Create index on validation_status for querying pending validations
CREATE INDEX idx_documents_status ON documents(validation_status);

-- Enable realtime updates (optional, for webhook notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
