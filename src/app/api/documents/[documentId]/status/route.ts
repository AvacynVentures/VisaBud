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
  _req: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<DocumentStatusResponse | { error: string }>> {
  const { documentId } = params;
  const timestamp = new Date().toISOString();

  try {
    console.log(`[status] ${timestamp} Fetching status for ${documentId}`);

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

    if (error) {
      console.error(`[status] DB error for ${documentId}:`, error.message);
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (!doc) {
      console.warn(`[status] No document found for ${documentId}`);
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    console.log(`[status] ${timestamp} Got ai_status="${doc.ai_status}" for ${documentId}`);
    console.log(`[status] ${timestamp} Confidence: ${doc.confidence_score}, IsDocument: ${doc.is_document}`);

    const isTerminal = doc.ai_status === 'complete' || doc.ai_status === 'failed' || doc.ai_status === 'none';
    const cacheControl = isTerminal ? 'public, max-age=3600' : 'no-cache, no-store';

    const response = {
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
    };

    console.log(`[status] ${timestamp} Returning ai_status="${response.aiStatus}" (terminal=${isTerminal})`);

    return NextResponse.json(response, {
      headers: { 'Cache-Control': cacheControl },
    });
  } catch (error) {
    console.error(`[status] Exception for ${documentId}:`, error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
