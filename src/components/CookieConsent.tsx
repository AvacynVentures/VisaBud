'use client';

import { useState, useEffect } from 'react';
import { getConsentStatus, setAnalyticsConsent, initGA } from '@/lib/analytics';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === null) {
      // Not yet decided — show banner
      setVisible(true);
    } else if (status === 'accepted') {
      // Already accepted — init GA silently
      initGA();
    }
  }, []);

  function handleAccept() {
    setAnalyticsConsent(true);
    setVisible(false);
  }

  function handleDecline() {
    setAnalyticsConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-5 pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold">🍪 We use cookies</span> to understand how visitors use VisaBud so we can improve your experience.{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
