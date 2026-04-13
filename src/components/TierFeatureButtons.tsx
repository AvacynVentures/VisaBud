'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Sparkles,
  FileText,
  Shield,
  Phone,
  Users,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { useApplicationStore, SubscriptionTier, AIConfidenceResult } from '@/lib/store';
import { supabase } from '@/lib/supabase';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TierFeatureButtonsProps {
  docId: string;
  docTitle: string;
  requirement: string;
  visaType: string;
  govLink?: string;
  officialRequirement?: string;
  commonMistakes?: string[];
  bestPractices?: string[];
  onUpgrade: () => void;
}

type FeatureId = 'templates' | 'ai_confidence' | 'ai_validation' | 'expert_review' | 'live_call';

interface FeatureConfig {
  id: FeatureId;
  label: string;
  icon: typeof Sparkles;
  minTier: SubscriptionTier;
  color: string;
  bgColor: string;
  borderColor: string;
}

const FEATURES: FeatureConfig[] = [
  {
    id: 'ai_confidence',
    label: 'AI Confidence Score',
    icon: Target,
    minTier: 'premium',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    id: 'ai_validation',
    label: 'AI Validation & Tips',
    icon: Sparkles,
    minTier: 'premium',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: FileText,
    minTier: 'premium',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'expert_review',
    label: 'Expert Review',
    icon: Users,
    minTier: 'expert',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'live_call',
    label: 'Schedule Live Call',
    icon: Phone,
    minTier: 'expert',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
];

const TIER_ORDER: Record<SubscriptionTier, number> = {
  free: 0,
  standard: 1,
  premium: 2,
  expert: 3,
};

function hasTierAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function TierFeatureButtons({
  docId,
  docTitle,
  requirement,
  visaType,
  govLink,
  officialRequirement,
  commonMistakes,
  bestPractices,
  onUpgrade,
}: TierFeatureButtonsProps) {
  const { tier, aiConfidenceResults, setAIConfidenceResult, documentUploads } = useApplicationStore();
  const [expandedInfo, setExpandedInfo] = useState(false);

  const hasUpload = documentUploads[docId]?.status === 'valid' || documentUploads[docId]?.status === 'invalid';
  const confidenceResult = aiConfidenceResults[docId];

  return (
    <div className="mt-3 space-y-2">
      {/* Expandable Gov Link + Requirements */}
      {(govLink || officialRequirement || commonMistakes || bestPractices) && (
        <ExpandableRequirements
          govLink={govLink}
          officialRequirement={officialRequirement}
          commonMistakes={commonMistakes}
          bestPractices={bestPractices}
          expanded={expandedInfo}
          onToggle={() => setExpandedInfo(!expandedInfo)}
        />
      )}

      {/* Feature Buttons Row */}
      <div className="flex flex-wrap gap-1.5">
        {FEATURES.map((feature) => {
          const isUnlocked = hasTierAccess(tier, feature.minTier);
          const Icon = feature.icon;

          if (feature.id === 'ai_confidence' && isUnlocked && hasUpload) {
            return (
              <AIConfidenceButton
                key={feature.id}
                docId={docId}
                docTitle={docTitle}
                requirement={requirement}
                visaType={visaType}
                result={confidenceResult}
                onResult={(result) => setAIConfidenceResult(docId, result)}
              />
            );
          }

          return (
            <button
              key={feature.id}
              onClick={isUnlocked ? undefined : onUpgrade}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isUnlocked
                  ? `${feature.bgColor} ${feature.color} ${feature.borderColor} border hover:shadow-sm`
                  : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-pointer hover:bg-gray-100'
              }`}
              title={isUnlocked ? feature.label : `Upgrade to ${feature.minTier} to unlock`}
            >
              {isUnlocked ? (
                <Icon className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              {feature.label}
              {!isUnlocked && (
                <span className="text-[10px] text-gray-400 ml-0.5">🔒</span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Confidence Result Display */}
      {confidenceResult && !confidenceResult.loading && !confidenceResult.error && (
        <AIConfidenceDisplay result={confidenceResult} />
      )}
    </div>
  );
}

// ─── Expandable Requirements ────────────────────────────────────────────────

function ExpandableRequirements({
  govLink,
  officialRequirement,
  commonMistakes,
  bestPractices,
  expanded,
  onToggle,
}: {
  govLink?: string;
  officialRequirement?: string;
  commonMistakes?: string[];
  bestPractices?: string[];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Official Requirements & Tips</span>
          {govLink && (
            <a
              href={govLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium"
            >
              Gov.uk <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 space-y-3 text-xs">
              {officialRequirement && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    Official Requirement
                  </p>
                  <p className="text-gray-600 bg-blue-50 rounded px-2 py-1.5 border-l-2 border-blue-400 italic">
                    &ldquo;{officialRequirement}&rdquo;
                  </p>
                </div>
              )}

              {bestPractices && bestPractices.length > 0 && (
                <div>
                  <p className="font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Best Practices
                  </p>
                  <ul className="space-y-1 ml-4">
                    {bestPractices.map((tip, i) => (
                      <li key={i} className="text-gray-600 list-disc">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {commonMistakes && commonMistakes.length > 0 && (
                <div>
                  <p className="font-semibold text-red-700 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Common Mistakes
                  </p>
                  <ul className="space-y-1 ml-4">
                    {commonMistakes.map((mistake, i) => (
                      <li key={i} className="text-gray-600 list-disc">{mistake}</li>
                    ))}
                  </ul>
                </div>
              )}

              {govLink && (
                <a
                  href={govLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                >
                  View full guidance on Gov.uk <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── AI Confidence Button ───────────────────────────────────────────────────

function AIConfidenceButton({
  docId,
  docTitle,
  requirement,
  visaType,
  result,
  onResult,
}: {
  docId: string;
  docTitle: string;
  requirement: string;
  visaType: string;
  result?: AIConfidenceResult;
  onResult: (result: AIConfidenceResult) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    onResult({
      confidence: 0,
      flags: [],
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      recommendations: [],
      loading: true,
      error: null,
    });

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        onResult({
          confidence: 0,
          flags: [],
          swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
          recommendations: [],
          loading: false,
          error: 'Please sign in to use AI Confidence Scoring',
        });
        setLoading(false);
        return;
      }

      // Get the uploaded document data from store
      const store = useApplicationStore.getState();
      const upload = store.documentUploads[docId];

      if (!upload || (upload.status !== 'valid' && upload.status !== 'invalid')) {
        onResult({
          confidence: 0,
          flags: [],
          swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
          recommendations: [],
          loading: false,
          error: 'Please upload a document first',
        });
        setLoading(false);
        return;
      }

      if (!upload.base64Data) {
        onResult({
          confidence: 0,
          flags: [],
          swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
          recommendations: [],
          loading: false,
          error: 'Document data not available. Please re-upload the document to run AI analysis.',
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/ai-confidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: upload.base64Data,
          requirement,
          mimeType: upload.mimeType || 'image/jpeg',
          docTitle,
          visaType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      onResult({
        confidence: data.confidence,
        flags: data.flags,
        swot: data.swot,
        recommendations: data.recommendations,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      onResult({
        confidence: 0,
        flags: [],
        swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
        recommendations: [],
        loading: false,
        error: message,
      });
    } finally {
      setLoading(false);
    }
  }, [docId, docTitle, requirement, visaType, loading, onResult]);

  const isAnalyzed = result && !result.loading && !result.error && result.confidence > 0;

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading || result?.loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        isAnalyzed
          ? 'bg-violet-100 text-violet-800 border-violet-300'
          : 'bg-violet-50 text-violet-700 border-violet-200 hover:shadow-sm hover:bg-violet-100'
      }`}
    >
      {loading || result?.loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Analyzing...
        </>
      ) : isAnalyzed ? (
        <>
          <Target className="w-3.5 h-3.5" />
          Score: {result.confidence}%
        </>
      ) : (
        <>
          <Target className="w-3.5 h-3.5" />
          AI Confidence Score
        </>
      )}
    </button>
  );
}

// ─── AI Confidence Display ──────────────────────────────────────────────────

function AIConfidenceDisplay({ result }: { result: AIConfidenceResult }) {
  const [expanded, setExpanded] = useState(true);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-100', bar: 'bg-emerald-500' };
    if (score >= 60) return { text: 'text-amber-700', bg: 'bg-amber-100', bar: 'bg-amber-500' };
    return { text: 'text-red-700', bg: 'bg-red-100', bar: 'bg-red-500' };
  };

  const colors = getScoreColor(result.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-violet-200 rounded-xl overflow-hidden bg-white"
    >
      {/* Score Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-violet-50 hover:bg-violet-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <span className={`text-lg font-bold ${colors.text}`}>{result.confidence}%</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">AI Confidence Score</p>
            <p className="text-xs text-gray-500">
              {result.flags.length === 0 ? 'No issues found' : `${result.flags.length} flag${result.flags.length !== 1 ? 's' : ''} identified`}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Score Bar */}
      <div className="px-4 py-1 bg-violet-50/50">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colors.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              {/* FLAGS */}
              {result.flags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    FLAGS
                  </p>
                  <ul className="space-y-1">
                    {result.flags.map((flag, i) => (
                      <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">•</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SWOT */}
              <div className="grid grid-cols-2 gap-2">
                <SWOTCard
                  title="Strengths"
                  items={result.swot.strengths}
                  icon={TrendingUp}
                  color="emerald"
                />
                <SWOTCard
                  title="Weaknesses"
                  items={result.swot.weaknesses}
                  icon={TrendingDown}
                  color="red"
                />
                <SWOTCard
                  title="Opportunities"
                  items={result.swot.opportunities}
                  icon={Zap}
                  color="blue"
                />
                <SWOTCard
                  title="Threats"
                  items={result.swot.threats}
                  icon={AlertTriangle}
                  color="amber"
                />
              </div>

              {/* RECOMMENDATIONS */}
              {result.recommendations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    RECOMMENDATIONS
                  </p>
                  <ol className="space-y-1 list-decimal list-inside">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-gray-700">{rec}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SWOT Card ──────────────────────────────────────────────────────────────

function SWOTCard({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string;
  items: string[];
  icon: typeof TrendingUp;
  color: 'emerald' | 'red' | 'blue' | 'amber';
}) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-lg p-2 ${c.bg} border ${c.border}`}>
      <p className={`text-[10px] font-bold ${c.text} mb-1 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {title}
      </p>
      {items.length > 0 ? (
        <ul className="space-y-0.5">
          {items.map((item, i) => (
            <li key={i} className="text-[10px] text-gray-600">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-gray-400 italic">—</p>
      )}
    </div>
  );
}
