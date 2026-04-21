'use client';

import { useAuth } from '@/lib/auth-context';
import { useApplicationStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * OnboardingGate: Enhanced auth + onboarding completion check
 * - If not authenticated: redirects to /auth/login
 * - If authenticated + onboarding_completed=true: redirects to /dashboard
 * - If authenticated + onboarding_completed=false: shows children (onboarding form)
 * - Shows loading spinner while checking state
 */
export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { onboarding_completed } = useApplicationStore();
  const router = useRouter();
  const [checkingCompletion, setCheckingCompletion] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkOnboardingState = async () => {
      if (authLoading) return; // Wait for auth to load

      if (!user) {
        // Not authenticated → redirect to login
        router.replace('/auth/login');
        return;
      }

      // User is authenticated, check if onboarding is complete
      // Priority: Zustand store, then Supabase DB, then assume incomplete

      if (onboarding_completed) {
        // Already marked complete in store
        setIsComplete(true);
        setCheckingCompletion(false);
        router.replace('/dashboard');
        return;
      }

      // Check Supabase DB for onboarding_completed flag
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('[OnboardingGate] Failed to check DB completion:', error);
          // On error, assume incomplete and show onboarding
          setIsComplete(false);
          setCheckingCompletion(false);
          return;
        }

        if (data?.onboarding_completed) {
          // DB says complete → redirect to dashboard
          setIsComplete(true);
          setCheckingCompletion(false);
          router.replace('/dashboard');
        } else {
          // DB says incomplete → show onboarding
          setIsComplete(false);
          setCheckingCompletion(false);
        }
      } catch (err) {
        console.error('[OnboardingGate] Error checking onboarding:', err);
        // On error, assume incomplete
        setIsComplete(false);
        setCheckingCompletion(false);
      }
    };

    checkOnboardingState();
  }, [user, authLoading, onboarding_completed, router]);

  // Loading state
  if (authLoading || checkingCompletion) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-200" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Not authenticated or checking (will redirect)
  if (!user) {
    return null;
  }

  // User already completed onboarding (will redirect)
  if (isComplete) {
    return null;
  }

  // User authenticated + onboarding incomplete → show onboarding form
  return <>{children}</>;
}
