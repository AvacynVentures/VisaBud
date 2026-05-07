'use client';

import { Sparkles, ChevronRight, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumUpgradeBannerProps {
  currentTier: 'none' | 'standard' | 'premium';
  onUpgrade: () => void;
}

export default function PremiumUpgradeBanner({ currentTier, onUpgrade }: PremiumUpgradeBannerProps) {
  // Show banner for Free and Standard users
  if (currentTier === 'premium') {
    return null;
  }

  const isStandard = currentTier === 'standard';

  const premiumFeatures = [
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
      className={`rounded-2xl p-5 sm:p-6 mb-6 border-2 ${
        isStandard
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-300'
          : 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300'
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${
              isStandard ? 'text-indigo-900' : 'text-emerald-900'
            }`}>
              <Sparkles className="w-5 h-5" />
              {isStandard ? 'Ready for AI-Powered Insights?' : 'Unlock Premium Features'}
            </h3>
            <p className={`text-sm ${
              isStandard ? 'text-indigo-700' : 'text-emerald-700'
            }`}>
              {isStandard
                ? 'Upgrade to Premium to unlock AI-powered analysis & insights'
                : 'Get AI guidance, document verification, and application readiness checks'
              }
            </p>
          </div>
          <button
            onClick={onUpgrade}
            className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all hover:shadow-lg active:scale-95 flex-shrink-0 ${
              isStandard
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            Upgrade to Premium
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {premiumFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`flex gap-3 p-3 rounded-lg ${
                  isStandard ? 'bg-white/70' : 'bg-white/80'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  isStandard ? 'text-indigo-600' : 'text-emerald-600'
                }`}>
                  <Icon className="w-4 h-4 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold mb-0.5 ${
                    isStandard ? 'text-indigo-900' : 'text-emerald-900'
                  }`}>
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing */}
        <div className={`flex items-center justify-between pt-2 border-t ${
          isStandard ? 'border-indigo-200' : 'border-emerald-200'
        }`}>
          <p className={`text-xs font-medium ${
            isStandard ? 'text-indigo-700' : 'text-emerald-700'
          }`}>
            {isStandard
              ? 'Currently on: Standard Plan (£9.99)'
              : 'Start with: Standard Plan (£9.99)'
            }
          </p>
          <p className={`text-sm font-bold ${
            isStandard ? 'text-indigo-900' : 'text-emerald-900'
          }`}>
            Premium: £79.99
          </p>
        </div>
      </div>
    </motion.div>
  );
}
