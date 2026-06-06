'use client';

import { Sparkles, ChevronRight, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumUpgradeBannerProps {
  currentTier: 'none' | 'unlocked';
  onUpgrade: () => void;
}

export default function PremiumUpgradeBanner({ currentTier, onUpgrade }: PremiumUpgradeBannerProps) {
  // Don't show banner if already unlocked
  if (currentTier === 'unlocked') {
    return null;
  }

  const unlockFeatures = [
    {
      icon: Sparkles,
      title: 'AI Risk Scoring',
      description: 'Automatic risk level assessment for each document'
    },
    {
      icon: Zap,
      title: 'Document Verification',
      description: 'AI analyzes documents for compliance & completeness'
    },
    {
      icon: CheckCircle,
      title: 'Application Readiness',
      description: 'Comprehensive scan of your entire visa application'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 sm:p-6 mb-6 border-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-emerald-900">
              <Sparkles className="w-5 h-5" />
              Unlock Full Access — £9.99
            </h3>
            <p className="text-sm text-emerald-700">
              Get AI document verification, all 30+ checklist items, and 37 templates
            </p>
          </div>
          <button
            onClick={onUpgrade}
            className="px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all hover:shadow-lg active:scale-95 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Unlock — £9.99
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {unlockFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/80">
                <div className="flex-shrink-0 text-emerald-600">
                  <Icon className="w-4 h-4 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-0.5 text-emerald-900">{feature.title}</p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
          <p className="text-xs font-medium text-emerald-700">One-time payment per application</p>
          <p className="text-sm font-bold text-emerald-900">£9.99 · 7-day money-back guarantee</p>
        </div>
      </div>
    </motion.div>
  );
}
