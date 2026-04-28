import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { runDocumentValidation } from '@/lib/document-validator';
import type { DocumentUploadResponse, DocumentErrorResponse } from '@/lib/document-types';

export const maxDuration = 10; // Fast response — validation happens async

/**
 * POST /api/documents
 * 
 * Saves a document to Supabase Storage immediately, creates a validation
 * record in the DB, and kicks off async AI validation via waitUntil().
 * 
 * Returns the documentId so the frontend can poll for status.
 */
export async function POST(req: NextRequest): Promise<NextResponse<DocumentUploadResponse | DocumentErrorResponse>> {
  const startTime = Date.now();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const docId = formData.get('docId') as string | null;
    const requirement = formData.get('requirement') as string | null;

    // ── Validate inputs ─────────────────────────────────────────────────
    if (!file || !docId || !requirement) {
      return NextResponse.json(
        { error: 'Missing required fields: file, docId, requirement' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPG, PNG, or PDF.' },
        { status: 400 }
      );
    }

    // ── Upload to Supabase Storage ──────────────────────────────────────
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `uploads/${docId}/${timestamp}_${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseServer
      .storage
      .from('documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[api/documents] Storage upload failed:', uploadError);
      return NextResponse.json(
        { error: 'Failed to save document. Please try again.' },
        { status: 500 }
      );
    }

    // ── Create validation record in DB ──────────────────────────────────
    const { data: validationRow, error: insertError } = await supabaseServer
      .from('document_validations')
      .insert({
        doc_id: docId,
        requirement,
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        status: 'pending',
        feedback: null,
        validation_result: null,
      })
      .select('id')
      .single();

    if (insertError || !validationRow) {
      console.error('[api/documents] DB insert failed:', insertError);
      // Clean up the uploaded file
      await supabaseServer.storage.from('documents').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to queue document for validation.' },
        { status: 500 }
      );
    }

    const documentId = validationRow.id as string;

    console.log(`[api/documents] Document saved: ${documentId} (${file.name}) in ${Date.now() - startTime}ms`);

    // ── Fire async validation via waitUntil ──────────────────────────────
    // waitUntil keeps the serverless function alive after the response is sent.
    // On Vercel, this is available via the `after` API in Next.js 14+.
    // Fallback: fire-and-forget promise (validation will still run, but the
    // function might get terminated on some platforms).
    const validationPromise = runDocumentValidation({
      documentId,
      storagePath,
      requirement,
      mimeType: file.type,
    });

    // Fire-and-forget: let the validation run in the background.
    // On Vercel, the serverless function stays alive long enough for
    // the promise to complete (especially with maxDuration set).
    // For Next.js 15+, you can wrap this with `after()` from next/server.
    validationPromise.catch((err: unknown) => {
      console.error('[api/documents] Background validation failed:', err);
    });

    // ── Return immediately ──────────────────────────────────────────────
    return NextResponse.json({
      documentId,
      status: 'pending' as const,
      message: 'Document saved. AI validation in progress.',
    }, { status: 201 });

  } catch (err) {
    console.error('[api/documents] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
