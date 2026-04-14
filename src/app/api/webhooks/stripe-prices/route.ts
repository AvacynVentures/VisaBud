import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/webhooks/stripe-prices
 *
 * Stripe webhook handler for price sync.
 * Listens to: price.updated, price.created, price.deleted
 * Updates the Supabase `prices` table so it always mirrors Stripe.
 *
 * Setup:
 *   1. In Stripe Dashboard → Webhooks → Add endpoint
 *   2. URL: https://visabud.co.uk/api/webhooks/stripe-prices
 *   3. Events: price.updated, price.created, price.deleted
 *   4. Copy signing secret → STRIPE_PRICE_WEBHOOK_SECRET env var
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // Use dedicated price webhook secret, fall back to main webhook secret
  const webhookSecret = process.env.STRIPE_PRICE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[stripe-prices] No webhook secret configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[stripe-prices] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[stripe-prices] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'price.updated':
      case 'price.created': {
        const price = event.data.object as any;
        await upsertPrice(price);
        break;
      }
      case 'price.deleted': {
        const price = event.data.object as any;
        await deactivatePrice(price.id);
        break;
      }
      default:
        console.log(`[stripe-prices] Ignoring event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[stripe-prices] Processing error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * Upsert a price from Stripe into Supabase.
 * Tier is determined from: price metadata → product metadata → env var mapping.
 */
async function upsertPrice(stripePrice: any) {
  const tier = await resolveTier(stripePrice);

  if (!tier) {
    console.log(`[stripe-prices] Could not determine tier for price ${stripePrice.id}, skipping`);
    return;
  }

  const unitAmount = stripePrice.unit_amount ?? 0;

  const { error } = await supabaseServer
    .from('prices')
    .upsert(
      {
        tier,
        price_gbp: unitAmount / 100,
        price_pence: unitAmount,
        stripe_price_id: stripePrice.id,
        stripe_product_id: typeof stripePrice.product === 'string'
          ? stripePrice.product
          : stripePrice.product?.id ?? '',
        currency: stripePrice.currency || 'gbp',
        is_active: stripePrice.active !== false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tier' }
    );

  if (error) {
    console.error(`[stripe-prices] Failed to upsert price for tier ${tier}:`, error);
    throw error;
  }

  console.log(`[stripe-prices] Upserted ${tier}: £${(unitAmount / 100).toFixed(2)} (${stripePrice.id})`);
}

/**
 * Mark a price as inactive when deleted in Stripe.
 */
async function deactivatePrice(stripePriceId: string) {
  const { error } = await supabaseServer
    .from('prices')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('stripe_price_id', stripePriceId);

  if (error) {
    console.error(`[stripe-prices] Failed to deactivate price ${stripePriceId}:`, error);
    throw error;
  }

  console.log(`[stripe-prices] Deactivated price: ${stripePriceId}`);
}

/**
 * Resolve the tier for a Stripe price.
 * Priority: price.metadata.tier → product.metadata.tier → env var reverse-lookup
 */
async function resolveTier(stripePrice: any): Promise<string | null> {
  // 1. Check price metadata
  if (stripePrice.metadata?.tier) {
    return stripePrice.metadata.tier;
  }

  // 2. Check product metadata (if product is expanded)
  if (typeof stripePrice.product === 'object' && stripePrice.product?.metadata?.tier) {
    return stripePrice.product.metadata.tier;
  }

  // 3. If product is a string ID, fetch it to check metadata
  if (typeof stripePrice.product === 'string') {
    try {
      const product = await stripe.products.retrieve(stripePrice.product);
      if (product.metadata?.tier) {
        return product.metadata.tier;
      }
    } catch {
      // Fall through to env var lookup
    }
  }

  // 4. Reverse-lookup from env var Price IDs
  const envMapping: Record<string, string> = {
    [process.env.STRIPE_PRICE_STANDARD || '']: 'standard',
    [process.env.STRIPE_PRICE_PREMIUM || '']: 'premium',
    [process.env.STRIPE_PRICE_EXPERT || '']: 'expert',
  };

  return envMapping[stripePrice.id] || null;
}
