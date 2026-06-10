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

  const docsCount = visa.documents.reduce((acc, cat) => acc + cat.items.length, 0);
  const toggleDoc = (catName: string) => {
    setExpandedDocs(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* HERO WITH VISUAL JOURNEY */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-100 py-16 md:py-20">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-900">
                Don't Risk a £{visa.cost.match(/\d+/)?.[0] || '1,000'}+ Visa Application
              </h1>
              <p className="text-lg text-slate-800 mb-6">
                Upload your documents and let VisaBud identify missing evidence, inconsistencies and common mistakes before you submit.
              </p>
              <ul className="text-sm text-slate-800 mb-8 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> 3 Free AI Document Checks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> No Credit Card Required</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Results in Minutes</li>
              </ul>
              <Link
                href={`/auth/signup?visa=${visaType}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all"
              >
                Check My Documents Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl">📄</div>
              <p className="text-slate-900 font-semibold text-sm">Upload document</p>
              <p className="text-slate-600">↓</p>
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl">🤖</div>
              <p className="text-slate-900 font-semibold text-sm">AI review</p>
              <p className="text-slate-600">↓</p>
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl">📊</div>
              <p className="text-slate-900 font-semibold text-sm">Confidence score</p>
              <p className="text-slate-600">↓</p>
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl">✅</div>
              <p className="text-slate-900 font-semibold text-sm">Submit with confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* FREE TRIAL BANNER */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4">
        <div className="container-max text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg font-bold">🟢 Free Trial</span>
          </div>
          <p className="text-sm font-semibold mb-2">Upload 1 document and receive: Confidence Score • Missing Documents List • Personalised Recommendations</p>
          <p className="text-xs text-emerald-50">No account required. No credit card required.</p>
        </div>
      </section>

      {/* VISA TYPE HEADING */}
      <section className="container-max pt-8 pb-4">
        <h2 className="text-3xl font-bold text-slate-900">{visa.title}</h2>
      </section>

      {/* DOCUMENTS REQUIRED */}
      <section className="container-max py-8 border-b-2 border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">What You'll Need ({docsCount}+ documents)</h3>
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
                    <p className="text-sm text-slate-600">{category.items.length} documents</p>
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

      {/* COMMON FAILURES */}
      <section className="bg-red-50 py-12 border-y-2 border-red-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Why Applications Get Delayed or Refused</h2>
          <p className="text-slate-800 mb-8">A £{visa.cost.match(/\d+/)?.[0] || '1,000'}+ visa application can fail for preventable reasons:</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              '❌ Missing financial evidence',
              '❌ Incomplete relationship proof',
              '❌ Expired documents',
              '❌ Missing translations',
              '❌ Inconsistent dates',
              '❌ Poor document quality',
            ].map((reason, i) => (
              <div key={i} className="text-slate-800 font-semibold">{reason}</div>
            ))}
          </div>
          <div className="bg-white border-2 border-orange-400 rounded-lg p-4">
            <p className="text-sm text-slate-800">
              <span className="font-bold">What it costs:</span> Delays add 4-12 weeks. Refusals mean reapplying (another £{visa.cost.match(/\d+/)?.[0] || '1,000'}+). That's your money and time.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="container-max py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Why VisaBud? Not Just a Checklist</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 border-2 border-slate-300">
                <th className="p-4 text-left font-bold text-slate-900">Feature</th>
                <th className="p-4 text-center font-bold text-slate-900">DIY</th>
                <th className="p-4 text-center font-bold text-slate-900">VisaBud</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Checklist of documents', '✓', '✓'],
                ['AI document review', '✗', '✓'],
                ['Missing document detection', '✗', '✓'],
                ['Confidence score', '✗', '✓'],
                ['Instant feedback', '✗', '✓'],
                ['Time required', 'Several hours', 'Minutes'],
                ['Risk of missing evidence', 'High', 'Lower'],
              ].map((row, i) => (
                <tr key={i} className={`border-2 border-slate-300 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="p-4 text-slate-900 font-semibold">{row[0]}</td>
                  <td className="p-4 text-center">{row[1]}</td>
                  <td className="p-4 text-center font-bold text-emerald-600">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI EXAMPLE */}
      <section className="bg-blue-50 py-12 border-y-2 border-blue-300">
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
              <p className="text-xs font-bold text-slate-700 mb-4 uppercase">AI RESULT</p>
              <p className="text-3xl font-bold text-emerald-600 mb-1">82%</p>
              <p className="text-sm text-slate-600 mb-4">Confidence Score</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-700"><Check className="w-4 h-4" /> Income verified (£45,000/year)</div>
                <div className="flex items-center gap-2 text-orange-600"><AlertCircle className="w-4 h-4" /> <span>Missing employer address</span></div>
                <div className="flex items-center gap-2 text-orange-600"><AlertCircle className="w-4 h-4" /> <span>Add bank statement to verify</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT TYPES FAQ */}
      <section className="container-max py-12 bg-blue-50 border-y-2 border-blue-300">
        <h3 className="text-xl font-bold text-slate-900 mb-6">What Documents Can I Upload?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {['Payslips', 'Bank Statements', 'Passports', 'Employment Contracts', 'Marriage Certificates', 'Utility Bills', 'Sponsor Documents', 'Medical Records'].map((doc, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-800">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm">{doc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TRY IT NOW */}
      <section className="bg-emerald-50 py-12 border-y-2 border-emerald-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check One Document Free Before You Apply</h2>
          <p className="text-slate-800 mb-3">Upload a payslip, bank statement or passport and receive:</p>
          <ul className="text-sm text-slate-800 mb-8 space-y-1">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Confidence Score</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Missing Documents List</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Personalised Recommendations</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Instant AI Feedback</li>
          </ul>

          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 uppercase">Example Document</p>
                <div className="bg-white rounded-lg border-2 border-slate-400 p-4 h-48 flex flex-col justify-center items-center">
                  <div className="w-full h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <div className="text-xs text-slate-600 p-2 line-clamp-6">PAYSLIP | Jan 2026 | Income £45,000 | [blurred] | [blurred]</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">📄 payslip_jan2026.pdf</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 uppercase">What You See</p>
                <div className="bg-white rounded-lg border-2 border-emerald-400 p-4">
                  <p className="text-sm font-bold text-emerald-600 mb-2">82%</p>
                  <p className="text-xs text-slate-600 mb-3">Confidence Score</p>
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-900">✓ Verified</p>
                    <p className="text-slate-700">Income: £45,000/year</p>
                    <p className="font-bold text-slate-900 mt-2">⚠️ Missing</p>
                    <p className="text-slate-700">Employer address</p>
                    <p className="font-bold text-slate-900 mt-2">💡 Recommendation</p>
                    <p className="text-slate-700">Add bank statement</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                href={`/demo-upload?visa=${visaType}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
              >
                📁 Try It Now
              </Link>
              <p className="text-xs text-slate-600 mt-4">
                No account required. No credit card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-center mb-8">Your Data Is Protected</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl mb-3">🔒</p>
              <p className="font-bold text-sm mb-1">Bank-Level Encryption</p>
              <p className="text-xs text-slate-400">All documents encrypted in transit</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-3">🏛️</p>
              <p className="font-bold text-sm mb-1">GDPR Compliant</p>
              <p className="text-xs text-slate-400">UK data protection standards</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-3">🚫</p>
              <p className="font-bold text-sm mb-1">Never Shared</p>
              <p className="text-xs text-slate-400">Your documents stay private</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL KNOW */}
      <section className="bg-purple-50 py-12 border-y-2 border-purple-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What You'll Know Before You Submit</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {icon: '📊', title: 'Confidence Score', desc: 'See exactly how strong each document is'},
              {icon: '📋', title: 'Missing Documents List', desc: 'Know instantly what you need to add'},
              {icon: '💡', title: 'Specific Recommendations', desc: 'Exact steps to improve your application'},
              {icon: '✅', title: 'Readiness Assessment', desc: 'Track progress as you fix issues'},
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

      {/* TESTIMONIALS */}
      <section className="bg-slate-50 py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Mistakes VisaBud Caught Before Submission</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {name: 'Sarah M.', visa: 'Spouse Visa', quote: 'VisaBud identified two missing bank statements before submission. Uploaded them and was approved first time.'},
              {name: 'Ahmed K.', visa: 'Skilled Worker', quote: 'The AI flagged my employment contract was missing the license number. Added it before submission. Approved in 6 weeks.'},
              {name: 'Lisa T.', visa: 'Student Visa', quote: 'My financial documents had date inconsistencies. VisaBud caught it. Corrected and submitted with confidence. Accepted.'},
            ].map((story, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-2 border-slate-300">
                <p className="text-xs font-bold text-slate-600 mb-1 uppercase">{story.visa}</p>
                <p className="font-bold text-slate-900 mb-3">{story.name}</p>
                <p className="text-sm text-slate-700 mb-3">{story.quote}</p>
                <p className="text-xs font-bold text-emerald-600">✓ Approved</p>
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

      {/* CREDIBILITY */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max text-center mb-8">
          <p className="text-sm text-slate-300">Built using official UKVI requirements and document guidance.</p>
        </div>
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">1,000+</p>
              <p className="text-slate-300">Documents Reviewed</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">20+</p>
              <p className="text-slate-300">Visa Types Supported</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">⚡</p>
              <p className="text-slate-300">AI Review in Minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-max py-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to apply with confidence?</h2>
          <p className="text-lg text-blue-100 mb-6">Get 3 free AI document checks. See what we find.</p>
          <Link
            href={`/auth/signup?visa=${visaType}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-slate-300 bg-slate-900 py-10">
        <div className="container-max">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">
              Information based on official UK Home Office guidance. Always verify with gov.uk before applying.
            </p>
            <p className="text-slate-500 text-xs">
              VisaBud is not affiliated with or endorsed by the UK Home Office or UKVI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
