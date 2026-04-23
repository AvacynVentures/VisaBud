'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HomeNavigationProps {
  variant?: 'nav' | 'hero';
}

/**
 * Smart navigation button for home page
 * - If not logged in: "Start Free" → /auth/signup
 * - If logged in + onboarding complete: "Go to Dashboard" → /dashboard
 * - If logged in + onboarding incomplete: "Continue Wizard" → /app/start
 * 
 * @param variant - 'nav' for navbar (small), 'hero' for hero section (large)
 */
export default function HomeNavigation({ variant = 'hero' }: HomeNavigationProps) {
  const { user, session, loading } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [checkingCompletion, setCheckingCompletion] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user || !session?.access_token) {
      // Not logged in
      setIsComplete(false);
      setCheckingCompletion(false);
      return;
    }

    // Check Supabase DB using singleton client (Fix #1: Consolidate Supabase initialization)
    (async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        setIsComplete(data?.onboarding_completed || false);
      } catch (err) {
        console.warn('[HomeNavigation] Failed to check completion:', err);
        setIsComplete(false);
      } finally {
        setCheckingCompletion(false);
      }
    })();
  }, [user, session, loading]);

  if (loading || checkingCompletion) {
    return (
      <button disabled className="btn-primary text-sm py-2 px-4 opacity-50 cursor-wait">
        Loading...
      </button>
    );
  }

  const baseClasses = variant === 'nav' 
    ? "btn-primary text-sm py-2 px-4"
    : "btn-primary flex items-center justify-center gap-2 text-base py-3.5 px-7 shadow-lg shadow-blue-200/50";

  const showArrow = variant === 'hero';

  // Not logged in → Start Free
  if (!user) {
    return (
      <Link href="/auth/signup" className={baseClasses}>
        Start Free
        {showArrow && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>
    );
  }

  // Logged in + onboarding complete → Welcome back, go to Dashboard
  if (isComplete) {
    return (
      <Link href="/dashboard" className={baseClasses}>
        Welcome Back, Go to Dashboard
        {showArrow && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>
    );
  }

  // Logged in + onboarding incomplete → Continue Wizard
  return (
    <Link href="/app/start" className={baseClasses}>
      Continue Wizard
      {showArrow && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}
