'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { useApplicationStore } from '@/lib/store';
import { generateVisaBudPDF, downloadVisaBudPDF } from '@/lib/pdf-export';
import Link from 'next/link';

type PageStatus = 'loading' | 'verified' | 'error';

interface PaymentInfo {
  amount: number | null;
  currency: string;
  email: string | null;
}

// Default checklist data when store has full visa info
function getChecklistForVisa(visaType: string) {
  const checklists: Record<string, any> = {
    spouse: {
      personal: [
        { id: 'passport', label: 'Valid passport (yours and your partner\'s)', tip: 'Must be valid for duration of visa. Include all previous passports.' },
        { id: 'photos', label: 'Passport-style photographs (x2)', tip: '45mm x 35mm, white background, taken within last 6 months.' },
        { id: 'marriage-cert', label: 'Marriage or civil partnership certificate', tip: 'Original document. If not in English, include certified translation.' },
        { id: 'tb-test', label: 'TB test certificate (if applicable)', tip: 'Required if applying from certain countries. Check Gov.uk list.' },
        { id: 'biometrics', label: 'Biometric residence permit (if in UK)', tip: 'Or book biometrics appointment at a UKVCAS centre.' },
      ],
      financial: [
        { id: 'bank-statements', label: '6 months bank statements', tip: 'Showing income meets minimum threshold (£29,000 from April 2024).' },
        { id: 'payslips', label: '6 months payslips', tip: 'Consecutive months from same employer, matching bank credits.' },
        { id: 'employer-letter', label: 'Employer confirmation letter', tip: 'On letterhead: job title, salary, start date, confirm ongoing.' },
        { id: 'p60', label: 'Most recent P60', tip: 'Or tax return if self-employed.' },
      ],
      supporting: [
        { id: 'relationship-evidence', label: 'Evidence of genuine relationship', tip: 'Photos, messages, travel together, joint finances, correspondence.' },
        { id: 'accommodation', label: 'Proof of accommodation', tip: 'Tenancy agreement, mortgage statement, or council letter.' },
        { id: 'english-test', label: 'English language test certificate', tip: 'IELTS Life Skills A1 or equivalent. Some nationalities exempt.' },
        { id: 'cover-letter', label: 'Cover letter / personal statement', tip: 'Summarise your relationship history and application.' },
      ],
    },
    skilled_worker: {
      personal: [
        { id: 'passport', label: 'Valid passport', tip: 'Must be valid for your intended stay period.' },
        { id: 'photos', label: 'Passport-style photographs (x2)', tip: '45mm x 35mm, white background, taken within last 6 months.' },
        { id: 'tb-test', label: 'TB test certificate (if applicable)', tip: 'Required if applying from certain countries.' },
        { id: 'cos', label: 'Certificate of Sponsorship (CoS) reference number', tip: 'Provided by your employer/sponsor.' },
      ],
      financial: [
        { id: 'bank-statements', label: 'Bank statements showing £1,270 held for 28 days', tip: 'Unless employer certifies maintenance on CoS.' },
        { id: 'cos-salary', label: 'Evidence of salary meeting threshold', tip: 'General threshold: £38,700 (or going rate for your occupation).' },
      ],
      supporting: [
        { id: 'qualifications', label: 'Degree/qualification certificates', tip: 'With ENIC statement if obtained outside UK.' },
        { id: 'english-test', label: 'English language evidence', tip: 'IELTS, national of majority English-speaking country, or UK degree.' },
        { id: 'criminal-record', label: 'Criminal record certificate', tip: 'From any country you\'ve lived in 12+ months in last 10 years.' },
      ],
    },
    citizenship: {
      personal: [
        { id: 'passport', label: 'Current and previous passports', tip: 'All passports held during qualifying residence period.' },
        { id: 'brp', label: 'Biometric Residence Permit', tip: 'Current valid BRP.' },
        { id: 'photos', label: 'Passport-style photographs (x2)', tip: '45mm x 35mm, white background.' },
        { id: 'birth-cert', label: 'Birth certificate', tip: 'With certified translation if not in English.' },
      ],
      financial: [
        { id: 'bank-statements', label: 'Bank statements (evidence of UK ties)', tip: 'Shows UK financial activity during residence.' },
        { id: 'council-tax', label: 'Council tax bills', tip: 'For each year of qualifying residence.' },
      ],
      supporting: [
        { id: 'life-in-uk', label: 'Life in the UK test pass certificate', tip: 'Must be passed before application date.' },
        { id: 'english-test', label: 'English language qualification', tip: 'B1 CEFR level or higher, or degree taught in English.' },
        { id: 'referees', label: 'Two referees (details)', tip: 'Must have known you 3+ years, one must be professional.' },
        { id: 'travel-history', label: 'Travel history for qualifying period', tip: 'List all trips outside UK; must not exceed absence limits.' },
      ],
    },
  };

  return checklists[visaType] || checklists.spouse;
}

