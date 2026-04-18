import { NextRequest, NextResponse } from 'next/server';
import { getTimelineData } from '@/lib/timeline-data';

export const maxDuration = 60;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Gov.uk links database
const GOV_UK_LINKS: Record<string, Record<string, string>> = {
  spouse: {
    overview: 'https://www.gov.uk/uk-family-visa',
    application: 'https://www.gov.uk/apply-to-come-to-the-uk',
    documents: 'https://www.gov.uk/uk-family-visa/documents-you-must-provide',
    fees: 'https://www.gov.uk/uk-family-visa/fees-and-how-to-pay',
    income: 'https://www.gov.uk/guidance/prove-your-income-for-family-visas',
    biometrics: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration/about/about-us',
    status: 'https://visas-immigration.service.gov.uk/apply-online/visa-status',
  },
  skilled_worker: {
    overview: 'https://www.gov.uk/skilled-worker-visa',
    application: 'https://www.gov.uk/apply-to-come-to-the-uk',
    documents: 'https://www.gov.uk/skilled-worker-visa/documents-you-must-provide',
    fees: 'https://www.gov.uk/skilled-worker-visa/fees-and-how-to-pay',
    salary: 'https://www.gov.uk/guidance/salary-requirements-for-workers',
    cos: 'https://www.gov.uk/guidance/employing-people-from-outside-the-uk',
    status: 'https://visas-immigration.service.gov.uk/apply-online/visa-status',
  },
  citizenship: {
    overview: 'https://www.gov.uk/becoming-a-british-citizen',
    application: 'https://www.gov.uk/becoming-a-british-citizen/apply',
    documents: 'https://www.gov.uk/becoming-a-british-citizen/documents-you-must-provide',
    fees: 'https://www.gov.uk/becoming-a-british-citizen/fees',
    lifeInUkTest: 'https://www.gov.uk/life-in-the-uk-test',
    status: 'https://visas-immigration.service.gov.uk/apply-online/visa-status',
  },
};

/**
 * Build system prompt with user context
 */
function buildSystemPrompt(userContext: {
  visaType: string;
  nationality?: string;
  urgency?: string;
  documentCompletionPercent?: number;
  verifiedDocuments?: string[];
  annualIncomeRange?: string;
  purchasedTier?: string;
}): string {
  const timeline = getTimelineData(userContext.visaType);
  const govLinks = GOV_UK_LINKS[userContext.visaType] || GOV_UK_LINKS.spouse;
  
  const timelineText = timeline.stages
    .map((s, i) => `${i + 1}. ${s.label}: ${s.detail}`)
    .join('\n');

  return `You are a friendly, knowledgeable UK visa advisor for VisaBud. You help users understand their visa application process and answer questions.

USER CONTEXT:
- Visa Type: ${userContext.visaType}
- Nationality: ${userContext.nationality || 'Not provided'}
- Timeline Urgency: ${userContext.urgency || 'Standard'}
- Documents Uploaded: ${userContext.verifiedDocuments?.join(', ') || 'None yet'}
- Document Completion: ${userContext.documentCompletionPercent || 0}%
- Annual Income: ${userContext.annualIncomeRange || 'Not provided'}
- Purchased Tier: ${userContext.purchasedTier || 'Free checklist only'}

TIMELINE FOR ${userContext.visaType.toUpperCase()} VISA:
${timelineText}

OFFICIAL GOVERNMENT LINKS:
${Object.entries(govLinks)
  .map(([key, url]) => `- ${key}: ${url}`)
  .join('\n')}

INSTRUCTIONS:
1. Answer questions about their specific visa type and timeline
2. Reference the timeline stages and lead times above
3. Provide gov.uk links when relevant
4. Be honest about processing times and requirements
5. Suggest next steps based on their progress
6. If they ask about submission, link to the official application portal
7. Keep responses concise but helpful
8. Use markdown formatting for clarity (bold for key points, bullets for lists)
9. Always end complex answers with a relevant gov.uk link

You are empathetic, accurate, and always encourage users to verify on gov.uk before submitting.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      conversationHistory = [],
      userContext = {},
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build system prompt with user context
    const systemPrompt = buildSystemPrompt(userContext);

    // Prepare messages for Claude
    const messages: Message[] = [
      ...conversationHistory.slice(-19), // Keep last 19 for context window
      { role: 'user', content: message },
    ];

    // Call Claude API via fetch
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[visa-advisor] Claude API error:', response.status, error);

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limited. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to get response from advisor' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text || '';

    return NextResponse.json({
      success: true,
      response: assistantMessage,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      },
    });
  } catch (err: any) {
    console.error('[visa-advisor] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
