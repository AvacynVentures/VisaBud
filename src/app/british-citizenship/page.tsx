import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'British Citizenship Application Checklist - VisaBud',
  description: 'Complete citizenship checklist with residency requirements, Life in UK test, and all required documents for naturalisation.',
  keywords: 'British citizenship, naturalisation UK, citizenship application checklist, Life in UK test',
  openGraph: {
    title: 'British Citizenship Application Checklist - VisaBud',
    description: 'Step-by-step guide to British citizenship with residency rules, good character requirements, and all documents.',
  },
};

export default function BritishCitizenshipPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">British Citizenship Checklist</h1>
        <p className="text-xl text-slate-600 mb-8">
          Complete guide to British citizenship and naturalisation, including residency requirements, the Life in UK test, and all required evidence.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Citizenship Overview</h2>
          <ul className="space-y-3 text-slate-700">
            <li><strong>Standard route:</strong> 5 years physical presence in UK + 1 year ILR</li>
            <li><strong>Married to British citizen:</strong> 3 years physical presence + 1 year ILR</li>
            <li><strong>Fee:</strong> £1,839 (including ceremony)</li>
            <li><strong>English requirement:</strong> B1 level</li>
            <li><strong>Good character requirement:</strong> No serious criminal history, tax compliance, honest disclosure</li>
            <li><strong>Processing time:</strong> 6 months (can take longer)</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Key Eligibility Rules</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded bg-slate-50">
              <h3 className="font-bold mb-2">Physical Presence</h3>
              <p className="text-slate-700">Must have been physically present in the UK for:</p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>• 5 years (standard route) OR</li>
                <li>• 3 years (if married to British citizen or settled person)</li>
                <li>Absences must not exceed 90 days per year, or 180 days in the 5-year period</li>
              </ul>
            </div>
            
            <div className="border p-4 rounded bg-slate-50">
              <h3 className="font-bold mb-2">ILR Requirement</h3>
              <p className="text-slate-700">You must have held ILR (Indefinite Leave to Remain) for at least 12 months before applying.</p>
            </div>
            
            <div className="border p-4 rounded bg-slate-50">
              <h3 className="font-bold mb-2">Good Character</h3>
              <p className="text-slate-700">You must demonstrate good character, including:</p>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>• No criminal convictions (even spent ones count)</li>
                <li>• No undisclosed immigration offences</li>
                <li>• Tax compliance</li>
                <li>• Honesty throughout the application</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-3">Personal Documents</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>✓ Passport (original or copy)</li>
                <li>✓ Birth certificate (translated if non-English)</li>
                <li>✓ Marriage certificate (if applicable)</li>
                <li>✓ Name change deed poll (if applicable)</li>
              </ul>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-3">Residence & Status</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>✓ BRP/ILR evidence</li>
                <li>✓ Address history (5 years)</li>
                <li>✓ Council Tax bills or tenancy agreements</li>
                <li>✓ Travel records / passport stamps</li>
              </ul>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-3">Character & Compliance</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>✓ Tax records / P60s (5 years)</li>
                <li>✓ Criminal record declaration (form)</li>
                <li>✓ Police clearance (if applicable)</li>
              </ul>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-3">References & Tests</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>✓ Two referees (1 professional, 1 British)</li>
                <li>✓ Life in UK test pass certificate</li>
                <li>✓ English language certificate (B1)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">⚠️ Common Pitfalls</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start">
              <span className="text-red-600 mr-3">❌</span>
              <span><strong>Address gaps:</strong> Unexplained gaps in address history raise refusal risk. Account for every period.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-3">❌</span>
              <span><strong>Spent convictions:</strong> Must be declared even if "spent". Non-disclosure = deception refusal + 10-year ban.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-3">❌</span>
              <span><strong>Travel history:</strong> Excessive absences ({`>`}90 days/year) can make you ineligible or require extension of qualifying period.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-3">❌</span>
              <span><strong>Referee issues:</strong> Referees must know you 3+ years. Professional referee doesn't need to be British. Second must be.</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded border-l-4 border-green-600 mb-8">
          <h2 className="text-lg font-bold mb-3">After Approval: The Ceremony</h2>
          <p className="text-slate-700 mb-3">Once approved, you must attend a citizenship ceremony within 3 months. You will:</p>
          <ul className="space-y-1 text-slate-700">
            <li>• Take an oath or affirmation of allegiance</li>
            <li>• Receive your certificate of naturalisation</li>
            <li>• Become a British citizen (legally effective on ceremony date)</li>
          </ul>
          <p className="text-sm text-slate-600 mt-3">Cost is included in the £1,839 application fee.</p>
        </div>

        <div className="text-center">
          <Link href="/auth/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700">
            Get Your Citizenship Checklist
          </Link>
          <p className="text-sm text-slate-600 mt-4">Free preview · AI verification from £149 · Expert review from £299</p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-slate-600">
            ℹ️ This is guidance only. Always verify with <a href="https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain" className="text-blue-600 hover:underline">gov.uk official citizenship guidance</a> before submitting your application.
          </p>
        </div>
      </div>
    </div>
  );
}
