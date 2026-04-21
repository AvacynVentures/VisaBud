// =============================================================================
// template-data.ts — VisaBud Document Preparation Templates (37 total)
// Professional preparation guides for every document in every visa pathway.
// Bundled with £149 AI Premium tier.
// =============================================================================

import { VisaTypeKey } from './visa-data';

export interface DocumentTemplate {
  id: string;
  visaType: VisaTypeKey;
  title: string;
  shortTitle: string;
  whatIsThis: string;
  homeOfficeRequires: string;
  formatSpecs: {
    fileTypes: string[];
    resolution: string;
    maxFileSize: string;
    colorMode: string;
    additionalSpecs: string[];
  };
  whatToInclude: string[];
  commonMistakes: string[];
  proTips: string[];
  checklist: string[];
  govUkReference: string;
  category: 'personal' | 'financial' | 'supporting';
  priority: 'critical' | 'important' | 'optional';
}

// =============================================================================
// SPOUSE VISA TEMPLATES (12)
// =============================================================================

const SPOUSE_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'spouse-passport-yours',
    visaType: 'spouse',
    title: 'Your Valid Passport — Spouse/Partner Visa',
    shortTitle: 'Valid Passport (Yours)',
    whatIsThis:
      'Your current passport is the primary identity document for your visa application. The Home Office uses it to verify your identity, nationality, and travel history. Without a valid passport, your application cannot proceed.',
    homeOfficeRequires:
      'Appendix FM 1.7 of the Immigration Rules states: "The applicant must provide a valid national passport or other document satisfactorily establishing their identity and nationality." The passport must be valid for the duration of the visa applied for, and ideally have at least 6 months\' remaining validity.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI minimum for scanned pages',
      maxFileSize: '6 MB per page',
      colorMode: 'Full colour scan — black and white NOT accepted',
      additionalSpecs: [
        'Scan every page, including blank pages',
        'Bio data page must be perfectly flat with no glare',
        'All visa stamps and endorsements must be legible',
        'If submitting online, use PDF for multi-page passports',
      ],
    },
    whatToInclude: [
      'Bio data page (photo, name, date of birth, passport number, expiry)',
      'ALL visa stamps from ALL countries (even expired ones)',
      'ALL blank pages (shows completeness)',
      'Any endorsement or observation pages',
      'Previous passports — every one you have, scanned in full',
      'If applying outside UK: original passport submitted to VAC',
    ],
    commonMistakes: [
      'Only scanning the bio data page — the Home Office needs EVERY page',
      'Blurry or glare-affected scans of the photo page',
      'Passport expiring within 6 months of intended travel date',
      'Name on passport not matching other documents (e.g. marriage name change)',
      'Forgetting to include previous/expired passports',
      'Submitting black and white copies instead of colour',
    ],
    proTips: [
      'Place the passport flat on a dark background and scan at 300 DPI for best clarity',
      'Use a scanning app like Adobe Scan or CamScanner for phone photos — far better than a regular photo',
      'If your passport has stamps in unusual locations (inside covers, etc.), scan those too',
      'Renew your passport BEFORE applying if it expires within 6 months',
      'Write your name consistently across all documents — any variation needs a cover letter explanation',
    ],
    checklist: [
      'Bio data page scanned in full colour at 300+ DPI',
      'All stamped pages scanned (both sides if double-sided stamps)',
      'All blank pages scanned',
      'Previous passports scanned (if available)',
      'Passport has 6+ months validity remaining',
      'Name matches all other application documents',
      'File is under 6 MB per page (compress if needed)',
      'PDF format for multi-page submission',
    ],
    govUkReference: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'spouse-partner-passport',
    visaType: 'spouse',
    title: "Partner's Passport / Citizenship Proof — Spouse/Partner Visa",
    shortTitle: "Partner's Passport/Citizenship",
    whatIsThis:
      "Your UK-based partner (the sponsor) must prove they are a British citizen or have settled status in the UK. This document establishes their right to sponsor your visa application. Without it, there's no basis for the application.",
    homeOfficeRequires:
      'The Immigration Rules Appendix FM require: "The sponsor must be a British citizen, a person who is present and settled in the UK, or a person with refugee leave or humanitarian protection." Evidence must include their passport or BRP/settled status confirmation.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI minimum',
      maxFileSize: '6 MB per page',
      colorMode: 'Full colour — front and back of BRP if applicable',
      additionalSpecs: [
        'Bio data page clearly readable',
        'BRP both sides if they have one',
        'Naturalisation certificate if they became British by naturalisation',
        'EU Settlement Scheme share code printout if applicable',
      ],
    },
    whatToInclude: [
      "Sponsor's British passport bio data page (colour copy)",
      'BRP (Biometric Residence Permit) — both sides if applicable',
      'Naturalisation certificate (if not born British)',
      'EU Settlement Scheme confirmation / share code (if applicable)',
      "Proof of any name changes linking the sponsor's ID to the relationship certificate",
    ],
    commonMistakes: [
      'Only providing one side of the BRP — Home Office needs both sides',
      "Sponsor's passport expired — they need a valid one too",
      'Not including naturalisation certificate when the sponsor was not born British',
      'Name on sponsor documents not matching the marriage/relationship certificate',
      'Forgetting to include the share code for EU settled status holders',
    ],
    proTips: [
      "Scan your partner's passport on the same day you scan yours — keeps everything in sync",
      "If your partner naturalised, the naturalisation certificate is as important as the passport",
      "For EU Settlement Scheme holders: generate a fresh share code at gov.uk — they expire after 30 days",
      'If your partner changed their name (e.g. by marriage), include the deed poll or marriage cert linking old and new names',
    ],
    checklist: [
      "Sponsor's passport bio page scanned (full colour, 300+ DPI)",
      'BRP both sides scanned (if applicable)',
      'Naturalisation certificate included (if applicable)',
      'EU settled status share code generated and included (if applicable)',
      'All names match across documents',
      'Passport is valid and not expired',
    ],
    govUkReference: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'spouse-birth-certificates',
    visaType: 'spouse',
    title: 'Birth Certificates (Both Partners) — Spouse/Partner Visa',
    shortTitle: 'Birth Certificates (Both)',
    whatIsThis:
      'Birth certificates confirm the identity, nationality, and parentage of both you and your partner. The Home Office may use these to verify your date of birth, place of birth, and to check for any identity discrepancies across your application.',
    homeOfficeRequires:
      'While not always listed as mandatory for spouse visas, OISC guidance and caseworker practice indicate that birth certificates strengthen your application and are particularly important when there are name variations, questions about nationality, or when you were not born in your country of current nationality.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per document',
      colorMode: 'Full colour preferred; certified B&W copies acceptable',
      additionalSpecs: [
        'Full (long-form) birth certificate preferred over short form',
        'Certified English translation required if not in English',
        'Translation must include translator credentials and declaration',
      ],
    },
    whatToInclude: [
      'Your full birth certificate (both sides if applicable)',
      "Your partner's full birth certificate",
      'Certified English translations for any non-English certificates',
      "Translator's credentials and certification statement",
      'If original is unavailable: statutory declaration explaining why + alternative identity evidence',
    ],
    commonMistakes: [
      'Providing a short-form extract instead of the full birth certificate',
      "Not translating non-English certificates — even if the language seems 'close' to English",
      'Using an uncertified translation (friend or family member)',
      'Name on birth certificate not matching passport (requires explanation)',
      'Forgetting to include both partners\' certificates',
    ],
    proTips: [
      "Request the full/long-form birth certificate from your country's civil registry — it contains parent details that the short form doesn't",
      'Use a professional translation service accredited by the ITI or NRPSI — costs £30–50 per page but eliminates translation challenges',
      "If your name has changed since birth (marriage, deed poll), include the chain of documents showing the change",
      "Scan at 300 DPI on a flat surface — certificates are often old and fragile, so handle with care",
    ],
    checklist: [
      'Your full birth certificate obtained and scanned',
      "Partner's full birth certificate obtained and scanned",
      'Certified English translations completed (if applicable)',
      'Names cross-referenced with passport and marriage certificate',
      'Any name changes documented with supporting evidence',
      'Scanned at 300+ DPI in colour',
    ],
    govUkReference: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    category: 'personal',
    priority: 'important',
  },
  {
    id: 'spouse-marriage-certificate',
    visaType: 'spouse',
    title: 'Marriage / Civil Partnership Certificate — Spouse/Partner Visa',
    shortTitle: 'Marriage Certificate',
    whatIsThis:
      'The marriage or civil partnership certificate is one of the most critical documents in a spouse visa application. It proves the legal basis of your relationship with your UK sponsor. Without it (or equivalent evidence for unmarried partners), the application has no foundation.',
    homeOfficeRequires:
      'Appendix FM of the Immigration Rules states the applicant must be "married to, or in a civil partnership with" the sponsor, OR demonstrate 2+ years of cohabitation as unmarried partners. The Home Office requires the original certificate or a certified copy, with a certified English translation if the certificate is in another language.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI minimum',
      maxFileSize: '6 MB',
      colorMode: 'Full colour scan of original',
      additionalSpecs: [
        'Original document submitted to VAC (if applying from outside UK)',
        'High-quality colour scan uploaded to online portal',
        'Certified English translation if not in English',
        'Translation must state it is a true and accurate translation',
      ],
    },
    whatToInclude: [
      'Original marriage/civil partnership certificate (or certified copy)',
      'Certified English translation (if not in English)',
      "Translator's declaration of accuracy with credentials",
      'If religious ceremony only: separate civil registration certificate',
      'For unmarried partners: 2+ years of cohabitation evidence instead',
    ],
    commonMistakes: [
      'Submitting a religious marriage certificate without the civil registration — religious-only certificates may not be legally recognised',
      'Not translating the certificate into English',
      'Certificate details (names, dates) not matching passport information',
      'Providing a commemorative certificate instead of the legal certificate',
      'For unmarried partners: insufficient cohabitation evidence (need 2+ continuous years)',
    ],
    proTips: [
      'If you married abroad, check whether your marriage is legally recognised in the UK — some countries\' marriages require additional registration',
      'Get two certified copies of your marriage certificate — submit one and keep one safe',
      "If your name changed upon marriage, ensure your passport reflects this OR include a cover letter explaining the discrepancy",
      'For unmarried partners: the 2-year cohabitation must be continuous, at the same address — gather utility bills, tenancy agreements, and correspondence in BOTH names',
    ],
    checklist: [
      'Marriage/civil partnership certificate obtained (original or certified copy)',
      'Certificate is the LEGAL (civil) certificate, not just religious',
      'Certified English translation completed (if applicable)',
      'Names and dates match across all documents',
      'High-quality colour scan at 300+ DPI',
      'Original available for VAC submission (if applying from outside UK)',
    ],
    govUkReference: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'spouse-payslips',
    visaType: 'spouse',
    title: "Sponsor's Payslips (6 Months) — Spouse/Partner Visa",
    shortTitle: 'Payslips (6 Months)',
    whatIsThis:
      "Your UK sponsor's payslips are the primary evidence that they meet the £29,000 minimum income threshold. The Home Office examines these carefully to ensure consistent, genuine employment income over the qualifying period.",
    homeOfficeRequires:
      'Appendix FM-SE (Financial Evidence) requires: "Where the person is in salaried employment in the UK at the date of application and has been with the same employer for at least 6 months, they must provide payslips covering the 6-month period prior to the date of application." Gross annual salary must be at least £29,000.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI for physical payslips; native PDF for digital',
      maxFileSize: '6 MB per document',
      colorMode: 'Colour preferred; clear B&W acceptable for printed payslips',
      additionalSpecs: [
        'All 6 consecutive months required — no gaps',
        'Each payslip must show employer name, employee name, gross pay, deductions, net pay, and pay period',
        'Digital/online payslips saved as PDF directly from the payroll system are ideal',
      ],
    },
    whatToInclude: [
      '6 consecutive monthly payslips (or 26 weekly payslips)',
      'Each payslip showing: employer name, employee name, gross salary, tax/NI deductions, net pay, pay date, pay period',
      'Payslips must correspond to the 6 months immediately before application date',
      "If sponsor changed jobs within 6 months: payslips from both employers covering the full 6-month period",
    ],
    commonMistakes: [
      "Only providing 5 months of payslips — all 6 months are mandatory (or use Cat B evidence)",
      'Payslip salary not matching the employer letter or bank statement credits',
      'Submitting informal receipts or screenshots instead of official payslips',
      'Gaps between payslip periods (e.g. missing one month)',
      'Payslips not clearly showing the gross annual salary equivalent',
      'Variable income (overtime, bonuses) not properly documented under Category B',
    ],
    proTips: [
      'Download payslips as PDFs directly from your employer\'s online payroll portal — this is the cleanest format',
      'Cross-reference EVERY payslip with the corresponding bank statement entry — any mismatch will be flagged',
      "If your sponsor's income includes regular overtime or commission, you may need to use Category B evidence (12 months' payslips) instead of Category A",
      'Create a simple spreadsheet showing: month, gross pay from payslip, and matching bank credit — this makes cross-referencing easy for the caseworker',
    ],
    checklist: [
      'All 6 consecutive months of payslips collected',
      'Each payslip shows employer name, gross pay, and pay period',
      'Gross annual salary equivalent is at least £29,000',
      'Payslips match bank statement salary credits',
      'No gaps between pay periods',
      'Scanned at 300+ DPI (or saved as native PDF from payroll system)',
      'Most recent payslip dated within 28 days of application',
    ],
    govUkReference: 'https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'spouse-bank-statements',
    visaType: 'spouse',
    title: "Sponsor's Bank Statements (6 Months) — Spouse/Partner Visa",
    shortTitle: 'Bank Statements (6 Months)',
    whatIsThis:
      "Bank statements corroborate the payslip evidence by showing salary credits landing in the sponsor's account. The Home Office uses these to verify that the income claimed on payslips is genuine and actually received.",
    homeOfficeRequires:
      'Appendix FM-SE states: "Bank statements covering the same period as the payslips, showing the salary credits." Statements must be from a regulated financial institution, show account holder details, and cover the same 6-month period as the payslips.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: 'Native digital PDF preferred; 300 DPI for physical scans',
      maxFileSize: '10 MB per statement',
      colorMode: 'Colour or B&W acceptable if clearly legible',
      additionalSpecs: [
        'Must show: account holder name, sort code, account number',
        'Each salary credit must be visible and identifiable',
        'Official bank statements only — online printouts must be stamped by the bank OR be certified digital statements',
        'Continuous coverage: no missing months',
      ],
    },
    whatToInclude: [
      '6 months of consecutive bank statements covering the same period as payslips',
      'Account holder full name, sort code, and account number on every page',
      'All salary credits clearly visible (highlight or annotate if helpful)',
      'Statement closing balance for each month',
      'If salary goes to multiple accounts: statements for ALL accounts receiving salary',
    ],
    commonMistakes: [
      'Using online banking screenshots or printouts that are not officially stamped by the bank',
      'Salary credits not matching payslip amounts (even small differences cause issues)',
      'Missing pages from multi-page statements',
      'Statements from a different period than the payslips',
      'Redacting transactions — the Home Office wants to see EVERYTHING',
      'Not providing statements from ALL accounts if salary is split',
    ],
    proTips: [
      "Request 'official statements' from your bank branch — they are stamped and accepted without question",
      "Many UK banks now offer certified PDF statements through their app or online banking — these are excellent",
      'NEVER redact or black out any transactions — the Home Office may reject redacted statements as incomplete evidence',
      'If a salary credit has a different amount than the payslip (e.g. due to a deduction), include a brief explanation',
      "Highlight salary credits with a small annotation ('Salary — [Month]') to help the caseworker quickly verify",
    ],
    checklist: [
      'Full 6 months of statements obtained (matching payslip period)',
      'Account holder name, sort code, and account number visible',
      'All salary credits identifiable and matching payslips',
      'No missing pages or months',
      'Statements are official (stamped by bank or certified digital)',
      'No redacted or blacked-out transactions',
      'PDF format for digital submission',
    ],
    govUkReference: 'https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'spouse-p60-employer-letter',
    visaType: 'spouse',
    title: 'P60 or Employer Letter — Spouse/Partner Visa',
    shortTitle: 'P60 / Employer Letter',
    whatIsThis:
      "The P60 (annual tax summary from employer) or a current employer letter provides an independent confirmation of your sponsor's employment and income. The employer letter is especially important as it confirms current employment status at the time of application.",
    homeOfficeRequires:
      'Appendix FM-SE requires: "A letter from the employer confirming the person\'s employment, their gross annual salary, the period of employment, the type of employment (permanent, fixed-term contract, agency), and confirming the salary will continue for at least 6 months." The letter must be dated within 28 days of the application date and on company letterhead.',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Colour preferred to show letterhead',
      additionalSpecs: [
        'Employer letter: must be on official company letterhead',
        'Must be signed by a senior person (HR director, finance manager, etc.)',
        'Letter must be dated within 28 days of application submission',
        'P60: original or employer-certified copy',
      ],
    },
    whatToInclude: [
      "Employer letter confirming: employee full name, job title, gross annual salary, employment start date, contract type (permanent/fixed-term), and confirmation salary will continue",
      "P60 for the most recent complete tax year",
      "Signatory's name, job title, and direct contact details (phone and email)",
      "Company registration number on the letterhead",
    ],
    commonMistakes: [
      'Employer letter dated more than 28 days before application — it MUST be fresh',
      'Letter missing one or more required details (job title, salary, start date, contract type)',
      'Letter signed by a junior colleague instead of someone in HR/management',
      'No contact details for the signatory — Home Office may want to verify',
      'Salary on letter not matching payslips or bank statements',
      'P60 from wrong tax year or missing entirely',
    ],
    proTips: [
      'Give your employer the EXACT template of what to include — many HR departments are not familiar with Home Office requirements',
      "Request the letter no more than 2 weeks before your planned submission date — it must be within 28 days",
      'Ask the signatory to include their direct phone number and email — this speeds up verification',
      "If the employer is a small company, include Companies House registration details to prove it's a real business",
      'Keep a copy of the P60 — it also helps for future applications (ILR, citizenship)',
    ],
    checklist: [
      'Employer letter on official company letterhead',
      'Letter dated within 28 days of application date',
      'Includes: employee name, job title, gross annual salary, start date, contract type',
      'Includes: confirmation salary will continue for 6+ months',
      "Signed by HR manager/director with contact details",
      'Salary matches payslips and bank statements',
      'P60 for most recent tax year included',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'spouse-savings-evidence',
    visaType: 'spouse',
    title: 'Evidence of Savings — Spouse/Partner Visa',
    shortTitle: 'Savings Evidence',
    whatIsThis:
      "If your sponsor's income is below £29,000, you can use cash savings to meet the financial requirement. The formula is: (£29,000 minus actual income) multiplied by 2.5 = minimum savings required. If relying on savings alone (no income), you need £62,500+.",
    homeOfficeRequires:
      'Appendix FM-SE states: "Cash savings must have been held for at least the 28 days prior to the date of application in an account in the name of the applicant, their partner, or both jointly." The savings must be in an accessible account — not pensions, investments, or property equity.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: '300 DPI for scanned; native PDF for digital',
      maxFileSize: '10 MB per statement',
      colorMode: 'Colour or B&W if legible',
      additionalSpecs: [
        'Bank statements covering at least 28 consecutive days',
        'The 28-day period must end no more than 31 days before the application date',
        'Must show account holder name, account number, and daily/closing balance',
      ],
    },
    whatToInclude: [
      'Bank/building society statements covering 28+ consecutive days',
      'Account holder name (must be applicant, sponsor, or joint)',
      'Account number and sort code',
      'Daily or closing balance showing funds never dropped below the required amount',
      'If funds transferred recently: source evidence showing where the money came from',
      'Letter from bank confirming the account balance (additional supporting evidence)',
    ],
    commonMistakes: [
      'Funds not held for the full 28 consecutive days — even 27 days is insufficient',
      'Balance dipping below the required amount at any point during the 28 days',
      'Savings in a non-accessible account (pension, stocks, property equity)',
      'Account not in the name of the applicant or sponsor',
      'No evidence of the source of large recent deposits',
      'Using a 28-day window that ends more than 31 days before application',
    ],
    proTips: [
      'Transfer the full amount into a single savings account and leave it untouched for at least 35 days — gives you a buffer',
      "If you're combining income and savings, the formula is: (£29,000 − gross annual income) × 2.5 = savings needed",
      "Keep proof of WHERE the savings came from — sale of property, gift from family (with gift letter), inheritance, etc.",
      'A letter from the bank confirming the account balance on a specific date is helpful supporting evidence (but not a replacement for statements)',
    ],
    checklist: [
      'Savings amount meets the required threshold',
      'Funds held for 28+ consecutive days without dipping below threshold',
      '28-day window ends within 31 days of application date',
      'Account is in applicant or sponsor name (or joint)',
      'Account is accessible (not pension/investment/property)',
      'Bank statements clearly show daily/closing balances',
      'Source of large deposits evidenced',
      'Official statements (stamped or certified digital)',
    ],
    govUkReference: 'https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members',
    category: 'financial',
    priority: 'important',
  },
  {
    id: 'spouse-genuine-relationship',
    visaType: 'spouse',
    title: 'Proof of Genuine Relationship — Spouse/Partner Visa',
    shortTitle: 'Relationship Evidence',
    whatIsThis:
      "The Home Office must be satisfied that your relationship is 'genuine and subsisting'. This is assessed through a combination of documentary evidence showing your relationship history, shared life, and ongoing connection. This is one of the most scrutinised aspects of a spouse visa.",
    homeOfficeRequires:
      'The Immigration Rules require that the relationship is "genuine and subsisting" and that the couple "intend to live together permanently in the UK." Caseworkers assess the totality of evidence, including photographs, communication records, visits, and third-party testimony.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI for photos; native format for digital evidence',
      maxFileSize: '5 MB per photo; 10 MB for document compilations',
      colorMode: 'Full colour for photographs',
      additionalSpecs: [
        'Photos: include date and location on the back or in a caption',
        'Communication: screenshots showing dates and context',
        'Compile into a chronological narrative where possible',
      ],
    },
    whatToInclude: [
      '15–20 photographs spanning the entire relationship (dates + descriptions)',
      'Communication evidence: WhatsApp/text message logs, call records, video call screenshots',
      'Visit evidence: flight bookings, entry stamps, accommodation receipts',
      'Joint financial evidence: joint bank account, shared bills, insurance policies',
      'Third-party letters: 2–4 letters from friends/family describing the relationship',
      'Future plans: joint tenancy applications, wedding plans, shared goals',
      'Cover letter: chronological narrative of how you met, key milestones, and future plans',
    ],
    commonMistakes: [
      'Submitting 100+ random photos without dates or descriptions',
      'All photos from a single event or short period — need to show relationship over time',
      'No communication evidence during periods apart',
      'Third-party letters that are generic ("they seem happy") instead of specific and detailed',
      'Missing evidence from a specific period — gaps raise questions',
      'No future plans or evidence of intent to live together',
    ],
    proTips: [
      'Quality over quantity: 15–20 well-chosen photos with detailed captions beat 200 unlabelled ones',
      'Create a relationship timeline document: "How We Met → First Visit → Moving In → Marriage → Applying"',
      'For communication: a few pages of regular, everyday messages are more convincing than cherry-picked romantic ones',
      "Include at least one photo with each other's families — this shows integration into each other's lives",
      'Third-party letters should include the writer\'s ID, how they know you, and SPECIFIC observations (not vague praise)',
    ],
    checklist: [
      '15–20 dated and captioned photographs compiled',
      'Communication evidence from multiple time periods',
      'Visit evidence (flights, stamps, accommodation) included',
      'Joint financial evidence gathered (if any)',
      '2–4 third-party letters obtained (with ID copies)',
      'Cover letter / relationship timeline drafted',
      'Evidence of future plans in UK included',
      'Chronologically organised',
    ],
    govUkReference: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    category: 'supporting',
    priority: 'critical',
  },
  {
    id: 'spouse-accommodation',
    visaType: 'spouse',
    title: 'Accommodation Evidence — Spouse/Partner Visa',
    shortTitle: 'Accommodation Evidence',
    whatIsThis:
      'You must prove that you and your partner will have adequate accommodation in the UK that is not overcrowded. The Home Office checks that the property meets minimum space standards and is available to you.',
    homeOfficeRequires:
      'The Immigration Rules (Appendix FM) require: "The applicant and their partner must have adequate accommodation, without recourse to public funds, in housing which they own or occupy exclusively. The accommodation must not be overcrowded within the meaning of the Housing Act 1985."',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per document',
      colorMode: 'Colour preferred',
      additionalSpecs: [
        'Tenancy agreement: complete document including all pages and schedules',
        'Mortgage statement: recent statement showing property address',
        'If living with others: letter from homeowner + property details',
      ],
    },
    whatToInclude: [
      'Tenancy agreement (full document) OR mortgage statement',
      'Council tax bill showing the property address',
      'If living with family/friends: letter from homeowner confirming permission to stay',
      'Number of bedrooms and current occupants',
      'Utility bill at the property address (as additional proof)',
      'Property inspection report (if available — strengthens application)',
    ],
    commonMistakes: [
      'Not including the full tenancy agreement (all pages and schedules)',
      'Tenancy expired or about to expire — must be current',
      'Property overcrowded per Housing Act standards',
      'Living with family but no letter from the homeowner confirming permission',
      "Accommodation address not matching the sponsor's bank statements or payslips",
    ],
    proTips: [
      "If renting, ask your landlord for a letter confirming the tenancy and that they're aware a partner will be joining",
      "If living with family, get the homeowner to write a letter confirming: their ownership, how many rooms, who lives there, and that you're welcome",
      'Include a utility bill at the address for additional proof — it also helps establish the sponsor lives there',
      'If the property is Council Tax Band A–C in an expensive area, this can actually help demonstrate affordability',
    ],
    checklist: [
      'Tenancy agreement or mortgage statement obtained',
      'Council tax bill at property address',
      'Homeowner permission letter (if living with others)',
      'Property not overcrowded (check Housing Act 1985 standards)',
      'Address matches sponsor\'s other documents',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    category: 'supporting',
    priority: 'important',
  },
  {
    id: 'spouse-english-language',
    visaType: 'spouse',
    title: 'English Language Test Certificate — Spouse/Partner Visa',
    shortTitle: 'English Language Certificate',
    whatIsThis:
      'You must demonstrate English language ability at A1 level (speaking and listening) for an initial spouse visa. This ensures you can communicate at a basic level in the UK. Exemptions apply for nationals of majority English-speaking countries.',
    homeOfficeRequires:
      'Appendix English Language of the Immigration Rules requires: "A national of a majority English speaking country, or a person who has a degree that was taught or researched in English, or a person who passes an approved English language test." For spouse visa initial applications, the minimum is CEFR A1 (speaking and listening).',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Full colour scan of original',
      additionalSpecs: [
        'Must be from an approved Secure English Language Test (SELT) provider',
        'Certificate must show: full name (matching passport), test date, test level achieved, and unique reference number',
        'Test must be taken at an approved test centre',
      ],
    },
    whatToInclude: [
      'Original SELT certificate (IELTS Life Skills A1, Trinity GESE Grade 2, or equivalent)',
      'OR: proof of nationality exemption (passport from majority English-speaking country)',
      'OR: degree certificate + ECCTIS confirmation that the degree was taught in English',
      'Unique reference number / test report form number',
    ],
    commonMistakes: [
      'Taking the wrong type of IELTS — must be "IELTS Life Skills" for A1, NOT "IELTS Academic" or "IELTS General"',
      'Test taken at a non-approved centre — only SELT providers listed on gov.uk are accepted',
      'Certificate expired — IELTS Life Skills certificates are valid for 2 years',
      'Name on certificate not matching passport exactly',
      'Claiming nationality exemption when country is NOT on the approved list',
    ],
    proTips: [
      'Check if you\'re exempt first: nationals of Antigua, Australia, The Bahamas, Barbados, Belize, Canada, Dominica, Grenada, Guyana, Jamaica, Malta, New Zealand, St Kitts, St Lucia, St Vincent, Trinidad, USA are exempt',
      'Book at an approved SELT centre: trinity.college/SELT or ielts.org — check the gov.uk list for approved locations',
      'IELTS Life Skills A1 costs around £150 and results come within 7 days',
      "If you have a degree taught in English, get an ECCTIS (formerly NARIC) statement — it's cheaper than taking a test",
    ],
    checklist: [
      'English language requirement pathway identified (test / exemption / degree)',
      'SELT certificate obtained from approved provider (if test route)',
      'Certificate shows correct name, test date, and level achieved',
      'Certificate is within validity period (2 years for IELTS)',
      'ECCTIS confirmation obtained (if using degree route)',
      'Scanned in full colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/english-language',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'spouse-tb-test',
    visaType: 'spouse',
    title: 'TB Test Results — Spouse/Partner Visa',
    shortTitle: 'TB Test Results',
    whatIsThis:
      'A tuberculosis (TB) test certificate is required if you are applying from a country on the Home Office\'s TB testing list. This includes most countries in Africa, South and Southeast Asia, and parts of Eastern Europe and South America. The test must be conducted at an approved clinic.',
    homeOfficeRequires:
      'The Immigration Rules state: "Where an applicant is applying for entry clearance as a partner, they must, if they are applying from a country listed in Appendix T, provide a valid medical certificate confirming that they have undergone screening for active pulmonary tuberculosis."',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Full colour scan of original certificate',
      additionalSpecs: [
        'Certificate must be from a clinic approved by the Home Office for that country',
        'Must show: applicant name, date of test, clinic name, result, and doctor signature',
        'Valid for 6 months from date of test',
      ],
    },
    whatToInclude: [
      'Original TB test certificate from approved clinic',
      'Certificate showing: full name, date of birth, date of test, test result',
      'Clinic name and address (must be on the approved list)',
      'Doctor\'s signature and registration number',
      'Chest X-ray reference (if X-ray was conducted)',
    ],
    commonMistakes: [
      'Test taken at a non-approved clinic — only Home Office approved clinics are accepted',
      'Certificate expired — valid for only 6 months from test date',
      'Applying from a listed country without the certificate',
      'Name on certificate not matching passport',
      'Not checking whether your country is on the TB list',
    ],
    proTips: [
      'Check the full list of countries requiring TB tests at: gov.uk/tb-test-visa/countries-where-you-need-a-tb-test',
      'Find approved clinics at: gov.uk/tb-test-visa/test-centres',
      'Book your TB test as one of the first things you do — some clinics have long waiting lists',
      'Results typically take 1–2 days; the certificate is valid for 6 months, so get it early',
      'If you previously had TB that was treated, bring your treatment records to the appointment',
    ],
    checklist: [
      'Country checked against TB testing list',
      'Appointment booked at Home Office approved clinic',
      'Test completed and certificate received',
      'Certificate shows correct name, DOB, test date, and result',
      'Certificate is within 6-month validity period',
      'Original certificate available for submission',
      'Scanned copy at 300+ DPI for online upload',
    ],
    govUkReference: 'https://www.gov.uk/tb-test-visa',
    category: 'personal',
    priority: 'critical',
  },
];

