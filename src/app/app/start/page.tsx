'use client';

import OnboardingGate from '@/components/OnboardingGate';
import Onboarding from '@/components/Onboarding';

export default function StartPage() {
  return (
    <OnboardingGate>
      <Onboarding />
    </OnboardingGate>
  );
}
