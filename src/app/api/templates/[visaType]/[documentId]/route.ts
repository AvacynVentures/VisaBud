// =============================================================================
// /api/templates/[visaType]/[documentId] — Serve individual template PDFs
// Protected: requires £149 AI Premium tier purchase
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTemplate } from '@/lib/template-data';
import { generateTemplatePDF, getTemplateFilename } from '@/lib/template-pdf';
import { VisaTypeKey } from '@/lib/visa-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { visaType: string; documentId: string } }
) {
  try {
    const { visaType, documentId } = params;

    // Validate visa type
    const validVisaTypes: VisaTypeKey[] = ['spouse', 'skilled_worker', 'citizenship'];
    if (!validVisaTypes.includes(visaType as VisaTypeKey)) {
      return NextResponse.json(
        { error: 'Invalid visa type. Must be: spouse, skilled_worker, or citizenship' },
        { status: 400 }
      );
    }

    // Find the template
    const template = getTemplate(documentId);
    if (!template) {
      return NextResponse.json(
        { error: `Template not found: ${documentId}` },
        { status: 404 }
      );
    }

    // Verify template belongs to the requested visa type
    if (template.visaType !== visaType) {
      return NextResponse.json(
        { error: `Template ${documentId} does not belong to visa type ${visaType}` },
        { status: 400 }
      );
    }

    // Auth check: verify user has premium access
    const authHeader = request.headers.get('authorization');
    
    // Try to get session from Supabase auth
    let hasPremiumAccess = false;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (user && !error) {
        // Check if user has premium tier purchase
        const { data: purchases } = await supabase
          .from('purchases')
          .select('tier')
          .eq('user_id', user.id)
          .in('tier', ['ai_review_149', 'human_review_199'])
          .limit(1);
        
        hasPremiumAccess = purchases && purchases.length > 0;
      }
    }

    // Also check query param for session-based access (from dashboard)
    const sessionParam = request.nextUrl.searchParams.get('session');
    if (sessionParam) {
      const { data: { user }, error } = await supabase.auth.getUser(sessionParam);
      if (user && !error) {
        const { data: purchases } = await supabase
          .from('purchases')
          .select('tier')
          .eq('user_id', user.id)
          .in('tier', ['ai_review_149', 'human_review_199'])
          .limit(1);
        
        hasPremiumAccess = (purchases && purchases.length > 0) || false;
      }
    }

    // For development/demo: allow access if TEMPLATE_DEMO=true
    if (process.env.TEMPLATE_DEMO === 'true') {
      hasPremiumAccess = true;
    }

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { 
          error: 'Premium access required',
          message: 'Document preparation templates are included with the £149 AI Premium Review tier.',
          upgradeUrl: '/dashboard'
        },
        { status: 403 }
      );
    }

    // Generate the PDF
    const pdfBuffer = generateTemplatePDF(template);
    const filename = getTemplateFilename(template);

    // Return as downloadable PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating template PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate template PDF' },
      { status: 500 }
    );
  }
}
