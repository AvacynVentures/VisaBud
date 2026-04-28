/**
 * Application Types — Multi-application support
 */

export type VisaTypeValue = 'spouse' | 'skilled_worker' | 'citizenship';
export type UrgencyValue = 'urgent' | 'normal' | 'ahead';
export type ApplicationStatus = 'active' | 'submitted' | 'archived';
export type PurchasedTier = 'none' | 'standard' | 'premium';

export interface ApplicationRow {
  id: string;
  user_id: string;
  name: string | null;
  visa_type: VisaTypeValue;
  nationality: string | null;
  relationship_status: string | null;
  currently_in_uk: boolean | null;
  relationship_duration_months: number | null;
  annual_income_range: string | null;
  employment_status: string | null;
  urgency: UrgencyValue | null;
  target_application_date: string | null;
  has_previous_refusal: boolean | null;
  has_previous_overstay: boolean | null;
  onboarding_completed: boolean;
  checklist_progress: Record<string, boolean>;
  purchased_tier: PurchasedTier;
  stripe_payment_id: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface ApplicationSummary {
  id: string;
  name: string;
  visaType: VisaTypeValue;
  purchasedTier: PurchasedTier;
  status: ApplicationStatus;
  onboardingCompleted: boolean;
  checklistTotal: number;
  checklistCompleted: number;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  visaType: VisaTypeValue;
  nationality?: string;
  relationshipStatus?: string;
  currentlyInUk?: boolean;
  relationshipDurationMonths?: number;
  annualIncomeRange?: string;
  employmentStatus?: string;
  urgency?: UrgencyValue;
  targetApplicationDate?: string;
  hasPreviousRefusal?: boolean;
  hasPreviousOverstay?: boolean;
  name?: string;
}

export interface UpdateApplicationRequest {
  name?: string;
  nationality?: string;
  relationshipStatus?: string;
  currentlyInUk?: boolean;
  relationshipDurationMonths?: number;
  annualIncomeRange?: string;
  employmentStatus?: string;
  urgency?: UrgencyValue;
  targetApplicationDate?: string;
  hasPreviousRefusal?: boolean;
  hasPreviousOverstay?: boolean;
  onboardingCompleted?: boolean;
  checklistProgress?: Record<string, boolean>;
  status?: ApplicationStatus;
}

// Visa type display config
export const VISA_TYPE_CONFIG: Record<VisaTypeValue, { label: string; icon: string; color: string }> = {
  spouse: { label: 'Spouse / Partner Visa', icon: '👰', color: 'blue' },
  skilled_worker: { label: 'Skilled Worker Visa', icon: '💼', color: 'emerald' },
  citizenship: { label: 'British Citizenship', icon: '🏛️', color: 'violet' },
};

export const TIER_CONFIG: Record<PurchasedTier, { label: string; badge: string; color: string }> = {
  none: { label: 'Free', badge: 'Free Plan', color: 'gray' },
  standard: { label: 'Standard', badge: 'Standard Plan', color: 'blue' },
  premium: { label: 'Premium', badge: 'Premium Plan', color: 'emerald' },
};
