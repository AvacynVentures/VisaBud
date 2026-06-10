'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { PageFadeIn, StaggerContainer, StaggerItem, FadeIn } from '@/lib/animations';
import FooterEmailCapture from '@/components/FooterEmailCapture';
import TopNav from '@/components/TopNav';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await supabase.auth.getSession();
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <TopNav />

        {/* Hero */}
        <section className="container-max py-16 md:py-24">
          <div className="max-w-3xl">
            <FadeIn delay={0.05}>
              <div className="mb-6 inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm text-blue-600 font-medium">
                🏛️ Built using official UK Home Office guidance
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Complete your UK visa<br />application with confidence*<br />
                <span className="text-gradient">We make sure you don&apos;t miss a thing.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-xl text-slate-600 mb-4 leading-relaxed">
                Get AI-powered document checks, a personalised checklist, and timeline — free to start.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                3 free AI document checks included · Full access from £9.99
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {user ? (
                  <>
                    <Link href="/app/start" className="btn-primary flex items-center justify-center gap-2 text-base py-3.5 px-7 shadow-lg shadow-blue-200/50">
                      Start a New Application
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Link>
                    <Link href="/applications" className="flex items-center justify-center gap-2 text-base py-3.5 px-7 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl font-semibold text-gray-700 hover:text-blue-700 transition-all">
                      View My Applications
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <Link href="/auth/signup" className="btn-primary flex items-center justify-center gap-2 text-base py-3.5 px-7 shadow-lg shadow-blue-200/50">
                    Get Started Free
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Takes 3 minutes · 3 free AI checks included · No spam, ever
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Free AI Checks Strip */}
        <section className="bg-emerald-50 border-y border-emerald-100 py-8">
          <div className="container-max">
            <p className="text-center text-sm font-semibold text-emerald-700 mb-5 uppercase tracking-wide">✨ Included free — no payment needed</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '🪪', title: 'Passport Identity & Fraud Check', desc: 'AI checks expiry, MRZ integrity, and name consistency across your documents.' },
                { icon: '💰', title: 'Financial Documents Cross-Check', desc: 'AI flags salary mismatches between payslips, bank statements, and employer letter.' },
                { icon: '🏠', title: 'Accommodation & Address Check', desc: 'AI extracts your address and cross-references it for consistency across all docs.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-emerald-100 flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                    <span className="inline-block mt-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credibility Bar */}
        <section className="bg-blue-900 py-3">
          <div className="container-max flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">🏛️ Built on official UKVI guidance</span>
            <span className="hidden sm:inline text-blue-600">·</span>
            <span className="flex items-center gap-1.5">👨‍⚖️ Recommended by immigration consultants</span>
            <span className="hidden sm:inline text-blue-600">·</span>
            <span className="flex items-center gap-1.5">🛡️ Trusted by 1,000+ visa applicants</span>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-white border-t border-b border-slate-200 py-12">
          <div className="container-max">
            <StaggerContainer className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <div className="flex items-start gap-4 card-hover p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">1,000+ applicants guided</h3>
                    <p className="text-sm text-slate-600">Real people getting their visas approved — first time</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 card-hover p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Sleep well knowing you&apos;re ready</h3>
                    <p className="text-sm text-slate-600">Every document checked, nothing left to chance</p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 card-hover p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 text-lg">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Your data stays private</h3>
                    <p className="text-sm text-slate-600">GDPR compliant, encrypted, never shared with anyone</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* How It Works */}
        <section className="container-max py-16">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-600 text-sm font-semibold mb-2 uppercase tracking-wide">How it works</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Three steps. Zero guesswork.</h2>
              <p className="text-slate-500 max-w-md mx-auto">No legal jargon. No spreadsheets. Just a clear path from &ldquo;I don&apos;t know where to start&rdquo; to &ldquo;I&apos;m ready to apply.&rdquo;</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: '🗣️', step: 'STEP 1', title: 'Choose your visa type', desc: 'Select Spouse, Skilled Worker, or British Citizenship — we instantly build your personalised checklist and AI checks.' },
              { emoji: '⚡', step: 'STEP 2', title: 'Get your personalised plan', desc: 'We instantly build your checklist, timeline, and flag any risks — tailored to your exact situation.' },
              { emoji: '📦', step: 'STEP 3', title: 'Apply with confidence', desc: 'A clean, structured pack ready to reference. Know exactly what to submit and when.' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="card card-hover p-8 text-center">
                  <div className="text-4xl mb-4 icon-hover-spin inline-block">{item.emoji}</div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">{item.step}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Testimonial */}
        <section className="bg-blue-50 py-12">
          <FadeIn>
            <div className="container-max text-center max-w-2xl mx-auto">
              <div className="text-4xl mb-4">&ldquo;</div>
              <p className="text-lg text-slate-900 mb-4 italic leading-relaxed">
                I was terrified I&apos;d get refused — I&apos;d heard so many horror stories. VisaBud told me exactly what I needed, flagged a risk I hadn&apos;t even thought of, and I got my spouse visa approved first time. I wish I&apos;d found this months ago.
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">PS</div>
                <div className="text-left">
                  <p className="text-slate-900 font-semibold text-sm">Priya S.</p>
                  <p className="text-slate-500 text-xs">Spouse Visa · Approved October 2024</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Pricing */}
        <section className="container-max py-16">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-blue-600 text-sm font-semibold mb-2 uppercase tracking-wide">Simple pricing</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">One price. Everything unlocked.</h2>
              <p className="text-slate-500">No tiers. No confusion. Pay once per application, unlock everything.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-sm mx-auto">
              <div className="card p-8 border-2 border-blue-200">
                <div className="text-center mb-6">
                  <p className="text-sm font-semibold text-emerald-600 mb-1">🔓 Full Application Unlock</p>
                  <div className="text-5xl font-bold text-blue-600 mb-1">£9.99</div>
                  <p className="text-slate-500 text-sm">Per application · One-time · Instant access</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm text-slate-700">
                  {[
                    '✓ All 30+ checklist items unlocked',
                    '✓ AI document verification on every item',
                    '✓ Risk scoring & confidence scores',
                    '✓ 37 document preparation templates',
                    '✓ PDF export & timeline',
                    '✓ 7-day money-back guarantee',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">{item}</li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="btn-primary w-full block text-center py-3.5">
                  Start Free — Unlock for £9.99
                </Link>
                <p className="text-xs text-slate-400 text-center mt-3">3 AI checks always free. Pay per application when ready.</p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Final CTA */}
        <section className="container-max pb-16">
          <FadeIn>
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Stop guessing. Know exactly what to do.</h2>
              <p className="text-blue-200 mb-6 max-w-lg mx-auto">Join 1,000+ applicants who got their visa right the first time. Your personalised plan is 3 minutes away.</p>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-800 font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg btn-hover">
                Start Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-slate-50 border-t border-slate-200 py-8">
          <div className="container-max">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold">*Disclaimer:</span> VisaBud is not affiliated with UK Visas and Immigration (UKVI) or any government agency. We provide private document preparation checklists to help you organize materials for visa applications. This service is for informational guidance only and does not constitute legal advice. Always verify information with official <a href="https://www.gov.uk/visas-immigration" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Gov.uk</a> guidance before submitting your application.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-slate-900 py-10">
          <div className="container-max">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Brand + links */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className="font-bold text-white">VisaBud</span>
                </div>
                <p className="text-slate-400 text-sm mb-3">Not a law firm · For guidance only</p>
                <p className="text-slate-500 text-xs mb-4">Always verify with official Gov.uk guidance before submitting your application.</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                  <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
                </div>
              </div>
              {/* Email capture */}
              <div className="flex items-end justify-end">
                <FooterEmailCapture />
              </div>
            </div>
            <div className="border-t border-slate-800 pt-4 text-center">
              <p className="text-xs text-slate-600">Join 1,000+ applicants who prepared their visa with VisaBud</p>
            </div>
          </div>
        </footer>
      </div>
    </PageFadeIn>
  );
}