function getTimelineForVisa(visaType: string) {
  const timelines: Record<string, any[]> = {
    spouse: [
      { week: 'Week 1-2', label: 'Gather personal documents', detail: 'Passport, marriage certificate, photos, TB test if needed.' },
      { week: 'Week 2-3', label: 'Prepare financial evidence', detail: 'Bank statements, payslips, employer letter. Ensure 6-month history.' },
      { week: 'Week 3-4', label: 'Compile relationship evidence', detail: 'Photos together, messages, shared finances, accommodation proof.' },
      { week: 'Week 4', label: 'English language test', detail: 'Book and sit IELTS Life Skills A1 (if not exempt).' },
      { week: 'Week 5', label: 'Submit online application', detail: 'Complete form on Gov.uk, pay fees, book biometrics.' },
      { week: 'Week 5-6', label: 'Biometrics appointment', detail: 'Attend UKVCAS centre with documents.' },
      { week: 'Week 6-18', label: 'Home Office processing', detail: 'Standard: 12 weeks. Priority: 5 working days (extra fee).' },
    ],
    skilled_worker: [
      { week: 'Week 1', label: 'Receive Certificate of Sponsorship', detail: 'Employer provides CoS reference number.' },
      { week: 'Week 1-2', label: 'Gather documents', detail: 'Passport, qualifications, criminal records, English evidence.' },
      { week: 'Week 2', label: 'Financial evidence', detail: 'Bank statements showing £1,270 (or employer certification).' },
      { week: 'Week 3', label: 'Submit application', detail: 'Online via Gov.uk, pay IHS surcharge and fees.' },
      { week: 'Week 3-4', label: 'Biometrics', detail: 'Attend appointment at visa centre.' },
      { week: 'Week 4-7', label: 'Processing', detail: 'Standard: 3 weeks. Priority available.' },
    ],
    citizenship: [
      { week: 'Week 1-2', label: 'Check eligibility', detail: 'Verify residence requirements, absence limits, good character.' },
      { week: 'Week 2-3', label: 'Life in the UK test', detail: 'Book and pass if not already done.' },
      { week: 'Week 3-4', label: 'Gather documents', detail: 'Passports, BRP, birth certificate, referees, travel history.' },
      { week: 'Week 4-5', label: 'Submit AN application', detail: 'Online or paper form with fee (£1,580).' },
      { week: 'Week 5-30', label: 'Processing', detail: 'Standard: 6 months. No priority service available.' },
      { week: 'After approval', label: 'Citizenship ceremony', detail: 'Attend ceremony within 3 months of approval.' },
    ],
  };

  return timelines[visaType] || timelines.spouse;
}

function getRisksForAnswers(answers: any) {
  const risks: any[] = [];

  if (answers.annualIncomeRange === '0-15k') {
    risks.push({
      level: 'high',
      title: 'Income below minimum threshold',
      detail: 'The minimum income requirement for most UK visas is significantly higher. Consider alternative evidence of financial support or savings.',
    });
  } else if (answers.annualIncomeRange === '15-30k') {
    risks.push({
      level: 'medium',
      title: 'Income may be borderline',
      detail: 'Depending on your visa type, you may need to provide additional financial evidence. Consider including savings as supplementary evidence.',
    });
  }

  if (answers.currentlyInUk === false && answers.visaType === 'spouse') {
    risks.push({
      level: 'medium',
      title: 'Applying from outside the UK',
      detail: 'Processing times may be longer when applying from abroad. Ensure your TB test is valid for your country of application.',
    });
  }

  if (answers.urgency === 'urgent') {
    risks.push({
      level: 'medium',
      title: 'Tight timeline',
      detail: 'Standard processing takes 8-12 weeks. Consider priority processing (additional fee) if available for your visa type.',
    });
  }

  if (answers.relationshipDurationMonths && answers.relationshipDurationMonths < 24) {
    risks.push({
      level: 'medium',
      title: 'Shorter relationship duration',
      detail: 'Relationships under 2 years may face additional scrutiny. Ensure you have strong evidence of a genuine and subsisting relationship.',
    });
  }

  return risks;
}

