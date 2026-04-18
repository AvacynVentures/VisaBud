'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, ChevronDown, X } from 'lucide-react';

interface Template {
  filename: string;
  title: string;
  visa: 'Spouse' | 'Skilled Worker' | 'Citizenship';
  category: string;
  description?: string; // Additional guidance for users
}

const TEMPLATES: Template[] = [
  // Spouse Visa (12)
  { filename: 'Spouse_ProofOfRelationship.docx', title: 'Proof of Relationship', visa: 'Spouse', category: 'Evidence & Documentation', description: 'Document your relationship: photos together, trip evidence, shared experiences' },
  { filename: 'Spouse_FinancialEvidence.docx', title: 'Financial Evidence Summary', visa: 'Spouse', category: 'Financial', description: 'Summarize how you meet the £29,000/year requirement with bank statements + payslips' },
  { filename: 'Spouse_ProofOfCohabitation.docx', title: 'Proof of Cohabitation', visa: 'Spouse', category: 'Evidence & Documentation', description: 'Demonstrate living together: lease agreements, bills, correspondence' },
  { filename: 'Spouse_SavingsAndSponsorship.docx', title: 'Savings & Sponsorship Declaration', visa: 'Spouse', category: 'Financial', description: 'If below £29k salary, show savings of £16,000+ held for 6 months' },
  { filename: 'Spouse_EmploymentLetter.docx', title: 'Employer Verification Letter', visa: 'Spouse', category: 'Financial', description: 'Letter from employer on letterhead confirming job title, salary, and permanence' },
  { filename: 'Spouse_SelfEmploymentAccounts.docx', title: 'Self-Employment Accounts & Tax Returns', visa: 'Spouse', category: 'Financial', description: 'If self-employed: 2 years of tax returns + business bank statements' },
  { filename: 'Spouse_BankStatements.docx', title: 'Bank Statements & Financial Records', visa: 'Spouse', category: 'Financial', description: '6 consecutive months of statements showing income and stability' },
  { filename: 'Spouse_TaxReturns.docx', title: 'Tax Returns & P60 Forms', visa: 'Spouse', category: 'Financial', description: 'Most recent P60 or tax return (self-employed) showing annual income' },
  { filename: 'Spouse_UtilityBills.docx', title: 'Utility Bills & Council Tax', visa: 'Spouse', category: 'Evidence & Documentation', description: 'Proof of address: electricity, gas, water, or council tax bills in both names' },
  { filename: 'Spouse_Photos.docx', title: 'Relationship Photos & Documentation', visa: 'Spouse', category: 'Evidence & Documentation', description: 'Photos of you together, family, holidays — chronological order helps' },
  { filename: 'Spouse_EmailCommunication.docx', title: 'Email & Message Correspondence', visa: 'Spouse', category: 'Evidence & Documentation', description: 'Screenshots of meaningful conversations showing genuine relationship' },
  { filename: 'Spouse_ChildrenDocumentation.docx', title: 'Children Documentation', visa: 'Spouse', category: 'Family', description: 'Birth certificates, custody arrangements if applicable' },

  // Skilled Worker (4)
  { filename: 'SkilledWorker_MaintenanceFunds.docx', title: 'Maintenance of Funds Declaration', visa: 'Skilled Worker', category: 'Financial', description: 'Confirm you hold £1,270 in your account for 28 consecutive days' },
  { filename: 'SkilledWorker_SponsorshipLetter.docx', title: 'Sponsor Certification Letter', visa: 'Skilled Worker', category: 'Employment', description: 'From your employer confirming sponsorship and job details' },
  { filename: 'SkilledWorker_PayslipsAndP60.docx', title: 'Payslips & Tax Records', visa: 'Skilled Worker', category: 'Employment', description: 'Recent payslips + P60 confirming salary meets threshold (£38,700+)' },
  { filename: 'SkilledWorker_JobOffer.docx', title: 'Job Offer Letter', visa: 'Skilled Worker', category: 'Employment', description: 'Original job offer with salary, position, and start date' },

  // Citizenship (3)
  { filename: 'Citizenship_ResidenceProof.docx', title: 'Continuous Residence Proof', visa: 'Citizenship', category: 'Residency', description: 'Council tax bills, tenancy agreements for each year of 5-year period' },
  { filename: 'Citizenship_EnglishLanguageTest.docx', title: 'English Language Proficiency Certificate', visa: 'Citizenship', category: 'Requirements', description: 'B1 CEFR level or higher (or degree taught in English)' },
  { filename: 'Citizenship_LifeInUKTest.docx', title: 'Life in the UK Test Certificate', visa: 'Citizenship', category: 'Requirements', description: 'Pass certificate from approved test provider' },
];

interface TemplatesGalleryProps {
  onClose?: () => void;
  isPremium?: boolean;
}

export default function TemplatesGallery({ onClose, isPremium = false }: TemplatesGalleryProps) {
  const [expandedVisa, setExpandedVisa] = useState<string | null>('Spouse');
  const [downloading, setDownloading] = useState<string | null>(null);

  const visaTypes = ['Spouse', 'Skilled Worker', 'Citizenship'];

  const handleDownload = (filename: string, title: string) => {
    setDownloading(filename);
    try {
      // Direct download via simple link (no fetch needed for static files)
      const link = document.createElement('a');
      link.href = `/templates/${filename}`;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert(`Failed to download ${title}`);
    } finally {
      setDownloading(null);
    }
  };

  if (!isPremium) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
        <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Templates Locked</h3>
        <p className="text-gray-600 mb-4">Unlock the Premium tier to download professional Word templates for all document types.</p>
        <p className="text-sm text-gray-500">19 templates covering Spouse, Skilled Worker, and Citizenship visas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📋 Premium Templates</h2>
          <p className="text-gray-600 mt-1">19 professional Word templates with gov.uk guidance, examples, and best practices</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-600">Spouse Visa</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">4</p>
          <p className="text-sm text-gray-600">Skilled Worker</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">3</p>
          <p className="text-sm text-gray-600">Citizenship</p>
        </div>
      </div>

      {/* Templates by Visa Type */}
      <div className="space-y-3">
        {visaTypes.map((visa) => {
          const visaTemplates = TEMPLATES.filter((t) => t.visa === visa);
          const isExpanded = expandedVisa === visa;

          return (
            <motion.div key={visa} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedVisa(isExpanded ? null : visa)}
                className="w-full px-4 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 text-left">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{visa} Visa</p>
                    <p className="text-sm text-gray-600">{visaTemplates.length} templates</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {/* Templates List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200 divide-y divide-gray-200"
                  >
                    {visaTemplates.map((template) => (
                      <motion.div
                        key={template.filename}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{template.title}</p>
                          {template.description && (
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                        </div>

                        <button
                          onClick={() => handleDownload(template.filename, template.title)}
                          disabled={downloading === template.filename}
                          className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            downloading === template.filename
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          }`}
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {downloading === template.filename ? 'Downloading...' : 'Download'}
                          </span>
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 How to use:</strong> Each template includes government requirements, a worked example showing best practices, and a section for you to fill in your details. Edit and customize for your application.
        </p>
      </div>
    </div>
  );
}
