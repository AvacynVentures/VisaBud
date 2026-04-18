/**
 * Enhanced timeline data with lead times, processing windows, and government SLAs
 * Based on official Gov.uk guidance as of April 2026
 */

export interface TimelineStage {
  week: string;
  label: string;
  detail: string;
  leadDays: number;           // How many days this stage should take
  isSubmission?: boolean;     // Whether this stage involves submitting to government
  governmentProcessingDays?: {
    standard: number;
    priority?: number;
  };
  documentsRequired?: string[];  // Which doc categories needed for this stage
  tips?: string[];
  followUpAction?: string;    // What happens after government responds
}

export interface VisaTimeline {
  visaType: string;
  totalWeeks: number;
  stages: TimelineStage[];
  governmentStandards: {
    standard: number;
    priority: number;
  };
}

/**
 * Spouse/Partner Visa Timeline
 * Minimum: 8 weeks (if priority)
 * Standard: 12 weeks government processing alone
 */
export const spouseTimeline: VisaTimeline = {
  visaType: 'spouse',
  totalWeeks: 16,
  stages: [
    {
      week: 'Week 1-2',
      label: 'Gather personal documents',
      detail: 'Passport, marriage certificate, photos, TB test if needed.',
      leadDays: 14,
      documentsRequired: ['personal'],
      tips: [
        'Order certified copies of marriage certificate (usually 2-3 business days)',
        'Book TB test appointment if required (needed if from high-risk country)',
        'Get 2 recent passport photos (45mm x 35mm)',
        'Check passport expiry — must be valid for visa duration',
      ],
      followUpAction: 'Move to financial evidence preparation',
    },
    {
      week: 'Week 2-3',
      label: 'Prepare financial evidence',
      detail: 'Bank statements, payslips, employer letter. Ensure 6-month history.',
      leadDays: 14,
      documentsRequired: ['financial'],
      tips: [
        'Request 6 consecutive months of bank statements (most recent first)',
        'Gather all payslips from same period',
        'Get employer letter on letterhead: job title, salary, date employed, permanence',
        'If self-employed: 2 years of tax returns + business bank statements',
        'Savings: must show £16,000+ if income is below £29,000',
      ],
      followUpAction: 'Compile relationship evidence while waiting for documents',
    },
    {
      week: 'Week 3-4',
      label: 'Compile relationship evidence',
      detail: 'Photos together, messages, shared finances, accommodation proof.',
      leadDays: 7,
      documentsRequired: ['supporting'],
      tips: [
        'Gather photos of you together (chronological order)',
        'Print screenshots of messages, emails, video calls',
        'Joint utility bills or tenancy agreements',
        'Evidence of shared financial commitments',
        'Sponsor letter confirming relationship details',
      ],
      followUpAction: 'Book English language test if not exempt',
    },
    {
      week: 'Week 4',
      label: 'English language test (if required)',
      detail: 'Book and sit IELTS Life Skills A1 (if not exempt).',
      leadDays: 7,
      documentsRequired: ['supporting'],
      tips: [
        'Check if exempt: EU/EEA, US, Canada, NZ, Australia, or degree in English',
        'Book IELTS Life Skills A1 test (minimum level for visa)',
        'Test fee: ~£150-170, results ready in 5-7 business days',
        'Certificate valid for 2 years',
      ],
      followUpAction: 'Prepare online application',
    },
    {
      week: 'Week 5',
      label: 'Submit online application',
      detail: 'Complete form on Gov.uk, pay fees, book biometrics.',
      leadDays: 3,
      isSubmission: true,
      documentsRequired: ['personal', 'financial', 'supporting'],
      tips: [
        'Application fee: £719 (spouse visa)',
        'IHS surcharge: usually £284/year for 2.5 years = ~£710',
        'Upload all supporting documents as PDFs',
        'Save your reference number — you\'ll need it for biometrics',
        'Book biometrics appointment immediately after submission',
      ],
      governmentProcessingDays: {
        standard: 84,  // 12 weeks
        priority: 5,   // Priority service available
      },
      followUpAction: 'Attend biometrics appointment',
    },
    {
      week: 'Week 5-6',
      label: 'Biometrics appointment',
      detail: 'Attend UKVCAS centre with documents. Appointment takes ~30 min.',
      leadDays: 7,
      isSubmission: true,
      documentsRequired: ['personal'],
      tips: [
        'Book at ukvcas.co.uk or as part of application',
        'Bring: appointment letter, passport, documents',
        'Takes photos and fingerprints',
        'No result on the day — results sent to Home Office',
        'Appointment available within 5-10 days usually',
      ],
      governmentProcessingDays: {
        standard: 0,
        priority: 0,
      },
      followUpAction: 'Home Office processes application',
    },
    {
      week: 'Week 6-18',
      label: 'Home Office processing',
      detail: 'Standard: 12 weeks. Priority: 5 working days (extra £500+ fee).',
      leadDays: 84,
      isSubmission: false,
      governmentProcessingDays: {
        standard: 84,  // 12 weeks = 84 days
        priority: 5,   // 5 working days
      },
      tips: [
        'Standard processing: 12 weeks from biometrics',
        'Priority available: +£500 fee for 5 working day decision',
        'Super-priority: +£800 for 24-48 hour decision (limited availability)',
        'Check status: use application reference number on gov.uk portal',
        'Home Office may request additional documents (RFI) — respond within 28 days',
      ],
      followUpAction: 'Decision issued + visa sent',
    },
  ],
  governmentStandards: {
    standard: 84,   // 12 weeks in days
    priority: 5,    // 5 working days
  },
};

