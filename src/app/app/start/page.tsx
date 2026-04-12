'use client';

import AuthGate from '@/components/AuthGate';
import Onboarding from '@/components/Onboarding';

export default function StartPage() {
  return (
    <AuthGate>
      <Onboarding />
    </AuthGate>
  );
}
