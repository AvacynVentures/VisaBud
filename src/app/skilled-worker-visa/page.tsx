import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UK Skilled Worker Visa Checklist - VisaBud',
  description: 'Complete skilled worker visa checklist with all required documents, CoS verification, and gov.uk requirements.',
  keywords: 'skilled worker visa UK, work visa checklist, UK employment visa, CoS certificate of sponsorship',
  openGraph: {
    title: 'UK Skilled Worker Visa Checklist - VisaBud',
    description: 'Complete skilled worker visa checklist with CoS, salary requirements, and all necessary documents.',
  },
};

export default function SkilledWorkerVisaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">UK Skilled Worker Visa Checklist</h1>
        <p className="text-xl text-slate-600 mb-8">
          Everything you need for a successful skilled worker visa application, including Certificate of Sponsorship requirements and salary verification.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Skilled Worker Visa Overview</h2>
          <ul className="space-y-3 text-slate-700">
            <li><strong>Duration:</strong> Up to 6 years (depending on salary & age)</li>
            <li><strong>Fee:</strong> £719 (plus £284 IHS per year)</li>
            <li><strong>English requirement:</strong> B1 level (reading, writing, speaking, listening)</li>
            <li><strong>Salary requirement:</strong> £29,600 or role-specific minimum (whichever is higher)</li>
            <li><strong>Processing time:</strong> 3 weeks (priority: 5 days)</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Essential Documents</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold">Certificate of Sponsorship (CoS)</h3>
              <p className="text-sm text-slate-700">Reference number from your employer's Sponsor Management System. Valid for 3 months from assignment.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold">Employment Contract</h3>
              <p className="text-sm text-slate-700">Signed offer letter or contract showing salary, role, start date, and job description matching the CoS.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold">Qualifications & ATAS (if applicable)</h3>
              <p className="text-sm text-slate-700">Degrees, professional certifications, and ATAS certificate for PhD-level research roles in sensitive fields.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold">Criminal Record Certificate (if required)</h3>
              <p className="text-sm text-slate-700">Required for roles working with children or vulnerable adults. Must be from every country lived in 12+ months.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Critical Checks</h2>
          <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
            <ul className="space-y-2 text-slate-700">
              <li><strong>Name match:</strong> Passport name MUST exactly match CoS name. Even small differences cause refusal.</li>
              <li><strong>Salary:</strong> Contract salary must match or exceed CoS salary (and minimum threshold).</li>
              <li><strong>CoS validity:</strong> Only valid 3 months from assignment. Apply within 2 weeks of assignment.</li>
              <li><strong>Employer licence:</strong> Your employer's sponsor licence must be active. Check the public register.</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Document Checklist</h2>
          <div className="space-y-2 text-slate-700">
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Valid passport (6+ months validity)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Certificate of Sponsorship (CoS reference)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Signed employment contract</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> English language certificate (B1)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Academic qualifications (degrees, certs)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Criminal record certificate (if required)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> ATAS certificate (if PhD/research role)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Previous visa history / immigration records</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" /> Biometric enrolment appointment</label>
          </div>
        </div>

        <div className="text-center">
          <Link href="/auth/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700">
            Get Your Skilled Worker Checklist
          </Link>
          <p className="text-sm text-slate-600 mt-4">Free preview · AI verification from £149 · Expert review from £299</p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-slate-600">
            ℹ️ This is guidance only. Always verify with <a href="https://www.gov.uk/skilled-worker-visa" className="text-blue-600 hover:underline">gov.uk official guidance</a> before submitting your application.
          </p>
        </div>
      </div>
    </div>
  );
}
