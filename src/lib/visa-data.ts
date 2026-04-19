// =============================================================================
// visa-data.ts - VisaBud Complete Content Layer
// All visa types, checklists, timelines, risk rules, and submission info.
// Standalone constants - no imports required.
// =============================================================================

// -----------------------------------------------------------------------------
// Types (local to this file - consumers can import from types.ts if needed)
// -----------------------------------------------------------------------------

export type VisaTypeKey = 'spouse' | 'skilled_worker' | 'citizenship';
export type Priority = 'critical' | 'important' | 'nice-to-have';
export type UrgencyKey = 'urgent' | 'normal' | 'ahead';
export type RiskSeverity = 'low' | 'medium' | 'high';
export type DocumentCategory = 'personal' | 'financial' | 'supporting';

export interface VisaTypeInfo {
  key: VisaTypeKey;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  govFee: string;
  ihsSurcharge: string;
  processingTime: string;
  priorityAvailable: boolean;
  priorityFee: string | null;
  keyRequirements: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  required: boolean;
  priority: Priority;
  formatRequired: string;
  tips: string;
  displayOrder: number;
  /** Official government link for this document requirement */
  govLink?: string;
  /** Official requirement text from gov.uk */
  officialRequirement?: string;
  /** Common mistakes to avoid */
  commonMistakes?: string[];
  /** Best practice tips from immigration advisors */
  bestPractices?: string[];
}

export interface TimelineWeek {
  week: number;
  title: string;
  actions: string[];
  deadline: string;
  notes: string;
}

export interface RiskRule {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  recommendation: string;
  conditions: {
    visaTypes: VisaTypeKey[];
    incomeRange?: string[];
    urgency?: UrgencyKey[];
    currentlyInUk?: boolean;
    relationshipDurationMonths?: { max?: number; min?: number };
    employmentStatus?: string[];
    nationality?: string[];
    hasPreviousRefusal?: boolean;
    hasPreviousOverstay?: boolean;
  };
}

export interface SubmissionStep {
  order: number;
  title: string;
  description: string;
  icon: string;
}

export interface SubmissionInfo {
  visaType: VisaTypeKey;
  summaryIntro: string;
  applicationUrl: string;
  steps: SubmissionStep[];
  importantNotes: string[];
  contactInfo: {
    name: string;
    url: string;
    phone: string;
    hours: string;
  };
}

// -----------------------------------------------------------------------------
// VISA TYPES - Core reference for each route
// -----------------------------------------------------------------------------

export const VISA_TYPES: Record<VisaTypeKey, VisaTypeInfo> = {
  spouse: {
    key: 'spouse',
    label: 'Spouse / Partner Visa',
    shortLabel: 'Spouse Visa',
    icon: '💑',
    description:
      'For partners of British citizens or settled persons. Your UK-based partner sponsors your application. The minimum income threshold is £29,000/year (combined income) or equivalent savings.',
    govFee: '£2,064 (outside UK) / £1,407 (inside UK)',
    ihsSurcharge: '£1,035/year (£3,105 for 2 years 9 months)',
    processingTime: '12 weeks (outside UK) / 8 weeks (inside UK) / ~12 months (if not meeting financial requirements)',
    priorityAvailable: true,
    priorityFee: '£1,000 (super priority, inside UK only)',
    keyRequirements: [
      'Sponsor earns £29,000+/year or has £62,500+ in savings',
      'Genuine and subsisting relationship',
      'Adequate accommodation (not overcrowded)',
      'English language at A1 level or above',
      'No unspent criminal convictions',
      'TB test certificate (if from listed country)',
    ],
  },

  skilled_worker: {
    key: 'skilled_worker',
    label: 'Skilled Worker Visa',
    shortLabel: 'Skilled Worker',
    icon: '💼',
    description:
      'For people with a confirmed job offer from a UK employer who holds a valid sponsor licence. The general salary threshold is £38,700/year, though some occupations have lower going rates. Check the specific eligibility for your job.',
    govFee: '£819-£1,618 (outside UK) / £943-£1,865 (inside UK) - lower if on immigration salary list',
    ihsSurcharge: '£1,035/year',
    processingTime: '3 weeks (outside UK) / 8 weeks (inside UK)',
    priorityAvailable: true,
    priorityFee: 'Varies - you\'ll be told if faster processing is available when you apply',
    keyRequirements: [
      'Valid Certificate of Sponsorship (CoS) from licensed employer',
      'Job at RQF Level 3+ (A-level equivalent or above)',
      'Salary meets minimum threshold - general is £38,700+ but varies by occupation and CoS date (check going rate for your specific SOC code)',
      'English language at B1 level (CEFR)',
      'Maintenance funds of £1,270 held for 28+ consecutive days (unless employer certifies)',
      'Criminal record certificate (if role involves vulnerable persons)',
    ],
  },

  citizenship: {
    key: 'citizenship',
    label: 'British Citizenship (Naturalisation)',
    shortLabel: 'Citizenship',
    icon: '🏛️',
    description:
      'For people who have lived in the UK for 5+ years and held ILR or settled status for at least 12 months (or 3 years residence if married to a British citizen). No income requirement, but strict character and residency tests apply.',
    govFee: '£1,839 (includes £130 ceremony fee)',
    ihsSurcharge: 'N/A',
    processingTime: '6 months (standard)',
    priorityAvailable: false,
    priorityFee: null,
    keyRequirements: [
      '5 years continuous lawful residence (3 if married to British citizen)',
      'Must have held ILR or settled status for at least 12 months',
      'No more than 450 days outside UK in 5-year period',
      'No more than 90 days outside UK in final 12 months',
      'Must be physically present in UK exactly 5 years before application received',
      'Good character - no serious criminal convictions',
      'Life in the UK test passed',
      'English language at B1 level or above (or Welsh/Scottish Gaelic)',
    ],
  },
};

// -----------------------------------------------------------------------------
// CHECKLISTS - Per visa type, every document needed
// -----------------------------------------------------------------------------

