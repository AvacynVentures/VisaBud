import { NextResponse } from 'next/server';

/**
 * GET /api/prices
 * Returns current pricing for all tiers.
 * Single source of truth — checkout and frontend both consume this.
 */

const PRICES = {
  standard: {
    name: 'VisaBud Full Pack',
    description: 'Personalised document checklist, timeline, risk assessment & PDF export',
    priceGBP: 0.31,
    pricePence: 31,
    tier: 'standard',
  },
  premium: {
    name: 'VisaBud Premium Pack',
    description: 'Everything in Standard + AI document verification, templates & email support',
    priceGBP: 0.32,
    pricePence: 32,
    tier: 'premium',
  },
  expert: {
    name: 'VisaBud Expert Pack',
    description: 'Everything in Premium + expert immigration review (24h turnaround) & priority support',
    priceGBP: 0.33,
    pricePence: 33,
    tier: 'expert',
  },
};

export async function GET() {
  return NextResponse.json(PRICES, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
