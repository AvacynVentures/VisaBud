import { NextRequest, NextResponse } from 'next/server';
import { getVisionProvider } from '@/lib/get-vision-provider';

export const maxDuration = 30;
export const revalidate = 0; // No caching for validation requests

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const { image, requirement, mimeType } = await req.json();

    if (!image || !requirement) {
      return NextResponse.json(
        { error: 'Missing image or requirement' },
        { status: 400 }
      );
    }

    // Check if vision provider API keys are configured
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY && 
                         process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
    
    if (!hasAnthropicKey && !hasOpenAIKey) {
      // No AI keys configured — do NOT silently accept (Fix 2)
      console.error('[validate-document] CRITICAL: No vision API key configured. Add ANTHROPIC_API_KEY to .env.local');
      return NextResponse.json({
        valid: false,
        feedback: 'Document validation is temporarily unavailable. Your document has been saved and will be validated when service recovers. This is not a reflection of document quality.',
        provider: 'none',
        pendingValidation: true,
        latencyMs: Date.now() - startTime,
        debug: process.env.NODE_ENV === 'development' ? 'Missing ANTHROPIC_API_KEY in .env.local' : undefined,
      }, { status: 503 });
    }

    let provider;
    try {
      provider = getVisionProvider();
    } catch (providerErr: any) {
      console.error('[validate-document] Provider initialization failed:', providerErr.message);
      return NextResponse.json({
        valid: false,
        feedback: 'Document validation is temporarily unavailable. Your document has been saved. This is not a reflection of document quality.',
        provider: 'error',
        pendingValidation: true,
        latencyMs: Date.now() - startTime,
        debug: process.env.NODE_ENV === 'development' ? providerErr.message : undefined,
      }, { status: 503 });
    }

    // ── Fix 1: Classification Gate ──────────────────────────────────────────
    // Classify the document BEFORE quality analysis.
    // If it's not a document or not visa-relevant, reject immediately.
    const classification = await provider.classifyDocument({
      image,
      requirement,
      mimeType,
    });

    console.log(`[validate-document] classification: isDoc=${classification.isDocument} visaRelevant=${classification.isVisaRelevant} type=${classification.detectedType} match=${classification.matchesRequirement}`);

    // ── Relationship photo path ─────────────────────────────────────────
    // Photos of couples are NOT documents — they need a different validation path.
    const isRelationshipPhotoItem = requirement.toLowerCase().includes('relationship photograph') ||
      requirement.toLowerCase().includes('communication history');

    if (isRelationshipPhotoItem) {
      // Skip document classification — validate as a relationship photo instead
      const result = await provider.validateDocument({
        image,
        requirement: `RELATIONSHIP EVIDENCE PHOTO: ${requirement}. 

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
If invalid: explain specifically why (e.g., "This appears to be a solo photo — you need photos showing you together with your partner").`,
        mimeType,
      });

      console.log(`[validate-document] relationship-photo provider=${result.provider} latency=${result.latencyMs}ms valid=${result.valid}`);
      return NextResponse.json(result);
    }

    if (!classification.isDocument || !classification.isVisaRelevant) {
      return NextResponse.json({
        valid: false,
        feedback: classification.isDocument
          ? 'This document does not appear to be relevant to UK visa applications.'
          : 'This does not appear to be a document. Please upload a clear image of your visa-related document.',
        reason: classification.explanation,
        detectedType: classification.detectedType,
        provider: provider.name,
        latencyMs: Date.now() - startTime,
      }, { status: 400 });
    }

    // ── Quality analysis (only reached if classification passed) ────────────
    const result = await provider.validateDocument({ image, requirement, mimeType });

    console.log(`[validate-document] provider=${result.provider} latency=${result.latencyMs}ms valid=${result.valid}`);

    return NextResponse.json(result);
  } catch (error) {
    // Fix 2: Mark as FAILED, not PASSED
    console.error('Document validation error:', error);
    return NextResponse.json({
      valid: false,
      feedback: 'Document validation is temporarily unavailable. Your document has been saved and will be validated when service recovers. This is not a reflection of document quality.',
      provider: 'fallback',
      pendingValidation: true,
      error: error instanceof Error ? error.message : 'Unknown error',
      latencyMs: Date.now() - startTime,
    });
  }
}
