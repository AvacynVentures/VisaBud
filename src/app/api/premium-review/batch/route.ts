import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 120; // Batch review of all docs can take a while

// ─── Types ──────────────────────────────────────────────────────────────────

interface DocumentForReview {
  docId: string;
  docTitle: string;
  requirement: string;
  image: string;      // base64
  mimeType: string;
}

interface DocumentIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  fix: string;
}

interface SingleDocResult {
  riskLevel: 'high' | 'medium' | 'low';
  confidenceScore: number;
  feedback: string;
  issues: DocumentIssue[];
  positives: string[];
}

interface CrossDocFlag {
  relatedDocId: string;
  relatedDocTitle: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

// ─── POST: Batch premium review of all uploaded documents ──────────────────

export async function POST(req: NextRequest) {
  try {
    const { documents, visaType, applicationContext } = await req.json() as {
      documents: DocumentForReview[];
      visaType: string;
      applicationContext: string;
    };

    if (!documents || documents.length === 0) {
      return NextResponse.json({ error: 'No documents provided' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Review each document individually (serial to manage rate limits)
    const documentResults: Record<string, SingleDocResult> = {};
    
    for (const doc of documents) {
      try {
        const result = await reviewSingleDocumentPremium(
          doc.image, doc.mimeType, doc.docId, doc.docTitle,
          doc.requirement, visaType, apiKey
        );
        documentResults[doc.docId] = result;
      } catch (err) {
        console.error(`Failed to review ${doc.docId}:`, err);
        documentResults[doc.docId] = {
          riskLevel: 'medium',
          confidenceScore: 0,
          feedback: 'This document could not be reviewed. Please re-upload and try again.',
          issues: [{ type: 'error', severity: 'medium', message: 'Review failed', fix: 'Re-upload document' }],
          positives: [],
        };
      }
      
      // Small delay between API calls to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Cross-document validation
    const docSummaries = Object.entries(documentResults).map(([docId, result]) => ({
      docId,
      docTitle: documents.find(d => d.docId === docId)?.docTitle || docId,
      feedback: result.feedback,
      issues: result.issues,
    }));

    let crossDocumentFlags: CrossDocFlag[] = [];
    let crossDocSummary = '';

    if (documents.length >= 2) {
      const crossResult = await validateCrossDocuments(
        docSummaries, visaType, applicationContext || '', apiKey
      );
      crossDocumentFlags = crossResult.flags;
      crossDocSummary = crossResult.summary;
    }

    // Calculate overall risk level
    const riskLevels = Object.values(documentResults).map(r => r.riskLevel);
    const hasHigh = riskLevels.includes('high') || crossDocumentFlags.some(f => f.severity === 'high');
    const hasMedium = riskLevels.includes('medium') || crossDocumentFlags.some(f => f.severity === 'medium');
    const overallRiskLevel = hasHigh ? 'high' : hasMedium ? 'medium' : 'low';

    // Calculate overall confidence (weighted average)
    const scores = Object.values(documentResults).map(r => r.confidenceScore);
    const overallConfidence = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Generate summary
    const highRiskDocs = Object.entries(documentResults)
      .filter(([, r]) => r.riskLevel === 'high')
      .map(([id]) => documents.find(d => d.docId === id)?.docTitle || id);

    const totalIssues = Object.values(documentResults)
      .reduce((sum, r) => sum + r.issues.length, 0) + crossDocumentFlags.length;

    let summaryFeedback = `Premium AI Review Complete — ${documents.length} documents analysed.\n\n`;
    
    if (overallRiskLevel === 'high') {
      summaryFeedback += `⚠️ HIGH RISK: ${highRiskDocs.length} document(s) have critical issues that will likely cause refusal: ${highRiskDocs.join(', ')}. Address these before submitting.\n\n`;
    } else if (overallRiskLevel === 'medium') {
      summaryFeedback += `🟡 MEDIUM RISK: Some documents have issues that should be addressed. While not automatic grounds for refusal, fixing them will strengthen your application.\n\n`;
    } else {
      summaryFeedback += `✅ LOW RISK: Your documents look strong. Minor suggestions are included below, but overall your package is well-prepared.\n\n`;
    }

    summaryFeedback += `Total issues found: ${totalIssues}. Overall confidence: ${overallConfidence}%.`;

    if (crossDocSummary) {
      summaryFeedback += `\n\nCross-document check: ${crossDocSummary}`;
    }

    return NextResponse.json({
      documentResults,
      crossDocumentFlags,
      overallRiskLevel,
      overallConfidence,
      summaryFeedback,
      reviewedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Batch premium review error:', error);
    return NextResponse.json(
      { error: 'Internal server error during batch review' },
      { status: 500 }
    );
  }
}

// ─── Helpers (duplicated from single route for isolation) ──────────────────

async function reviewSingleDocumentPremium(
  image: string, mimeType: string, docId: string, docTitle: string,
  requirement: string, visaType: string, apiKey: string
): Promise<SingleDocResult> {
  const systemPrompt = `You are a senior UK immigration document reviewer with 15+ years experience. Provide thorough, specific, actionable feedback. Respond with valid JSON only:
{
  "riskLevel": "high" | "medium" | "low",
  "confidenceScore": <0-100>,
  "feedback": "<detailed assessment>",
  "issues": [{"type":"clarity|completeness|validity|format|expiry|mismatch","severity":"high|medium|low","message":"<specific>","fix":"<action>"}],
  "positives": ["<good things>"]
}

Risk: HIGH = likely refusal, MEDIUM = could delay/RFI, LOW = looks good.`;

  const userPrompt = `Review for UK ${visaType} visa: "${docTitle}" (${docId}).
Requirement: ${requirement}

Check: clarity, completeness, validity, format, UKVI-specific requirements for this document type.
Be SPECIFIC with feedback — reference exact parts of the document.
JSON only.`;

  const mediaType = mimeType === 'application/pdf' ? 'application/pdf' : (mimeType || 'image/jpeg');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${image}`, detail: 'high' } },
        ]},
      ],
      max_tokens: 1200,
      temperature: 0.2,
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      riskLevel: parsed.riskLevel || 'medium',
      confidenceScore: Math.min(100, Math.max(0, parsed.confidenceScore || 50)),
      feedback: parsed.feedback || 'Review completed.',
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      positives: Array.isArray(parsed.positives) ? parsed.positives : [],
    };
  }

  throw new Error('Could not parse AI response');
}

async function validateCrossDocuments(
  documents: Array<{ docId: string; docTitle: string; feedback: string; issues: any[] }>,
  visaType: string, applicationContext: string, apiKey: string
): Promise<{ flags: CrossDocFlag[]; summary: string }> {
  const docSummaries = documents.map(d =>
    `- ${d.docTitle} (${d.docId}): ${d.feedback}\n  Issues: ${d.issues.map((i: any) => i.message).join('; ') || 'None'}`
  ).join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `You review cross-document consistency for UK ${visaType} visa applications. Check name/date/financial/address consistency. JSON only: {"flags":[{"relatedDocId":"","relatedDocTitle":"","issue":"","severity":"high|medium|low"}],"summary":""}` },
        { role: 'user', content: `Context: ${applicationContext}\n\nDocuments:\n${docSummaries}\n\nFind inconsistencies. JSON only.` },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) return { flags: [], summary: 'Cross-document check unavailable.' };

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      summary: parsed.summary || '',
    };
  }

  return { flags: [], summary: '' };
}
