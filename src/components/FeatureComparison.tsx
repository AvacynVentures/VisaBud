'use client';

import { CheckCircle, X } from 'lucide-react';

const FEATURES = [
  { name: 'Personalised document checklist', standard: true, premium: true, expert: true },
  { name: 'Submission timeline', standard: true, premium: true, expert: true },
  { name: 'Risk assessment & alerts', standard: true, premium: true, expert: true },
  { name: 'PDF export', standard: true, premium: true, expert: true },
  { name: 'AI document verification', standard: false, premium: true, expert: true },
  { name: 'Preparation templates (37+)', standard: false, premium: true, expert: true },
  { name: 'Email support (24h response)', standard: false, premium: true, expert: true },
  { name: 'Expert immigration review', standard: false, premium: false, expert: true },
  { name: 'Priority support & follow-up', standard: false, premium: false, expert: true },
  { name: '24-hour turnaround', standard: false, premium: false, expert: true },
];

function Cell({ included }: { included: boolean }) {
  return included ? (
    <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
  ) : (
    <X className="w-4 h-4 text-gray-300 mx-auto" />
  );
}

export default function FeatureComparison() {
  return (
    <div className="mt-2 mb-4 overflow-x-auto">
      <p className="text-center text-sm font-semibold text-gray-700 mb-3">Compare Plans</p>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-gray-500 font-medium">Feature</th>
            <th className="text-center py-2 px-2 text-blue-700 font-semibold">Standard<br /><span className="font-normal text-gray-400">£50</span></th>
            <th className="text-center py-2 px-2 text-emerald-700 font-semibold">Premium<br /><span className="font-normal text-gray-400">£149</span></th>
            <th className="text-center py-2 px-2 text-violet-700 font-semibold">Expert<br /><span className="font-normal text-gray-400">£299</span></th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((f, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
              <td className="py-2 px-3 text-gray-700">{f.name}</td>
              <td className="py-2 px-2"><Cell included={f.standard} /></td>
              <td className="py-2 px-2"><Cell included={f.premium} /></td>
              <td className="py-2 px-2"><Cell included={f.expert} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
