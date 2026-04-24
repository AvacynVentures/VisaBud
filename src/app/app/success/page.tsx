'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { useApplicationStore } from '@/lib/store';



export default function SuccessPage() {
  return (
    <AuthGate>
      <SuccessContent />
    </AuthGate>
  );
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const store = useApplicationStore();

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
      return;
    }

    // Verify payment and unlock dashboard, then redirect
    async function verifyAndRedirect() {
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await res.json();

        if (data.paid) {
          // Unlock the dashboard content
          store.setUnlocked(true);
          // Redirect immediately to dashboard
          router.push('/dashboard');
        } else {
          // Payment not complete yet, still redirect to dashboard (user can see locked content)
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Session verification error:', err);
        // Even if verification fails, redirect to dashboard
        router.push('/dashboard');
      }
    }

    verifyAndRedirect();
  }, [sessionId, router, store]);

  // Show loading state while verifying and redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Verifying payment…</h2>
        <p className="text-slate-500 text-sm">Redirecting to your dashboard.</p>
      </div>
    </div>
  );
}
