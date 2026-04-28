const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://sviztvlddcqffjtuzwhw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aXp0dmxkZGNxZmZqdHV6d2h3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkzMjEyMSwiZXhwIjoyMDkxNTA4MTIxfQ.2qes-jiEUaJbREywFsO94NUBOoB2HhK8JUDmxRHhqSI'
);

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aXp0dmxkZGNxZmZqdHV6d2h3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkzMjEyMSwiZXhwIjoyMDkxNTA4MTIxfQ.2qes-jiEUaJbREywFsO94NUBOoB2HhK8JUDmxRHhqSI';

const queries = [
  "ALTER TABLE applications ADD COLUMN IF NOT EXISTS checklist_progress JSONB DEFAULT '{}'::jsonb",
  "ALTER TABLE applications ADD COLUMN IF NOT EXISTS purchased_tier TEXT DEFAULT 'none'",
  "ALTER TABLE applications ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT",
  "ALTER TABLE applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'",
  "ALTER TABLE document_uploads ADD COLUMN IF NOT EXISTS application_id UUID",
];

async function runMigration() {
  for (const sql of queries) {
    console.log('Running:', sql.slice(0, 80) + '...');
    
    const res = await fetch('https://sviztvlddcqffjtuzwhw.supabase.co/pg/query', {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    if (res.ok) {
      console.log('  ✅ Success');
    } else {
      const text = await res.text();
      console.log('  ❌ Failed:', res.status, text.slice(0, 200));
    }
  }
  
  // Verify by trying to insert
  console.log('\nVerifying...');
  const { data, error } = await sb.from('applications').select('id').limit(1);
  if (error) {
    console.log('❌ Verification failed:', error.message);
  } else {
    console.log('✅ Applications table accessible');
  }
}

runMigration().catch(console.error);
