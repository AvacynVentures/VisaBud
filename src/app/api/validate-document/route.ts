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

    const provider = getVisionProvider();
    const result = await provider.validateDocument({ image, requirement, mimeType });

    console.log(`[validate-document] provider=${result.provider} latency=${result.latencyMs}ms valid=${result.valid}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Document validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during validation' },
      { status: 500 }
    );
  }
}
