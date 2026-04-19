'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/lib/auth-context';
import { useApplicationStore } from '@/lib/store';
import {
  CHECKLISTS,
  TIMELINES,
  getApplicableRisks,
  getChecklistByCategory,
  ChecklistItem,
  Priority,
  TimelineWeek,
  RiskRule,
  UrgencyKey,
  VisaTypeKey,
  DocumentCategory,
} from '@/lib/visa-data';
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  ChevronDown,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Lock,
  Download,
  Mail,
  BookOpen,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle,
  Info,
  CreditCard,
  PartyPopper,
  ArrowRight,
  Users,
  Zap,
  Star,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PaywallModal from '@/components/PaywallModal';
import PaymentSuccessBanner from '@/components/PaymentSuccessBanner';
import DocumentUpload from '@/components/DocumentUpload';
import TierFeatureButtons from '@/components/TierFeatureButtons';
import AIReportModal from '@/components/AIReportModal';
import TemplatesGallery from '@/components/TemplatesGallery';
import GetTemplateButton from '@/components/GetTemplateButton';
import type { AIReportData } from '@/lib/store';
import { getTemplateForItem } from '@/lib/template-mapping';
import { PageFadeIn, FadeIn, ConfettiBurst, CelebrationBanner } from '@/lib/animations';
// PurchasedTier type used via store

// ─── Types ──────────────────────────────────────────────────────────────────

type TabId = 'checklist' | 'timeline' | 'risks' | 'templates' | 'submit';

const TABS: { id: TabId; label: string; icon: typeof FileText; color: string }[] = [
  { id: 'checklist', label: 'Checklist', icon: FileText, color: 'text-blue-600' },
  { id: 'timeline', label: 'Timeline', icon: Calendar, color: 'text-emerald-600' },
  { id: 'risks', label: 'Risks', icon: AlertCircle, color: 'text-amber-600' },
  { id: 'templates', label: 'Templates', icon: FileText, color: 'text-indigo-600' },
  { id: 'submit', label: 'Submit', icon: CheckCircle, color: 'text-violet-600' },
];

const VISA_LABELS: Record<string, string> = {
  spouse: 'Spouse / Partner Visa',
  skilled_worker: 'Skilled Worker Visa',
  citizenship: 'British Citizenship',
};

