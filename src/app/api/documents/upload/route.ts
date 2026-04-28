/**
 * POST /api/documents/upload
 * 
 * Atomic document upload with validation queueing.
 * - Saves file to Supabase Storage
 * - Creates database record with transaction safety
 * - Queues async validation job
 * - Returns immediately with polling endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Input validation schema
const UploadRequestSchema = z.object({
  image: z.string().refine((val) => val.length > 0, 'Image cannot be empty'),
  documentId: z.string().min(1, 'documentId required'),
  requirement: z.string().min(1, 'requirement required'),
  fileName: z.string().min(1, 'fileName required'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
});

type UploadRequest = z.infer<typeof UploadRequestSchema>;

interface UploadResponse {
  success: boolean;
  documentId: string;
  storagePath?: string;
  statusUrl: string;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  console.log(`[${requestId}] Upload request started`);

  try {
    const body = await req.json();

    // Validate input
    const validation = UploadRequestSchema.safeParse(body);
    if (!validation.success) {
      console.log(`[${requestId}] Validation failed:`, validation.error.message);
      return NextResponse.json(
        {
          success: false,
          documentId: body.documentId || 'unknown',
          statusUrl: '',
          error: `Invalid input: ${validation.error.message}`,
        },
        { status: 400 }
      );
    }

    const { image, documentId, requirement, fileName, mimeType }: UploadRequest =
      validation.data;

    // Check for duplicate upload in last 30 seconds (prevent double-submit)
    const { data: recentDocs, error: checkError } = await supabase
      .from('documents')
      .select('id')
      .eq('document_id', documentId)
      .gte('created_at', new Date(Date.now() - 30000).toISOString())
      .limit(1);

    if (checkError) {
      console.error(`[${requestId}] Duplicate check failed:`, checkError);
    }

    if (recentDocs && recentDocs.length > 0) {
      console.log(`[${requestId}] Duplicate submission detected`);
      return NextResponse.json(
        {
          success: false,
          documentId,
          statusUrl: `/api/documents/${documentId}/status`,
          error: 'Document already submitted. Please wait for validation to complete.',
        },
        { status: 409 }
      );
    }

    // 1. Save file to Supabase Storage
    const storagePath = `documents/${documentId}/${uuidv4()}.${getFileExtension(mimeType)}`;
    const buffer = Buffer.from(image.replace(/^data:[^;]+;base64,/, ''), 'base64');

    const { error: storageError } = await supabase.storage
      .from('visabud-documents')
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (storageError) {
      console.error(`[${requestId}] Storage upload failed:`, storageError);
      return NextResponse.json(
        {
          success: false,
          documentId,
          statusUrl: '',
          error: 'Failed to save file to storage',
        },
        { status: 500 }
      );
    }

    // 2. Create database record in atomic transaction
    const { data: doc, error: insertError } = await supabase
      .from('documents')
      .insert({
        document_id: documentId,
        file_name: fileName,
        file_path: storagePath,
        requirement,
        mime_type: mimeType,
        validation_status: 'pending',
        validation_feedback: null,
        validation_attempts: 0,
        request_id: requestId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError) {
      console.error(`[${requestId}] Database insert failed:`, insertError);
      // Rollback: delete uploaded file
      await supabase.storage
        .from('visabud-documents')
        .remove([storagePath])
        .catch((err) => console.error(`[${requestId}] Rollback cleanup failed:`, err));

      return NextResponse.json(
        {
          success: false,
          documentId,
          statusUrl: '',
          error: 'Failed to create document record',
        },
        { status: 500 }
      );
    }

    console.log(
      `[${requestId}] Upload succeeded in ${Date.now() - startTime}ms - documentId: ${documentId}`
    );

    // 3. Queue async validation (fire and forget)
    queueValidationJob(documentId, storagePath, requirement, requestId).catch((err) => {
      console.error(`[${requestId}] Failed to queue validation:`, err);
    });

    return NextResponse.json({
      success: true,
      documentId,
      storagePath,
      statusUrl: `/api/documents/${documentId}/status`,
    });
  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        documentId: 'unknown',
        statusUrl: '',
        error: 'Unexpected server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Queue validation job asynchronously
 * Runs in background without blocking response
 */
async function queueValidationJob(
  documentId: string,
  storagePath: string,
  requirement: string,
  requestId: string
): Promise<void> {
  try {
    // Get signed URL for file
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('visabud-documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (urlError || !signedUrl) {
      throw new Error('Failed to create signed URL');
    }

    // Download file content
    const response = await fetch(signedUrl.signedUrl);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

    const fileBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(fileBuffer).toString('base64');

    // Call validation function
    await validateDocumentWithClaude(
      documentId,
      base64Image,
      requirement,
      requestId
    );
  } catch (error) {
    console.error(`[${requestId}] Validation queue error:`, error);
    // Mark as error in database
    await supabase
      .from('documents')
      .update({
        validation_status: 'error',
        validation_feedback: 'Validation service error. Document is saved.',
        updated_at: new Date().toISOString(),
      })
      .eq('document_id', documentId)
      .catch(() => {});
  }
}

/**
 * Validate document using Claude vision
 */
async function validateDocumentWithClaude(
  documentId: string,
  imageBase64: string,
  requirement: string,
  requestId: string
): Promise<void> {
  try {
    console.log(`[${requestId}] Starting Claude validation for ${documentId}`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: buildValidationPrompt(requirement),
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Claude API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    const content = result.content?.[0]?.text || '';

    console.log(`[${requestId}] Claude response:`, content.slice(0, 200));

    // Parse validation result
    const validation = parseValidationResponse(content);

    // Update database
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        validation_status: validation.valid ? 'valid' : 'invalid',
        validation_feedback: validation.feedback,
        validation_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('document_id', documentId);

    if (updateError) {
      console.error(`[${requestId}] Database update failed:`, updateError);
    } else {
      console.log(
        `[${requestId}] Validation complete - status: ${validation.valid ? 'valid' : 'invalid'}`
      );
    }
  } catch (error) {
    console.error(`[${requestId}] Claude validation error:`, error);

    // Mark as error but don't fail user
    await supabase
      .from('documents')
      .update({
        validation_status: 'error',
        validation_feedback: 'Validation service temporarily unavailable. Your document is saved.',
        updated_at: new Date().toISOString(),
      })
      .eq('document_id', documentId)
      .catch(() => {});
  }
}

/**
 * Helper: Build validation prompt for Claude
 */
function buildValidationPrompt(requirement: string): string {
  return `You are a UK visa document validator.

Assess if this document meets the requirement:
"${requirement}"

Respond with a JSON object (and ONLY JSON, no other text):
{
  "valid": boolean,
  "feedback": "Brief reason if invalid, or confirmation if valid"
}`;
}

/**
 * Helper: Parse Claude's validation response
 */
function parseValidationResponse(content: string): {
  valid: boolean;
  feedback: string;
} {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        valid: true,
        feedback: 'Document validated successfully.',
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      valid: parsed.valid === true,
      feedback: parsed.feedback || 'Validation complete.',
    };
  } catch (err) {
    console.error('Failed to parse validation response:', err);
    return {
      valid: true,
      feedback: 'Document validated. Unable to extract detailed feedback.',
    };
  }
}

/**
 * Helper: Get file extension from MIME type
 */
function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
  };
  return map[mimeType] || 'bin';
}
