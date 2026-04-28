/**
 * GET /api/documents/{documentId}/status
 * 
 * Lightweight polling endpoint. Returns current AI status + results.
 * Cache: no-cache while pending, 1h cache when complete.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { DocumentStatusResponse } from '@/lib/document-upload-types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<DocumentStatusResponse | { error: string }>> {
  const { documentId } = params;

  try {
    const { data: doc, error } = await supabaseAdmin
      .from('document_uploads')
      .select(`
        id, checklist_item_id, file_name, mime_type, ai_status,
        is_document, is_visa_relevant, detected_type, classification_feedback,
        confidence_score, checklist_items, critical_missing, recommendations,
        flags, scoring_feedback, ai_requested_at, ai_completed_at, created_at
      `)
      .eq('id', documentId)
      .single();

    if (error || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const isTerminal = doc.ai_status === 'complete' || doc.ai_status === 'failed' || doc.ai_status === 'none';
    const cacheControl = isTerminal ? 'public, max-age=3600' : 'no-cache, no-store';

    return NextResponse.json(
      {
        id: doc.id,
        checklistItemId: doc.checklist_item_id,
        fileName: doc.file_name,
        mimeType: doc.mime_type,
        aiStatus: doc.ai_status,
        isDocument: doc.is_document,
        isVisaRelevant: doc.is_visa_relevant,
        detectedType: doc.detected_type,
        classificationFeedback: doc.classification_feedback,
        confidenceScore: doc.confidence_score,
        checklistItems: doc.checklist_items,
        criticalMissing: doc.critical_missing,
        recommendations: doc.recommendations,
        flags: doc.flags,
        scoringFeedback: doc.scoring_feedback,
        aiRequestedAt: doc.ai_requested_at,
        aiCompletedAt: doc.ai_completed_at,
        createdAt: doc.created_at,
      },
      {
        headers: { 'Cache-Control': cacheControl },
      }
    );
  } catch (error) {
    console.error(`[status] Error for ${documentId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