/**
 * Skilled Worker Visa Timeline
 * Minimum: 4-5 weeks (if priority available)
 * Standard: 3 weeks government processing
 */
export const skilledWorkerTimeline: VisaTimeline = {
  visaType: 'skilled_worker',
  totalWeeks: 8,
  stages: [
    {
      week: 'Week 1',
      label: 'Receive Certificate of Sponsorship',
      detail: 'Employer provides CoS reference number (usually within 5 days of request).',
      leadDays: 7,
      documentsRequired: ['supporting'],
      tips: [
        'Sponsor must provide CoS via gov.uk portal',
        'CoS is unique number + assigned duties value',
        'CoS valid for 3 months — apply before expiry',
        'Confirm salary meets threshold (£38,700+ or going rate)',
      ],
      followUpAction: 'Gather personal documents',
    },
    {
      week: 'Week 1-2',
      label: 'Gather documents',
      detail: 'Passport, qualifications, criminal records, English evidence.',
      leadDays: 14,
      documentsRequired: ['personal', 'supporting'],
      tips: [
        'Degree or equivalent: with ENIC statement if non-UK',
        'Criminal record certificate: from any country lived 12+ months in last 10 years',
        'English evidence: IELTS, degree in English, or national of English-speaking country',
        'Check ENIC: electronic check takes 4-6 weeks, so start early',
      ],
      followUpAction: 'Prepare financial evidence',
    },
    {
      week: 'Week 2',
      label: 'Financial evidence',
      detail: 'Bank statements showing £1,270 (or employer certified maintenance).',
      leadDays: 3,
      documentsRequired: ['financial'],
      tips: [
        'Bank statement must show £1,270 held for 28 consecutive days',
        'If employer sponsors maintenance (on CoS), this step skipped',
        'Bank statement from any date in last 31 days before application',
        'Statement name must match application',
      ],
      followUpAction: 'Prepare online application',
    },
    {
      week: 'Week 3',
      label: 'Submit application',
      detail: 'Online via Gov.uk, pay IHS surcharge and fees.',
      leadDays: 3,
      isSubmission: true,
      documentsRequired: ['personal', 'supporting', 'financial'],
      tips: [
        'Application fee: £719',
        'IHS surcharge: usually £284/year for 3.5 years = ~£994',
        'Upload all documents as PDFs (max 50MB per document)',
        'Save application reference number',
        'Book biometrics appointment immediately',
      ],
      governmentProcessingDays: {
        standard: 21,  // 3 weeks
        priority: 5,   // Priority if available
      },
      followUpAction: 'Book and attend biometrics',
    },
    {
      week: 'Week 3-4',
      label: 'Biometrics appointment',
      detail: 'Attend visa application centre with documents.',
      leadDays: 7,
      isSubmission: true,
      documentsRequired: ['personal'],
      tips: [
        'Book at visa application centre (premium: 4-5 days, standard: 10-14 days)',
        'Bring: appointment letter, passport, documents',
        'Appointment takes ~30 minutes',
        'Results sent to Home Office automatically',
      ],
      governmentProcessingDays: {
        standard: 0,
        priority: 0,
      },
      followUpAction: 'Home Office processes application',
    },
    {
      week: 'Week 4-7',
      label: 'Processing',
      detail: 'Standard: 3 weeks. Priority service may be available.',
      leadDays: 21,
      isSubmission: false,
      governmentProcessingDays: {
        standard: 21,  // 3 weeks = 21 days
        priority: 5,   // If available
      },
      tips: [
        'Standard: 3 weeks from biometrics (faster than spouse visa)',
        'Status check: use application reference on gov.uk',
        'Additional Checks: RFI may be issued — respond within 28 days',
        'Faster than spouse visa due to employer sponsorship pre-check',
      ],
      followUpAction: 'Decision issued',
    },
  ],
  governmentStandards: {
    standard: 21,   // 3 weeks
    priority: 5,    // If available
  },
};

/**
 * British Citizenship Timeline
 * Minimum: 4 weeks (ideal case)
 * Standard: 6 months government processing
 */
