'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getVisaDetails, VisaType } from '@/lib/visa-guidance-data';
import TopNav from '@/components/TopNav';
import { ArrowRight, Check, Zap } from 'lucide-react';

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

  const docsCount = visa.documents.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${visa.color} text-white py-12 md:py-20`}>
        <div className="container-max">
          <div className="max-w-3xl">
            <div className="text-6xl mb-4">{visa.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{visa.title}</h1>
            <p className="text-lg text-white/95 mb-8">{visa.overview}</p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
                ⏱️ {visa.timeline}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
                💷 {visa.cost}
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
                ✓ {visa.successRate}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="container-max py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Eligibility & Steps */}
          <div>
            {/* Eligibility */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Eligibility Checklist</h2>
              </div>
              <ul className="space-y-3">
                {visa.eligibility.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-800 text-sm leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-xs font-bold">✓</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Steps */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Application Timeline</h2>
              </div>
              <ol className="space-y-4">
                {visa.steps.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: Documents */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Documents Required ({docsCount}+)</h2>
            <div className="space-y-4">
              {visa.documents.map((category, catIdx) => (
                <div key={catIdx} className="bg-white rounded-lg p-5 border-3 border-slate-400 shadow-md">
                  <h3 className="font-bold text-slate-900 mb-3 text-sm">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex gap-2 text-slate-800 text-xs leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Document Checks - The Premium Offer */}
      <section className="bg-white py-16 md:py-24 border-t-4 border-slate-400 shadow-sm">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Benefits */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full text-sm text-blue-700 font-medium mb-6">
                ✨ Premium Feature
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Get AI to Review Your Documents Before Submission
              </h2>
              <p className="text-lg text-slate-800 mb-8 leading-relaxed">
                You now have your checklist. Let our AI review each document to catch mistakes, missing sections, and compliance issues before you submit.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  { title: 'Document Authenticity Check', desc: 'AI verifies authenticity, formatting, and completeness' },
                  {
                    title: 'Error Detection',
                    desc: 'Flags common mistakes, missing info, and compliance gaps',
                  },
                  {
                    title: 'Confidence Scoring',
                    desc: 'See how strong your document is (low/medium/high risk)',
                  },
                  {
                    title: 'Specific Recommendations',
                    desc: 'Get exact guidance on how to improve each document',
                  },
                  {
                    title: 'Track Your Progress',
                    desc: 'Save your application and upload documents over time',
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{feature.title}</p>
                      <p className="text-slate-800 text-sm mt-1 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </ul>

              <div className="bg-white border-3 border-emerald-400 rounded-xl p-6 mb-8 shadow-sm">
                <p className="font-bold text-emerald-900 mb-2">🎁 3 Free AI Checks Included</p>
                <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
                  Try 3 free document reviews before you upgrade.
                </p>
                <p className="text-xs text-emerald-800">
                  No credit card. No commitment. Just see how it works.
                </p>
              </div>

              <Link
                href={`/auth/signup?visa=${visaType}`}
                className="btn-primary flex items-center gap-2 w-full justify-center mb-4 py-3.5"
              >
                Get 3 Free AI Checks Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-700 text-center">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Right: Visual Walkthrough */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border-3 border-blue-400 shadow-md">
                <div className="text-sm font-bold text-blue-700 mb-3">STEP 1: UPLOAD</div>
                <p className="text-slate-800 text-sm leading-relaxed">Select a document from your computer (PDF, image, or Word doc)</p>
              </div>

              <div className="bg-white rounded-lg p-6 border-3 border-blue-400 shadow-md">
                <div className="text-sm font-bold text-blue-700 mb-3">STEP 2: AI ANALYSIS</div>
                <p className="text-slate-800 text-sm leading-relaxed">AI scans your document against UK immigration requirements in seconds</p>
              </div>

              <div className="bg-white rounded-lg p-6 border-3 border-blue-400 shadow-md">
                <div className="text-sm font-bold text-blue-700 mb-3">STEP 3: GET FEEDBACK</div>
                <p className="text-slate-800 text-sm leading-relaxed">See your confidence score + specific improvements before you submit</p>
              </div>

              <div className="bg-white rounded-lg p-6 border-3 border-blue-400 shadow-md">
                <div className="text-sm font-bold text-blue-700 mb-3">STEP 4: APPLY WITH CONFIDENCE</div>
                <p className="text-slate-800 text-sm leading-relaxed">Submit your application knowing every document is visa-ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '👥', stat: '1,000+', label: 'Applicants guided' },
              { icon: '✓', stat: '91%', label: 'First-time approval rate' },
              { icon: '⏱️', stat: '48 hrs', label: 'Average AI review time' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="text-3xl font-bold mb-1">{item.stat}</p>
                <p className="text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container-max py-16">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to apply with confidence?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            You have everything you need. Let AI make sure it's perfect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/auth/signup?visa=${visaType}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all"
            >
              Start 3 Free AI Checks
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Explore Other Visas
            </Link>
          </div>
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
