import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import type { DocumentStatusResponse, DocumentErrorResponse } from '@/lib/document-types';

export const revalidate = 0; // Never cache — always fresh status

/**
 * GET /api/documents/[documentId]/status
 * 
 * Returns the current validation status for a document.
 * Frontend polls this every 2 seconds until status is terminal.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
): Promise<NextResponse<DocumentStatusResponse | DocumentErrorResponse>> {
  try {
    const { documentId } = await params;

    if (!documentId || documentId.length < 10) {
      return NextResponse.json(
        { error: 'Invalid document ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('document_validations')
      .select('id, status, feedback, validation_result, updated_at')
      .eq('id', documentId)
      .single();

    if (error || !data) {
      console.error(`[api/documents/status] Not found: ${documentId}`, error);
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      documentId: data.id as string,
      status: data.status as DocumentStatusResponse['status'],
      feedback: data.feedback as string | null,
      validationResult: data.validation_result as Record<string, unknown> | null,
      updatedAt: data.updated_at as string,
    });
  } catch (err) {
    console.error('[api/documents/status] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch document status' },
      { status: 500 }
    );
  }
}
