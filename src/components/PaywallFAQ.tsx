'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const FAQ_ITEMS = [
  {
    q: 'Why should I upgrade to Premium?',
    a: 'The Premium tier includes AI-powered document verification that catches mistakes, formatting issues, and missing information before you submit to UKVI. It\'s like having a second pair of expert eyes on your application — and it could save you from a costly refusal.',
  },
  {
    q: 'What if I\'m not happy with my purchase?',
    a: 'We offer a 7-day money-back guarantee, no questions asked. If you\'re not satisfied for any reason, email support@visabud.co.uk within 7 days and we\'ll refund you in full.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Absolutely. You can start with Standard now and upgrade to Premium or Expert at any time. You\'ll only pay the difference between what you\'ve already paid and the new tier.',
  },
  {
    q: 'Do I get email support?',
    a: 'Yes — Premium and Expert tiers include email support with a 24-hour response time. Standard tier users can reach us at support@visabud.co.uk for general enquiries.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. VisaBud is a guidance tool built on official UKVI requirements. We help you prepare your documents correctly, but we\'re not a law firm. For complex cases, we recommend consulting a registered immigration solicitor.',
  },
];

export default function PaywallFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(idx: number) {
    const newIdx = openIndex === idx ? null : idx;
    setOpenIndex(newIdx);
    if (newIdx !== null) {
      analytics.faqToggled(FAQ_ITEMS[idx].q);
    }
  }

  return (
    <div className="mt-2 mb-4">
      <p className="text-center text-sm font-semibold text-gray-700 mb-3">Frequently Asked Questions</p>
      <div className="space-y-1">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-3 text-xs text-gray-600 leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
