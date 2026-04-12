import { stripe, VISABUD_PRODUCT_NAME, VISABUD_PRICE_PENCE } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/checkout
 * Create a Stripe checkout session for the VisaBud Full Pack
 */
export async function POST(_req: NextRequest) {
  try {
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
              name: VISABUD_PRODUCT_NAME,
              description: 'Full access to personalized visa checklist, timeline, and risk assessment',
            },
            unit_amount: VISABUD_PRICE_PENCE, // £50.00 in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/dashboard`,
      metadata: {
        userId: user.id,
        email: email,
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
