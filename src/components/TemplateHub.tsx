'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Package,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import {
  TEMPLATES_BY_VISA,
  VISA_TEMPLATE_COUNTS,
  TOTAL_TEMPLATE_COUNT,
  DocumentTemplate,
} from '@/lib/template-data';
import { VISA_TYPES, VisaTypeKey } from '@/lib/visa-data';

interface TemplateHubProps {
  visaType?: VisaTypeKey;
  hasPremiumAccess: boolean;
  compact?: boolean;
}

// Visa icons used in parent components
// const VISA_ICONS: Record<VisaTypeKey, string> = { spouse: '💑', skilled_worker: '💼', citizenship: '🏛️' };

export default function TemplateHub({ visaType, hasPremiumAccess, compact = false }: TemplateHubProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const templates = visaType ? TEMPLATES_BY_VISA[visaType] : [];
  const templateCount = visaType ? VISA_TEMPLATE_COUNTS[visaType] : TOTAL_TEMPLATE_COUNT;

  const handleDownload = async (template: DocumentTemplate) => {
    setDownloading(template.id);
    try {
      window.open(`/api/templates/${template.visaType}/${template.id}`, '_blank');
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  const handleBulkDownload = () => {
    const url = visaType
      ? `/api/templates/download-all?visaType=${visaType}`
      : '/api/templates/download-all';
    window.open(url, '_blank');
  };

  // ── Compact mode: just a summary card with link ──
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-4 ${
          hasPremiumAccess
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Document Preparation Templates
              </h3>
              <p className="text-xs text-slate-500">
                {templateCount} professional guides for your {visaType ? VISA_TYPES[visaType].shortLabel : 'visa'} application
              </p>
            </div>
          </div>

          {hasPremiumAccess ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDownload}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download All
              </button>
              <a
                href="/templates"
                className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-800"
              >
                Browse
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Included with Premium
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Full mode: template list with download buttons ──
  return (
    <div className="space-y-4">
      {/* Header with bulk download */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            📄 Document Preparation Templates
          </h3>
          <p className="text-sm text-slate-500">
            {templateCount} templates for {visaType ? VISA_TYPES[visaType].shortLabel : 'all visa types'}
          </p>
        </div>
        {hasPremiumAccess && (
          <button
            onClick={handleBulkDownload}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Package className="w-4 h-4" />
            Download All ({templateCount})
          </button>
        )}
      </div>

      {/* Template grid */}
      {hasPremiumAccess ? (
        <div className="grid gap-2">
          {templates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {template.shortTitle}
                  </div>
                  <div className="text-xs text-slate-400">
                    {template.checklist.length} checklist items • {template.priority}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDownload(template)}
                disabled={downloading === template.id}
                className="flex items-center gap-1.5 text-blue-600 text-xs font-medium hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {downloading === template.id ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-900 mb-1">Templates Included with Premium</h4>
          <p className="text-sm text-slate-500 mb-4">
            Get {templateCount} document preparation guides with the £149 AI Premium Review.
          </p>
          <a
            href="/templates"
            className="text-sm text-blue-600 font-medium hover:text-blue-800"
          >
            Preview all templates →
          </a>
        </div>
      )}

      {/* Browse all link */}
      {hasPremiumAccess && (
        <a
          href="/templates"
          className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 py-2"
        >
          Browse all {TOTAL_TEMPLATE_COUNT} templates
          <ChevronRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
