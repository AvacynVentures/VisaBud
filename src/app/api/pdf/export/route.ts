import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, trackPDFExport } from '@/lib/supabase';
import { Application, Document } from '@/lib/types';

// Using a server-side PDF library (we'll implement client-side in component)
// This endpoint prepares the data for PDF generation

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Missing applicationId' },
        { status: 400 }
      );
    }

    // Fetch application
    const { data: application, error: appError } = await supabaseServer
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single() as { data: Application; error: any };

    if (appError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Fetch documents
    const { data: documents, error: docsError } = await supabaseServer
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('display_order') as { data: Document[]; error: any };

    if (docsError) {
      console.error('Documents fetch error:', docsError);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    // Fetch risk alerts
    const { data: riskAlerts, error: alertsError } = await supabaseServer
      .from('risk_alerts')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at') as { data: any[]; error: any };

    if (alertsError) {
      console.error('Risk alerts fetch error:', alertsError);
    }

    // Track PDF export silently (non-blocking)
    trackPDFExport(application.visa_type).catch(() => {});

    // Return data for PDF generation
    return NextResponse.json({
      application,
      documents: documents || [],
      riskAlerts: riskAlerts || [],
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('PDF export error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
