import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { TIER_METADATA, type TierKey } from '@/lib/stripe';

/**
 * GET /api/prices
 * Returns pricing from Supabase (synced from Stripe via webhook).
 * Single source of truth chain: Stripe → webhook → Supabase → this endpoint.
 * Cached for 1 hour at CDN, stale-while-revalidate for 24 hours.
 */
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('prices')
      .select('tier, price_gbp, price_pence, stripe_price_id')
      .eq('is_active', true)
      .order('price_pence');

    if (error || !data || data.length === 0) {
      console.error('Failed to fetch prices from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to load pricing' },
        { status: 500 }
      );
    }

    // Build response: merge DB prices with static tier metadata
    const response: Record<string, any> = {};

    for (const row of data) {
      const tier = row.tier as TierKey;
      const meta = TIER_METADATA[tier];
      if (!meta) continue;

      response[tier] = {
        name: meta.name,
        tier,
        priceGBP: Number(row.price_gbp),
        pricePence: row.price_pence,
        stripePriceId: row.stripe_price_id,
        description: meta.description,
        shortName: meta.shortName,
        deliveryTime: meta.deliveryTime,
        includes: meta.includes,
        excludes: meta.excludes,
      };
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    console.error('Failed to fetch prices:', err);
    return NextResponse.json(
      { error: 'Failed to load pricing', details: err.message },
      { status: 500 }
    );
  }
}
