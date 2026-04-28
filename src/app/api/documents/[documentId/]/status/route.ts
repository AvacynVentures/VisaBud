/**
 * GET /api/documents/{documentId}/status
 * 
 * Lightweight polling endpoint with cache headers for efficiency
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;
  const startTime = Date.now();

  try {
    // Query with minimal fields for efficiency
    const { data: doc, error } = await supabase
      .from('documents')
      .select(
        'id,validation_status,validation_feedback,file_name,created_at,validation_completed_at'
      )
      .eq('document_id', documentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return NextResponse.json(
          {
            documentId,
            status: 'not_found',
            feedback: 'Document not found',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    // Determine elapsed time
    const elapsedMs = Date.now() - new Date(doc.created_at).getTime();
    const validationTimeMs = doc.validation_completed_at
      ? new Date(doc.validation_completed_at).getTime() -
        new Date(doc.created_at).getTime()
      : null;

    const responseData = {
      documentId,
      status: doc.validation_status,
      feedback: doc.validation_feedback,
      fileName: doc.file_name,
      elapsedMs,
      validationTimeMs,
    };

    // Set cache headers
    // - If pending: no cache (needs fresh data)
    // - If complete: cache for 1 hour (status won't change)
    const cacheHeader = doc.validation_status === 'pending' ? 'no-cache' : 'public, max-age=3600';

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error) {
    console.error(`[GET /documents/${documentId}/status]`, error);
    return NextResponse.json(
      {
        documentId,
        status: 'error',
        feedback: 'Failed to fetch status',
      },
      { status: 500 }
    );
  }
}
