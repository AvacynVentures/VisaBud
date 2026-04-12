'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // If already authenticated, redirect to wizard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/app/start');
    }
  }, [user, loading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSending(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        // Handle rate limiting
        if (authError.message?.includes('rate') || authError.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError(authError.message || 'Something went wrong. Please try again.');
        }
        setSending(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-200" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Success — magic link sent
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M 100 35 Q 70 50 60 80 Q 55 95 65 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M 100 35 Q 130 50 140 80 Q 145 95 135 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M 85 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d="M 115 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <line x1="88" y1="120" x2="112" y2="120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-bold text-blue-900">VisaBud</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h1>
            <p className="text-slate-600 mb-2">
              We&apos;ve sent a magic link to
            </p>
            <p className="font-semibold text-blue-700 mb-4">{email}</p>
            <p className="text-sm text-slate-500 mb-6">
              Click the link in the email to sign in and start your visa application. The link expires in 1 hour.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Use a different email
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-blue-500 hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Email entry form
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
            <path d="M 100 35 Q 70 50 60 80 Q 55 95 65 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 100 35 Q 130 50 140 80 Q 145 95 135 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 85 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M 115 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <line x1="88" y1="120" x2="112" y2="120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-bold text-blue-900">VisaBud</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Get Started Free</h1>
            <p className="text-slate-600">
              Enter your email to start your personalised UK visa checklist.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } bg-white text-slate-900 placeholder-slate-400 text-sm transition-colors focus:outline-none focus:ring-2`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all ${
                sending
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800 shadow-sm hover:shadow-md'
              }`}
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending link…
                </span>
              ) : (
                'Continue with Email'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-slate-500">
              We&apos;ll send you a magic link — no password needed.
              <br />
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure & encrypted
          </span>
          <span>·</span>
          <span>No spam, ever</span>
          <span>·</span>
          <span>Free to start</span>
        </div>
      </div>
    </div>
  );
}
