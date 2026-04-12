'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApplicationStore } from '@/lib/store';
import { Mail, ArrowRight, Shield, X } from 'lucide-react';

interface EmailCaptureProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function EmailCapture({ onComplete, onSkip }: EmailCaptureProps) {
  const { visaType, nationality, urgency, userEmail } = useApplicationStore();
  const [email, setEmail] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!consentChecked) {
      setError('Please confirm you agree to receive emails');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          visa_type: visaType,
          nationality,
          urgency,
          consent: true,
          consent_timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
            <span className="text-white text-sm font-bold">V</span>
          </div>
          <span className="font-bold text-blue-900 tracking-tight">VisaBud</span>
        </div>
      </nav>

      {/* Progress - Complete */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-5 py-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-emerald-600">✓ Plan ready</span>
            <span className="text-xs text-gray-400">100% complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 w-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
              {/* Success badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl">🎉</span>
              </motion.div>

              <h2 className="text-xl font-bold text-blue-900 text-center mb-1">
                Your visa plan is ready!
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Get it delivered to your inbox — plus monthly tips to strengthen your application.
              </p>

              {/* What you get */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-blue-800 mb-2.5">What you&apos;ll receive:</p>
                <ul className="space-y-1.5">
                  {[
                    'Your personalised visa checklist (PDF)',
                    'Monthly tips specific to your visa type',
                    'Deadline reminders so you never miss a step',
                    'Updates when immigration rules change',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex items-start gap-2 text-xs text-blue-700"
                    >
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Email input */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-sm transition-colors"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* GDPR consent */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => { setConsentChecked(e.target.checked); setError(null); }}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I agree to receive my visa plan and occasional tips by email. 
                    You can unsubscribe at any time with one click. We never share your data.
                  </span>
                </label>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-600 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> {error}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !email}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send me my plan + tips <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Skip */}
                <button
                  onClick={onSkip}
                  disabled={isSubmitting}
                  className="w-full text-center py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  View without email →
                </button>
              </div>

              {/* Trust footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Shield className="w-3 h-3" />
                  GDPR compliant
                </div>
                <div className="text-xs text-gray-300">·</div>
                <div className="text-xs text-gray-400">
                  No credit card needed
                </div>
                <div className="text-xs text-gray-300">·</div>
                <div className="text-xs text-gray-400">
                  Unsubscribe anytime
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
