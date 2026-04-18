'use client';

import { useState } from 'react';
import { getTimelineData, calculateRemainingDays, calculateProgress, getProcessingDays } from '@/lib/timeline-data';

interface EnhancedTimelineProps {
  visaType: string;
  completedStageIndex?: number;  // 0 = none completed, 1 = first stage done, etc.
  isPriority?: boolean;          // Whether priority processing selected
}

export default function EnhancedTimeline({ 
  visaType, 
  completedStageIndex = -1,
  isPriority = false,
}: EnhancedTimelineProps) {
  const timeline = getTimelineData(visaType);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const progress = completedStageIndex >= 0 
    ? calculateProgress(timeline, completedStageIndex) 
    : 0;
  
  const remainingDays = completedStageIndex >= 0
    ? calculateRemainingDays(timeline, completedStageIndex)
    : timeline.stages.reduce((sum, stage) => sum + stage.leadDays, 0);

  const processingDays = getProcessingDays(timeline, isPriority);
  const totalDays = timeline.stages.reduce((sum, stage) => sum + stage.leadDays, 0);

  const formatWeeks = (days: number) => {
    const weeks = Math.round(days / 7);
    const remainderDays = days % 7;
    return weeks > 0 
      ? `${weeks} week${weeks > 1 ? 's' : ''}${remainderDays > 0 ? ` ${remainderDays} days` : ''}`
      : `${days} days`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Your Application Timeline</h3>
        
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Time Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
            <div className="text-xs text-slate-600 mb-1">Total Duration</div>
            <div className="text-lg font-bold text-slate-900">
              {formatWeeks(totalDays)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
            <div className="text-xs text-slate-600 mb-1">Remaining</div>
            <div className="text-lg font-bold text-orange-600">
              {formatWeeks(remainingDays)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
            <div className="text-xs text-slate-600 mb-1">Gov. Processing</div>
            <div className="text-lg font-bold text-indigo-600">
              {processingDays} days
            </div>
          </div>
        </div>

        {isPriority && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ⚡ <strong>Priority processing selected:</strong> Government processing reduced from {timeline.governmentStandards.standard} days to {processingDays} days
          </div>
        )}
      </div>

      {/* Detailed Stages */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-900 text-base">Stage-by-Stage Breakdown</h4>

        {timeline.stages.map((stage, index) => {
          const isCompleted = index <= completedStageIndex;
          const isCurrentStage = index === completedStageIndex + 1;
          const isExpanded = expandedStage === index;

          return (
            <div
              key={index}
              className={`rounded-xl border-2 transition-all duration-200 ${
                isCompleted
                  ? 'bg-green-50 border-green-200'
                  : isCurrentStage
                  ? 'bg-blue-50 border-blue-400 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setExpandedStage(isExpanded ? null : index)}
                className="w-full p-4 text-left hover:bg-opacity-75 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                        ✓
                      </div>
                    ) : isCurrentStage ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm animate-pulse">
                        →
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5 className={`font-bold text-sm ${
                          isCompleted ? 'text-green-900' : isCurrentStage ? 'text-blue-900' : 'text-slate-900'
                        }`}>
                          {stage.label}
                        </h5>
                        <p className={`text-xs mt-1 ${
                          isCompleted ? 'text-green-700' : isCurrentStage ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {stage.detail}
                        </p>
                      </div>
                      <span className="text-xs font-semibold whitespace-nowrap px-2 py-1 rounded bg-slate-100 text-slate-700">
                        {formatWeeks(stage.leadDays)}
                      </span>
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <div className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-200 px-4 py-4 bg-opacity-50">
                  {/* Lead Time Info */}
                  <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600 mb-2">⏱️ TIMELINE</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">
                      {formatWeeks(stage.leadDays)} to complete
                    </div>
                    {stage.isSubmission && (
                      <div className="text-xs text-slate-600 mt-2">
                        📤 <strong>Submission stage:</strong> You submit to government
                      </div>
                    )}
                  </div>

                  {/* Government Processing */}
                  {stage.governmentProcessingDays && (
                    <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="text-xs font-semibold text-indigo-600 mb-2">🏛️ GOVERNMENT PROCESSING</div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <strong>Standard:</strong> {stage.governmentProcessingDays.standard} days
                        </div>
                        {stage.governmentProcessingDays.priority && (
                          <div className="text-sm">
                            <strong>Priority:</strong> {stage.governmentProcessingDays.priority} days <span className="text-xs text-indigo-600">(+fee)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {stage.tips && stage.tips.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-600 mb-2">💡 PRO TIPS</div>
                      <ul className="space-y-1">
                        {stage.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-slate-700 flex gap-2">
                            <span className="text-amber-500 flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Required Documents */}
                  {stage.documentsRequired && stage.documentsRequired.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-600 mb-2">📄 DOCUMENTS NEEDED</div>
                      <div className="text-xs text-slate-700 space-y-1">
                        {stage.documentsRequired.map((doc, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-green-600 flex-shrink-0">✓</span>
                            <span className="capitalize">{doc.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Action */}
                  {stage.followUpAction && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-700">
                      <strong>Next:</strong> {stage.followUpAction}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        <strong>⚠️ Important Notes:</strong>
        <ul className="mt-2 space-y-1 text-xs">
          <li>• Timelines are based on standard circumstances. Your situation may vary.</li>
          <li>• Government processing times are approximate and can fluctuate.</li>
          <li>• If Home Office requests additional information (RFI), you typically have 28 days to respond.</li>
          <li>• Always verify current requirements on official Gov.uk guidance.</li>
        </ul>
      </div>
    </div>
  );
}
