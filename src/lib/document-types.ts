// ─── Shared types for the async document validation system ──────────────────

/** Server-side validation statuses stored in DB */
export type ValidationStatus = 'pending' | 'processing' | 'valid' | 'invalid' | 'error';

/** Row shape from document_validations table */
export interface DocumentValidationRow {
  id: string;
  user_id: string | null;
  doc_id: string;
  requirement: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  status: ValidationStatus;
  feedback: string | null;
  validation_result: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/** Response from POST /api/documents */
export interface DocumentUploadResponse {
  documentId: string;
  status: ValidationStatus;
  message: string;
}

/** Response from GET /api/documents/[documentId]/status */
export interface DocumentStatusResponse {
  documentId: string;
  status: ValidationStatus;
  feedback: string | null;
  validationResult: Record<string, unknown> | null;
  updatedAt: string;
}

/** Error response shape */
export interface DocumentErrorResponse {
  error: string;
  code?: string;
}
