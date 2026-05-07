'use client';

import { Lock, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApplicationReadinessCardProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function ApplicationReadinessCard({ isPremium, onUpgrade }: ApplicationReadinessCardProps) {
  if (isPremium) {
    return null; // Premium users don't need this teaser
  }

  const checks = [
    { icon: AlertCircle, title: 'Compliance Scan', desc: 'AI checks for common rejection reasons' },
    { icon: CheckCircle2, title: 'Completeness Check', desc: 'Ensures no documents are missing' },
    { icon: Zap, title: 'Risk Analysis', desc: 'Identifies potential issues before submission' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">Application Readiness Check</h3>
            <p className="text-xs text-indigo-700">Premium feature</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Let AI scan your entire application for compliance issues, missing documents, and potential risks before you submit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {checks.map((check, i) => {
            const Icon = check.icon;
            return (
              <div key={i} className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-semibold text-indigo-900">{check.title}</p>
                </div>
                <p className="text-xs text-indigo-700">{check.desc}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all active:scale-95"
        >
          Unlock Premium to Use
        </button>
      </div>
    </motion.div>
  );
}
