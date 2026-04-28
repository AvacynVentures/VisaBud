// ─── Background document validation logic ───────────────────────────────────
// Called from the upload endpoint via waitUntil() so it runs async after
// the HTTP response has already been sent to the client.

import { supabaseServer } from '@/lib/supabase';
import { getVisionProvider } from '@/lib/get-vision-provider';
import type { ValidationStatus } from '@/lib/document-types';

interface ValidateDocumentJobParams {
  documentId: string;
  storagePath: string;
  requirement: string;
  mimeType: string;
}

/**
 * Run AI validation on an uploaded document.
 * Updates the document_validations row with the result.
 *
 * Designed to be fire-and-forget (called via waitUntil on Vercel).
 */
export async function runDocumentValidation(params: ValidateDocumentJobParams): Promise<void> {
  const { documentId, storagePath, requirement, mimeType } = params;
  const startTime = Date.now();

  console.log(`[doc-validator] Starting validation for ${documentId}`);

  // Mark as processing
  await updateValidationStatus(documentId, 'processing', null, null);

  try {
    // 1. Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseServer
      .storage
      .from('Documents')
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error(`[doc-validator] Failed to download ${storagePath}:`, downloadError);
      await updateValidationStatus(documentId, 'error', 'Failed to retrieve uploaded file for validation.', null);
      return;
    }

    // 2. Convert to base64 for vision API
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // 3. Check API keys
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

    if (!hasAnthropicKey && !hasOpenAIKey) {
      console.error('[doc-validator] No vision API key configured');
      await updateValidationStatus(
        documentId,
        'error',
        'Document validation is temporarily unavailable. Your document has been saved and will be validated when service recovers.',
        null
      );
      return;
    }

    // 4. Get vision provider
    let provider;
    try {
      provider = getVisionProvider();
    } catch (providerErr) {
      console.error('[doc-validator] Provider init failed:', providerErr);
      await updateValidationStatus(
        documentId,
        'error',
        'Document validation service is temporarily unavailable. Your document has been saved.',
        null
      );
      return;
    }

    // 5. Classify first (same logic as original endpoint)
    const isRelationshipPhotoItem =
      requirement.toLowerCase().includes('relationship photograph') ||
      requirement.toLowerCase().includes('communication history');

    if (isRelationshipPhotoItem) {
      // Relationship photo path — skip classification
      const result = await provider.validateDocument({
        image: base64,
        requirement: buildRelationshipPrompt(requirement),
        mimeType,
      });

      console.log(`[doc-validator] Relationship photo result: valid=${result.valid} latency=${Date.now() - startTime}ms`);

      await updateValidationStatus(
        documentId,
        result.valid ? 'valid' : 'invalid',
        result.feedback || null,
        result as unknown as Record<string, unknown>
      );
      return;
    }

    // 6. Classification gate
    const classification = await provider.classifyDocument({
      image: base64,
      requirement,
      mimeType,
    });

    console.log(`[doc-validator] Classification: isDoc=${classification.isDocument} visaRelevant=${classification.isVisaRelevant}`);

    if (!classification.isDocument || !classification.isVisaRelevant) {
      const feedback = classification.isDocument
        ? 'This document does not appear to be relevant to UK visa applications.'
        : 'This does not appear to be a document. Please upload a clear image of your visa-related document.';

      await updateValidationStatus(documentId, 'invalid', feedback, {
        reason: classification.explanation,
        detectedType: classification.detectedType,
      });
      return;
    }

    // 7. Full quality validation
    const result = await provider.validateDocument({ image: base64, requirement, mimeType });

    console.log(`[doc-validator] Validation complete: valid=${result.valid} latency=${Date.now() - startTime}ms`);

    await updateValidationStatus(
      documentId,
      result.valid ? 'valid' : 'invalid',
      result.feedback || null,
      result as unknown as Record<string, unknown>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown validation error';
    console.error(`[doc-validator] Unhandled error for ${documentId}:`, err);

    await updateValidationStatus(
      documentId,
      'error',
      `Validation failed unexpectedly. Your document has been saved. Error: ${message}`,
      null
    );
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function updateValidationStatus(
  documentId: string,
  status: ValidationStatus,
  feedback: string | null,
  validationResult: Record<string, unknown> | null
): Promise<void> {
  const { error } = await supabaseServer
    .from('document_validations')
    .update({
      status,
      feedback,
      validation_result: validationResult,
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  if (error) {
    console.error(`[doc-validator] Failed to update status for ${documentId}:`, error);
  }
}

function buildRelationshipPrompt(requirement: string): string {
  return `RELATIONSHIP EVIDENCE PHOTO: ${requirement}. 

This is a photo being submitted as relationship evidence for a UK spouse/partner visa. Do NOT evaluate it as a document. Evaluate it as a relationship photo.

Check:
1. Does this show two or more people together? (Solo selfies, landscapes, or screenshots are not suitable)
2. Does this look like a genuine relationship context? (couple, family event, holiday, daily life, celebration)
3. Is the photo clear enough to identify the people in it?
4. Does it appear to be from a specific time/place? (Visible dates, landmarks, seasonal cues help)

Tips to include in feedback:
- The Home Office wants photos from different times and places spanning your relationship
- Include photos from: holidays, family gatherings, your home together, cultural events, special occasions
- 15-20 photos total is a good target — quality over quantity
- Photos with visible dates or metadata are strongest

If valid: confirm it looks suitable and suggest what other types of photos would complement it.
If invalid: explain specifically why (e.g., "This appears to be a solo photo — you need photos showing you together with your partner").`;
}
