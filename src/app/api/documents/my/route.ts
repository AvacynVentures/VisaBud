/**
 * GET /api/documents/my
 * 
 * Returns all documents for the authenticated user.
 * Used on dashboard load to restore state from server (not localStorage).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get all non-replaced documents for this user
    const { data: docs, error } = await supabaseAdmin
      .from('document_uploads')
      .select(`
        id, checklist_item_id, file_name, mime_type, file_size_bytes,
        ai_status, is_document, is_visa_relevant, detected_type,
        classification_feedback, confidence_score, checklist_items,
        critical_missing, recommendations, flags, scoring_feedback,
        ai_requested_at, ai_completed_at, created_at
      `)
      .eq('user_id', user.id)
      .is('replaced_by', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[my] Query error:', error);
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }

    // Transform to frontend-friendly format
    const documents = (docs || []).map((doc) => ({
      id: doc.id,
      checklistItemId: doc.checklist_item_id,
      fileName: doc.file_name,
      mimeType: doc.mime_type,
      fileSizeBytes: doc.file_size_bytes,
      downloadUrl: `/api/documents/${doc.id}/download`,
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
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('[my] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
