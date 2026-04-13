import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Application, VisaType, RelationshipStatus, IncomeRange, Urgency } from './types';

// Document upload tracking
export type UploadStatus = 'idle' | 'uploading' | 'validating' | 'valid' | 'invalid' | 'error';

export interface DocumentUploadState {
  status: UploadStatus;
  feedback: string | null;
  fileName: string | null;
  fileData?: string | null;    // base64 data for download
  mimeType?: string | null;    // file MIME type
}

export type PurchasedTier = 'none' | 'standard' | 'premium' | 'expert';

// AI Report types
export interface AIReportData {
  id?: string;
  documentId: string;
  documentName: string;
  confidence: number;
  flags: Array<{ text: string; severity: string }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: Array<{ step: string; description: string }>;
  generatedAt: string;
  version: number;
}

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
  purchasedTier: PurchasedTier;

  // Document uploads
  documentUploads: Record<string, DocumentUploadState>;

  // Premium review state
  premiumReview: PremiumReviewState;

  // AI Reports (per-document)
  documentReports: Record<string, AIReportData>;

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
  setPurchasedTier: (tier: PurchasedTier) => void;
  setUserEmail: (email: string | null) => void;
  setDocumentUpload: (docId: string, upload: DocumentUploadState) => void;
  getVerifiedCount: () => number;
  
  // Premium review actions
  setPremiumTier: (tier: PremiumTier) => void;
  setPremiumReviewStatus: (status: ReviewStatus) => void;
  setPremiumReviewResults: (results: Partial<PremiumReviewState>) => void;
  resetPremiumReview: () => void;

  // AI Report actions
  setDocumentReport: (documentId: string, report: AIReportData) => void;
  getDocumentReport: (documentId: string) => AIReportData | undefined;
  clearDocumentReport: (documentId: string) => void;
  
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
  purchasedTier: 'none' as PurchasedTier,
  documentUploads: {} as Record<string, DocumentUploadState>,
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
  documentReports: {} as Record<string, AIReportData>,
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
      setPurchasedTier: (tier) => set({ purchasedTier: tier }),
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

      // AI Report actions
      setDocumentReport: (documentId, report) =>
        set((state) => ({
          documentReports: {
            ...state.documentReports,
            [documentId]: report,
          },
        })),
      getDocumentReport: (documentId) => {
        return get().documentReports[documentId];
      },
      clearDocumentReport: (documentId) =>
        set((state) => {
          const updated = { ...state.documentReports };
          delete updated[documentId];
          return { documentReports: updated };
        }),

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
        purchasedTier: state.purchasedTier,
        // Strip fileData from persisted uploads to avoid localStorage bloat
        documentUploads: Object.fromEntries(
          Object.entries(state.documentUploads).map(([k, v]) => [
            k,
            { status: v.status, feedback: v.feedback, fileName: v.fileName, mimeType: v.mimeType || null },
          ])
        ),
        premiumReview: state.premiumReview,
        documentReports: state.documentReports,
        userEmail: state.userEmail,
      }),
    }
  )
);
