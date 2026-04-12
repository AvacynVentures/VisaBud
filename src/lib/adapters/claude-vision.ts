import type {
  VisionProvider,
  ValidateDocumentInput,
  ValidationResult,
  PremiumReviewInput,
  PremiumValidationResult,
} from '../vision-provider';

// ─── Claude Vision Adapter (Anthropic) ──────────────────────────────────────
// Default provider — uses Sonnet for free-tier, Sonnet for premium (fast+cheap).
// Falls back to Opus for premium if CLAUDE_PREMIUM_MODEL is set.

const CLAUDE_SONNET = 'claude-sonnet-4-20250514';
const CLAUDE_DEFAULT_PREMIUM = process.env.CLAUDE_PREMIUM_MODEL || CLAUDE_SONNET;

export class ClaudeVisionProvider implements VisionProvider {
  readonly name = 'claude';
  private apiKey: string;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY is not configured');
    this.apiKey = key;
  }

  // ── Shared helper ─────────────────────────────────────────────────────────

  private resolveMediaType(mimeType?: string): string {
    if (mimeType === 'application/pdf') return 'application/pdf';
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowed.includes(mimeType || '') ? mimeType! : 'image/jpeg';
  }

  private async callClaude(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    imageBase64: string,
    mediaType: string,
    maxTokens: number,
    temperature: number,
  ): Promise<string> {
    // Build content blocks — Claude uses source.type = "base64" for images
    const isPdf = mediaType === 'application/pdf';

    const contentBlocks: any[] = [
      { type: 'text', text: userPrompt },
    ];

    if (isPdf) {
      // Claude Messages API supports PDF via document type
      contentBlocks.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: imageBase64,
        },
      });
    } else {
      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: imageBase64,
        },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          { role: 'user', content: contentBlocks },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[claude] API error (${model}):`, response.status, errBody);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    // Claude returns content[0].text
    return data.content?.[0]?.text || '';
  }

  // ── Free-tier validation ──────────────────────────────────────────────────

  async validateDocument(input: ValidateDocumentInput): Promise<ValidationResult> {
    const start = Date.now();
    const mediaType = this.resolveMediaType(input.mimeType);

    const systemPrompt = `You are a UK visa document verification assistant. You check whether uploaded documents meet specific requirements for visa applications. Be helpful but thorough. Always respond in JSON format: { "valid": boolean, "feedback": "string" }`;

    const userPrompt = `Verify this document matches the requirement: "${input.requirement}".

Check the following:
1. Document clarity — is it readable and not blurry?
2. Completeness — does it contain all the required information?
3. Relevance — does it match what's being asked for?
4. All required details visible (names, dates, amounts, stamps etc.)

If valid, give brief positive feedback. If invalid, explain specifically what's missing or wrong and suggest how to fix it.

Respond ONLY with JSON: { "valid": true/false, "feedback": "your feedback here" }`;

    const content = await this.callClaude(
      CLAUDE_SONNET,
      systemPrompt,
      userPrompt,
      input.image,
      mediaType,
      500,
      0.3,
    );

    const latencyMs = Date.now() - start;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { valid: !!parsed.valid, feedback: parsed.feedback || '', provider: this.name, latencyMs };
      }
    } catch { /* fall through */ }

    return { valid: false, feedback: 'Could not parse validation result. Please try again.', provider: this.name, latencyMs };
  }

  // ── Premium review ────────────────────────────────────────────────────────

  async premiumReview(input: PremiumReviewInput): Promise<PremiumValidationResult> {
    const start = Date.now();
    const mediaType = this.resolveMediaType(input.mimeType);

    const systemPrompt = `You are a senior UK immigration document reviewer with 15+ years of experience processing UKVI applications. You provide thorough, specific, and actionable feedback on each document.

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

Response format:
{
  "riskLevel": "high" | "medium" | "low",
  "confidenceScore": <number 0-100>,
  "feedback": "<detailed paragraph of overall assessment>",
  "issues": [
    {
      "type": "clarity" | "completeness" | "validity" | "format" | "expiry" | "mismatch",
      "severity": "high" | "medium" | "low",
      "message": "<specific issue found>",
      "fix": "<exactly what the applicant should do to fix this>"
    }
  ],
  "positives": ["<things that look correct/good>"]
}

Risk level criteria:
- HIGH: Document will likely cause refusal. Missing critical info, illegible, wrong document type, expired.
- MEDIUM: Document has issues that could delay processing or trigger a request for more info. Fixable.
- LOW: Document looks good. Minor suggestions only.

Confidence score: How confident you are this document meets UKVI requirements (0 = no confidence, 100 = perfect).`;

    const userPrompt = `Review this document for a UK ${input.visaType} visa application.

Document type: ${input.docTitle} (ID: ${input.docId})
Requirement: ${input.requirement}

Check THOROUGHLY against real UKVI requirements:
1. **Clarity**: Is every part readable? Any blurry sections, shadows, cut-off edges?
2. **Completeness**: Does it contain ALL required fields? (names, dates, reference numbers, stamps, signatures)
3. **Validity**: Is this the correct document type? Is it current/not expired?
4. **Format**: Does it meet UKVI format requirements? (original vs copy, certified translation needed?)
5. **Specific checks for ${input.docTitle}**:
   - For passports: bio page visible, 6+ months validity, all pages included?
   - For bank statements: account holder name, sort code, account number, full 6-month period, salary credits visible?
   - For payslips: employer name, gross salary, tax deductions, NI number, matching period?
   - For employer letters: letterhead, dated within 28 days, job title, salary, start date, contract type?
   - For photos: white background, correct size, recent (within 6 months)?
   - For certificates: issuing authority, dates, reference numbers, not expired?

Be SPECIFIC. Don't say "document looks unclear" — say "The bottom-left corner of the passport bio page is cut off, obscuring the machine-readable zone (MRZ). UKVI requires the full MRZ to be visible."

Respond with JSON only.`;

    const content = await this.callClaude(
      CLAUDE_DEFAULT_PREMIUM,
      systemPrompt,
      userPrompt,
      input.image,
      mediaType,
      1500,
      0.2,
    );

    const latencyMs = Date.now() - start;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          riskLevel: parsed.riskLevel || 'medium',
          confidenceScore: Math.min(100, Math.max(0, parsed.confidenceScore || 50)),
          feedback: parsed.feedback || 'Review completed.',
          issues: Array.isArray(parsed.issues) ? parsed.issues : [],
          positives: Array.isArray(parsed.positives) ? parsed.positives : [],
          provider: this.name,
          latencyMs,
        };
      }
    } catch (e) {
      console.error('[claude] Failed to parse premium review response:', e);
    }

    return {
      riskLevel: 'medium',
      confidenceScore: 50,
      feedback: 'Unable to fully analyse this document. Please ensure the image is clear and try again.',
      issues: [{ type: 'clarity', severity: 'medium', message: 'Could not fully analyse document', fix: 'Re-upload a clearer image' }],
      positives: [],
      provider: this.name,
      latencyMs: Date.now() - start,
    };
  }
}
