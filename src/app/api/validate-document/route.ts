import { NextRequest, NextResponse } from 'next/server';
import { getVisionProvider } from '@/lib/get-vision-provider';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { image, requirement, mimeType } = await req.json();

    if (!image || !requirement) {
      return NextResponse.json(
        { error: 'Missing image or requirement' },
        { status: 400 }
      );
    }

    // Check if vision provider API keys are configured
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasAnthropicKey && !hasOpenAIKey) {
      // No AI keys configured — accept document without validation
      console.log('[validate-document] No vision API key configured, accepting document');
      return NextResponse.json({
        valid: true,
        feedback: 'Document uploaded successfully. AI validation not available.',
        provider: 'none',
        latencyMs: 0,
      });
    }

    const provider = getVisionProvider();
    const result = await provider.validateDocument({ image, requirement, mimeType });

    console.log(`[validate-document] provider=${result.provider} latency=${result.latencyMs}ms valid=${result.valid}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Document validation error:', error);
    // Fallback: accept the document even if validation fails
    return NextResponse.json({
      valid: true,
      feedback: 'Document uploaded. Validation temporarily unavailable.',
      provider: 'fallback',
      latencyMs: 0,
    });
  }
}
