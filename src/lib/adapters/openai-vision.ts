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

// ─── OpenAI GPT-4o Vision Adapter ───────────────────────────────────────────

// ─── Fix 4: Structured Scoring (shared with Claude adapter) ─────────────────

function calculateFinalScore(dimensions: DimensionScore): number {
  const weights = {
    relevance: 0.4,
    completeness: 0.25,
    clarity: 0.15,
    validity: 0.20,
  };

  if (dimensions.relevance.score === 0) return 0;
  if (dimensions.validity.score === 0) return Math.min(20, 20);
  if (dimensions.clarity.score < 30) return Math.min(dimensions.clarity.score, 30);

  const weighted =
    dimensions.relevance.score * weights.relevance +
    dimensions.completeness.score * weights.completeness +
    dimensions.clarity.score * weights.clarity +
    dimensions.validity.score * weights.validity;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export class OpenAIVisionProvider implements VisionProvider {
  readonly name = 'openai';
  private apiKey: string;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not configured');
    this.apiKey = key;
  }

  // ── Shared helper ─────────────────────────────────────────────────────────

  private async callOpenAI(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    imageBase64: string,
    mediaType: string,
    maxTokens: number,
    temperature: number,
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mediaType};base64,${imageBase64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[openai] API error (${model}):`, response.status, errBody);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // ── Fix 1: Document Classification Gate ───────────────────────────────────

  async classifyDocument(input: ClassifyDocumentInput): Promise<ClassificationResult> {
    const mediaType = input.mimeType === 'application/pdf' ? 'application/pdf' : (input.mimeType || 'image/jpeg');
    const requirement = input.requirement || 'general visa document';

    const systemPrompt = `You are a document classifier. You determine what type of image has been uploaded. You always respond with valid JSON only - no markdown, no explanation.`;

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
      const content = await this.callOpenAI(
        'gpt-4o-mini',
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
      console.error('[openai] Classification error:', e);
    }

    return {
      isDocument: true,
      isVisaRelevant: true,
      detectedType: null,
      matchesRequirement: false,
      explanation: 'Classification could not be completed - proceeding with analysis.',
    };
  }

  // ── Free-tier validation ──────────────────────────────────────────────────

  async validateDocument(input: ValidateDocumentInput): Promise<ValidationResult> {
    const start = Date.now();
    const mediaType = input.mimeType === 'application/pdf' ? 'application/pdf' : (input.mimeType || 'image/jpeg');

    const systemPrompt = `You are a UK visa document verification assistant. You check whether uploaded documents meet specific requirements for visa applications. Be helpful but thorough. Always respond in JSON format: { "valid": boolean, "feedback": "string" }`;

    const userPrompt = `Verify this document matches the requirement: "${input.requirement}".

Check the following:
1. Document clarity - is the text readable? If rotated or upside down, read it in the correct orientation. Do NOT penalise rotation.
2. Completeness - does it contain all the required information?
3. Relevance - does it match what's being asked for?
4. All required details visible (names, dates, amounts, stamps etc.)

If valid, give brief positive feedback. If invalid, explain specifically what's missing or wrong and suggest how to fix it.

Respond ONLY with JSON: { "valid": true/false, "feedback": "your feedback here" }`;

    const content = await this.callOpenAI(
      'gpt-4o-mini',
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

    // Fix 3: Don't silently pass - mark as incomplete
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
    const mediaType = input.mimeType === 'application/pdf' ? 'application/pdf' : (input.mimeType || 'image/jpeg');

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

    const userPrompt = `Review this document for a UK ${input.visaType} visa application.

Document type: ${input.docTitle} (ID: ${input.docId})
Requirement: ${input.requirement}

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

Be SPECIFIC about issues found.

Respond with JSON only.`;

    try {
      const content = await this.callOpenAI(
        'gpt-4o',
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
          confidenceScore = Math.min(100, Math.max(0, parsed.confidenceScore || 0));
        }

        // Derive risk level from confidence score - consistent with Claude adapter
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
      console.error('[openai] Failed to parse premium review response:', e);
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
