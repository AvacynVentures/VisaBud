'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, FileText, Sparkles, ShieldCheck, Users, Phone, ArrowRight, X,
  AlertTriangle, CheckCircle, AlertCircle, Upload
} from 'lucide-react';
import { useApplicationStore, type PurchasedTier } from '@/lib/store';
import { CHECKLISTS, type VisaTypeKey } from '@/lib/visa-data';

interface TierFeatureButtonsProps {
  purchasedTier: PurchasedTier;
  onUpgrade: () => void;
  visaType?: string;
}

interface FeatureButton {
  id: string;
  label: string;
  icon: typeof FileText;
  minTier: 'premium' | 'expert';
  color: string;
  lockedColor: string;
  description: string;
}

const FEATURES: FeatureButton[] = [
  {
    id: 'templates',
    label: 'Templates',
    icon: FileText,
    minTier: 'premium',
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: '37+ document preparation templates to help you fill in forms correctly.',
  },
  {
    id: 'ai-confidence',
    label: 'Application Readiness',
    icon: Sparkles,
    minTier: 'premium',
    color: 'bg-violet-600 hover:bg-violet-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: 'Traffic-light readiness score based on your uploaded documents. Shows category breakdown and weakest document.',
  },
  {
    id: 'ai-validation',
    label: 'Issues & Tips',
    icon: ShieldCheck,
    minTier: 'premium',
    color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: 'All AI-flagged issues across your documents, prioritised by severity with specific fixes.',
  },
  {
    id: 'expert-review',
    label: 'Expert Human Review',
    icon: Users,
    minTier: 'expert',
    color: 'bg-amber-600 hover:bg-amber-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: 'Qualified immigration expert reviews your documents within 24 hours.',
  },
  {
    id: 'live-call',
    label: 'Schedule Live Call',
    icon: Phone,
    minTier: 'expert',
    color: 'bg-rose-600 hover:bg-rose-700 text-white',
    lockedColor: 'bg-gray-100 text-gray-400 border border-gray-200',
    description: '30-minute live consulting call with an immigration specialist.',
  },
];

const TIER_RANK: Record<PurchasedTier, number> = {
  none: 0,
  standard: 1,
  premium: 2,
  expert: 3,
};

const TIER_LABELS: Record<string, string> = {
  premium: 'Premium (£149)',
  expert: 'Expert (£299)',
};

function isUnlocked(userTier: PurchasedTier, requiredTier: 'premium' | 'expert'): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}