// =============================================================================
// SKILLED WORKER VISA TEMPLATES (12)
// =============================================================================

const SKILLED_WORKER_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'sw-passport',
    visaType: 'skilled_worker',
    title: 'Valid Passport — Skilled Worker Visa',
    shortTitle: 'Valid Passport',
    whatIsThis:
      'Your current passport is the foundation of your Skilled Worker visa application. The Home Office uses it to verify your identity, and the name must match your Certificate of Sponsorship (CoS) exactly.',
    homeOfficeRequires:
      'Part 1 of the Immigration Rules: "The applicant must provide a valid national passport or other document satisfactorily establishing their identity and nationality." Name must match the CoS precisely.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI minimum',
      maxFileSize: '6 MB per page',
      colorMode: 'Full colour scan',
      additionalSpecs: [
        'Bio data page: crystal clear, no glare, no shadows',
        'All stamped pages included',
        'Previous passports if available',
      ],
    },
    whatToInclude: [
      'Bio data page (clear colour scan)',
      'All pages with visa stamps or endorsements',
      'All blank pages',
      'Previous passports (if available)',
    ],
    commonMistakes: [
      'Name on passport not matching CoS EXACTLY (even middle name variations)',
      'Passport expiring within 6 months',
      'Only scanning the bio page — need ALL pages',
      'Blurry or glare-affected scans',
    ],
    proTips: [
      'Verify your passport name matches your CoS before applying — ask your employer\'s HR to double-check',
      'If there\'s a name discrepancy, get it corrected on the CoS BEFORE applying',
      'Scan on a dark, flat surface for best contrast',
    ],
    checklist: [
      'Bio data page scanned clearly in colour',
      'All stamped/endorsed pages included',
      'Blank pages included',
      'Name matches CoS exactly',
      'Passport valid for 6+ months',
      '300+ DPI scan quality',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'sw-certificate-of-sponsorship',
    visaType: 'skilled_worker',
    title: 'Certificate of Sponsorship (CoS) — Skilled Worker Visa',
    shortTitle: 'Certificate of Sponsorship',
    whatIsThis:
      'The CoS is a virtual document — a reference number assigned by your UK employer through the Home Office Sponsor Management System (SMS). It contains all the key details of your sponsored role: job title, SOC code, salary, and working conditions. You won\'t receive a physical document.',
    homeOfficeRequires:
      'The Immigration Rules (Appendix Skilled Worker) state: "The applicant must have a valid Certificate of Sponsorship." The CoS must be assigned by a licensed sponsor, be used within 3 months of assignment, and contain accurate job details matching the going rate for the SOC code.',
    formatSpecs: {
      fileTypes: ['N/A — reference number only'],
      resolution: 'N/A',
      maxFileSize: 'N/A',
      colorMode: 'N/A',
      additionalSpecs: [
        'You will receive a CoS reference number from your employer (format: Sxxxxxxxx or similar)',
        'Enter this reference number in your online application',
        'Keep a record of the number for your files',
      ],
    },
    whatToInclude: [
      'CoS reference number (provided by your employer)',
      'Email or letter from employer confirming CoS assignment and details',
      'Screenshot of CoS details if your employer shares them (not required but helpful for your records)',
    ],
    commonMistakes: [
      'Applying more than 3 months after CoS assignment — the CoS expires',
      'CoS details (salary, job title, SOC code) not matching your actual employment contract',
      'Employer not having a valid sponsor licence at the time of application',
      'Using a CoS that was assigned to someone else or already used',
      'Not checking the SOC code going rate matches your offered salary',
    ],
    proTips: [
      'Ask your employer for written confirmation of the CoS details: reference number, job title, SOC code, and salary',
      'Verify your employer is on the public register of sponsors at gov.uk BEFORE they assign the CoS',
      'Apply as soon as possible after CoS assignment — you have a 3-month window',
      'If there\'s any discrepancy between the CoS and your contract, get it resolved with your employer before applying',
      'Your employer must pay the Immigration Skills Charge (£364–£1,000/year) — confirm they\'ve done this',
    ],
    checklist: [
      'CoS reference number received from employer',
      'CoS is within 3-month validity window',
      'Job title on CoS matches employment contract',
      'Salary on CoS matches contract (and meets threshold)',
      'SOC code is correct for the role',
      'Employer verified on public sponsor register',
      'Written confirmation from employer saved',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa/your-job',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'sw-qualifications',
    visaType: 'skilled_worker',
    title: 'Qualifications / Degree Certificates — Skilled Worker Visa',
    shortTitle: 'Qualifications/Degrees',
    whatIsThis:
      'Your academic and professional qualifications demonstrate that you meet the skill level required for the sponsored role. While not always mandatory (the CoS confirms the role is at the right level), qualifications strengthen your application significantly.',
    homeOfficeRequires:
      'The role must be at RQF Level 3 or above (A-level equivalent). While you don\'t always need to prove your qualifications if your employer certifies the role, having degree/qualification certificates available is strongly recommended. For non-UK qualifications, an ECCTIS (ENIC) statement may be required.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per document',
      colorMode: 'Full colour scan',
      additionalSpecs: [
        'Degree certificates: full page, legible',
        'Transcripts: if requested or helpful',
        'ECCTIS/ENIC statement for non-UK qualifications',
        'Certified English translations for non-English certificates',
      ],
    },
    whatToInclude: [
      'Degree certificate(s) — highest qualification and any relevant to the role',
      'Academic transcripts (if helpful for demonstrating relevant study)',
      'ECCTIS/ENIC statement of comparability (for non-UK qualifications)',
      'Professional certification or licensing documents (if applicable)',
      'Certified English translations for non-English certificates',
    ],
    commonMistakes: [
      'Not obtaining ECCTIS statement for non-UK degrees — processing takes 10–15 working days',
      'Qualifications not relevant to the sponsored role',
      'Name on certificate different from passport (due to name change)',
      'Submitting unofficial transcripts instead of certified copies',
    ],
    proTips: [
      'Apply for ECCTIS (formerly NARIC) comparison early — it takes 10–15 working days and costs around £50',
      'Even if your employer doesn\'t require it, having your qualifications ready shows preparation',
      'If your qualification is from a well-known university, it may not need ECCTIS — but having it removes all doubt',
      'Keep digital copies of all certificates in a secure cloud folder — you\'ll need them for future applications',
    ],
    checklist: [
      'Degree/qualification certificates scanned (300+ DPI, colour)',
      'ECCTIS statement obtained for non-UK qualifications',
      'Certified translations completed (if not in English)',
      'Name on certificates matches passport',
      'Relevant professional certifications included',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    category: 'personal',
    priority: 'important',
  },
  {
    id: 'sw-proof-of-funds',
    visaType: 'skilled_worker',
    title: 'Proof of Funds (£1,270 Minimum) — Skilled Worker Visa',
    shortTitle: 'Proof of Funds',
    whatIsThis:
      'You must show you can support yourself when you first arrive in the UK. The minimum maintenance requirement is £1,270, held in your bank account for at least 28 consecutive days. Many employers certify this on the CoS, removing the need for bank evidence.',
    homeOfficeRequires:
      'Appendix Skilled Worker states: "The applicant must show that they have personal savings of at least £1,270, held for a consecutive 28-day period ending no earlier than 31 days before the date of application." This is waived if the employer certifies maintenance on the CoS.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: '300 DPI for scans; native PDF for digital',
      maxFileSize: '10 MB',
      colorMode: 'Colour or clear B&W',
      additionalSpecs: [
        'Official bank statements showing 28 consecutive days',
        'Account holder name, account number visible',
        'Balance must not drop below £1,270 at any point in the 28 days',
      ],
    },
    whatToInclude: [
      'Bank statements covering 28+ consecutive days (if employer doesn\'t certify maintenance)',
      'OR: confirmation from employer that they have certified maintenance on the CoS',
      'Account holder name (must be in YOUR name)',
      'Closing balance for each day showing £1,270+ maintained',
    ],
    commonMistakes: [
      'Not checking whether employer has certified maintenance on the CoS — ask HR first',
      'Balance dropping below £1,270 even briefly during the 28-day period',
      'Using a family member\'s bank account instead of your own',
      '28-day window ending more than 31 days before application date',
      'Submitting informal bank app screenshots instead of official statements',
    ],
    proTips: [
      'Ask your employer first: "Have you certified maintenance on my CoS?" — if yes, you don\'t need bank statements',
      'If you need to show funds: put £1,500+ in your account and don\'t touch it for 35 days — gives you a buffer',
      'The funds must be in YOUR name — joint accounts are acceptable only if you\'re the named holder',
      'Official bank statements with the bank\'s stamp are gold standard',
    ],
    checklist: [
      'Check if employer certified maintenance on CoS',
      'If self-certifying: £1,270+ held for 28 consecutive days',
      '28-day window ends within 31 days of application',
      'Account in applicant\'s own name',
      'Official bank statements obtained',
      'Balance never dropped below £1,270',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa/money-youll-need-to-have',
    category: 'financial',
    priority: 'important',
  },
  {
    id: 'sw-employment-contract',
    visaType: 'skilled_worker',
    title: 'Employment Contract / Offer Letter — Skilled Worker Visa',
    shortTitle: 'Employment Contract',
    whatIsThis:
      'Your employment contract or formal offer letter confirms the terms of your employment, including salary, job title, and conditions. The details must match your Certificate of Sponsorship exactly.',
    homeOfficeRequires:
      'While not explicitly listed as a mandatory document, the Home Office may request your employment contract to verify CoS details. Best practice (and OISC guidance) is to include it proactively. The salary, job title, and working conditions should match the CoS.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: '300 DPI for scanned copies',
      maxFileSize: '10 MB',
      colorMode: 'Colour preferred (shows company letterhead)',
      additionalSpecs: [
        'Full contract or offer letter — all pages',
        'On company letterhead',
        'Signed by authorised representative',
      ],
    },
    whatToInclude: [
      'Complete employment contract OR formal offer letter',
      'Job title (must match CoS)',
      'Gross annual salary (must match CoS)',
      'Working hours and location',
      'Start date',
      'Contract type (permanent, fixed-term)',
      'Signature from authorised representative',
    ],
    commonMistakes: [
      'Salary on contract doesn\'t match CoS — even £1 difference causes issues',
      'Job title different from CoS (e.g. "Senior Developer" vs "Software Engineer")',
      'Contract not signed by both parties',
      'Only providing the offer letter but not the full contract',
      'Contract start date before visa grant date',
    ],
    proTips: [
      'Compare your contract against the CoS details line by line before applying',
      'If there\'s any discrepancy, get your employer to either update the contract OR re-issue the CoS',
      'Include both the offer letter AND the contract if you have both',
      'Ensure your start date is AFTER your expected visa grant date',
    ],
    checklist: [
      'Employment contract / offer letter obtained',
      'Job title matches CoS exactly',
      'Salary matches CoS exactly',
      'Working hours and location specified',
      'On company letterhead',
      'Signed by authorised representative',
      'All pages included',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa/your-job',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'sw-english-language',
    visaType: 'skilled_worker',
    title: 'English Language Evidence — Skilled Worker Visa',
    shortTitle: 'English Language Evidence',
    whatIsThis:
      'Skilled Worker visa applicants must demonstrate English at CEFR B1 level (intermediate). This is higher than the A1 required for initial spouse visas. It can be proven through an approved test, a degree taught in English, or nationality exemption.',
    homeOfficeRequires:
      'Appendix English Language requires evidence of English at B1 (CEFR) in speaking, listening, reading, and writing. Accepted evidence: IELTS for UKVI (min 4.0 in each component), a UK degree, a non-UK degree taught in English with ECCTIS confirmation, or nationality of a majority English-speaking country.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Full colour',
      additionalSpecs: [
        'Test certificate: original or certified copy',
        'Must show test date, score, and unique reference number',
        'ECCTIS letter if using degree route',
      ],
    },
    whatToInclude: [
      'IELTS for UKVI test report form showing B1+ in all components',
      'OR: UK degree certificate',
      'OR: non-UK degree certificate + ECCTIS confirmation of English-language teaching',
      'OR: passport proving nationality of majority English-speaking country',
      'Unique reference number for test verification',
    ],
    commonMistakes: [
      'Taking "IELTS Academic" instead of "IELTS for UKVI" — different product!',
      'Score below 4.0 in any single component (all four must be 4.0+)',
      'Test taken at non-approved SELT centre',
      'Test certificate expired (valid for 2 years)',
      'Not getting ECCTIS confirmation for non-UK degree',
    ],
    proTips: [
      'A UK degree at ANY level (including foundation) satisfies this requirement completely',
      'IELTS for UKVI costs around £170–200 — book at ielts.org and choose a SELT centre',
      'If using the degree route, ECCTIS comparison costs £49.50 and takes 10–15 working days',
      'Many tech and business degrees from international universities are taught in English — check with your university',
    ],
    checklist: [
      'English evidence pathway identified',
      'IELTS for UKVI certificate obtained (if test route)',
      'All four components scored 4.0+ (B1 minimum)',
      'Certificate within 2-year validity',
      'ECCTIS statement obtained (if degree route)',
      'Name on certificate matches passport',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/english-language',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'sw-criminal-record',
    visaType: 'skilled_worker',
    title: 'Criminal Record Certificate — Skilled Worker Visa',
    shortTitle: 'Criminal Record Certificate',
    whatIsThis:
      'A criminal record certificate (police clearance) is required if your sponsored role involves working with children, vulnerable adults, or in healthcare/education. You need one from every country you\'ve lived in for 12+ months in the last 10 years.',
    homeOfficeRequires:
      'The Immigration Rules require a criminal record certificate for roles where the worker will be "working with children or vulnerable adults." The certificate must be from each country where the applicant has lived for 12 months or more in the last 10 years.',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per certificate',
      colorMode: 'Full colour',
      additionalSpecs: [
        'Must be original or certified copy',
        'Certified English translation required if not in English',
        'Must be recent (ideally within 6 months of application)',
      ],
    },
    whatToInclude: [
      'Criminal record certificate from every country lived in for 12+ months in the last 10 years',
      'Certified English translations for non-English certificates',
      'If unavailable from a particular country: explanation letter detailing attempts to obtain it',
    ],
    commonMistakes: [
      'Not realising your role requires one — confirm with your employer',
      'Only providing certificate from current country, not ALL countries lived in for 12+ months',
      'Certificate too old at time of application',
      'Not translating non-English certificates',
      'Processing times: some countries take 3+ months',
    ],
    proTips: [
      'Start this process early — some countries (India, Nigeria, etc.) take 2–3 months to issue',
      'Check with your employer whether your role requires a criminal record certificate before paying for one',
      'In the UK, this is done through the DBS (Disclosure and Barring Service) — your employer usually initiates this',
      'If a country doesn\'t issue criminal record certificates, write a letter explaining and provide alternative evidence',
    ],
    checklist: [
      'Confirm with employer if criminal record certificate is required',
      'List all countries lived in for 12+ months in last 10 years',
      'Criminal record certificate requested from each country',
      'Certificates received and within validity period',
      'Certified translations completed (if applicable)',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa/documents-youll-need-to-apply',
    category: 'personal',
    priority: 'important',
  },
  {
    id: 'sw-healthcare-surcharge',
    visaType: 'skilled_worker',
    title: 'Healthcare Surcharge Payment Receipt — Skilled Worker Visa',
    shortTitle: 'Healthcare Surcharge Receipt',
    whatIsThis:
      'The Immigration Health Surcharge (IHS) is a mandatory payment that gives you access to the NHS during your visa. Currently £1,035 per year. You pay this as part of the online application, and receive a payment reference (IHS number).',
    homeOfficeRequires:
      'All Skilled Worker visa applicants must pay the IHS. The payment is made during the online application process at immigration-health-surcharge.service.gov.uk. You will receive an IHS reference number which is linked to your application.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: 'N/A — digital receipt',
      maxFileSize: 'N/A',
      colorMode: 'N/A',
      additionalSpecs: [
        'Payment is made online during the application',
        'You receive an IHS reference number',
        'Save the confirmation email and reference number',
      ],
    },
    whatToInclude: [
      'IHS payment confirmation email',
      'IHS reference number',
      'Payment amount and date',
      'Save a PDF of the confirmation page',
    ],
    commonMistakes: [
      'Not budgeting for the IHS — it can be several thousand pounds for multi-year visas',
      'Losing the confirmation email with the IHS reference number',
      'Not paying the correct amount for the visa duration',
      'Health/care worker discount: eligible workers pay £624/year instead of £1,035',
    ],
    proTips: [
      'The IHS is refundable if your visa is refused — apply for a refund through the official portal',
      'Health and care workers pay a reduced rate: £624/year — check if your SOC code qualifies',
      'Save a PDF/screenshot of your IHS payment confirmation immediately — don\'t rely on finding the email later',
      'Total cost for a 3-year visa at standard rate: £3,105 (£1,035 × 3)',
    ],
    checklist: [
      'IHS payment completed during online application',
      'IHS reference number saved',
      'Confirmation email saved (and PDF\'d)',
      'Correct amount paid for visa duration',
      'Health/care worker discount applied if eligible',
    ],
    govUkReference: 'https://www.gov.uk/healthcare-immigration-application',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'sw-company-registration',
    visaType: 'skilled_worker',
    title: 'Company Registration (Self-Sponsored) — Skilled Worker Visa',
    shortTitle: 'Company Registration',
    whatIsThis:
      'If you\'re sponsoring yourself through your own UK company (self-sponsorship), you must prove the company is a genuine, trading business with a valid sponsor licence. This is a more complex route and faces additional scrutiny.',
    homeOfficeRequires:
      'The company must hold a valid Skilled Worker sponsor licence. The Home Office will assess whether the company is a genuine employer with a genuine vacancy. Additional evidence of trading activity, turnover, and business purpose is typically requested.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: '300 DPI for scanned documents',
      maxFileSize: '10 MB',
      colorMode: 'Colour preferred',
      additionalSpecs: [
        'Companies House registration certificate/confirmation',
        'Company accounts and tax returns',
        'Evidence of business activity (contracts, invoices, bank statements)',
      ],
    },
    whatToInclude: [
      'Companies House registration certificate',
      'Company accounts (latest filed)',
      'Corporation tax returns',
      'Business bank statements (6 months)',
      'Client contracts or invoices demonstrating genuine trading',
      'Company organisational chart',
      'Evidence the vacancy is genuine (not created solely for immigration)',
    ],
    commonMistakes: [
      'Company has no genuine trading activity — the Home Office will investigate',
      'Role appears to be created solely for immigration purposes',
      'Company turnover too low to justify the salary being paid',
      'No evidence of other employees or business activity',
      'Sponsor licence application rejected due to insufficient evidence',
    ],
    proTips: [
      'Self-sponsorship is heavily scrutinised — consider professional immigration advice before proceeding',
      'The company needs to demonstrate it has genuine business activity, clients, and revenue',
      'Having other employees (even 1–2) significantly strengthens the case',
      'Keep immaculate business records — the Home Office may conduct a compliance visit',
      'Your salary must be justified by the company\'s revenue and financial position',
    ],
    checklist: [
      'Company registered at Companies House',
      'Valid sponsor licence obtained (or application in progress)',
      'Latest company accounts filed',
      'Corporation tax returns up to date',
      'Business bank statements showing trading activity',
      'Client contracts/invoices demonstrating genuine business',
      'Role genuinely needed (not created for immigration)',
      'Salary justified by company finances',
    ],
    govUkReference: 'https://www.gov.uk/uk-visa-sponsorship-employers',
    category: 'financial',
    priority: 'important',
  },
  {
    id: 'sw-references',
    visaType: 'skilled_worker',
    title: 'References from Previous Employers — Skilled Worker Visa',
    shortTitle: 'Employer References',
    whatIsThis:
      'References from previous employers help establish your professional credentials and work history. While not always required, they strengthen your application — particularly if your career path is unusual or if the Home Office has questions about your experience.',
    homeOfficeRequires:
      'Not explicitly required in the Immigration Rules for most Skilled Worker applications. However, caseworkers may request additional evidence of professional experience, and references serve this purpose. OISC best practice recommends including them proactively.',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per reference',
      colorMode: 'Colour (shows letterhead)',
      additionalSpecs: [
        'On company letterhead',
        'Signed by HR manager or direct supervisor',
        'Include referee contact details for verification',
      ],
    },
    whatToInclude: [
      'Reference letters from 2–3 most recent/relevant employers',
      'Each letter: job title, dates of employment, key responsibilities, and performance',
      'Referee name, title, and direct contact details',
      'On company letterhead and signed',
    ],
    commonMistakes: [
      'References that contradict your CV or CoS details',
      'Dates of employment not matching your stated career history',
      'References from personal contacts rather than professional ones',
      'No contact details for verification',
    ],
    proTips: [
      'Give your referees the specific format: dates, job title, responsibilities, and their contact info',
      'References are most valuable when they match the skills needed for your new role',
      'If previous employers are unreachable (company closed, etc.), provide a signed statement explaining',
      'LinkedIn recommendations can supplement (but not replace) formal reference letters',
    ],
    checklist: [
      '2–3 reference letters obtained',
      'Each on company letterhead with signature',
      'Dates of employment match CV and career history',
      'Referee contact details included',
      'References relevant to sponsored role',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa',
    category: 'supporting',
    priority: 'optional',
  },
  {
    id: 'sw-project-portfolio',
    visaType: 'skilled_worker',
    title: 'Project Portfolio — Skilled Worker Visa',
    shortTitle: 'Project Portfolio',
    whatIsThis:
      'A project portfolio demonstrates your professional capabilities through examples of your work. This is particularly relevant for creative, tech, engineering, and consulting roles where your output is a better indicator of skill than qualifications alone.',
    homeOfficeRequires:
      'Not a standard requirement, but the Home Office may request additional evidence of your suitability for the role, especially if your formal qualifications don\'t directly align with the sponsored position. A portfolio serves as supporting evidence of capability.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: '150–300 DPI for images within the portfolio',
      maxFileSize: '15 MB for the complete portfolio',
      colorMode: 'Full colour',
      additionalSpecs: [
        'Compile as a single PDF document',
        'Include project descriptions, your role, outcomes, and dates',
        'Anonymise client data if under NDA',
      ],
    },
    whatToInclude: [
      '5–10 most relevant projects',
      'For each: project name, client (anonymised if needed), your role, outcomes/results, dates',
      'Screenshots, designs, or technical documentation where helpful',
      'Metrics and achievements (e.g. "reduced processing time by 40%")',
      'Technologies/methodologies used',
    ],
    commonMistakes: [
      'Including confidential client information without permission',
      'Portfolio not relevant to the sponsored role',
      'No dates or context for projects — looks fabricated',
      'Too long — keep it focused and concise (10–15 pages max)',
    ],
    proTips: [
      'Focus on projects that directly relate to your new role — show transferable skills',
      'Include measurable outcomes where possible (revenue generated, efficiency gains, etc.)',
      'If under NDA, anonymise client details but keep the project description substantive',
      'A well-designed PDF portfolio shows professionalism — use consistent formatting',
    ],
    checklist: [
      '5–10 relevant projects selected',
      'Each project has context, role, outcomes, and dates',
      'Confidential information anonymised',
      'Compiled as single PDF (under 15 MB)',
      'Relevant to the sponsored role',
      'Professional formatting',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa',
    category: 'supporting',
    priority: 'optional',
  },
  {
    id: 'sw-professional-credentials',
    visaType: 'skilled_worker',
    title: 'Professional Credentials / Licenses — Skilled Worker Visa',
    shortTitle: 'Professional Credentials',
    whatIsThis:
      'Certain professions in the UK require specific licenses or registrations to practice (e.g. GMC for doctors, NMC for nurses, RICS for surveyors, SRA for solicitors). If your role requires professional registration, you must provide evidence.',
    homeOfficeRequires:
      'If the role requires professional registration under UK law, the applicant must be registered or have applied for registration. The CoS should reflect this requirement. The Immigration Rules don\'t specify professional credentials universally, but regulated professions require evidence of licensing.',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per document',
      colorMode: 'Full colour',
      additionalSpecs: [
        'License/registration certificate or confirmation letter',
        'Professional body membership card or certificate',
        'Evidence of application for UK registration (if in progress)',
      ],
    },
    whatToInclude: [
      'Professional license or registration certificate',
      'Confirmation letter from professional body',
      'Evidence of UK equivalence assessment (if licence is from another country)',
      'Application receipt for UK registration (if still being processed)',
      'Continuing professional development (CPD) records (if relevant)',
    ],
    commonMistakes: [
      'Not checking whether your role requires UK professional registration',
      'Overseas licence not recognised in the UK — need to apply for UK equivalence',
      'Registration expired or not yet completed',
      'Professional body name on certificate not matching UK regulatory body',
    ],
    proTips: [
      'Check with your employer whether your role is a regulated profession in the UK',
      'For healthcare roles: GMC, NMC, or HCPC registration may take months — start early',
      'For engineering: Engineering Council registration (CEng, IEng) may be required',
      'Some professional registrations can be started from overseas — check the relevant body\'s website',
    ],
    checklist: [
      'Identified whether role requires professional registration',
      'Professional credentials/licenses obtained or application submitted',
      'UK equivalence assessment completed (if overseas qualification)',
      'Registration current and not expired',
      'Confirmation from professional body obtained',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/skilled-worker-visa',
    category: 'supporting',
    priority: 'important',
  },
];