export const CHECKLISTS: Record<VisaTypeKey, ChecklistItem[]> = {
  // =========================================================================
  // SPOUSE / PARTNER VISA
  // =========================================================================
  spouse: [
    // --- Personal Documents ---
    {
      id: 'sp-passport',
      title: 'Valid Passport',
      description:
        'Your current passport with at least 6 months validity remaining. Include all previous passports showing travel history.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original + colour copy of every page (including blank pages)',
      tips: 'If your passport expires within 6 months of your intended travel date, renew it before applying. Old passports help show travel history.',
      displayOrder: 1,
      govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply',
      officialRequirement: 'You must provide your current valid passport or other valid travel document. You must also provide any previous passports you hold.',
      commonMistakes: ['Not including blank pages', 'Passport expiring within 6 months', 'Missing previous passports'],
      bestPractices: ['Scan every page including blank ones', 'Use colour scans at 300 DPI minimum', 'Include all old passports even if expired'],
    },
    {
      id: 'sp-biometrics',
      title: 'Biometric Enrolment Confirmation',
      description:
        'Proof you have enrolled your fingerprints and photograph at a Visa Application Centre (VAC) or via the UK Immigration: ID Check app. You can only book this AFTER submitting your online application.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Digital confirmation or appointment receipt',
      tips: 'You can only book biometrics AFTER submitting your online application. Once submitted, book immediately - slots fill up fast, especially Jan-Mar.',
      displayOrder: 2,
      govLink: 'https://www.gov.uk/find-a-visa-application-centre',
      officialRequirement: 'Once you submit your visa application, UKVI will ask you to book and attend a biometrics appointment. You will receive an appointment confirmation receipt.',
      commonMistakes: ['Trying to book before submitting online application', 'Waiting too long after submission to book', 'Going to wrong VAC location', 'Not bringing required documents to appointment'],
      bestPractices: ['Book within 24 hours of online submission', 'Research VAC locations and availability before you submit', 'Bring passport and application confirmation to appointment'],
    },
    {
      id: 'sp-photos',
      title: 'Passport-Style Photographs',
      description:
        'Passport-style photos taken within the last month. For online applications: digital photo (min 600×750 pixels, 50KB-10MB). For paper applications: 2 identical printed photos (45mm × 35mm).',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Digital photo for online applications (600×750px min, 50KB-10MB) OR 2 printed photos (45mm × 35mm) for paper forms',
      tips: 'Photo booth or professional service recommended - these are more likely to be approved. You can use your own device but have someone else take the photo. Do not wear glasses unless medically required.',
      displayOrder: 3,
      govLink: 'https://www.gov.uk/photos-for-passports',
      commonMistakes: ['Photos older than 1 month (gov.uk requires taken in the last month)', 'Wearing glasses (not allowed unless medically required)', 'Wrong background (must be plain light colour - white, cream, or light grey)', 'Shadows on face or behind you'],
      bestPractices: ['Use a photo booth or professional service for best approval odds', 'Plain light-coloured background (white, cream, or light grey)', 'Plain expression, mouth closed, eyes open and visible', 'No head coverings unless for religious or medical reasons', 'Digital: at least 600×750 pixels, 50KB-10MB'],
    },
    {
      id: 'sp-tb-test',
      title: 'TB Test Certificate',
      description:
        'Tuberculosis test result from an approved clinic. Required if you are applying from a listed country (most of Africa, South Asia, etc.).',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original certificate from approved clinic',
      tips: 'Check gov.uk for the list of countries requiring TB tests. The certificate is valid for 6 months from the test date.',
      displayOrder: 4,
      govLink: 'https://www.gov.uk/tb-test-visa',
      officialRequirement: 'If you are applying from a country where TB screening is required, you must provide a valid TB test certificate from an approved clinic.',
      commonMistakes: ['Certificate expired (valid only 6 months)', 'Using non-approved clinic', 'Not checking if your country requires it'],
      bestPractices: ['Schedule early - some clinics have long waits', 'Check approved clinic list on gov.uk', 'Keep original certificate safe'],
    },
    {
      id: 'sp-english-lang',
      title: 'English Language Certificate',
      description:
        'Evidence of English at A1 level (speaking and listening). Accepted: IELTS Life Skills A1, Trinity GESE Grade 2, or nationality exemption.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original certificate from approved SELT provider',
      tips: 'Exempt if: national of a listed majority English-speaking country (USA, Australia, Canada, NZ, etc.), over 65, or have a physical/mental condition preventing you from meeting the requirement. A UK degree or a non-UK degree taught in English (with Ecctis confirmation) also qualifies.',
      displayOrder: 5,
      govLink: 'https://www.gov.uk/uk-family-visa/knowledge-of-language-and-life-in-the-uk',
      officialRequirement: 'You must prove your knowledge of the English language when you apply. For spouse visa initial application, you need A1 level (speaking and listening).',
      commonMistakes: ['Taking wrong test (must be on approved SELT list)', 'Test certificate expired', 'Not checking nationality exemptions'],
      bestPractices: ['Check if exempt by nationality first', 'Book IELTS Life Skills A1 specifically', 'Certificate must be within 2 years of test date'],
    },
    {
      id: 'sp-marriage-cert',
      title: 'Marriage or Civil Partnership Certificate',
      description:
        'Official marriage/civil partnership certificate. If in a language other than English, include a certified translation.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original + certified English translation if applicable',
      tips: 'Unmarried partners: provide evidence of 2+ years of cohabitation instead (utility bills, joint tenancy, etc.).',
      displayOrder: 6,
      govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply',
      officialRequirement: 'You must provide evidence of your marriage or civil partnership, or evidence of living together for at least 2 years if unmarried partners.',
      commonMistakes: ['No certified translation for non-English documents', 'Using photocopy instead of original', 'Missing apostille for overseas certificates'],
      bestPractices: ['Use a certified translator (not family member)', 'Keep original and translation together', 'Get apostille if married overseas'],
    },
    {
      id: 'sp-previous-visas',
      title: 'Previous UK Visa / Immigration History',
      description:
        'Copies of all previous UK visas, BRPs, entry stamps, and any refusal letters. Disclose everything - undisclosed refusals are a common reason for rejection. If you have no previous visa history, simply confirm this on the application form - no documents needed for this item.',
      category: 'personal',
      required: false,
      priority: 'important',
      formatRequired: 'Colour copies of all relevant documents (if applicable). If none, confirm on the form.',
      tips: 'If you have previous visas: include refusals and curtailments from ANY country, not just the UK. Honesty is critical - omissions are treated as deception. If this is your first ever visa application, you can skip this item - just answer honestly on the form.',
      displayOrder: 7,
      govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply',
      commonMistakes: ['Omitting refusals from other countries', 'Not including curtailment notices', 'Missing old BRP copies'],
      bestPractices: ['Disclose ALL previous visas and refusals from every country', 'Include both sides of BRPs', 'Chronological order helps caseworkers'],
    },

    // --- Financial Documents ---
    {
      id: 'sp-sponsor-payslips',
      title: "Sponsor's Payslips (6 months)",
      description:
        'Your UK partner\'s last 6 months of payslips showing a gross annual salary of at least £29,000.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Original payslips or employer-issued copies (not screenshots)',
      tips: 'If your partner started a new job recently, you need 6 months in that role OR a combination of Cat A (6 months same employer) and Cat B (variable income) evidence.',
      displayOrder: 10,
      govLink: 'https://www.gov.uk/uk-family-visa/proof-income',
      officialRequirement: 'You must show a gross annual income of at least £29,000 from employment. Provide payslips for the last 6 months from the same employer.',
      commonMistakes: ['Screenshots instead of official payslips', 'Payslips not covering full 6-month period', 'Salary not matching bank statement credits'],
      bestPractices: ['Cross-reference each payslip with bank statement', 'Get employer-stamped copies if originals lost', 'Ensure gross (not net) salary meets threshold'],
    },
    {
      id: 'sp-sponsor-employer-letter',
      title: "Sponsor's Employer Letter",
      description:
        'Letter from sponsor\'s employer on headed paper confirming: job title, salary, start date, and type of contract (permanent/fixed). Must be dated within 28 days of application.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Original letter on company letterhead, signed and dated',
      tips: 'The letter MUST include: employee name, job title, gross annual salary, employment start date, and contract type. Missing any of these = refusal risk.',
      displayOrder: 11,
      govLink: 'https://www.gov.uk/uk-family-visa/proof-income',
      officialRequirement: 'The employer letter must confirm: the person\'s employment, their gross annual salary, their period of employment, and the type of employment (permanent, fixed-term etc.).',
      commonMistakes: ['Letter dated more than 28 days before application', 'Missing one of the required fields', 'Not on official company letterhead'],
      bestPractices: ['Give HR a template listing all required fields', 'Request letter no more than 2 weeks before submission', 'Ensure signature matches a named individual'],
    },
    {
      id: 'sp-sponsor-bank-statements',
      title: "Sponsor's Bank Statements (6 months)",
      description:
        'Last 6 months of bank statements showing salary credits that match the payslips. Must show the account holder name, sort code, and account number.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Official bank statements (stamped or digitally verified by the bank)',
      tips: 'Online printouts are NOT accepted unless stamped by the bank. Request official statements from your branch or use the bank\'s certified PDF service.',
      displayOrder: 12,
      govLink: 'https://www.gov.uk/uk-family-visa/proof-income',
      officialRequirement: 'Bank statements must cover the same period as the payslips, show the account holder name, sort code, account number, and corresponding salary deposits.',
      commonMistakes: ['Using online printouts without bank stamp', 'Bank statements not matching payslip period', 'Salary credits not matching payslip amounts'],
      bestPractices: ['Request official stamped statements from your bank branch', 'Highlight salary credits on each statement', 'Ensure full 6-month period is covered with no gaps'],
    },
    {
      id: 'sp-savings-evidence',
      title: 'Cash Savings Evidence (if income below £29,000)',
      description:
        'If your sponsor earns below £29,000, you need cash savings of £62,500+ held for 28 consecutive days. Provide bank statements covering 28+ days plus the date of application.',
      category: 'financial',
      required: false,
      priority: 'important',
      formatRequired: 'Official bank statements covering the full 28-day period',
      tips: 'The formula is: (£29,000 - actual income) × 2.5 = required savings. Funds must be accessible (not locked in pensions, property, or investments).',
      displayOrder: 13,
      govLink: 'https://www.gov.uk/uk-family-visa/proof-income',
      commonMistakes: ['Dipping below threshold during 28-day period', 'Using locked funds (pensions, ISAs)', 'Not covering full 28 consecutive days'],
      bestPractices: ['Keep funds untouched for at least 35 days (buffer)', 'Use accessible savings accounts only', 'Get official bank letter confirming balance if possible'],
    },
    {
      id: 'sp-self-employed-accounts',
      title: 'Self-Employment Evidence (if self-employed sponsor)',
      description:
        'If your sponsor is self-employed: last 2 years of tax returns (SA302 + tax year overviews), accountant letter, business bank statements, and evidence of ongoing trading.',
      category: 'financial',
      required: false,
      priority: 'important',
      formatRequired: 'HMRC SA302 + tax year overviews + accountant letter on headed paper',
      tips: 'Self-employed applications are more complex and have higher refusal rates. Consider getting an immigration solicitor to review before submitting.',
      displayOrder: 14,
      govLink: 'https://www.gov.uk/uk-family-visa/proof-income',
      commonMistakes: ['Missing SA302 or tax year overview', 'Accountant letter not on headed paper', 'Business bank statements not covering full period'],
      bestPractices: ['Get accountant letter dated within 28 days of application', 'Include both SA302 AND tax year overview for each year', 'Consider professional immigration review for self-employment cases'],
    },

    // --- Supporting / Relationship Evidence ---
    {
      id: 'sp-relationship-photos',
      title: 'Relationship Photographs',
      description:
        'Selection of photographs showing you together at different times and places. Include dates and descriptions on the back or in an index.',
      category: 'supporting',
      required: true,
      priority: 'important',
      formatRequired: 'Printed photos with written dates/descriptions, or a digital album with captions',
      tips: 'Quality over quantity. 15-20 photos spanning your entire relationship. Show: holidays, family events, daily life. Metadata-intact digital photos are strongest.',
      displayOrder: 20,
      govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply',
    },
    {
      id: 'sp-communication-evidence',
      title: 'Communication History',
      description:
        'Evidence of regular communication: WhatsApp/message screenshots, call logs, video call records. Essential for couples who lived apart.',
      category: 'supporting',
      required: true,
      priority: 'important',
      formatRequired: 'Printed screenshots with dates visible, organised chronologically',
      tips: 'Show consistent communication across the relationship timeline. Gaps of 2+ weeks without contact may raise questions. Include a mix of message types.',
      displayOrder: 21,
      govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply',
    },
    {
      id: 'sp-cohabitation-proof',
      title: 'Cohabitation / Shared Address Proof',
      description:
        'Evidence you live together. Must come from a government body, bank, landlord, utility provider, or medical professional, and be less than 4 years old. Accepted: tenancy agreement, utility/Council Tax bills at same address, joint bank account statement, or letter from doctor/dentist confirming same address.',
      category: 'supporting',
      required: true,
      priority: 'important',
      formatRequired: 'Original documents or certified copies - must be less than 4 years old and from an official source',
      tips: 'The more overlap in names + address, the better. Joint bank account statements are strong evidence. If you don\'t live together (e.g., due to work, study, or cultural reasons), provide evidence of: regular communication, financial support for each other, time spent together (holidays, events), and care for any shared children.',
      displayOrder: 22,
      govLink: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    },
    {
      id: 'sp-accommodation-evidence',
      title: 'Accommodation Evidence',
      description:
        'Proof that you have adequate housing in the UK. Tenancy agreement, mortgage statement, or letter from your landlord confirming you can live at the property. Council Tax bill at the address also helps.',
      category: 'supporting',
      required: true,
      priority: 'important',
      formatRequired: 'Tenancy agreement or mortgage statement + Council Tax bill at the address',
      tips: 'If living with family or friends, get a letter from the homeowner/tenant confirming you have permission to stay and that the property is not overcrowded. Include the number of rooms and current occupants.',
      displayOrder: 23,
      govLink: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    },
    {
      id: 'sp-sponsor-id',
      title: "Sponsor's Identity Documents",
      description:
        "Your UK partner's British passport or proof of settled status (ILR/BRP). Must prove they have the right to sponsor you.",
      category: 'supporting',
      required: true,
      priority: 'critical',
      formatRequired: 'Colour copy of passport bio page + BRP (both sides) if applicable',
      tips: 'If your sponsor naturalised, include their naturalisation certificate. If they have status under the EU Settlement Scheme, include their share code.',
      displayOrder: 24,
      govLink: 'https://www.gov.uk/uk-family-visa/documents-youll-need-to-apply',
    },
    {
      id: 'sp-cover-letter',
      title: 'Cover Letter / Statement of Intent',
      description:
        'A clear, concise letter explaining your relationship history, how you met, why you are applying, and your plans in the UK. Not required but strongly recommended.',
      category: 'supporting',
      required: false,
      priority: 'nice-to-have',
      formatRequired: 'Typed letter, 1-2 pages, signed and dated',
      tips: 'Keep it factual and chronological. Include: how you met, key milestones (moving in, engagement, marriage), and future plans. Do not make it overly emotional.',
      displayOrder: 25,
    },
    {
      id: 'sp-third-party-letters',
      title: 'Letters from Family/Friends',
      description:
        'Supporting letters from people who know your relationship. They should describe how they know you, how long, and their observations of your relationship.',
      category: 'supporting',
      required: false,
      priority: 'nice-to-have',
      formatRequired: 'Signed letters with writer\'s ID copy attached',
      tips: 'Get 2-4 letters from different people (both sides of the relationship). Each letter should include their full name, relationship to you, and a copy of their ID.',
      displayOrder: 26,
    },
    {
      id: 'sp-children-dependants',
      title: 'Children as Dependants (if applicable)',
      description:
        'If you are applying with children under 18 (or who were under 18 when first granted leave), they can be added as dependants. Each child needs their own documents and incurs additional fees. Skip this item if you have no children applying with you.',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Per child: passport, birth certificate, consent from other parent (if applicable)',
      tips: 'Each child costs an additional £2,064 (outside UK) / £1,407 (inside UK) plus IHS (£1,940-£3,880 depending on visa duration). Documents needed per child: valid passport, birth certificate (proving relationship to you), and written consent from the other parent if they are not travelling with the child. If you have sole custody, provide the court order. For complex custody situations, seek professional immigration advice before applying.',
      displayOrder: 27,
      govLink: 'https://www.gov.uk/uk-family-visa/child',
      commonMistakes: ['Forgetting to include consent from the other parent', 'Not including birth certificate for each child', 'Underbudgeting - each child has separate fees + IHS'],
      bestPractices: ['Budget £2,064 + IHS per child before starting', 'Get written consent from the other parent early - this can take time', 'If separated/divorced, include custody court orders', 'Children 18+ have different rules - check gov.uk/uk-family-visa/child'],
    },
  ],

  // =========================================================================
  // SKILLED WORKER VISA
  // =========================================================================
  skilled_worker: [
    // --- Personal Documents ---
    {
      id: 'sw-passport',
      title: 'Valid Passport',
      description:
        'Current passport with at least 6 months validity. Include all previous passports if available.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original + colour copy of bio page and all stamped pages',
      tips: 'Ensure your name on the passport matches exactly what your employer used on the Certificate of Sponsorship. Even minor differences cause delays.',
      displayOrder: 1,
      govLink: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
      officialRequirement: 'You must provide a current passport or other valid travel document.',
      commonMistakes: ['Name mismatch between passport and CoS', 'Not including stamped pages', 'Passport expiring within 6 months'],
      bestPractices: ['Check name matches CoS exactly', 'Scan bio page and all stamped pages in colour', 'Renew if expiring within 6 months'],
    },
    {
      id: 'sw-biometrics',
      title: 'Biometric Enrolment Confirmation',
      description:
        'Fingerprints and photograph via VAC appointment or UK Immigration: ID Check app. You can only book this AFTER submitting your online application.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Digital confirmation or appointment receipt',
      tips: 'You can only book biometrics AFTER submitting your online application. If applying from inside the UK, the ID Check app is faster. Outside UK, book the VAC appointment immediately after submission.',
      displayOrder: 2,
      govLink: 'https://www.gov.uk/biometric-residence-permits',
    },
    {
      id: 'sw-photos',
      title: 'Passport-Style Photographs',
      description: 'Passport-style photos taken within the last month. For online applications: digital photo (min 600×750 pixels, 50KB-10MB). For paper applications: 2 identical printed photos (45mm × 35mm).',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Digital photo for online applications (600×750px min, 50KB-10MB) OR 2 printed photos (45mm × 35mm) for paper forms',
      tips: 'Photo booth or professional service recommended. Plain light-coloured background (white, cream, or light grey). No glasses unless medically required. Check VAC requirements for your country - some have additional specifications.',
      displayOrder: 3,
      govLink: 'https://www.gov.uk/photos-for-passports',
    },
    {
      id: 'sw-tb-test',
      title: 'TB Test Certificate',
      description:
        'Required if applying from a listed country. Must be from a government-approved clinic.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original certificate',
      tips: 'Valid for 6 months. Schedule this early - some clinics have long wait times.',
      displayOrder: 4,
      govLink: 'https://www.gov.uk/tb-test-visa',
    },
    {
      id: 'sw-english-lang',
      title: 'English Language Certificate (B1)',
      description:
        'Evidence of English at CEFR B1 level. Accepted: IELTS for UKVI (min 4.0 in each component), degree taught in English, or national exemption.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original SELT certificate or degree certificate + ECCTIS/ENIC confirmation',
      tips: 'A UK degree automatically satisfies this. Non-UK degrees need confirmation from ECCTIS (formerly NARIC) that the degree was taught in English.',
      displayOrder: 5,
      govLink: 'https://www.gov.uk/skilled-worker-visa/knowledge-of-english',
    },
    {
      id: 'sw-criminal-record',
      title: 'Criminal Record Certificate',
      description:
        'Required for roles working with children or vulnerable adults (healthcare, education, social work). From each country you have lived in for 12+ months in the last 10 years.',
      category: 'personal',
      required: false,
      priority: 'important',
      formatRequired: 'Original + certified English translation',
      tips: 'Processing times vary wildly by country (2 weeks to 3 months). Start this early. Your employer\'s HR team should confirm whether this applies to your role.',
      displayOrder: 6,
      govLink: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    },
    {
      id: 'sw-previous-visas',
      title: 'Previous UK Visa / Immigration History',
      description:
        'All previous UK visas, BRPs, and any refusal/curtailment letters from any country. If you have no previous visa history, simply confirm this on the application form - no documents needed.',
      category: 'personal',
      required: false,
      priority: 'important',
      formatRequired: 'Colour copies (if applicable). If none, confirm on the form.',
      tips: 'If you have previous visas: disclose everything. Undisclosed refusals - even from other countries - count as deception and can lead to a 10-year ban. If this is your first visa application, just answer honestly on the form.',
      displayOrder: 7,
      govLink: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    },

    // --- Financial / Employment Documents ---
    {
      id: 'sw-cos',
      title: 'Certificate of Sponsorship (CoS)',
      description:
        'Your employer assigns this via the Sponsor Management System. Contains your CoS reference number, job details, salary, and SOC code. You do NOT receive a physical document.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'CoS reference number (provided by employer)',
      tips: 'Your CoS is valid for 3 months from date of assignment. Apply BEFORE it expires. Confirm your employer has included the correct SOC code and salary.',
      displayOrder: 10,
      govLink: 'https://www.gov.uk/skilled-worker-visa/your-job',
      officialRequirement: 'You must have a valid Certificate of Sponsorship (CoS) reference number from a licensed UK employer. The CoS must include the correct SOC code and salary for your role. The minimum salary depends on your specific occupation and when you got your CoS.',
      commonMistakes: ['CoS expired before application submitted', 'Wrong SOC code', 'Salary on CoS doesn\'t match contract'],
      bestPractices: ['Apply within 2 weeks of CoS assignment', 'Verify SOC code matches your actual role', 'Ensure salary on CoS exactly matches your contract'],
    },
    {
      id: 'sw-employment-contract',
      title: 'Employment Contract / Offer Letter',
      description:
        'Written job offer or contract showing: job title, salary (matching CoS), start date, working hours, and location. Must be on company letterhead.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Signed contract or offer letter on company letterhead',
      tips: 'The salary on the contract MUST exactly match the CoS. Any discrepancy = refusal. If there\'s a signing bonus or allowances, these usually cannot count toward the threshold.',
      displayOrder: 11,
      govLink: 'https://www.gov.uk/skilled-worker-visa/your-job',
    },
    {
      id: 'sw-maintenance-funds',
      title: 'Maintenance Funds Evidence',
      description:
        'Bank statements showing £1,270+ held for 28 consecutive days ending no more than 31 days before application date. Not required if your employer certifies maintenance on the CoS.',
      category: 'financial',
      required: false,
      priority: 'important',
      formatRequired: 'Official bank statements (28-day period)',
      tips: 'Most employers will certify maintenance - check with your HR. If they don\'t, ensure the £1,270 is in YOUR name (not a family member\'s) and don\'t dip below the threshold.',
      displayOrder: 12,
      govLink: 'https://www.gov.uk/skilled-worker-visa/money-you-need',
    },
    {
      id: 'sw-sponsor-licence-check',
      title: 'Employer Sponsor Licence Verification',
      description:
        'Confirm your employer holds a valid Skilled Worker sponsor licence. Check the public register on gov.uk.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Screenshot or printout from the public register',
      tips: 'Search at: gov.uk/government/publications/register-of-licensed-sponsors-workers. If your employer is NOT on the list, they cannot sponsor you. Period.',
      displayOrder: 13,
      govLink: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers',
    },
    {
      id: 'sw-qualifications',
      title: 'Academic / Professional Qualifications',
      description:
        'Degree certificates, professional qualifications, or trade certifications relevant to your role. Include ECCTIS statement if degree is non-UK.',
      category: 'financial',
      required: false,
      priority: 'important',
      formatRequired: 'Original certificates + ECCTIS/ENIC confirmation for non-UK qualifications',
      tips: 'Not always required but strengthens your application, especially if salary is near the threshold. ECCTIS takes 10-15 working days to process.',
      displayOrder: 14,
      govLink: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    },

    // --- Supporting Documents ---
    {
      id: 'sw-atas-certificate',
      title: 'ATAS Certificate (if applicable)',
      description:
        'Academic Technology Approval Scheme certificate. Required for certain PhD-level research roles in sensitive subjects (engineering, tech, some sciences).',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Original ATAS certificate',
      tips: 'Processing takes up to 20 working days. Check if your SOC code requires ATAS at gov.uk. Your employer should know if this applies.',
      displayOrder: 20,
      govLink: 'https://www.gov.uk/guidance/academic-technology-approval-scheme',
    },
    {
      id: 'sw-cover-letter',
      title: 'Cover Letter',
      description:
        'Brief letter explaining your application: role, employer, why you\'re qualified, and your career intentions in the UK.',
      category: 'supporting',
      required: false,
      priority: 'nice-to-have',
      formatRequired: 'Typed, 1 page, signed and dated',
      tips: 'Particularly useful if your career path isn\'t obvious from the documents (e.g., career change, unusual qualification route).',
      displayOrder: 21,
    },
    {
      id: 'sw-cv',
      title: 'Current CV / Resume',
      description:
        'Up-to-date CV showing education, employment history, and skills relevant to the sponsored role.',
      category: 'supporting',
      required: false,
      priority: 'nice-to-have',
      formatRequired: 'PDF, 2 pages max',
      tips: 'Ensure job titles and dates match what\'s on your CoS. Inconsistencies between CV and CoS can trigger additional scrutiny.',
      displayOrder: 22,
    },
    {
      id: 'sw-children-dependants',
      title: 'Children as Dependants (if applicable)',
      description:
        'Your children can apply to join you in the UK as dependants. Each child needs their own application, documents, and fees. Skip this item if no children are applying with you.',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Per child: passport, birth certificate, proof of relationship, maintenance funds evidence',
      tips: 'Each child pays the same application fee as you (based on visa duration) plus IHS (£776/year for under-18s). Documents needed: valid passport, birth certificate, and proof of maintenance funds (unless your employer certifies for dependants too). If the other parent is not applying, you need their written consent. For children 18+, different rules apply - check gov.uk.',
      displayOrder: 23,
      govLink: 'https://www.gov.uk/skilled-worker-visa/your-partner-and-children',
      commonMistakes: ['Not budgeting for dependant fees', 'Missing consent from other parent', 'Not checking if employer certifies maintenance for dependants'],
      bestPractices: ['Ask your employer if they certify maintenance for dependants (saves providing bank statements)', 'Get written consent from other parent early', 'Children 18+ have different eligibility - check before applying'],
    },
  ],

  // =========================================================================
  // BRITISH CITIZENSHIP (NATURALISATION)
  // =========================================================================
  citizenship: [
    // --- Personal Documents ---
    {
      id: 'ct-passport',
      title: 'Current Passport',
      description:
        'Your current valid passport. You will also need all previous passports to evidence travel history for the residency calculation.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original current passport + all previous passports',
      tips: 'Lost old passports? Request entry/exit records from the Home Office using a Subject Access Request (SAR). This takes 1-3 months.',
      displayOrder: 1,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
      officialRequirement: 'You must send your current passport and any previous passports you hold. These are used to verify your travel history and time spent in the UK.',
      commonMistakes: ['Missing previous passports', 'Not requesting SAR for lost passports early enough', 'Travel history gaps'],
      bestPractices: ['Submit SAR 3 months before if passports are lost', 'Create a travel history spreadsheet from passport stamps', 'Include ALL passports even if expired'],
    },
    {
      id: 'ct-brp',
      title: 'Biometric Residence Permit (BRP) / ILR Evidence',
      description:
        'Your current BRP showing Indefinite Leave to Remain, or digital proof of settled status. This is the foundation of your citizenship application.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original BRP (both sides) or settled status share code',
      tips: 'If your BRP has expired but your ILR hasn\'t, you can still apply. Include a cover letter explaining the BRP expiry.',
      displayOrder: 2,
      govLink: 'https://www.gov.uk/biometric-residence-permits',
    },
    {
      id: 'ct-life-in-uk',
      title: 'Life in the UK Test Pass Certificate',
      description:
        'Certificate proving you passed the Life in the UK test. There is no expiry - once passed, it\'s valid forever.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original pass notification letter',
      tips: 'Book at: lifeintheuktest.gov.uk. Cost is £50. Study the official handbook - most questions come directly from it. Pass mark is 75% (18/24).',
      displayOrder: 3,
      govLink: 'https://www.gov.uk/life-in-the-uk-test',
      officialRequirement: 'You must have passed the Life in the UK test. The pass letter does not expire.',
      commonMistakes: ['Forgetting to bring pass letter', 'Not studying the official handbook', 'Booking test too close to application date'],
      bestPractices: ['Book test at lifeintheuktest.gov.uk', 'Study official handbook (£12.99)', 'Keep original pass notification letter safe'],
    },
    {
      id: 'ct-english-lang',
      title: 'English Language Evidence (B1+)',
      description:
        'Evidence of English at CEFR B1 or above. Accepted: IELTS for UKVI (B1), degree taught in English, nationality exemption, or Life in the UK test (counts for English).',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original certificate or degree + ECCTIS confirmation',
      tips: 'The Life in the UK test can count as English language evidence if you passed it. A UK degree at any level also satisfies this.',
      displayOrder: 4,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain/knowledge-of-language-and-life-in-the-uk',
    },
    {
      id: 'ct-birth-certificate',
      title: 'Birth Certificate',
      description:
        'Your original birth certificate. If not in English, include a certified translation.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Original + certified English translation if applicable',
      tips: 'If you cannot obtain a birth certificate, provide a statutory declaration explaining why and any alternative evidence of identity.',
      displayOrder: 5,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'ct-previous-visas',
      title: 'Full Immigration History',
      description:
        'Complete record of all UK visas, entry stamps, BRPs, and status changes. Include refusal letters from any country. Note: citizenship applicants will always have prior immigration history (you need ILR first), so this is always required.',
      category: 'personal',
      required: true,
      priority: 'critical',
      formatRequired: 'Colour copies of all documents, chronologically ordered',
      tips: 'The Home Office will cross-reference everything. Missing information delays processing significantly (sometimes months). Include ALL visas and status changes - your path to ILR is part of the story.',
      displayOrder: 6,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },

    // --- Residency & Character ---
    {
      id: 'ct-travel-history',
      title: 'Travel History (5-Year Record)',
      description:
        'Complete record of every trip outside the UK in the qualifying 5-year period (or 3 years if married to a British citizen). Include dates, destinations, and purposes. CRITICAL: You must have been physically present in the UK exactly 5 years before the Home Office receives your application.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Spreadsheet or typed document listing all absences with exact dates',
      tips: 'Max 450 days outside UK in 5 years AND max 90 days in the final 12 months. Count carefully - even 1 day over = automatic refusal. ALSO: you must have been physically in the UK exactly 5 years before your application is received. Example: if you apply 20 June 2027, you must have been in the UK on 20 June 2022. Use passport stamps + flight bookings to verify.',
      displayOrder: 10,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
      officialRequirement: 'You must not have spent more than 450 days outside the UK during the 5-year period, and not more than 90 days outside the UK in the last 12 months.',
      commonMistakes: ['Miscounting days (even 1 day over = refusal)', 'Not including day trips', 'Missing trips from older passports'],
      bestPractices: ['Create detailed spreadsheet with entry/exit dates', 'Cross-reference with passport stamps AND flight bookings', 'Add 1-week buffer to your qualifying date'],
    },
    {
      id: 'ct-address-history',
      title: 'Address History (5 Years)',
      description:
        'All UK addresses in the last 5 years with dates of residence. Evidenced by council tax bills, tenancy agreements, utility bills, or bank statements.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Document for each address showing your name and dates',
      tips: 'Gaps in address history raise questions. If you lived with someone without bills in your name, get a letter from the householder confirming your stay.',
      displayOrder: 11,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'ct-tax-records',
      title: 'Tax and National Insurance Record',
      description:
        'Evidence of tax compliance: P60s, tax returns, or HMRC tax summaries for the qualifying period. Shows you\'ve been economically active and law-abiding.',
      category: 'financial',
      required: false,
      priority: 'important',
      formatRequired: 'HMRC tax summaries or P60s for each qualifying year',
      tips: 'Access your tax records via your Personal Tax Account on gov.uk. If you have any tax debts or missed filings, resolve them BEFORE applying.',
      displayOrder: 12,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'ct-criminal-record',
      title: 'Criminal Record Declaration',
      description:
        'You must declare ALL criminal convictions, cautions, and penalties - including driving offences and overseas convictions. Even spent convictions must be declared for citizenship.',
      category: 'financial',
      required: true,
      priority: 'critical',
      formatRequired: 'Completed form section + supporting certificates if applicable',
      tips: 'Unlike visa applications, spent convictions ARE relevant for citizenship. Driving offences (even penalty points) must be declared. Non-disclosure = refusal + potential ban.',
      displayOrder: 13,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },

    // --- Supporting Documents ---
    {
      id: 'ct-referees',
      title: 'Two Referees',
      description:
        'Two referees who have known you for 3+ years: one must be a professional (doctor, lawyer, teacher, etc.), the other must be a British citizen. Neither can be related to you or each other.',
      category: 'supporting',
      required: true,
      priority: 'critical',
      formatRequired: 'Referees complete sections of the application form directly',
      tips: 'Choose referees carefully. They may be contacted by the Home Office. Ensure they know your application timeline and can respond promptly.',
      displayOrder: 20,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'ct-marriage-cert',
      title: 'Marriage Certificate (if applying via 3-year route)',
      description:
        'If applying as the spouse of a British citizen (3-year residence route), provide your marriage certificate proving the relationship.',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Original + certified English translation if applicable',
      tips: 'The marriage must have been in effect for the entire 3-year qualifying period. If you married during this period, the qualifying date changes.',
      displayOrder: 21,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'ct-partner-passport',
      title: "British Citizen Spouse's Passport (if 3-year route)",
      description:
        'Colour copy of your British citizen spouse\'s passport to confirm their citizenship status.',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Colour copy of bio page',
      tips: 'If your spouse naturalised, include their naturalisation certificate as well.',
      displayOrder: 22,
      govLink: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'ct-ceremony-booking',
      title: 'Citizenship Ceremony Booking',
      description:
        'After approval, you must attend a citizenship ceremony within 3 months. Many councils let you book in advance.',
      category: 'supporting',
      required: false,
      priority: 'nice-to-have',
      formatRequired: 'Booking confirmation from local council',
      tips: 'The £130 ceremony fee is included in the £1,839 application fee. You can choose a private ceremony (just you and a guest) or a group ceremony. Book early — popular dates fill up quickly.',
      displayOrder: 23,
      govLink: 'https://www.gov.uk/citizenship-ceremonies',
    },
    {
      id: 'ct-name-change',
      title: 'Name Change Evidence (if applicable)',
      description:
        'If your name has changed at any point (marriage, deed poll, etc.), provide evidence of each change.',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Original deed poll, marriage certificate, or statutory declaration',
      tips: 'All name changes must be declared. Ensure your current passport reflects your current legal name.',
      displayOrder: 24,
      govLink: 'https://www.gov.uk/change-name-deed-poll',
    },
    {
      id: 'ct-children-registration',
      title: 'Children - Registration as British Citizens (if applicable)',
      description:
        'If you have children under 18 who are not already British citizens, they may be eligible to register as British citizens once you naturalise. This is a separate application. Skip if not applicable.',
      category: 'supporting',
      required: false,
      priority: 'important',
      formatRequired: 'Separate application (Form MN1) per child + child\'s passport + birth certificate',
      tips: 'Children born in the UK to a parent who later becomes a British citizen can register as British. Cost is £1,214 per child (as of 2024 - check gov.uk for current fee). This is a separate process from your own naturalisation - apply after your citizenship is confirmed. Children born outside the UK may also be eligible depending on circumstances. Seek professional advice for complex family situations.',
      displayOrder: 25,
      govLink: 'https://www.gov.uk/register-british-citizen/born-in-uk',
      commonMistakes: ['Assuming children automatically become British when you do', 'Not budgeting for separate registration fees per child', 'Waiting too long - some routes have age limits'],
      bestPractices: ['Apply for child registration after your own citizenship ceremony', 'Budget £1,214 per child', 'Check specific eligibility at gov.uk/register-british-citizen', 'For children born outside the UK, check gov.uk/register-british-citizen/born-outside-the-uk'],
    },
  ],
};

