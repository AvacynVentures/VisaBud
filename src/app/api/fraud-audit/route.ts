import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// Internal endpoint for fraud audit reporting
// Protected by a secret - not exposed to users
const AUDIT_SECRET = process.env.FRAUD_AUDIT_SECRET || 'visabud-audit-internal';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== AUDIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get users with 5+ visa submissions in the past week
    const { data: suspiciousUsers, error } = await supabaseServer
      .from('visa_applications')
      .select(`
        user_id,
        applicant_name,
        applicant_email,
        visa_type,
        submitted_at,
        payment_id
      `)
      .gte('submitted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('submitted_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by user_id
    const userMap: Record<string, {
      user_id: string;
      applicants: string[];
      visa_types: string[];
      payment_ids: string[];
      first_submission: string;
      last_submission: string;
      total_visas: number;
    }> = {};

    for (const app of (suspiciousUsers || [])) {
      if (!userMap[app.user_id]) {
        userMap[app.user_id] = {
          user_id: app.user_id,
          applicants: [],
          visa_types: [],
          payment_ids: [],
          first_submission: app.submitted_at,
          last_submission: app.submitted_at,
          total_visas: 0,
        };
      }
      const u = userMap[app.user_id];
      u.applicants.push(app.applicant_name);
      if (!u.visa_types.includes(app.visa_type)) u.visa_types.push(app.visa_type);
      if (!u.payment_ids.includes(app.payment_id)) u.payment_ids.push(app.payment_id);
      if (app.submitted_at < u.first_submission) u.first_submission = app.submitted_at;
      if (app.submitted_at > u.last_submission) u.last_submission = app.submitted_at;
      u.total_visas++;
    }

    // Filter to suspicious (5+ visas)
    const suspicious = Object.values(userMap)
      .filter(u => u.total_visas >= 5)
      .sort((a, b) => b.total_visas - a.total_visas);

    // Get total user counts
    const totalUsers = Object.keys(userMap).length;
    const cleanUsers = totalUsers - suspicious.length;

    // Get feature access stats
    const { data: accessLogs } = await supabaseServer
      .from('feature_access_logs')
      .select('feature, user_id')
      .gte('logged_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const pdfExports = (accessLogs || []).filter((l: { feature: string }) => l.feature === 'pdf_export').length;
    const templateDownloads = (accessLogs || []).filter((l: { feature: string }) => l.feature === 'template_download').length;

    return NextResponse.json({
      week_of: new Date().toISOString().split('T')[0],
      summary: {
        total_users: totalUsers,
        clean: cleanUsers,
        suspicious: suspicious.length,
        pdf_exports: pdfExports,
        template_downloads: templateDownloads,
      },
      suspicious_accounts: suspicious,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
