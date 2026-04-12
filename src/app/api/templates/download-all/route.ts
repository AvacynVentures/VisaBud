// =============================================================================
// /api/templates/download-all — Download all templates as ZIP
// Query params: ?visaType=spouse|skilled_worker|citizenship (optional, defaults to all)
// Protected: requires £149 AI Premium tier
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ALL_TEMPLATES, TEMPLATES_BY_VISA } from '@/lib/template-data';
import { generateTemplatePDF, getTemplateFilename } from '@/lib/template-pdf';
import { VisaTypeKey, VISA_TYPES } from '@/lib/visa-data';
// fflate is a lightweight zip library — already available in the project deps
// If not available, we'll use a manual approach
import { zipSync, strToU8 } from 'fflate';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Auth check
    let hasPremiumAccess = false;
    
    const authHeader = request.headers.get('authorization');
    const sessionParam = request.nextUrl.searchParams.get('session');
    const token = authHeader?.replace('Bearer ', '') || sessionParam;

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
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

    if (process.env.TEMPLATE_DEMO === 'true') {
      hasPremiumAccess = true;
    }

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { 
          error: 'Premium access required',
          message: 'Document preparation templates are included with the £149 AI Premium Review tier.',
        },
        { status: 403 }
      );
    }

    // Determine which templates to include
    const visaTypeParam = request.nextUrl.searchParams.get('visaType') as VisaTypeKey | null;
    let templates = ALL_TEMPLATES;
    let zipFilename = 'VisaBud-All-Templates.zip';

    if (visaTypeParam && TEMPLATES_BY_VISA[visaTypeParam]) {
      templates = TEMPLATES_BY_VISA[visaTypeParam];
      const label = VISA_TYPES[visaTypeParam].shortLabel.replace(/\s+/g, '-');
      zipFilename = `VisaBud-${label}-Templates.zip`;
    }

    // Generate all PDFs and create ZIP
    const files: Record<string, Uint8Array> = {};

    for (const template of templates) {
      const pdfBuffer = generateTemplatePDF(template);
      const filename = getTemplateFilename(template);
      const visaFolder = VISA_TYPES[template.visaType].shortLabel.replace(/\s+/g, '-');
      const path = `${visaFolder}/${filename}`;
      files[path] = new Uint8Array(pdfBuffer);
    }

    // Add a README
    const readmeContent = `VisaBud Document Preparation Templates
========================================

These templates are your comprehensive guide to preparing every document
for your UK visa application. Each template includes:

• What the document is and why it's needed
• What the Home Office specifically requires
• Format specifications (file type, resolution, size)
• What to include
• Common mistakes to avoid
• Pro tips from immigration professionals
• A ready-to-upload checklist

Templates included: ${templates.length}

Visa Types:
- Spouse/Partner Visa: ${TEMPLATES_BY_VISA.spouse.length} templates
- Skilled Worker Visa: ${TEMPLATES_BY_VISA.skilled_worker.length} templates
- British Citizenship: ${TEMPLATES_BY_VISA.citizenship.length} templates

IMPORTANT: Always verify requirements at gov.uk before submitting.
These guides are for informational purposes and do not constitute legal advice.

© VisaBud — visabud.co.uk
`;
    files['README.txt'] = strToU8(readmeContent);

    const zipped = zipSync(files, { level: 6 });

    return new NextResponse(zipped as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating template ZIP:', error);
    return NextResponse.json(
      { error: 'Failed to generate template ZIP' },
      { status: 500 }
    );
  }
}
