'use client';

import { CheckCircle } from 'lucide-react';

const FEATURES = [
  'Personalised document checklist',
  'Document uploads & downloads',
  'Submission timeline',
  'Risk assessment & alerts',
  'PDF export',
  'AI confidence scoring on every document',
  'AI validation & tips',
  'Preparation templates (37+)',
  'Email support',
];

function CheckCell() {
  return <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />;
}

export default function FeatureComparison() {
  return (
    <div className="mt-2 mb-4 overflow-x-auto">
      <p className="text-center text-sm font-semibold text-gray-700 mb-3">What&apos;s Included</p>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-gray-500 font-medium">Feature</th>
            <th className="text-center py-2 px-2 text-emerald-700 font-semibold">Full Access<br /><span className="font-normal text-gray-400">£9.99</span></th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((f, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
              <td className="py-2 px-3 text-gray-700">{f}</td>
              <td className="py-2 px-2"><CheckCell /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
