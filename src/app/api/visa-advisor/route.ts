import { NextRequest, NextResponse } from 'next/server';
import { getTimelineData } from '@/lib/timeline-data';

export const maxDuration = 60;

/**
 * Rate limit tracking: IP -> { count, resetTime }
 * Simple in-memory tracking (fine for MVP; use Redis in production)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit: 10 messages per minute per IP
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up old entries
  if (entry && entry.resetTime < now) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);

  if (!current) {
    // First request in window
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return { allowed: true };
  }

  if (current.count >= 10) {
    const retryAfter = Math.ceil((current.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment counter
  current.count++;
  return { allowed: true };
}

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
    income: 'https://www.gov.uk/uk-family-visa',
    biometrics: 'https://www.gov.uk/apply-to-come-to-the-uk',
    status: 'https://www.gov.uk/browse/visas-immigration',
  },
  skilled_worker: {
    overview: 'https://www.gov.uk/skilled-worker-visa',
    apply: 'https://www.gov.uk/apply-to-come-to-the-uk',
    documents: 'https://www.gov.uk/skilled-worker-visa/documents-you-must-provide',
    fees: 'https://www.gov.uk/skilled-worker-visa/fees-and-how-to-pay',
    salary: 'https://www.gov.uk/skilled-worker-visa/salary-requirements',
    cos: 'https://www.gov.uk/skilled-worker-visa',
    status: 'https://www.gov.uk/browse/visas-immigration',
  },
  citizenship: {
    overview: 'https://www.gov.uk/becoming-a-british-citizen',
    apply: 'https://www.gov.uk/becoming-a-british-citizen/apply',
    documents: 'https://www.gov.uk/becoming-a-british-citizen/documents-you-must-provide',
    fees: 'https://www.gov.uk/becoming-a-british-citizen/fees',
    lifeInUkTest: 'https://www.gov.uk/life-in-the-uk-test',
    status: 'https://www.gov.uk/browse/visas-immigration',
  },
};

/**
 * Build rich system prompt with user's visa details, timeline, and government links
 * Includes: timeline milestones, submission steps, financial requirements
 */
function buildSystemPrompt(context: VisaAdvisorContext): string {
  const timeline = getTimelineData(context.visaType);
  const govLinks = GOV_UK_LINKS[context.visaType] || GOV_UK_LINKS.spouse;

  // Format timeline stages with milestones
  const timelineDescription = timeline.stages
    .map(
      (stage, i) =>
        `**${i + 1}. ${stage.label}** (${stage.leadDays} days): ${stage.detail}${
          stage.governmentProcessingDays
            ? ` | Gov processing: ${stage.governmentProcessingDays.standard} days standard`
            : ''
        }`
    )
    .join('\n\n');

  // Financial requirements per visa type
  const financialRequirements = {
    spouse: '- Minimum income: £29,000/year (as of April 2024)\n- Savings: £16,000 can substitute if income lower\n- Sponsor must prove financial ability',
    skilled_worker: '- Salary threshold: £38,700/year (or going rate for role)\n- Financial requirement: £1,270 in account for 28 days\n- Check salary list on gov.uk for your occupation',
    citizenship: '- No income requirement\n- Must have stable residence\n- Good character assessment required',
  };

  const financialText = financialRequirements[context.visaType as keyof typeof financialRequirements] || financialRequirements.spouse;

  // Submission steps
  const submissionSteps = {
    spouse: '1. Complete online application on gov.uk\n2. Pay visa fee (£719) + IHS surcharge (~£710 for 2.5 years)\n3. Upload supporting documents\n4. Receive confirmation + reference number\n5. Book biometrics appointment\n6. Attend biometrics (photos + fingerprints)\n7. Home Office processes (12 weeks standard, 5 days priority)',
    skilled_worker: '1. Get Certificate of Sponsorship (CoS) from employer\n2. Gather documents (qualifications, criminal record, English proof)\n3. Apply online within 3 months of CoS\n4. Pay fee (£719) + IHS surcharge\n5. Biometrics appointment\n6. Processing (3 weeks standard)',
    citizenship: '1. Confirm eligibility (5 years residence, absences <450 days total)\n2. Pass Life in the UK test\n3. Gather documents (passports, council tax, birth certificate, referees)\n4. Submit AN application (online or paper)\n5. Home Office processes (6 months)\n6. Attend citizenship ceremony',
  };

  const submissionText = submissionSteps[context.visaType as keyof typeof submissionSteps] || submissionSteps.spouse;

  // Format government links
  const govLinkText = Object.entries(govLinks)
    .map(([topic, url]) => `- **${topic.replace(/([A-Z])/g, ' $1')}**: ${url}`)
    .join('\n');

  return `You are a trusted UK visa advisor for VisaBud, helping applicants understand their specific visa application journey.

## YOUR ROLE
- Provide accurate, up-to-date visa advice based on official UK government guidance
- Answer questions about the application process, documents, timelines, and requirements
- Walk users through submission steps when they ask "How do I submit?"
- Give context-specific advice based on the applicant's situation
- Always direct users to official gov.uk sources for authoritative information
- Be empathetic but honest about challenges and processing times

## APPLICANT'S SITUATION
- **Visa Type**: ${context.visaType.replace('_', ' ')}
- **Nationality**: ${context.nationality || 'Not provided'}
- **Timeline Preference**: ${context.urgency || 'Standard processing'}
- **Documents Ready**: ${context.documentCompletionPercent || 0}%
- **Income Level**: ${context.annualIncomeRange || 'Not specified'}
- **Access Level**: ${context.purchasedTier || 'Free checklist'}

## APPLICATION TIMELINE
${timelineDescription}

## HOW TO SUBMIT YOUR APPLICATION
${submissionText}

## FINANCIAL REQUIREMENTS
${financialText}

## OFFICIAL GOVERNMENT RESOURCES
${govLinkText}

## TONE & GUIDELINES
1. Be conversational and supportive, not robotic
2. Break down complex processes into clear, numbered steps
3. When asked "How do I submit?" reference the submission steps above
4. Reference their specific visa type in responses
5. Include relevant gov.uk links with context (not just raw URLs)
6. If unsure about current requirements, direct them to gov.uk
7. Use markdown formatting: **bold** for key terms, numbered/bulleted lists
8. End substantive answers with "📌 See: [link]" for relevant gov.uk pages
9. Always remind them to verify requirements directly with gov.uk before submitting

## CRITICAL NOTES
- Processing times are current as of 2026 but can change
- Financial requirements and eligibility criteria are STRICT
- Missing ONE required document = automatic refusal
- Always verify current requirements on gov.uk BEFORE applying
- Processing times differ for in-country vs. overseas applications`;
}

/**
 * POST /api/visa-advisor
 * Accepts a chat message and returns advice from Claude
 */
export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               '127.0.0.1';

    // Check rate limit
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfter || 60),
          },
        }
      );
    }

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
