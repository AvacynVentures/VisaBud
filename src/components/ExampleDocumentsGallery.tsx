'use client';

import { useState } from 'react';
import {
  generateExampleDocuments,
} from '@/lib/example-data';
import {
  generateExampleBankStatementPDF,
  generateExamplePayslipPDF,
  generateExampleUtilityBillPDF,
  generateExampleEmployerLetterPDF,
  downloadFile,
} from '@/lib/example-pdfs';

interface ExampleDocumentsGalleryProps {
  visaType: string;
  isUnlocked: boolean; // Behind paygate
}

export default function ExampleDocumentsGallery({
  visaType,
  isUnlocked,
}: ExampleDocumentsGalleryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadedDocs, setDownloadedDocs] = useState<Set<string>>(new Set());

  const exampleDocs = [
    {
      id: 'bank-statement',
      icon: '🏦',
      name: 'Bank Statement',
      description: '6 months of transactions showing income and activity',
      tips: [
        'Must cover last 6 months',
        'Shows consistent income deposits',
        'Account in applicant\'s name',
        'Sufficient balance for savings requirement',
      ],
    },
    {
      id: 'payslips',
      icon: '💰',
      name: 'Payslips',
      description: 'Recent payslips showing consistent salary',
      tips: [
        'At least 6 consecutive payslips from same employer',
        'Salary must match stated income',
        'Shows tax and NI deductions',
        'Must be recent (within 1-2 months)',
      ],
    },
    {
      id: 'utility-bill',
      icon: '💡',
      name: 'Utility Bill',
      description: 'Proof of address (gas, electricity, water)',
      tips: [
        'Dated within last 3 months',
        'In applicant\'s name',
        'Full address clearly visible',
        'Can use: electricity, gas, water, council tax',
      ],
    },
    {
      id: 'employer-letter',
      icon: '💼',
      name: 'Employer Letter',
      description: 'Confirmation of employment and salary',
      tips: [
        'On official company letterhead',
        'Signed by authorized person',
        'Includes job title and salary',
        'Confirms permanent employment',
      ],
    },
  ];

  const handleDownload = async (docId: string) => {
    if (!isUnlocked) return;

    setIsLoading(true);
    try {
      const exampleDocs = generateExampleDocuments(visaType);
      const person = exampleDocs.person;
      let blob: Blob | null = null;
      let filename = '';

      switch (docId) {
        case 'bank-statement':
          blob = await generateExampleBankStatementPDF(exampleDocs.bankStatement);
          filename = `Example_Bank_Statement_${person.fullName.replace(/\s+/g, '_')}.pdf`;
          break;
        case 'payslips':
          blob = await generateExamplePayslipPDF(exampleDocs.payslips[0]);
          filename = `Example_Payslip_${person.fullName.replace(/\s+/g, '_')}.pdf`;
          break;
        case 'utility-bill':
          blob = await generateExampleUtilityBillPDF(exampleDocs.utilityBill);
          filename = `Example_Utility_Bill_${person.fullName.replace(/\s+/g, '_')}.pdf`;
          break;
        case 'employer-letter':
          blob = await generateExampleEmployerLetterPDF(exampleDocs.employerLetter);
          filename = `Example_Employer_Letter_${person.fullName.replace(/\s+/g, '_')}.pdf`;
          break;
      }

      if (blob && filename) {
        downloadFile(blob, filename);
        setDownloadedDocs(prev => new Set([...prev, docId]));
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Example Documents</h3>
        <p className="text-slate-600 mb-6">
          See exactly what complete, compliant documents look like. Unlock to download examples.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Unlock Examples
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Example Documents
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Downloadable examples of real documents. These show exactly what UKVI expects to see.
          Each example is marked clearly as fictitious but structured like actual documents.
        </p>
        <div className="bg-white rounded-lg p-3 text-xs text-slate-600">
          💡 <strong>Pro tip:</strong> Download these, review the structure, then prepare your actual documents following the same format and detail level.
        </div>
      </div>

      {/* Document Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exampleDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{doc.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-xs text-slate-500">{doc.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-600 mb-2">What to include:</div>
              <ul className="space-y-1.5">
                {doc.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download Button */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => handleDownload(doc.id)}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  downloadedDocs.has(doc.id)
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating…
                  </span>
                ) : downloadedDocs.has(doc.id) ? (
                  <span>✓ Downloaded</span>
                ) : (
                  <span>📥 Download Example</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <div className="font-semibold mb-2">📌 How to Use These Examples</div>
        <ol className="space-y-2 text-xs">
          <li><strong>1. Download</strong> the examples that apply to your visa type</li>
          <li><strong>2. Review structure</strong> — note how information is presented and formatted</li>
          <li><strong>3. Compare with yours</strong> — do your actual documents have all required info?</li>
          <li><strong>4. Identify gaps</strong> — missing info? Order certified copies or get letters from employers/banks</li>
          <li><strong>5. Check quality</strong> — are your documents clear, legible, original or certified copies?</li>
        </ol>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
        <strong>⚠️ Disclaimer:</strong> These are fictitious examples for illustration. Your actual documents must:
        <ul className="mt-2 space-y-1 ml-4">
          <li>• Be original or certified copies</li>
          <li>• Be in your actual name (not the example person)</li>
          <li>• Be dated within required timeframes (gov.uk specifies for each type)</li>
          <li>• Match other submitted documents (e.g., name consistency across all docs)</li>
        </ul>
      </div>
    </div>
  );
}
