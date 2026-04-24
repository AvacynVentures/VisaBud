import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UK Spouse Visa Checklist - VisaBud',
  description: 'Complete spouse visa checklist with all required documents, timelines, and gov.uk guidance. Get approved first time.',
  keywords: 'spouse visa UK, partner visa checklist, spouse visa documents, UK marriage visa',
  openGraph: {
    title: 'UK Spouse Visa Checklist - VisaBud',
    description: 'Complete spouse visa checklist with all required documents, timelines, and gov.uk guidance.',
  },
};

export default function SpouseVisaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">UK Spouse Visa Checklist</h1>
        <p className="text-xl text-slate-600 mb-8">
          Complete guide to the UK spouse/partner visa with all required documents, timelines, and Home Office requirements.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Spouse Visa Overview</h2>
          <ul className="space-y-3 text-slate-700">
            <li><strong>Duration:</strong> 2 years 9 months initial grant</li>
            <li><strong>Fee:</strong> £1,407 (inside UK) or £2,064 (outside UK)</li>
            <li><strong>English requirement:</strong> A1 level (speaking & listening)</li>
            <li><strong>Income requirement:</strong> £29,000+ or sponsor's income from 10+ years</li>
            <li><strong>Processing time:</strong> 4-8 weeks</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">What You'll Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Your Documents</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>✓ Valid passport</li>
                <li>✓ Marriage certificate</li>
                <li>✓ English language certificate (A1)</li>
                <li>✓ TB test certificate</li>
                <li>✓ Relationship photographs</li>
                <li>✓ Communication history (emails/messages)</li>
              </ul>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-bold mb-2">Sponsor's Documents</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>✓ Passport (proof of right to stay)</li>
                <li>✓ 6 months payslips or evidence of income</li>
                <li>✓ Bank statements (6 months)</li>
                <li>✓ Employer letter</li>
                <li>✓ Proof of accommodation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Key Points</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-3">✓</span>
              <span><strong>Cohabitation proof:</strong> 4 years of living together (or equivalent evidence)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3">✓</span>
              <span><strong>No N/A items:</strong> All documents must be submitted unless circumstances genuinely don't apply</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3">✓</span>
              <span><strong>Biometrics:</strong> Book AFTER submitting online application (cannot be done before)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3">✓</span>
              <span><strong>Extension at 2.5 years:</strong> English requirement increases to A2</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 p-6 rounded mb-8">
          <h2 className="text-2xl font-bold mb-4">Common Reasons for Refusal</h2>
          <ul className="space-y-2 text-slate-700">
            <li>❌ Insufficient English language evidence</li>
            <li>❌ Insufficient evidence of genuine relationship</li>
            <li>❌ Failing to meet income requirement</li>
            <li>❌ Not submitting all required documents</li>
            <li>❌ Undisclosed previous visa refusal (automatic grounds)</li>
          </ul>
        </div>

        <div className="text-center">
          <Link href="/auth/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700">
            Get Your Spouse Visa Checklist
          </Link>
          <p className="text-sm text-slate-600 mt-4">Free preview · Standard £9.99 · AI Premium £79.99</p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-slate-600">
            ℹ️ This is guidance only. Always verify with <a href="https://www.gov.uk/uk-family-visa" className="text-blue-600 hover:underline">gov.uk official guidance</a> before submitting your application.
          </p>
        </div>
      </div>
    </div>
  );
}
