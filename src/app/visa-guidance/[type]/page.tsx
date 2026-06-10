'use client';


import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getVisaDetails, VisaType } from '@/lib/visa-guidance-data';
import TopNav from '@/components/TopNav';
import { ArrowRight, Check, Zap, Lock } from 'lucide-react';

export default function VisaGuidancePage() {
  const params = useParams();
  const visaType = (params.type as string) || '';
  const visa = getVisaDetails(visaType as VisaType);


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

  const docsPreviewCount = visa.documents.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <TopNav />

      {/* Hero */}
      <section className={`bg-gradient-to-br ${visa.color} text-white py-12 md:py-20`}>
        <div className="container-max">
          <div className="max-w-3xl">
            <div className="text-5xl mb-4">{visa.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{visa.title}</h1>
            <p className="text-lg text-white/90 mb-6">{visa.overview}</p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                ⏱️ {visa.timeline}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                💷 {visa.cost}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                ✓ {visa.successRate}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Eligibility */}
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Eligibility Checklist</h2>
            </div>
            <ul className="space-y-3">
              {visa.eligibility.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Application Timeline</h2>
            </div>
            <ol className="space-y-4">
              {visa.steps.map((step) => (
                <li key={step.number} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Documents You'll Need</h2>
              <p className="text-slate-600">VisaBud helps you organize {docsPreviewCount}+ required documents</p>
            </div>
            <Link
              href={`/auth/signup?visa=${visaType}`}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              Unlock Full Checklist
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visa.documents.map((docCategory, catIdx) => (
              <div key={catIdx} className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">{docCategory.category}</h3>
                <ul className="space-y-2">
                  {docCategory.items.map((item, itemIdx) => {
                    const isVisible =
                      catIdx === 0 ? itemIdx < 2 : false; // Show first 2 from first category as preview
                    return (
                      <li
                        key={itemIdx}
                        className={`text-xs flex gap-2 ${
                          isVisible ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {isVisible ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>{item}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                            <span className="italic">Unlock to see all</span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Document Checks (Free Offer) */}
      <section className="container-max py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm text-blue-600 font-medium mb-4">
              ✨ AI-Powered Feature
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">VisaBud AI Document Check</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Once you've gathered your documents, VisaBud's AI scans each file and checks:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Document authenticity & completeness',
                'Common mistakes & missing sections',
                'Compliance with UK requirements',
                'Risk scoring (confidence your document will pass)',
                'Specific guidance for improvement',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
              <p className="font-semibold text-emerald-900 mb-2">🎉 You get 3 free AI checks to start</p>
              <p className="text-sm text-emerald-800">
                Upload documents, see how they score, and get specific feedback before you submit your real application.
              </p>
            </div>

            <Link
              href={`/auth/signup?visa=${visaType}`}
              className="btn-primary flex items-center gap-2 w-full justify-center mb-4"
            >
              Try Your First AI Check (Free)
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-slate-500 text-center">No credit card required · 3 free checks included</p>
          </div>

          <div className="card p-8 bg-gradient-to-br from-blue-50 to-slate-50">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Upload Document</p>
                  <p className="text-xs text-slate-600 mt-1">PDF, image, or text file</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">AI Analysis</p>
                  <p className="text-xs text-slate-600 mt-1">Instantly scanned & verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Feedback & Confidence Score</p>
                  <p className="text-xs text-slate-600 mt-1">Risk score + specific improvements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Ready to Submit</p>
                  <p className="text-xs text-slate-600 mt-1">Apply with confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why VisaBud */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-8 text-center">Why 1,000+ applicants choose VisaBud</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Organized Checklists',
                desc: 'Every document you need, organized by category, so nothing gets missed.',
              },
              {
                icon: '🤖',
                title: 'AI-Powered Checks',
                desc: 'Scan documents before you submit. Get risk scores & specific feedback.',
              },
              {
                icon: '✓',
                title: 'Peace of Mind',
                desc: 'Know you\'ve got everything right before hitting submit. First-time approvals.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-max py-16">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get your visa approved?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with your free 3 AI checks. No signup required to see your full checklist and documents needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/auth/signup?visa=${visaType}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              View Other Visas
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-10">
        <div className="container-max text-center">
          <p className="text-slate-400 text-sm">
            Information based on official UK Home Office guidance. Always verify with gov.uk before applying.
          </p>
        </div>
      </footer>
    </div>
  );
}
