import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// TEMPORARY migration endpoint - DELETE AFTER TABLES ARE CREATED
const MIGRATE_SECRET = 'visabud-migrate-xK9mP3nQ-2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.secret !== MIGRATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!serviceKey) {
      return NextResponse.json({ error: 'Missing service role key' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const results: string[] = [];

    // Check what tables exist
    const tables = ['visa_applications', 'feature_access_logs', 'payments', 'users'];
    for (const t of tables) {
      const { error } = await supabase.from(t).select('*').limit(0);
      results.push(`${t}: ${error ? `ERROR - ${error.message}` : 'EXISTS'}`);
    }

    // If visa_applications doesn't exist, try to create it via raw SQL using pg_net or edge function
    // Actually, we can't run DDL through PostgREST. We need the SQL editor.
    // But we CAN check the db.url in the config...

    return NextResponse.json({ 
      status: 'check',
      supabaseUrl,
      results,
      serviceKeyPrefix: serviceKey.substring(0, 20) + '...',
      note: 'DDL cannot run via PostgREST. Tables must be created via Supabase Dashboard SQL editor.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Migration endpoint active. Use POST with secret.' });
}
