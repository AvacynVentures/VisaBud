// ─── Vision Provider Abstraction ─────────────────────────────────────────────
// Swap between Claude and OpenAI with a single env var: VISION_PROVIDER

export interface DocumentIssue {
  type: 'clarity' | 'completeness' | 'validity' | 'format' | 'expiry' | 'mismatch';
  severity: 'high' | 'medium' | 'low';
  message: string;
  fix: string;
}

/** Result from the basic free-tier validation */
export interface ValidationResult {
  valid: boolean;
  feedback: string;
  provider: string;
  latencyMs: number;
  pendingValidation?: boolean;    // True when AI was unavailable
  analysisComplete?: boolean;     // False when result is a fallback
  error?: string;
}

/** Result from premium document review */
export interface PremiumValidationResult {
  riskLevel: 'high' | 'medium' | 'low';
  confidenceScore: number;        // 0-100
  feedback: string;
  issues: DocumentIssue[];
  positives: string[];
  provider: string;
  latencyMs: number;
  analysisComplete?: boolean;     // False when result is a fallback
  error?: string;
  dimensions?: DimensionScore;    // Structured scoring breakdown
}

/** Structured scoring dimensions — code calculates final score from these */
export interface DimensionScore {
  relevance: { score: number; evidence: string };
  completeness: { score: number; evidence: string };
  clarity: { score: number; evidence: string };
  validity: { score: number; evidence: string };
}

/** Document classification result — gate before quality analysis */
export interface ClassificationResult {
  isDocument: boolean;
  isVisaRelevant: boolean;
  detectedType: string | null;
  matchesRequirement: boolean;
  explanation: string;
}

/** Input for document classification */
export interface ClassifyDocumentInput {
  image: string;         // base64
  requirement?: string;
  mimeType?: string;
}

/** Context for basic validation */
export interface ValidateDocumentInput {
  image: string;         // base64
  requirement: string;
  mimeType?: string;
}

/** Context for premium review */
export interface PremiumReviewInput {
  image: string;         // base64
  mimeType: string;
  docId: string;
  docTitle: string;
  requirement: string;
  visaType: string;
}

/** Checklist item for ai-confidence endpoint */
export interface RequirementChecklistItem {
  requirement: string;
  met: boolean;
  evidence: string;
  suggestedFix?: string | null;
}

/** Checklist result replacing SWOT */
export interface DocumentChecklist {
  items: RequirementChecklistItem[];
  overallScore: number;
  criticalMissing: string[];
  nextSteps: string[];
  provider: string;
  latencyMs: number;
}

/**
 * Every vision provider must implement all validation tiers.
 */
export interface VisionProvider {
  readonly name: string;

  /** Classification gate: is this even a visa document? */
  classifyDocument(input: ClassifyDocumentInput): Promise<ClassificationResult>;

  /** Free-tier: quick pass/fail check */
  validateDocument(input: ValidateDocumentInput): Promise<ValidationResult>;

  /** Premium-tier: deep review with risk scoring */
  premiumReview(input: PremiumReviewInput): Promise<PremiumValidationResult>;
}
