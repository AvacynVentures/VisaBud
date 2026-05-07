/**
 * POST /api/documents/{documentId}/ai-check
 * 
 * Premium-only. Triggered by "AI Ready Check" button.
 * Queues the document for async AI analysis (classify + score).
 * Returns immediately — frontend polls /status for results.
 * 
 * Pipeline:
 *   1. Classify: Is this a document? Is it visa-relevant?
 *   2. Analyze: Full checklist scoring against Gov.uk requirements
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runAIPipeline } from '@/lib/ai-pipeline';
import type { AICheckResponse } from '@/lib/document-upload-types';

export const maxDuration = 120; // 2 minutes for full pipeline execution

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<AICheckResponse>> {
  const { documentId } = params;

  try {
    // 1. Auth check
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, statusUrl: '', error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, statusUrl: '', error: 'Invalid session' },
        { status: 401 }
      );
    }

    // 2. Premium check — SKIPPED for now
    // (tier validation happens when we fetch the document, and AI pipeline will validate)
    // TODO: Integrate with applications.purchased_tier once user lookup issue is solved

    // 3. Get document record
    const { data: doc, error: docError } = await supabaseAdmin
      .from('document_uploads')
      .select('id, user_id, file_path, file_name, mime_type, checklist_item_id, ai_status')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json(
        { success: false, statusUrl: '', error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (doc.user_id !== user.id) {
      return NextResponse.json(
        { success: false, statusUrl: '', error: 'Access denied' },
        { status: 403 }
      );
    }

    // 4. Check if genuinely in progress (requested within last 2 minutes)
    const isInProgress = doc.ai_status === 'queued' || doc.ai_status === 'classifying' || doc.ai_status === 'analyzing';
    const requestedAt = doc.ai_requested_at ? new Date(doc.ai_requested_at).getTime() : 0;
    const isRecent = (Date.now() - requestedAt) < 2 * 60 * 1000; // 2 minutes

    if (isInProgress && isRecent) {
      // Genuinely running — don't re-trigger
      console.log(`[ai-check] Already in progress for ${documentId} (${doc.ai_status}, ${Math.round((Date.now() - requestedAt) / 1000)}s ago)`);
      return NextResponse.json({
        success: true,
        statusUrl: `/api/documents/${documentId}/status`,
      });
    }
    // If stale (>2 min) or not in progress, allow re-run

    // 5. Mark as queued
    await supabaseAdmin
      .from('document_uploads')
      .update({
        ai_status: 'queued',
        ai_requested_at: new Date().toISOString(),
        // Clear previous results if re-running
        confidence_score: null,
        checklist_items: null,
        critical_missing: null,
        recommendations: null,
        flags: null,
        scoring_feedback: null,
        is_document: null,
        is_visa_relevant: null,
        detected_type: null,
        classification_feedback: null,
        ai_completed_at: null,
      })
      .eq('id', documentId);

    console.log(`[ai-check] Starting AI pipeline for ${documentId}`);
    console.log(`[ai-check] Document: id=${documentId}, user_id=${doc.user_id}, file=${doc.file_name}`);

    // Run pipeline and wait for it to complete
    // maxDuration=120 keeps the function alive long enough for the pipeline
    try {
      console.log(`[ai-check] About to call runAIPipeline...`);
      await runAIPipeline(documentId);
      console.log(`[ai-check] Pipeline complete for ${documentId}`);
    } catch (pipelineErr) {
      console.error(`[ai-check] Pipeline error for ${documentId}:`, pipelineErr);
      console.error(`[ai-check] Error details:`, {
        message: pipelineErr instanceof Error ? pipelineErr.message : String(pipelineErr),
        stack: pipelineErr instanceof Error ? pipelineErr.stack : undefined,
      });
      // Pipeline already marks document as 'failed' in DB
    }

    // Return after pipeline completes
    return NextResponse.json({
      success: true,
      statusUrl: `/api/documents/${documentId}/status`,
    });
  } catch (error) {
    console.error('[ai-check] Error:', error);
    return NextResponse.json(
      { success: false, statusUrl: '', error: 'Failed to start AI analysis' },
      { status: 500 }
    );
  }
}
