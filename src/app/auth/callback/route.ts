import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Auth callback handler for Supabase (magic link + OAuth).
 * 
 * Magic link: Supabase redirects with ?code=...
 * OAuth: Supabase redirects with ?code=... (PKCE flow)
 * Errors: ?error=...&error_description=...
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const errorParam = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth/auth errors
  if (errorParam) {
    console.error('Auth callback error:', errorParam, errorDescription);
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('error', errorParam);
    if (errorDescription) {
      loginUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Exchange the code for a session (works for both magic link and OAuth)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Code exchange error:', error);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('error', 'auth_error');
      loginUrl.searchParams.set('error_description', error.message || 'Authentication failed. Please try again.');
      return NextResponse.redirect(loginUrl);
    }

    if (data.user) {
      // Ensure user profile exists in the users table
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        const supabaseAdmin = createClient(supabaseUrl, serviceKey);
        
        // Get display name from OAuth metadata if available
        const displayName = data.user.user_metadata?.full_name 
          || data.user.user_metadata?.name 
          || null;
        
        // Upsert user record (create if doesn't exist, update if it does)
        await supabaseAdmin
          .from('users')
          .upsert(
            {
              auth_id: data.user.id,
              email: data.user.email,
              display_name: displayName,
              auth_provider: data.user.app_metadata?.provider || 'email',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'auth_id' }
          );
      }
    }
  }

  // Redirect new users to visa selection wizard, existing users to dashboard
  // Check if user has completed the onboarding wizard (has a session record)
  if (code) {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey
        );
        const supabaseAuth = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user: currentUser } } = await supabaseAuth.auth.getUser();
        
        if (currentUser) {
          // Check if user has any payments (returning paying customer → dashboard)
          const { data: userData } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('auth_id', currentUser.id)
            .maybeSingle();
          
          if (userData) {
            const { data: payments } = await supabaseAdmin
              .from('payments')
              .select('id')
              .eq('user_id', userData.id)
              .eq('payment_status', 'completed')
              .limit(1);
            
            if (payments && payments.length > 0) {
              // Returning paid user → dashboard
              return NextResponse.redirect(new URL('/dashboard', request.url));
            }
          }
        }
      }
    } catch (err) {
      // If check fails, fall through to /app/start (safe default for new users)
      console.error('Auth callback user check error:', err);
    }
  }

  // New or free users → visa selection wizard
  return NextResponse.redirect(new URL('/app/start', request.url));
}
