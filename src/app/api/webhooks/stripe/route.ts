import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase';
import { headers } from 'next/headers';

// ─── Post-Purchase Email via Resend ─────────────────────────────────────────

const TIER_LABELS: Record<string, { name: string; features: string[] }> = {
  standard: {
    name: 'Standard Pack',
    features: ['Personalised document checklist', 'Step-by-step timeline', 'Risk assessment & alerts', 'PDF export'],
  },
  premium: {
    name: 'Premium Pack',
    features: ['AI document verification', 'Preparation templates', 'Email support (24h)', 'Everything in Standard'],
  },
  expert: {
    name: 'Expert Pack',
    features: ['Expert immigration review', 'Priority support', '24-hour turnaround', 'Everything in Premium'],
  },
};

async function sendPostPurchaseEmail(email: string, tier: string, amountGBP: number) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !email) {
    console.log(`[email] Skipping post-purchase email (no RESEND_API_KEY or no email)`);
    return;
  }

  const info = TIER_LABELS[tier] || TIER_LABELS.standard;
  const featureList = info.features.map(f => `<li style="margin-bottom:6px;">✅ ${f}</li>`).join('');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VisaBud <noreply@visabud.co.uk>',
        to: [email],
        subject: `🎉 You've unlocked the ${info.name}!`,
        html: `
<!DOCTYPE html>
<html>
<head><style>
body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { text-align: center; padding: 24px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 12px 12px 0 0; }
.header h1 { color: white; margin: 0; font-size: 24px; }
.header p { color: #d1fae5; margin: 8px 0 0; font-size: 14px; }
.body { background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; }
.amount { text-align: center; font-size: 28px; font-weight: bold; color: #059669; margin: 16px 0; }
.features { background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0; }
.features ul { padding-left: 0; list-style: none; margin: 8px 0; }
.steps { background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; }
.steps ol { padding-left: 20px; margin: 8px 0; }
.steps li { margin-bottom: 8px; color: #1e40af; }
.cta { display: block; text-align: center; background: #1e40af; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
.footer { text-align: center; font-size: 12px; color: #9ca3af; padding: 16px; border-top: 1px solid #e5e7eb; }
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Payment Confirmed! ✅</h1>
    <p>You've unlocked the ${info.name}</p>
  </div>
  <div class="body">
    <div class="amount">£${amountGBP.toFixed(2)} paid</div>
    
    <div class="features">
      <p style="font-weight:bold; margin:0 0 8px;">What's now unlocked:</p>
      <ul>${featureList}</ul>
    </div>

    <div class="steps">
      <p style="font-weight:bold; margin:0 0 8px; color:#1e40af;">🚀 Here's what to do next:</p>
      <ol>
        <li>Log in to your dashboard and personalise your checklist</li>
        <li>Upload your documents for verification</li>
        <li>Download your complete application pack</li>
      </ol>
    </div>

    <a href="https://visabud.co.uk/dashboard" class="cta">Go to Your Dashboard →</a>

    <p style="font-size:13px; color:#6b7280; text-align:center;">
      Questions? Reply to this email or contact <a href="mailto:support@visabud.co.uk">support@visabud.co.uk</a>
    </p>
  </div>
  <div class="footer">
    <p>VisaBud Ltd · Not a law firm · For guidance only</p>
    <p>Always verify with official Gov.uk guidance before submitting your application.</p>
  </div>
</div>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[email] Resend API error: ${res.status} ${errBody}`);
    } else {
      console.log(`[email] Post-purchase email sent to ${email} for ${tier}`);
    }
  } catch (err) {
    console.error('[email] Failed to send post-purchase email:', err);
  }
}

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
    const authUserId = session.metadata?.userId; // This is the Supabase auth user ID
    const email = session.customer_email;
    const productType = session.metadata?.productType;
    const tier = session.metadata?.tier;

    if (!authUserId) {
      console.error('No userId in session metadata');
      return;
    }

    // Resolve the users table ID from auth_id
    // First try auth_id column, then fallback to id (for backwards compat)
    let tableUserId = authUserId;
    const { data: userData } = await supabaseServer
      .from('users')
      .select('id')
      .eq('auth_id', authUserId)
      .single();

    if (userData) {
      tableUserId = userData.id;
    } else {
      // If no user record exists yet, create one
      const { data: newUser } = await supabaseServer
        .from('users')
        .insert({
          auth_id: authUserId,
          email: email || 'unknown@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      if (newUser) tableUserId = newUser.id;
    }

    // ── Premium Review Purchase ──────────────────────────────────────────
    if (productType === 'premium_review' && tier) {
      await handlePremiumReviewPurchase(session, tableUserId, email, tier);
      return;
    }

    // ── Standard Full Pack Purchase (existing flow) ─────────────────────
    await handleFullPackPurchase(session, tableUserId, email);
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
      amount_pence: session.amount_total || 0,
      payment_status: 'completed',
      product_type: 'premium_review',
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Failed to record premium review payment:', paymentError);
    return;
  }

  // Update user record (best effort — premium_tier column may not exist yet)
  await supabaseServer
    .from('users')
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .then(() => {})
    .catch((err: Error) => console.error('Failed to update user:', err));

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

  // Send post-purchase email via Resend
  await sendPostPurchaseEmail(_email, tier, (session.amount_total || 0) / 100);
}

/**
 * Handle standard full pack purchase (original flow)
 */
async function handleFullPackPurchase(session: any, userId: string, _email: string) {
  const tier = session.metadata?.tier || 'standard';
  const amountPence = session.amount_total || 1;

  // Record payment in payments table (source of truth for unlock status)
  // Include tier column so we always know what was purchased (not just inferred from amount)
  const { error: paymentError } = await supabaseServer
    .from('payments')
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      amount_pence: amountPence,
      currency: 'GBP',
      payment_status: 'completed',
      product_type: tier === 'standard' ? 'full_pack' : 'premium_review',
      tier: tier, // Store tier directly so dashboard always knows what was purchased
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Failed to record payment:', paymentError);
    // Try with legacy column names as fallback
    const { error: fallbackError } = await supabaseServer
      .from('payments')
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        amount: amountPence / 100,
        status: 'completed',
        product_type: tier === 'standard' ? 'full_pack' : 'premium_review',
        created_at: new Date().toISOString(),
      });
    if (fallbackError) {
      console.error('Fallback payment insert also failed:', fallbackError);
      return;
    }
  }

  // Update user record (best effort — unlocked column may not exist yet)
  await supabaseServer
    .from('users')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', userId);

  // Add audit log (best effort)
  await supabaseServer
    .from('audit_log')
    .insert({
      user_id: userId,
      action: `payment_completed_${tier}`,
      timestamp: new Date().toISOString(),
    })
    .then(() => {})
    .catch(() => {}); // audit_log may not exist

  console.log(`Payment completed for user ${userId} (${tier})`);

  // Send post-purchase email
  await sendPostPurchaseEmail(_email, tier, amountPence / 100);
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
