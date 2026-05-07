/**
 * GET /api/user/tier
 * 
 * Returns the user's actual premium tier status.
 * Single source of truth for tier checks.
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
      return NextResponse.json(
        { tier: 'none', isPremium: false },
        { status: 200 }
      );
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { tier: 'none', isPremium: false },
        { status: 200 }
      );
    }

    // 2. Get user record
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (!userData) {
      return NextResponse.json(
        { tier: 'none', isPremium: false },
        { status: 200 }
      );
    }

    // 3. Check tier from applications table (same source as dashboard)
    // If user has ANY application with purchased_tier = 'premium', they're premium
    const { data: applications } = await supabaseAdmin
      .from('applications')
      .select('purchased_tier')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const app = applications?.[0];
    const appTier = app?.purchased_tier || 'none';
    
    console.log(`[user/tier] User ${user.id}: application tier = ${appTier}`);

    return NextResponse.json({
      tier: appTier,
      isPremium: appTier === 'premium',
      isStandard: appTier === 'standard',
    });
  } catch (error) {
    console.error('[user/tier] Error:', error);
    return NextResponse.json(
      { tier: 'none', isPremium: false },
      { status: 200 }
    );
  }
}
