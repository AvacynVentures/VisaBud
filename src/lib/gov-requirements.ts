/**
 * gov-requirements.ts
 * 
 * Official UK Home Office document requirements for visa applications
 * Based on gov.uk guidance as of April 2026
 * 
 * CRITICAL: These are the ACTUAL requirements from UKVI
 * Missing ANY of these = application refusal
 */

export type VisaType = 'spouse' | 'skilled_worker' | 'citizenship';
export type DocumentCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SUPPORTING';

export interface GovernmentRequirement {
  id: string;
  name: string;
  criticality: DocumentCriticality; // CRITICAL = refusal if missing
  required: boolean;
  description: string;
  format: string[];
  notes: string[];
  govukLink?: string;
}

export interface VisaRequirements {
  visaType: VisaType;
  title: string;
  incomeThreshold?: string;
  processingTime: string;
  documents: GovernmentRequirement[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SPOUSE / CIVIL PARTNER VISA (FEBRUARY 2024 RULES + APRIL 2026 UPDATES)
// ─────────────────────────────────────────────────────────────────────────────

export const SPOUSE_REQUIREMENTS: VisaRequirements = {
  visaType: 'spouse',
  title: 'Spouse / Civil Partner Visa',
  incomeThreshold: '£29,000/year OR £16,000+ savings held 6+ months',
  processingTime: '12-16 weeks (standard)',
  documents: [
    // ─── CRITICAL: IDENTITY & ELIGIBILITY ────────────────────────────────
    {
      id: 'passport',
      name: 'Passport (or travel document)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Original or certified copy of your valid passport with biographical data page',
      format: ['Original document', 'Copy certified by a notary or competent official'],
      notes: [
        'Passport must be valid for length of stay',
        'Biographical page (page with your photo) must be clear and readable',
        'If passport is old/faded, Home Office may refuse without asking for clearer copy',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'birth_certificate',
      name: 'Birth Certificate (or equivalent)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Full birth certificate (not short form) OR adoption papers',
      format: ['Original or certified copy', 'Translated into English if not in English'],
      notes: [
        'Must show both parents (short form does NOT show parents)',
        'If not in English, must be translated by certified translator',
        'Required to prove identity and relationship eligibility',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'marriage_cert',
      name: 'Marriage Certificate (or Civil Partnership Cert)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Original or certified copy of marriage/civil partnership certificate',
      format: ['Original or certified copy', 'Translated into English if not in English'],
      notes: [
        'Must be original or certified as true copy',
        'For civil partnerships: certified civil partnership document required',
        'If marriage/partnership in non-English speaking country, translation required',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'divorce_decree',
      name: 'Divorce Decrees or Annulment (if applicable)',
      criticality: 'CRITICAL',
      required: false, // Only if previously married
      description: 'If either partner was previously married, final divorce/annulment decree required',
      format: ['Original or certified copy', 'Translated into English if not in English'],
      notes: [
        'If you or your partner have been married before, this is MANDATORY',
        'Decree Absolute (final) NOT Decree Nisi (interim)',
        'Without this, application will be refused as a matter of law',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },

    // ─── CRITICAL: FINANCIAL EVIDENCE ──────────────────────────────────
    {
      id: 'financial_evidence',
      name: 'Financial Evidence (6 months of bank statements)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Original bank statements or building society statements for 6 consecutive months',
      format: ['Bank statements (official letterhead)', 'Building society statements', 'Online banking printouts (if official)'],
      notes: [
        'MUST be 6 consecutive months (not random months)',
        'Must show regular income deposited',
        'Must be in sponsor\'s name OR joint account with named partner',
        'If self-employed: 6 months + 2 years of tax returns + accountant\'s reference',
        'Payslips alone are NOT sufficient without bank statements',
        'If using savings: must hold £16,000+ for 6+ consecutive months (shown in statements)',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'payslips_tax',
      name: 'Payslips or Tax Returns',
      criticality: 'HIGH',
      required: true,
      description: 'Most recent payslips (usually last 3 months) AND most recent P60 or tax return',
      format: ['Official payslips', 'P60 form from employer', 'Tax return (if self-employed)'],
      notes: [
        'If employed: last 3 payslips + most recent P60',
        'If self-employed: last 2 years tax returns + accountant\'s reference letter',
        'P60 is mandatory (not optional)',
        'Payslips must match the income shown in bank statements',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'employer_letter',
      name: 'Employer Reference Letter (if applicable)',
      criticality: 'MEDIUM',
      required: false, // Recommended but not always required
      description: 'Official letter from employer on company letterhead confirming employment',
      format: ['Original on company letterhead', 'Signed and dated'],
      notes: [
        'Recommended if income is variable or recent',
        'Must confirm: job title, salary, employment start date, permanence of position',
        'Helpful for demonstrating stable income',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },

    // ─── CRITICAL: ACCOMMODATION & RELATIONSHIP PROOF ──────────────────
    {
      id: 'accommodation_proof',
      name: 'Proof of Accommodation',
      criticality: 'CRITICAL',
      required: true,
      description: 'Evidence you have adequate accommodation (living together or will live together)',
      format: ['Tenancy agreement', 'Mortgage statement', 'Council tax bill', 'Utility bills', 'Letter from homeowner'],
      notes: [
        'Must show accommodation is adequate for family size',
        'If renting: tenancy agreement in sponsor\'s name',
        'If own home: mortgage or council tax bill',
        'All documents must be recent (within 6 months)',
        'Does NOT need to be registered address yet if not yet cohabiting',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'cohabitation_evidence',
      name: 'Proof of Cohabitation / Relationship (6+ months)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Evidence you have cohabited as husband and wife (or will immediately after arrival)',
      format: ['Photos together', 'Holiday evidence', 'Joint bills', 'Correspondence', 'Email/message threads'],
      notes: [
        'Must show 6+ months of genuine relationship',
        'Photos: minimum 10-20 recent photos showing you together (not selfies)',
        'Correspondence: meaningful emails, chat logs, letters (NOT just "hello")',
        'Travel evidence: booking confirmations, flight tickets showing joint travel',
        'Holiday photos with dates help establish timeline',
        'THIS IS THE MOST HEAVILY SCRUTINIZED PART - MUST BE THOROUGH',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'utility_bills',
      name: 'Utility Bills (showing address)',
      criticality: 'MEDIUM',
      required: true,
      description: 'Recent utility bills (gas, electric, water, council tax, phone internet) in sponsor\'s name',
      format: ['Official utility bills', 'Council tax bill', 'Broadband/phone bill'],
      notes: [
        'Must be dated within 3 months of application',
        'Must be in sponsor\'s name OR joint names',
        'One bill is minimum; 2-3 are better',
        'Demonstrates address and stability',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },

    // ─── SUPPORTING: RELATIONSHIP DOCUMENTATION ────────────────────────
    {
      id: 'relationship_photos',
      name: 'Relationship Photos & Evidence',
      criticality: 'MEDIUM',
      required: true,
      description: 'Photos, holiday evidence, letters, email correspondence showing genuine relationship',
      format: ['Printed photos', 'Screenshot emails', 'Chat logs', 'Holiday confirmations'],
      notes: [
        'Minimum 10-20 photos (more is better)',
        'Photos with both people visible together',
        'Dated or can be dated from metadata',
        'Correspondence: meaningful messages, not just "hi"',
        'Letters from friends/family corroborating relationship',
        'Holiday booking confirmations, flight tickets, etc.',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'reference_letters',
      name: 'Reference Letters from Friends/Family',
      criticality: 'MEDIUM',
      required: false, // Helpful but not required
      description: 'Letters from people who know you both confirming genuine relationship',
      format: ['Written letters', 'Email letters', 'Signed and dated'],
      notes: [
        'From friends, family, colleagues who know both of you',
        'Should describe length of relationship and observations',
        '3-5 letters are helpful (doesn\'t hurt to have more)',
        'Notarized or on letterhead (optional but helpful)',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'children_docs',
      name: 'Children Documentation (if applicable)',
      criticality: 'HIGH',
      required: false, // Only if children involved
      description: 'Birth certificates for any dependent children',
      format: ['Original or certified copy', 'Translated if not in English'],
      notes: [
        'If either party has dependent children: full birth certificates required',
        'Proof of legal custody/guardianship',
        'Shows family composition for visa assessment',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },

    // ─── SUPPORTING: POLICE & HEALTH ───────────────────────────────────
    {
      id: 'police_clearance',
      name: 'Police Clearance Certificate (if applicable)',
      criticality: 'CRITICAL',
      required: false, // Required if spent 6+ months in any country since age 18
      description: 'Certificate of Good Conduct from any country where you\'ve lived 6+ months since age 18',
      format: ['Official government certificate'],
      notes: [
        'REQUIRED if you\'ve spent 6+ months in any country since age 18 (except UK)',
        'Must be recent (usually within 6 months of application)',
        'Different requirements for each country (check gov.uk guidance)',
        'Missing this when required = automatic refusal',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
    {
      id: 'tuberculosis_test',
      name: 'Tuberculosis (TB) Test Certificate',
      criticality: 'CRITICAL',
      required: false, // Required if from certain countries or stayed 3+ months in UK
      description: 'Medical clearance certificate for TB',
      format: ['Official medical certificate'],
      notes: [
        'REQUIRED if: from high TB prevalence country OR spent 3+ months in UK already',
        'Must be from UKVI-approved testing center',
        'Valid for 6 months from test date',
        'Missing this when required = application refused',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },

    // ─── SUPPORTING: TRANSLATIONS ──────────────────────────────────────
    {
      id: 'translations',
      name: 'Translations (if applicable)',
      criticality: 'CRITICAL',
      required: false, // Required if documents not in English
      description: 'English translations of any documents not in English',
      format: ['Certified translations', 'Translator-certified copies'],
      notes: [
        'ANY document not in English must be translated',
        'Translation must be certified by professional translator',
        'Original language document + translation both required',
        'Missing translations = application rejected',
      ],
      govukLink: 'https://www.gov.uk/uk-family-visa',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILLED WORKER VISA (POINTS-BASED SYSTEM, APRIL 2024+)
// ─────────────────────────────────────────────────────────────────────────────

export const SKILLED_WORKER_REQUIREMENTS: VisaRequirements = {
  visaType: 'skilled_worker',
  title: 'Skilled Worker Visa',
  incomeThreshold: '£38,700/year (or £33,450 for shortage occupations, or £29,000 for PhD holders)',
  processingTime: '3-8 weeks',
  documents: [
    // ─── CRITICAL: IDENTITY ─────────────────────────────────────────────
    {
      id: 'passport',
      name: 'Passport (or travel document)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Valid passport with biographical data page',
      format: ['Original or certified copy'],
      notes: ['Must be valid for duration of visa'],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },

    // ─── CRITICAL: SPONSORSHIP ──────────────────────────────────────────
    {
      id: 'sponsor_letter',
      name: 'Sponsor Licence Certificate & Assignment Letter',
      criticality: 'CRITICAL',
      required: true,
      description: 'UK employer\'s sponsor licence number and assignment letter',
      format: ['Official letter from employer'],
      notes: [
        'Employer must have active UK Sponsor Licence',
        'Assignment letter must include: job title, salary, start date, length of contract',
        'Without this: application CANNOT proceed',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },
    {
      id: 'certificate_of_sponsorship',
      name: 'Certificate of Sponsorship (CoS)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Your employer\'s Certificate of Sponsorship assigning you to the visa',
      format: ['Printed CoS from UK employer'],
      notes: [
        'Must be active and assigned to you personally',
        'Must not be time-expired',
        'Employer confirms you will be paid at least: £38,700/year (standard), £33,450 (shortage occupations), £29,000 (PhD), or £20.97/hour',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },

    // ─── CRITICAL: FINANCIAL PROOF ──────────────────────────────────────
    {
      id: 'maintenance_funds',
      name: 'Maintenance of Funds (£1,270 minimum)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Proof you hold £1,270 in your personal account for 28 consecutive days',
      format: ['Bank statements'],
      notes: [
        'Must be held in YOUR personal account (not employer\'s)',
        'Must be continuously held for 28 days before application',
        'Must still be in account on date of application',
        'Less than £1,270 = automatic refusal',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },
    {
      id: 'salary_evidence',
      name: 'Salary Evidence (payslips/employment contract)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Evidence you meet salary requirement from this or previous employment',
      format: ['Payslips', 'Employment contract', 'Offer letter', 'P60', 'Tax return'],
      notes: [
        'Must prove you will earn threshold salary in new role',
        'If moving internally within company: offer letter or assignment',
        'If already in UK: 3 months payslips showing salary meets threshold',
        'Salary shortfalls = very difficult to overcome',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },

    // ─── SUPPORTING: EDUCATION/QUALIFICATIONS ───────────────────────────
    {
      id: 'qualifications',
      name: 'Qualifications & Education Evidence',
      criticality: 'MEDIUM',
      required: false, // Required if points claimed for qualifications
      description: 'Diplomas, degrees, or professional certifications',
      format: ['Original or certified copies', 'Translated if not in English'],
      notes: [
        'Required if claiming points for specific qualifications',
        'University degrees must be verified through official channels',
        'Professional certifications (e.g., engineering, nursing) need registration proof',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },

    // ─── SUPPORTING: ACCOMMODATION ──────────────────────────────────────
    {
      id: 'accommodation_proof',
      name: 'Accommodation Evidence',
      criticality: 'MEDIUM',
      required: false, // Helpful but not always required
      description: 'Where you will live in the UK',
      format: ['Tenancy agreement', 'Letter from employer', 'House details'],
      notes: [
        'Helpful to show but not always required',
        'If provided: must be adequate for living',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },

    // ─── CRITICAL: HEALTH & SECURITY ────────────────────────────────────
    {
      id: 'tuberculosis_test',
      name: 'Tuberculosis (TB) Test Certificate',
      criticality: 'CRITICAL',
      required: false, // Required if from high TB prevalence country
      description: 'Medical clearance for TB',
      format: ['Official medical certificate'],
      notes: [
        'REQUIRED if from high TB prevalence country',
        'Must be from UKVI-approved test center',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },
    {
      id: 'police_clearance',
      name: 'Police Clearance Certificate (if applicable)',
      criticality: 'CRITICAL',
      required: false, // Required if applicable
      description: 'Certificate of Good Conduct',
      format: ['Official government certificate'],
      notes: [
        'REQUIRED if spent 6+ months in certain countries since age 18',
        'Missing when required = automatic refusal',
      ],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },

    // ─── SUPPORTING: TRANSLATIONS ───────────────────────────────────────
    {
      id: 'translations',
      name: 'Translations (if applicable)',
      criticality: 'CRITICAL',
      required: false, // Required if documents not in English
      description: 'English translations of non-English documents',
      format: ['Certified translations'],
      notes: ['Any non-English document must be professionally translated'],
      govukLink: 'https://www.gov.uk/skilled-worker-visa',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CITIZENSHIP (NATURALISATION) — 5+ YEARS RESIDENCY
// ─────────────────────────────────────────────────────────────────────────────

export const CITIZENSHIP_REQUIREMENTS: VisaRequirements = {
  visaType: 'citizenship',
  title: 'British Citizenship',
  processingTime: '6-12 months',
  documents: [
    // ─── CRITICAL: IDENTITY ─────────────────────────────────────────────
    {
      id: 'passport',
      name: 'Passport',
      criticality: 'CRITICAL',
      required: true,
      description: 'Current valid passport',
      format: ['Original'],
      notes: ['Required for identity verification'],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },
    {
      id: 'birth_certificate',
      name: 'Birth Certificate',
      criticality: 'CRITICAL',
      required: true,
      description: 'Original birth certificate (full, not short form)',
      format: ['Original or certified copy', 'Translated if not in English'],
      notes: ['Must show both parents'],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },

    // ─── CRITICAL: RESIDENCY PROOF ──────────────────────────────────────
    {
      id: 'council_tax_bills',
      name: 'Council Tax Bills (5 years)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Council tax bills for all 5 years of residency',
      format: ['Official council tax bills'],
      notes: [
        'Must cover full 5-year period (usually 60 months)',
        'If bills in partner\'s name: need marriage certificate + evidence of cohabitation',
        'Gaps in bills require explanation',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },
    {
      id: 'tenancy_agreements',
      name: 'Tenancy Agreements (if renting)',
      criticality: 'CRITICAL',
      required: false, // Only if renting, not homeowner
      description: 'Tenancy agreement(s) covering 5-year period',
      format: ['Original or certified copies'],
      notes: [
        'Required if you\'ve been renting during the 5 years',
        'If renting: must show continuous tenancy OR succession of tenancies',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },
    {
      id: 'utility_bills',
      name: 'Utility Bills (gas, electric, water, etc.)',
      criticality: 'HIGH',
      required: true,
      description: 'Utility bills from different providers showing 5-year residence',
      format: ['Official bills'],
      notes: [
        'At least 2-3 different utilities recommended',
        'Helps corroborate continuous residence',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },

    // ─── CRITICAL: LANGUAGE & KNOWLEDGE ────────────────────────────────
    {
      id: 'english_test',
      name: 'English Language Test Certificate',
      criticality: 'CRITICAL',
      required: true,
      description: 'Proof of English language proficiency (B1 CEFR level)',
      format: ['Official test certificate'],
      notes: [
        'Must be B1 level (intermediate) or above',
        'Accepted tests: IELTS, Trinity, Cambridge, others on approved list',
        'Must be from accredited provider',
        'Exemptions: if native English speaker or degree-educated in English',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },
    {
      id: 'life_in_uk_test',
      name: 'Life in the UK Test Certificate',
      criticality: 'CRITICAL',
      required: true,
      description: 'Pass certificate from approved Life in the UK test provider',
      format: ['Official test certificate'],
      notes: [
        'Must pass official test (36/24 questions minimum)',
        'Test must be taken at approved test center',
        'Certificate must accompany application',
        'Failing = application delayed until retest passed',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },

    // ─── CRITICAL: ABSENCE RECORD ───────────────────────────────────────
    {
      id: 'travel_history',
      name: 'Travel Records (proving absences < 450 days)',
      criticality: 'CRITICAL',
      required: true,
      description: 'Proof of all absences from UK during 5-year period (max 450 days allowed)',
      format: ['Passport stamps', 'Travel tickets', 'Bank statements', 'Employment records'],
      notes: [
        'Maximum 450 days absent during 5 years (rough: <90 days/year)',
        'More than 450 days = application delayed/refused',
        'Absences <14 consecutive days may have reduced impact if explained',
        'Use passport stamps + travel tickets to document',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },

    // ─── SUPPORTING: CHARACTER & CONDUCT ────────────────────────────────
    {
      id: 'police_clearance',
      name: 'Police Clearance Certificate',
      criticality: 'CRITICAL',
      required: false, // Required if spent 6+ months in certain countries
      description: 'Certificate of Good Conduct from relevant countries',
      format: ['Official government certificates'],
      notes: [
        'REQUIRED if: spent 6+ months in any country (except UK) since age 18',
        'Different rules for different countries',
        'Must be recent (usually within 6 months)',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },
    {
      id: 'criminal_record',
      name: 'Disclosure of Any Criminal Record',
      criticality: 'CRITICAL',
      required: true,
      description: 'Declaration of any criminal convictions (anywhere in world)',
      format: ['Written declaration'],
      notes: [
        'Must declare ALL convictions, even if minor',
        'Non-disclosure = grounds for refusal or revocation later',
        'Character requirement is strict for citizenship',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },

    // ─── SUPPORTING: FINANCIAL STABILITY ────────────────────────────────
    {
      id: 'financial_evidence',
      name: 'Evidence of Financial Stability (optional)',
      criticality: 'MEDIUM',
      required: false, // Helpful but not always required
      description: 'Bank statements, employment records showing financial stability',
      format: ['Bank statements', 'Employment letters', 'Tax records'],
      notes: [
        'Helpful to show you can support yourself',
        'Not always required but strengthens application',
      ],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },

    // ─── SUPPORTING: TRANSLATIONS ───────────────────────────────────────
    {
      id: 'translations',
      name: 'Translations (if applicable)',
      criticality: 'CRITICAL',
      required: false, // Required if documents not in English
      description: 'English translations of non-English documents',
      format: ['Certified translations'],
      notes: ['All non-English documents must be professionally translated'],
      govukLink: 'https://www.gov.uk/becoming-a-british-citizen',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT HELPER: Get requirements by visa type
// ─────────────────────────────────────────────────────────────────────────────

export function getRequirements(visaType: VisaType): VisaRequirements {
  switch (visaType) {
    case 'spouse':
      return SPOUSE_REQUIREMENTS;
    case 'skilled_worker':
      return SKILLED_WORKER_REQUIREMENTS;
    case 'citizenship':
      return CITIZENSHIP_REQUIREMENTS;
    default:
      throw new Error(`Unknown visa type: ${visaType}`);
  }
}

/**
 * Get critical documents (missing = refusal)
 */
export function getCriticalDocuments(visaType: VisaType): GovernmentRequirement[] {
  const reqs = getRequirements(visaType);
  return reqs.documents.filter(doc => doc.criticality === 'CRITICAL');
}

/**
 * Check if a document is truly required (not just helpful)
 */
export function isDocumentRequired(visaType: VisaType, docId: string): boolean {
  const reqs = getRequirements(visaType);
  const doc = reqs.documents.find(d => d.id === docId);
  return doc?.required ?? false;
}