// -----------------------------------------------------------------------------
// TIMELINES - Week-by-week action plans by urgency
// -----------------------------------------------------------------------------

export const TIMELINES: Record<UrgencyKey, TimelineWeek[]> = {
  // =========================================================================
  // URGENT - 4-week sprint
  // =========================================================================
  urgent: [
    {
      week: 1,
      title: 'Emergency Preparation',
      actions: [
        'Complete online application form on gov.uk (DO NOT SUBMIT YET - save as draft)',
        'Research nearest VAC location and check appointment availability (you can only book AFTER submitting)',
        'Book TB test if required (check gov.uk list of countries)',
        'Request bank statements from your bank (allow 3-5 working days)',
        'Ask sponsor/employer for employment letter immediately',
        'Check passport validity - if expiring within 6 months, start emergency renewal',
      ],
      deadline: 'End of Day 7',
      notes:
        'Priority processing costs £500-£800 extra but reduces wait from 24 weeks to 5-10 working days. Budget for this. Do NOT submit without all critical documents - a refusal costs more than waiting an extra week.',
    },
    {
      week: 2,
      title: 'Document Sprint',
      actions: [
        'Collect all payslips (6 months) and verify they match bank statement credits',
        'Obtain English language certificate (or confirm exemption)',
        'Gather relationship evidence: photos, communication logs, cohabitation proof',
        'Request accommodation evidence from landlord/mortgage provider',
        'Order certified translations for any non-English documents',
        'Start drafting cover letter',
      ],
      deadline: 'End of Day 14',
      notes:
        'This is the hardest week. You are likely chasing multiple documents simultaneously. Use a shared spreadsheet with your partner to track what\'s received vs outstanding.',
    },
    {
      week: 3,
      title: 'Review & Quality Check',
      actions: [
        'Cross-reference every document against the checklist - no gaps allowed',
        'Verify all dates, names, and reference numbers match across documents',
        'Have someone else review the application form for errors',
        'Attend TB test appointment (if not yet done)',
        'Finalise cover letter and get it reviewed',
        'Confirm VAC appointment availability for immediately after submission',
      ],
      deadline: 'End of Day 21',
      notes:
        'Common errors that cause refusals: name mismatches between documents, bank statements not covering the full period, employer letter older than 28 days. Check everything twice.',
    },
    {
      week: 4,
      title: 'Submit & Follow Up',
      actions: [
        'Submit application online and pay fees (including priority if applicable)',
        'Book biometrics appointment immediately after submission (slots fill fast)',
        'Upload all supporting documents via the online portal',
        'Attend biometrics appointment at VAC (bring passport + confirmation)',
        'Save confirmation email and application reference number',
        'Set up calendar reminders for expected decision date',
      ],
      deadline: 'End of Day 28',
      notes:
        'After submission, do NOT travel or change your circumstances without consulting the application guidance. Keep your phone and email accessible - the Home Office may contact you.',
    },
  ],

  // =========================================================================
  // NORMAL - 8-week plan (1-3 months)
  // =========================================================================
  normal: [
    {
      week: 1,
      title: 'Research & Planning',
      actions: [
        'Read the full visa guidance on gov.uk for your visa type',
        'Create a master checklist spreadsheet with all required documents',
        'Check your eligibility against all requirements (income, English, etc.)',
        'Identify any potential problems early (income gaps, travel history, etc.)',
        'Set a target submission date and work backwards',
      ],
      deadline: 'End of Week 1',
      notes:
        'This week is about understanding, not doing. The biggest cause of refusals is misunderstanding the requirements. Read the guidance properly - don\'t rely on forums or hearsay.',
    },
    {
      week: 2,
      title: 'Personal Documents',
      actions: [
        'Check passport validity and renew if needed',
        'Book TB test appointment',
        'Book English language test (if needed)',
        'Request birth certificate / marriage certificate (if not to hand)',
        'Order any certified translations',
      ],
      deadline: 'End of Week 2',
      notes:
        'Passport renewals take 3-6 weeks. English language tests need to be booked in advance. Do these early to avoid bottlenecks.',
    },
    {
      week: 3,
      title: 'Financial Documents',
      actions: [
        'Request 6 months of bank statements from your bank',
        'Gather 6 months of payslips (or request from employer)',
        'Request employer letter (give them the exact template/requirements)',
        'If self-employed: request SA302 and tax year overviews from HMRC',
        'If using savings: ensure funds have been in the account 28+ days',
      ],
      deadline: 'End of Week 3',
      notes:
        'Financial evidence is the #1 reason for spouse visa refusals. Be meticulous. Every payslip must match a corresponding bank credit. Gaps = refusal risk.',
    },
    {
      week: 4,
      title: 'Supporting Documents',
      actions: [
        'Compile relationship evidence (photos, messages, letters)',
        'Gather accommodation evidence',
        'Collect cohabitation proof (utility bills, joint accounts)',
        'Request reference/support letters from family and friends',
        'Prepare sponsor\'s identity documents',
      ],
      deadline: 'End of Week 4',
      notes:
        'For skilled worker applicants, this week focuses on ensuring CoS details match your contract and qualifications. For citizenship, this is travel history compilation week.',
    },
    {
      week: 5,
      title: 'Application Form',
      actions: [
        'Start completing the online application form on gov.uk',
        'Save progress regularly (forms time out after 60 minutes of inactivity)',
        'Double-check every answer against your documents',
        'Note down any questions you\'re unsure about for research',
      ],
      deadline: 'End of Week 5',
      notes:
        'The online form is long (spouse visa forms can take 2-3 hours). Don\'t rush it. Incorrect answers - even accidental - can be treated as dishonesty.',
    },
    {
      week: 6,
      title: 'Quality Review',
      actions: [
        'Review entire application with fresh eyes',
        'Cross-reference all document dates, names, and reference numbers',
        'Have your partner/sponsor review the application independently',
        'Check that all translations are certified and complete',
        'Ensure no documents are older than their validity window',
      ],
      deadline: 'End of Week 6',
      notes:
        'Consider paying for a professional document review at this stage (£150-£300 from an immigration advisor). Much cheaper than a refusal + re-application.',
    },
    {
      week: 7,
      title: 'Final Prep',
      actions: [
        'Attend TB test (if not yet done)',
        'Research VAC locations and check biometrics appointment availability (book after submission)',
        'Make final copies of all documents for your own records',
        'Prepare the physical document package (if submitting in person)',
        'Check for any last-minute changes to immigration rules',
      ],
      deadline: 'End of Week 7',
      notes:
        'Keep a complete copy of everything you submit. If the Home Office loses documents (it happens), you need to be able to re-submit quickly.',
    },
    {
      week: 8,
      title: 'Submit Application',
      actions: [
        'Final review of application form and all documents',
        'Submit application online and pay all fees',
        'Book biometrics appointment immediately after submission',
        'Upload supporting documents to the portal',
        'Attend biometrics at VAC (bring passport + application confirmation)',
        'Save all confirmation emails and reference numbers',
        'Set calendar reminders for expected decision timeline',
      ],
      deadline: 'End of Week 8',
      notes:
        'Congratulations on submitting! Now begins the wait. Processing times vary by visa type and whether you\'re inside or outside the UK. Do not contact the Home Office for status updates before the published processing time has elapsed.',
    },
  ],

  // =========================================================================
  // AHEAD - 16-week plan (3+ months, planning ahead)
  // =========================================================================
  ahead: [
    {
      week: 1,
      title: 'Deep Research',
      actions: [
        'Read the complete Immigration Rules for your visa category on legislation.gov.uk',
        'Research recent refusal trends and common mistakes on forums (but verify with official sources)',
        'Assess your overall eligibility honestly - identify weaknesses',
        'Consider whether professional immigration advice is worth the investment',
      ],
      deadline: 'End of Week 1',
      notes:
        'You have the luxury of time. Use it to build the strongest application possible. The refusal rate for well-prepared applications is under 5%.',
    },
    {
      week: 2,
      title: 'Address Weaknesses',
      actions: [
        'If income is borderline: explore ways to increase salary or build savings',
        'If English test needed: start studying and book the test for Week 6-8',
        'If relationship evidence is thin: start building a deliberate evidence trail now',
        'If travel history is close to limits: stop unnecessary international travel immediately',
      ],
      deadline: 'End of Week 4',
      notes:
        'This is the biggest advantage of planning ahead. You can actually FIX problems rather than just documenting them.',
    },
    {
      week: 5,
      title: 'Start Document Collection',
      actions: [
        'Request long-form documents (birth certificates, police clearances, etc.)',
        'Start the certified translation process for non-English documents',
        'Order ECCTIS qualification assessment if needed (takes 10-15 working days)',
        'Request Subject Access Request from Home Office if missing immigration records',
      ],
      deadline: 'End of Week 6',
      notes:
        'Some documents take weeks or months to obtain (especially from overseas governments). Starting early eliminates panic.',
    },
    {
      week: 7,
      title: 'Financial Evidence Window Opens',
      actions: [
        'Begin the 6-month payslip collection period (if changing jobs, wait until you have 6 months)',
        'If using savings route: transfer funds and start the 28-day holding period',
        'Request a fresh employer letter (remember: must be dated within 28 days of submission)',
        'Get self-employment accounts in order (tax returns filed, accountant letter drafted)',
      ],
      deadline: 'End of Week 8',
      notes:
        'Financial evidence has strict time windows. Plan backwards from your target submission date to ensure everything aligns.',
    },
    {
      week: 9,
      title: 'Build Supporting Evidence',
      actions: [
        'Compile comprehensive relationship evidence package',
        'Draft and refine your cover letter',
        'Request letters from referees and supporters',
        'Prepare accommodation and cohabitation evidence',
        'Take new relationship photographs at events or outings',
      ],
      deadline: 'End of Week 10',
      notes:
        'For citizenship applications, this is when you should compile your complete travel history spreadsheet and cross-reference with passport stamps.',
    },
    {
      week: 11,
      title: 'Application Form & Testing',
      actions: [
        'Complete the online application form in full (save as draft)',
        'Attend English language test',
        'Attend TB test',
        'Book Life in the UK test (citizenship applicants)',
      ],
      deadline: 'End of Week 12',
      notes:
        'Complete the form while everything is fresh in your mind. Some questions require specific dates and details that are easy to look up now but hard to remember later.',
    },
    {
      week: 13,
      title: 'Professional Review (Recommended)',
      actions: [
        'Send complete application to an immigration solicitor or advisor for review',
        'Address any feedback or concerns they raise',
        'Obtain any final outstanding documents',
        'Refresh any documents that may have aged out (employer letter, bank statements)',
      ],
      deadline: 'End of Week 14',
      notes:
        'An OISC-regulated advisor or solicitor review costs £200-£500 but provides peace of mind. They catch issues you won\'t spot yourself.',
    },
    {
      week: 15,
      title: 'Final Preparation & Submission',
      actions: [
        'Submit application online - then immediately book biometrics appointment',
        'Attend biometrics at VAC (bring passport + application confirmation)',
        'Final document review - check all dates are within validity windows',
        'Make copies of everything for your records',
        'Submit application, pay fees, and upload documents',
        'Submit physical documents at VAC if required',
        'Celebrate - you\'ve done everything possible to succeed',
      ],
      deadline: 'End of Week 16',
      notes:
        'A well-prepared application submitted with time to spare is the gold standard. You\'ve maximised your chances of success.',
    },
  ],
};

