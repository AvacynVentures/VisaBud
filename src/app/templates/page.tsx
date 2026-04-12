'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  ChevronDown,
  ChevronRight,
  Shield,
  ArrowLeft,
  Package,
  Sparkles,
} from 'lucide-react';
import {
  ALL_TEMPLATES,
  TEMPLATES_BY_VISA,
  TOTAL_TEMPLATE_COUNT,
  VISA_TEMPLATE_COUNTS,
} from '@/lib/template-data';
import { VISA_TYPES, VisaTypeKey } from '@/lib/visa-data';

type FilterType = 'all' | VisaTypeKey;

const VISA_ICONS: Record<VisaTypeKey, string> = {
  spouse: '💑',
  skilled_worker: '💼',
  citizenship: '🏛️',
};

const PRIORITY_STYLES = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
  important: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
  optional: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
};

const CATEGORY_LABELS = {
  personal: '👤 Personal Documents',
  financial: '💰 Financial Documents',
  supporting: '📎 Supporting Documents',
};

export default function TemplatesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);


  const filteredTemplates =
    filter === 'all' ? ALL_TEMPLATES : TEMPLATES_BY_VISA[filter] || [];

  // Group by category
  const grouped = {
    personal: filteredTemplates.filter((t) => t.category === 'personal'),
    financial: filteredTemplates.filter((t) => t.category === 'financial'),
    supporting: filteredTemplates.filter((t) => t.category === 'supporting'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to VisaBud</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Go to Dashboard →
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Included with AI Premium Review (£149)
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Document Preparation Templates
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            {TOTAL_TEMPLATE_COUNT} professionally crafted templates covering every document 
            for every visa pathway. Each template tells you exactly what the Home Office 
            needs, in plain English.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 flex-wrap">
            {(Object.keys(TEMPLATES_BY_VISA) as VisaTypeKey[]).map((vt) => (
              <div key={vt} className="bg-white rounded-xl border border-slate-200 px-5 py-3 shadow-sm">
                <div className="text-2xl mb-1">{VISA_ICONS[vt]}</div>
                <div className="text-lg font-bold text-slate-900">{VISA_TEMPLATE_COUNTS[vt]}</div>
                <div className="text-xs text-slate-500">{VISA_TYPES[vt].shortLabel}</div>
              </div>
            ))}
            <div className="bg-blue-600 rounded-xl px-5 py-3 shadow-sm text-white">
              <div className="text-2xl mb-1">📦</div>
              <div className="text-lg font-bold">{TOTAL_TEMPLATE_COUNT}</div>
              <div className="text-xs text-blue-100">Total Templates</div>
            </div>
          </div>
        </motion.div>

        {/* What's in each template */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What&apos;s in each template?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '📋', title: 'What is this document?', desc: 'Clear definition and why it matters for your application' },
              { icon: '🏛️', title: 'Home Office requirements', desc: 'Direct references from Gov.uk and OISC guidance' },
              { icon: '📐', title: 'Format specifications', desc: 'File type, DPI, resolution, max size, colour requirements' },
              { icon: '✅', title: 'What to include', desc: 'Complete list of everything that must be visible' },
              { icon: '⚠️', title: 'Common mistakes', desc: 'The errors that cause refusals — and how to avoid them' },
              { icon: '💡', title: 'Pro tips', desc: 'Insider advice from immigration professionals' },
              { icon: '☑️', title: 'Ready checklist', desc: 'Tick off every item before uploading' },
              { icon: '🔗', title: 'Gov.uk references', desc: 'Direct links to official guidance' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}
          >
            All Templates ({TOTAL_TEMPLATE_COUNT})
          </button>
          {(Object.keys(TEMPLATES_BY_VISA) as VisaTypeKey[]).map((vt) => (
            <button
              key={vt}
              onClick={() => setFilter(vt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === vt
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {VISA_ICONS[vt]} {VISA_TYPES[vt].shortLabel} ({VISA_TEMPLATE_COUNTS[vt]})
            </button>
          ))}
        </div>

        {/* Bulk download */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-10 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">
              <Package className="w-5 h-5 inline mr-2" />
              Download All {filter === 'all' ? '' : VISA_TYPES[filter as VisaTypeKey].shortLabel + ' '}Templates
            </h3>
            <p className="text-blue-100 text-sm">
              Get {filter === 'all' ? TOTAL_TEMPLATE_COUNT : VISA_TEMPLATE_COUNTS[filter as VisaTypeKey]} templates as a ZIP file. 
              Print or save for offline use.
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            onClick={() => {
              const url = filter === 'all'
                ? '/api/templates/download-all'
                : `/api/templates/download-all?visaType=${filter}`;
              window.open(url, '_blank');
            }}
          >
            <Download className="w-5 h-5" />
            Download ZIP
          </button>
        </div>

        {/* Template cards by category */}
        {(['personal', 'financial', 'supporting'] as const).map((category) => {
          const categoryTemplates = grouped[category];
          if (categoryTemplates.length === 0) return null;

          return (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {CATEGORY_LABELS[category]}
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({categoryTemplates.length} templates)
                </span>
              </h2>

              <div className="grid gap-3">
                {categoryTemplates.map((template, idx) => {
                  const priorityStyle = PRIORITY_STYLES[template.priority];
                  const isExpanded = expandedTemplate === template.id;

                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`bg-white rounded-xl border ${priorityStyle.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                    >
                      {/* Card header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className={`w-5 h-5 ${priorityStyle.text} flex-shrink-0`} />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 text-sm truncate">
                              {template.shortTitle}
                            </div>
                            <div className="text-xs text-slate-500">
                              {VISA_TYPES[template.visaType].shortLabel}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle.badge}`}>
                            {template.priority}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded preview */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-slate-100">
                              {/* What is this */}
                              <p className="text-sm text-slate-600 mt-3 mb-3">
                                {template.whatIsThis.slice(0, 200)}...
                              </p>

                              {/* Quick stats */}
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                  <div className="text-xs text-slate-500">Format</div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {template.formatSpecs.fileTypes.join(', ')}
                                  </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                  <div className="text-xs text-slate-500">Resolution</div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {template.formatSpecs.resolution.includes('300') ? '300 DPI' : template.formatSpecs.resolution.slice(0, 20)}
                                  </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                  <div className="text-xs text-slate-500">Checklist</div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {template.checklist.length} items
                                  </div>
                                </div>
                              </div>

                              {/* Key warnings */}
                              <div className="bg-red-50 rounded-lg p-3 mb-3">
                                <div className="text-xs font-medium text-red-700 mb-1">⚠️ Top mistake to avoid:</div>
                                <div className="text-xs text-red-600">{template.commonMistakes[0]}</div>
                              </div>

                              {/* Download button */}
                              <button
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `/api/templates/${template.visaType}/${template.id}`,
                                    '_blank'
                                  );
                                }}
                              >
                                <Download className="w-4 h-4" />
                                Download PDF Guide
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* CTA section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white mt-12">
          <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold mb-2">Ready to prepare your documents?</h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            All {TOTAL_TEMPLATE_COUNT} templates are included free with the £149 AI Premium 
            Document Review. Get expert AI analysis of your documents plus all preparation guides.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Get Started — £149
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
          These templates are for informational purposes only and do not constitute legal advice. 
          Always verify requirements at gov.uk. VisaBud is not a law firm and does not provide 
          immigration advice regulated by OISC. Templates are verified against Gov.uk guidance 
          as of April 2026.
        </p>
      </div>
    </div>
  );
}
