export type VisaType = 'spouse' | 'skilled_worker' | 'citizenship' | 'student';

export interface VisaDetails {
  id: VisaType;
  title: string;
  icon: string;
  color: string;
  overview: string;
  eligibility: string[];
  documents: {
    category: string;
    items: string[];
  }[];
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
  timeline: string;
  cost: string;
  successRate: string;
}

export const VISA_DATABASE: Record<VisaType, VisaDetails> = {
  spouse: {
    id: 'spouse',
    title: 'Spouse / Partner Visa',
    icon: '👰',
    color: 'from-rose-600 to-pink-600',
    overview:
      'A spouse or partner visa allows your UK partner to sponsor your application to live, work, and study in the UK. This is one of the most common family routes to UK residency.',
    eligibility: [
      'You must be in a genuine and subsisting relationship (married, civil partnership, or unmarried for 2+ years)',
      'Your UK partner must meet the income requirement (£29,000/year or have savings of £62,500)',
      'Both partners must be over 18',
      'You must meet the English language requirement (CEFR Level B1 or higher)',
      'You must pass security and suitability checks',
    ],
    documents: [
      {
        category: 'Personal Documents',
        items: [
          'Valid passport',
          'Birth certificate',
          'Marriage certificate (or proof of civil partnership)',
          'Divorce decrees (if applicable)',
          'Change of name deed (if applicable)',
        ],
      },
      {
        category: 'Relationship Evidence',
        items: [
          'Joint photos throughout relationship (minimum 10)',
          'Messages / emails / social media evidence',
          'Joint tenancy agreement or mortgage documents',
          'Joint utility bills',
          'Evidence of visits / holidays together',
          'Family cards / letters from relatives',
          'Joint bank account statements',
        ],
      },
      {
        category: 'Financial Documents',
        items: [
          'Last 2-3 payslips from sponsor',
          'Last 2 years tax returns',
          'Bank statements (3 months)',
          'P60 or employment contract',
          'Proof of savings (if using savings route)',
        ],
      },
      {
        category: 'Health & Security',
        items: [
          'TB test results (if from certain countries)',
          'Police clearance certificates',
          'Medical exam results (if required)',
        ],
      },
    ],
    steps: [
      {
        number: 1,
        title: 'Check Eligibility',
        description: 'Verify you meet income requirements and relationship criteria with your sponsor.',
      },
      {
        number: 2,
        title: 'Gather Documents',
        description: 'Collect all evidence of relationship, finances, and identity documents.',
      },
      {
        number: 3,
        title: 'Register Online',
        description: 'Create an account and start your application on the UK Visas and Immigration portal.',
      },
      {
        number: 4,
        title: 'Prepare Application',
        description: 'Fill in the spouse visa form (VAF 01A) with all required information.',
      },
      {
        number: 5,
        title: 'Pay Fees & Submit',
        description: 'Pay the application fee (£719 + £954 healthcare surcharge) and submit digitally.',
      },
      {
        number: 6,
        title: 'Attend Appointment',
        description: 'Book and attend your UK Visas and Immigration appointment for biometrics.',
      },
      {
        number: 7,
        title: 'Await Decision',
        description: 'Decision typically within 8 weeks for standard processing.',
      },
    ],
    timeline: '8-12 weeks (standard processing)',
    cost: '£1,673 (visa + healthcare surcharge)',
    successRate: '~91% (based on official stats)',
  },

  skilled_worker: {
    id: 'skilled_worker',
    title: 'Skilled Worker Visa',
    icon: '💼',
    color: 'from-blue-600 to-cyan-600',
    overview:
      'A Skilled Worker Visa is sponsored by a UK employer. This visa allows you to live and work in the UK in a skilled role. It replaced the previous Tier 2 visa.',
    eligibility: [
      'You must have a valid job offer from a UK-licensed sponsor',
      'Your salary must meet the minimum requirement (usually £38,700/year, or £30,960 for shortage occupations)',
      'Your role must be listed on the Skilled Occupation List (SOL)',
      'You must meet the English language requirement (CEFR Level B1 or equivalent)',
      'Your sponsor must have a current sponsor licence',
    ],
    documents: [
      {
        category: 'Employment Documents',
        items: [
          'Job offer letter from UK employer',
          'Signed contract of employment',
          'Certificate of Sponsorship (CoS) reference number',
          'Last 2-3 payslips (if already employed)',
          'Previous employment contracts (last 5 years)',
        ],
      },
      {
        category: 'Qualifications & Experience',
        items: [
          'Degree certificates or qualifications',
          'Professional certifications',
          'Reference letters from previous employers',
          'CV / résumé with work history',
        ],
      },
      {
        category: 'Personal Documents',
        items: [
          'Valid passport',
          'Birth certificate',
          'Proof of address (utility bill, tenancy agreement)',
          'National insurance number',
        ],
      },
      {
        category: 'Financial & Security',
        items: [
          'Evidence of funds (if required)',
          'Police clearance certificates',
          'TB test results (if from certain countries)',
        ],
      },
    ],
    steps: [
      {
        number: 1,
        title: 'Secure Job Offer',
        description: 'Obtain a confirmed job offer from a UK-licensed employer.',
      },
      {
        number: 2,
        title: 'Employer Applies for CoS',
        description: 'Your employer applies for a Certificate of Sponsorship on the UK visa portal.',
      },
      {
        number: 3,
        title: 'Receive CoS Reference',
        description: 'You receive the CoS reference number from your employer.',
      },
      {
        number: 4,
        title: 'Prepare Application',
        description: 'Gather all documents and complete the online visa application form.',
      },
      {
        number: 5,
        title: 'Pay & Submit',
        description: 'Pay the application fee and healthcare surcharge, then submit online.',
      },
      {
        number: 6,
        title: 'Biometrics Appointment',
        description: 'Attend UK Visas and Immigration office for fingerprints and photo.',
      },
      {
        number: 7,
        title: 'Decision & Collection',
        description: 'Decision within 8 weeks; collect biometric residence permit.',
      },
    ],
    timeline: '8 weeks (standard processing)',
    cost: '£719 + £284/year healthcare surcharge',
    successRate: '~95% (for qualified applicants)',
  },

  student: {
    id: 'student',
    title: 'Student Visa',
    icon: '🎓',
    color: 'from-purple-600 to-indigo-600',
    overview:
      'A Student Visa allows you to study at a UK university or college. This visa requires an offer from a licensed UK education provider and proof of funds.',
    eligibility: [
      'You must have a valid Confirmation of Acceptance for Studies (CAS) from a UK education provider',
      'You must be over 16',
      'You must meet the English language requirement (CEFR Level B2 or higher)',
      'You must have sufficient funds to cover tuition fees + living costs (typically £15,000-20,000/year)',
      'You must pass security and suitability checks',
    ],
    documents: [
      {
        category: 'Education Documents',
        items: [
          'Confirmation of Acceptance for Studies (CAS) reference',
          'CAS letter from your education provider',
          'University offer letter',
          'Proof of qualifications (A-levels, bachelor\'s degree, etc.)',
          'Academic transcripts from previous education',
        ],
      },
      {
        category: 'Financial Documents',
        items: [
          'Bank statements (3 months, showing tuition fees + living costs)',
          'Proof of funds transfer to UK (if available)',
          'Sponsor letter (if parent/relative is funding)',
          'Sponsor\'s bank statements and ID',
          'Proof of scholarships/grants (if applicable)',
        ],
      },
      {
        category: 'Personal Documents',
        items: [
          'Valid passport',
          'Birth certificate',
          'Identity photos',
        ],
      },
      {
        category: 'Health & Security',
        items: [
          'TB test results (if from certain countries)',
          'Police clearance certificates',
        ],
      },
    ],
    steps: [
      {
        number: 1,
        title: 'Get University Offer',
        description: 'Apply and receive an offer from a UK university or college.',
      },
      {
        number: 2,
        title: 'Accept Offer',
        description: 'Accept your place and confirm acceptance to the institution.',
      },
      {
        number: 3,
        title: 'Receive CAS',
        description: 'Your university issues your Confirmation of Acceptance for Studies (CAS).',
      },
      {
        number: 4,
        title: 'Gather Financial Evidence',
        description: 'Prepare bank statements and proof of funds for tuition + living costs.',
      },
      {
        number: 5,
        title: 'Complete Application',
        description: 'Fill in the online student visa form with CAS reference and financial evidence.',
      },
      {
        number: 6,
        title: 'Pay & Submit',
        description: 'Pay the application fee (£719) and healthcare surcharge, then submit.',
      },
      {
        number: 7,
        title: 'Biometrics & Decision',
        description: 'Attend biometrics appointment; decision typically within 6-8 weeks.',
      },
    ],
    timeline: '6-8 weeks (standard processing)',
    cost: '£719 + £1,035 healthcare surcharge (per year)',
    successRate: '~96% (for qualified applicants)',
  },

  citizenship: {
    id: 'citizenship',
    title: 'British Citizenship',
    icon: '🏛️',
    color: 'from-amber-600 to-orange-600',
    overview:
      'British Citizenship is the final step in your UK immigration journey. After 5+ years as a permanent resident, you can apply for naturalisation and become a British citizen.',
    eligibility: [
      'You must have been a permanent resident (ILR holder) for at least 12 months',
      'You must have lived in the UK for 5+ years on valid visas',
      'You must meet the English language requirement (CEFR Level B1 or higher)',
      'You must pass the Life in the UK test',
      'You must have good character (no serious criminal convictions)',
    ],
    documents: [
      {
        category: 'Immigration Documents',
        items: [
          'Valid passport',
          'Indefinite Leave to Remain (ILR) card or stamp',
          'Biometric residence permits from previous visas',
          'All visa extension letters',
        ],
      },
      {
        category: 'Residence Evidence',
        items: [
          'Proof of all addresses in UK (tenancy agreements, utility bills)',
          'National Insurance number documentation',
          'Employment records or self-employment records',
          'Tax returns (5 years)',
        ],
      },
      {
        category: 'Character Documents',
        items: [
          'Police clearance certificate',
          'Court judgements (if any)',
          'Proof of tax compliance',
        ],
      },
      {
        category: 'Test Evidence',
        items: [
          'Life in the UK test pass certificate',
          'English language qualification (if required)',
        ],
      },
    ],
    steps: [
      {
        number: 1,
        title: 'Pass Life in the UK Test',
        description: 'Study and pass the Life in the UK test (24 multiple choice questions).',
      },
      {
        number: 2,
        title: 'Check Eligibility',
        description: 'Confirm you have 5+ years UK residence and ILR status.',
      },
      {
        number: 3,
        title: 'Gather Evidence',
        description: 'Collect proof of residence, employment, and good character.',
      },
      {
        number: 4,
        title: 'Complete Application',
        description: 'Fill in the citizenship application form (Form AN) with all required details.',
      },
      {
        number: 5,
        title: 'Submit Application',
        description: 'Send your application to UKVI with all supporting documents.',
      },
      {
        number: 6,
        title: 'Attend Interview',
        description: 'Optional interview to verify your identity and application details.',
      },
      {
        number: 7,
        title: 'Citizenship Ceremony',
        description: 'Attend citizenship ceremony and take the oath of allegiance.',
      },
    ],
    timeline: '4-6 months (processing)',
    cost: '£1,335 (application fee)',
    successRate: '~97% (for eligible applicants)',
  },
};

export function getVisaDetails(type: VisaType | string): VisaDetails | null {
  return VISA_DATABASE[type as VisaType] || null;
}

export function getAllVisas(): VisaDetails[] {
  return Object.values(VISA_DATABASE);
}