// =============================================================================
// CITIZENSHIP TEMPLATES (13)
// =============================================================================

const CITIZENSHIP_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'cit-passport-all',
    visaType: 'citizenship',
    title: 'Valid Passport (Current + All Previous) — Citizenship',
    shortTitle: 'All Passports',
    whatIsThis:
      'For citizenship applications, the Home Office requires not just your current passport but ALL previous passports. These are used to verify your complete travel history over the qualifying 5-year (or 3-year) residence period. Missing passports significantly complicate the application.',
    homeOfficeRequires:
      'Form AN requires full details of all current and previous travel documents. The Home Office uses passport stamps to verify your travel history and cross-reference your declared absences from the UK.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per page',
      colorMode: 'Full colour — every page, every passport',
      additionalSpecs: [
        'Current passport: all pages scanned',
        'ALL previous passports: all pages scanned',
        'If a passport is lost: explanation letter + Subject Access Request from Home Office',
      ],
    },
    whatToInclude: [
      'Current valid passport — every page (including blank)',
      'All previous passports — every page',
      'If passport lost/destroyed: written explanation and Subject Access Request (SAR) from Home Office',
      'Any travel documents or emergency travel documents used during the qualifying period',
    ],
    commonMistakes: [
      'Not including old/expired passports — the Home Office needs ALL of them',
      'Lost passports with no SAR to fill the gap',
      'Pages missing or poorly scanned',
      'Not declaring a passport you used during the qualifying period',
    ],
    proTips: [
      'Submit a Subject Access Request (SAR) to the Home Office early if you\'ve lost any passports — it takes 1–3 months',
      'SAR will show your UK entry/exit records, which compensates for missing stamps',
      'If you\'ve renewed your passport during the qualifying period, you need BOTH the old and new',
      'Scan every single page, even if blank — demonstrates completeness',
    ],
    checklist: [
      'Current passport scanned (all pages, colour, 300+ DPI)',
      'All previous passports scanned (all pages)',
      'Lost passport explanations written (if applicable)',
      'Subject Access Request submitted (if passports missing)',
      'All travel during qualifying period accounted for',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'cit-brp',
    visaType: 'citizenship',
    title: 'Biometric Residence Permit (BRP) — Citizenship',
    shortTitle: 'BRP / ILR Proof',
    whatIsThis:
      'Your BRP shows your current immigration status — specifically that you hold Indefinite Leave to Remain (ILR), which is the prerequisite for citizenship. Without ILR (or equivalent settled status), you cannot apply for naturalisation.',
    homeOfficeRequires:
      'Form AN requires evidence of settled status. The applicant must hold ILR, EU settled status, or equivalent permanent residence on the date of application AND have held it for at least 12 months.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Full colour — BOTH sides of BRP',
      additionalSpecs: [
        'Scan both front and back of BRP',
        'If BRP expired but ILR still valid: include cover letter explaining',
        'For EU settled status: generate a share code',
      ],
    },
    whatToInclude: [
      'BRP card — both sides, full colour scan',
      'OR: EU settled status share code printout',
      'OR: ILR vignette in passport (if no BRP)',
      'If BRP expired: cover letter explaining ILR is still valid',
    ],
    commonMistakes: [
      'Only scanning one side of the BRP — both sides required',
      'BRP expired and not replaced — the ILR itself doesn\'t expire, but the BRP card does',
      'Not including the BRP at all (some people forget they have it)',
      'Confusing limited leave with ILR — you MUST have ILR/settled status',
    ],
    proTips: [
      'Your ILR doesn\'t expire even if the BRP card does — but include a cover letter explaining this',
      'For EU settled status: generate a share code at gov.uk/view-prove-immigration-status — it\'s valid for 30 days',
      'If you\'ve lost your BRP, apply for a replacement (£56) or request a No Time Limit (NTL) stamp',
      'Scan both sides of the BRP flat on a dark background for best clarity',
    ],
    checklist: [
      'BRP scanned (both sides, colour, 300+ DPI)',
      'ILR/settled status confirmed',
      'ILR held for at least 12 months',
      'If BRP expired: cover letter included',
      'EU settled status: share code generated (if applicable)',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'cit-life-in-uk',
    visaType: 'citizenship',
    title: 'Life in the UK Test Pass Certificate — Citizenship',
    shortTitle: 'Life in UK Test Certificate',
    whatIsThis:
      'The Life in the UK test is a mandatory requirement for citizenship. It covers British values, history, traditions, and everyday life. Once passed, the certificate never expires. You need to pass before applying for citizenship.',
    homeOfficeRequires:
      'The applicant must "have sufficient knowledge about life in the United Kingdom" as evidenced by passing the Life in the UK test. The test pass letter/certificate must be provided with the citizenship application.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Full colour',
      additionalSpecs: [
        'Pass notification letter or certificate',
        'Must show: full name, date of test, unique reference number, and "PASS" result',
      ],
    },
    whatToInclude: [
      'Original Life in the UK test pass notification letter',
      'Full name (matching passport)',
      'Test date and unique reference number',
      'Pass confirmation',
    ],
    commonMistakes: [
      'Name on test certificate not matching passport',
      'Losing the pass notification letter — request a replacement from LITUK',
      'Confusing "Life in the UK" with English language requirement — they\'re separate (though passing LITUK can count as English evidence)',
      'Not taking the test before applying',
    ],
    proTips: [
      'Book at lifeintheuktest.gov.uk — costs £50',
      'Study the official handbook "Life in the United Kingdom: A Guide for New Residents" — most questions come from it',
      'Pass mark: 18 out of 24 (75%) — you have 45 minutes',
      'Results are immediate — you\'ll know before you leave the test centre',
      'The pass certificate never expires — take it whenever you\'re ready, even years before applying',
    ],
    checklist: [
      'Life in the UK test passed',
      'Pass notification letter obtained',
      'Name on certificate matches passport',
      'Reference number visible',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/life-in-the-uk-test',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'cit-tax-records',
    visaType: 'citizenship',
    title: 'Tax Records / P60s (Past 5 Years) — Citizenship',
    shortTitle: 'Tax Records (5 Years)',
    whatIsThis:
      'Tax records demonstrate that you\'ve been economically active and tax-compliant during your residence in the UK. While not always explicitly required, they are strong evidence of good character and integration — and the Home Office routinely checks HMRC records.',
    homeOfficeRequires:
      'Form AN asks about employment history and sources of income. The Home Office cross-references with HMRC. Any unpaid taxes or unfiled returns can be treated as evidence of poor character and lead to refusal.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: 'Native digital (from HMRC online) or 300 DPI scan',
      maxFileSize: '10 MB',
      colorMode: 'Colour or B&W if legible',
      additionalSpecs: [
        'P60s from each employer for each tax year',
        'HMRC tax summaries accessible via Personal Tax Account',
        'Self-assessment returns if self-employed',
      ],
    },
    whatToInclude: [
      'P60 for each tax year in the qualifying period (from each employer)',
      'HMRC tax summary / tax calculation for each year',
      'Self-assessment tax returns (SA302) if self-employed',
      'National Insurance contribution record',
      'Evidence of any tax debts paid or payment arrangements',
    ],
    commonMistakes: [
      'Unfiled self-assessment tax returns — resolve BEFORE applying',
      'Outstanding tax debts — pay or arrange payment plan first',
      'Missing P60s from previous employers — request from HMRC',
      'Not including National Insurance records',
      'Gaps in employment with no explanation',
    ],
    proTips: [
      'Access your full tax history through your Personal Tax Account at gov.uk/personal-tax-account',
      'Download tax summaries for each year as PDFs — these are the cleanest format',
      'If you\'re missing P60s, HMRC can provide tax calculation summaries that serve the same purpose',
      'If you have tax issues, resolve them BEFORE applying — the Home Office WILL check',
      'National Insurance record is available at gov.uk/check-national-insurance-record',
    ],
    checklist: [
      'P60s collected for each qualifying year',
      'HMRC tax summaries downloaded',
      'Self-assessment returns up to date (if applicable)',
      'No outstanding tax debts or issues',
      'National Insurance record obtained',
      'All years of qualifying period covered',
      'PDFs saved from HMRC portal',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'financial',
    priority: 'important',
  },
  {
    id: 'cit-payslips-self-employment',
    visaType: 'citizenship',
    title: 'Payslips or Self-Employment Evidence — Citizenship',
    shortTitle: 'Employment Evidence',
    whatIsThis:
      'Evidence of employment or self-employment during your residence period demonstrates economic contribution and good character. This complements your tax records and helps establish a complete picture of your time in the UK.',
    homeOfficeRequires:
      'Form AN requires full employment history. Caseworkers assess this as part of the "good character" requirement. Consistent employment shows integration and contribution to UK society.',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI for scans; native PDF for digital payslips',
      maxFileSize: '10 MB',
      colorMode: 'Colour or clear B&W',
      additionalSpecs: [
        'Payslips: at least representative samples from each employer',
        'Self-employment: SA302, invoices, contracts',
        'Employment letters confirming dates of employment',
      ],
    },
    whatToInclude: [
      'Representative payslips from each employer during qualifying period',
      'Employment contracts or offer letters',
      'If self-employed: SA302 tax returns, sample invoices, business accounts',
      'Letters from employers confirming employment dates (if payslips unavailable)',
      'Any gaps in employment explained (studying, caring responsibilities, etc.)',
    ],
    commonMistakes: [
      'Large unexplained gaps in employment',
      'Employment history not matching declared information on Form AN',
      'Missing evidence from a significant employer',
      'Self-employment income not declared to HMRC',
    ],
    proTips: [
      'You don\'t need EVERY payslip — representative samples from each employer are sufficient',
      'Focus on completeness: every period of your qualifying residence should be accounted for',
      'If you had periods of unemployment, explain them (studying, job seeking, family care)',
      'Employment letters from former employers should include: your name, dates, and job title',
    ],
    checklist: [
      'Employment history compiled for qualifying period',
      'Representative payslips from each employer',
      'Self-employment evidence gathered (if applicable)',
      'Employment confirmation letters obtained where payslips unavailable',
      'Gaps in employment explained',
      'History matches Form AN declaration',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'financial',
    priority: 'important',
  },
  {
    id: 'cit-absences-record',
    visaType: 'citizenship',
    title: 'Full UK Absences Record — Citizenship',
    shortTitle: 'UK Absences Record',
    whatIsThis:
      'A comprehensive record of every trip outside the UK during your qualifying period. This is one of the MOST CRITICAL elements of a citizenship application. The Home Office has strict limits: no more than 450 days outside the UK in 5 years, and no more than 90 days in the final 12 months. Even 1 day over = automatic refusal.',
    homeOfficeRequires:
      'Form AN requires a complete record of all absences from the UK during the qualifying period. The applicant must not have been absent for more than 450 days in 5 years (or 270 days in 3 years for spouses), and no more than 90 days in the final 12 months.',
    formatSpecs: {
      fileTypes: ['PDF', 'XLSX'],
      resolution: 'N/A — typed document',
      maxFileSize: '5 MB',
      colorMode: 'N/A',
      additionalSpecs: [
        'Spreadsheet or typed document',
        'For each trip: departure date, return date, number of days, destination, purpose',
        'Running total of absence days',
        'Supporting evidence: flight bookings, passport stamps, boarding passes',
      ],
    },
    whatToInclude: [
      'Complete spreadsheet listing EVERY trip outside the UK',
      'Columns: departure date, return date, total days absent, destination country, purpose of trip',
      'Running total of days absent',
      'Supporting evidence: flight bookings, passport stamps, travel itineraries',
      'Final 12-month absence calculation clearly shown separately',
    ],
    commonMistakes: [
      'Underestimating the number of days — the departure AND return days both count as days outside the UK',
      'Forgetting short trips (weekend trips, day trips to Ireland)',
      'Not counting transit days',
      'Running total exceeding 450 days without realising',
      'Final 12-month absences exceeding 90 days',
      'Inconsistencies between declared absences and passport stamps',
    ],
    proTips: [
      'Count carefully: the day you LEAVE the UK and the day you RETURN both count as absence days',
      'Use passport stamps, flight booking confirmations, and bank card transactions abroad to verify dates',
      'Create a spreadsheet with formulas calculating running totals automatically',
      'If you\'re close to 450 days: delay your application to start a new qualifying window',
      'For the final 12 months: plan ahead and minimise travel — 90 days is stricter than you think',
      'The Home Office may request entry/exit records from airlines — your records must match',
    ],
    checklist: [
      'Complete absence spreadsheet compiled',
      'Every trip listed with dates, destination, and purpose',
      'Running total calculated (must be under 450 days / 5 years)',
      'Final 12-month absences calculated separately (must be under 90 days)',
      'Supporting evidence gathered (flight bookings, stamps)',
      'Cross-referenced with passport stamps',
      'No undeclared trips',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'cit-english-language',
    visaType: 'citizenship',
    title: 'English Language Certificate — Citizenship',
    shortTitle: 'English Language (B1+)',
    whatIsThis:
      'Citizenship requires English at B1 level (CEFR) or above. This can be demonstrated through a SELT test, a UK degree, a degree taught in English, or by passing the Life in the UK test (which also counts as English evidence).',
    homeOfficeRequires:
      'The applicant must demonstrate "sufficient knowledge of the English language" at CEFR B1 level. This can be proven through the same methods as for other visas, PLUS the Life in the UK test pass can serve as English language evidence.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB',
      colorMode: 'Full colour',
      additionalSpecs: [
        'SELT certificate, degree certificate, or Life in the UK pass letter',
        'Must clearly show name, date, and level achieved',
      ],
    },
    whatToInclude: [
      'IELTS for UKVI certificate (B1 or above in all components)',
      'OR: UK degree certificate',
      'OR: non-UK degree + ECCTIS confirmation of English teaching',
      'OR: Life in the UK test pass letter (counts as English evidence)',
      'OR: passport from majority English-speaking country',
    ],
    commonMistakes: [
      'Not realising the Life in the UK test pass can count as English evidence — many people take an unnecessary IELTS',
      'Taking IELTS Academic instead of IELTS for UKVI',
      'Certificate expired or name mismatch',
    ],
    proTips: [
      'If you\'ve already passed the Life in the UK test, that counts as English evidence — no need for a separate English test',
      'A UK degree at any level also satisfies this requirement',
      'If you\'re from a majority English-speaking country, you\'re exempt — just provide your passport',
    ],
    checklist: [
      'English evidence pathway identified',
      'Certificate/evidence obtained',
      'Name matches passport',
      'Within validity period (if applicable)',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/english-language',
    category: 'personal',
    priority: 'critical',
  },
  {
    id: 'cit-referee-details',
    visaType: 'citizenship',
    title: 'Referee Details Form (2 Referees) — Citizenship',
    shortTitle: 'Referee Details (2 Referees)',
    whatIsThis:
      'Every citizenship application requires two referees who have known you for at least 3 years. One must be a "professional person" (doctor, lawyer, teacher, accountant, etc.), and the other must be a British citizen. Neither can be related to you, your partner, or each other.',
    homeOfficeRequires:
      'Form AN requires two referees. Referee 1 must be a person of standing in the community who holds a recognised professional qualification. Referee 2 must be a British citizen. Both must have known the applicant personally for 3+ years and must not be related to the applicant or each other.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: 'N/A — completed within Form AN',
      maxFileSize: 'N/A',
      colorMode: 'N/A',
      additionalSpecs: [
        'Referees complete their sections of Form AN directly',
        'They provide: full name, occupation, address, passport number, how long known, and declaration',
        'Referees may be contacted by the Home Office for verification',
      ],
    },
    whatToInclude: [
      'Referee 1 (Professional): full name, professional qualification, workplace, contact details',
      'Referee 2 (British Citizen): full name, British passport number, address, contact details',
      'Both: signed declaration on Form AN',
      'Both: confirmation they have known you for 3+ years',
    ],
    commonMistakes: [
      'Referee doesn\'t meet the criteria (not professional enough, or not British)',
      'Referees related to each other or to you',
      'Referee hasn\'t known you for the full 3 years',
      'Referee not available when the Home Office contacts them',
      'Referee details on form don\'t match their actual identity documents',
    ],
    proTips: [
      'Choose referees who will respond promptly if contacted — the Home Office may call or write to them',
      'Brief your referees on what to expect: "You may be contacted to confirm you know me and for how long"',
      'Professional referees can include: doctors, dentists, teachers, lecturers, solicitors, accountants, police officers, social workers, civil servants, members of the clergy',
      'Your employer (if British and a professional) can count as one of your referees',
      'Have a backup referee in case one becomes unavailable',
    ],
    checklist: [
      'Referee 1 (Professional) identified and confirmed willing',
      'Referee 2 (British Citizen) identified and confirmed willing',
      'Both have known you for 3+ years',
      'Neither is related to you, your partner, or each other',
      'Contact details verified and current',
      'Referees briefed on process and potential Home Office contact',
      'Referee sections of Form AN completed',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'supporting',
    priority: 'critical',
  },
  {
    id: 'cit-good-character',
    visaType: 'citizenship',
    title: 'Good Character Evidence — Citizenship',
    shortTitle: 'Good Character Evidence',
    whatIsThis:
      'The "good character" requirement is one of the most important (and subjective) aspects of a citizenship application. The Home Office assesses whether you are a person of good character based on criminal record, financial dealings, immigration history, and general conduct. Unlike visa applications, even spent convictions must be declared.',
    homeOfficeRequires:
      'The British Nationality Act 1981 requires the applicant to be "of good character." The Home Office guidance states: "All convictions, including spent convictions, driving offences, cautions, and fixed penalty notices must be declared." Applicants with serious criminal records, deception in previous applications, or deliberate tax evasion will normally be refused.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: 'N/A — declarations and supporting documents',
      maxFileSize: '10 MB',
      colorMode: 'N/A',
      additionalSpecs: [
        'Complete declaration on Form AN',
        'Supporting evidence for any issues declared',
        'Court documents, caution records, or police letters if applicable',
      ],
    },
    whatToInclude: [
      'Complete and honest declaration on Form AN (Section 3)',
      'ALL criminal convictions (including spent, driving offences, cautions, penalties)',
      'All penalty notices and fixed penalty notices',
      'Evidence of resolution for any declared issues',
      'Character reference letters (supplementary, not required)',
      'Community involvement evidence (voluntary work, charity — helpful but not required)',
    ],
    commonMistakes: [
      'Not declaring spent convictions — ALL convictions must be declared for citizenship',
      'Omitting driving offences (speeding tickets, penalty points)',
      'Not declaring overseas offences or cautions',
      'Hiding previous immigration deception — this is automatic refusal',
      'Not declaring bankruptcies or county court judgments',
    ],
    proTips: [
      'HONESTY IS EVERYTHING — non-disclosure is treated more seriously than the offence itself',
      'A speeding fine or minor caution will rarely prevent citizenship — but hiding it will',
      'If you have a serious conviction, get professional advice on timing (some require a waiting period)',
      'Request a Subject Access Report from the police to see what\'s on your record',
      'Community contributions (volunteering, charity work) can supplement your good character evidence',
    ],
    checklist: [
      'Form AN Section 3 completed honestly and fully',
      'ALL convictions declared (including spent and driving)',
      'ALL penalties and cautions declared',
      'Overseas offences declared',
      'Previous immigration issues declared',
      'Court documents/evidence included for any declared issues',
      'Bankruptcies/CCJs declared if applicable',
      'Police subject access report obtained (recommended)',
    ],
    govUkReference: 'https://www.gov.uk/government/publications/good-character',
    category: 'supporting',
    priority: 'critical',
  },
  {
    id: 'cit-marriage-divorce',
    visaType: 'citizenship',
    title: 'Marriage / Divorce Certificates — Citizenship',
    shortTitle: 'Marriage/Divorce Certificates',
    whatIsThis:
      'If you are married (especially to a British citizen — which enables the shorter 3-year route), or if you have been previously married/divorced, you must provide the relevant certificates. This establishes your personal status and potentially affects your qualifying period.',
    homeOfficeRequires:
      'Form AN requires details of marital status. If applying via the 3-year route (married to British citizen), the marriage certificate is essential proof. All marriages and divorces must be declared, with certificates provided.',
    formatSpecs: {
      fileTypes: ['JPEG', 'PDF'],
      resolution: '300 DPI',
      maxFileSize: '6 MB per document',
      colorMode: 'Full colour',
      additionalSpecs: [
        'Certified English translation for non-English certificates',
        'Divorce absolute (final decree) if previously divorced',
      ],
    },
    whatToInclude: [
      'Current marriage/civil partnership certificate',
      'Divorce absolute / final decree (if previously divorced)',
      'Previous marriage certificates (if applicable)',
      'Certified English translations for all non-English documents',
      'If married to British citizen: their passport/citizenship evidence',
    ],
    commonMistakes: [
      'Not declaring a previous marriage/divorce',
      'Providing decree nisi instead of decree absolute (final decree)',
      'Not translating non-English certificates',
      'Marriage to British citizen not properly evidenced for the 3-year route',
    ],
    proTips: [
      'If using the 3-year route: your marriage must have been in effect for the entire qualifying period',
      'Keep certified copies of all marriage/divorce certificates — you\'ll need them for various applications',
      'If married abroad, check whether the marriage is legally recognised in the UK',
    ],
    checklist: [
      'Current marriage certificate obtained and scanned',
      'Divorce certificates included (if applicable)',
      'Previous marriages declared and documented',
      'Certified English translations completed',
      'If 3-year route: British citizen spouse evidence included',
      'Scanned in colour at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'supporting',
    priority: 'important',
  },
  {
    id: 'cit-address-history',
    visaType: 'citizenship',
    title: 'Address History Record (5 Years) — Citizenship',
    shortTitle: 'Address History (5 Years)',
    whatIsThis:
      'A complete record of every UK address where you\'ve lived during the qualifying period, evidenced by official documents. This demonstrates continuous UK residence and helps the Home Office verify your residency claim.',
    homeOfficeRequires:
      'Form AN requires all UK addresses for the qualifying period. Each address should be evidenced by at least one official document (council tax bill, tenancy agreement, utility bill, bank statement with address).',
    formatSpecs: {
      fileTypes: ['PDF', 'JPEG'],
      resolution: '300 DPI for scanned evidence',
      maxFileSize: '10 MB total',
      colorMode: 'Colour preferred',
      additionalSpecs: [
        'At least one evidence document per address',
        'Council tax bills are the strongest evidence',
        'Tenancy agreements with dates',
      ],
    },
    whatToInclude: [
      'List of all addresses with move-in and move-out dates',
      'For each address: council tax bill, tenancy agreement, or utility bill in your name',
      'If living with someone else: letter from householder confirming your stay',
      'Electoral roll registration (if applicable)',
      'Bank statements showing address during that period',
    ],
    commonMistakes: [
      'Gaps between addresses with no explanation',
      'No documentary evidence for one or more addresses',
      'Addresses not matching other documents (bank statements, employment records)',
      'Not including short-term addresses',
    ],
    proTips: [
      'Council tax bills are the gold standard for address evidence — request them from your local council',
      'If you don\'t have evidence for an address, get a letter from the householder or landlord',
      'Electoral roll registration is easy to check and provides independent confirmation',
      'Create a timeline document showing: address → dates → evidence document name',
    ],
    checklist: [
      'All addresses during qualifying period listed',
      'Move-in and move-out dates for each address',
      'At least one evidence document per address',
      'No unexplained gaps between addresses',
      'Addresses consistent with other documents',
      'Evidence documents scanned at 300+ DPI',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'financial',
    priority: 'critical',
  },
  {
    id: 'cit-employment-history',
    visaType: 'citizenship',
    title: 'Employment History — Citizenship',
    shortTitle: 'Employment History',
    whatIsThis:
      'A complete record of your employment during the qualifying period. This demonstrates economic activity, integration, and contribution to UK society — all of which support the good character assessment.',
    homeOfficeRequires:
      'Form AN requires full employment history including: employer names, job titles, dates of employment, and earnings. This is cross-referenced with HMRC records. Any discrepancies may delay the application.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: '300 DPI for scans; native PDF preferred',
      maxFileSize: '10 MB',
      colorMode: 'N/A — mostly typed documents',
      additionalSpecs: [
        'Typed employment history document',
        'Supporting payslips or employer letters',
        'Self-employment: SA302 returns',
      ],
    },
    whatToInclude: [
      'Typed employment history: employer name, job title, start/end dates, earnings',
      'Employment contracts or offer letters for each role',
      'Key payslips (first and last from each employer as minimum)',
      'Self-employment evidence: SA302, business accounts, client contracts',
      'Explanation for any periods of unemployment',
    ],
    commonMistakes: [
      'Employment dates not matching Form AN or P60/tax records',
      'Unexplained gaps in employment',
      'Not declaring short-term or informal employment',
      'Self-employment income not matching HMRC records',
    ],
    proTips: [
      'Use your P60s and HMRC tax summaries to verify employment dates — they must match',
      'If you had periods of unemployment, explain the reason (studying, caring for family, job seeking)',
      'Keep employment records organised by date — a clear timeline helps the caseworker',
      'Your LinkedIn profile can help you remember dates, but verify against official records',
    ],
    checklist: [
      'Complete employment history compiled',
      'All employers listed with dates and job titles',
      'Supporting evidence for each employer',
      'Dates match tax records and Form AN',
      'Gaps explained',
      'Self-employment fully documented',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'financial',
    priority: 'important',
  },
  {
    id: 'cit-bank-statements-5yr',
    visaType: 'citizenship',
    title: 'Bank Statements (5 Years) — Citizenship',
    shortTitle: 'Bank Statements (5 Years)',
    whatIsThis:
      'Bank statements for the qualifying period provide evidence of financial activity, residence, and income. While not always explicitly required, they are powerful supporting evidence that corroborates your employment history, tax records, and residence claims.',
    homeOfficeRequires:
      'Not explicitly listed as mandatory for all citizenship applications, but the Home Office may request financial evidence to verify employment and residence claims. OISC guidance recommends including representative bank statements proactively.',
    formatSpecs: {
      fileTypes: ['PDF'],
      resolution: 'Native digital PDF preferred',
      maxFileSize: '10 MB per year',
      colorMode: 'Colour or B&W if legible',
      additionalSpecs: [
        'Official statements from the bank',
        'Showing UK address and salary credits',
        'Representative samples: 1–2 months per year minimum',
      ],
    },
    whatToInclude: [
      'Representative bank statements from each year of the qualifying period (1–2 months per year minimum)',
      'Showing: account holder name, UK address, salary credits',
      'Main current account statements',
      'Any significant financial transactions explained (large transfers, etc.)',
    ],
    commonMistakes: [
      'No bank evidence at all — leaves a gap in the evidence chain',
      'Statements showing overseas address instead of UK address',
      'Missing years from the qualifying period',
      'Statements not matching declared income',
    ],
    proTips: [
      'You don\'t need 5 years of monthly statements — representative samples are sufficient',
      'Focus on statements that show UK address + salary credits = confirms residence + employment',
      'Digital statements downloaded from online banking are fine if they show account holder details',
      'If you changed banks during the period, include samples from each bank',
    ],
    checklist: [
      'Representative statements from each qualifying year',
      'UK address shown on statements',
      'Salary credits visible and matching employment records',
      'All bank accounts used during the period covered',
      'Official statements (not screenshots)',
      'No unexplained large transactions',
    ],
    govUkReference: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    category: 'financial',
    priority: 'important',
  },
];

// =============================================================================
// MASTER TEMPLATE REGISTRY
// =============================================================================

export const ALL_TEMPLATES: DocumentTemplate[] = [
  ...SPOUSE_TEMPLATES,
  ...SKILLED_WORKER_TEMPLATES,
  ...CITIZENSHIP_TEMPLATES,
];

export const TEMPLATES_BY_VISA: Record<VisaTypeKey, DocumentTemplate[]> = {
  spouse: SPOUSE_TEMPLATES,
  skilled_worker: SKILLED_WORKER_TEMPLATES,
  citizenship: CITIZENSHIP_TEMPLATES,
};

export const VISA_TEMPLATE_COUNTS: Record<VisaTypeKey, number> = {
  spouse: SPOUSE_TEMPLATES.length,
  skilled_worker: SKILLED_WORKER_TEMPLATES.length,
  citizenship: CITIZENSHIP_TEMPLATES.length,
};

export const TOTAL_TEMPLATE_COUNT = ALL_TEMPLATES.length;

// =============================================================================
// Helpers
// =============================================================================

export function getTemplate(documentId: string): DocumentTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.id === documentId);
}

export function getTemplatesByVisa(visaType: VisaTypeKey): DocumentTemplate[] {
  return TEMPLATES_BY_VISA[visaType] || [];
}

export function getTemplatesByCategory(
  visaType: VisaTypeKey,
  category: 'personal' | 'financial' | 'supporting'
): DocumentTemplate[] {
  return (TEMPLATES_BY_VISA[visaType] || []).filter((t) => t.category === category);
}
