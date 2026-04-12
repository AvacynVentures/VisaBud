'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, FileText, Mail, BookOpen, Loader2, Shield, Zap, Users, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  visaType: string;
}

const BENEFITS = [
  {
    icon: FileText,
    title: 'Your Complete Document Checklist',
    desc: 'Every document you need — personalised, prioritised, nothing missed',
  },
  {
    icon: Zap,
    title: 'AI Document Verification',
    desc: 'Upload docs and our AI checks them before you submit',
  },
  {
    icon: Mail,
    title: 'Direct Email Support',
    desc: 'Questions? Get guidance from our team within 24 hours',
  },
  {
    icon: BookOpen,
    title: 'Step-by-Step Submission Guide',
    desc: 'Know exactly what to do next — in the right order',
  },
];

export default function PaywallModal({ isOpen, onClose, visaType }: PaywallModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleCheckout(tier: 'standard' | 'premium' | 'expert' = 'premium') {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setError('Please sign in to continue.');
        setIsLoading(false);
        return;
      }

      // Call checkout with auth token in header
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        setError('Could not create checkout session. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Network error. Check your connection and try again.');
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
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

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
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
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-8 pt-8 pb-6 text-center relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-blue-100 text-xs font-medium mb-4">
              <Clock className="w-3.5 h-3.5" />
              Early access pricing — locked in
            </div>
            <h2 id="paywall-title" className="text-2xl font-bold text-white mb-1">
              Stop guessing. Know exactly what to do.
            </h2>
            <p className="text-blue-200 text-sm">
              Your complete {visaType} guide — personalised to you
            </p>
            <div className="mt-5 relative">
              <span className="text-5xl font-extrabold text-white">£50</span>
              <span className="text-blue-200 text-sm ml-1">.00</span>
              <p className="text-blue-300 text-xs mt-1">One-time · No subscription · Instant access</p>
            </div>
          </motion.div>
        </div>

        {/* Social Proof Bar */}
        <div className="bg-blue-50 px-8 py-2.5 flex items-center justify-center gap-2 border-b border-blue-100">
          <Users className="w-3.5 h-3.5 text-blue-500" />
          <p className="text-xs font-medium text-blue-700">1,000+ applicants have unlocked their plans</p>
        </div>

        {/* Benefits */}
        <div className="px-8 py-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            What you get
          </h3>
          <ul className="space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.25 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <b.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Error or Sign In Needed */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-8 mb-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
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

        {/* Actions */}
        <div className="px-8 pb-6 space-y-3">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 btn-hover animate-emeraldGlow"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to Stripe…
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Get Access Now — £50 Locked In
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Continue with free preview
          </button>

          {/* Trust footer */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Money-back guarantee if not satisfied</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Secure payment via Stripe · 
              <a href="/privacy" className="hover:underline">Privacy policy</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
