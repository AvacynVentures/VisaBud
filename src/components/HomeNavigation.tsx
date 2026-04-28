'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';

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
  const { user, loading } = useAuth();
  const [checkingCompletion, setCheckingCompletion] = useState(true);

  useEffect(() => {
    if (!loading) {
      setCheckingCompletion(false);
    }
  }, [loading]);

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

  // Logged in → Show "My Applications" (hub) as primary CTA
  return (
    <div className="flex items-center gap-3">
      <Link href="/applications" className={baseClasses}>
        My Applications
        {showArrow && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>
    </div>
  );
}
