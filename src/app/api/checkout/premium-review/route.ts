import { stripe, STRIPE_PRICE_IDS, type TierKey } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/checkout/premium-review
 * Create a Stripe checkout session for premium document review.
 *
 * Uses Stripe Price IDs — no hardcoded amounts.
 * Accepts tier: "premium" or "expert" (standard is handled by /api/checkout)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier } = body;

    // Validate tier — only premium and expert are valid for review checkout
    if (!tier || !['premium', 'expert'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "premium" or "expert".' },
        { status: 400 }
      );
    }

    const priceId = STRIPE_PRICE_IDS[tier as TierKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for tier: ${tier}` },
        { status: 500 }
      );
    }

    // Get current user from auth header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const email = user.email || 'unknown@example.com';

    // Create Stripe checkout session using Price ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,  // ← Stripe Price ID — source of truth for amount
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/review-success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      metadata: {
        userId: user.id,
        email: email,
        productType: 'premium_review',
        tier: tier,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err: any) {
    console.error('Premium review checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: err.message },
      { status: 500 }
    );
  }
}
