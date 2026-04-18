'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import AuthGate from '@/components/AuthGate';
import AIReportContent from '@/components/AIReportContent';
import { useApplicationStore, type AIReportData } from '@/lib/store';
import { generateAIReportPDF, downloadAIReportPDF } from '@/lib/pdf-ai-report';

function getConfidenceEmoji(score: number): string {
  if (score >= 70) return '🟢';
  if (score >= 40) return '🟡';
  return '🔴';
}

function AIReportPageContent() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const { documentReports } = useApplicationStore();
  const [report, setReport] = useState<AIReportData | null>(null);

  useEffect(() => {
    const r = documentReports[documentId];
    if (r) {
      setReport(r);
    }
  }, [documentId, documentReports]);

  const handleDownloadPDF = () => {
    if (!report) return;
    const blob = generateAIReportPDF({
      documentName: report.documentName,
      confidence: report.confidence,
      flags: report.flags,
      swot: report.swot,
      recommendations: report.recommendations,
      generatedAt: report.generatedAt,
    });
    downloadAIReportPDF(report.documentName, blob);
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No report found for this document.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Print-friendly styles */}
      <style jsx global>{`
        @media print {
          nav, .no-print, .sticky-bottom-mobile { display: none !important; }
          .print-content { max-width: 100% !important; padding: 0 !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-sm sm:text-base">{report.documentName}</h1>
              <p className="text-xs text-gray-500">
                Confidence: {report.confidence}% {getConfidenceEmoji(report.confidence)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 print-content">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
          <AIReportContent
            documentName={report.documentName}
            confidence={report.confidence}
            flags={report.flags}
            swot={report.swot}
            recommendations={report.recommendations}
            generatedAt={report.generatedAt}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400 no-print">
          <p>VisaBud AI Document Analysis — visabud.co.uk</p>
          <p className="mt-1">This is AI-generated guidance, not legal advice. Always verify with Gov.uk.</p>
        </div>
      </div>
    </div>
  );
}

export default function AIReportPage() {
  return (
    <AuthGate>
      <AIReportPageContent />
    </AuthGate>
  );
}
