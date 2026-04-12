import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Auth callback handler for Supabase magic link.
 * When the user clicks the magic link in their email, Supabase redirects here
 * with a code. We exchange it for a session, ensure the user profile exists,
 * then redirect to the wizard.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user profile exists in the users table
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        const supabaseAdmin = createClient(supabaseUrl, serviceKey);
        
        // Upsert user record (create if doesn't exist, ignore if it does)
        await supabaseAdmin
          .from('users')
          .upsert(
            {
              auth_id: data.user.id,
              email: data.user.email,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'auth_id' }
          );
      }
    }
  }

  // Redirect to the wizard start page
  return NextResponse.redirect(new URL('/app/start', request.url));
}
