'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const FAQ_ITEMS = [
  {
    q: 'What do I get when I unlock?',
    a: 'You get everything: all 30+ checklist items unlocked, AI document verification on every item, risk scoring & confidence scores, 37 downloadable document preparation templates, PDF export, and full timeline tracking.',
  },
  {
    q: 'What if I\'m not happy with my purchase?',
    a: 'We offer a 7-day money-back guarantee, no questions asked. If you\'re not satisfied for any reason, email tim.bot@silvergriffindsc.com within 7 days and we\'ll refund you in full.',
  },
  {
    q: 'Is this per application or per account?',
    a: 'It\'s per application. Each UK visa application you create is £9.99 to unlock. If you start a new application (e.g. a different visa type), that\'s a separate unlock. This keeps costs low for most applicants.',
  },
  {
    q: 'Do I get support?',
    a: 'Yes. All unlocked users can reach us at tim.bot@silvergriffindsc.com for help with their application pack.',
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
