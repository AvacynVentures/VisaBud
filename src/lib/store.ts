import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Application, VisaType, RelationshipStatus, IncomeRange, Urgency } from './types';

// Document upload tracking
export type UploadStatus = 'idle' | 'uploading' | 'validating' | 'valid' | 'invalid' | 'error';

export interface DocumentUploadState {
  status: UploadStatus;
  feedback: string | null;
  fileName: string | null;
  /** Base64-encoded document data (stored in memory for AI analysis) */
  base64Data?: string;
  /** MIME type of uploaded document */
  mimeType?: string;
}

// AI Confidence Scoring result
export interface AIConfidenceResult {
  confidence: number; // 0-100
  flags: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: string[];
  loading: boolean;
  error: string | null;
}

// Subscription tier tracking
export type SubscriptionTier = 'free' | 'standard' | 'premium' | 'expert';

// Premium review types
export type PremiumTier = 'free' | 'ai_review_149' | 'human_review_199';
export type ReviewStatus = 'none' | 'pending' | 'in_progress' | 'complete';

export interface DocumentReviewResult {
  riskLevel: 'high' | 'medium' | 'low';
  confidenceScore: number;
  feedback: string;
  issues: Array<{ type: string; severity: string; message: string; fix: string }>;
  positives: string[];
}

export interface PremiumReviewState {
  tier: PremiumTier;
  status: ReviewStatus;
  documentResults: Record<string, DocumentReviewResult>;
  crossDocumentFlags: Array<{
    relatedDocId: string;
    relatedDocTitle: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  overallRiskLevel: 'high' | 'medium' | 'low' | null;
  overallConfidence: number | null;
  summaryFeedback: string | null;
  reviewedAt: string | null;
}

interface AppState {
  // Form data
  visaType: VisaType | null;
  nationality: string;
  relationshipStatus: RelationshipStatus | null;
  currentlyInUk: boolean | null;
  relationshipDurationMonths: number | null;
  annualIncomeRange: IncomeRange | null;
  employmentStatus: string;
  documentsAvailable: Record<string, boolean>;
  urgency: Urgency | null;
  targetApplicationDate: string | null;

  // UI state
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;

  // Paywall state
  unlocked: boolean;

  // Document uploads
  documentUploads: Record<string, DocumentUploadState>;

  // Premium review state
  premiumReview: PremiumReviewState;

  // Subscription tier
  tier: SubscriptionTier;

  // AI Confidence Scoring
  aiConfidenceResults: Record<string, AIConfidenceResult>;

  // Auth state
  userEmail: string | null;

