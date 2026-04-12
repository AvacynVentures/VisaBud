import { NextRequest, NextResponse } from 'next/server';
import { getVisionProvider } from '@/lib/get-vision-provider';
import { trackExpertReview } from '@/lib/supabase';

export const maxDuration = 60; // Premium review can take longer

// ─── Types (kept for cross-document validation — commented out but preserved) ───

/* interface CrossDocumentFlag {
  relatedDocId: string;
  relatedDocTitle: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
} */

/* interface FullReviewResult {
  documentResults: Record<string, PremiumValidationResult>;
  crossDocumentFlags: CrossDocumentFlag[];
  overallRiskLevel: 'high' | 'medium' | 'low';
  overallConfidence: number;
  summaryFeedback: string;
} */

// ─── Cross-Document Validation (preserved for future use) ───────────────────

/* async function validateCrossDocuments(
  documents: Array<{ docId: string; docTitle: string; feedback: string; issues: any[] }>,
  visaType: string,
  applicationContext: string,
  apiKey: string
): Promise<{ flags: CrossDocumentFlag[]; summary: string }> {
  // ... cross-document validation logic (will be migrated to provider abstraction later)
  return { flags: [], summary: 'Cross-document validation completed with no major flags.' };
} */

// ─── POST: Single document premium review ───────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { image, requirement, mimeType, docId, docTitle, visaType } = await req.json();

    if (!image || !requirement || !docId) {
      return NextResponse.json(
        { error: 'Missing required fields: image, requirement, docId' },
        { status: 400 }
      );
    }

    // TODO: Verify user has premium_tier = 'ai_review_149' or 'human_review_199'

    const provider = getVisionProvider();
    const result = await provider.premiumReview({
      image,
      mimeType: mimeType || 'image/jpeg',
      docId,
      docTitle: docTitle || requirement,
      requirement,
      visaType: visaType || 'spouse',
    });

    console.log(
      `[premium-review] provider=${result.provider} latency=${result.latencyMs}ms risk=${result.riskLevel} confidence=${result.confidenceScore} doc=${docId}`
    );

    // Track expert review silently (non-blocking)
    trackExpertReview(visaType || 'spouse').catch(() => {});

    return NextResponse.json(result);
  } catch (error) {
    console.error('Premium review error:', error);
    return NextResponse.json(
      { error: 'Internal server error during premium review' },
      { status: 500 }
    );
  }
}
