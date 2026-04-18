'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import AIReportContent from './AIReportContent';
import { generateAIReportPDF, downloadAIReportPDF } from '@/lib/pdf-ai-report';
import type { AIReportData } from '@/lib/store';

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AIReportData | null;
  documentId: string;
  documentName: string;
  onGenerateNew?: () => void;
  onViewFullReport?: () => void;
  isLoading?: boolean;
}

export default function AIReportModal({
  isOpen,
  onClose,
  report,
  documentId: _documentId,
  documentName: _documentName,
  onGenerateNew,
  onViewFullReport,
  isLoading = false,
}: AIReportModalProps) {
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false);

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

  const handleGenerateNew = () => {
    if (report) {
      // If report exists, show confirmation first
      setShowConfirmRegenerate(true);
    } else {
      onGenerateNew?.();
    }
  };

  const handleConfirmRegenerate = () => {
    // Download existing report first, then generate new
    handleDownloadPDF();
    setShowConfirmRegenerate(false);
    onGenerateNew?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl sm:w-full z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white flex-shrink-0">
              <h2 className="font-bold text-gray-900 text-lg">AI Confidence Report</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">Analysing your document...</p>
                    <p className="text-sm text-gray-500 mt-1">Our AI is checking against UKVI requirements</p>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : report ? (
                <AIReportContent
                  documentName={report.documentName}
                  confidence={report.confidence}
                  flags={report.flags}
                  swot={report.swot}
                  recommendations={report.recommendations}
                  generatedAt={report.generatedAt}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <AlertTriangle className="w-10 h-10 text-gray-300" />
                  <p className="text-gray-500">No report available</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {report && !isLoading && (
              <div className="flex flex-wrap items-center gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                {onViewFullReport && (
                  <button
                    onClick={onViewFullReport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Full Report
                  </button>
                )}
                {onGenerateNew && (
                  <button
                    onClick={handleGenerateNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-all ml-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate New
                  </button>
                )}
              </div>
            )}

            {/* Regeneration Confirmation Overlay */}
            <AnimatePresence>
              {showConfirmRegenerate && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-2xl"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl p-6 mx-4 max-w-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                      <h3 className="font-bold text-gray-900">Replace Report?</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-5">
                      This will replace your current AI report. We&apos;ll download the existing one first.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmRegenerate}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download & Generate New
                      </button>
                      <button
                        onClick={() => setShowConfirmRegenerate(false)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
