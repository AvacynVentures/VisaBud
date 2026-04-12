'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ShieldCheck, ShieldAlert, ShieldX,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
  Info, ArrowRight, Loader2,
} from 'lucide-react';
import { useApplicationStore, DocumentReviewResult } from '@/lib/store';

// ─── Risk Level Styling ─────────────────────────────────────────────────────

const riskConfig = {
  high: {
    bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700',
    badge: 'bg-red-100 text-red-700', icon: ShieldX, iconColor: 'text-red-500',
    label: 'High Risk', emoji: '🔴',
  },
  medium: {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700', icon: ShieldAlert, iconColor: 'text-amber-500',
    label: 'Medium Risk', emoji: '🟡',
  },
  low: {
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck, iconColor: 'text-emerald-500',
    label: 'Low Risk', emoji: '🟢',
  },
};

// ─── Individual Document Review Card ────────────────────────────────────────

function DocumentReviewCard({
  docId,
  result,
  docTitle,
}: {
  docId: string;
  result: DocumentReviewResult;
  docTitle?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const risk = riskConfig[result.riskLevel];
  const RiskIcon = risk.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl overflow-hidden ${risk.border}`}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 p-4 ${risk.bg} hover:brightness-95 transition-all`}
      >
        <RiskIcon className={`w-5 h-5 flex-shrink-0 ${risk.iconColor}`} />
        <div className="flex-1 text-left min-w-0">
          <p className="font-semibold text-sm text-slate-900 truncate">
            {docTitle || docId}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${risk.badge}`}>
              {risk.emoji} {risk.label}
            </span>
            <span className="text-xs text-slate-500">
              {result.confidenceScore}% confidence
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {result.issues.length > 0 && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white space-y-4">
              {/* Main feedback */}
              <div>
                <p className="text-sm text-slate-700 leading-relaxed">{result.feedback}</p>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Issues Found
                  </h5>
                  <div className="space-y-2">
                    {result.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          issue.severity === 'high'
                            ? 'bg-red-50 border-red-100'
                            : issue.severity === 'medium'
                            ? 'bg-amber-50 border-amber-100'
                            : 'bg-blue-50 border-blue-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                              issue.severity === 'high'
                                ? 'text-red-500'
                                : issue.severity === 'medium'
                                ? 'text-amber-500'
                                : 'text-blue-500'
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{issue.message}</p>
                            <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                              <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-400" />
                              <span><strong>Fix:</strong> {issue.fix}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Positives */}
              {result.positives.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    What Looks Good
                  </h5>
                  <div className="space-y-1">
                    {result.positives.map((pos, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{pos}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence meter */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500">Confidence Score</span>
                  <span className="text-xs font-bold text-slate-700">{result.confidenceScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.confidenceScore >= 80
                        ? 'bg-emerald-500'
                        : result.confidenceScore >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${result.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Premium Review Dashboard ──────────────────────────────────────────

export default function PremiumReviewDashboard() {
  const { premiumReview } = useApplicationStore();

  // Don't render if no review has been done
  if (premiumReview.tier === 'free' || premiumReview.status === 'none') {
    return null;
  }

  // Loading state
  if (premiumReview.status === 'pending' || premiumReview.status === 'in_progress') {
    return (
      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-6 mt-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-violet-900">Review In Progress</h3>
            <p className="text-sm text-violet-700">
              {premiumReview.tier === 'ai_review_149'
                ? 'Our AI is thoroughly analysing your documents...'
                : 'Your documents have been queued for expert review...'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Completed review
  if (premiumReview.status !== 'complete' || !premiumReview.overallRiskLevel) {
    return null;
  }

  const overallRisk = riskConfig[premiumReview.overallRiskLevel];
  const OverallIcon = overallRisk.icon;
  const docResults = Object.entries(premiumReview.documentResults);
  const highRiskCount = docResults.filter(([, r]) => r.riskLevel === 'high').length;
  const mediumRiskCount = docResults.filter(([, r]) => r.riskLevel === 'medium').length;
  const lowRiskCount = docResults.filter(([, r]) => r.riskLevel === 'low').length;

  return (
    <div className="mt-8 space-y-6">
      {/* Overall Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border-2 ${overallRisk.border} ${overallRisk.bg} p-6`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center flex-shrink-0`}>
            <OverallIcon className={`w-7 h-7 ${overallRisk.iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">
                Premium Review Complete
              </h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${overallRisk.badge}`}>
                {overallRisk.emoji} {overallRisk.label}
              </span>
            </div>

            {/* Overall confidence */}
            {premiumReview.overallConfidence !== null && (
              <div className="flex items-center gap-3 mt-2 mb-3">
                <span className="text-sm text-slate-600">Overall Confidence:</span>
                <div className="flex-1 max-w-48 h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      premiumReview.overallConfidence >= 80
                        ? 'bg-emerald-500'
                        : premiumReview.overallConfidence >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${premiumReview.overallConfidence}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {premiumReview.overallConfidence}%
                </span>
              </div>
            )}

            {/* Summary */}
            {premiumReview.summaryFeedback && (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {premiumReview.summaryFeedback}
              </p>
            )}

            {/* Quick stats */}
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-slate-600">{highRiskCount} high risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-slate-600">{mediumRiskCount} medium risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-600">{lowRiskCount} low risk</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cross-document flags */}
      {premiumReview.crossDocumentFlags.length > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-600" />
            Cross-Document Issues
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Inconsistencies found between your documents — these could trigger additional scrutiny.
          </p>
          <div className="space-y-2">
            {premiumReview.crossDocumentFlags.map((flag, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  flag.severity === 'high'
                    ? 'bg-red-50 border-red-100'
                    : flag.severity === 'medium'
                    ? 'bg-amber-50 border-amber-100'
                    : 'bg-blue-50 border-blue-100'
                }`}
              >
                <p className="text-sm font-medium text-slate-800">{flag.issue}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Related to: {flag.relatedDocTitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual document results */}
      <div>
        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-600" />
          Document-by-Document Review
        </h4>
        <div className="space-y-3">
          {docResults
            .sort(([, a], [, b]) => {
              const order = { high: 0, medium: 1, low: 2 };
              return order[a.riskLevel] - order[b.riskLevel];
            })
            .map(([docId, result]) => (
              <DocumentReviewCard key={docId} docId={docId} result={result} />
            ))}
        </div>
      </div>

      {/* Reviewed at timestamp */}
      {premiumReview.reviewedAt && (
        <p className="text-xs text-slate-400 text-center">
          Review completed: {new Date(premiumReview.reviewedAt).toLocaleString('en-GB')}
        </p>
      )}
    </div>
  );
}
