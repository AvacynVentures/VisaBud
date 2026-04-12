'use client';

import Link from 'next/link';
import FAQSchema from './FAQSchema';

interface FAQ {
  question: string;
  answer: string;
}

interface ChecklistPreviewItem {
  text: string;
  critical?: boolean;
}

interface RelatedGuide {
  title: string;
  href: string;
}

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  readTime: string;
  children: React.ReactNode;
  faqs: FAQ[];
  checklistPreview: ChecklistPreviewItem[];
  relatedGuides: RelatedGuide[];
}

export default function GuideLayout({
  title,
  subtitle,
  lastUpdated,
  readTime,
  children,
  faqs,
  checklistPreview,
  relatedGuides,
}: GuideLayoutProps) {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Navigation */}
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container-max flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 35 Q 70 50 60 80 Q 55 95 65 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M 100 35 Q 130 50 140 80 Q 145 95 135 105" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M 85 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M 115 105 L 100 140" stroke="#D4AF37" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <line x1="88" y1="120" x2="112" y2="120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xl font-bold text-blue-900">VisaBud</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/visa-guides" className="text-sm text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline">
                All Guides
              </Link>
              <Link href="/app/start" className="btn-primary text-sm py-2 px-4">
                Get Your Checklist
              </Link>
            </div>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="container-max py-3">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/visa-guides" className="hover:text-blue-600 transition-colors">Visa Guides</Link>
            <span className="mx-2">›</span>
            <span className="text-slate-700">{title}</span>
          </nav>
        </div>

        {/* Hero */}
        <header className="container-max py-8 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Updated {lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {readTime} read
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="container-max pb-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Article Content */}
            <article className="lg:col-span-2 prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900">
              {children}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* CTA Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-blue-900 text-lg mb-2">
                  Get Your Personalised Checklist
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Answer 5 quick questions and we&apos;ll generate a complete, personalised document checklist for your visa application.
                </p>
                <Link href="/app/start" className="btn-primary w-full text-center block text-sm py-3">
                  Start Free — 3 Minutes
                </Link>
                <p className="text-xs text-blue-600 mt-2 text-center">No credit card required</p>
              </div>

              {/* Checklist Preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Quick Checklist Preview
                </h3>
                <ul className="space-y-2">
                  {checklistPreview.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.critical ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                        {item.critical ? '!' : '·'}
                      </span>
                      <span className={item.critical ? 'font-medium text-slate-900' : 'text-slate-600'}>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Link href="/app/start" className="text-sm text-blue-600 font-medium hover:underline">
                    See your full personalised list →
                  </Link>
                </div>
              </div>

              {/* Related Guides */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
                <ul className="space-y-3">
                  {relatedGuides.map((guide, i) => (
                    <li key={i}>
                      <Link href={guide.href} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="container-max max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white border border-slate-200 rounded-lg group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {faq.question}
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container-max text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Your Visa Application Right?
            </h2>
            <p className="text-blue-200 mb-8 text-lg">
              Use our free tool to generate a personalised checklist based on your specific circumstances. Takes just 3 minutes.
            </p>
            <Link href="/app/start" className="inline-flex items-center gap-2 bg-white text-blue-900 font-semibold py-3.5 px-8 rounded-lg hover:bg-blue-50 transition-colors text-lg">
              Generate My Free Checklist
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8">
          <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} VisaBud. Not legal advice — always verify with official sources.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
