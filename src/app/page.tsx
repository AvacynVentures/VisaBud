'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { PageFadeIn, StaggerContainer, StaggerItem, FadeIn } from '@/lib/animations';
import FooterEmailCapture from '@/components/FooterEmailCapture';
import TopNav from '@/components/TopNav';
import { getAllVisas } from '@/lib/visa-guidance-data';
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
          <p className="text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <TopNav />

        {/* Hero */}
        <section className="container-max py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <FadeIn delay={0.05}>
                <div className="mb-4 inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm text-blue-600 font-medium">
                  🏛️ Built using official UK Home Office guidance
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 leading-tight">
                  Complete your UK visa<br />application with confidence*
                </h1>
              </FadeIn>
              <FadeIn delay={0.15}>
                <p className="text-lg text-slate-700 mb-2 leading-relaxed">
                  Get AI-powered document checks, a personalised checklist, and timeline — free to start.
                </p>
                <p className="text-sm text-slate-600 mb-6">
                  3 free AI document checks included · Full access from £9.99
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                {user && (
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Link href="/app/start" className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-6 shadow-lg shadow-blue-200/50">
                      Start a New Application
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Link>
                    <Link href="/applications" className="flex items-center justify-center gap-2 text-base py-3 px-6 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl font-semibold text-gray-700 hover:text-blue-700 transition-all">
                      View My Applications
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </FadeIn>
            </div>
            {/* Hero Visual - AI Document Checker Example */}
            <FadeIn delay={0.2} className="hidden md:block">
              <div className="bg-white rounded-xl p-6 border-2 border-emerald-400 shadow-lg">
                <p className="text-xs font-bold text-slate-600 mb-2 uppercase">AI Document Check Example</p>
                <div className="bg-gradient-to-br from-blue-100 to-slate-100 rounded p-4 text-center mb-4">
                  <p className="text-sm font-semibold text-slate-900">📄 payslip_jan2026.pdf</p>
                </div>
                <p className="text-xs font-bold text-slate-700 mb-2 uppercase">Document Type Detected</p>
                <p className="text-lg font-bold text-emerald-700 mb-4">Payslip ✅</p>
                <p className="text-xs font-bold text-slate-700 mb-1 uppercase">Visa Readiness Score</p>
                <p className="text-4xl font-bold text-emerald-600 mb-4">82%</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex gap-2"><span className="text-emerald-600">✓</span> <span className="text-slate-800">Income Verified: £45,000/year</span></div>
                  <div className="flex gap-2"><span className="text-orange-600">⚠</span> <span className="text-slate-800">Missing Employer Address</span></div>
                  <div className="flex gap-2"><span className="text-orange-600">⚠</span> <span className="text-slate-800">Missing Bank Statement</span></div>
                </div>
                <p className="text-xs font-bold text-orange-600">⚠️ Not Yet Ready To Submit</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Visa Type Selector (If not logged in) - Clean Buttons */}
        {!user && (
          <section className="bg-gradient-to-b from-white to-slate-50 py-8 md:py-10 border-b border-slate-200">
            <div className="container-max">
              <FadeIn>
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Choose your visa pathway</h2>
                </div>
              </FadeIn>
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {getAllVisas().map((visa) => (
                  <StaggerItem key={visa.id}>
                    <Link
                      href={`/visa-guidance/${visa.id}`}
                      className="block p-4 text-center rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                    >
                      <h3 className="text-sm">{visa.title}</h3>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {/* Free AI Checks Strip */}
        <section className="bg-emerald-50 border-y border-emerald-100 py-6">
          <div className="container-max">
            <p className="text-center text-xs font-semibold text-emerald-700 mb-4 uppercase tracking-wide">✨ Included free — no payment needed</p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { icon: '🪪', title: 'Passport Identity & Fraud Check', desc: 'AI checks expiry, MRZ integrity, and name consistency across your documents.' },
                { icon: '💰', title: 'Financial Documents Cross-Check', desc: 'AI flags salary mismatches between payslips, bank statements, and employer letter.' },
                { icon: '🏠', title: 'Accommodation & Address Check', desc: 'AI extracts your address and cross-references it for consistency across all docs.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-emerald-100 flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-slate-700">{item.desc}</p>
                    <span className="inline-block mt-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credibility Bar */}
        <section className="bg-blue-900 py-2">
          <div className="container-max flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">🏛️ Built on official UKVI guidance</span>
            <span className="hidden sm:inline text-blue-600">·</span>
            <span className="flex items-center gap-1.5">👨‍⚖️ Recommended by immigration consultants</span>
            <span className="hidden sm:inline text-blue-600">·</span>
            <span className="flex items-center gap-1.5">🛡️ Trusted by 1,000+ visa applicants</span>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="bg-white border-t border-b border-slate-200 py-8">
          <div className="container-max">
            <StaggerContainer className="grid md:grid-cols-3 gap-6">
              <StaggerItem>
                <div className="flex items-start gap-4 card-hover p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">1,000+ applicants guided</h3>
                    <p className="text-sm text-slate-700">Real people getting their visas approved — first time</p>
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
                    <p className="text-sm text-slate-700">Every document checked, nothing left to chance</p>
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
                    <p className="text-sm text-slate-700">GDPR compliant, encrypted, never shared with anyone</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>



        {/* How It Works */}
        <section className="container-max py-10">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-blue-600 text-xs font-semibold mb-2 uppercase tracking-wide">How it works</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Three steps to apply with confidence</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '📄', step: 'STEP 1', title: 'Upload Your Documents', desc: 'Upload all documents for your visa. No limits.' },
              { emoji: '🤖', step: 'STEP 2', title: 'Get AI Checks Free', desc: 'Check up to 3 documents with AI. See what we find.' },
              { emoji: '✅', step: 'STEP 3', title: 'Apply With Confidence', desc: 'Fix any issues we find. Apply knowing nothing is missed.' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="card card-hover p-8 text-center">
                  <div className="text-4xl mb-4 icon-hover-spin inline-block">{item.emoji}</div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">{item.step}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-700">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Testimonial */}
        <section className="bg-blue-50 py-8">
          <FadeIn>
            <div className="container-max text-center max-w-2xl mx-auto">
              <p className="text-base text-slate-900 mb-3 italic leading-relaxed">
                I was terrified I&apos;d get refused. VisaBud flagged a risk I hadn&apos;t even thought of, and I got my spouse visa approved first time.
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">PS</div>
                <div className="text-left">
                  <p className="text-slate-900 font-semibold text-sm">Priya S.</p>
                  <p className="text-slate-600 text-xs">Spouse Visa · Approved October 2024</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>



        {/* Disclaimer Section */}
        <section className="bg-slate-50 border-t border-slate-200 py-6">
          <div className="container-max">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold">*Disclaimer:</span> VisaBud is not affiliated with UKVI or any government agency. This service is for guidance only and does not constitute legal advice. Always verify with official <a href="https://www.gov.uk/visas-immigration" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Gov.uk</a> guidance before submitting.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-slate-900 py-8">
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
                <p className="text-slate-700 text-xs mb-4">Always verify with official Gov.uk guidance before submitting your application.</p>
                <div className="flex items-center gap-4 text-xs text-slate-700">
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
              <p className="text-xs text-slate-700">Join 1,000+ applicants who prepared their visa with VisaBud</p>
            </div>
          </div>
        </footer>
      </div>
    </PageFadeIn>
  );
}

