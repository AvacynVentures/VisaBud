/**
 * Map checklist items to their corresponding downloadable templates
 * Used to link "Get Template" buttons on each checklist item
 */

export const CHECKLIST_TO_TEMPLATE: Record<string, string> = {
  // ========== SPOUSE VISA ==========
  
  // Personal Documents
  'Valid Passport': 'Spouse_PassportPreparation.docx',
  'Biometric Enrolment Confirmation': 'Spouse_BiometricsGuide.docx',
  'Passport-Style Photographs': 'Spouse_Photos.docx',
  'TB Test Certificate': 'Spouse_TBTestCertificate.docx',
  'English Language Certificate': 'Spouse_EnglishLanguage.docx',
  'Marriage or Civil Partnership Certificate': 'Spouse_ProofOfRelationship.docx',
  'Previous UK Visa / Immigration History': 'Spouse_PreviousVisas.docx',
  
  // Financial Evidence
  "Sponsor's Payslips (6 months)": 'Spouse_FinancialEvidence.docx',
  "Sponsor's Employer Letter": 'Spouse_EmploymentLetter.docx',
  "Sponsor's Bank Statements (6 months)": 'Spouse_BankStatements.docx',
  'Cash Savings Evidence (if income below £29,000)': 'Spouse_SavingsAndSponsorship.docx',
  'Self-Employment Evidence (if self-employed sponsor)': 'Spouse_SelfEmploymentAccounts.docx',
  
  // Supporting / Relationship Evidence
  'Relationship Photographs': 'Spouse_Photos.docx',
  'Communication History': 'Spouse_EmailCommunication.docx',
  'Cohabitation / Shared Address Proof': 'Spouse_ProofOfCohabitation.docx',
  'Accommodation Evidence': 'Spouse_AccommodationEvidence.docx',
  "Sponsor's Identity Documents": 'Spouse_SponsorIdentity.docx',
  'Cover Letter / Statement of Intent': 'Spouse_CoverLetter.docx',
  'Letters from Family/Friends': 'Spouse_ThirdPartyLetters.docx',
  'Children as Dependants (if applicable)': 'Spouse_ChildrenDocumentation.docx',
  
  // ========== SKILLED WORKER VISA ==========
  
  // Personal Documents (passport shares with Spouse via partial match)
  'English Language Certificate (B1)': 'SkilledWorker_EnglishLanguage.docx',
  'Criminal Record Certificate': 'SkilledWorker_CriminalRecord.docx',
  
  // Financial / Employment Documents
  'Certificate of Sponsorship (CoS)': 'SkilledWorker_CoSChecklist.docx',
  'Employment Contract / Offer Letter': 'SkilledWorker_JobOffer.docx',
  'Maintenance Funds Evidence': 'SkilledWorker_MaintenanceFunds.docx',
  'Employer Sponsor Licence Verification': 'SkilledWorker_SponsorshipLetter.docx',
  'Academic / Professional Qualifications': 'SkilledWorker_Qualifications.docx',
  
  // Supporting Documents
  'ATAS Certificate (if applicable)': 'SkilledWorker_ATASCertificate.docx',
  'Cover Letter': 'SkilledWorker_CoverLetter.docx',
  'Current CV / Resume': 'SkilledWorker_CoverLetter.docx',
  
  // ========== BRITISH CITIZENSHIP ==========
  
  // Personal Documents
  'Biometric Residence Permit (BRP) / ILR Evidence': 'Citizenship_ResidenceProof.docx',
  'Current Passport': 'Citizenship_ResidenceProof.docx',
  'Life in the UK Test Pass Certificate': 'Citizenship_LifeInUKTest.docx',
  'English Language Evidence (B1+)': 'Citizenship_EnglishLanguageTest.docx',
  'Birth Certificate': 'Citizenship_BirthCertificate.docx',
  'Full Immigration History': 'Citizenship_ImmigrationHistory.docx',
  
  // Residency & Character
  'Travel History (5-Year Record)': 'Citizenship_ResidenceProof.docx',
  'Address History (5 Years)': 'Citizenship_AddressHistory.docx',
  'Tax and National Insurance Record': 'Citizenship_TaxRecords.docx',
  'Criminal Record Declaration': 'Citizenship_CriminalRecord.docx',
  
  // Supporting Documents
  'Two Referees': 'Citizenship_Referees.docx',
  'Marriage Certificate (if applying via 3-year route)': 'Citizenship_ResidenceProof.docx',
  "British Citizen Spouse's Passport (if 3-year route)": 'Citizenship_PartnerPassport.docx',
  'Citizenship Ceremony Booking': 'Citizenship_CeremonyBooking.docx',
  'Name Change Evidence (if applicable)': 'Citizenship_NameChange.docx',
  'Children - Registration as British Citizens (if applicable)': 'Citizenship_ChildrenRegistration.docx',
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
