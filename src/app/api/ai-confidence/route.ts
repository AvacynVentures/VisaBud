import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

/**
 * POST /api/ai-confidence
 * AI Confidence Scoring with FLAGS, SWOT, and RECOMMENDATIONS
 * Requires Premium or Expert tier
 */
export async function POST(req: NextRequest) {
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

    // Verify tier access (premium or expert)
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

      // Check if payment amount indicates premium or expert tier
      const payment = payments?.[0];
      if (!payment) {
        return NextResponse.json({ error: 'Premium or Expert tier required for AI Confidence Scoring' }, { status: 403 });
      }

      // Standard = 5000 pence, Premium = 14900, Expert = 29900
      if (payment.amount_pence < 14900 && payment.product_type !== 'premium_review') {
        return NextResponse.json({ error: 'Upgrade to Premium or Expert for AI Confidence Scoring' }, { status: 403 });
      }
    }

    const { image, requirement, mimeType, docTitle, visaType } = await req.json();

    if (!requirement) {
      return NextResponse.json({ error: 'Missing requirement' }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ error: 'No document image provided. Please re-upload the document and try again.' }, { status: 400 });
    }

    const result = await analyzeWithConfidence({
      image,
      requirement,
      mimeType: mimeType || 'image/jpeg',
      docTitle: docTitle || 'Document',
      visaType: visaType || 'spouse',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Confidence scoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI analysis' },
      { status: 500 }
    );
  }
}

interface ConfidenceInput {
  image: string;
  requirement: string;
  mimeType: string;
  docTitle: string;
  visaType: string;
}

interface ConfidenceResult {
  confidence: number;
  flags: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: string[];
  provider: string;
  latencyMs: number;
}

async function analyzeWithConfidence(input: ConfidenceInput): Promise<ConfidenceResult> {
  const start = Date.now();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const isPdf = input.mimeType === 'application/pdf';
  const mediaType = isPdf ? 'application/pdf' : 
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(input.mimeType) 
      ? input.mimeType 
      : 'image/jpeg';

  const contentBlocks: any[] = [
    { type: 'text', text: `Analyze this document for a UK ${input.visaType} visa application.

Document type: ${input.docTitle}
Requirement: ${input.requirement}

Provide a comprehensive analysis with:
1. CONFIDENCE SCORE (0-100%): How confident are you this document meets UKVI requirements?
2. FLAGS: List any issues found (or "No issues found" if clean)
3. SWOT ANALYSIS:
   - Strengths: What's good about this document
   - Weaknesses: Issues that need attention
   - Opportunities: How to improve the submission
   - Threats: Risks if submitted as-is
4. RECOMMENDATIONS: Specific, actionable steps to improve

Consider:
- Document clarity and resolution
- Completeness of required information
- UKVI format requirements
- Common rejection patterns for this document type
- Technical quality (orientation, cropping, contrast)

Respond ONLY with valid JSON:
{
  "confidence": <number 0-100>,
  "flags": ["flag1", "flag2"],
  "swot": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["opportunity1", "opportunity2"],
    "threats": ["threat1", "threat2"]
  },
  "recommendations": ["rec1", "rec2", "rec3"]
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
      system: `You are a senior UK immigration document analyst with 15+ years of UKVI experience. You provide thorough confidence scoring with FLAGS, SWOT analysis, and actionable recommendations. You always respond with valid JSON only.`,
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
      return {
        confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
        flags: Array.isArray(parsed.flags) ? parsed.flags : [],
        swot: {
          strengths: Array.isArray(parsed.swot?.strengths) ? parsed.swot.strengths : [],
          weaknesses: Array.isArray(parsed.swot?.weaknesses) ? parsed.swot.weaknesses : [],
          opportunities: Array.isArray(parsed.swot?.opportunities) ? parsed.swot.opportunities : [],
          threats: Array.isArray(parsed.swot?.threats) ? parsed.swot.threats : [],
        },
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        provider: 'claude',
        latencyMs,
      };
    }
  } catch (e) {
    console.error('[ai-confidence] Parse error:', e);
  }

  return {
    confidence: 50,
    flags: ['Unable to fully analyze document — please ensure image is clear'],
    swot: {
      strengths: ['Document was uploaded successfully'],
      weaknesses: ['Analysis could not be completed fully'],
      opportunities: ['Re-upload a clearer version for better analysis'],
      threats: ['Unclear documents may delay UKVI processing'],
    },
    recommendations: ['Re-upload a clearer, higher resolution image', 'Ensure the full document is visible', 'Use a colour scan at 300 DPI'],
    provider: 'claude',
    latencyMs,
  };
}
