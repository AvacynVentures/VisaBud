'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useApplicationStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { PageFadeIn } from '@/lib/animations';
import { VisaType, RelationshipStatus, Urgency } from '@/lib/types';


const VISA_TYPES = [
  { id: 'spouse', icon: '👰', label: 'Spouse / Partner Visa', sub: 'Your partner sponsors you. Income must be £29,000+/year (or savings to compensate)' },
  { id: 'skilled_worker', icon: '💼', label: 'Skilled Worker Visa', sub: 'UK employer sponsors you. Salary must meet threshold (usually £38,700+/year)' },
  { id: 'citizenship', icon: '🏛️', label: 'British Citizenship', sub: 'You have lived in UK 5+ years. No salary requirement, but character is strict' },
  { id: 'unsure', icon: '❓', label: 'Not sure which visa', sub: 'Answer a few questions and we will help you figure out which applies' },
];

const NATIONALITIES = [
  'EU/EEA Citizen', 'Indian', 'Pakistani', 'Nigerian', 'American', 'Australian', 'Filipino', 'Chinese', 'Other'
];

const PARTNER_STATUSES = ['Married', 'Civil Partnership', 'Unmarried Partners (2+ yrs)', 'Fiancé/Fiancée'];

const SPONSOR_INCOMES = [
  { id: 'under29k', label: 'Under £29,000', detail: 'Below the minimum threshold. You will need £16,000+ savings to bridge the gap' },
  { id: 'over29k', label: '£29,000+', detail: 'Meets income threshold (as of April 2024). No savings needed' },
  { id: 'selfemployed', label: 'Self-employed', detail: 'Needs 2 years of tax returns + business bank statements' },
  { id: 'unsure', label: 'Not sure yet', detail: 'Ask your partner to check their payslips or request an employer letter' },
];

const SALARY_BANDS = [
  { id: 'under30k', label: 'Under £30,000', detail: '⚠️ Below minimum for most roles. Application will likely be refused unless a specific exemption applies' },
  { id: '30to38k', label: '£30,000 – £38,699', detail: 'In the grey zone. Confirm with your employer: minimum is £38,700+ for most roles' },
  { id: '38700plus', label: '£38,700+', detail: 'Meets or exceeds standard minimum salary threshold' },
  { id: 'unsure', label: 'Not confirmed yet', detail: 'Salary must be confirmed in writing by your employer before applying' },
];

const UK_YEARS = [
  { id: 'under5', label: 'Less than 5 years', detail: 'You do not yet meet the 5-year residency requirement' },
  { id: 'exactly5', label: 'About 5 years', detail: 'Warning: Double-check your exact qualifying date. Being 1 day early = automatic refusal' },
  { id: 'over5', label: 'More than 5 years', detail: 'You meet residency. Check: max 450 days abroad in the 5-year period' },
];