// -----------------------------------------------------------------------------
// RISK RULES - Dynamic risk engine
// -----------------------------------------------------------------------------

export const RISKS: RiskRule[] = [
  // =========================================================================
  // Income & Financial Risks
  // =========================================================================
  {
    id: 'RISK_INCOME_BELOW_THRESHOLD',
    title: 'Income Below Minimum Threshold',
    description:
      'Your sponsor\'s income appears to be below the £29,000 minimum threshold for a spouse visa. Without sufficient savings to compensate, this will result in automatic refusal.',
    severity: 'high',
    recommendation:
      'Either increase income above £29,000 before applying, or demonstrate cash savings of at least £62,500 held for 28+ days. Formula: (£29,000 - actual income) × 2.5 = savings needed.',
    conditions: {
      visaTypes: ['spouse'],
      incomeRange: ['under29k'],
    },
  },
  {
    id: 'RISK_SKILLED_SALARY_LOW',
    title: 'Salary Below Skilled Worker Threshold',
    description:
      'Your offered salary may be below the £38,700 general threshold for Skilled Worker visas. Unless your occupation has a lower "going rate", this application will be refused.',
    severity: 'high',
    recommendation:
      'Confirm with your employer that your salary meets the threshold for your specific SOC code. Some occupations (healthcare, education) have lower thresholds. Check the going rates table on gov.uk.',
    conditions: {
      visaTypes: ['skilled_worker'],
      incomeRange: ['under30k', '30to38k'],
    },
  },
  {
    id: 'RISK_SELF_EMPLOYED_COMPLEXITY',
    title: 'Self-Employment Evidence Complexity',
    description:
      'Self-employed sponsors face significantly higher refusal rates because the evidence requirements are more complex. Missing even one document from the self-employment pack can lead to refusal.',
    severity: 'medium',
    recommendation:
      'Ensure you have: 2 full years of SA302 tax calculations + tax year overviews from HMRC, accountant\'s letter on headed paper, business bank statements, and evidence of ongoing trading. Consider professional review before submission.',
    conditions: {
      visaTypes: ['spouse'],
      employmentStatus: ['self-employed'],
    },
  },

  // =========================================================================
  // Timeline Risks
  // =========================================================================
  {
    id: 'RISK_URGENT_TIMELINE',
    title: 'Very Tight Application Timeline',
    description:
      'You have selected an urgent timeline (under 4 weeks). This significantly increases the risk of submitting incomplete or inconsistent documents.',
    severity: 'high',
    recommendation:
      'Budget for priority processing fees (£500-£800). Start ALL document requests immediately - do not wait. Consider whether delaying by 2-4 weeks would meaningfully improve your application quality.',
    conditions: {
      visaTypes: ['spouse', 'skilled_worker', 'citizenship'],
      urgency: ['urgent'],
    },
  },
  {
    id: 'RISK_CITIZENSHIP_TIMING',
    title: 'Citizenship Residency Timing Risk',
    description:
      'Citizenship applications are automatically refused if you apply even 1 day before your qualifying date. The 5-year (or 3-year) period must be COMPLETE at the date of application.',
    severity: 'high',
    recommendation:
      'Calculate your exact qualifying date carefully. Add a buffer of at least 1 week. Double-check your absence calculations: max 450 days in 5 years, max 90 days in the final 12 months.',
    conditions: {
      visaTypes: ['citizenship'],
    },
  },

  // =========================================================================
  // Relationship & Character Risks
  // =========================================================================
  {
    id: 'RISK_SHORT_RELATIONSHIP',
    title: 'Short Relationship Duration',
    description:
      'Relationships under 2 years may face additional scrutiny. The Home Office may question whether the relationship is genuine and subsisting.',
    severity: 'medium',
    recommendation:
      'Strengthen your relationship evidence: include more photographs, communication logs, third-party letters, and evidence of future plans together. A detailed cover letter explaining your relationship history is essential.',
    conditions: {
      visaTypes: ['spouse'],
      relationshipDurationMonths: { max: 24 },
    },
  },
  {
    id: 'RISK_NO_COHABITATION',
    title: 'No Evidence of Living Together',
    description:
      'If you have never lived at the same address, you will need to provide stronger evidence of a genuine relationship through other means.',
    severity: 'medium',
    recommendation:
      'Focus on: frequent visits (flight bookings, entry stamps), extensive communication records, evidence of joint financial commitments (e.g., joint savings), and detailed letters from family/friends who have witnessed the relationship.',
    conditions: {
      visaTypes: ['spouse'],
    },
  },

  // =========================================================================
  // Application-Specific Risks
  // =========================================================================
  {
    id: 'RISK_PREVIOUS_REFUSAL',
    title: 'Previous Visa Refusal - Must Be Declared',
    description:
      'You indicated you have a previous visa refusal. This MUST be declared and explained. Failure to disclose = automatic refusal and potential 10-year re-entry ban for deception.',
    severity: 'high',
    recommendation:
      'Declare ALL previous refusals honestly. Provide a clear explanation of the circumstances and what has changed since. If the refusal was from another country, include a copy of the refusal letter with a certified translation.',
    conditions: {
      visaTypes: ['spouse', 'skilled_worker', 'citizenship'],
      hasPreviousRefusal: true,
    },
  },
  {
    id: 'RISK_OVERSTAY_HISTORY',
    title: 'Previous Overstay - Must Be Declared',
    description:
      'You indicated you have previously overstayed a visa. Even by 1 day, this must be declared and will be scrutinised. Overstays can result in a re-entry ban of 1-10 years.',
    severity: 'high',
    recommendation:
      'Declare the overstay and explain the circumstances. If the overstay was brief and unintentional, explain what happened. If you received a removal notice, include it in your application. Professional legal advice is strongly recommended.',
    conditions: {
      visaTypes: ['spouse', 'skilled_worker', 'citizenship'],
      hasPreviousOverstay: true,
    },
  },
  {
    id: 'RISK_APPLYING_FROM_OUTSIDE_UK',
    title: 'Applying From Outside the UK',
    description:
      'Applications from outside the UK have a different process (VAC-based) and potentially longer processing times. You cannot enter the UK until the visa is granted.',
    severity: 'low',
    recommendation:
      'Plan your travel and accommodation around the processing time. Do not book non-refundable travel. Ensure you have access to a Visa Application Centre in your country.',
    conditions: {
      visaTypes: ['spouse', 'skilled_worker'],
      currentlyInUk: false,
    },
  },
  {
    id: 'RISK_CITIZENSHIP_TRAVEL_EXCESS',
    title: 'Excessive Travel During Qualifying Period',
    description:
      'If you have been outside the UK for more than 450 days in the 5-year qualifying period (or more than 90 days in the final 12 months), your citizenship application will be refused.',
    severity: 'high',
    recommendation:
      'Compile a complete travel log using passport stamps, flight bookings, and entry/exit records. If you are close to the limits, consider delaying your application to start a new qualifying window with fewer absences.',
    conditions: {
      visaTypes: ['citizenship'],
    },
  },
  {
    id: 'RISK_EMPLOYER_LICENCE_REVOKED',
    title: 'Employer Sponsor Licence Risk',
    description:
      'If your employer\'s sponsor licence is revoked or suspended after you apply, your application may be refused or your visa curtailed. This has happened to several large employers recently.',
    severity: 'medium',
    recommendation:
      'Check the public register of sponsors regularly. If your employer is under investigation, consider whether this is the right time to apply. If your licence is curtailed after grant, you have 60 days to find a new sponsor.',
    conditions: {
      visaTypes: ['skilled_worker'],
    },
  },
  {
    id: 'RISK_NHS_SURCHARGE_UNPAID',
    title: 'Immigration Health Surcharge (IHS) Not Paid',
    description:
      'The Immigration Health Surcharge must be paid as part of your application. Failure to pay = application cannot be submitted. Current rate is £1,035/year.',
    severity: 'medium',
    recommendation:
      'Budget for the full IHS amount upfront. For a spouse visa (2 years 9 months), this is £3,105. For Skilled Worker, it depends on your visa duration (£1,035/year). Payment is made during the online application process.',
    conditions: {
      visaTypes: ['spouse', 'skilled_worker'],
    },
  },
  {
    id: 'RISK_DOCUMENT_AGE',
    title: 'Documents May Expire Before Submission',
    description:
      'Some documents have strict validity windows. Employer letters must be dated within 28 days, bank statements within 28 days, and TB test certificates within 6 months.',
    severity: 'medium',
    recommendation:
      'Plan your document gathering backwards from your target submission date. Request time-sensitive documents (employer letter, bank statements) last, ideally within 1-2 weeks of submission.',
    conditions: {
      visaTypes: ['spouse', 'skilled_worker', 'citizenship'],
    },
  },
];

