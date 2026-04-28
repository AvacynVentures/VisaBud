import { stripe, STRIPE_PRICE_IDS, type TierKey } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/checkout
 * Create a Stripe checkout session for the selected VisaBud tier.
 *
 * Uses Stripe Price IDs (from env) — Stripe is the source of truth for amounts.
 * No hardcoded prices in this file.
 *
 * Body: { tier?: "standard" | "premium" }
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

    // Parse tier and applicationId from request body
    let tier: TierKey = 'standard';
    let applicationId: string | undefined;
    try {
      const body = await req.json();
      if (body.tier && body.tier in STRIPE_PRICE_IDS) {
        tier = body.tier as TierKey;
      }
      if (body.applicationId) {
        applicationId = body.applicationId;
      }
    } catch {
      // No body or invalid JSON — default to standard
    }

    const priceId = STRIPE_PRICE_IDS[tier];

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for tier: ${tier}. Check STRIPE_PRICE_${tier.toUpperCase()} env var.` },
        { status: 500 }
      );
    }

    // Create Stripe checkout session using Price ID (Stripe holds the amount)
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
      success_url: applicationId
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success&tier=${tier}&app=${applicationId}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success&tier=${tier}`,
      cancel_url: applicationId
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?app=${applicationId}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      metadata: {
        userId: user.id,
        email: email,
        tier: tier,
        ...(applicationId && { applicationId }),
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

    // Surface more useful diagnostics
    const isStripeAuth = err?.type === 'StripeAuthenticationError';
    const isMissingKey = !process.env.STRIPE_SECRET_KEY;
    const isMissingSiteUrl = !process.env.NEXT_PUBLIC_SITE_URL;
    const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 12) || 'NOT_SET';

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        hint: isStripeAuth
          ? 'Stripe API key is invalid or expired. Check STRIPE_SECRET_KEY in Vercel env vars.'
          : isMissingKey
            ? 'STRIPE_SECRET_KEY is not set in environment variables.'
            : isMissingSiteUrl
              ? 'NEXT_PUBLIC_SITE_URL is not set — Stripe needs valid success/cancel URLs.'
              : err.message,
        keyPrefix,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ? 'set' : 'NOT_SET',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkout
 * Health check — verify Stripe connectivity without auth
 */
export async function GET() {
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 12) || 'NOT_SET';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'NOT_SET';

  try {
    // Quick Stripe connectivity check
    await stripe.balance.retrieve();
    return NextResponse.json({
      status: 'ok',
      stripe: 'connected',
      keyPrefix,
      siteUrl: siteUrl !== 'NOT_SET' ? 'set' : 'NOT_SET',
      priceIds: {
        standard: STRIPE_PRICE_IDS.standard ? 'set' : 'NOT_SET',
        premium: STRIPE_PRICE_IDS.premium ? 'set' : 'NOT_SET',
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      stripe: err?.type || 'unknown_error',
      message: err?.message?.substring(0, 100),
      keyPrefix,
      siteUrl: siteUrl !== 'NOT_SET' ? 'set' : 'NOT_SET',
    });
  }
}
