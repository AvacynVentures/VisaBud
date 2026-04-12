import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Premium Review Product Configs
const PREMIUM_TIERS = {
  ai_review_149: {
    name: 'VisaBud Premium AI Document Review',
    description: 'Professional-grade AI review of all your documents with risk scoring, specific feedback, and cross-document validation. Results within 24 hours.',
    pricePence: 14900,  // £149.00
    tier: 'ai_review_149' as const,
  },
  human_review_199: {
    name: 'VisaBud Expert Document Review',
    description: 'Full document review by a qualified immigration expert. Includes everything in AI Review plus personalised human feedback and recommendations. Results within 24 hours.',
    pricePence: 19900,  // £199.00
    tier: 'human_review_199' as const,
  },
};

/**
 * POST /api/checkout/premium-review
 * Create a Stripe checkout session for premium document review
 */
export async function POST(req: NextRequest) {
  try {
    const { tier } = await req.json();

    // Validate tier
    if (!tier || !PREMIUM_TIERS[tier as keyof typeof PREMIUM_TIERS]) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "ai_review_149" or "human_review_199".' },
        { status: 400 }
      );
    }

    const product = PREMIUM_TIERS[tier as keyof typeof PREMIUM_TIERS];

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const email = user.email || 'unknown@example.com';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                tier: product.tier,
              },
            },
            unit_amount: product.pricePence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/review-success?session_id={CHECKOUT_SESSION_ID}&tier=${product.tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      metadata: {
        userId: user.id,
        email: email,
        productType: 'premium_review',
        tier: product.tier,
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
