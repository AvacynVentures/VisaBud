import { stripe, VISABUD_PRODUCT_NAME, VISABUD_PRICE_PENCE, PREMIUM_REVIEW_TIERS } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/checkout
 * Create a Stripe checkout session
 * Body: { tier: 'standard' | 'premium' | 'expert' }
 */
export async function POST(req: NextRequest) {
  try {
    // Extract auth token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring('Bearer '.length);

    // Validate token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Parse request body to get tier
    const body = await req.json();
    const tier = body.tier || 'standard';

    const email = user.email || 'unknown@example.com';

    // Define pricing per tier
    let productName = '';
    let description = '';
    let unitAmount = VISABUD_PRICE_PENCE;
    let productType = 'standard';

    if (tier === 'premium') {
      productName = PREMIUM_REVIEW_TIERS.ai_review_149.name;
      description = PREMIUM_REVIEW_TIERS.ai_review_149.description;
      unitAmount = PREMIUM_REVIEW_TIERS.ai_review_149.pricePence;
      productType = 'premium_review';
    } else if (tier === 'expert') {
      productName = PREMIUM_REVIEW_TIERS.human_review_199.name;
      description = PREMIUM_REVIEW_TIERS.human_review_199.description;
      unitAmount = PREMIUM_REVIEW_TIERS.human_review_199.pricePence;
      productType = 'expert_review';
    } else {
      // Standard tier
      productName = VISABUD_PRODUCT_NAME;
      description = 'Full access to personalized visa checklist, timeline, and risk assessment';
      unitAmount = VISABUD_PRICE_PENCE;
      productType = 'standard';
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: productName,
              description,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      metadata: {
        userId: user.id,
        email: email,
        tier,
        productType,
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
