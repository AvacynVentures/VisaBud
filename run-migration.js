const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sviztvlddcqffjtuzwhw.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2aXp0dmxkZGNxZmZqdHV6d2h3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkzMjEyMSwiZXhwIjoyMDkxNTA4MTIxfQ.2qes-jiEUaJbREywFsO94NUBOoB2HhK8JUDmxRHhqSI';

const supabase = createClient(url, serviceKey);

async function runMigration() {
  try {
    console.log('Running migration: add onboarding_completed column...');

    // Execute raw SQL via the admin client
    const { error } = await supabase.rpc('set_config', {
      p_name: 'app.jwt_secret',
      p_value: 'super-secret-jwt-token-with-at-least-32-characters-long',
      p_is_local: true
    }).catch(() => ({ error: null })); // Ignore if rpc doesn't exist

    // Add the column using a direct approach
    // We'll use the query API by creating a user with onboarding_completed
    // Then drop if the column doesn't exist, the insert will fail safely

    // Actually, let's try a simpler approach: just test if column exists by trying an update
    const { data, error: testError } = await supabase
      .from('users')
      .select('onboarding_completed')
      .limit(1);

    if (testError && testError.code === '42703') {
      // Column doesn't exist - need to add it
      // We can't run arbitrary SQL via the REST API
      console.error('Column does not exist. Cannot add via REST API.');
      console.error('You must run this SQL in Supabase dashboard:');
      console.error(`
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed ON public.users(onboarding_completed);
      `);
      process.exit(1);
    }

    if (!testError) {
      console.log('✅ Column onboarding_completed already exists');
      process.exit(0);
    }

    console.log('Unexpected error:', testError);
    process.exit(1);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
