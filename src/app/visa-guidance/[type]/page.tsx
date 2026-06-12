'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getVisaDetails, VisaType } from '@/lib/visa-guidance-data';
import TopNav from '@/components/TopNav';
import { ArrowRight, Check, ChevronDown, AlertCircle } from 'lucide-react';

export default function VisaGuidancePage() {
  const params = useParams();
  const visaType = (params.type as string) || '';
  const visa = getVisaDetails(visaType as VisaType);
  const [expandedTimeline, setExpandedTimeline] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});

  if (!visa) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <TopNav />
        <div className="container-max py-24 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Visa type not found</h1>
          <p className="text-slate-600 mb-6">We couldn't find that visa type. Please select from our available options.</p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const getCostWarning = () => {
    if (visaType === 'spouse') {
      return 'A spouse visa application costs £1,673 in fees and healthcare surcharge. Refusals mean reapplying and paying those fees again.';
    } else if (visaType === 'skilled_worker') {
      return 'A skilled worker visa costs £719 in visa fees plus £284/year healthcare surcharge. Refusals mean reapplying and paying those fees again.';
    } else if (visaType === 'student') {
      return 'A student visa costs £719 in visa fees plus £1,035/year healthcare surcharge. Refusals mean reapplying and paying those fees again.';
    } else if (visaType === 'citizenship') {
      return 'UK citizenship applications cost £1,335 in application fees. Refusals mean reapplying and paying those fees again.';
    }
    return '';
  };

  const toggleDoc = (catName: string) => {
    setExpandedDocs(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* HERO - COMPACT */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-6 md:py-8">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight text-slate-900">
                Avoid Costly Visa Mistakes
              </h1>
              <p className="text-sm md:text-base text-slate-700 mb-3">
                Upload a document and see exactly what VisaBud finds. Instant feedback in minutes.
              </p>
              <Link
                href={`/demo-upload?visa=${visaType}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all text-sm"
              >
                Try a Free Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* COMPACT FLOW DIAGRAM */}
            <div className="hidden md:flex flex-col items-center justify-start gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl">📄</div>
              <p className="text-slate-900 font-semibold text-xs">Upload</p>
              <p className="text-slate-600 text-xs">↓</p>
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl">🤖</div>
              <p className="text-slate-900 font-semibold text-xs">AI check</p>
              <p className="text-slate-600 text-xs">↓</p>
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl">📊</div>
              <p className="text-slate-900 font-semibold text-xs">Score</p>
              <p className="text-slate-600 text-xs">↓</p>
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl">✅</div>
              <p className="text-slate-900 font-semibold text-xs">Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - MOVED HIGHER (RIGHT AFTER HERO) */}
      <section className="container-max py-6 space-y-3 border-b border-slate-200 pb-6">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">🟢 Try a Free Demo</h2>
          <p className="text-slate-700 mb-4 text-sm">Upload any document: payslip, passport, bank statement, or marriage certificate. See exactly what VisaBud finds. No account. No credit card. 60 seconds.</p>
          <Link
            href={`/demo-upload?visa=${visaType}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all"
          >
            Try Free Demo
          </Link>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">📋 Skip Demo, Go Straight to Checklist</h2>
          <p className="text-slate-700 mb-4 text-sm">Start uploading your documents now. Your checklist is free. AI checks and templates unlock when you're ready.</p>
          <Link
            href={`/dashboard?visa=${visaType}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 transition-all"
          >
            Start My Document Checklist
          </Link>
        </div>
      </section>

      {/* TRUST STATEMENT */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-4 border-y border-emerald-200">
        <div className="container-max">
          <p className="text-sm font-bold text-emerald-900 mb-3">Built on Official UK Visa Requirements</p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-800">
            <div className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span>UK visa requirements mapped into AI checks</span></div>
            <div className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span>Documents analysed against visa-specific requirements</span></div>
            <div className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span>GDPR compliant UK data processing</span></div>
            <div className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span>No immigration advice — document review only</span></div>
          </div>
        </div>
      </section>

      {/* AI EXAMPLE */}
      <section className="bg-blue-50 py-8 border-y border-blue-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">See Exactly What VisaBud Finds</h2>
          <p className="text-slate-800 mb-8">Real example: Payslip uploaded</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 border-2 border-slate-400 shadow-sm">
              <p className="text-xs font-bold text-slate-700 mb-3 uppercase">DOCUMENT</p>
              <div className="bg-gradient-to-br from-blue-100 to-slate-100 rounded p-6 text-center mb-4">
                <p className="text-sm font-semibold text-slate-900">📄 payslip_jan2026.pdf</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-emerald-400 shadow-sm">
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase">Document Type Detected</p>
              <p className="text-lg font-bold text-emerald-700 mb-4">Payslip ✅</p>
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase">Visa Readiness Score</p>
              <p className="text-4xl font-bold text-emerald-600 mb-4">82%</p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> <span className="text-slate-800">Income Verified: £45,000/year</span></div>
                <div className="flex gap-2"><AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /> <span className="text-slate-800">Missing Employer Address</span></div>
                <div className="flex gap-2"><AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" /> <span className="text-slate-800">Missing Bank Statement</span></div>
              </div>
              <p className="text-xs font-bold text-orange-600 mt-4">⚠️ Application Not Yet Ready To Submit</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY APPLICATIONS FAIL */}
      <section className="bg-red-50 py-12 border-y-2 border-red-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Why Applications Get Delayed or Refused</h2>
          <p className="text-slate-800 mb-8">A £{visa.cost.match(/\d+/)?.[0] || '1,000'}+ visa application can fail for preventable reasons:</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {['❌ Missing financial evidence', '❌ Incomplete relationship proof', '❌ Expired documents', '❌ Missing translations', '❌ Inconsistent dates', '❌ Poor document quality'].map((reason, i) => (
              <div key={i} className="text-slate-800 font-semibold">{reason}</div>
            ))}
            <div className="md:col-span-2 text-sm text-slate-800">
              {getCostWarning()}
            </div>
          </div>
          <div className="bg-white border-2 border-orange-400 rounded-lg p-4">
            <p className="text-sm text-slate-800"><span className="font-bold">What it costs:</span> Delays add 4-12 weeks. Refusals mean reapplying (another £{visa.cost.match(/\d+/)?.[0] || '1,000'}+).</p>
          </div>
        </div>
      </section>

      {/* TYPICAL DOCUMENTS */}
      <section className="container-max py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Typical Documents Needed For {visa.title}</h2>
        <div className="space-y-3">
          {visa.documents.map((category, catIdx) => (
            <div key={catIdx} className="bg-white border-2 border-slate-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDoc(category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-slate-900">{category.category}</p>
                    <p className="text-sm text-slate-600">{category.items.length} items</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${expandedDocs[category.category] ? 'rotate-180' : ''}`} />
              </button>
              {expandedDocs[category.category] && (
                <div className="bg-slate-50 border-t border-slate-200 p-4">
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-emerald-600 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* WHAT VISABUD DOES */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12 border-y-2 border-purple-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What VisaBud Actually Does</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {icon: '📋', title: 'Identifies Document Type', desc: 'Recognizes what you\'ve uploaded'},
              {icon: '✔️', title: 'Checks Visa Requirements', desc: 'Validates against official UKVI guidance'},
              {icon: '🚨', title: 'Flags Missing Information', desc: 'Highlights gaps in your document'},
              {icon: '📊', title: 'Identifies Missing Documents', desc: 'Shows what supporting docs you need'},
              {icon: '📈', title: 'Gives Readiness Score', desc: 'Rates your application strength'},
              {icon: '💡', title: 'Suggests Improvements', desc: 'Specific actions to take next'},
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-center mb-8">Your Data Is Protected</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="font-bold text-sm mb-1">Built Using Official UKVI Guidance</p>
              <p className="text-xs text-slate-400">UK visa requirements mapped</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-3">🔒</p>
              <p className="font-bold text-sm mb-1">Bank-Level Encryption</p>
              <p className="text-xs text-slate-400">All documents encrypted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-3">🏛️</p>
              <p className="font-bold text-sm mb-1">GDPR Compliant</p>
              <p className="text-xs text-slate-400">UK data protection</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-3">🚫</p>
              <p className="font-bold text-sm mb-1">Never Shared</p>
              <p className="text-xs text-slate-400">Documents stay private</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE ISSUES FOUND */}
      <section className="bg-slate-50 py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Example Issues VisaBud Found</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {visa: 'Spouse Visa', issue: 'Missing 2 bank statements', result: 'Submitted after correction'},
              {visa: 'Skilled Worker', issue: 'Sponsor licence number missing', result: 'Corrected before submission'},
              {visa: 'Student Visa', issue: 'Financial dates inconsistent', result: 'Corrected before submission'},
            ].map((example, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-2 border-slate-300">
                <p className="text-xs font-bold text-slate-600 mb-1 uppercase">{example.visa}</p>
                <p className="font-bold text-slate-900 mb-3">{example.issue}</p>
                <p className="text-sm text-emerald-700 font-semibold">✓ {example.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="container-max py-12">
        <button
          onClick={() => setExpandedTimeline(!expandedTimeline)}
          className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity"
        >
          <h2 className="text-2xl font-bold text-slate-900">View Full Application Timeline</h2>
          <ChevronDown className={`w-6 h-6 text-slate-600 transition-transform ${expandedTimeline ? 'rotate-180' : ''}`} />
        </button>
        {expandedTimeline && (
          <ol className="space-y-4">
            {visa.steps.map((step) => (
              <li key={step.number} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                  {step.number}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{step.title}</p>
                  <p className="text-xs text-slate-700 mt-1">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>





      {/* Footer */}
      <footer className="border-t border-slate-300 bg-slate-900 py-4">
        <div className="container-max">
          <div className="text-center">
            <p className="text-slate-500 text-xs">
              Information based on official UK Home Office guidance. VisaBud is not affiliated with UKVI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
