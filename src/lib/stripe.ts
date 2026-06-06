import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

// ─── Stripe Price IDs (from env — source of truth is Stripe dashboard) ──────

export const STRIPE_PRICE_IDS = {
  unlocked: process.env.STRIPE_PRICE_STANDARD!, // reuse existing standard price ID env var
} as const;

export type TierKey = keyof typeof STRIPE_PRICE_IDS;

// ─── Tier metadata (non-price display content) ─────────────────────────────

export const TIER_METADATA: Record<TierKey, {
  name: string;
  shortName: string;
  description: string;
  deliveryTime: string;
  includes: string[];
  excludes: string[];
}> = {
  unlocked: {
    name: 'VisaBud Full Access',
    shortName: 'Full Access',
    description: 'Complete checklist + AI verification on all documents + 37 preparation templates',
    deliveryTime: 'Instant',
    includes: [
      'All checklist items unlocked (30+)',
      'AI document verification on every item',
      'Risk scoring & confidence scores',
      'Cross-document consistency checks',
      '37 downloadable document preparation templates',
      'PDF export',
      'Timeline & milestone tracking',
    ],
    excludes: [],
  },
};

// ─── Utility functions ──────────────────────────────────────────────────────

/**
 * Retrieve a checkout session from Stripe
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return { success: true, session };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Process successful payment (called from webhook)
 */
export async function processSuccessfulPayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return {
        success: true,
        userId: session.metadata?.userId,
        email: session.customer_email,
        amount: session.amount_total ? session.amount_total / 100 : 0,
      };
    }

    return { success: false, error: 'Payment not yet completed' };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: String(error) };
  }
}
