/**
 * DELETE /api/documents/{documentId}/delete
 * 
 * Permanently delete a document from the database.
 * Only the owner can delete their own documents.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse> {
  const { documentId } = params;

  try {
    // 1. Auth check
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
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
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // 2. Get document to verify ownership
    const { data: doc, error: docError } = await supabaseAdmin
      .from('document_uploads')
      .select('id, user_id, file_path')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (doc.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // 3. Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('document_uploads')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id); // Extra safety: only delete if user_id matches

    if (deleteError) {
      console.error(`[delete] Failed to delete document ${documentId}:`, deleteError);
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      );
    }

    // 4. Delete from storage (if file exists)
    if (doc.file_path) {
      await supabaseAdmin.storage.from('documents').remove([doc.file_path]).catch(err => {
        console.warn(`[delete] Could not delete file from storage: ${doc.file_path}`, err);
        // Don't fail the entire delete if storage delete fails
      });
    }

    console.log(`[delete] Document ${documentId} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: 'Document deleted',
    });
  } catch (error) {
    console.error('[delete] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
