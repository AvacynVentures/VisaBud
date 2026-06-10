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

      {/* HERO - OUTCOME FOCUSED */}
      <section className={`bg-gradient-to-br ${visa.color} text-white py-16 md:py-20`}>
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Avoid Costly {visa.title} Mistakes Before You Submit
            </h1>
            <p className="text-lg text-white/95 mb-2">
              Upload your documents and get an instant AI review before spending £{visa.cost.match(/\d+/)?.[0] || '1,000'}+ on visa fees and healthcare charges.
            </p>
            <ul className="text-sm text-white/90 mb-8 space-y-2">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> 3 Free AI Document Checks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> No Credit Card Required</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Personalised Document Feedback</li>
            </ul>
            <Link
              href={`/auth/signup?visa=${visaType}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all"
            >
              Check My Documents Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-white/80 mt-4">
              <span className="text-lg">⏱️</span>
              <span>{visa.timeline} processing time</span>
              <span className="text-lg">•</span>
              <span>✓ {visa.successRate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENTS REQUIRED - COMPRESSED & COLLAPSIBLE */}
      <section className="container-max py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">What You'll Need ({docsCount}+ documents)</h2>
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
          <p className="text-slate-800 mb-8">A £1,800+ visa application can fail for preventable reasons:</p>
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
              <span className="font-bold">What it costs:</span> Delays add 4-12 weeks. Refusals mean reapplying (another £1,800+). That's your money and time.
            </p>
          </div>
        </div>
      </section>

      {/* AI EXAMPLE - THE PROOF */}
      <section className="bg-blue-50 py-12 border-y-2 border-blue-300">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Here's What VisaBud AI Does</h2>
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

      {/* EARLY CTA - ACTION NOW */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-12 text-white text-center">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-3">See It For Yourself</h2>
          <p className="text-lg text-white/90 mb-6">Upload your first document for free. No credit card.</p>
          <Link
            href={`/auth/signup?visa=${visaType}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all"
          >
            Upload My First Document
            <ArrowRight className="w-5 h-5" />
          </Link>
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

      {/* TESTIMONIALS - EMOTIONAL */}
      <section className="bg-slate-50 py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Real People. Real Approvals.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {name: 'Sarah M.', visa: 'Spouse Visa', story: 'I was about to submit my visa application when VisaBud identified that my financial evidence didn\'t cover the required period. I uploaded the missing statements. I got approved first time and avoided a costly mistake.'},
              {name: 'Ahmed K.', visa: 'Skilled Worker', story: 'The AI flagged that my employment contract was missing the sponsor\'s license number. I added it before submission. Got approved in 6 weeks. If I\'d submitted without it, I would\'ve been rejected.'},
              {name: 'Lisa T.', visa: 'Student Visa', story: 'My bank statement dates didn\'t match my application form. VisaBud caught it immediately. I corrected it and submitted with confidence. Accepted on the first review.'},
            ].map((story, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-2 border-slate-300">
                <p className="text-xs font-bold text-slate-600 mb-1 uppercase">{story.visa}</p>
                <p className="font-bold text-slate-900 mb-3">{story.name}</p>
                <p className="text-sm text-slate-700 italic mb-3">{story.story}</p>
                <p className="text-xs font-bold text-emerald-600">✓ Approved</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READINESS SCORE - AFTER CONTEXT */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Example: Readiness Score</h2>
          <p className="text-slate-800 mb-6">Once you upload, you'll see exactly how strong your application is:</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 border-2 border-purple-400">
              <p className="text-xs font-bold text-slate-700 mb-3 uppercase">Your Score</p>
              <p className="text-5xl font-bold text-purple-600 mb-1">87%</p>
              <p className="text-sm text-slate-600 mb-4">Strong — Ready to submit</p>
              <div className="space-y-3 text-sm">
                <div><div className="flex justify-between mb-1"><span className="text-slate-700">Relationship</span><span className="font-bold text-emerald-600">95%</span></div><div className="bg-slate-200 rounded h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '95%'}}></div></div></div>
                <div><div className="flex justify-between mb-1"><span className="text-slate-700">Financial</span><span className="font-bold text-orange-600">72%</span></div><div className="bg-slate-200 rounded h-2"><div className="bg-orange-500 h-2 rounded-full" style={{width: '72%'}}></div></div></div>
                <div><div className="flex justify-between mb-1"><span className="text-slate-700">Documents</span><span className="font-bold text-emerald-600">100%</span></div><div className="bg-slate-200 rounded h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: '100%'}}></div></div></div>
              </div>
            </div>
            <div className="flex flex-col justify-center"><div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6"><p className="font-bold text-emerald-900 mb-2">How It Works</p><p className="text-sm text-emerald-800">Upload your documents. Get a score. See what's missing. Fix it. Upload again. Improve your score.</p></div></div>
          </div>
        </div>
      </section>

      {/* SECURITY + STATS */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-center mb-8">Trusted & Secure</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {[
              {icon: '🔒', title: 'Bank-Level Encryption', desc: 'All documents encrypted'},
              {icon: '🏛️', title: 'GDPR Compliant', desc: 'UK data protection'},
              {icon: '🚫', title: 'Never Shared', desc: 'Your documents stay private'},
              {icon: '👥', title: '1,000+ Users', desc: '91% approval rate'},
            ].map((item, i) => (
              <div key={i} className="text-center"><p className="text-3xl mb-2">{item.icon}</p><p className="font-bold text-sm mb-1">{item.title}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-max py-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to avoid mistakes?</h2>
          <p className="text-lg text-blue-100 mb-6">Check your documents before submission.</p>
          <Link
            href={`/auth/signup?visa=${visaType}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all"
          >
            Get 3 Free AI Checks
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
