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

    // 3. Check latest payment
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount_pence, product_type, payment_status')
      .eq('user_id', userData.id)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    const payment = payments?.[0];
    
    // Determine tier from payment (same logic as webhook)
    let tier = 'none';
    if (payment) {
      // Premium: product_type = 'premium_review' OR amount >= £79.99 (7999 pence)
      if (payment.product_type === 'premium_review' || payment.amount_pence >= 7999) {
        tier = 'premium';
      }
      // Standard: £9.99 (999 pence) to £79.98
      else if (payment.amount_pence > 0) {
        tier = 'standard';
      }
    }

    console.log(`[user/tier] User ${user.id}: payment=${JSON.stringify(payment)}, tier = ${tier}`);

    return NextResponse.json({
      tier,
      isPremium: tier === 'premium',
      isStandard: tier === 'standard',
    });
  } catch (error) {
    console.error('[user/tier] Error:', error);
    return NextResponse.json(
      { tier: 'none', isPremium: false },
      { status: 200 }
    );
  }
}
