'use client';

// ─── Google Analytics 4 Helper ──────────────────────────────────────────────
// Only fires if user has accepted cookies (GDPR compliant)

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/** Check if analytics consent was given */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('analytics_consent') === 'accepted';
}

/** Set analytics consent */
export function setAnalyticsConsent(accepted: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('analytics_consent', accepted ? 'accepted' : 'declined');
  if (accepted) {
    initGA();
  }
}

/** Get consent status: 'accepted' | 'declined' | null (not yet chosen) */
export function getConsentStatus(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem('analytics_consent');
  if (val === 'accepted') return 'accepted';
  if (val === 'declined') return 'declined';
  return null;
}

/** Dynamically inject GA4 scripts */
export function initGA() {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;
  if (!hasAnalyticsConsent()) return;
  // Don't inject twice
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
  });
}

/** Track a custom event */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (!window.gtag) return;
  window.gtag('event', eventName, params);
}

/** Track page view (for SPA navigation) */
export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (!window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}

// ─── Pre-defined Event Helpers ──────────────────────────────────────────────

export const analytics = {
  signupStarted: (method: 'email' | 'google') =>
    trackEvent('signup_started', { method }),

  signupCompleted: (method: 'email' | 'google') =>
    trackEvent('signup_completed', { method }),

  paywallViewed: (visaType: string) =>
    trackEvent('paywall_viewed', { visa_type: visaType }),

  tierSelected: (tier: string, price: number) =>
    trackEvent('tier_selected', { tier, price }),

  paymentAttempted: (tier: string, price: number) =>
    trackEvent('payment_attempted', { tier, price }),

  paymentSucceeded: (tier: string, price: number) =>
    trackEvent('payment_succeeded', { tier, price, currency: 'GBP' }),

  faqToggled: (question: string) =>
    trackEvent('faq_toggled', { question }),

  cookieConsentGiven: (accepted: boolean) =>
    trackEvent('cookie_consent', { accepted }),
};
