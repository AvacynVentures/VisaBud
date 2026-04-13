import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function GET() {
  try {
    // Fetch all prices from Stripe
    const prices = await stripe.prices.list({
      limit: 100,
      expand: ['data.product'],
    });

    // Map prices to tiers (based on product metadata)
    const tierPrices = prices.data.reduce((acc, price) => {
      const product = price.product as Stripe.Product;
      const tier = product.metadata?.tier;

      if (tier && price.unit_amount !== null) {
        acc[tier] = {
          priceId: price.id,
          amount: price.unit_amount,
          currency: price.currency,
          displayAmount: (price.unit_amount / 100).toFixed(2),
          tier: tier,
        };
      }

      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(tierPrices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
