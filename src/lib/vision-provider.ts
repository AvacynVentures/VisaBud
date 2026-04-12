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

/**
 * Every vision provider must implement both validation tiers.
 */
export interface VisionProvider {
  readonly name: string;

  /** Free-tier: quick pass/fail check */
  validateDocument(input: ValidateDocumentInput): Promise<ValidationResult>;

  /** Premium-tier: deep review with risk scoring */
  premiumReview(input: PremiumReviewInput): Promise<PremiumValidationResult>;
}