export default function SuccessPage() {
  return (
    <AuthGate>
      <SuccessContent />
    </AuthGate>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<PageStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const store = useApplicationStore();

  // Wait for Zustand to restore from localStorage before reading wizard answers
  const [storeHydrated, setStoreHydrated] = useState(useApplicationStore.persist.hasHydrated());
  useEffect(() => {
    if (storeHydrated) return;
    const unsub = useApplicationStore.persist.onFinishHydration(() => {
      setStoreHydrated(true);
    });
    if (useApplicationStore.persist.hasHydrated()) {
      setStoreHydrated(true);
    }
    return unsub;
  }, [storeHydrated]);

  // Verify the Stripe session on mount
  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('No payment session found. Please try your purchase again.');
      return;
    }

    async function verifySession() {
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setStatus('error');
          setErrorMessage(
            data.error === 'Payment not completed'
              ? 'Your payment hasn\'t been confirmed yet. Please wait a moment and refresh, or contact support.'
              : 'We couldn\'t verify your payment. Please contact support with your session ID.'
          );
          return;
        }

        setPayment({
          amount: data.payment.amount,
          currency: data.payment.currency,
          email: data.payment.email,
        });
        // Unlock the dashboard content
        store.setUnlocked(true);
        setStatus('verified');
      } catch (err) {
        console.error('Session verification error:', err);
        setStatus('error');
        setErrorMessage('Something went wrong verifying your payment. Please try refreshing or contact support.');
      }
    }

    verifySession();
  }, [sessionId]);

  // Handle PDF download
  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const visaType = store.visaType || 'spouse';
      const visaLabel = visaType.replace('_', '-');

      const checklist = getChecklistForVisa(visaType);
      const timeline = getTimelineForVisa(visaType);
      const risks = getRisksForAnswers({
        annualIncomeRange: store.annualIncomeRange,
        currentlyInUk: store.currentlyInUk,
        urgency: store.urgency,
        relationshipDurationMonths: store.relationshipDurationMonths,
        visaType: store.visaType,
      });

      const blob = await generateVisaBudPDF({
        visa: visaLabel,
        answers: {
          nationality: store.nationality,
          location: store.currentlyInUk ? 'Currently in the UK' : 'Outside the UK',
        },
        checklist,
        risks,
        timeline,
      });

      const today = new Date().toISOString().split('T')[0];
      const filename = `VisaBud-${visaLabel}-${today}.pdf`;

      downloadVisaBudPDF(filename, blob);
      setDownloadComplete(true);
    } catch (err) {
      console.error('PDF generation error:', err);
      setErrorMessage('PDF generation failed. Please try again or contact support.');
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, store]);

  // --- LOADING STATE ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Verifying your payment…</h2>
          <p className="text-slate-500 text-sm">This only takes a moment.</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h1>
          <p className="text-slate-600 mb-6">{errorMessage}</p>

          {sessionId && (
            <p className="text-xs text-slate-400 mb-6 font-mono break-all">
              Session: {sessionId}
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="block w-full py-3 px-6 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </Link>
            <a
              href="mailto:support@visabud.co.uk"
              className="block text-sm text-blue-600 hover:text-blue-800 mt-4"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Hero */}
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Animated checkmark */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-600 mb-2">
            Your VisaBud Full Pack is unlocked.
          </p>
          {payment && (
            <p className="text-sm text-slate-400">
              {payment.currency} {payment.amount?.toFixed(2)} paid
              {payment.email && <> · Confirmation sent to <strong>{payment.email}</strong></>}
            </p>
          )}
        </div>
      </div>

      {/* Download Card */}
      <div className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">📄</span>
              <h2 className="text-xl font-bold text-slate-900">Your PDF is Ready</h2>
              <p className="text-sm text-slate-500 mt-1">
                Personalised checklist, timeline, and risk assessment
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                downloadComplete
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : isDownloading
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {isDownloading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF…
                </span>
              ) : downloadComplete ? (
                '✓ Downloaded — Click to Download Again'
              ) : (
                '📥 Download My Application Pack'
              )}
            </button>

            {downloadComplete && (
              <p className="text-center text-sm text-green-600 mt-3 font-medium">
                Check your Downloads folder!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              🚀 What&apos;s Next?
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: '📋',
                  title: 'Review your checklist',
                  desc: 'Open the PDF and tick off documents you already have. Focus on gaps first.',
                },
                {
                  icon: '📅',
                  title: 'Book your biometrics',
                  desc: 'Visit UKVCAS to schedule your appointment before submitting online.',
                  link: 'https://www.ukvcas.co.uk',
                  linkText: 'Book at UKVCAS →',
                },
                {
                  icon: '📝',
                  title: 'Start your Gov.uk application',
                  desc: 'Use our timeline as a guide. Have all documents scanned and ready.',
                  link: 'https://www.gov.uk/apply-to-come-to-the-uk',
                  linkText: 'Go to Gov.uk →',
                },
                {
                  icon: '💬',
                  title: 'Need help? We\'re here',
                  desc: 'If you\'re stuck on anything, reach out and we\'ll point you in the right direction.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600 mt-0.5">{item.desc}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1 inline-block"
                      >
                        {item.linkText}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-16">
        <div className="max-w-lg mx-auto space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-6 bg-slate-900 text-white text-center rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </Link>

          <a
            href="mailto:support@visabud.co.uk"
            className="block w-full py-3 px-6 border border-slate-300 text-slate-700 text-center rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-slate-200 bg-slate-50 py-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-slate-500">
            ⚠️ VisaBud is a guidance tool, not legal advice. Always verify with official{' '}
            <a href="https://www.gov.uk" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Gov.uk
            </a>{' '}
            guidance before submitting your application.
          </p>
        </div>
      </div>
    </div>
  );
}
