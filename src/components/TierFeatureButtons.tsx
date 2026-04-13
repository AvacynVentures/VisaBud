'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, FileText, Sparkles, ShieldCheck, Users, Phone, ArrowRight, X
} from 'lucide-react';
import type { PurchasedTier } from '@/lib/store';

interface TierFeatureButtonsProps {
  purchasedTier: PurchasedTier;
  onUpgrade: () => void;
  visaType?: string;
}

interface FeatureButton {
  id: string;
  label: string;
  icon: typeof FileText;
  minTier: 'premium' | 'expert';
  color: string;
  lockedColor: string;
  description: string;
}

const FEATURES: FeatureButton[] = [
  {
    id: 'templates',
    label: 'Templates',
    icon: FileText,
    minTier: 'premium',
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: '37+ document preparation templates to help you fill in forms correctly.',
  },
  {
    id: 'ai-confidence',
    label: 'AI Confidence Scoring',
    icon: Sparkles,
    minTier: 'premium',
    color: 'bg-violet-600 hover:bg-violet-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: 'AI analyses your uploaded documents and gives each a confidence score (0-100%).',
  },
  {
    id: 'ai-validation',
    label: 'AI Validation & Tips',
    icon: ShieldCheck,
    minTier: 'premium',
    color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: 'Deep AI review with specific feedback, issues found, and recommended fixes.',
  },
  {
    id: 'expert-review',
    label: 'Expert Human Review',
    icon: Users,
    minTier: 'expert',
    color: 'bg-amber-600 hover:bg-amber-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: 'Qualified immigration expert reviews your documents within 24 hours.',
  },
  {
    id: 'live-call',
    label: 'Schedule Live Call',
    icon: Phone,
    minTier: 'expert',
    color: 'bg-rose-600 hover:bg-rose-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: '30-minute live consulting call with an immigration specialist.',
  },
];

const TIER_RANK: Record<PurchasedTier, number> = {
  none: 0,
  standard: 1,
  premium: 2,
  expert: 3,
};

const TIER_LABELS: Record<string, string> = {
  premium: 'Premium (£149)',
  expert: 'Expert (£299)',
};

function isUnlocked(userTier: PurchasedTier, requiredTier: 'premium' | 'expert'): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}

export default function TierFeatureButtons({ purchasedTier, onUpgrade }: TierFeatureButtonsProps) {
  const [upgradePrompt, setUpgradePrompt] = useState<string | null>(null);

  const handleClick = (feature: FeatureButton) => {
    if (isUnlocked(purchasedTier, feature.minTier)) {
      // Feature is available — handle action
      switch (feature.id) {
        case 'templates':
          window.open('/templates', '_blank');
          break;
        case 'ai-confidence':
        case 'ai-validation':
          // Scroll to first uploaded document or show info
          document.querySelector('[data-doc-upload]')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'expert-review':
          window.location.href = 'mailto:expert@visabud.co.uk?subject=Expert%20Document%20Review%20Request';
          break;
        case 'live-call':
          window.location.href = 'mailto:expert@visabud.co.uk?subject=Schedule%20Live%20Consulting%20Call';
          break;
      }
    } else {
      setUpgradePrompt(feature.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-violet-600" />
        <h3 className="font-semibold text-gray-900">Premium Features</h3>
        {purchasedTier !== 'none' && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            purchasedTier === 'expert' ? 'bg-violet-100 text-violet-700' :
            purchasedTier === 'premium' ? 'bg-emerald-100 text-emerald-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {purchasedTier.charAt(0).toUpperCase() + purchasedTier.slice(1)} Plan
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {FEATURES.map((feature) => {
          const unlocked = isUnlocked(purchasedTier, feature.minTier);
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => handleClick(feature)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 touch-target ${
                unlocked ? feature.color : feature.lockedColor
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{feature.label}</span>
              {!unlocked && <Lock className="w-3.5 h-3.5 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Upgrade prompt overlay */}
      <AnimatePresence>
        {upgradePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  🔒 Upgrade to unlock {FEATURES.find(f => f.id === upgradePrompt)?.label}
                </p>
                <p className="text-xs text-amber-700 mb-3">
                  {FEATURES.find(f => f.id === upgradePrompt)?.description}
                </p>
                <p className="text-xs text-amber-600 mb-3">
                  Available from the{' '}
                  <strong>{TIER_LABELS[FEATURES.find(f => f.id === upgradePrompt)?.minTier || 'premium']}</strong> plan.
                </p>
                <button
                  onClick={() => { setUpgradePrompt(null); onUpgrade(); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-all"
                >
                  See Plans <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => setUpgradePrompt(null)}
                className="p-1 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
