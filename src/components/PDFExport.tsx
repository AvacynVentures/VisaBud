'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { generateVisaBudPDF, downloadVisaBudPDF } from '@/lib/pdf-export';

interface PDFExportProps {
  visa: string;
  answers: any;
  checklist: any;
  risks: any[];
  timeline: any[];
  unlocked: boolean;
}

export default function PDFExport({
  visa,
  answers,
  checklist,
  risks,
  timeline,
  unlocked,
}: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!unlocked) {
      alert('Unlock the full pack to download your checklist PDF.');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate PDF blob
      const pdfBlob = await generateVisaBudPDF({
        visa,
        answers,
        checklist,
        risks,
        timeline,
      });

      // Generate filename
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const visaSlug = visa.toLowerCase().replace(/\s+/g, '-');
      const filename = `VisaBud-${visaSlug}-${dateStr}.pdf`;

      // Trigger download
      downloadVisaBudPDF(filename, pdfBlob);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={!unlocked || isGenerating}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
        ${
          unlocked && !isGenerating
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }
      `}
    >
      <Download className="w-4 h-4" />
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </button>
  );
}
