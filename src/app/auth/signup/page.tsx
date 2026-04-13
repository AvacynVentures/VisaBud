'use client';

import { useState, FormEvent, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function SignUpPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');
    if (errorParam) {
      setError(errorDesc || 'Sign up failed. Please try again.');
    }
  }, [searchParams]);

  // If already authenticated, redirect to visa selection wizard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/app/start');
    }
  }, [user, loading, router]);

  async function handleOAuthSignIn(provider: 'google') {
    setError(null);
    setOauthLoading(provider);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error(`OAuth ${provider} error:`, authError);
        setError(authError.message || `Failed to sign up with ${provider}. Please try again.`);
        setOauthLoading(null);
      }
    } catch (err) {
      console.error(`OAuth ${provider} exception:`, err);
      setError('Network error. Please check your connection and try again.');
      setOauthLoading(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please use a valid email address (e.g., yourname@gmail.com)');
      return;
    }

    // Check for rate-limit cooldown
    const cooldownUntil = localStorage.getItem('signup_cooldown_until');
    if (cooldownUntil && Date.now() < parseInt(cooldownUntil, 10)) {
      const remaining = Math.ceil((parseInt(cooldownUntil, 10) - Date.now()) / 60000);
      setError(`Too many signup attempts. Please wait ${remaining} minute${remaining > 1 ? 's' : ''} and try again.`);
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

      localStorage.setItem('signup_last_attempt', Date.now().toString());

      if (authError) {
        if (authError.message?.includes('rate') || authError.status === 429 || (authError as any).status === 429) {
          // Set 5-minute cooldown
          localStorage.setItem('signup_cooldown_until', (Date.now() + 5 * 60 * 1000).toString());
          setError('Too many signup attempts. Please wait 5 minutes and try again.');
        } else if (authError.message?.includes('invalid') || authError.message?.includes('not allowed')) {
          setError('Please use a valid email address (e.g., yourname@gmail.com)');
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
          <div className="flex items-center justify-center gap-2 mb-10">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 35 Q 70 50 60 80 Q 55 95 65 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M 100 35 Q 130 50 140 80 Q 145 95 135 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M 85 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M 115 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <line x1="88" y1="120" x2="112" y2="120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xl font-bold text-blue-900">VisaBud</span>
            </Link>
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
              Click the link in the email to create your account and access your free visa checklist. The link expires in 1 hour.
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
            <button onClick={() => setSubmitted(false)} className="text-blue-500 hover:underline">try again</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M 100 35 Q 70 50 60 80 Q 55 95 65 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M 100 35 Q 130 50 140 80 Q 145 95 135 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M 85 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d="M 115 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <line x1="88" y1="120" x2="112" y2="120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-bold text-blue-900">VisaBud</span>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-900">247</p>
              <p className="text-xs text-blue-600">couples this month</p>
            </div>
            <div className="w-px h-8 bg-blue-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-blue-900">94%</p>
              <p className="text-xs text-blue-600">success rate</p>
            </div>
          </div>
          <p className="text-center text-xs text-blue-700 mt-2 italic">
            &ldquo;Caught 3 missing docs before I submitted&rdquo; — Sarah, Essex
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Your VisaBud Account</h1>
            <p className="text-slate-600">
              Get instant access to your personalised visa checklist
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignIn('google')}
              disabled={oauthLoading !== null}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-gray-200 bg-white font-medium text-slate-700 transition-all ${
                oauthLoading === 'google'
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {oauthLoading === 'google' ? (
                <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 uppercase tracking-wider">or</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } bg-white text-slate-900 placeholder-slate-400 text-sm transition-colors focus:outline-none focus:ring-2`}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}

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
                  Creating account…
                </span>
              ) : (
                'Continue with Email'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign in here
              </Link>
            </p>
            <p className="text-center text-xs text-slate-400 mt-3">
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

        {/* What you get */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 text-center">What you get for free</h3>
          <div className="space-y-3">
            {[
              { icon: '📋', text: 'Personalised document checklist preview' },
              { icon: '📅', text: 'Timeline with first 3 milestones' },
              { icon: '⚠️', text: 'Basic risk assessment summary' },
              { icon: '📊', text: 'Processing time & fee estimates' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-200" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  );
}
