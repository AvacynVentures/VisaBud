import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/documents
 * Saves a document and queues validation (returns immediately)
 */
export async function POST(req: NextRequest) {
  try {
    const { image, documentId, requirement, fileName, mimeType } = await req.json();

    if (!image || !documentId) {
      return NextResponse.json(
        { error: 'Missing image or documentId' },
        { status: 400 }
      );
    }

    // 1. Save document metadata to DB with 'pending' status
    const { data: doc, error: insertError } = await supabase
      .from('documents')
      .insert({
        document_id: documentId,
        file_name: fileName || 'document',
        requirement,
        file_data: image, // Store base64 for now (or save to Storage)
        mime_type: mimeType,
        validation_status: 'pending', // pending | valid | invalid | error
        validation_feedback: null,
        created_at: new Date().toISOString(),
        validation_attempts: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[POST /api/documents] DB insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save document' },
        { status: 500 }
      );
    }

    // 2. Queue background validation job
    // For now, we'll trigger it asynchronously without waiting
    // In production, use Inngest or a proper job queue
    validateDocumentAsync(documentId, image, requirement).catch((err) => {
      console.error('[POST /api/documents] Async validation failed:', err);
    });

    // 3. Return immediately with status polling URL
    return NextResponse.json({
      success: true,
      documentId,
      status: 'pending',
      statusUrl: `/api/documents/${documentId}/status`,
    });
  } catch (error) {
    console.error('[POST /api/documents] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

/**
 * Async validation job (runs in background without blocking response)
 */
async function validateDocumentAsync(
  documentId: string,
  imageBase64: string,
  requirement: string
) {
  try {
    // Wait a tiny bit to let the DB commit
    await new Promise((r) => setTimeout(r, 100));

    // Call Claude vision
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
                text: `You are a UK visa document validator. Assess if this document meets the requirement: "${requirement}"\n\nRespond with JSON: { "valid": boolean, "feedback": "reason if invalid" }`,
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

    const result = await response.json();
    const content = result.content?.[0]?.text || '';

    let validation: { valid: boolean; feedback?: string } = {
      valid: false,
      feedback: 'Could not validate',
    };

    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        validation = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.error('[validateDocumentAsync] JSON parse error:', parseErr);
    }

    // Update DB with result
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        validation_status: validation.valid ? 'valid' : 'invalid',
        validation_feedback: validation.feedback || null,
        validation_completed_at: new Date().toISOString(),
      })
      .eq('document_id', documentId);

    if (updateError) {
      console.error('[validateDocumentAsync] DB update error:', updateError);
    }
  } catch (error) {
    console.error('[validateDocumentAsync] Fatal error:', error);
    
    // Mark as error in DB
    await supabase
      .from('documents')
      .update({
        validation_status: 'error',
        validation_feedback: 'Validation service error. Document is saved.',
      })
      .eq('document_id', documentId)
      .catch(() => {});
  }
}
