// =============================================================================
// /api/templates/list — Public listing of available templates
// No auth required — returns metadata only (not the PDF content)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ALL_TEMPLATES, TEMPLATES_BY_VISA, TOTAL_TEMPLATE_COUNT, VISA_TEMPLATE_COUNTS } from '@/lib/template-data';
import { VisaTypeKey } from '@/lib/visa-data';

export async function GET(request: NextRequest) {
  const visaType = request.nextUrl.searchParams.get('visaType') as VisaTypeKey | null;

  const templates = visaType && TEMPLATES_BY_VISA[visaType]
    ? TEMPLATES_BY_VISA[visaType]
    : ALL_TEMPLATES;

  // Return metadata only — no full content
  const listing = templates.map((t) => ({
    id: t.id,
    visaType: t.visaType,
    title: t.title,
    shortTitle: t.shortTitle,
    category: t.category,
    priority: t.priority,
    checklistCount: t.checklist.length,
    fileTypes: t.formatSpecs.fileTypes,
    downloadUrl: `/api/templates/${t.visaType}/${t.id}`,
  }));

  return NextResponse.json({
    total: TOTAL_TEMPLATE_COUNT,
    counts: VISA_TEMPLATE_COUNTS,
    showing: listing.length,
    filter: visaType || 'all',
    templates: listing,
  });
}
