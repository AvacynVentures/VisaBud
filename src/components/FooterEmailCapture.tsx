'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export default function FooterEmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'footer',
          consent: true,
          consent_timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>You&apos;re subscribed! Check your inbox.</span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-slate-300 mb-2">
        📬 Get monthly visa tips — free
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            placeholder="your@email.com"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-0 transition-colors"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
      )}
      <p className="text-xs text-slate-500 mt-1.5">
        No spam. Unsubscribe anytime. GDPR compliant.
      </p>
    </div>
  );
}
