'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Check, X, Loader2, Zap, Users } from 'lucide-react';
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
  expert: TierPrice;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PremiumReviewSelector() {
  const [selectedTier, setSelectedTier] = useState<'premium' | 'expert' | null>(null);
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

  const handlePurchase = async (tier: 'premium' | 'expert') => {
    setIsLoading(true);
    setError(null);

    // Map to legacy tier names for backwards compat with checkout endpoint
    const legacyTier = tier === 'premium' ? 'ai_review_149' : 'human_review_199';

    try {
      const response = await fetch('/api/checkout/premium-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: legacyTier }),
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
  const expertTier = prices.expert;

  return (
    <div className="mt-8 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-blue-100 px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">Reduce Rejection Risk</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Professional Document Review
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Get expert-grade validation before you submit. Our AI checks each document against real UKVI requirements — catching issues that cost applicants thousands in reapplication fees.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* AI Review */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all ${
            selectedTier === 'premium'
              ? 'border-violet-500 bg-violet-50/50 shadow-lg shadow-violet-100'
              : 'border-slate-200 hover:border-violet-300 bg-white'
          }`}
          onClick={() => setSelectedTier('premium')}
        >
          {/* Popular badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4 mt-1">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{premiumTier.shortName}</h4>
              <p className="text-xs text-slate-500">{premiumTier.deliveryTime}</p>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-slate-900">£{premiumTier.priceGBP}</span>
            <span className="text-sm text-slate-500 ml-1">one-time</span>
          </div>

          <ul className="space-y-2 mb-4">
            {premiumTier.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 pt-3 mt-3">
            <p className="text-xs text-slate-400 mb-1">Not included:</p>
            {premiumTier.excludes.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs text-slate-400 mr-3">
                <X className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Human Review */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all ${
            selectedTier === 'expert'
              ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100'
              : 'border-slate-200 hover:border-blue-300 bg-white'
          }`}
          onClick={() => setSelectedTier('expert')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{expertTier.shortName}</h4>
              <p className="text-xs text-slate-500">{expertTier.deliveryTime}</p>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-slate-900">£{expertTier.priceGBP}</span>
            <span className="text-sm text-slate-500 ml-1">one-time</span>
          </div>

          <ul className="space-y-2 mb-4">
            {expertTier.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 pt-3 mt-3">
            <p className="text-xs text-slate-400 mb-1">Not included:</p>
            {expertTier.excludes.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs text-slate-400 mr-3">
                <X className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <AnimatePresence>
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => handlePurchase(selectedTier)}
              disabled={isLoading}
              className={`px-8 py-3 rounded-xl font-bold text-white text-sm transition-all ${
                selectedTier === 'premium'
                  ? 'bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up checkout...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Get {selectedTier === 'premium' ? premiumTier.shortName : expertTier.shortName} — £{selectedTier === 'premium' ? premiumTier.priceGBP : expertTier.priceGBP}
                </span>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <p className="text-xs text-slate-400 mt-3">
              Secure payment via Stripe · No subscription · One-time fee
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social proof */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400">
          💡 The average visa refusal costs £2,000+ in reapplication fees and delays.
          <br />A professional review is less than 8% of that cost.
        </p>
      </div>
    </div>
  );
}
