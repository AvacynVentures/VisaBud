'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useApplicationStore } from '@/lib/store';
import type { PremiumTier } from '@/lib/store';

export default function ReviewSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setPremiumTier, setPremiumReviewStatus } = useApplicationStore();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const tier = searchParams.get('tier') as PremiumTier | null;

    if (!sessionId) {
      setError('Missing session ID');
      setVerifying(false);
      return;
    }

    // Verify session with Stripe
    async function verify() {
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await res.json();

        if (data.paid) {
          // Update store
          setPremiumTier(tier || 'ai_review_149');
          setPremiumReviewStatus('pending');
          setVerifying(false);
        } else {
          setError('Payment not confirmed yet. Please wait a moment and refresh.');
          setVerifying(false);
        }
      } catch (err) {
        setError('Could not verify payment. Please contact support.');
        setVerifying(false);
      }
    }

    verify();
  }, [searchParams, setPremiumTier, setPremiumReviewStatus]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Verifying your payment...</h2>
          <p className="text-slate-500 mt-2">This will only take a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Issue</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary px-6 py-3"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-white">
      <div className="text-center max-w-lg px-4">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-violet-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Premium Review Purchased! 🎉
        </h1>

        <p className="text-slate-600 mb-6">
          Your documents are now queued for professional review. Upload your documents on the dashboard and our AI will provide detailed feedback with risk scoring.
        </p>

        <div className="bg-white rounded-2xl border border-violet-100 p-5 mb-6 text-left">
          <h3 className="font-bold text-slate-900 mb-3">What happens next:</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <span className="text-sm text-slate-700">Upload your documents on the dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span className="text-sm text-slate-700">Our AI reviews each document against UKVI requirements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
              <span className="text-sm text-slate-700">Get risk scores, specific feedback, and fix recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
              <span className="text-sm text-slate-700">Cross-document consistency check runs automatically</span>
            </li>
          </ol>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-slate-400 mt-4">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  );
}
