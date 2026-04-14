/**
 * Map checklist items to their corresponding downloadable templates
 * Used to link "Get Template" buttons on each checklist item
 */

export const CHECKLIST_TO_TEMPLATE: Record<string, string> = {
  // ========== SPOUSE VISA ==========
  
  // Personal Documents
  'Marriage or Civil Partnership Certificate': 'Spouse_ProofOfRelationship.docx',
  
  // Financial Evidence
  "Sponsor's Payslips (6 months)": 'Spouse_FinancialEvidence.docx',
  "Sponsor's Employer Letter": 'Spouse_EmploymentLetter.docx',
  "Sponsor's Bank Statements (6 months)": 'Spouse_BankStatements.docx',
  'Cash Savings Evidence (if income below £29,000)': 'Spouse_SavingsAndSponsorship.docx',
  'Self-Employment Evidence (if self-employed sponsor)': 'Spouse_SelfEmploymentAccounts.docx',
  
  // Supporting / Relationship Evidence
  'Cohabitation / Shared Address Proof': 'Spouse_ProofOfCohabitation.docx',
  'Relationship Photographs': 'Spouse_Photos.docx',
  'Communication History': 'Spouse_EmailCommunication.docx',
  'Cover Letter / Statement of Intent': 'Spouse_CoverLetter.docx',
  
  // ========== SKILLED WORKER VISA ==========
  
  // Financial / Employment Documents
  'Maintenance Funds Evidence': 'SkilledWorker_MaintenanceFunds.docx',
  'Employer Sponsor Licence Verification': 'SkilledWorker_SponsorshipLetter.docx',
  'Employment Contract / Offer Letter': 'SkilledWorker_JobOffer.docx',
  'Cover Letter': 'SkilledWorker_CoverLetter.docx',
  
  // ========== BRITISH CITIZENSHIP ==========
  
  // Residency & Requirements
  'Travel History (5-Year Record)': 'Citizenship_ResidenceProof.docx',
  'English Language Evidence (B1+)': 'Citizenship_EnglishLanguageTest.docx',
  'Life in the UK Test Pass Certificate': 'Citizenship_LifeInUKTest.docx',
  'Full Immigration History': 'Citizenship_ImmigrationHistory.docx',
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