// -----------------------------------------------------------------------------
// SUBMISSION INFO - What happens after the checklist is complete & payment made
// -----------------------------------------------------------------------------

export const SUBMISSION_INFO: SubmissionInfo[] = [
  {
    visaType: 'spouse',
    summaryIntro:
      'Your Spouse/Partner Visa checklist is complete. Here\'s what happens next - follow these steps in order to submit your application to the Home Office.',
    applicationUrl: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    steps: [
      {
        order: 1,
        title: 'Complete Online Application',
        description:
          'Fill in the online application form on gov.uk. The form asks detailed questions about your relationship, finances, accommodation, and immigration history. Save your progress regularly.',
        icon: '📝',
      },
      {
        order: 2,
        title: 'Pay Application Fees',
        description:
          'Pay the visa fee (£2,064 outside UK / £1,407 inside UK) and Immigration Health Surcharge (£3,105 for 2 years 9 months) online. If applying from inside the UK, you may be able to pay £1,000 for the super priority service.',
        icon: '💳',
      },
      {
        order: 3,
        title: 'Book & Attend Biometrics',
        description:
          'Book a biometrics appointment at your nearest Visa Application Centre (or use the UK Immigration: ID Check app if applying from inside the UK). Bring your passport and appointment confirmation.',
        icon: '🖐️',
      },
      {
        order: 4,
        title: 'Upload Supporting Documents',
        description:
          'Upload all documents from your checklist via the online portal. Scan or photograph clearly - blurry documents may be rejected. Organise by category for faster processing.',
        icon: '📤',
      },
      {
        order: 5,
        title: 'Wait for Decision',
        description:
          'Processing takes approximately 12 weeks (outside UK) or 8 weeks (inside UK, if meeting financial and English requirements). Super priority (inside UK only, £1,000) can speed this up. You\'ll receive a decision by email.',
        icon: '⏳',
      },
      {
        order: 6,
        title: 'Collect BRP / Confirm eVisa',
        description:
          'If approved, you\'ll receive a vignette (sticker) in your passport or a digital decision letter. Collect your Biometric Residence Permit from the Post Office within 10 days of arrival in the UK.',
        icon: '✅',
      },
    ],
    importantNotes: [
      'Do NOT travel to the UK before your visa is granted (if applying from outside the UK).',
      'Keep a complete copy of all submitted documents for your records.',
      'If you are asked for additional information, respond within the deadline given.',
      'Your visa will initially be granted for 2 years and 9 months. You will need to apply to extend before it expires.',
      'Extensions grant a further 2 years and 6 months. After 5 years total on a family visa as a partner, you can apply for Indefinite Leave to Remain (ILR).',
    ],
    contactInfo: {
      name: 'UK Visas and Immigration (UKVI)',
      url: 'https://www.gov.uk/contact-ukvi-inside-outside-uk',
      phone: '+44 300 123 2241 (inside UK) / +44 203 481 1736 (outside UK)',
      hours: 'Monday to Friday, 9:00-17:30 GMT',
    },
  },

  {
    visaType: 'skilled_worker',
    summaryIntro:
      'Your Skilled Worker Visa checklist is complete. Here\'s the submission process - coordinate closely with your employer\'s HR team, as they play a key role.',
    applicationUrl: 'https://www.gov.uk/skilled-worker-visa/apply',
    steps: [
      {
        order: 1,
        title: 'Confirm CoS Assignment',
        description:
          'Ensure your employer has assigned your Certificate of Sponsorship (CoS) in the Sponsor Management System. You\'ll need the CoS reference number to start your application. The CoS is valid for 3 months.',
        icon: '📋',
      },
      {
        order: 2,
        title: 'Complete Online Application',
        description:
          'Fill in the Skilled Worker visa application form on gov.uk using your CoS reference number. Ensure all details (job title, salary, SOC code) match what your employer entered on the CoS.',
        icon: '📝',
      },
      {
        order: 3,
        title: 'Pay Fees',
        description:
          'Pay the visa fee (£819-£1,618 outside UK / £943-£1,865 inside UK - lower if on immigration salary list) and Immigration Health Surcharge (£1,035/year). Some employers cover these costs - check your offer terms. You may be able to pay for faster processing.',
        icon: '💳',
      },
      {
        order: 4,
        title: 'Book & Attend Biometrics',
        description:
          'Book a biometrics appointment. If in the UK, you can use the smartphone app. Outside the UK, attend your nearest VAC. Bring passport, confirmation, and any physical documents.',
        icon: '🖐️',
      },
      {
        order: 5,
        title: 'Upload Documents',
        description:
          'Upload your supporting documents via the portal. At minimum: passport, English language evidence, and any criminal record certificates. Your CoS details are already in the system.',
        icon: '📤',
      },
      {
        order: 6,
        title: 'Receive Decision',
        description:
          'Processing: 3 weeks (outside UK) or 8 weeks (inside UK). You may be able to pay for a faster decision. Once approved, you\'ll receive a vignette or digital status. Your employer will be notified via the SMS. You can start work on the start date listed on your CoS.',
        icon: '✅',
      },
    ],
    importantNotes: [
      'You can only start working for the employer on your CoS - not any other employer.',
      'If you want to change jobs, your new employer must sponsor you with a new CoS.',
      'Your visa length depends on your CoS: usually up to 5 years.',
      'After 5 years, you can apply for Indefinite Leave to Remain (ILR) if you still meet the salary threshold.',
      'If your employer\'s sponsor licence is revoked, you have 60 days to find a new sponsor or leave the UK.',
    ],
    contactInfo: {
      name: 'UK Visas and Immigration (UKVI)',
      url: 'https://www.gov.uk/contact-ukvi-inside-outside-uk',
      phone: '+44 300 123 2241 (inside UK) / +44 203 481 1736 (outside UK)',
      hours: 'Monday to Friday, 9:00-17:30 GMT',
    },
  },

  {
    visaType: 'citizenship',
    summaryIntro:
      'Your British Citizenship checklist is complete. The naturalisation process is different from visa applications - here\'s exactly what to do.',
    applicationUrl: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    steps: [
      {
        order: 1,
        title: 'Verify Qualifying Date',
        description:
          'Triple-check your qualifying date. You must have been physically present in the UK exactly 5 years before the Home Office receives your application (or 3 years if married to a British citizen). You must also have held ILR or settled status for at least 12 months. If you apply online, the application is received the same day. If by post, allow extra days.',
        icon: '📅',
      },
      {
        order: 2,
        title: 'Complete Form AN',
        description:
          'Fill in Form AN (Application for Naturalisation). This is a comprehensive form covering your personal details, residency, travel, character, and referees. It can be completed online or on paper.',
        icon: '📝',
      },
      {
        order: 3,
        title: 'Gather Referee Details',
        description:
          'Your two referees must complete their sections of the form. One must be a professional person, the other a British citizen. Neither can be related to you, each other, or your solicitor.',
        icon: '👥',
      },
      {
        order: 4,
        title: 'Pay Application Fee',
        description:
          'The fee is £1,839 (includes £130 ceremony fee, non-refundable even if refused). There is no priority processing for citizenship applications. Payment is made online at the time of submission.',
        icon: '💳',
      },
      {
        order: 5,
        title: 'Attend Biometrics',
        description:
          'Book and attend a biometrics appointment after submitting the form. You\'ll receive instructions by email.',
        icon: '🖐️',
      },
      {
        order: 6,
        title: 'Wait for Decision (≈6 months)',
        description:
          'Citizenship applications typically take 6 months. The Home Office may contact you for additional information or an interview. Do not travel extensively during this period.',
        icon: '⏳',
      },
      {
        order: 7,
        title: 'Attend Citizenship Ceremony',
        description:
          'If approved, you must attend a citizenship ceremony within 3 months. You\'ll take an oath/affirmation of allegiance and receive your certificate of naturalisation. You are then a British citizen!',
        icon: '🇬🇧',
      },
    ],
    importantNotes: [
      'The £1,839 fee is non-refundable (includes £130 ceremony fee) - ensure you meet all requirements before applying.',
      'There is NO priority service for citizenship. Plan for a 6-month wait.',
      'You must have held ILR or settled status for at least 12 months before applying.',
      'You cannot apply for a British passport until after your citizenship ceremony.',
      'Your existing nationality may be affected - check your home country\'s dual nationality rules.',
      'If refused, you can re-apply but will need to pay the full fee again.',
      'Citizenship ceremony fee (£130) is included in the application fee. Must be attended within 3 months of approval.',
    ],
    contactInfo: {
      name: 'UK Visas and Immigration - Nationality Contact Centre',
      url: 'https://www.gov.uk/contact-ukvi-inside-outside-uk',
      phone: '+44 300 123 2241',
      hours: 'Monday to Friday, 9:00-17:30 GMT',
    },
  },
];