const TIMELINE_OPTIONS = [
  { id: 'urgent', icon: '🔥', label: 'Urgently', detail: 'Within 4 weeks. Priority processing: +£500–800 fee' },
  { id: 'normal', icon: '📅', label: 'In the next 1–3 months', detail: 'Standard processing. Enough time to prepare without rushing' },
  { id: 'ahead', icon: '🗓️', label: 'Planning ahead', detail: 'More than 3 months. Time to improve your application' },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function Onboarding() {
  const router = useRouter();
  const {
    currentStep,
    visaType,
    nationality,
    relationshipStatus,
    currentlyInUk,
    relationshipDurationMonths,
    annualIncomeRange,
    employmentStatus,
    urgency,
    hasPreviousRefusal,
    hasPreviousOverstay,
    setVisaType,
    setNationality,
    setRelationshipStatus,
    setCurrentlyInUk,
    setRelationshipDurationMonths,
    setAnnualIncomeRange,
    setUrgency,
    setHasPreviousRefusal,
    setHasPreviousOverstay,
    nextStep,
    prevStep,
    setCurrentStep,
    setUserEmail,
  } = useApplicationStore();

  const { user } = useAuth();
  const [direction, setDirection] = useState(1);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (user?.email) setUserEmail(user.email);
  }, [user, setUserEmail]);

  const canContinue = () => {
    switch (currentStep) {
      case 1: return !!visaType;
      case 2: return !!nationality;
      case 3: return visaType !== 'unsure' && typeof currentlyInUk === 'boolean' && (visaType !== 'spouse' || !!relationshipStatus) && hasPreviousRefusal !== null && hasPreviousOverstay !== null;
      case 4:
        if (visaType === 'spouse') return !!annualIncomeRange;
        if (visaType === 'skilled_worker') return !!annualIncomeRange;
        if (visaType === 'citizenship') return !!relationshipDurationMonths;
        return true;
      case 5: return !!urgency;
      default: return false;
    }
  };

  const progress = ((currentStep - 1) / 4) * 100;

  const [isCreating, setIsCreating] = useState(false);

  const handleNext = async () => {
    setDirection(1);
    if (currentStep === 5) {
      // Wizard complete — create application in DB
      setIsCreating(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          router.push('/dashboard');
          return;
        }

        console.log('[Onboarding] Creating application:', {
          visaType: visaType === 'unsure' ? 'spouse' : visaType,
          nationality, urgency,
        });

        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visaType: visaType === 'unsure' ? 'spouse' : visaType,
            nationality,
            relationshipStatus,
            currentlyInUk,
            relationshipDurationMonths,
            annualIncomeRange,
            employmentStatus,
            urgency,
            // Auto-generate name from user email + visa type
            name: user?.email
              ? `${user.email.split('@')[0]} — ${
                  visaType === 'spouse' ? 'Spouse Visa' :
                  visaType === 'skilled_worker' ? 'Skilled Worker Visa' :
                  visaType === 'citizenship' ? 'British Citizenship' : 'Visa Application'
                }`
              : undefined,
          }),
        });

        const responseData = await response.json();
        console.log('[Onboarding] API response:', response.status, responseData);

        if (response.ok && responseData.application) {
          // Redirect to applications hub to see the new application
          router.push('/applications');
        } else {
          console.error('[Onboarding] Failed to create application:', responseData);
          // Still redirect to applications hub
          router.push('/applications');
        }
      } catch (err) {
        console.error('[Onboarding] Error creating application:', err);
        router.push('/dashboard');
      }
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

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



  return (
    <PageFadeIn>
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <span className="font-bold text-blue-900 tracking-tight">VisaBud</span>
          </div>
        </nav>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-5 py-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-blue-600">Step {currentStep} of 5</span>
              <span className="text-xs text-gray-400">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <motion.div
                className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-start justify-center px-4 py-6 sm:py-8">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
                  <h2 className="text-xl font-bold text-blue-900 mb-1">
                    {currentStep === 1 && 'Which visa are you applying for?'}
                    {currentStep === 2 && 'What is your nationality?'}
                    {currentStep === 3 && 'A few more details'}
                    {currentStep === 4 && 'Income & eligibility'}
                    {currentStep === 5 && 'When are you planning to apply?'}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {currentStep === 1 && "We'll personalise everything to your situation"}
                    {currentStep === 2 && 'This affects document requirements and TB test needs'}
                    {currentStep === 3 && 'Almost there – this helps us tailor your plan'}
                    {currentStep === 4 && 'Used to identify any risks before you apply'}
                    {currentStep === 5 && "We'll structure your timeline around this"}
                  </p>

                  {/* STEP 1: VISA TYPE */}
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      {VISA_TYPES.map((v, i) => (
                        <motion.button
                          key={v.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          onClick={() => setVisaType(v.id as VisaType)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 touch-target
                            ${visaType === v.id
                              ? 'border-blue-600 bg-blue-50 shadow-sm'
                              : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="text-2xl flex-shrink-0">{v.icon}</span>
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${visaType === v.id ? 'text-blue-800' : 'text-gray-800'}`}>
                              {v.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{v.sub}</p>
                          </div>
                          {visaType === v.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* STEP 2: NATIONALITY */}
                  {currentStep === 2 && (
                    <div className="grid grid-cols-2 gap-3">
                      {NATIONALITIES.map((n, i) => (
                        <motion.button
                          key={n}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03, duration: 0.2 }}
                          onClick={() => setNationality(n)}
                          className={`flex items-center justify-between gap-2 p-3.5 rounded-xl border-2 text-left transition-all duration-200 touch-target
                            ${nationality === n
                              ? 'border-blue-600 bg-blue-50 shadow-sm'
                              : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className={`text-sm font-medium ${nationality === n ? 'text-blue-800' : 'text-gray-700'}`}>
                            {n}
                          </span>
                          {nationality === n && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* STEP 2.5: UNSURE */}
                  {currentStep === 3 && visaType === 'unsure' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 font-medium mb-3">Let&apos;s figure out which visa applies to you:</p>
                        <div className="space-y-2 text-sm text-blue-800">
                          <p>✓ <strong>Spouse/Partner Visa:</strong> You&apos;re married/partnered to a UK citizen or settled person</p>
                          <p>✓ <strong>Skilled Worker:</strong> You have a job offer from a UK employer</p>
                          <p>✓ <strong>Citizenship:</strong> You&apos;ve already lived in the UK for 5+ years on a valid visa</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setCurrentStep(1); }}
                        className="w-full text-center py-2 px-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        ← Go back and select the option that matches
                      </button>
                    </div>
                  )}

                  {/* STEP 3: LOCATION & RELATIONSHIP */}
                  {currentStep === 3 && visaType !== 'unsure' && (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Where are you currently based?</p>
                        <div className="space-y-2">
                          {[
                            { id: 'inside', label: 'Currently inside the UK', detail: 'Faster processing. No overseas delay' },
                            { id: 'outside', label: 'Currently outside the UK', detail: 'Process through visa centre in your country. Add 2–4 weeks' },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setCurrentlyInUk(opt.id === 'inside')}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                ${(currentlyInUk === true && opt.id === 'inside') || (currentlyInUk === false && opt.id === 'outside')
                                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className={`font-semibold text-sm ${(currentlyInUk === true && opt.id === 'inside') || (currentlyInUk === false && opt.id === 'outside') ? 'text-blue-800' : 'text-gray-800'}`}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {visaType === 'spouse' && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">What is your relationship status?</p>
                          <div className="space-y-2">
                            {PARTNER_STATUSES.map((status) => (
                              <button
                                key={status}
                                onClick={() => setRelationshipStatus(status as RelationshipStatus)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                  ${relationshipStatus === status
                                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                  }`}
                              >
                                <p className={`font-semibold text-sm ${relationshipStatus === status ? 'text-blue-800' : 'text-gray-800'}`}>
                                  {status}
                                </p>
                                {status === 'Fiancé/Fiancée' && (
                                  <p className="text-xs text-red-600 mt-0.5 font-medium">⚠️ You need a Fiancé visa first. You have 6 months to marry after arrival, then apply for Spouse visa (two separate applications)</p>
                                )}
                                {status === 'Unmarried Partners (2+ yrs)' && (
                                  <p className="text-xs text-amber-600 mt-0.5">⚠️ Must prove 2+ years cohabitation with substantial documentary evidence</p>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Immigration history — applies to all visa types */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Have you ever been refused a visa from any country?</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { val: true, label: 'Yes', detail: "We'll flag this so you declare it correctly" },
                            { val: false, label: 'No', detail: 'No action needed' },
                          ].map((opt) => (
                            <button
                              key={String(opt.val)}
                              onClick={() => setHasPreviousRefusal(opt.val)}
                              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                ${hasPreviousRefusal === opt.val
                                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className={`font-semibold text-sm ${hasPreviousRefusal === opt.val ? 'text-blue-800' : 'text-gray-800'}`}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Have you ever overstayed a visa?</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { val: true, label: 'Yes', detail: "We'll help you address this" },
                            { val: false, label: 'No', detail: 'No action needed' },
                          ].map((opt) => (
                            <button
                              key={String(opt.val)}
                              onClick={() => setHasPreviousOverstay(opt.val)}
                              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                ${hasPreviousOverstay === opt.val
                                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className={`font-semibold text-sm ${hasPreviousOverstay === opt.val ? 'text-blue-800' : 'text-gray-800'}`}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: INCOME */}
                  {currentStep === 4 && visaType !== 'unsure' && (
                    <div>
                      {visaType === 'spouse' && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-red-600 mb-4">
                            ⚠️ Minimum sponsor income is £29,000/year (as of April 2024). This is a common refusal reason.
                          </p>
                          {SPONSOR_INCOMES.map((opt, i) => (
                            <motion.button
                              key={opt.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                              onClick={() => setAnnualIncomeRange(opt.id)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                ${annualIncomeRange === opt.id
                                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className={`font-semibold text-sm ${annualIncomeRange === opt.id ? 'text-blue-800' : 'text-gray-800'}`}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {visaType === 'skilled_worker' && (
                        <div className="space-y-2">
                          {SALARY_BANDS.map((opt, i) => (
                            <motion.button
                              key={opt.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                              onClick={() => setAnnualIncomeRange(opt.id)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                ${annualIncomeRange === opt.id
                                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className={`font-semibold text-sm ${annualIncomeRange === opt.id ? 'text-blue-800' : 'text-gray-800'}`}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {visaType === 'citizenship' && (
                        <div className="space-y-2">
                          {UK_YEARS.map((opt, i) => (
                            <motion.button
                              key={opt.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                              onClick={() => setRelationshipDurationMonths(opt.id === 'under5' ? 36 : opt.id === 'exactly5' ? 60 : 72)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 touch-target
                                ${(relationshipDurationMonths === 36 && opt.id === 'under5') ||
                                  (relationshipDurationMonths === 60 && opt.id === 'exactly5') ||
                                  (relationshipDurationMonths === 72 && opt.id === 'over5')
                                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                              <p className={`font-semibold text-sm ${
                                (relationshipDurationMonths === 36 && opt.id === 'under5') ||
                                (relationshipDurationMonths === 60 && opt.id === 'exactly5') ||
                                (relationshipDurationMonths === 72 && opt.id === 'over5')
                                  ? 'text-blue-800' : 'text-gray-800'
                              }`}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5: TIMELINE */}
                  {currentStep === 5 && (
                    <div className="space-y-3">
                      {TIMELINE_OPTIONS.map((opt, i) => (
                        <motion.button
                          key={opt.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          onClick={() => setUrgency(opt.id as Urgency)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 touch-target
                            ${urgency === opt.id
                              ? 'border-blue-600 bg-blue-50 shadow-sm'
                              : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${urgency === opt.id ? 'text-blue-800' : 'text-gray-800'}`}>
                              {opt.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.detail}</p>
                          </div>
                          {urgency === opt.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
                    {currentStep > 1 ? (
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-all touch-target"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}
                    <button
                      onClick={handleNext}
                      disabled={!canContinue() || isCreating}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm btn-hover touch-target"
                    >
                      {isCreating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating your plan...</>
                      ) : (
                        <>{currentStep === 5 ? 'Generate My Plan' : 'Continue'} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageFadeIn>
  );
}
