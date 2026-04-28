/**
 * Document Upload Types — Shared between frontend and backend
 * 
 * Architecture:
 *   Upload (instant, free) → AI Check (async, Premium, button-triggered)
 */

// ─── AI Pipeline Status ─────────────────────────────────────────────────────

export type AIStatus =
  | 'none'         // No AI run yet
  | 'queued'       // AI check requested
  | 'classifying'  // Step 1: Is this a document?
  | 'analyzing'    // Step 2: Full checklist scoring
  | 'complete'     // Done
  | 'failed';      // Error (document still saved)

// ─── Database Row ───────────────────────────────────────────────────────────

export interface DocumentUploadRow {
  id: string;
  user_id: string;
  checklist_item_id: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size_bytes: number;
  ai_status: AIStatus;
  is_document: boolean | null;
  is_visa_relevant: boolean | null;
  detected_type: string | null;
  classification_feedback: string | null;
  confidence_score: number | null;
  checklist_items: ChecklistResult[] | null;
  critical_missing: string[] | null;
  recommendations: string[] | null;
  flags: Flag[] | null;
  scoring_feedback: string | null;
  replaced_by: string | null;
  ai_requested_at: string | null;
  ai_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Checklist Item (from AI analysis) ──────────────────────────────────────

export interface ChecklistResult {
  requirement: string;
  met: boolean;
  evidence: string;
  suggestedFix: string | null;
  govLink: string;
}

export interface Flag {
  text: string;
  severity: 'high' | 'medium' | 'low';
}

// ─── API Request/Response Types ─────────────────────────────────────────────

export interface UploadRequest {
  checklistItemId: string;
}

export interface UploadResponse {
  success: boolean;
  id: string;
  fileName: string;
  downloadUrl: string;
  error?: string;
}

export interface AICheckResponse {
  success: boolean;
  statusUrl: string;
  error?: string;
}

export interface DocumentStatusResponse {
  id: string;
  checklistItemId: string;
  fileName: string;
  mimeType: string;
  aiStatus: AIStatus;
  // Classification (Step 1)
  isDocument: boolean | null;
  isVisaRelevant: boolean | null;
  detectedType: string | null;
  classificationFeedback: string | null;
  // Scoring (Step 2)
  confidenceScore: number | null;
  checklistItems: ChecklistResult[] | null;
  criticalMissing: string[] | null;
  recommendations: string[] | null;
  flags: Flag[] | null;
  scoringFeedback: string | null;
  // Metadata
  aiRequestedAt: string | null;
  aiCompletedAt: string | null;
  createdAt: string;
}

// ─── Frontend State ─────────────────────────────────────────────────────────

export type DocumentDisplayStatus =
  | 'idle'         // No file uploaded
  | 'uploading'    // File being sent to server
  | 'saved'        // File saved, no AI run
  | 'ai-queued'    // AI check requested
  | 'ai-classifying'
  | 'ai-analyzing'
  | 'ai-complete'  // AI done, results available
  | 'ai-failed'    // AI failed, file still available
  | 'error';       // Upload failed

export interface DocumentState {
  status: DocumentDisplayStatus;
  uploadId: string | null;         // Server-side document ID
  fileName: string | null;
  downloadUrl: string | null;
  // AI results (populated after completion)
  isDocument: boolean | null;
  confidenceScore: number | null;
  classificationFeedback: string | null;
  scoringFeedback: string | null;
  checklistItems: ChecklistResult[] | null;
  criticalMissing: string[] | null;
  recommendations: string[] | null;
  flags: Flag[] | null;
}

export const EMPTY_DOCUMENT_STATE: DocumentState = {
  status: 'idle',
  uploadId: null,
  fileName: null,
  downloadUrl: null,
  isDocument: null,
  confidenceScore: null,
  classificationFeedback: null,
  scoringFeedback: null,
  checklistItems: null,
  criticalMissing: null,
  recommendations: null,
  flags: null,
};
