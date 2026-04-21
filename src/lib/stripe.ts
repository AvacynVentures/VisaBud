import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

// ─── Stripe Price IDs (from env — source of truth is Stripe dashboard) ──────

export const STRIPE_PRICE_IDS = {
  standard: process.env.STRIPE_PRICE_STANDARD!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
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
  standard: {
    name: 'VisaBud Full Pack',
    shortName: 'Standard Checklist',
    description: 'Personalised document checklist, timeline, risk assessment & PDF export',
    deliveryTime: 'Instant',
    includes: [
      'Personalised document checklist',
      'Step-by-step timeline',
      'Risk assessment & alerts',
      'PDF export',
    ],
    excludes: [
      'AI document verification',
      'Human expert review',
    ],
  },
  premium: {
    name: 'VisaBud Premium Pack',
    shortName: 'AI Premium Review',
    description: 'Everything in Standard + AI document verification, templates & email support',
    deliveryTime: 'Results within minutes',
    includes: [
      'AI risk scoring (high/medium/low) per document',
      'Specific actionable feedback for each document',
      'Cross-document consistency check',
      'Confidence score per document',
      'Overall application risk assessment',
      'Priority areas to fix before submission',
      '37 downloadable document preparation templates (PDF)',
    ],
    excludes: [
      'Human expert review',
      'Solicitor opinion',
      'Direct consultation',
    ],
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
