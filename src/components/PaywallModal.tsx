'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle, Loader2, Shield,
  Users, Clock, Star, ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';
import PaywallFAQ from './PaywallFAQ';
import FeatureComparison from './FeatureComparison';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  visaType: string;
}

const TIERS = [
  {
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    badge: null,
    color: 'blue',
    description: 'Perfect to get started — everything you need to prepare with confidence',
    benefits: [
      'Personalised document checklist',
      'Step-by-step submission timeline',
      'Risk assessment & alerts',
      'PDF export of your plan',
    ],
    buttonLabel: 'Get Started',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
    cardStyle: 'border-gray-200 bg-white',
    priceId: 'standard',
    guarantee: 'Satisfaction guaranteed',
  },
  {
    id: 'premium',
    name: 'AI Premium',
    price: 79.99,
    badge: 'Most Popular',
    color: 'emerald',
    description: 'AI-powered verification to catch mistakes before you submit',
    benefits: [
      'Everything in Standard',
      'AI document verification & scoring',
      'Downloadable preparation templates',
      'Email support within 24 hours',
    ],
    buttonLabel: 'Unlock AI Premium',
    buttonStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    cardStyle: 'border-emerald-400 bg-emerald-50/30 ring-2 ring-emerald-200 shadow-lg',
    priceId: 'premium',
    guarantee: 'Satisfaction guaranteed',
  },
] as const;

export default function PaywallModal({ isOpen, onClose, visaType }: PaywallModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Track paywall view
  if (typeof window !== 'undefined') {
    analytics.paywallViewed(visaType);
  }

  async function handleCheckout(tierId: string) {
    const tier = TIERS.find(t => t.id === tierId);
    if (tier) analytics.tierSelected(tierId, tier.price);

    setIsLoading(tierId);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError('Please sign in to continue.');
        setIsLoading(null);
        return;
      }

      if (tier) analytics.paymentAttempted(tierId, tier.price);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: tierId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please sign in again.');
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        setIsLoading(null);
        return;
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        setError('Could not create checkout session. Please try again.');
        setIsLoading(null);
      }
    } catch (err) {
      setError('Network error. Check your connection and try again.');
      setIsLoading(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center px-2 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      {/* Backdrop */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      </AnimatePresence>

      {/* Modal Card — full width on mobile, max-w-3xl on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto mx-2 sm:mx-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 sm:px-8 pt-7 pb-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-blue-100 text-xs font-medium mb-3">
              <Clock className="w-3.5 h-3.5" />
              Early access pricing — locked in for you
            </div>
            <h2 id="paywall-title" className="text-xl sm:text-2xl font-bold text-white mb-1">
              Unlock Your Complete {visaType} Plan
            </h2>
            <p className="text-blue-200 text-sm">
              Choose the level of support that fits your needs
            </p>
          </motion.div>
        </div>

        {/* Money-Back Guarantee Banner */}
        <div className="bg-emerald-50 px-5 sm:px-8 py-2.5 flex items-center justify-center gap-2 border-b border-emerald-100">
          <Shield className="w-4 h-4 text-emerald-600" />
          <p className="text-xs font-bold text-emerald-700">🛡️ 7-Day Money-Back Guarantee — No Questions Asked</p>
        </div>

        {/* Social Proof */}
        <div className="bg-blue-50 px-5 sm:px-8 py-2 flex items-center justify-center gap-2 border-b border-blue-100">
          <Users className="w-3.5 h-3.5 text-blue-500" />
          <p className="text-xs font-medium text-blue-700">1,000+ applicants have unlocked their plans</p>
        </div>

        {/* Pricing Tiers */}
        <div className="px-3 sm:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {TIERS.map((tier, i) => {
              const loading = isLoading === tier.id;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                  className={`relative flex flex-col rounded-xl border-2 p-4 sm:p-5 transition-all ${tier.cardStyle}`}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-md">
                        <Star className="w-3 h-3" />
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  {/* Tier Name */}
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mt-1">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-2 mb-0.5">
                    <span className="text-3xl font-extrabold text-gray-900">£{tier.price}</span>
                    <span className="text-gray-500 text-xs ml-1">.00</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">One-time payment</p>
                  <p className="text-[10px] text-gray-400 mb-3">incl. UK VAT</p>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2 mb-4 flex-1">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Guarantee line */}
                  <p className="text-[10px] text-emerald-600 font-medium mb-3 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {tier.guarantee} or full refund
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleCheckout(tier.id)}
                    disabled={!!isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 ${tier.buttonStyle}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        {tier.buttonLabel} — £{tier.price}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="px-3 sm:px-8">
          <FeatureComparison />
        </div>

        {/* FAQ */}
        <div className="px-3 sm:px-8">
          <PaywallFAQ />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 sm:mx-8 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <p className="text-sm font-medium text-amber-900 mb-2">{error}</p>
              {error.includes('sign in') && (
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  Sign In Now
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="px-5 sm:px-8 pb-5 space-y-3">
          <button
            onClick={onClose}
            disabled={!!isLoading}
            className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Continue with free preview
          </button>

          <div className="text-center space-y-1.5 pt-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>7-day money-back guarantee · No questions asked</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Secure payment via Stripe · No subscriptions · All prices incl. UK VAT · {' '}
              <a href="/privacy" className="hover:underline">Privacy policy</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
