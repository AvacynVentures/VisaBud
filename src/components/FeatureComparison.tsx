'use client';

import { CheckCircle, X } from 'lucide-react';

const FEATURES = [
  { name: 'Personalised document checklist', standard: true, premium: true },
  { name: 'Document uploads & downloads', standard: true, premium: true },
  { name: 'Submission timeline', standard: true, premium: true },
  { name: 'Risk assessment & alerts', standard: true, premium: true },
  { name: 'PDF export', standard: true, premium: true },
  { name: 'AI confidence scoring', standard: false, premium: true },
  { name: 'AI validation & tips', standard: false, premium: true },
  { name: 'Preparation templates (37+)', standard: false, premium: true },
  { name: 'Priority email support', standard: false, premium: true },
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
            <th className="text-center py-2 px-2 text-blue-700 font-semibold">Standard<br /><span className="font-normal text-gray-400">£9.99</span></th>
            <th className="text-center py-2 px-2 text-emerald-700 font-semibold">Premium<br /><span className="font-normal text-gray-400">£79.99</span></th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((f, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
              <td className="py-2 px-3 text-gray-700">{f.name}</td>
              <td className="py-2 px-2"><Cell included={f.standard} /></td>
              <td className="py-2 px-2"><Cell included={f.premium} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
