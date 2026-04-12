import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UK Visa Guides & Checklists 2025 | VisaBud',
  description: 'Free, comprehensive UK visa guides with checklists, timelines, fees, and expert tips. Spouse visas, skilled worker visas, citizenship, and more.',
};

const guides = [
  {
    title: 'UK Spouse Visa Checklist 2025',
    description: 'Complete document checklist for the UK spouse/partner visa, including financial requirements and supporting evidence.',
    href: '/visa-guides/spouse-visa-checklist-2025',
    category: 'Family',
    icon: '💍',
  },
  {
    title: 'Skilled Worker Visa Documents Needed',
    description: 'Every document you need for a UK Skilled Worker visa application — from your Certificate of Sponsorship to proof of English.',
    href: '/visa-guides/skilled-worker-visa-documents',
    category: 'Work',
    icon: '💼',
  },
  {
    title: 'UK Citizenship Requirements',
    description: 'A complete guide to British citizenship eligibility, the Life in the UK test, residency requirements, and the naturalisation process.',
    href: '/visa-guides/uk-citizenship-requirements',
    category: 'Citizenship',
    icon: '🇬🇧',
  },
  {
    title: 'How to Apply for a UK Visa',
    description: 'Step-by-step walkthrough of the entire UK visa application process, from choosing the right visa to biometrics and decision.',
    href: '/visa-guides/how-to-apply-uk-visa',
    category: 'General',
    icon: '📋',
  },
  {
    title: 'UK Visa Processing Times 2025',
    description: 'Current processing times for every UK visa type, plus tips to speed up your application and when to use priority services.',
    href: '/visa-guides/uk-visa-processing-times',
    category: 'General',
    icon: '⏱️',
  },
  {
    title: 'UK Visa Fees and Costs 2025',
    description: 'Complete breakdown of UK visa fees, IHS surcharges, biometric costs, and hidden expenses most applicants miss.',
    href: '/visa-guides/uk-visa-fees-costs',
    category: 'General',
    icon: '💷',
  },
  {
    title: 'TB Test Requirements by Country',
    description: 'Find out if you need a tuberculosis test for your UK visa, which countries are listed, and how to book an approved clinic.',
    href: '/visa-guides/tb-test-requirements-by-country',
    category: 'Medical',
    icon: '🏥',
  },
  {
    title: 'UK Visa Interview Preparation',
    description: 'What to expect in a UK visa interview, common questions asked, how to prepare, and tips from successful applicants.',
    href: '/visa-guides/uk-visa-interview-preparation',
    category: 'Preparation',
    icon: '🎤',
  },
  {
    title: 'Common UK Visa Rejection Reasons',
    description: 'The top reasons UK visa applications get refused and exactly how to avoid each one. Learn from others\' mistakes.',
    href: '/visa-guides/common-visa-rejection-reasons',
    category: 'Preparation',
    icon: '⚠️',
  },
  {
    title: 'UK Visa Timeline Planning Guide',
    description: 'Plan your entire visa journey week by week — from initial research to receiving your decision. Never miss a deadline.',
    href: '/visa-guides/uk-visa-timeline-planning',
    category: 'Planning',
    icon: '📅',
  },
];

export default function VisaGuidesIndex() {
  return (
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
          <Link href="/app/start" className="btn-primary text-sm py-2 px-4">
            Get Your Checklist
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="container-max py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            UK Visa Guides & Checklists
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Free, comprehensive guides to help you navigate every step of your UK visa application. Written using official Home Office guidance, updated for 2025.
          </p>
        </div>
      </header>

      {/* Guides Grid */}
      <section className="container-max pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="group block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{guide.icon}</span>
                <div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{guide.category}</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">{guide.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container-max text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Skip the Research — Get Your Personalised Checklist
          </h2>
          <p className="text-blue-200 mb-8">
            Our free tool asks 5 questions about your situation and generates a complete, personalised document checklist. Takes 3 minutes.
          </p>
          <Link href="/app/start" className="inline-flex items-center gap-2 bg-white text-blue-900 font-semibold py-3.5 px-8 rounded-lg hover:bg-blue-50 transition-colors">
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
  );
}
