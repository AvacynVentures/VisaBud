import { stripe, VISABUD_PRODUCT_NAME, VISABUD_PRICE_PENCE, PREMIUM_REVIEW_TIERS } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Tier configuration for checkout
 */
const TIER_CONFIG = {
  standard: {
    name: VISABUD_PRODUCT_NAME,
    description: 'Personalised document checklist, timeline, risk assessment & PDF export',
    unitAmount: VISABUD_PRICE_PENCE, // £50
  },
  premium: {
    name: 'VisaBud Premium Pack',
    description: 'Everything in Standard + AI document verification, templates & email support',
    unitAmount: PREMIUM_REVIEW_TIERS.ai_review_149.pricePence, // £149
  },
  expert: {
    name: 'VisaBud Expert Pack',
    description: 'Everything in Premium + expert immigration review (24h turnaround) & priority support',
    unitAmount: PREMIUM_REVIEW_TIERS.human_review_199.pricePence, // £299
  },
} as const;

type TierKey = keyof typeof TIER_CONFIG;

/**
 * POST /api/checkout
 * Create a Stripe checkout session for the selected VisaBud tier
 *
 * Body: { tier?: "standard" | "premium" | "expert" }
 * Headers: Authorization: Bearer <supabase_access_token>
 * Defaults to "standard" if no tier provided (backwards compat)
 */
export async function POST(req: NextRequest) {
  try {
    // Extract auth token from Authorization header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required — no token provided' },
        { status: 401 }
      );
    }

    // Validate token with Supabase by creating an auth-aware client
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
        { error: 'Invalid or expired session. Please sign in again.' },
        { status: 401 }
      );
    }

    const email = user.email || 'unknown@example.com';

    // Parse tier from request body
    let tier: TierKey = 'standard';
    try {
      const body = await req.json();
      if (body.tier && body.tier in TIER_CONFIG) {
        tier = body.tier as TierKey;
      }
    } catch {
      // No body or invalid JSON — default to standard
    }

    const config = TIER_CONFIG[tier];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      metadata: {
        userId: user.id,
        email: email,
        tier: tier,
        ...(tier !== 'standard' && { productType: 'premium_review' }),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: err.message },
      { status: 500 }
    );
  }
}
