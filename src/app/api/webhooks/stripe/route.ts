import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase';
import { headers } from 'next/headers';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as any);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as any);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 500 });
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: any) {
  try {
    const userId = session.metadata?.userId;
    const email = session.customer_email;
    const productType = session.metadata?.productType;
    const tier = session.metadata?.tier;

    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    // ── Premium Review Purchase ──────────────────────────────────────────
    if (productType === 'premium_review' && tier) {
      await handlePremiumReviewPurchase(session, userId, email, tier);
      return;
    }

    // ── Standard Full Pack Purchase (existing flow) ─────────────────────
    await handleFullPackPurchase(session, userId, email);
  } catch (err) {
    console.error('Error handling checkout session:', err);
  }
}

/**
 * Handle premium document review purchase
 */
async function handlePremiumReviewPurchase(
  session: any,
  userId: string,
  _email: string,
  tier: string
) {
  // Record payment
  const { error: paymentError } = await supabaseServer
    .from('payments')
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      amount: (session.amount_total || 0) / 100,
      status: 'completed',
      product_type: 'premium_review',
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Failed to record premium review payment:', paymentError);
    return;
  }

  // Update user premium tier
  const { error: updateError } = await supabaseServer
    .from('users')
    .update({
      premium_tier: tier,
      premium_purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update user premium tier:', updateError);
    return;
  }

  // Create review session record
  const { error: sessionError } = await supabaseServer
    .from('review_sessions')
    .insert({
      user_id: userId,
      tier: tier,
      status: 'pending',
      stripe_session_id: session.id,
      amount_pence: session.amount_total || 0,
      created_at: new Date().toISOString(),
    });

  if (sessionError) {
    console.error('Failed to create review session:', sessionError);
  }

  // Add audit log
  await supabaseServer
    .from('audit_log')
    .insert({
      user_id: userId,
      action: `premium_review_purchased_${tier}`,
      timestamp: new Date().toISOString(),
    });

  console.log(`Premium review (${tier}) purchased by user ${userId}`);

  // TODO: Trigger "Your review has started" email via Resend
  // await sendPremiumReviewStartedEmail(email, tier);
}

/**
 * Handle standard full pack purchase (original flow)
 */
async function handleFullPackPurchase(session: any, userId: string, _email: string) {
  // Record payment
  const { error: paymentError } = await supabaseServer
    .from('payments')
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      amount: (session.amount_total || 5000) / 100,
      status: 'completed',
      product_type: 'full_pack',
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Failed to record payment:', paymentError);
    return;
  }

  // Update user unlock status
  const { error: updateError } = await supabaseServer
    .from('users')
    .update({
      unlocked: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update user unlock status:', updateError);
    return;
  }

  // Add audit log
  await supabaseServer
    .from('audit_log')
    .insert({
      user_id: userId,
      action: 'payment_completed',
      timestamp: new Date().toISOString(),
    });

  console.log(`Payment completed for user ${userId}`);
}

/**
 * Handle charge refund
 */
async function handleChargeRefunded(charge: any) {
  try {
    const { data: payment, error: fetchError } = await supabaseServer
      .from('payments')
      .select('user_id')
      .eq('stripe_session_id', charge.payment_intent)
      .single();

    if (fetchError || !payment) {
      console.error('Payment not found for refund:', fetchError);
      return;
    }

    const { error: updateError } = await supabaseServer
      .from('payments')
      .update({
        status: 'refunded',
        created_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', charge.payment_intent);

    if (updateError) {
      console.error('Failed to update payment refund status:', updateError);
      return;
    }

    // Reset premium tier if premium review was refunded
    await supabaseServer
      .from('users')
      .update({
        premium_tier: 'free',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.user_id);

    await supabaseServer
      .from('audit_log')
      .insert({
        user_id: payment.user_id,
        action: 'payment_refunded',
        timestamp: new Date().toISOString(),
      });

    console.log(`Payment refunded for charge ${charge.id}`);
  } catch (err) {
    console.error('Error handling refund:', err);
  }
}
