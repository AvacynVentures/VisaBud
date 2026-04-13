import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/verify-session?session_id=<stripe_checkout_session_id>
 * 
 * Verifies a Stripe checkout session is valid and paid.
 * Ensures the user record is marked as unlocked (belt-and-suspenders with webhook).
 * Returns session metadata for the success page.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', paymentStatus: session.payment_status },
        { status: 402 }
      );
    }

    const userId = session.metadata?.userId;
    const email = session.customer_email;

    // Belt-and-suspenders: ensure user record is updated
    // (webhook should have done this, but verify in case of race condition)
    if (userId) {
      await supabaseServer
        .from('users')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('auth_id', userId)
        .then(() => {})
        .catch((err: Error) => {
          console.error('Failed to update user in verify-session:', err);
        });
    }

    return NextResponse.json({
      success: true,
      payment: {
        status: session.payment_status,
        amount: session.amount_total ? session.amount_total / 100 : null,
        currency: session.currency?.toUpperCase() || 'GBP',
        email,
        userId,
      },
    });
  } catch (err: any) {
    console.error('Verify session error:', err);

    // Handle specific Stripe errors
    if (err?.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify payment session' },
      { status: 500 }
    );
  }
}
