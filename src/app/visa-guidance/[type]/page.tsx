'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getVisaDetails, VisaType } from '@/lib/visa-guidance-data';
import TopNav from '@/components/TopNav';
import { ArrowRight, Check, ChevronDown, AlertCircle, Upload } from 'lucide-react';

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

      {/* HERO - MONEY-FOCUSED */}
      <section className={`bg-gradient-to-br ${visa.color} text-white py-16 md:py-20`}>
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Don't Risk a £{visa.cost.match(/\d+/)?.[0] || '1,000'}+ Visa Application
            </h1>
            <p className="text-lg text-white/95 mb-6">
              Upload your documents and let VisaBud identify missing evidence, inconsistencies and common mistakes before you submit.
            </p>
            <ul className="text-sm text-white/90 mb-8 space-y-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> 3 Free AI Document Checks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> No Credit Card Required</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Results in Minutes</li>
            </ul>
            <Link
              href={`/auth/signup?visa=${visaType}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all"
            >
              Check My Documents Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* VISA TYPE HEADING */}
      <section className="container-max pt-8 pb-4">
        <h2 className="text-3xl font-bold text-slate-900">{visa.title}</h2>
      </section>

      {/* DOCUMENTS REQUIRED - COMPRESSED & COLLAPSIBLE */}
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

      {/* COMMON FAILURES - URGENCY & CONSEQUENCE */}
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
                <th className="p-4 text-center font-bold text-slate-900">DIY + Checklist</th>
                <th className="p-4 text-center font-bold text-slate-900">VisaBud</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Checklist of documents', true, true],
                ['AI document review', false, true],
                ['Missing document detection', false, true],
                ['Confidence score', false, true],
                ['Instant feedback', false, true],
                ['Cost', '£0', 'From £10'],
              ].map((row, i) => (
                <tr key={i} className={`border-2 border-slate-300 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="p-4 text-slate-900 font-semibold">{row[0]}</td>
                  <td className="p-4 text-center">{row[1] ? '✓' : '✗'}</td>
                  <td className="p-4 text-center font-bold">{row[2] ? '✓' : row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI EXAMPLE - THE PROOF */}
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

      {/* TRY IT NOW - DEMO UPLOAD (NO SIGNUP) */}
      <section className="bg-emerald-50 py-12 border-y-2 border-emerald-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload One Document. Find Out What's Missing.</h2>
          <p className="text-slate-800 mb-3">Upload a payslip, bank statement or passport and receive:</p>
          <ul className="text-sm text-slate-800 mb-8 space-y-1">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Confidence Score</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Missing Documents List</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Personalised Recommendations</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Instant AI Feedback</li>
          </ul>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border-2 border-dashed border-emerald-400 p-8">
              <div className="text-center">
                <Upload className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <p className="font-bold text-slate-900 mb-4">Drag & Drop Your Document Here</p>
                <p className="text-sm text-slate-600 mb-6">or</p>
                <Link
                  href={`/demo-upload?visa=${visaType}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all"
                >
                  📁 Choose File
                </Link>
                <p className="text-xs text-slate-600 mt-6">
                  No account required. No credit card required.<br/>
                  See your AI review instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY - MOVED UP */}
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

      {/* WHAT YOU'LL KNOW BEFORE SUBMIT */}
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

      {/* TESTIMONIALS - SHORT & PUNCHY */}
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

      {/* TIMELINE - COLLAPSIBLE */}
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

      {/* STATS - DEFENSIBLE ONLY */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">1,000+</p>
              <p className="text-slate-300">Applicants Guided</p>
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
        <div className="container-max text-center">
          <p className="text-slate-400 text-sm">
            Information based on official UK Home Office guidance. Always verify with gov.uk before applying.
          </p>
        </div>
      </footer>
    </div>
  );
}
