/**
 * GET /api/user/tier?app={applicationId}
 * 
 * Returns the user's tier for a specific application.
 * If ?app={id} is provided, checks that application's tier.
 * Otherwise checks the latest application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Get user from token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ tier: 'none', isPremium: false }, { status: 200 });
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ tier: 'none', isPremium: false }, { status: 200 });
    }

    // 2. Get application ID from query params
    const appId = req.nextUrl.searchParams.get('app');

    let appTier = 'none';
    
    if (appId) {
      // If specific app ID provided, fetch that application
      const { data: app } = await supabaseAdmin
        .from('applications')
        .select('purchased_tier')
        .eq('id', appId)
        .maybeSingle();

      appTier = app?.purchased_tier || 'none';
      console.log(`[user/tier] App ${appId}: tier = ${appTier}`);
    } else {
      // Otherwise get user's latest application
      // First, find user record
      const { data: userRecord } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (userRecord) {
        // Then get their latest app
        const { data: apps } = await supabaseAdmin
          .from('applications')
          .select('purchased_tier')
          .eq('user_id', userRecord.id)
          .order('created_at', { ascending: false })
          .limit(1);

        appTier = apps?.[0]?.purchased_tier || 'none';
        console.log(`[user/tier] User ${user.id}: tier = ${appTier}`);
      } else {
        console.log(`[user/tier] User record not found for auth_id ${user.id}`);
      }
    }

    return NextResponse.json({
      tier: appTier,
      isPremium: appTier === 'premium',
      isStandard: appTier === 'standard',
    });
  } catch (error) {
    console.error('[user/tier] Error:', error);
    return NextResponse.json({ tier: 'none', isPremium: false }, { status: 200 });
  }
}
