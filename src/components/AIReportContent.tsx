'use client';

import { ShieldCheck, ShieldAlert, Shield, TrendingUp, TrendingDown, Lightbulb, AlertTriangle } from 'lucide-react';

interface AIReportContentProps {
  documentName: string;
  confidence: number;
  flags: Array<{ text: string; severity: string }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: Array<{ step: string; description: string }>;
  generatedAt?: string;
}

function getConfidenceColor(score: number): { text: string; bg: string; ring: string; emoji: string } {
  if (score >= 70) return { text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200', emoji: '🟢' };
  if (score >= 40) return { text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200', emoji: '🟡' };
  return { text: 'text-red-700', bg: 'bg-red-50', ring: 'ring-red-200', emoji: '🔴' };
}

function getSeverityConfig(severity: string) {
  switch (severity) {
    case 'high': return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: ShieldAlert };
    case 'medium': return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Shield };
    case 'low': return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: ShieldCheck };
    default: return { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: Shield };
  }
}

export default function AIReportContent({ documentName, confidence, flags, swot, recommendations, generatedAt }: AIReportContentProps) {
  const confColor = getConfidenceColor(confidence);

  return (
    <div className="space-y-6">
      {/* Header with Confidence Score */}
      <div className={`rounded-xl p-4 sm:p-5 ${confColor.bg} ring-1 ${confColor.ring}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{documentName}</h3>
            {generatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Generated {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className="text-center flex-shrink-0">
            <div className={`text-3xl font-extrabold ${confColor.text}`}>
              {confidence}%
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Confidence {confColor.emoji}
            </div>
          </div>
        </div>
      </div>

      {/* FLAGS */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Flags
        </h4>
        {flags.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">No issues found — document looks good!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {flags.map((flag, i) => {
              const cfg = getSeverityConfig(flag.severity);
              const Icon = cfg.icon;
              return (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>
                      {flag.severity}
                    </span>
                    <p className="text-sm text-gray-800 mt-0.5">{flag.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SWOT Analysis */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          SWOT Analysis
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Strengths */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Strengths
            </h5>
            {swot.strengths.length === 0 ? (
              <p className="text-xs text-gray-400 italic">None identified</p>
            ) : (
              <ul className="space-y-1.5">
                {swot.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-emerald-500 flex-shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Weaknesses */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <h5 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Weaknesses
            </h5>
            {swot.weaknesses.length === 0 ? (
              <p className="text-xs text-gray-400 italic">None identified</p>
            ) : (
              <ul className="space-y-1.5">
                {swot.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-red-500 flex-shrink-0">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Opportunities */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
            <h5 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Opportunities
            </h5>
            {swot.opportunities.length === 0 ? (
              <p className="text-xs text-gray-400 italic">None identified</p>
            ) : (
              <ul className="space-y-1.5">
                {swot.opportunities.map((o, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Threats */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Threats
            </h5>
            {swot.threats.length === 0 ? (
              <p className="text-xs text-gray-400 italic">None identified</p>
            ) : (
              <ul className="space-y-1.5">
                {swot.threats.map((t, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-amber-500 flex-shrink-0">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-violet-500" />
          Recommendations
        </h4>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-violet-700">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                {rec.step && (
                  <p className="text-sm font-semibold text-gray-900">{rec.step}</p>
                )}
                <p className="text-sm text-gray-600 mt-0.5">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
