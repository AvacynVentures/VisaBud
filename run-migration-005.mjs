// Run migration 005 against Supabase using the REST API (pg_query)
// Uses fetch to call the Supabase management API

const SUPABASE_URL = 'https://sviztvlddcqffjtuzwhw.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aXp0dmxkZGNxZmZqdHV6d2h3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkzMjEyMSwiZXhwIjoyMDkxNTA4MTIxfQ.2qes-jiEUaJbREywFsO94NUBOoB2HhK8JUDmxRHhqSI';

const statements = [
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS unlocked BOOLEAN DEFAULT false",
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS premium_tier TEXT DEFAULT 'free'",
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS premium_purchased_at TIMESTAMPTZ",
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name TEXT",
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email'",
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_subscribed BOOLEAN DEFAULT false",
  "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_consent_timestamp TIMESTAMPTZ",
  "CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id)",
];

async function runSQL(sql) {
  // Try via pg REST RPC first
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  return { status: res.status, text: await res.text() };
}

// Alternative: use pg directly
import pg from 'pg';
const { Client } = pg;

async function main() {
  // Extract project ref from URL
  const projectRef = 'sviztvlddcqffjtuzwhw';
  
  // Try direct PostgreSQL connection
  // Supabase connection string format: postgresql://postgres.[ref]:[password]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
  // We don't have the DB password, so let's try the service key approach differently
  
  // Use Supabase's SQL execution via the pg_net extension or direct API
  // Since we can't use RPC, let's use the REST API to insert/update to force schema changes
  
  console.log('Attempting migration via individual ALTER TABLE statements...');
  
  for (const stmt of statements) {
    try {
      // Try via rpc endpoint that might exist
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST', 
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: stmt }),
      });
      console.log(`${stmt.substring(0, 60)}... -> ${res.status}`);
    } catch (e) {
      console.log(`Failed: ${e.message}`);
    }
  }

  // Verify by querying with the new columns
  console.log('\nVerifying columns exist...');
  const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id,auth_id,unlocked,premium_tier&limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });
  console.log(`Verify status: ${verifyRes.status}`);
  if (verifyRes.ok) {
    const data = await verifyRes.json();
    console.log('Sample row:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('Columns still missing. Need to run migration via Supabase SQL editor.');
    console.log('Response:', await verifyRes.text());
  }
}

main().catch(console.error);
