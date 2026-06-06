/**
 * AI Analysis Pipeline — Runs in background after "AI Ready Check" click
 * 
 * Two-stage pipeline:
 *   1. CLASSIFY — Is this a document? Is it visa-relevant? What type?
 *   2. ANALYZE  — Full checklist scoring, confidence %, recommendations
 * 
 * Updates DB at each stage so frontend polling shows progressive status.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

// ─── Requirement Checklists by Document Type ────────────────────────────────

interface RequirementDef {
  requirement: string;
  govLink: string;
}

const REQUIREMENTS: Record<string, RequirementDef[]> = {
  passport: [
    { requirement: 'Full name visible', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Date of birth visible', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Passport number visible', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Expiry date visible and 6+ months validity', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Photo matches current appearance', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Machine-readable zone (MRZ) fully visible', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Bio page complete and unobstructed', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
  ],
  'bank statement': [
    { requirement: 'Account holder name visible', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Sort code and account number visible', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Statement covers required 6-month period', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Salary credits visible and identifiable', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Bank name/logo visible', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Official statement (not screenshot)', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
  ],
  payslip: [
    { requirement: 'Employee full name', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Employer name', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Gross salary amount', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Tax deductions shown', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Pay period/date', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'National Insurance number', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
  ],
  'employer letter': [
    { requirement: 'Company letterhead', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Dated within 28 days of application', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Job title stated', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Annual salary confirmed', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Start date of employment', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Contract type (permanent/fixed)', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
    { requirement: 'Signed by named individual', govLink: 'https://www.gov.uk/uk-family-visa/proof-income' },
  ],
  marriage: [
    { requirement: 'Official marriage certificate', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Both names clearly visible', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Date of marriage visible', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    { requirement: 'Certified English translation (if applicable)', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
  ],
  default: [
    { requirement: 'Document is complete and uncut', govLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'All text is readable', govLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Document appears authentic', govLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Relevant dates visible', govLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Names visible and match application', govLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
    { requirement: 'Document is current (not expired)', govLink: 'https://www.gov.uk/apply-to-come-to-the-uk' },
  ],
};

// ─── Multi-Document Requirements for Free AI Preview Items ────────────────

const MULTI_DOC_REQUIREMENTS: Record<string, { documents: string[]; crossChecks: string[] }> = {
  'financial-validation': {
    documents: ['bank_statement', 'payslip', 'employer_letter'],
    crossChecks: [
      'Salary amount on payslip matches bank credit (within £10 tolerance)',
      'Pay periods on payslip match bank statement dates',
      'Employer name on payslip matches employer letter',
      'Salary stated in employer letter matches payslip gross amount',
      '6 consecutive months covered with no gaps (spouse/family visa)',
    ],
  },
  'identity-verification': {
    documents: ['passport'],
    crossChecks: [
      'Passport expiry date is 6+ months from intended travel',
      'Machine-readable zone (MRZ) is fully visible and intact',
      'Name on passport is consistent with other application documents',
      'Photo on passport matches current appearance',
      'All pages included (bio page + stamps + blank pages)',
    ],
  },
  'accommodation-check': {
    documents: ['accommodation_proof', 'bank_statement'],
    crossChecks: [
      'Address extracted from accommodation document',
      'Address matches bank statement billing address',
      'Accommodation document is current (not expired)',
      'Document is from an official source (landlord/mortgage/council)',
      'Postcode is consistent across all documents',
    ],
  },
};

// Get enhanced requirements for free AI preview items based on item ID
function getFreeItemRequirements(itemId: string): RequirementDef[] {
  if (itemId.includes('free-financial-validation')) {
    const crossChecks = MULTI_DOC_REQUIREMENTS['financial-validation'].crossChecks;
    return crossChecks.map((check) => ({
      requirement: check,
      govLink: 'https://www.gov.uk/uk-family-visa/proof-income',
    }));
  }
  if (itemId.includes('free-identity-verification')) {
    return [
      ...REQUIREMENTS.passport,
      { requirement: 'Name consistent with other application documents', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
      { requirement: 'Passport not expiring within 6 months of travel', govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply' },
    ];
  }
  if (itemId.includes('free-accommodation-check')) {
    const crossChecks = MULTI_DOC_REQUIREMENTS['accommodation-check'].crossChecks;
    return crossChecks.map((check) => ({
      requirement: check,
      govLink: 'https://www.gov.uk/uk-family-visa/adequate-accommodation',
    }));
  }
  return REQUIREMENTS.default;
}

function getRequirements(docTitle: string, checklistItemId?: string): RequirementDef[] {
  // Check for free AI preview items first (by checklist item ID)
  if (checklistItemId) {
    const freeReqs = getFreeItemRequirements(checklistItemId);
    if (freeReqs !== REQUIREMENTS.default) return freeReqs;
  }

  const lower = docTitle.toLowerCase();
  for (const [key, reqs] of Object.entries(REQUIREMENTS)) {
    if (key !== 'default' && lower.includes(key)) return reqs;
  }
  return REQUIREMENTS.default;
}

// ─── Claude API Helper ──────────────────────────────────────────────────────

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  imageBase64: string,
  mimeType: string,
  maxTokens: number,
): Promise<string> {
  const isPdf = mimeType === 'application/pdf';

  const contentBlocks: any[] = [
    { type: 'text', text: userPrompt },
  ];

  if (isPdf) {
    contentBlocks.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: imageBase64 },
    });
  } else {
    const mediaType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mimeType)
      ? mimeType
      : 'image/jpeg';
    contentBlocks.push({
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: imageBase64 },
    });
  }

  // Add timeout using AbortController (45 second timeout)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: 'user', content: contentBlocks }],
      }),
      signal: controller.signal, // ← TIMEOUT SIGNAL
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Claude API error: ${response.status} — ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Score Calculation ──────────────────────────────────────────────────────

function calculateScore(
  items: Array<{ met: boolean }>,
  criticalMissing: string[],
): number {
  if (!items.length) return 0;

  const metCount = items.filter((i) => i.met).length;
  const metRatio = metCount / items.length;

  // Critical missing = hard cap at 29%
  if (criticalMissing.length > 0) {
    return Math.min(29, Math.round(metRatio * 29));
  }

  // Graduated scoring
  if (metRatio >= 1.0) return Math.round(85 + metRatio * 15);
  if (metRatio >= 0.75) return Math.round(70 + (metRatio - 0.75) * 56);
  if (metRatio >= 0.5) return Math.round(50 + (metRatio - 0.5) * 80);
  if (metRatio >= 0.25) return Math.round(30 + (metRatio - 0.25) * 80);
  return Math.round(metRatio * 120);
}

// ─── Main Pipeline ──────────────────────────────────────────────────────────

export async function runAIPipeline(documentId: string): Promise<void> {
  console.log(`[ai-pipeline] Starting for ${documentId}`);

  try {
    // Get document record
    const { data: doc, error: docError } = await supabaseAdmin
      .from('document_uploads')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      throw new Error(`Document not found: ${documentId}`);
    }

    // Download file from storage
    const { data: fileData, error: dlError } = await supabaseAdmin.storage
      .from('Documents')
      .download(doc.file_path);

    if (dlError || !fileData) {
      throw new Error(`Failed to download file: ${doc.file_path}`);
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const imageBase64 = buffer.toString('base64');

    // ════════════════════════════════════════════════════════════════════════
    // STAGE 1: CLASSIFY
    // ════════════════════════════════════════════════════════════════════════

    console.log(`[ai-pipeline] Stage 1: Classifying ${documentId}`);

    const classifyStatusResult = await supabaseAdmin
      .from('document_uploads')
      .update({ ai_status: 'classifying' })
      .eq('id', documentId);

    if (classifyStatusResult.error) {
      console.error(`[ai-pipeline] Failed to update to "classifying": ${classifyStatusResult.error.message}`);
    } else {
      console.log(`[ai-pipeline] Updated status to "classifying" for ${documentId}`);
      // Verify write persisted
      await new Promise(resolve => setTimeout(resolve, 100));
      const verifyClassify = await supabaseAdmin
        .from('document_uploads')
        .select('ai_status')
        .eq('id', documentId)
        .single();
      console.log(`[ai-pipeline] VERIFY CLASSIFYING: got ai_status="${verifyClassify.data?.ai_status}"`);
    }

    const classifyResponse = await callClaude(
      'You are a document classifier. Respond with valid JSON only.',
      `Analyze this image:
1. Is this a document (letter, form, ID, certificate, statement)? YES/NO
2. If yes, what type? (passport, bank statement, payslip, letter, certificate, photo, other, NOT_A_DOCUMENT)
3. Is this relevant to UK visa applications? YES/NO

Respond ONLY with JSON: {"isDocument": boolean, "documentType": "string", "isVisaRelevant": boolean, "explanation": "brief"}`,
      imageBase64,
      doc.mime_type,
      200, // ← REDUCED from 300
    );

    let classification = {
      isDocument: true,
      documentType: 'unknown',
      isVisaRelevant: true,
      explanation: 'Classification completed.',
    };

    try {
      const jsonMatch = classifyResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        classification = {
          isDocument: !!parsed.isDocument,
          documentType: parsed.documentType || 'unknown',
          isVisaRelevant: !!parsed.isVisaRelevant,
          explanation: parsed.explanation || 'Classification completed.',
        };
      }
    } catch (e) {
      console.warn('[ai-pipeline] Classification parse error, defaulting to pass-through');
    }

    // Update classification results
    await supabaseAdmin
      .from('document_uploads')
      .update({
        is_document: classification.isDocument,
        is_visa_relevant: classification.isVisaRelevant,
        detected_type: classification.documentType,
        classification_feedback: classification.explanation,
      })
      .eq('id', documentId);

    // If not a document, stop here
    if (!classification.isDocument) {
      await supabaseAdmin
        .from('document_uploads')
        .update({
          ai_status: 'complete',
          confidence_score: 0,
          scoring_feedback: 'This does not appear to be a document. Please upload a clear scan or photo of the required document.',
          flags: [{ text: 'Not a valid document', severity: 'high' }],
          ai_completed_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      console.log(`[ai-pipeline] ${documentId}: Not a document, pipeline complete`);
      return;
    }

    // ════════════════════════════════════════════════════════════════════════
    // STAGE 2: ANALYZE (Full Checklist Scoring)
    // ════════════════════════════════════════════════════════════════════════

    console.log(`[ai-pipeline] Stage 2: Analyzing ${documentId} (type: ${classification.documentType})`);

    const analyzeStatusResult = await supabaseAdmin
      .from('document_uploads')
      .update({ ai_status: 'analyzing' })
      .eq('id', documentId);

    if (analyzeStatusResult.error) {
      console.error(`[ai-pipeline] Failed to update to "analyzing": ${analyzeStatusResult.error.message}`);
    } else {
      console.log(`[ai-pipeline] Updated status to "analyzing" for ${documentId}`);
      // Verify write persisted
      await new Promise(resolve => setTimeout(resolve, 100));
      const verifyAnalyze = await supabaseAdmin
        .from('document_uploads')
        .select('ai_status')
        .eq('id', documentId)
        .single();
      console.log(`[ai-pipeline] VERIFY ANALYZING: got ai_status="${verifyAnalyze.data?.ai_status}"`);
    }

    // Build requirement-specific prompt
    // Pass checklist_item_id so free AI preview items get enhanced requirements
    const requirements = getRequirements(
      doc.checklist_item_id + ' ' + (classification.documentType || ''),
      doc.checklist_item_id,
    );
    const reqList = requirements.map((r, i) => `${i + 1}. ${r.requirement}`).join('\n');

    const analyzeResponse = await callClaude(
      `You are a UK immigration document analyst. Check each requirement: met (true/false), evidence (brief), suggestedFix (null or text). Identify critical missing items. Respond with valid JSON only.`,
      `Analyze this "${classification.documentType}" against requirements:
${reqList}

Respond ONLY with JSON: {"items": [{"requirement": "name", "met": true, "evidence": "brief", "suggestedFix": null}], "criticalMissing": [], "recommendations": [], "overallFeedback": "summary"}`,
      imageBase64,
      doc.mime_type,
      1200, // ← REDUCED from 2000
    );

    // Parse analysis result
    let analysisResult = {
      items: [] as Array<{ requirement: string; met: boolean; evidence: string; suggestedFix: string | null }>,
      criticalMissing: [] as string[],
      recommendations: [] as string[],
      overallFeedback: 'Analysis completed.',
    };

    try {
      const jsonMatch = analyzeResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisResult = {
          items: Array.isArray(parsed.items) ? parsed.items : [],
          criticalMissing: Array.isArray(parsed.criticalMissing) ? parsed.criticalMissing : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          overallFeedback: parsed.overallFeedback || 'Analysis completed.',
        };
      }
    } catch (e) {
      console.error('[ai-pipeline] Analysis parse error:', e);
    }

    // Enrich items with gov.uk links
    const enrichedItems = analysisResult.items.map((item) => {
      const matchedReq = requirements.find((r) => r.requirement === item.requirement);
      return {
        ...item,
        govLink: matchedReq?.govLink || 'https://www.gov.uk/apply-to-come-to-the-uk',
      };
    });

    // Calculate score from checklist (code does math, not LLM)
    const confidenceScore = calculateScore(enrichedItems, analysisResult.criticalMissing);

    // Build flags from unmet items
    const flags = enrichedItems
      .filter((i) => !i.met)
      .map((i) => ({
        text: `${i.requirement}: ${i.evidence}`,
        severity: analysisResult.criticalMissing.some((c) =>
          i.requirement.toLowerCase().includes(c.toLowerCase())
        )
          ? ('high' as const)
          : ('medium' as const),
      }));

    // Update DB with final results
    await supabaseAdmin
      .from('document_uploads')
      .update({
        ai_status: 'complete',
        confidence_score: confidenceScore,
        checklist_items: enrichedItems,
        critical_missing: analysisResult.criticalMissing,
        recommendations: analysisResult.recommendations,
        flags: flags.length > 0 ? flags : [{ text: 'No issues found', severity: 'low' }],
        scoring_feedback: analysisResult.overallFeedback,
        ai_completed_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    console.log(`[ai-pipeline] Complete for ${documentId}: score=${confidenceScore}%`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[ai-pipeline] Fatal error for ${documentId}:`, errorMsg);

    // Determine if timeout or other error
    const isTimeout = errorMsg.includes('AbortError') || errorMsg.includes('timeout');
    const userFeedback = isTimeout
      ? 'Analysis timed out. The document was complex or took too long. Please try again — sometimes a retry succeeds.'
      : 'AI analysis encountered an error. Your document is safely saved. Please try again in a few moments.';

    // Mark as failed but don't lose the document
    try {
      await supabaseAdmin
        .from('document_uploads')
        .update({
          ai_status: 'failed',
          scoring_feedback: userFeedback,
          flags: [{ text: 'Analysis failed - please retry', severity: 'high' }],
          ai_completed_at: new Date().toISOString(),
        })
        .eq('id', documentId);
    } catch (dbError) {
      console.error(`[ai-pipeline] Failed to update document status for ${documentId}:`, dbError);
    }
  }
}
