import type {
  VisionProvider,
  ValidateDocumentInput,
  ValidationResult,
  PremiumReviewInput,
  PremiumValidationResult,
  ClassifyDocumentInput,
  ClassificationResult,
  DimensionScore,
} from '../vision-provider';

// ─── Claude Vision Adapter (Anthropic) ──────────────────────────────────────
// Default provider — uses Sonnet for free-tier, Sonnet for premium (fast+cheap).
// Falls back to Opus for premium if CLAUDE_PREMIUM_MODEL is set.

const CLAUDE_SONNET = 'claude-sonnet-4-20250514';
const CLAUDE_DEFAULT_PREMIUM = process.env.CLAUDE_PREMIUM_MODEL || CLAUDE_SONNET;

// ─── Fix 4: Structured Scoring ──────────────────────────────────────────────

function calculateFinalScore(dimensions: DimensionScore): number {
  const weights = {
    relevance: 0.4,
    completeness: 0.25,
    clarity: 0.15,
    validity: 0.20,
  };

  // Hard caps — these override the weighted calculation
  if (dimensions.relevance.score === 0) return 0;  // Wrong document = 0
  if (dimensions.validity.score === 0) return Math.min(20, 20);  // Expired = cap 20
  if (dimensions.clarity.score < 30) return Math.min(dimensions.clarity.score, 30);  // Illegible = cap 30

  // Calculate weighted score
  const weighted =
    dimensions.relevance.score * weights.relevance +
    dimensions.completeness.score * weights.completeness +
    dimensions.clarity.score * weights.clarity +
    dimensions.validity.score * weights.validity;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

// ─── Document-Specific AI Criteria ──────────────────────────────────────────
// Per-document checks that the AI should prioritise during premium review.

function getDocumentSpecificCriteria(docId: string, docTitle: string): string | null {
  const lower = (docId + ' ' + docTitle).toLowerCase();

  if (lower.includes('passport')) return `- Is the bio data page fully visible (photo, full name, DOB, passport number, expiry date)?
- Does the passport have at least 6 months validity remaining?
- Are ALL pages scanned (including blank pages)?
- Are any previous passports included?
- Is the name consistent with other documents?`;

  if (lower.includes('bank-statement') || lower.includes('bank statement')) return `- Is the account holder name visible?
- Are sort code and account number visible?
- Does it cover the full 6-month period required?
- Are salary credits visible and do they match payslip amounts?
- Is this an official bank statement (stamped or digitally verified), not a screenshot?`;

  if (lower.includes('payslip')) return `- Is the employer name visible?
- Is the gross salary clearly shown (not just net)?
- Are tax deductions and NI contributions shown?
- Does it cover the correct period?
- Does the salary match what's declared in the application?`;

  if (lower.includes('employer-letter') || lower.includes('employer letter')) return `- Is it on official company letterhead?
- Is it dated within 28 days of the application date?
- Does it state: job title, gross salary, start date, and contract type (permanent/fixed)?
- Is it signed by a named individual?
- Does the salary match the payslips?`;

  if (lower.includes('photo')) return `- Is the background plain and light-coloured (white, cream, or light grey)?
- Was the photo taken within the last month?
- Is the person facing forward with a plain expression, mouth closed?
- Are eyes open and visible, with no hair covering them?
- No glasses (unless medically required)?
- No head covering (unless religious/medical)?
- No shadows on face or behind?`;

  if (lower.includes('tb-test') || lower.includes('tb test') || lower.includes('tuberculosis')) return `- Is this from a Home Office approved clinic?
- Is the test date within the last 6 months (TB certs expire after 6 months)?
- Does the applicant name match the passport?
- Is the result clearly stated (clear/negative)?`;

  if (lower.includes('marriage') || lower.includes('civil partnership')) return `- Is this an official marriage/civil partnership certificate?
- If not in English, is a certified translation included?
- If married overseas, is an apostille/legalisation present?
- Are both partners' names clearly visible?
- Is the date of marriage/partnership visible?`;

  if (lower.includes('cos') || lower.includes('certificate of sponsorship')) return `- Is the CoS reference number visible?
- Is the SOC code visible and does it match the job?
- Is the salary stated and does it meet the minimum threshold?
- Is the employer name visible?
- Is the start date visible?
- Is the CoS still within its 3-month validity?`;

  if (lower.includes('english') || lower.includes('ielts') || lower.includes('selt')) return `- Is this from an approved SELT provider (e.g., IELTS, Trinity)?
- Is the CEFR level clearly shown?
- Is the test certificate within its validity period?
- Does the name match the passport?
- For spouse initial: minimum A1. For skilled worker/ILR: minimum B1.`;

  if (lower.includes('brp') || lower.includes('biometric residence')) return `- Is the front AND back of the BRP scanned?
- Is the immigration status clearly shown (e.g., Indefinite Leave to Remain)?
- Is the expiry date visible?
- Does the name match the passport?`;

  if (lower.includes('life in the uk') || lower.includes('life-in-uk')) return `- Is the pass notification letter clearly visible?
- Is the applicant name visible?
- Is the test date visible?
- Note: Life in the UK test certificates do not expire.`;

  if (lower.includes('birth certificate')) return `- Is this an official birth certificate (not a photocopy)?
- If not in English, is a certified translation included?
- Are both parents' names visible?
- Is the date and place of birth clearly shown?`;

  if (lower.includes('accommodation') || lower.includes('tenancy')) return `- Is the address clearly visible?
- Does the document show the applicant or sponsor's name?
- Is it a tenancy agreement, mortgage statement, or landlord letter?
- If a landlord letter: does it confirm permission to stay and number of occupants?`;

  if (lower.includes('savings') || lower.includes('cash savings')) return `- Does the balance meet the required threshold?
- Has the amount been held for at least 28 consecutive days?
- Is the account holder name visible?
- Are the funds in an accessible account (not locked/pension)?`;

  if (lower.includes('self-employ') || lower.includes('self employ')) return `- Are SA302 tax calculations included?
- Are tax year overviews from HMRC included?
- Is the accountant letter on headed paper and dated?
- Do the figures cover the last 2 full tax years?`;

  return null;
}

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
    const isPdf = mediaType === 'application/pdf';

    const contentBlocks: any[] = [
      { type: 'text', text: userPrompt },
    ];

    if (isPdf) {
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
    return data.content?.[0]?.text || '';
  }

  // ── Fix 1: Document Classification Gate ───────────────────────────────────

  async classifyDocument(input: ClassifyDocumentInput): Promise<ClassificationResult> {
    const mediaType = this.resolveMediaType(input.mimeType);
    const requirement = input.requirement || 'general visa document';

    const systemPrompt = `You are a document classifier. You determine what type of image has been uploaded. You always respond with valid JSON only — no markdown, no explanation.`;

    const userPrompt = `Analyze this image:

1. Is this a document (letter, form, ID, certificate, statement)? YES/NO
2. If yes, what type? (passport, bank statement, utility bill, payslip, license, letter, contract, certificate, other, or NOT_A_DOCUMENT)
3. Is this relevant to UK visa applications? YES/NO
4. Does it match this requirement: "${requirement}"? YES/NO

CRITICAL: If this is NOT a document (photo of object, animal, landscape, screenshot of non-document content, meme, etc.), set isDocument=false immediately. All other fields default to false/null.

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "isDocument": boolean,
  "documentType": "string or null",
  "isVisaRelevant": boolean,
  "matchesRequirement": boolean,
  "explanation": "brief reason for classification"
}`;

    try {
      const content = await this.callClaude(
        CLAUDE_SONNET,
        systemPrompt,
        userPrompt,
        input.image,
        mediaType,
        300,
        0.1,
      );

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isDocument: !!parsed.isDocument,
          isVisaRelevant: !!parsed.isVisaRelevant,
          detectedType: parsed.documentType || null,
          matchesRequirement: !!parsed.matchesRequirement,
          explanation: parsed.explanation || 'Classification completed.',
        };
      }
    } catch (e) {
      console.error('[claude] Classification error:', e);
    }

    // If classification itself fails, default to allowing through
    // (better to over-analyse than silently reject a real document)
    return {
      isDocument: true,
      isVisaRelevant: true,
      detectedType: null,
      matchesRequirement: false,
      explanation: 'Classification could not be completed — proceeding with analysis.',
    };
  }

  // ── Free-tier validation ──────────────────────────────────────────────────

  async validateDocument(input: ValidateDocumentInput): Promise<ValidationResult> {
    const start = Date.now();
    const mediaType = this.resolveMediaType(input.mimeType);

    const systemPrompt = `You are a UK visa document verification assistant. You check whether uploaded documents meet specific requirements for visa applications. Be helpful but thorough. Always respond in JSON format: { "valid": boolean, "feedback": "string" }`;

    const userPrompt = `Verify this document matches the requirement: "${input.requirement}".

Check the following:
1. Document clarity — is the text readable? If the document is rotated or upside down, read it in the correct orientation. Do NOT penalise rotation.
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

    // Fix 3: Don't silently pass — mark as incomplete
    return {
      valid: false,
      feedback: 'Could not parse validation result. This is NOT a reflection of document quality. Please try again.',
      provider: this.name,
      latencyMs,
      analysisComplete: false,
    };
  }

  // ── Premium review (Fix 4: Structured Scoring) ───────────────────────────

  async premiumReview(input: PremiumReviewInput): Promise<PremiumValidationResult> {
    const start = Date.now();
    const mediaType = this.resolveMediaType(input.mimeType);

    const systemPrompt = `You are a senior UK immigration document reviewer with 15+ years of experience processing UKVI applications. You provide thorough, specific, and actionable feedback on each document.

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

Response format:
{
  "dimensions": {
    "relevance": { "score": 0-100, "evidence": "why" },
    "completeness": { "score": 0-100, "evidence": "why" },
    "clarity": { "score": 0-100, "evidence": "why" },
    "validity": { "score": 0-100, "evidence": "why" }
  },
  "riskLevel": "high" | "medium" | "low",
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
- LOW: Document looks good. Minor suggestions only.`;

    // Document-specific criteria injection
    const docSpecificCriteria = getDocumentSpecificCriteria(input.docId, input.docTitle);

    const userPrompt = `Review this document for a UK ${input.visaType} visa application.

Document type: ${input.docTitle} (ID: ${input.docId})
Requirement: ${input.requirement}
${docSpecificCriteria ? `\nDOCUMENT-SPECIFIC CHECKS (prioritise these):\n${docSpecificCriteria}\n` : ''}

Analyze this document across 4 dimensions:

1. RELEVANCE (0-100): Does it match the requirement "${input.requirement}"?
   - 100: Perfect match, correct document type
   - 75: Right category, minor mismatch
   - 50: Related but not exact fit
   - 25: Loosely related
   - 0: Wrong document entirely

2. COMPLETENESS (0-100): Are all required fields visible?
   - 100: All fields visible and complete
   - 75: Most fields visible, 1-2 minor omissions
   - 50: About half of required fields present
   - 25: Very few required fields visible
   - 0: No required information visible

3. CLARITY (0-100): Is the text readable?
   - If the document is rotated or upside down, mentally rotate it and read it in the correct orientation. Do NOT penalise rotation — assess content as if properly oriented.
   - 100: Crystal clear, well-lit, text fully readable
   - 75: Clear but minor quality issues
   - 50: Readable but some blur/shadow
   - 25: Significantly degraded, hard to read even when oriented correctly
   - 0: Illegible regardless of orientation

4. VALIDITY (0-100): Is it current and authentic-looking?
   - 100: Not expired, authentic format
   - 75: Not expired but minor format concerns
   - 50: Approaching expiry or format questions
   - 25: Expired or significant authenticity concerns
   - 0: Clearly expired or fraudulent

Also check THOROUGHLY against real UKVI requirements:
- For passports: bio page visible, 6+ months validity, all pages included?
- For bank statements: account holder name, sort code, account number, full 6-month period, salary credits visible?
- For payslips: employer name, gross salary, tax deductions, NI number, matching period?
- For employer letters: letterhead, dated within 28 days, job title, salary, start date, contract type?
- For photos: plain light-coloured background (white/cream/light grey), correct size, recent (within 1 month)? No glasses unless medically required?
- For TB test certificates: issued by approved clinic, valid for 6 months from test date, correct applicant name?
- For marriage certificates: original or certified copy, certified English translation if not in English, apostille if married overseas?
- For CoS/sponsorship: reference number visible, SOC code, salary matches contract?
- For certificates (general): issuing authority, dates, reference numbers, not expired?

Be SPECIFIC. Don't say "document looks unclear" — say exactly what's wrong and where.

Respond with JSON only.`;

    try {
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

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Fix 4: Calculate score from dimensions if present, don't trust raw LLM number
        let confidenceScore: number;
        let dimensions: DimensionScore | undefined;

        if (parsed.dimensions?.relevance && parsed.dimensions?.completeness &&
            parsed.dimensions?.clarity && parsed.dimensions?.validity) {
          dimensions = {
            relevance: { score: Math.min(100, Math.max(0, parsed.dimensions.relevance.score || 0)), evidence: parsed.dimensions.relevance.evidence || '' },
            completeness: { score: Math.min(100, Math.max(0, parsed.dimensions.completeness.score || 0)), evidence: parsed.dimensions.completeness.evidence || '' },
            clarity: { score: Math.min(100, Math.max(0, parsed.dimensions.clarity.score || 0)), evidence: parsed.dimensions.clarity.evidence || '' },
            validity: { score: Math.min(100, Math.max(0, parsed.dimensions.validity.score || 0)), evidence: parsed.dimensions.validity.evidence || '' },
          };
          confidenceScore = calculateFinalScore(dimensions);
        } else {
          // Fallback: if LLM didn't return dimensions, use its score but cap it
          confidenceScore = Math.min(100, Math.max(0, parsed.confidenceScore || 0));
        }

        // Derive risk level from confidence score — don't trust LLM's risk classification
        // This ensures score and risk badge are always consistent
        const riskLevel: 'high' | 'medium' | 'low' =
          confidenceScore <= 40 ? 'high' : confidenceScore <= 70 ? 'medium' : 'low';

        return {
          riskLevel,
          confidenceScore,
          feedback: parsed.feedback || 'Review completed.',
          issues: Array.isArray(parsed.issues) ? parsed.issues : [],
          positives: Array.isArray(parsed.positives) ? parsed.positives : [],
          provider: this.name,
          latencyMs,
          analysisComplete: true,
          dimensions,
        };
      }
    } catch (e) {
      console.error('[claude] Failed to parse premium review response:', e);
    }

    // Fix 3: Return 0% with error flag instead of fake 50%
    return {
      riskLevel: 'high',
      confidenceScore: 0,
      feedback: 'Analysis could not be completed. This is NOT a reflection of document quality. Please retry or contact support.',
      issues: [{ type: 'clarity', severity: 'high', message: 'Analysis could not be completed', fix: 'Re-upload a clearer image or try again later' }],
      positives: [],
      provider: this.name,
      latencyMs: Date.now() - start,
      analysisComplete: false,
      error: 'Failed to parse AI response',
    };
  }
}