export default function TierFeatureButtons({ purchasedTier, onUpgrade, visaType }: TierFeatureButtonsProps) {
  const [upgradePrompt, setUpgradePrompt] = useState<string | null>(null);
  const [showReadiness, setShowReadiness] = useState(false);
  const [showIssues, setShowIssues] = useState(false);

  const handleClick = (feature: FeatureButton) => {
    if (isUnlocked(purchasedTier, feature.minTier)) {
      switch (feature.id) {
        case 'templates':
          window.open('/templates', '_blank');
          break;
        case 'ai-confidence':
          setShowReadiness(true);
          setShowIssues(false);
          break;
        case 'ai-validation':
          setShowIssues(true);
          setShowReadiness(false);
          break;
        case 'expert-review':
          window.location.href = 'mailto:expert@visabud.co.uk?subject=Expert%20Document%20Review%20Request';
          break;
        case 'live-call':
          window.location.href = 'mailto:expert@visabud.co.uk?subject=Schedule%20Live%20Consulting%20Call';
          break;
      }
    } else {
      setUpgradePrompt(feature.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-violet-600" />
        <h3 className="font-semibold text-gray-900">Premium Features</h3>
        {purchasedTier !== 'none' && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            purchasedTier === 'expert' ? 'bg-violet-100 text-violet-700' :
            purchasedTier === 'premium' ? 'bg-emerald-100 text-emerald-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {purchasedTier.charAt(0).toUpperCase() + purchasedTier.slice(1)} Plan
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {FEATURES.map((feature) => {
          const unlocked = isUnlocked(purchasedTier, feature.minTier);
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => handleClick(feature)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 touch-target ${
                unlocked ? feature.color : feature.lockedColor
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{feature.label}</span>
              {!unlocked && <Lock className="w-3.5 h-3.5 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Application Readiness Panel */}
      <AnimatePresence>
        {showReadiness && (
          <ReadinessPanel visaType={visaType} onClose={() => setShowReadiness(false)} />
        )}
      </AnimatePresence>

      {/* Issues & Tips Panel */}
      <AnimatePresence>
        {showIssues && (
          <IssuesPanel visaType={visaType} onClose={() => setShowIssues(false)} />
        )}
      </AnimatePresence>

      {/* Upgrade prompt overlay */}
      <AnimatePresence>
        {upgradePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  🔒 Upgrade to unlock {FEATURES.find(f => f.id === upgradePrompt)?.label}
                </p>
                <p className="text-xs text-amber-700 mb-3">
                  {FEATURES.find(f => f.id === upgradePrompt)?.description}
                </p>
                <p className="text-xs text-amber-600 mb-3">
                  Available from the{' '}
                  <strong>{TIER_LABELS[FEATURES.find(f => f.id === upgradePrompt)?.minTier || 'premium']}</strong> plan.
                </p>
                <button
                  onClick={() => { setUpgradePrompt(null); onUpgrade(); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-all"
                >
                  See Plans <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => setUpgradePrompt(null)}
                className="p-1 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Application Readiness Panel ────────────────────────────────────────────

function ReadinessPanel({ visaType, onClose }: { visaType?: string; onClose: () => void }) {
  const { documentReports, documentUploads } = useApplicationStore();
  const reports = Object.entries(documentReports);
  const validVisaType = (visaType && visaType !== 'unsure' ? visaType : null) as VisaTypeKey | null;
  const checklist = validVisaType ? (CHECKLISTS[validVisaType] || []) : [];
  const totalDocs = checklist.length;
  const reviewedDocs = reports.length;
  const uploadedDocs = Object.values(documentUploads).filter((u) => u.status === 'valid' || u.status === 'invalid').length;

  // Categorise by risk
  const criticalItems = checklist.filter((item) => item.priority === 'critical');
  const criticalReports = reports.filter(([id]) => criticalItems.some((i) => i.id === id));
  const criticalHighRisk = criticalReports.filter(([, r]) => r.confidence <= 40);
  const allHighRisk = reports.filter(([, r]) => r.confidence <= 40);
  const allMediumRisk = reports.filter(([, r]) => r.confidence > 40 && r.confidence <= 70);

  // Category breakdown
  const categories = ['personal', 'financial', 'supporting'] as const;
  const categoryScores = categories.map((cat) => {
    const catItems = checklist.filter((i) => i.category === cat);
    const catReports = reports.filter(([id]) => catItems.some((i) => i.id === id));
    if (catReports.length === 0) return { category: cat, avg: null, count: catReports.length, total: catItems.length };
    const avg = Math.round(catReports.reduce((sum, [, r]) => sum + r.confidence, 0) / catReports.length);
    return { category: cat, avg, count: catReports.length, total: catItems.length };
  });

  // Determine overall status
  let status: 'red' | 'amber' | 'green' | 'none';
  let statusLabel: string;
  let statusDesc: string;

  if (reviewedDocs === 0) {
    status = 'none';
    statusLabel = 'No Documents Reviewed';
    statusDesc = 'Upload your documents in the checklist tab to get AI readiness scoring.';
  } else if (criticalHighRisk.length > 0) {
    status = 'red';
    const names = criticalHighRisk.map(([id]) => checklist.find((i) => i.id === id)?.title || id).join(', ');
    statusLabel = 'Not Ready — Critical Issues';
    statusDesc = `${criticalHighRisk.length} critical document${criticalHighRisk.length > 1 ? 's' : ''} will likely cause refusal: ${names}. Fix these before submitting.`;
  } else if (allHighRisk.length > 0 || allMediumRisk.length > 0) {
    status = 'amber';
    statusLabel = 'Needs Work';
    statusDesc = `${allHighRisk.length} high-risk and ${allMediumRisk.length} medium-risk document${allHighRisk.length + allMediumRisk.length > 1 ? 's' : ''}. Review flagged items before submitting.`;
  } else {
    status = 'green';
    statusLabel = 'Ready to Submit';
    statusDesc = 'All reviewed documents look strong. Check your timeline and submit when ready.';
  }

  const statusConfig = {
    red: { bg: 'bg-red-50 border-red-200', icon: '🔴', color: 'text-red-900', descColor: 'text-red-700' },
    amber: { bg: 'bg-amber-50 border-amber-200', icon: '🟡', color: 'text-amber-900', descColor: 'text-amber-700' },
    green: { bg: 'bg-emerald-50 border-emerald-200', icon: '🟢', color: 'text-emerald-900', descColor: 'text-emerald-700' },
    none: { bg: 'bg-gray-50 border-gray-200', icon: '📋', color: 'text-gray-900', descColor: 'text-gray-600' },
  };

  const cfg = statusConfig[status];
  const catLabels: Record<string, string> = { personal: 'Personal', financial: 'Financial', supporting: 'Supporting' };

  // Weakest document
  const weakest = reports.length > 0
    ? reports.reduce((min, curr) => curr[1].confidence < min[1].confidence ? curr : min)
    : null;
  const weakestTitle = weakest ? checklist.find((i) => i.id === weakest[0])?.title || weakest[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="mt-4"
    >
      <div className={`${cfg.bg} border rounded-xl p-5`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cfg.icon}</span>
            <div>
              <h4 className={`font-bold ${cfg.color}`}>{statusLabel}</h4>
              <p className={`text-xs ${cfg.descColor} mt-0.5`}>{statusDesc}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/50 transition-colors flex-shrink-0">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{reviewedDocs}/{totalDocs}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">AI Reviewed</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{uploadedDocs}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Uploaded</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{totalDocs - uploadedDocs}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Missing</p>
          </div>
        </div>

        {/* Category breakdown */}
        {reviewedDocs > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-gray-700">Category Breakdown</p>
            {categoryScores.map(({ category, avg, count, total }) => (
              <div key={category} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-20">{catLabels[category]}</span>
                <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      avg === null ? 'bg-gray-300' : avg > 70 ? 'bg-emerald-500' : avg > 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: avg !== null ? `${avg}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-16 text-right">
                  {avg !== null ? `${avg}%` : `0/${total}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Weakest document */}
        {weakest && weakestTitle && (
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Weakest:</span> {weakestTitle} at {weakest[1].confidence}%
              {weakest[1].confidence <= 40 && ' — this needs fixing before you submit'}
            </p>
          </div>
        )}

        {reviewedDocs === 0 && (
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-gray-700">Upload documents in the checklist tab, then return here for your readiness score.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Issues & Tips Panel ────────────────────────────────────────────────────

function IssuesPanel({ visaType, onClose }: { visaType?: string; onClose: () => void }) {
  const { documentReports } = useApplicationStore();
  const validVisaType = (visaType && visaType !== 'unsure' ? visaType : null) as VisaTypeKey | null;
  const checklist = validVisaType ? (CHECKLISTS[validVisaType] || []) : [];
  const reports = Object.entries(documentReports);

  if (reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="mt-4"
      >
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-gray-500" />
              <div>
                <h4 className="font-bold text-gray-900">No Documents Reviewed Yet</h4>
                <p className="text-xs text-gray-600 mt-0.5">Upload your documents in the checklist tab to get AI validation and tips.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Collect all issues from all reports
  type IssueWithDoc = { docId: string; docTitle: string; confidence: number; issue: { type: string; severity: string; message: string; fix: string } };
  const allIssues: IssueWithDoc[] = [];
  reports.forEach(([id, report]) => {
    const title = checklist.find((i) => i.id === id)?.title || id;
    if (report.flags) {
      report.flags.forEach((flag: any) => {
        allIssues.push({ docId: id, docTitle: title, confidence: report.confidence, issue: { type: flag.severity || 'medium', severity: flag.severity || 'medium', message: flag.text || flag.message || '', fix: flag.fix || '' } });
      });
    }
  });

  // Sort: high severity first
  const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  allIssues.sort((a, b) => (severityOrder[a.issue.severity] ?? 2) - (severityOrder[b.issue.severity] ?? 2));

  // Top 3 things to fix
  const topFixes = allIssues.filter((i) => i.issue.severity === 'high' || i.issue.severity === 'medium').slice(0, 3);

  const severityConfig: Record<string, { label: string; bg: string; color: string }> = {
    high: { label: 'Critical', bg: 'bg-red-100', color: 'text-red-700' },
    medium: { label: 'Warning', bg: 'bg-amber-100', color: 'text-amber-700' },
    low: { label: 'Minor', bg: 'bg-blue-100', color: 'text-blue-700' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="mt-4"
    >
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-gray-900">AI Issues & Tips</h4>
            <span className="text-xs text-gray-400">{allIssues.length} issue{allIssues.length !== 1 ? 's' : ''} found</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Top 3 things to fix */}
        {topFixes.length > 0 && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            <p className="text-xs font-bold text-amber-900 mb-2">🎯 Top {topFixes.length} thing{topFixes.length > 1 ? 's' : ''} to fix before submitting:</p>
            <ol className="space-y-1.5">
              {topFixes.map((item, i) => (
                <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">{i + 1}.</span>
                  <span><strong>{item.docTitle}</strong>: {item.issue.message}{item.issue.fix ? ` → ${item.issue.fix}` : ''}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* All issues list */}
        <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
          {allIssues.length === 0 ? (
            <div className="px-5 py-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">No issues found! Your reviewed documents look good.</p>
            </div>
          ) : (
            allIssues.map((item, i) => {
              const sev = severityConfig[item.issue.severity] || severityConfig.low;
              return (
                <div key={i} className="px-5 py-3 flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sev.bg} ${sev.color} flex-shrink-0 mt-0.5`}>
                    {sev.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{item.docTitle}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.issue.message}</p>
                    {item.issue.fix && (
                      <p className="text-xs text-blue-600 mt-0.5">💡 {item.issue.fix}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
