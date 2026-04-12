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

    const supabase = createClient(supabaseUrl, serviceKey, {
      db: { schema: 'public' }
    });

    const results: string[] = [];

    // Step 1: Create a helper function for DDL if it doesn't exist
    const createFnSql = `
      CREATE OR REPLACE FUNCTION exec_ddl(ddl_sql text) 
      RETURNS text 
      LANGUAGE plpgsql 
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE ddl_sql;
        RETURN 'OK';
      END;
      $$;
    `;

    // Try to create the helper function using raw SQL via fetch to PostgREST
    // Actually, we can use the Supabase REST endpoint for SQL directly
    // First, try to create the exec_ddl function via the Supabase internal endpoint
    const createFnResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: createFnSql })
    });
    
    if (!createFnResponse.ok) {
      // The query RPC doesn't exist, try another approach
      // Use the Supabase SQL endpoint directly
      const sqlApiResponse = await fetch(`${supabaseUrl}/pg/query`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: createFnSql })
      });

      if (!sqlApiResponse.ok) {
        results.push(`Cannot create DDL function: ${await sqlApiResponse.text()}`);
        
        // Last resort: try the database webhook approach
        // Actually, try creating tables via INSERT INTO pg_catalog approach
        // That won't work either. Let me try the Supabase Management API
        
        // Try to use the internal postgres function
        const { error: rpcErr } = await supabase.rpc('create_tables_migration', {});
        if (rpcErr) {
          results.push(`RPC failed: ${rpcErr.message}`);
        }

        return NextResponse.json({ 
          results, 
          action_required: 'Please run the following SQL in Supabase Dashboard > SQL Editor',
          sql: getCreateTablesSql()
        });
      }
    }

    // If exec_ddl was created, use it to create tables
    const ddlStatements = getCreateTablesSql().split(';').filter(s => s.trim());
    for (const stmt of ddlStatements) {
      if (!stmt.trim()) continue;
      const { error } = await supabase.rpc('exec_ddl', { ddl_sql: stmt.trim() });
      results.push(error ? `ERROR: ${error.message}` : `OK: ${stmt.trim().substring(0, 50)}...`);
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function getCreateTablesSql(): string {
  return `
CREATE TABLE IF NOT EXISTS public.visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  payment_id UUID NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_passport_id TEXT,
  visa_type TEXT NOT NULL,
  application_status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT visa_app_unique UNIQUE(payment_id, applicant_email, visa_type),
  CONSTRAINT valid_visa_type CHECK (visa_type IN ('spouse', 'skilled', 'citizenship')),
  CONSTRAINT valid_app_status CHECK (application_status IN ('draft', 'submitted', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_visa_apps_user ON public.visa_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_visa_apps_payment ON public.visa_applications(payment_id);
CREATE INDEX IF NOT EXISTS idx_visa_apps_submitted ON public.visa_applications(submitted_at DESC);

ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.feature_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  feature TEXT NOT NULL,
  visa_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_feature CHECK (feature IN ('pdf_export', 'template_download', 'expert_review'))
);

CREATE INDEX IF NOT EXISTS idx_access_logs_user ON public.feature_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON public.feature_access_logs(logged_at DESC);

ALTER TABLE public.feature_access_logs ENABLE ROW LEVEL SECURITY;
  `.trim();
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Migration endpoint active. POST with {"secret":"..."} to run.',
    sql_to_run_manually: getCreateTablesSql()
  });
}
