'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Check, Loader2, Zap } from 'lucide-react';
import { useApplicationStore } from '@/lib/store';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TierPrice {
  name: string;
  shortName: string;
  description: string;
  priceGBP: number;
  pricePence: number;
  tier: string;
  deliveryTime: string;
  includes: string[];
  excludes: string[];
}

interface PricesResponse {
  standard: TierPrice;
  premium: TierPrice;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PremiumReviewSelector() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState<PricesResponse | null>(null);

  const { premiumReview } = useApplicationStore();

  // Fetch live prices from API on mount
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('/api/prices');
        if (!res.ok) throw new Error('Failed to load prices');
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
        setError('Unable to load pricing. Please refresh the page.');
      } finally {
        setIsPriceLoading(false);
      }
    }
    fetchPrices();
  }, []);

  // If already purchased, don't show selector
  if (premiumReview.tier !== 'free') {
    return null;
  }

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/premium-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'premium' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (isPriceLoading) {
    return (
      <div className="mt-8 mb-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500 mx-auto" />
        <p className="text-sm text-slate-500 mt-2">Loading pricing...</p>
      </div>
    );
  }

  if (!prices) {
    return null;
  }

  const premiumTier = prices.premium;

  return (
    <div className="mt-8 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-emerald-100 px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">Professional Review</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Get Verified & Confident
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Our AI checks every document against real UKVI requirements — catching issues that cost applicants thousands in reapplication fees.
        </p>
      </div>

      {/* Single Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative rounded-2xl border-2 border-emerald-400 bg-emerald-50/30 ring-2 ring-emerald-200 shadow-lg p-6 max-w-md mx-auto cursor-pointer transition-all"
      >
        {/* Popular badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4 mt-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{premiumTier.shortName}</h4>
            <p className="text-xs text-slate-500">{premiumTier.deliveryTime}</p>
          </div>
        </div>

        <div className="mb-5">
          <span className="text-4xl font-bold text-slate-900">£{premiumTier.priceGBP}</span>
          <span className="text-sm text-slate-500 ml-2">one-time payment</span>
        </div>

        <ul className="space-y-2.5 mb-5 pb-5 border-b border-emerald-200">
          {premiumTier.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up checkout...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Get {premiumTier.shortName}
            </span>
          )}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        <p className="text-xs text-slate-400 mt-3 text-center">
          Secure payment via Stripe · No subscription
        </p>
      </motion.div>

      {/* Social proof */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          💡 The average visa refusal costs £2,000+ in reapplication fees.
          <br />Professional review: less than 8% of that cost.
        </p>
      </div>
    </div>
  );
}
