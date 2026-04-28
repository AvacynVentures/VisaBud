/**
 * POST /api/documents/upload
 * 
 * Saves file to Supabase Storage + creates DB record.
 * NO AI analysis — that's triggered separately by Premium users.
 * Response time: <500ms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { UploadResponse } from '@/lib/document-upload-types';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
  };
  return map[mimeType] || 'bin';
}

export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  const startTime = Date.now();

  try {
    // 1. Auth check
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, id: '', fileName: '', downloadUrl: '', error: 'Authentication required' },
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
        { success: false, id: '', fileName: '', downloadUrl: '', error: 'Invalid session' },
        { status: 401 }
      );
    }

    // 2. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const checklistItemId = formData.get('checklistItemId') as string | null;

    if (!file || !checklistItemId) {
      return NextResponse.json(
        { success: false, id: '', fileName: '', downloadUrl: '', error: 'Missing file or checklistItemId' },
        { status: 400 }
      );
    }

    // 3. Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, id: '', fileName: file.name, downloadUrl: '', error: 'File type not allowed. Use JPG, PNG, or PDF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, id: '', fileName: file.name, downloadUrl: '', error: 'File too large. Maximum 5MB.' },
        { status: 400 }
      );
    }

    // 4. Check for existing upload (replace if exists)
    const { data: existing } = await supabaseAdmin
      .from('document_uploads')
      .select('id, file_path')
      .eq('user_id', user.id)
      .eq('checklist_item_id', checklistItemId)
      .is('replaced_by', null)
      .maybeSingle();

    // 5. Upload file to Supabase Storage
    const ext = getExtension(file.type);
    const storagePath = `${user.id}/${checklistItemId}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: storageError } = await supabaseAdmin.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      console.error('[upload] Storage error:', storageError);
      return NextResponse.json(
        { success: false, id: '', fileName: file.name, downloadUrl: '', error: 'Failed to save file' },
        { status: 500 }
      );
    }

    // 6. Create DB record
    const { data: doc, error: insertError } = await supabaseAdmin
      .from('document_uploads')
      .insert({
        user_id: user.id,
        checklist_item_id: checklistItemId,
        file_name: file.name,
        file_path: storagePath,
        mime_type: file.type,
        file_size_bytes: file.size,
        ai_status: 'none',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[upload] DB insert error:', insertError);
      // Rollback: delete uploaded file
      await supabaseAdmin.storage.from('documents').remove([storagePath]).catch(() => {});
      return NextResponse.json(
        { success: false, id: '', fileName: file.name, downloadUrl: '', error: 'Failed to create record' },
        { status: 500 }
      );
    }

    // 7. If replacing existing, mark old one
    if (existing) {
      await supabaseAdmin
        .from('document_uploads')
        .update({ replaced_by: doc.id })
        .eq('id', existing.id)
        .catch((err: unknown) => console.warn('[upload] Failed to mark replaced:', err));

      // Clean up old file from storage (best effort)
      if (existing.file_path) {
        await supabaseAdmin.storage
          .from('documents')
          .remove([existing.file_path])
          .catch((_err: unknown) => {});
      }
    }

    console.log(`[upload] Success in ${Date.now() - startTime}ms — user=${user.id} item=${checklistItemId}`);

    return NextResponse.json({
      success: true,
      id: doc.id,
      fileName: file.name,
      downloadUrl: `/api/documents/${doc.id}/download`,
    });
  } catch (error) {
    console.error('[upload] Unexpected error:', error);
    return NextResponse.json(
      { success: false, id: '', fileName: '', downloadUrl: '', error: 'Upload failed' },
      { status: 500 }
    );
  }
}
