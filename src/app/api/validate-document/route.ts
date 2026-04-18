import { NextRequest, NextResponse } from 'next/server';
import { getVisionProvider } from '@/lib/get-vision-provider';

export const maxDuration = 30;

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
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasAnthropicKey && !hasOpenAIKey) {
      // No AI keys configured — do NOT silently accept (Fix 2)
      console.log('[validate-document] No vision API key configured');
      return NextResponse.json({
        valid: false,
        feedback: 'Document validation is temporarily unavailable. Your document has been saved and will be validated when service recovers. This is not a reflection of document quality.',
        provider: 'none',
        pendingValidation: true,
        latencyMs: Date.now() - startTime,
      });
    }

    const provider = getVisionProvider();

    // ── Fix 1: Classification Gate ──────────────────────────────────────────
    // Classify the document BEFORE quality analysis.
    // If it's not a document or not visa-relevant, reject immediately.
    const classification = await provider.classifyDocument({
      image,
      requirement,
      mimeType,
    });

    console.log(`[validate-document] classification: isDoc=${classification.isDocument} visaRelevant=${classification.isVisaRelevant} type=${classification.detectedType} match=${classification.matchesRequirement}`);

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