const URGENCY_LABELS: Record<string, string> = {
  urgent: 'Urgent (within 4 weeks)',
  normal: 'Standard (1–3 months)',
  ahead: 'Planning ahead (3+ months)',
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; ring: string }> = {
  critical: { label: 'Critical', color: 'text-red-700', bg: 'bg-red-50', ring: 'ring-red-200' },
  important: { label: 'Important', color: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200' },
  'nice-to-have': { label: 'Nice to Have', color: 'text-gray-600', bg: 'bg-gray-50', ring: 'ring-gray-200' },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof ShieldAlert }> = {
  high: { label: 'High', color: 'text-red-700', bg: 'bg-red-50', icon: ShieldAlert },
  medium: { label: 'Medium', color: 'text-amber-700', bg: 'bg-amber-50', icon: Shield },
  low: { label: 'Low', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: ShieldCheck },
};

const CATEGORY_CONFIG: Record<DocumentCategory, { label: string; icon: string }> = {
  personal: { label: 'Personal Documents', icon: '📋' },
  financial: { label: 'Financial Evidence', icon: '💰' },
  supporting: { label: 'Supporting Evidence', icon: '📎' },
};

/**
 * Determine if a checklist item is not applicable based on the user's onboarding answers.
 * Returns null if applicable, or a reason string if N/A.
 */
function getItemNotApplicableReason(
  itemId: string,
  visaType: string | null,
  annualIncomeRange: string | null,
  employmentStatus: string | null,
): string | null {
  // Spouse visa: savings not needed if income meets threshold
  if (itemId === 'sp-savings-evidence' && annualIncomeRange === 'over29k') {
    return 'Not required — your sponsor\'s income meets the £29,000 threshold';
  }

  // Spouse visa: self-employment evidence only if self-employed
  if (itemId === 'sp-self-employed-accounts' && employmentStatus && employmentStatus !== 'self-employed') {
    return 'Not required — only needed if your sponsor is self-employed';
  }

  // Skilled worker: maintenance funds not needed if employer certifies
  // (We can't auto-detect this, so we don't mark it N/A — user decides)

  return null;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AuthGate>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-200" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </AuthGate>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const store = useApplicationStore();
  const { visaType, currentStep, unlocked, setUnlocked, setPurchasedTier, setUserEmail } = store;
  const searchParams = useSearchParams();
  const isPaymentReturn = searchParams.get('payment') === 'success';
  const tierParam = searchParams.get('tier');

  useEffect(() => {
    if (user?.email) setUserEmail(user.email);
  }, [user, setUserEmail]);

  // Wait for Zustand persist middleware to finish restoring from localStorage.
  // Without this, the store has default (empty) values on first render,
  // causing hasCompletedWizard to be false and showing FreemiumWelcomeDashboard
  // even when the user completed the wizard before payment redirect.
  const [hydrated, setHydrated] = useState(useApplicationStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    
    // Fallback: force hydration after 2 seconds if onFinishHydration doesn't fire
    const timeoutId = setTimeout(() => {
      setHydrated(true);
      console.warn('Hydration timeout: forcing render after 2s');
    }, 2000);
    
    const unsub = useApplicationStore.persist.onFinishHydration(() => {
      clearTimeout(timeoutId);
      setHydrated(true);
    });
    // In case hydration already finished between useState and useEffect
    if (useApplicationStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, [hydrated]);

  // Check unlock status — runs on mount AND polls when returning from payment
  useEffect(() => {
    let pollCount = 0;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    async function checkUnlockStatus(): Promise<boolean> {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Get user record by auth_id
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .maybeSingle();
        
        if (userData) {
          // Check payments table for completed payment - get highest tier
          const { data: payments } = await supabase
            .from('payments')
            .select('id, amount_pence, product_type')
            .eq('user_id', userData.id)
            .eq('payment_status', 'completed')
            .order('amount_pence', { ascending: false })
            .limit(1);
          
          if (payments && payments.length > 0) {
            setUnlocked(true);
            // Use tier column from payments table (source of truth from webhook)
            // Fallback to inferring from amount if tier column doesn't exist
            const storedTier = payments[0].tier;
            if (storedTier) {
              setPurchasedTier(storedTier);
            } else {
              // Fallback: infer from amount (for backwards compat with old payments)
              const amount = payments[0].amount_pence || 0;
              if (amount >= 29900 || amount === 33) {
                setPurchasedTier('expert');
              } else if (amount >= 14900 || amount === 32 || amount === 2) {
                setPurchasedTier('premium');
              } else {
                setPurchasedTier('standard');
              }
            }
            return true;
          }
        }

        // Also set tier from URL param if returning from payment
        if (tierParam) {
          const validTiers = ['standard', 'premium', 'expert'] as const;
          if (validTiers.includes(tierParam as any)) {
            setPurchasedTier(tierParam as any);
          }
        }

        return false;
      } catch (err) {
        // No payment found or query error — user stays on free tier (not an error)
        return false;
      }
    }

    // Initial check
    checkUnlockStatus().then((found) => {
      // If returning from payment and not yet unlocked, poll for webhook completion
      if (isPaymentReturn && !found && !unlocked) {
        const poll = async () => {
          pollCount++;
          const unlockFound = await checkUnlockStatus();
          if (!unlockFound && pollCount < 10) {
            // Poll every 2 seconds for up to 20 seconds
            pollTimer = setTimeout(poll, 2000);
          }
        };
        pollTimer = setTimeout(poll, 2000);
      }
    });

    return () => {
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [setUnlocked, setPurchasedTier, isPaymentReturn, unlocked, tierParam]);

  const [showPaywall, setShowPaywall] = useState(false);

  const hasCompletedWizard = currentStep >= 5 && visaType && visaType !== 'unsure';

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-200" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // If wizard not completed, show the freemium welcome dashboard
  if (!hasCompletedWizard) {
    return (
      <>
        <PaymentSuccessBanner />
        <FreemiumWelcomeDashboard
          showPaywall={showPaywall}
          setShowPaywall={setShowPaywall}
          unlocked={unlocked}
        />
      </>
    );
  }

  // Full dashboard for users who completed the wizard
  return (
    <>
      <PaymentSuccessBanner />
      <FullDashboard
        store={store}
        showPaywall={showPaywall}
        setShowPaywall={setShowPaywall}
      />
    </>
  );
}

// ─── Freemium Welcome Dashboard (NEW) ──────────────────────────────────────

function FreemiumWelcomeDashboard({
  showPaywall,
  setShowPaywall,
}: {
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;
  unlocked: boolean;
}) {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  // Sample preview data for free tier
  const previewChecklist = [
    { id: 'preview-1', title: 'Valid passport', desc: 'Current passport with at least 6 months validity remaining' },
    { id: 'preview-2', title: 'Passport-sized photos', desc: '2 recent photos meeting UK visa photo requirements' },
    { id: 'preview-3', title: 'Completed application form', desc: 'Online VAF form — make sure all sections are filled accurately' },
    { id: 'preview-4', title: 'TB test certificate', desc: 'Required if applying from a listed country' },
    { id: 'preview-5', title: 'English language certificate', desc: 'IELTS Life Skills A1 or equivalent for spouse visa' },
    { id: 'preview-6', title: 'Proof of relationship', desc: 'Photos, correspondence, travel tickets together' },
    { id: 'preview-7', title: 'Financial evidence', desc: 'Bank statements, payslips, employment letter' },
    { id: 'preview-8', title: 'Accommodation details', desc: 'Tenancy agreement or mortgage statement' },
    { id: 'preview-9', title: 'Biometric enrolment', desc: 'Book appointment at visa application centre' },
    { id: 'preview-10', title: 'Cover letter', desc: 'Summarise your application and circumstances' },
  ];

  const previewTimeline = [
    { week: 1, title: 'Gather core documents', desc: 'Passport, photos, TB test booking' },
    { week: 2, title: 'Financial evidence', desc: 'Collect bank statements and payslips' },
    { week: 3, title: 'Complete application form', desc: 'Fill in the online VAF form' },
  ];

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">V</span>
              </div>
              <span className="font-bold text-blue-900 tracking-tight text-lg hidden sm:inline">VisaBud</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                Free Plan
              </span>
              <button
                onClick={() => setShowPaywall(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all btn-hover"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unlock Premium</span>
                <span className="sm:hidden">Upgrade</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-8">
          {/* Welcome Header */}
          <FadeIn>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                    Welcome, {firstName}! 👋
                  </h1>
                  <p className="text-gray-500 mb-4">
                    Your UK visa checklist is ready. Here&apos;s a preview of what we&apos;ve prepared for you.
                  </p>
                  <Link
                    href="/app/start"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all btn-hover"
                  >
                    Personalise Your Checklist
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 self-start">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">94%</p>
                    <p className="text-xs text-blue-600 font-medium">Avg success rate</p>
                  </div>
                  <div className="w-px h-10 bg-blue-200" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900">247</p>
                    <p className="text-xs text-blue-600 font-medium">Couples this month</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Free preview banner */}
          <FadeIn delay={0.05}>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">You&apos;re viewing a free preview.</span>{' '}
                <button onClick={() => setShowPaywall(true)} className="text-amber-900 underline hover:no-underline font-semibold">
                  Unlock Premium
                </button>{' '}
                for the full checklist, detailed timeline, and personalised risk assessment.
              </p>
            </div>
          </FadeIn>

          {/* Preview Checklist */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Document Checklist</h3>
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    Preview
                  </span>
                </div>
                <span className="text-xs text-gray-400">10 of ~30 documents shown</span>
              </div>
              <div className="divide-y divide-gray-50">
                {previewChecklist.map((item) => (
                  <div key={item.id} className="px-5 sm:px-6 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                    <Square className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Locked indicator */}
              <div className="px-5 sm:px-6 py-4 bg-gradient-to-t from-amber-50 to-white border-t border-gray-100">
                <button
                  onClick={() => setShowPaywall(true)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-sm transition-all btn-hover"
                >
                  <Lock className="w-4 h-4" />
                  See Full Checklist — ~20 more documents
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Preview Timeline */}
          <FadeIn delay={0.15}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-900">Application Timeline</h3>
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    First 3 milestones
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {previewTimeline.map((item) => (
                  <div key={item.week} className="px-5 sm:px-6 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.week}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 sm:px-6 py-3 bg-emerald-50/50 border-t border-gray-100 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">Unlock Premium for the full week-by-week action plan</span>
              </div>
            </div>
          </FadeIn>

          {/* Risk Assessment Summary */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">Risk Assessment</h3>
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    Summary
                  </span>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5">
                <p className="text-sm text-gray-600 mb-4">
                  Common risks are flagged based on your visa type and circumstances. Complete the quick questionnaire to get a personalised assessment.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Financial threshold', severity: 'high', desc: 'Income requirements vary by visa type' },
                    { label: 'Document formatting', severity: 'medium', desc: 'Incorrect formats cause delays' },
                    { label: 'Timeline planning', severity: 'low', desc: 'Processing times vary seasonally' },
                  ].map((risk) => (
                    <div key={risk.label} className={`rounded-xl p-3 border ${
                      risk.severity === 'high' ? 'bg-red-50 border-red-200' :
                      risk.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                      'bg-emerald-50 border-emerald-200'
                    }`}>
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                        risk.severity === 'high' ? 'text-red-700' :
                        risk.severity === 'medium' ? 'text-amber-700' :
                        'text-emerald-700'
                      }`}>{risk.severity} risk</p>
                      <p className="text-sm font-semibold text-gray-900">{risk.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{risk.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-700">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="font-medium">Unlock for detailed risk analysis with specific recommendations</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* CTA Section */}
          <FadeIn delay={0.25}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Personalise CTA */}
              <Link
                href="/app/start"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Personalise Your Plan</h3>
                <p className="text-sm text-gray-500 mb-3">Answer 5 quick questions to get a checklist tailored to your exact situation.</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Start questionnaire <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              {/* Upgrade CTA */}
              <button
                onClick={() => setShowPaywall(true)}
                className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-1">Unlock Premium</h3>
                <p className="text-sm text-emerald-100 mb-3">Full checklist, detailed timeline, AI document verification, and expert support.</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                  See all features <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </FadeIn>

          {/* Social proof */}
          <FadeIn delay={0.3}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Trusted by thousands</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-900">1,000+</p>
                  <p className="text-xs text-gray-500">Applicants guided</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">94%</p>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">4.8★</p>
                  <p className="text-xs text-gray-500">Average rating</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic">
                &ldquo;VisaBud told me exactly what I needed. Got my spouse visa approved first time.&rdquo;
                <span className="text-gray-400 not-italic"> — Priya S.</span>
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="sm:hidden sticky-bottom-mobile">
          <button
            onClick={() => setShowPaywall(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all btn-hover"
          >
            <Zap className="w-4 h-4" />
            Unlock Premium — See All Features
          </button>
        </div>

        <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} visaType="UK Visa" />
      </div>
    </PageFadeIn>
  );
}

// ─── Full Dashboard (existing, for users who completed wizard) ─────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FullDashboard({
  store,
  showPaywall,
  setShowPaywall,
}: {
  store: any;
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;
}) {
  const { visaType, urgency, annualIncomeRange, employmentStatus, currentlyInUk, relationshipDurationMonths, unlocked, purchasedTier, hasPreviousRefusal, hasPreviousOverstay } = store;

  const [activeTab, setActiveTab] = useState<TabId>('checklist');

  useEffect(() => {
    if (unlocked) setActiveTab('checklist');
  }, [unlocked]);

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('VisaBud_checked_docs');
        return saved ? JSON.parse(saved) : {};
      } catch { return {}; }
    }
    return {};
  });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });

  const validVisaType = (visaType && visaType !== 'unsure' ? visaType : null) as VisaTypeKey | null;
  const validUrgency = urgency as UrgencyKey | null;

  const checklist = validVisaType ? (CHECKLISTS[validVisaType] || []) : [];
  const checklistByCategory = validVisaType ? getChecklistByCategory(validVisaType) : { personal: [], financial: [], supporting: [] };
  const timeline = validUrgency ? (TIMELINES[validUrgency] || []) : [];
  const risks = useMemo(
    () =>
      validVisaType
        ? getApplicableRisks({
            visaType: validVisaType,
            incomeRange: annualIncomeRange || undefined,
            urgency: validUrgency || undefined,
            currentlyInUk: currentlyInUk ?? undefined,
            relationshipDurationMonths: relationshipDurationMonths ?? undefined,
            employmentStatus: undefined,
            hasPreviousRefusal: hasPreviousRefusal ?? undefined,
            hasPreviousOverstay: hasPreviousOverstay ?? undefined,
          })
        : [],
    [validVisaType, annualIncomeRange, validUrgency, currentlyInUk, relationshipDurationMonths, hasPreviousRefusal, hasPreviousOverstay]
  );

  const visaLabel = VISA_LABELS[visaType || ''] || visaType || '';
  const urgencyLabel = urgency ? URGENCY_LABELS[urgency] : 'Not set';

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('VisaBud_checked_docs', JSON.stringify(updated));
      }
      return updated;
    });
  };
  // Exclude N/A items from progress calculation
  const applicableChecklist = checklist.filter((d) => !getItemNotApplicableReason(d.id, visaType, annualIncomeRange, employmentStatus));
  const checkedCount = applicableChecklist.filter((d) => checkedDocs[d.id]).length;
  const progressPct = applicableChecklist.length > 0 ? Math.round((checkedCount / applicableChecklist.length) * 100) : 0;

  const grouped: Record<Priority, ChecklistItem[]> = { critical: [], important: [], 'nice-to-have': [] };
  checklist.forEach((item) => {
    if (grouped[item.priority]) grouped[item.priority].push(item);
  });

  const toggleWeek = (week: number) => setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  const highRisks = risks.filter((r) => r.severity === 'high').length;

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* ── Nav ──────────────────────────────────────────────────────── */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">V</span>
              </div>
              <span className="font-bold text-blue-900 tracking-tight text-lg hidden sm:inline">VisaBud</span>
            </Link>
            <div className="flex items-center gap-3">
              {unlocked ? (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  purchasedTier === 'expert' ? 'bg-violet-50 text-violet-700' :
                  purchasedTier === 'premium' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {purchasedTier === 'expert' ? 'Expert' : purchasedTier === 'premium' ? 'Premium' : 'Standard'}
                </span>
              ) : (
                <button
                  onClick={() => setShowPaywall(true)}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all btn-hover animate-emeraldGlow"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Unlock Full Pack
                </button>
              )}
              <Link href="/app/start" className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">
                Edit Answers
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-8">
          {/* ── Header Card ──────────────────────────────────────────── */}
          <FadeIn>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Your Personalised Plan</h1>
                    {!unlocked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">
                    {visaLabel} &middot; {urgencyLabel}
                  </p>
                </div>
                {highRisks > 0 && (
                  <button
                    onClick={() => setActiveTab('risks')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-100 transition-all animate-pulse-ring self-start btn-hover"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {highRisks} high-risk alert{highRisks > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Tier Feature Buttons — visible to all tiers */}
          {unlocked && (
            <FadeIn delay={0.04}>
              <div className="mb-6">
                <TierFeatureButtons purchasedTier={purchasedTier} onUpgrade={() => setShowPaywall(true)} />
              </div>
            </FadeIn>
          )}

          {/* Premium Upgrade Banner — shown to Standard/Free users */}
          {!unlocked && (
            <FadeIn delay={0.05}>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-emerald-900 mb-1">🚀 Unlock Premium</h3>
                  <p className="text-sm text-emerald-700">
                    Get <strong>19 professional templates</strong>, <strong>AI document analysis</strong>, full timeline, and complete risk assessment.
                  </p>
                </div>
                <button
                  onClick={() => setShowPaywall(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
                >
                  See Plans
                </button>
              </div>
            </FadeIn>
          )}

          {/* ── Tab Navigation ────────────────────────────────────────── */}
          <div className="flex gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 touch-target ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-sm border border-gray-200 scale-[1.02]'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-gray-400'} transition-colors`} />
                  <span className={isActive ? 'text-sm sm:text-base' : ''}>{tab.label}</span>
                  {tab.id === 'risks' && highRisks > 0 && (
                    <span className="ml-0.5 w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">
                      {highRisks}
                    </span>
                  )}
                  {tab.id === 'checklist' && (
                    <span className="ml-0.5 text-xs text-gray-400 font-normal">
                      {checkedCount}/{checklist.length}
                    </span>
                  )}
                  {!unlocked && tab.id !== 'submit' && (
                    <Lock className="w-3 h-3 text-amber-500 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Tab Content with animation ────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="min-h-[500px]"
            >
              {activeTab === 'checklist' && (
                <ChecklistTab
                  grouped={grouped}
                  byCategory={checklistByCategory}
                  checkedDocs={checkedDocs}
                  toggleDoc={toggleDoc}
                  checkedCount={checkedCount}
                  total={checklist.length}
                  progressPct={progressPct}
                  unlocked={unlocked}
                  onUnlock={() => setShowPaywall(true)}
                />
              )}
              {activeTab === 'timeline' && (
                <TimelineTab
                  weeks={timeline}
                  expanded={expandedWeeks}
                  toggle={toggleWeek}
                  unlocked={unlocked}
                  onUnlock={() => setShowPaywall(true)}
                />
              )}
              {activeTab === 'risks' && (
                <RisksTab risks={risks} unlocked={unlocked} onUnlock={() => setShowPaywall(true)} />
              )}
              {activeTab === 'templates' && (
                <TemplatesGallery isPremium={unlocked} onClose={() => setActiveTab('checklist')} />
              )}
              {activeTab === 'submit' && (
                <SubmitTab
                  visaLabel={visaLabel}
                  urgencyLabel={urgencyLabel}
                  checkedCount={checkedCount}
                  total={checklist.length}
                  riskCount={risks.length}
                  highRisks={highRisks}
                  onUnlock={() => setShowPaywall(true)}
                  unlocked={unlocked}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Sticky Unlock Button */}
        {!unlocked && (
          <div className="sm:hidden sticky-bottom-mobile">
            <button
              onClick={() => setShowPaywall(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all btn-hover"
            >
              <Lock className="w-4 h-4" />
              Unlock Full Pack
            </button>
          </div>
        )}

        <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} visaType={visaLabel} />
      </div>
    </PageFadeIn>
  );
}

// ─── Locked Section Banner ──────────────────────────────────────────────────

function LockedSectionBanner({ message, onUnlock }: { message: string; onUnlock: () => void }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">🔒 Locked</p>
          <p className="text-sm text-amber-700">{message}</p>
        </div>
      </div>
      <button
        onClick={onUnlock}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all btn-hover flex-shrink-0 w-full sm:w-auto justify-center"
      >
        <Lock className="w-3.5 h-3.5" />
        Unlock Full Pack
      </button>
    </div>
  );
}

// ─── Checklist Tab ──────────────────────────────────────────────────────────

function ChecklistTab({
  grouped,
  byCategory,
  checkedDocs,
  toggleDoc,
  checkedCount,
  total,
  progressPct,
  unlocked,
  onUnlock,
}: {
  grouped: Record<Priority, ChecklistItem[]>;
  byCategory: Record<DocumentCategory, ChecklistItem[]>;
  checkedDocs: Record<string, boolean>;
  toggleDoc: (id: string) => void;
  checkedCount: number;
  total: number;
  progressPct: number;
  unlocked: boolean;
  onUnlock: () => void;
}) {
  const { documentUploads, documentReports } = useApplicationStore();
  const verifiedCount = Object.values(documentUploads).filter((u) => u.status === 'valid').length;

  // Risk-aware completion analysis
  const reportValues = Object.values(documentReports);
  const hasAnyReports = reportValues.length > 0;
  const highRiskDocs = reportValues.filter((r) => r.confidence <= 40).length;
  const mediumRiskDocs = reportValues.filter((r) => r.confidence > 40 && r.confidence <= 70).length;

  const getCompletionMessage = () => {
    if (highRiskDocs > 0) {
      return {
        bg: 'bg-red-50 border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        icon: '🔴',
        title: `Checklist complete, but ${highRiskDocs} document${highRiskDocs > 1 ? 's have' : ' has'} critical issues`,
        subtitle: 'Do not submit until flagged documents are resolved. Review the items marked with red risk scores.',
        titleColor: 'text-red-900',
        subtitleColor: 'text-red-700',
      };
    }
    if (mediumRiskDocs > 0) {
      return {
        bg: 'bg-amber-50 border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: '⚠️',
        title: `Checklist complete, but ${mediumRiskDocs} document${mediumRiskDocs > 1 ? 's need' : ' needs'} attention`,
        subtitle: 'These issues could delay your application. Review flagged items before submitting.',
        titleColor: 'text-amber-900',
        subtitleColor: 'text-amber-700',
      };
    }
    if (hasAnyReports) {
      return {
        bg: 'bg-emerald-50 border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        icon: '🎉',
        title: 'Your checklist is complete and your documents look strong!',
        subtitle: 'Review your timeline and submit when ready.',
        titleColor: 'text-emerald-900',
        subtitleColor: 'text-emerald-700',
      };
    }
    // No AI review done
    return {
      bg: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: '📋',
      title: 'Your checklist is complete!',
      subtitle: 'Consider uploading your documents for AI verification to catch issues before you submit.',
      titleColor: 'text-blue-900',
      subtitleColor: 'text-blue-700',
    };
  };

  if (unlocked) {
    const completionMsg = getCompletionMessage();

    return (
      <div className="space-y-6">
        <ProgressCard checkedCount={checkedCount} total={total} progressPct={progressPct} verifiedCount={verifiedCount} />

        {/* Risk-aware completion message */}
        <CelebrationBanner show={progressPct === 100}>
          <div className={`${completionMsg.bg} border rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${completionMsg.iconBg} flex items-center justify-center flex-shrink-0 animate-bounceIn`}>
              <span className="text-2xl">{completionMsg.icon}</span>
            </div>
            <div>
              <h3 className={`font-bold ${completionMsg.titleColor} text-lg`}>{completionMsg.title}</h3>
              <p className={`text-sm ${completionMsg.subtitleColor}`}>{completionMsg.subtitle}</p>
            </div>
          </div>
        </CelebrationBanner>

        {(['critical', 'important', 'nice-to-have'] as Priority[]).map((priority) => {
          const items = grouped[priority];
          if (!items || items.length === 0) return null;
          const cfg = PRIORITY_CONFIG[priority];
          const groupChecked = items.filter((i) => checkedDocs[i.id]).length;
          return (
            <motion.div
              key={priority}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className={`px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between ${cfg.bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${priority === 'critical' ? 'bg-red-500' : priority === 'important' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                  <h3 className={`font-semibold ${cfg.color}`}>{cfg.label}</h3>
                  <span className="text-xs text-gray-400 ml-1">{groupChecked}/{items.length}</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <ChecklistItemRow key={item.id} item={item} checked={!!checkedDocs[item.id]} onToggle={() => toggleDoc(item.id)} unlocked={unlocked} notApplicableReason={getItemNotApplicableReason(item.id, visaType, annualIncomeRange, employmentStatus)} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // ── LOCKED VIEW ──
  const personalItems = byCategory.personal;
  const financialItems = byCategory.financial;
  const supportingItems = byCategory.supporting;
  const personalTeaser = personalItems.slice(0, 4);
  const personalLockedCount = Math.max(0, personalItems.length - 4);
  const lockedDocCount = financialItems.length + supportingItems.length + personalLockedCount;

  return (
    <div className="space-y-6">
      <ProgressCard checkedCount={checkedCount} total={total} progressPct={progressPct} verifiedCount={verifiedCount} />

      {/* Personal Documents — teaser */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CATEGORY_CONFIG.personal.icon}</span>
            <h3 className="font-semibold text-blue-900">{CATEGORY_CONFIG.personal.label}</h3>
            <span className="text-xs text-gray-400 ml-1">{personalItems.length} documents</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {personalTeaser.map((item) => (
            <ChecklistItemRow key={item.id} item={item} checked={!!checkedDocs[item.id]} onToggle={() => toggleDoc(item.id)} unlocked={unlocked} notApplicableReason={getItemNotApplicableReason(item.id, visaType, annualIncomeRange, employmentStatus)} />
          ))}
          {personalLockedCount > 0 && (
            <div className="px-5 sm:px-6 py-3 bg-amber-50/50 text-sm text-amber-700 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>+{personalLockedCount} more documents — unlock to view</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Evidence — locked */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-amber-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CATEGORY_CONFIG.financial.icon}</span>
            <h3 className="font-semibold text-amber-900">{CATEGORY_CONFIG.financial.label}</h3>
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">
              <Lock className="w-3 h-3" /> Locked
            </span>
          </div>
          <span className="text-xs text-amber-600">{financialItems.length} documents</span>
        </div>
        <div className="px-5 sm:px-6 py-6 bg-amber-50/30">
          <div className="space-y-2 mb-4 select-none">
            {financialItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center gap-3 opacity-40 blur-[2px] pointer-events-none">
                <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.title}</p>
                  <p className="text-xs text-gray-400 truncate max-w-md">{item.description.slice(0, 60)}…</p>
                </div>
              </div>
            ))}
          </div>
          <LockedSectionBanner
            message={`${lockedDocCount} documents locked — Unlock Full Pack to upload and verify`}
            onUnlock={onUnlock}
          />
        </div>
      </div>

      {/* Supporting Evidence — locked */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-amber-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CATEGORY_CONFIG.supporting.icon}</span>
            <h3 className="font-semibold text-amber-900">{CATEGORY_CONFIG.supporting.label}</h3>
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">
              <Lock className="w-3 h-3" /> Locked
            </span>
          </div>
          <span className="text-xs text-amber-600">{supportingItems.length} documents</span>
        </div>
        <div className="px-5 sm:px-6 py-6 bg-amber-50/30">
          <div className="space-y-2 mb-4 select-none">
            {supportingItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center gap-3 opacity-40 blur-[2px] pointer-events-none">
                <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.title}</p>
                  <p className="text-xs text-gray-400 truncate max-w-md">{item.description.slice(0, 60)}…</p>
                </div>
              </div>
            ))}
          </div>
          <LockedSectionBanner
            message="Unlock Full Pack to access all supporting evidence requirements"
            onUnlock={onUnlock}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ checkedCount, total, progressPct, verifiedCount }: { checkedCount: number; total: number; progressPct: number; verifiedCount?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 icon-hover-spin" />
          <h3 className="font-semibold text-gray-900">Document Progress</h3>
        </div>
        <span className="text-2xl sm:text-3xl font-extrabold text-blue-700">{progressPct}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: progressPct === 100 ? '#059669' : 'linear-gradient(90deg, #1d4ed8, #3b82f6)',
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-lg text-gray-900">{checkedCount}</span> of <span className="font-bold text-lg text-gray-900">{total}</span> documents ready
          {progressPct === 100 && <span className="ml-2 text-emerald-600 font-medium">✓ All done!</span>}
        </p>
        {typeof verifiedCount === 'number' && verifiedCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            {verifiedCount} verified
          </span>
        )}
      </div>
    </div>
  );
}

function ChecklistItemRow({ item, checked, onToggle, unlocked = false, notApplicableReason = null }: { item: ChecklistItem; checked: boolean; onToggle: () => void; unlocked?: boolean; notApplicableReason?: string | null }) {
  const [justChecked, setJustChecked] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  const { documentUploads, documentReports, setDocumentReport, purchasedTier, visaType } = useApplicationStore();

  // If item is not applicable, render a muted version
  if (notApplicableReason) {
    return (
      <div className="px-5 sm:px-6 py-3.5 flex items-start gap-3 bg-gray-50/50 opacity-60">
        <div className="mt-1 flex-shrink-0">
          <div className="w-5 h-5 rounded-md border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-400">—</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-400 line-through">{item.title}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
              N/A
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{notApplicableReason}</p>
        </div>
      </div>
    );
  }
  const upload = documentUploads[item.id];
  const report = documentReports[item.id] || null;
  const hasFileData = !!upload?.fileData;
  const isPremiumPlus = purchasedTier === 'premium' || purchasedTier === 'expert';

  // Template handling is done via GetTemplateButton component using getTemplateForItem()

  const handleToggle = useCallback(() => {
    if (!checked) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 1200);
    }
    onToggle();
  }, [checked, onToggle]);

  // Confidence KPI display
  const getConfidenceDisplay = () => {
    if (!isPremiumPlus) {
      return { text: '🔒', className: 'text-gray-400 cursor-not-allowed', clickable: false };
    }
    if (!report) {
      return { text: 'Not assessed', className: 'text-gray-400 hover:text-gray-600 cursor-pointer', clickable: true };
    }
    const score = report.confidence;
    if (score >= 70) return { text: `${score}% 🟢`, className: 'text-emerald-600 hover:text-emerald-700 cursor-pointer font-semibold', clickable: true };
    if (score >= 40) return { text: `${score}% 🟡`, className: 'text-amber-600 hover:text-amber-700 cursor-pointer font-semibold', clickable: true };
    return { text: `${score}% 🔴`, className: 'text-red-600 hover:text-red-700 cursor-pointer font-semibold', clickable: true };
  };

  const confidenceDisplay = getConfidenceDisplay();

  // AI Ready Check handler
  const handleAIReadyCheck = async (forceNew = false) => {
    if (!isPremiumPlus) return;
    if (!hasFileData && !report) return;

    // If report exists and not forcing new, show cached
    if (report && !forceNew) {
      setShowAIModal(true);
      return;
    }

    // Generate new report
    setShowAIModal(true);
    setIsAILoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/ai-confidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          image: upload?.fileData,
          requirement: `${item.title}: ${item.description}`,
          mimeType: upload?.mimeType || 'image/jpeg',
          docTitle: item.title,
          visaType: visaType || 'spouse',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API error: ${response.status}`);
      }

      const result = await response.json();

      // Transform API response to AIReportData format
      const reportData: AIReportData = {
        documentId: item.id,
        documentName: item.title,
        confidence: result.confidence,
        flags: Array.isArray(result.flags)
          ? result.flags.map((f: string | { text: string; severity: string }) =>
              typeof f === 'string' ? { text: f, severity: 'medium' } : f
            )
          : [],
        swot: result.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations.map((r: string | { step: string; description: string }) =>
              typeof r === 'string' ? { step: '', description: r } : r
            )
          : [],
        generatedAt: new Date().toISOString(),
        version: report ? report.version + 1 : 1,
      };

      setDocumentReport(item.id, reportData);
    } catch (err) {
      console.error('AI confidence check failed:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Document download handler
  const handleDocumentDownload = () => {
    if (!upload?.fileData) return;
    const data = upload.fileData;
    const mime = upload.mimeType || 'application/octet-stream';
    const name = upload.fileName || 'document';
    const byteChars = atob(data);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNums)], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={`px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-all duration-200 ${checked ? 'bg-emerald-50/30' : ''} ${justChecked ? 'animate-greenFlash' : ''}`}>
        <button onClick={handleToggle} className="w-full text-left flex items-start gap-4 touch-target">
          <div className="pt-0.5 flex-shrink-0">
            {checked ? (
              <motion.div
                initial={justChecked ? { scale: 0 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className={justChecked ? 'animate-greenGlow rounded-full' : ''}
              >
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              </motion.div>
            ) : (
              <Square className="w-5 h-5 text-gray-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm ${checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {item.title}
            </p>
            <p className={`text-sm mt-0.5 ${checked ? 'text-gray-300' : 'text-gray-500'}`}>
              {item.description}
            </p>
            {item.tips && !checked && (
              <div className="flex items-start gap-1.5 mt-2 text-xs text-blue-600">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>{item.tips}</span>
              </div>
            )}
          </div>
          {justChecked && (
            <div className="relative flex-shrink-0">
              <ConfettiBurst active={true} />
            </div>
          )}
        </button>

        {/* Per-item action buttons row */}
        <div className="ml-9 mt-3 flex flex-wrap items-center gap-2">
          {/* Template button — Premium only */}
          <GetTemplateButton
            itemTitle={item.title}
            templateFilename={getTemplateForItem(item.title) || undefined}
            isPremium={purchasedTier === 'premium' || purchasedTier === 'expert'}
            onUnlock={() => {}} // Handled by parent
          />

          {/* Gov.uk link — always visible */}
          {item.govLink && (
            <a
              href={item.govLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Gov.uk 🔗
            </a>
          )}

          {/* Confidence KPI — Premium+ */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confidenceDisplay.clickable) {
                if (report) {
                  setShowAIModal(true);
                } else if (hasFileData) {
                  handleAIReadyCheck();
                }
              }
            }}
            disabled={!confidenceDisplay.clickable}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              confidenceDisplay.clickable
                ? 'border-gray-200 hover:bg-gray-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed'
            } ${confidenceDisplay.className}`}
          >
            <Sparkles className="w-3 h-3" />
            {confidenceDisplay.text}
          </button>

          {/* AI Ready Check — Premium+ */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPremiumPlus) handleAIReadyCheck();
            }}
            disabled={!isPremiumPlus || (!hasFileData && !report)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isPremiumPlus && (hasFileData || report)
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                : !isPremiumPlus
                ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed'
            }`}
            title={!isPremiumPlus ? 'Premium: AI document analysis' : !hasFileData && !report ? 'Upload a document first' : 'Run AI analysis'}
          >
            <ShieldCheck className="w-3 h-3" />
            AI Ready Check
            {!isPremiumPlus && <Lock className="w-2.5 h-2.5" />}
          </button>

          {/* Download — visible if document uploaded */}
          {hasFileData && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDocumentDownload();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          )}
        </div>

        {/* Document Upload */}
        <div className="ml-9 mt-2">
          <DocumentUpload docId={item.id} requirement={`${item.title}: ${item.description}`} locked={!unlocked} />
        </div>
      </div>

      {/* AI Report Modal */}
      <AIReportModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        report={report}
        documentId={item.id}
        documentName={item.title}
        isLoading={isAILoading}
        onGenerateNew={() => handleAIReadyCheck(true)}
        onViewFullReport={() => {
          setShowAIModal(false);
          window.location.href = `/dashboard/${item.id}/ai-report`;
        }}
      />
    </>
  );
}

// ─── Timeline Tab ───────────────────────────────────────────────────────────

function TimelineTab({
  weeks,
  expanded,
  toggle,
  unlocked,
  onUnlock,
}: {
  weeks: TimelineWeek[];
  expanded: Record<number, boolean>;
  toggle: (w: number) => void;
  unlocked: boolean;
  onUnlock: () => void;
}) {
  if (weeks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <Clock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">No Timeline Available</h3>
        <p className="text-gray-500 text-sm">Please complete the urgency step in the wizard to generate your timeline.</p>
      </div>
    );
  }

  const TEASER_WEEKS = 2;
  const visibleWeeks = unlocked ? weeks : weeks.slice(0, TEASER_WEEKS);
  const lockedWeeks = unlocked ? [] : weeks.slice(TEASER_WEEKS);

  return (
    <div className="space-y-0">
      <div className="bg-white rounded-t-2xl border border-b-0 border-gray-100 shadow-sm px-5 sm:px-6 py-5">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-emerald-600 icon-hover-spin" />
          <h3 className="font-semibold text-gray-900">Your {weeks.length}-Week Action Plan</h3>
        </div>
        <p className="text-sm text-gray-500">Follow this week-by-week to stay on track.</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderRadius: unlocked ? '0 0 1rem 1rem' : '0' }}>
        {visibleWeeks.map((week, idx) => {
          const isExpanded = !!expanded[week.week];
          const isLast = idx === visibleWeeks.length - 1 && unlocked;
          return (
            <div key={week.week} className={!isLast ? 'border-b border-gray-100' : ''}>
              <button
                onClick={() => toggle(week.week)}
                className="w-full text-left px-5 sm:px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-all touch-target"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isExpanded ? 'bg-blue-700 text-white shadow-sm scale-110' : 'bg-gray-100 text-gray-500'}`}>
                    {week.week}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{week.title}</p>
                  <p className="text-sm text-gray-500 truncate">{week.actions[0]}</p>
                </div>
                <div className="flex-shrink-0">
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-5 pl-[4.25rem]">
                      <div className="border-l-2 border-blue-200 pl-4 space-y-3">
                        {week.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-blue-700">{i + 1}</span>
                            </div>
                            <p className="text-sm text-gray-700">{action}</p>
                          </div>
                        ))}
                        {week.notes && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg text-xs text-amber-800">
                            <strong>Note:</strong> {week.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!unlocked && lockedWeeks.length > 0 && (
        <div className="relative">
          <div className="bg-white border border-t-0 border-gray-100 shadow-sm overflow-hidden rounded-b-2xl">
            {lockedWeeks.map((week, idx) => (
              <div key={week.week} className={`${idx < lockedWeeks.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="px-5 sm:px-6 py-4 flex items-center gap-4 opacity-30 pointer-events-none select-none">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-bold">
                      {week.week}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-500 text-sm">{week.title}</p>
                    <p className="text-sm text-gray-400 truncate">{week.actions[0]}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex items-end justify-center pb-6 rounded-b-2xl">
              <div className="w-full px-4 sm:px-6">
                <LockedSectionBanner message={`Unlock to see full ${weeks.length}-week timeline`} onUnlock={onUnlock} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Risks Tab ──────────────────────────────────────────────────────────────

function RisksTab({ risks, unlocked, onUnlock }: { risks: RiskRule[]; unlocked: boolean; onUnlock: () => void }) {
  if (risks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Looking Good!</h3>
        <p className="text-gray-500 text-sm">No specific risks detected. Keep following the checklist.</p>
      </div>
    );
  }

  const highRisks = risks.filter((r) => r.severity === 'high');
  const otherRisks = risks.filter((r) => r.severity !== 'high');

  const TEASER_HIGH = 3;
  const visibleHighRisks = unlocked ? highRisks : highRisks.slice(0, TEASER_HIGH);
  const lockedRiskCount = unlocked ? 0 : Math.max(0, highRisks.length - TEASER_HIGH) + otherRisks.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-amber-500 icon-hover-spin" />
          <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
        </div>
        <p className="text-sm text-gray-500">
          {risks.length} risk{risks.length !== 1 ? 's' : ''} identified.
          {highRisks.length > 0 && (
            <span className="text-red-600 font-medium"> {highRisks.length} require immediate attention.</span>
          )}
        </p>
        <div className="flex gap-3 mt-4 flex-wrap">
          {(['high', 'medium', 'low'] as const).map((sev) => {
            const count = risks.filter((r) => r.severity === sev).length;
            if (count === 0) return null;
            const cfg = SEVERITY_CONFIG[sev];
            return (
              <span key={sev} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                {cfg.label}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {visibleHighRisks.length > 0 && (
        <div className="space-y-3">
          {visibleHighRisks.map((risk, i) => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
            >
              <RiskCard risk={risk} />
            </motion.div>
          ))}
        </div>
      )}

      {unlocked && otherRisks.length > 0 && (
        <div className="space-y-3">
          {otherRisks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      )}

      {!unlocked && lockedRiskCount > 0 && (
        <LockedSectionBanner
          message={`${lockedRiskCount} more risk${lockedRiskCount !== 1 ? 's' : ''} identified — see all when unlocked`}
          onUnlock={onUnlock}
        />
      )}
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskRule }) {
  const cfg = SEVERITY_CONFIG[risk.severity];
  const Icon = cfg.icon;
  const isHigh = risk.severity === 'high';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isHigh ? 'border-red-200' : 'border-gray-100'}`}>
      <div className={`px-5 sm:px-6 py-4 flex items-start gap-4 ${isHigh ? 'bg-red-50/50' : ''}`}>
        <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5 ${isHigh ? 'animate-pulse-soft' : ''}`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold text-gray-900 text-sm">{risk.title}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
          <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">{risk.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Tab ─────────────────────────────────────────────────────────────

function SubmitTab({
  visaLabel,
  urgencyLabel,
  checkedCount,
  total,
  riskCount,
  highRisks,
  onUnlock,
  unlocked,
}: {
  visaLabel: string;
  urgencyLabel: string;
  checkedCount: number;
  total: number;
  riskCount: number;
  highRisks: number;
  onUnlock: () => void;
  unlocked: boolean;
}) {
  const readiness = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  if (unlocked) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Application Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryRow label="Visa Type" value={visaLabel} />
            <SummaryRow label="Timeline" value={urgencyLabel} />
            <SummaryRow label="Documents Ready" value={`${checkedCount} of ${total} (${readiness}%)`} highlight={readiness < 80} />
            <SummaryRow label="Risk Alerts" value={`${riskCount} identified${highRisks > 0 ? ` (${highRisks} high)` : ''}`} highlight={highRisks > 0} />
          </div>
        </div>

        <div className="rounded-2xl border shadow-sm p-5 sm:p-6 bg-emerald-50 border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-emerald-900">Full Plan Unlocked</h3>
              <p className="text-sm mt-1 text-emerald-700">
                You have full access to your personalised checklist, timeline, and risk assessment. Use the tabs above to review everything.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Your Plan is Ready
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          We&apos;ve built a personalised plan based on your answers. Unlock to access everything.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryRow label="Visa Type" value={visaLabel} />
          <SummaryRow label="Timeline" value={urgencyLabel} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: 'Document Checklist', desc: `${total} documents identified`, color: 'blue' },
          { icon: Calendar, label: 'Action Timeline', desc: 'Week-by-week plan', color: 'emerald' },
          { icon: AlertCircle, label: 'Risk Assessment', desc: `${riskCount} risks identified`, color: 'amber' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Unlock to view</span>
              </div>
            </div>
            <div className="opacity-30">
              <item.icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What&apos;s included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard icon={Download} title="PDF Checklist" description="Personalised, printable document checklist tailored to your visa type." />
          <FeatureCard icon={Mail} title="Email Support" description="Direct email access for questions about your specific application." />
          <FeatureCard icon={BookOpen} title="Step-by-Step Guide" description="How to fill in the form, book biometrics, and submit." />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            🔥 Early access pricing — locked in
          </div>
          <p className="text-sm text-gray-600 mb-2">Starting from</p>
          <p className="text-5xl font-bold text-blue-900 mb-1">£50</p>
          <p className="text-sm text-gray-500 mb-2">One-time payment. No subscription. Yours forever.</p>
          <p className="text-xs text-gray-400 mb-6">💬 1,000+ applicants have already unlocked their plans</p>
          <button
            onClick={onUnlock}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all btn-hover animate-emeraldGlow"
          >
            <CreditCard className="w-5 h-5" />
            See All Plans
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Money-back guarantee if not satisfied
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Secure payment via Stripe ·{' '}
            <Link href="/privacy" className="text-blue-500 hover:underline">Privacy policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 bg-gray-50 rounded-xl">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-amber-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof Download; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 card-hover">
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
