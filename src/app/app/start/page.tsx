'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import OnboardingGate from '@/components/OnboardingGate';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type VisaOption = {
  id: 'spouse' | 'skilled_worker' | 'citizenship';
  icon: string;
  title: string;
  description: string;
};

const VISA_OPTIONS: VisaOption[] = [
  {
    id: 'spouse',
    icon: '👰',
    title: 'Spouse / Partner Visa',
    description:
      'Your UK partner sponsors your application. Sponsor income must be £29,000+/year or supported by savings.',
  },
  {
    id: 'skilled_worker',
    icon: '💼',
    title: 'Skilled Worker Visa',
    description:
      'You have a job offer from a UK-licensed sponsor. Salary usually £38,700+/year depending on role.',
  },
  {
    id: 'citizenship',
    icon: '🏛️',
    title: 'British Citizenship',
    description:
      'You have lived in the UK on a valid visa for 5+ years and are ready to apply for naturalisation.',
  },
];

function VisaTypeSelector() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (visaType: VisaOption['id']) => {
    if (loading) return;
    setLoading(visaType);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visaType }),
      });

      const data = await response.json();

      if (response.ok && data.application) {
        router.push('/applications');
      } else {
        console.error('[VisaTypeSelector] Failed to create application:', data);
        // Still navigate — user can retry from applications hub
        router.push('/applications');
      }
    } catch (err) {
      console.error('[VisaTypeSelector] Error:', err);
      router.push('/applications');
    }
  };

  return (
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              Which visa are you applying for?
            </h1>
            <p className="text-sm text-gray-500">
              Pick your visa type to get your personalised checklist in seconds.
            </p>
          </div>

          {/* Visa Cards */}
          <div className="space-y-3">
            {VISA_OPTIONS.map((option, i) => {
              const isLoading = loading === option.id;
              const isDisabled = !!loading && !isLoading;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.25 }}
                  onClick={() => handleSelect(option.id)}
                  disabled={!!loading}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200
                    ${isLoading
                      ? 'border-blue-600 bg-blue-50 shadow-md scale-[1.01]'
                      : isDisabled
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-sm hover:scale-[1.01] cursor-pointer'
                    }`}
                >
                  <span className="text-3xl flex-shrink-0">{option.icon}</span>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isLoading ? 'text-blue-800' : 'text-gray-900'}`}>
                      {option.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <span className="text-blue-400 text-lg font-light">→</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Not sure which applies? Pick the closest option — you can always update it later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StartPage() {
  return (
    <OnboardingGate>
      <VisaTypeSelector />
    </OnboardingGate>
  );
}
