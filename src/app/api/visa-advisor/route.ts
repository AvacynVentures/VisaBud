import { NextRequest, NextResponse } from 'next/server';
import { getTimelineData } from '@/lib/timeline-data';

export const maxDuration = 60;

/**
 * Message format for Claude API
 */
interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * User context passed from frontend
 */
interface VisaAdvisorContext {
  visaType: string;
  nationality?: string;
  urgency?: string;
  documentCompletionPercent?: number;
  annualIncomeRange?: string;
  purchasedTier?: string;
}

/**
 * Gov.uk links mapped by visa type
 * Ensures we always point to official government guidance
 */
const GOV_UK_LINKS: Record<string, Record<string, string>> = {
  spouse: {
    overview: 'https://www.gov.uk/uk-family-visa',
    apply: 'https://www.gov.uk/apply-to-come-to-the-uk',
    documents: 'https://www.gov.uk/uk-family-visa/documents-you-must-provide',
    fees: 'https://www.gov.uk/uk-family-visa/fees-and-how-to-pay',
    income: 'https://www.gov.uk/guidance/prove-your-income-for-family-visas',
    biometrics: 'https://www.gov.uk/uk-visa-biometrics-appointments',
    status: 'https://visas-immigration.service.gov.uk/apply-online/visa-status',
  },
  skilled_worker: {
    overview: 'https://www.gov.uk/skilled-worker-visa',
    apply: 'https://www.gov.uk/apply-to-come-to-the-uk',
    documents: 'https://www.gov.uk/skilled-worker-visa/documents-you-must-provide',
    fees: 'https://www.gov.uk/skilled-worker-visa/fees-and-how-to-pay',
    salary: 'https://www.gov.uk/guidance/salary-requirements-for-workers',
    cos: 'https://www.gov.uk/guidance/employing-people-from-outside-the-uk',
    status: 'https://visas-immigration.service.gov.uk/apply-online/visa-status',
  },
  citizenship: {
    overview: 'https://www.gov.uk/becoming-a-british-citizen',
    apply: 'https://www.gov.uk/becoming-a-british-citizen/apply',
    documents: 'https://www.gov.uk/becoming-a-british-citizen/documents-you-must-provide',
    fees: 'https://www.gov.uk/becoming-a-british-citizen/fees',
    lifeInUkTest: 'https://www.gov.uk/life-in-the-uk-test',
    status: 'https://visas-immigration.service.gov.uk/apply-online/visa-status',
  },
};

/**
 * Build rich system prompt with user's visa details, timeline, and government links
 * The system prompt guides Claude to provide accurate, contextual advice
 */
function buildSystemPrompt(context: VisaAdvisorContext): string {
  const timeline = getTimelineData(context.visaType);
  const govLinks = GOV_UK_LINKS[context.visaType] || GOV_UK_LINKS.spouse;

  // Format timeline stages as readable text for the prompt
  const timelineDescription = timeline.stages
    .map(
      (stage, i) =>
        `**${i + 1}. ${stage.label}** (${stage.leadDays} days): ${stage.detail}`
    )
    .join('\n\n');

  // Format government links
  const govLinkText = Object.entries(govLinks)
    .map(([topic, url]) => `- **${topic.replace(/([A-Z])/g, ' $1')}**: ${url}`)
    .join('\n');

  return `You are a trusted UK visa advisor for VisaBud, helping applicants understand their specific visa application journey.

## YOUR ROLE
- Provide accurate, up-to-date visa advice based on official UK government guidance
- Answer questions about the application process, documents, timelines, and requirements
- Give context-specific advice based on the applicant's situation
- Always direct users to official gov.uk sources for authoritative information
- Be empathetic but honest about challenges and processing times

## APPLICANT'S SITUATION
- **Visa Type**: ${context.visaType.replace('_', ' ')}
- **Nationality**: ${context.nationality || 'Not provided'}
- **Timeline**: ${context.urgency || 'Standard processing'}
- **Documents Ready**: ${context.documentCompletionPercent || 0}%
- **Income Level**: ${context.annualIncomeRange || 'Not specified'}
- **Access Level**: ${context.purchasedTier || 'Free checklist'}

## TIMELINE FOR THIS VISA
${timelineDescription}

## OFFICIAL GOVERNMENT RESOURCES
${govLinkText}

## TONE & GUIDELINES
1. Be conversational and supportive, not robotic
2. Break down complex processes into clear steps
3. Reference their specific visa type in responses
4. Include relevant gov.uk links with context (not just raw URLs)
5. If unsure about current requirements, direct them to gov.uk
6. Use markdown formatting: **bold** for key terms, bullets for lists
7. End substantive answers with "📌 See: [link]" for relevant gov.uk pages
8. Always remind them to verify requirements directly with gov.uk before submitting

## IMPORTANT NOTES
- Processing times are current as of 2026 but can change
- Financial requirements and eligibility criteria are strict
- Missing documents = automatic refusal
- Always verify current requirements on gov.uk`;
}

/**
 * POST /api/visa-advisor
 * Accepts a chat message and returns advice from Claude
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      conversationHistory = [],
      userContext = { visaType: 'spouse' },
    }: {
      message: string;
      conversationHistory: ClaudeMessage[];
      userContext: VisaAdvisorContext;
    } = body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prevent excessively long messages (abuse/spam)
    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Validate visa type
    const validVisaTypes = ['spouse', 'skilled_worker', 'citizenship'];
    if (!validVisaTypes.includes(userContext.visaType)) {
      return NextResponse.json(
        { error: 'Invalid visa type' },
        { status: 400 }
      );
    }

    // Build system prompt with user context
    const systemPrompt = buildSystemPrompt(userContext);

    // Prepare messages for Claude (keep last 19 for context window management)
    const messages: ClaudeMessage[] = [
      ...conversationHistory.slice(-19),
      { role: 'user', content: message },
    ];

    // Call Claude Haiku (cost-efficient for chat)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 600,
        system: systemPrompt,
        messages,
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[visa-advisor] Claude API error:', {
        status: response.status,
        error: errorText,
      });

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              'I\'m a bit busy right now. Please wait a moment and try again.',
          },
          { status: 429 }
        );
      }

      if (response.status === 401 || response.status === 403) {
        console.error('[visa-advisor] Authentication failed');
        return NextResponse.json(
          { error: 'Service configuration error' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to get advisor response. Please try again.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text || '';

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'Unexpected response format' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: assistantMessage,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[visa-advisor] Unhandled error:', errorMessage);

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
