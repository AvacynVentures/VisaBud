import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

// ─── Document requirement checklists by type with GOV.UK links ────────────────────────────────

interface RequirementWithLink {
  requirement: string;
  govukLink: string;
}

const DOCUMENT_REQUIREMENTS: Record<string, RequirementWithLink[]> = {
  passport: [
    { requirement: 'Full name visible', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
    { requirement: 'Date of birth visible', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
    { requirement: 'Passport number visible', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
    { requirement: 'Photo matches current appearance', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
    { requirement: 'Expiry date visible and 6+ months validity', govukLink: 'https://www.gov.uk/browse/visas-immigration/settle-in-the-uk' },
    { requirement: 'Machine-readable zone (MRZ) fully visible', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
    { requirement: 'Issuing country/authority visible', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
    { requirement: 'Bio page complete and unobstructed', govukLink: 'https://www.gov.uk/guidance/prove-your-identity-with-a-passport' },
  ],
  'bank statement': [
    { requirement: 'Account holder name visible', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
    { requirement: 'Sort code and account number visible', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
    { requirement: 'Statement period covers required dates', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
    { requirement: 'All transactions visible and readable', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
    { requirement: 'Bank name/logo visible', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
    { requirement: 'Regular salary credits identifiable', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Closing balance visible', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
    { requirement: 'Statement is from a UK-regulated bank', govukLink: 'https://www.gov.uk/guidance/prove-financial-ability-to-study-in-the-uk' },
  ],
  payslip: [
    { requirement: 'Employee full name visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Employer name visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Pay period/date visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Gross salary amount visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Net pay visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Tax deductions shown', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'National Insurance number visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
    { requirement: 'Employer PAYE reference visible', govukLink: 'https://www.gov.uk/guidance/prove-your-income' },
  ],
  'utility bill': [
    { requirement: 'Full name visible', govukLink: 'https://www.gov.uk/guidance/prove-your-place-of-residence' },
    { requirement: 'Full UK address visible', govukLink: 'https://www.gov.uk/guidance/prove-your-place-of-residence' },
    { requirement: 'Date within last 3 months', govukLink: 'https://www.gov.uk/guidance/prove-your-place-of-residence' },
    { requirement: 'Utility provider name visible', govukLink: 'https://www.gov.uk/guidance/prove-your-place-of-residence' },
    { requirement: 'Account/reference number visible', govukLink: 'https://www.gov.uk/guidance/prove-your-place-of-residence' },
    { requirement: 'Amount due or paid visible', govukLink: 'https://www.gov.uk/guidance/prove-your-place-of-residence' },
  ],
  'employer letter': [
    { requirement: 'Company letterhead visible', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Date within 28 days of application', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Employee full name mentioned', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Job title stated', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Annual salary confirmed', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Start date of employment', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Contract type (permanent/fixed-term)', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
    { requirement: 'Signatory name and position', govukLink: 'https://www.gov.uk/guidance/visa-sponsorship-a-guide-for-employers' },
  ],
  default: [
    { requirement: 'Document is complete and uncut', govukLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'All text is readable', govukLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Document appears authentic', govukLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Relevant dates are visible', govukLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Names are visible and match application', govukLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Document is current (not expired)', govukLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
  ],
};

function getRequirementsForDocType(docTitle: string): RequirementWithLink[] {
  const lower = docTitle.toLowerCase();
  for (const [key, reqs] of Object.entries(DOCUMENT_REQUIREMENTS)) {
    if (lower.includes(key)) return reqs;
  }
  return DOCUMENT_REQUIREMENTS.default;
}

function calculateChecklistScore(
  items: Array<{ met: boolean }>,
  criticalMissing: string[],
): number {
  if (!items.length) return 0;
  
  const metCount = items.filter(i => i.met).length;
  const total = items.length;
  const metRatio = metCount / total;

  // Critical missing items = hard cap at 29%
  if (criticalMissing.length > 0) {
    return Math.min(29, Math.round(metRatio * 29));
  }

  // Score bands based on how many items are met
  if (metRatio >= 1.0) return Math.round(85 + metRatio * 15); // 85-100%
  if (metRatio >= 0.75) return Math.round(70 + (metRatio - 0.75) * 56); // 70-84%
  if (metRatio >= 0.5) return Math.round(50 + (metRatio - 0.5) * 80);  // 50-69%
  if (metRatio >= 0.25) return Math.round(30 + (metRatio - 0.25) * 80); // 30-49%
  return Math.round(metRatio * 120); // 0-29%
}

/**
 * POST /api/ai-confidence
 * AI Confidence Scoring with CHECKLIST and RECOMMENDATIONS (Fix 5: replaces SWOT)
 * Requires Premium tier
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify auth
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // Verify tier access (premium)
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: userData } = await supabaseServer
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (userData) {
      const { data: payments } = await supabaseServer
        .from('payments')
        .select('amount_pence, product_type')
        .eq('user_id', userData.id)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      const payment = payments?.[0];
      if (!payment) {
        return NextResponse.json({ error: 'Premium tier required for AI Confidence Scoring' }, { status: 403 });
      }

      if (payment.amount_pence < 14900 && payment.product_type !== 'premium_review') {
        return NextResponse.json({ error: 'Upgrade to Premium for AI Confidence Scoring' }, { status: 403 });
      }
    }

    const { image, requirement, mimeType, docTitle, visaType, documentId } = await req.json();

    if (!requirement) {
      return NextResponse.json({ error: 'Missing requirement' }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ error: 'No document image provided. Please re-upload the document and try again.' }, { status: 400 });
    }

    const result = await analyzeWithChecklist({
      image,
      requirement,
      mimeType: mimeType || 'image/jpeg',
      docTitle: docTitle || 'Document',
      visaType: visaType || 'spouse',
    });

    // Store result in ai_reports table (best effort — don't fail if this errors)
    try {
      if (user && documentId) {
        // Get current version
        const { data: existing } = await supabaseServer
          .from('ai_reports')
          .select('version')
          .eq('user_id', user.id)
          .eq('document_id', documentId)
          .order('version', { ascending: false })
          .limit(1);

        const nextVersion = (existing?.[0]?.version || 0) + 1;

        await supabaseServer.from('ai_reports').insert({
          user_id: user.id,
          document_id: documentId || docTitle,
          document_name: docTitle || 'Document',
          confidence_score: result.confidence,
          flags: result.flags.map((f: string) => ({ text: f, severity: 'medium' })),
          swot: result.swot,
          recommendations: result.recommendations.map((r: string) => ({ step: '', description: r })),
          generated_at: new Date().toISOString(),
          version: nextVersion,
        });
      }
    } catch (storeErr) {
      console.warn('[ai-confidence] Failed to store report:', storeErr);
    }

    return NextResponse.json(result);
  } catch (error) {
    // Fix 2: Mark as FAILED with honest scoring
    console.error('AI Confidence scoring error:', error);
    return NextResponse.json({
      confidence: 0,
      checklist: { items: [], overallScore: 0, criticalMissing: [], nextSteps: ['Retry the analysis — the service encountered an error.'] },
      flags: ['Analysis could not be completed — this is NOT a reflection of document quality'],
      recommendations: ['Please retry. If the issue persists, contact support.'],
      provider: 'fallback',
      pendingValidation: true,
      analysisComplete: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latencyMs: Date.now() - startTime,
    });
  }
}

interface ConfidenceInput {
  image: string;
  requirement: string;
  mimeType: string;
  docTitle: string;
  visaType: string;
}

interface ChecklistItem {
  requirement: string;
  met: boolean;
  evidence: string;
  suggestedFix: string | null;
  govukLink: string;  // Link to official gov.uk guidance for this requirement
}

interface ConfidenceResult {
  confidence: number;
  checklist: {
    items: ChecklistItem[];
    overallScore: number;
    criticalMissing: string[];
    nextSteps: string[];
  };
  flags: string[];
  recommendations: string[];
  provider: string;
  latencyMs: number;
  analysisComplete: boolean;
  // Legacy SWOT field — empty but present for backward compatibility
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

async function analyzeWithChecklist(input: ConfidenceInput): Promise<ConfidenceResult> {
  const start = Date.now();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const isPdf = input.mimeType === 'application/pdf';
  const mediaType = isPdf ? 'application/pdf' : 
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(input.mimeType) 
      ? input.mimeType 
      : 'image/jpeg';

  const requirements = getRequirementsForDocType(input.docTitle);
  const requirementsList = requirements.map((r, i) => `${i + 1}. ${r.requirement}`).join('\n');

  const contentBlocks: any[] = [
    { type: 'text', text: `This is a ${input.docTitle} for a UK ${input.visaType} visa application.
Requirement: ${input.requirement}

Required checklist for ${input.docTitle}:
${requirementsList}

Analyze the image and check each requirement:
- Is it present and visible?
- Is it complete?
- Is it correct?

For each requirement, respond with:
- Requirement name
- Met: YES/NO
- Evidence: What you see (or don't see)
- Fix: How to correct if not met (null if met)

Also identify any CRITICAL items that are missing (items whose absence would cause UKVI to reject the application).

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "items": [
    {
      "requirement": "requirement name",
      "met": true,
      "evidence": "what you see",
      "suggestedFix": null
    }
  ],
  "criticalMissing": ["item that would cause rejection"],
  "recommendations": ["specific actionable step"]
}` },
  ];

  if (isPdf) {
    contentBlocks.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: input.image },
    });
  } else {
    contentBlocks.push({
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: input.image },
    });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.2,
      system: `You are a senior UK immigration document analyst with 15+ years of UKVI experience. You check documents against specific requirement checklists. You are precise, evidence-based, and never guess — if you can't see something, say so. You always respond with valid JSON only.`,
      messages: [{ role: 'user', content: contentBlocks }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('[ai-confidence] API error:', response.status, errBody);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || '';
  const latencyMs = Date.now() - start;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      const items: ChecklistItem[] = Array.isArray(parsed.items) 
        ? parsed.items.map((item: any) => {
            // Find the matching requirement to get gov.uk link
            const matchedReq = requirements.find(r => r.requirement === item.requirement);
            return {
              requirement: item.requirement || 'Unknown',
              met: !!item.met,
              evidence: item.evidence || '',
              suggestedFix: item.suggestedFix || null,
              govukLink: matchedReq?.govukLink || 'https://www.gov.uk/apply-to-come-to-the-uk',
            };
          })
        : [];

      const criticalMissing: string[] = Array.isArray(parsed.criticalMissing) ? parsed.criticalMissing : [];
      const recommendations: string[] = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

      // Calculate score from checklist — CODE does the math, not the LLM
      const overallScore = calculateChecklistScore(items, criticalMissing);

      // Build flags from unmet items
      const flags = items
        .filter(i => !i.met)
        .map(i => `${i.requirement}: ${i.evidence}`);

      // Next steps: unmet item fixes + recommendations
      const nextSteps = [
        ...items.filter(i => !i.met && i.suggestedFix).map(i => i.suggestedFix!),
        ...recommendations,
      ];

      return {
        confidence: overallScore,
        checklist: {
          items,
          overallScore,
          criticalMissing,
          nextSteps,
        },
        flags: flags.length > 0 ? flags : ['No issues found'],
        recommendations,
        provider: 'claude',
        latencyMs,
        analysisComplete: true,
        // Legacy SWOT — populated from checklist for backward compatibility
        swot: {
          strengths: items.filter(i => i.met).map(i => `${i.requirement}: ${i.evidence}`),
          weaknesses: items.filter(i => !i.met).map(i => `${i.requirement}: ${i.evidence}`),
          opportunities: recommendations,
          threats: criticalMissing.map(c => `Critical: ${c} — may cause rejection`),
        },
      };
    }
  } catch (e) {
    console.error('[ai-confidence] Parse error:', e);
  }

  // Fix 3: Return 0% with error flag instead of fake 50%
  return {
    confidence: 0,
    checklist: {
      items: [],
      overallScore: 0,
      criticalMissing: [],
      nextSteps: ['Re-upload a clearer, higher resolution image', 'Ensure the full document is visible', 'Use a colour scan at 300 DPI'],
    },
    flags: ['Unable to analyze document — please ensure image is clear and retry'],
    recommendations: ['Re-upload a clearer, higher resolution image', 'Ensure the full document is visible', 'Use a colour scan at 300 DPI'],
    provider: 'claude',
    latencyMs,
    analysisComplete: false,
    swot: {
      strengths: [],
      weaknesses: ['Analysis could not be completed'],
      opportunities: ['Re-upload a clearer version for better analysis'],
      threats: ['Unvalidated documents may delay UKVI processing'],
    },
  };
}