  // Actions
  setVisaType: (type: VisaType) => void;
  setNationality: (value: string) => void;
  setRelationshipStatus: (value: RelationshipStatus) => void;
  setCurrentlyInUk: (value: boolean) => void;
  setRelationshipDurationMonths: (value: number) => void;
  setAnnualIncomeRange: (value: IncomeRange) => void;
  setEmploymentStatus: (value: string) => void;
  setDocumentsAvailable: (doc: string, available: boolean) => void;
  setUrgency: (value: Urgency) => void;
  setTargetApplicationDate: (date: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  setUnlocked: (value: boolean) => void;
  setUserEmail: (email: string | null) => void;
  setDocumentUpload: (docId: string, upload: DocumentUploadState) => void;
  getVerifiedCount: () => number;
  setTier: (tier: SubscriptionTier) => void;
  setAIConfidenceResult: (docId: string, result: AIConfidenceResult) => void;
  
  // Tier helper
  hasFeature: (feature: 'checklist' | 'upload' | 'download' | 'templates' | 'ai_confidence' | 'ai_validation' | 'expert_review' | 'live_call') => boolean;

  // Premium review actions
  setPremiumTier: (tier: PremiumTier) => void;
  setPremiumReviewStatus: (status: ReviewStatus) => void;
  setPremiumReviewResults: (results: Partial<PremiumReviewState>) => void;
  resetPremiumReview: () => void;
  
  reset: () => void;
  getApplicationData: () => Partial<Application>;
}

const initialState = {
  visaType: null as VisaType | null,
  nationality: '',
  relationshipStatus: null as RelationshipStatus | null,
  currentlyInUk: null as boolean | null,
  relationshipDurationMonths: null as number | null,
  annualIncomeRange: null as IncomeRange | null,
  employmentStatus: '',
  documentsAvailable: {} as Record<string, boolean>,
  urgency: null as Urgency | null,
  targetApplicationDate: null as string | null,
  currentStep: 1,
  isSubmitting: false,
  error: null as string | null,
  unlocked: false,
  tier: 'free' as SubscriptionTier,
  documentUploads: {} as Record<string, DocumentUploadState>,
  aiConfidenceResults: {} as Record<string, AIConfidenceResult>,
  premiumReview: {
    tier: 'free' as PremiumTier,
    status: 'none' as ReviewStatus,
    documentResults: {} as Record<string, DocumentReviewResult>,
    crossDocumentFlags: [],
    overallRiskLevel: null,
    overallConfidence: null,
    summaryFeedback: null,
    reviewedAt: null,
  } as PremiumReviewState,
  userEmail: null as string | null,
};

export const useApplicationStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setVisaType: (type) => set({ visaType: type }),
      setNationality: (value) => set({ nationality: value }),
      setRelationshipStatus: (value) => set({ relationshipStatus: value }),
      setCurrentlyInUk: (value) => set({ currentlyInUk: value }),
      setRelationshipDurationMonths: (value) => set({ relationshipDurationMonths: value }),
      setAnnualIncomeRange: (value) => set({ annualIncomeRange: value }),
      setEmploymentStatus: (value) => set({ employmentStatus: value }),
      setDocumentsAvailable: (doc, available) =>
        set((state) => ({
          documentsAvailable: {
            ...state.documentsAvailable,
            [doc]: available,
          },
        })),
      setUrgency: (value) => set({ urgency: value }),
      setTargetApplicationDate: (date) => set({ targetApplicationDate: date }),

      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      setCurrentStep: (step) => set({ currentStep: Math.max(1, Math.min(step, 5)) }),
      setError: (error) => set({ error }),
      setIsSubmitting: (value) => set({ isSubmitting: value }),
      setUnlocked: (value) => set({ unlocked: value }),
      setUserEmail: (email) => set({ userEmail: email }),
      setDocumentUpload: (docId, upload) =>
        set((state) => ({
          documentUploads: {
            ...state.documentUploads,
            [docId]: upload,
          },
        })),
      getVerifiedCount: () => {
        const state = get();
        return Object.values(state.documentUploads).filter((u) => u.status === 'valid').length;
      },
      setTier: (tier) => set({ tier, unlocked: tier !== 'free' }),
      setAIConfidenceResult: (docId, result) =>
        set((state) => ({
          aiConfidenceResults: {
            ...state.aiConfidenceResults,
            [docId]: result,
          },
        })),
      hasFeature: (feature) => {
        const state = get();
        const t = state.tier;
        switch (feature) {
          case 'checklist':
          case 'upload':
          case 'download':
            return t !== 'free'; // standard+
          case 'templates':
          case 'ai_confidence':
          case 'ai_validation':
            return t === 'premium' || t === 'expert'; // premium+
          case 'expert_review':
          case 'live_call':
            return t === 'expert'; // expert only
          default:
            return false;
        }
      },

      // Premium review actions
      setPremiumTier: (tier) =>
        set((state) => ({
          premiumReview: { ...state.premiumReview, tier },
        })),
      setPremiumReviewStatus: (status) =>
        set((state) => ({
          premiumReview: { ...state.premiumReview, status },
        })),
      setPremiumReviewResults: (results) =>
        set((state) => ({
          premiumReview: { ...state.premiumReview, ...results },
        })),
      resetPremiumReview: () =>
        set((_state) => ({
          premiumReview: { ...initialState.premiumReview },
        })),

      reset: () => set(initialState),

      getApplicationData: (): Partial<Application> => {
        const state = get();
        return {
          visa_type: (state.visaType && state.visaType !== 'unsure' ? state.visaType : undefined),
          nationality: state.nationality,
          relationship_status: state.relationshipStatus ?? undefined,
          currently_in_uk: state.currentlyInUk ?? undefined,
          relationship_duration_months: state.relationshipDurationMonths ?? undefined,
          annual_income_range: state.annualIncomeRange ?? undefined,
          employment_status: state.employmentStatus,
          documents_available: state.documentsAvailable,
          urgency: state.urgency ?? undefined,
          target_application_date: state.targetApplicationDate ?? undefined,
          onboarding_completed: true,
        };
      },
    }),
    {
      name: 'VisaBud-application',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        visaType: state.visaType,
        nationality: state.nationality,
        relationshipStatus: state.relationshipStatus,
        currentlyInUk: state.currentlyInUk,
        relationshipDurationMonths: state.relationshipDurationMonths,
        annualIncomeRange: state.annualIncomeRange,
        employmentStatus: state.employmentStatus,
        documentsAvailable: state.documentsAvailable,
        urgency: state.urgency,
        targetApplicationDate: state.targetApplicationDate,
        currentStep: state.currentStep,
        unlocked: state.unlocked,
        tier: state.tier,
        // Strip base64Data from persistence (too large for localStorage)
        documentUploads: Object.fromEntries(
          Object.entries(state.documentUploads).map(([k, v]) => [
            k,
            { status: v.status, feedback: v.feedback, fileName: v.fileName, mimeType: v.mimeType },
          ])
        ),
        aiConfidenceResults: state.aiConfidenceResults,
        premiumReview: state.premiumReview,
        userEmail: state.userEmail,
      }),
    }
  )
);
