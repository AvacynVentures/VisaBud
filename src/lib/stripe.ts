import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const VISABUD_PRODUCT_NAME = 'VisaBud Full Pack';
export const VISABUD_PRICE_GBP = 50.00; // £50 one-time
export const VISABUD_PRICE_PENCE = 5000; // £50.00 in pence

// Premium Review Tiers
export const PREMIUM_REVIEW_TIERS = {
  ai_review_149: {
    name: 'VisaBud Premium AI Document Review',
    shortName: 'AI Premium Review',
    price: 149.00,
    pricePence: 14900,
    description: 'Professional-grade AI review of all your documents with risk scoring, specific feedback, and cross-document validation.',
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
    deliveryTime: 'Results within minutes',
  },
  human_review_199: {
    name: 'VisaBud Expert Document Review',
    shortName: 'Expert Human Review',
    price: 299.00,
    pricePence: 29900,
    description: 'Full document review by a qualified immigration expert, plus everything in the AI review.',
    includes: [
      'Everything in AI Premium Review',
      'Review by qualified immigration expert',
      'Personalised written feedback',
      'Priority recommendations specific to your case',
      'Risk mitigation strategies',
      'Follow-up clarification (1 round)',
    ],
    excludes: [
      'Formal solicitor opinion / legal advice',
      'Application form completion',
      'Representation to UKVI',
    ],
    deliveryTime: 'Results within 24 hours',
  },
} as const;

export type PremiumTier = keyof typeof PREMIUM_REVIEW_TIERS | 'free';

/**
 * Create a Stripe checkout session for VisaBud
 */
export async function createCheckoutSession(
  email: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
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
            unit_amount: VISABUD_PRICE_PENCE,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        productName: VISABUD_PRODUCT_NAME,
      },
    });

    return { success: true, sessionId: session.id, sessionUrl: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: String(error) };
  }
}

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
        amount: session.amount_total ? session.amount_total / 100 : VISABUD_PRICE_GBP,
      };
    }

    return { success: false, error: 'Payment not yet completed' };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: String(error) };
  }
}
