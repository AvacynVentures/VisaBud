import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/documents/{documentId}/status
 * Lightweight polling endpoint - returns current validation status
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { documentId } = params;

    const { data: doc, error } = await supabase
      .from('documents')
      .select('validation_status, validation_feedback, file_name, mime_type')
      .eq('document_id', documentId)
      .single();

    if (error || !doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      documentId,
      status: doc.validation_status, // pending | valid | invalid | error
      feedback: doc.validation_feedback,
      fileName: doc.file_name,
    });
  } catch (error) {
    console.error('[GET /api/documents/[id]/status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