export const citizenshipTimeline: VisaTimeline = {
  visaType: 'citizenship',
  totalWeeks: 28,
  stages: [
    {
      week: 'Week 1-2',
      label: 'Check eligibility',
      detail: 'Verify residence requirements, absence limits, good character.',
      leadDays: 14,
      documentsRequired: ['personal'],
      tips: [
        '5 years continuous residence in UK (ILR)',
        'Not more than 450 days abroad in the 5-year period',
        'Not more than 90 days absent in final 12 months',
        'Good character: no serious crime, immigration offences, etc.',
      ],
      followUpAction: 'Book Life in the UK test',
    },
    {
      week: 'Week 2-3',
      label: 'Life in the UK test',
      detail: 'Book and pass if not already done.',
      leadDays: 14,
      documentsRequired: ['supporting'],
      tips: [
        'Test fee: ~£50',
        'Book online, test taken at registered centre',
        'Certificate must be dated before application submission',
        'Results ready on the day',
        'Valid for 2 years from pass date',
      ],
      followUpAction: 'Gather residency documents',
    },
    {
      week: 'Week 3-4',
      label: 'Gather documents',
      detail: 'Passports, BRP, birth certificate, referees, travel history.',
      leadDays: 14,
      documentsRequired: ['personal', 'supporting'],
      tips: [
        'All passports held during qualifying period',
        'Current BRP',
        'Birth certificate + translation if not English',
        'Council tax bills for each year of residence',
        '2 referees (known you 3+ years, details required)',
        'Travel history: every trip outside UK during period',
      ],
      followUpAction: 'Prepare online application',
    },
    {
      week: 'Week 4-5',
      label: 'Submit AN application',
      detail: 'Online or paper form with fee (£1,580).',
      leadDays: 7,
      isSubmission: true,
      documentsRequired: ['personal', 'supporting'],
      tips: [
        'Application fee: £1,580 (as of 2026)',
        'No IHS surcharge for citizenship',
        'Can apply online (faster) or by post',
        'Submit with ALL supporting documents',
        'Keep reference number for follow-up',
      ],
      governmentProcessingDays: {
        standard: 180,  // 6 months = ~180 days
        priority: 0,    // No priority service
      },
      followUpAction: 'Home Office processes',
    },
    {
      week: '5-26',
      label: 'Home Office processing',
      detail: 'Standard: 6 months. No priority service available.',
      leadDays: 180,
      isSubmission: false,
      governmentProcessingDays: {
        standard: 180,  // 6 months
        priority: 0,
      },
      tips: [
        'Standard processing: 6 months from submission date',
        'May request additional documents (RFI) — respond within 28 days',
        'Interview may be conducted (character assessment)',
        'Status updates available via reference number',
        'Citizenship ceremony arranged after approval',
      ],
      followUpAction: 'Decision issued + ceremony scheduled',
    },
    {
      week: '26-28',
      label: 'Citizenship ceremony',
      detail: 'Attend ceremony within 3 months of approval.',
      leadDays: 14,
      isSubmission: false,
      documentsRequired: ['personal'],
      tips: [
        'Ceremony scheduled by local council',
        'Must attend in person',
        'British passport issued after ceremony',
        'Citizenship certificate provided',
        'Renounce previous nationality if required (varies by country)',
      ],
      followUpAction: 'You are now a British citizen!',
    },
  ],
  governmentStandards: {
    standard: 180,  // 6 months
    priority: 0,    // No priority
  },
};

/**
 * Get timeline for a specific visa type
 */
export function getTimelineData(visaType: string): VisaTimeline {
  switch (visaType) {
    case 'spouse':
      return spouseTimeline;
    case 'skilled_worker':
      return skilledWorkerTimeline;
    case 'citizenship':
      return citizenshipTimeline;
    default:
      return spouseTimeline;
  }
}

/**
 * Calculate remaining days from a given stage
 */
export function calculateRemainingDays(
  timeline: VisaTimeline,
  completedStageIndex: number
): number {
  let remaining = 0;
  for (let i = completedStageIndex + 1; i < timeline.stages.length; i++) {
    remaining += timeline.stages[i].leadDays;
  }
  return remaining;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(
  timeline: VisaTimeline,
  completedStageIndex: number
): number {
  const totalDays = timeline.stages.reduce((sum, stage) => sum + stage.leadDays, 0);
  const completedDays = timeline.stages
    .slice(0, completedStageIndex + 1)
    .reduce((sum, stage) => sum + stage.leadDays, 0);
  return Math.round((completedDays / totalDays) * 100);
}

/**
 * Get government processing days based on selected service level
 */
export function getProcessingDays(
  timeline: VisaTimeline,
  isPriority: boolean = false
): number {
  if (isPriority && timeline.governmentStandards.priority > 0) {
    return timeline.governmentStandards.priority;
  }
  return timeline.governmentStandards.standard;
}
