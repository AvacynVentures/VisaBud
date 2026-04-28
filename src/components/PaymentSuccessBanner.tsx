'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, X } from 'lucide-react';
import { ConfettiBurst } from '@/lib/animations';
import { analytics } from '@/lib/analytics';
import { useApplicationStore } from '@/lib/store';

/**
 * Payment success overlay — shows when user returns to /dashboard?payment=success
 * Displays tier info, confetti, and next steps.
 * Also proactively unlocks the dashboard since Stripe confirmed success.
 */
export default function PaymentSuccessBanner({ onDismiss }: { onDismiss?: () => void }) {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('payment') === 'success';
  const tier = searchParams.get('tier') || 'standard';
  const [visible, setVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const tierInfo: Record<string, { name: string; price: string; features: string[] }> = {
    standard: {
      name: 'Standard Pack',
      price: '£9.99',
      features: [
        'Personalised document checklist',
        'Step-by-step submission timeline',
        'Risk assessment & alerts',
        'PDF export of your plan',
      ],
    },
    premium: {
      name: 'Premium Pack',
      price: '£79.99',
      features: [
        'AI document verification & scoring',
        'Downloadable preparation templates',
        'Email support within 24 hours',
        'Everything in Standard',
      ],
    },

  };

  const info = tierInfo[tier] || tierInfo.standard;

  const { setUnlocked } = useApplicationStore();

  useEffect(() => {
    if (isSuccess) {
      // Proactively unlock — Stripe confirmed success, webhook may still be processing
      setUnlocked(true);
      setVisible(true);
      setConfettiActive(true);
      analytics.paymentSucceeded(tier, parseFloat(info.price.replace('£', '')));
      // Stop confetti after 3s
      const timer = setTimeout(() => setConfettiActive(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, setUnlocked]);

  function handleDismiss() {
    setVisible(false);
    // Clean URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    url.searchParams.delete('tier');
    window.history.replaceState({}, '', url.pathname);
    onDismiss?.();
  }

  if (!isSuccess || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[55] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 pt-8 pb-6 text-center relative">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <ConfettiBurst active={confettiActive} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Payment Successful! 🎉</h2>
            <p className="text-emerald-100 text-sm">
              You&apos;ve unlocked the <strong>{info.name}</strong>
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {/* Amount */}
            <div className="text-center mb-5">
              <span className="text-3xl font-bold text-slate-900">{info.price}</span>
              <span className="text-slate-500 text-sm ml-1">paid (incl. VAT)</span>
            </div>

            {/* What's unlocked */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-emerald-800 mb-3">✅ What&apos;s now unlocked:</p>
              <ul className="space-y-2">
                {info.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next steps */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-blue-800 mb-2">🚀 Here&apos;s what to do next:</p>
              <ol className="space-y-1.5 text-sm text-blue-700">
                <li>1. Personalise your checklist with the visa wizard</li>
                <li>2. Upload your documents for AI verification</li>
                <li>3. Download your complete application pack</li>
              </ol>
            </div>

            {/* CTA */}
            <button
              onClick={handleDismiss}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-sm"
            >
              Continue to Your Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary */}
            <p className="text-center text-xs text-slate-400 mt-4">
              📧 Email confirmation sent ·{' '}
              <a
                href="mailto:support@visabud.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = 'mailto:support@visabud.co.uk';
                }}
              >
                Need help?
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
