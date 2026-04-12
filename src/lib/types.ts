// Application types
export type VisaType = 'spouse' | 'skilled_worker' | 'citizenship' | 'unsure';
export type RelationshipStatus = 'married' | 'civil_partnership' | 'engaged';
export type IncomeRange = string; // Values vary by visa type (e.g. 'under29k', 'over29k', 'under30k', '38700plus')
export type Urgency = 'urgent' | 'normal' | 'ahead';
export type RiskSeverity = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  auth_id: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

export interface Application {
  id: string;
  user_id: string;
  visa_type: VisaType;
  nationality: string;
  relationship_status: RelationshipStatus;
  currently_in_uk: boolean;
  relationship_duration_months: number;
  annual_income_range: IncomeRange;
  employment_status: string;
  documents_available: Record<string, boolean>;
  urgency: Urgency;
  target_application_date: string;
  onboarding_completed: boolean;
  payment_completed: boolean;
  checklist_downloaded: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Document {
  id: string;
  application_id: string;
  document_name: string;
  document_category: 'personal' | 'financial' | 'supporting';
  description: string;
  format_required: string;
  tips: string;
  is_completed: boolean;
  completed_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  display_order: number;
}

export interface RiskAlert {
  id: string;
  application_id: string;
  alert_type: string;
  severity: RiskSeverity;
  title: string;
  description: string;
  recommendation: string;
  created_at: string;
  dismissed_by_user: boolean;
}

export type PremiumTierType = 'free' | 'ai_review_149' | 'human_review_199';
export type ReviewStatusType = 'pending' | 'ai_in_progress' | 'ai_complete' | 'human_queued' | 'human_in_progress' | 'human_complete';

export interface DocumentReview {
  id: string;
  user_id: string;
  application_id: string;
  doc_id: string;
  doc_title: string;
  file_name: string;
  ai_risk_level: 'high' | 'medium' | 'low';
  ai_confidence_score: number;
  ai_feedback: string;
  ai_issues: Array<{ type: string; severity: string; message: string; fix: string }>;
  ai_reviewed_at: string;
  cross_doc_flags: Array<{ related_doc_id: string; issue: string; severity: string }>;
  human_reviewer_id: string | null;
  human_feedback: string | null;
  human_risk_level: string | null;
  human_reviewed_at: string | null;
  status: ReviewStatusType;
  created_at: string;
  updated_at: string;
}

export interface ReviewSession {
  id: string;
  user_id: string;
  application_id: string;
  tier: PremiumTierType;
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
  total_documents: number;
  reviewed_documents: number;
  overall_risk_level: 'high' | 'medium' | 'low' | null;
  overall_confidence: number | null;
  summary_feedback: string | null;
  cross_doc_summary: string | null;
  stripe_session_id: string;
  amount_pence: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  human_reviewer_assigned: string | null;
  human_priority: number;
}

export interface Payment {
  id: string;
  user_id: string;
  application_id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string;
  amount_pence: number;
  currency: string;
  payment_status: 'pending' | 'success' | 'failed' | 'refunded';
  product_type: string;
  created_at: string;
  completed_at: string | null;
  refunded_at: string | null;
  metadata: Record<string, any>;
}
