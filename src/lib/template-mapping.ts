/**
 * Map checklist items to their corresponding downloadable templates
 * Used to link "Get Template" buttons on each checklist item
 */

export const CHECKLIST_TO_TEMPLATE: Record<string, string> = {
  // ========== SPOUSE VISA ==========
  
  // Proof of Relationship
  'Proof of relationship': 'Spouse_ProofOfRelationship.docx',
  
  // Financial Evidence
  'Income evidence (P60/payslips)': 'Spouse_FinancialEvidence.docx',
  'Self-employment accounts': 'Spouse_SelfEmploymentAccounts.docx',
  'Bank statements (6 months)': 'Spouse_BankStatements.docx',
  'Savings & sponsor declaration': 'Spouse_SavingsAndSponsorship.docx',
  'Employment letter from sponsor': 'Spouse_EmploymentLetter.docx',
  'Tax returns (2 years)': 'Spouse_TaxReturns.docx',
  
  // Living Together
  'Proof of cohabitation': 'Spouse_ProofOfCohabitation.docx',
  'Utility bills & council tax': 'Spouse_UtilityBills.docx',
  
  // Evidence of Relationship
  'Photos together (spanning relationship)': 'Spouse_Photos.docx',
  'Email & message correspondence': 'Spouse_EmailCommunication.docx',
  'Children documentation (if applicable)': 'Spouse_ChildrenDocumentation.docx',
  
  // ========== SKILLED WORKER VISA ==========
  
  // Maintenance of Funds
  'Maintenance of funds (£3,100 or salary)': 'SkilledWorker_MaintenanceFunds.docx',
  
  // Employment & Sponsorship
  'Sponsor certification letter': 'SkilledWorker_SponsorshipLetter.docx',
  'Job offer letter': 'SkilledWorker_JobOffer.docx',
  'Payslips & P60 (employment income)': 'SkilledWorker_PayslipsAndP60.docx',
  
  // ========== BRITISH CITIZENSHIP ==========
  
  // Residency
  'Proof of continuous residence (5 years)': 'Citizenship_ResidenceProof.docx',
  
  // Requirements
  'English language test certificate (B1)': 'Citizenship_EnglishLanguageTest.docx',
  'Life in the UK test certificate': 'Citizenship_LifeInUKTest.docx',
};

/**
 * Get the template filename for a checklist item
 */
export function getTemplateForItem(itemTitle: string): string | null {
  // Exact match first
  if (CHECKLIST_TO_TEMPLATE[itemTitle]) {
    return CHECKLIST_TO_TEMPLATE[itemTitle];
  }
  
  // Partial match (case-insensitive) for flexibility
  const lowerTitle = itemTitle.toLowerCase();
  for (const [key, filename] of Object.entries(CHECKLIST_TO_TEMPLATE)) {
    if (key.toLowerCase().includes(lowerTitle) || lowerTitle.includes(key.toLowerCase())) {
      return filename;
    }
  }
  
  return null;
}