// -----------------------------------------------------------------------------
// Helper: Get checklist items by category for a visa type
// -----------------------------------------------------------------------------

export function getChecklistByCategory(visaType: VisaTypeKey): Record<DocumentCategory, ChecklistItem[]> {
  const items = CHECKLISTS[visaType] || [];
  return {
    personal: items.filter((i) => i.category === 'personal').sort((a, b) => a.displayOrder - b.displayOrder),
    financial: items.filter((i) => i.category === 'financial').sort((a, b) => a.displayOrder - b.displayOrder),
    supporting: items.filter((i) => i.category === 'supporting').sort((a, b) => a.displayOrder - b.displayOrder),
  };
}

// -----------------------------------------------------------------------------
// Helper: Get applicable risks for a given application profile
// -----------------------------------------------------------------------------

export function getApplicableRisks(profile: {
  visaType: VisaTypeKey;
  incomeRange?: string;
  urgency?: UrgencyKey;
  currentlyInUk?: boolean;
  relationshipDurationMonths?: number;
  employmentStatus?: string;
  hasPreviousRefusal?: boolean;
  hasPreviousOverstay?: boolean;
}): RiskRule[] {
  return RISKS.filter((risk) => {
    // Must match visa type
    if (!risk.conditions.visaTypes.includes(profile.visaType)) return false;

    // Income range check
    if (risk.conditions.incomeRange && profile.incomeRange) {
      if (!risk.conditions.incomeRange.includes(profile.incomeRange)) return false;
    } else if (risk.conditions.incomeRange && !profile.incomeRange) {
      return false;
    }

    // Urgency check
    if (risk.conditions.urgency && profile.urgency) {
      if (!risk.conditions.urgency.includes(profile.urgency)) return false;
    } else if (risk.conditions.urgency && !profile.urgency) {
      return false;
    }

    // Currently in UK check
    if (risk.conditions.currentlyInUk !== undefined && profile.currentlyInUk !== undefined) {
      if (risk.conditions.currentlyInUk !== profile.currentlyInUk) return false;
    } else if (risk.conditions.currentlyInUk !== undefined && profile.currentlyInUk === undefined) {
      return false;
    }

    // Relationship duration check
    if (risk.conditions.relationshipDurationMonths && profile.relationshipDurationMonths !== undefined) {
      const { max, min } = risk.conditions.relationshipDurationMonths;
      if (max !== undefined && profile.relationshipDurationMonths > max) return false;
      if (min !== undefined && profile.relationshipDurationMonths < min) return false;
    } else if (risk.conditions.relationshipDurationMonths && profile.relationshipDurationMonths === undefined) {
      return false;
    }

    // Employment status check
    if (risk.conditions.employmentStatus && profile.employmentStatus) {
      if (!risk.conditions.employmentStatus.includes(profile.employmentStatus)) return false;
    } else if (risk.conditions.employmentStatus && !profile.employmentStatus) {
      return false;
    }

    // Previous refusal check - only show if user confirmed they have one
    if (risk.conditions.hasPreviousRefusal === true && !profile.hasPreviousRefusal) {
      return false;
    }

    // Previous overstay check - only show if user confirmed they have one
    if (risk.conditions.hasPreviousOverstay === true && !profile.hasPreviousOverstay) {
      return false;
    }

    return true;
  });
}

// -----------------------------------------------------------------------------
// Helper: Get submission info for a visa type
// -----------------------------------------------------------------------------

export function getSubmissionInfo(visaType: VisaTypeKey): SubmissionInfo | undefined {
  return SUBMISSION_INFO.find((s) => s.visaType === visaType);
}

// -----------------------------------------------------------------------------
// Helper: Get timeline for an urgency level
// -----------------------------------------------------------------------------

export function getTimeline(urgency: UrgencyKey): TimelineWeek[] {
  return TIMELINES[urgency] || [];
}

// -----------------------------------------------------------------------------
// Stats helpers for the dashboard
// -----------------------------------------------------------------------------

export function getChecklistStats(visaType: VisaTypeKey) {
  const items = CHECKLISTS[visaType] || [];
  return {
    total: items.length,
    critical: items.filter((i) => i.priority === 'critical').length,
    important: items.filter((i) => i.priority === 'important').length,
    niceToHave: items.filter((i) => i.priority === 'nice-to-have').length,
    required: items.filter((i) => i.required).length,
    optional: items.filter((i) => !i.required).length,
  };
}
