'use client';

import { useState } from 'react';
import { Document, RiskAlert } from '@/lib/types';

interface DashboardProps {
  applicationId: string;
  documents: Document[];
  riskAlerts: RiskAlert[];
  onDownload: () => void;
}

export default function Dashboard({ applicationId: _applicationId, documents = [], riskAlerts = [], onDownload }: DashboardProps) {
  const [completedDocs, setCompletedDocs] = useState<Set<string>>(new Set());

  const toggleDocument = (docId: string) => {
    const updated = new Set(completedDocs);
    if (updated.has(docId)) {
      updated.delete(docId);
    } else {
      updated.add(docId);
    }
    setCompletedDocs(updated);
  };

  // Only count documents marked as completed (not invalid ones)
  const validDocuments = documents.filter(doc => doc.is_completed);
  const completionPercentage = validDocuments.length > 0 
    ? Math.round((completedDocs.size / validDocuments.length) * 100) 
    : 0;

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.document_category]) {
      acc[doc.document_category] = [];
    }
    acc[doc.document_category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return '👤';
      case 'financial':
        return '💰';
      case 'supporting':
        return '📎';
      default:
        return '📄';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'personal':
        return 'Personal Documents';
      case 'financial':
        return 'Financial Evidence';
      case 'supporting':
        return 'Supporting Documents';
      default:
        return 'Documents';
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '🔵';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container-max py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Application Checklist</h1>
          <p className="text-slate-600 mb-4">Check items off as you gather them. You can download your progress anytime.</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }} 
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">
              {completedDocs.size} of {documents.length} documents gathered
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-max py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Documents by Category */}
          {Object.entries(documentsByCategory).map(([category, docs]) => (
            <div key={category} className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                {getCategoryTitle(category)}
              </h3>
              <div className="space-y-3">
                {docs.map((doc) => (
                  <label
                    key={doc.id}
                    className="flex items-start p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={completedDocs.has(doc.id)}
                      onChange={() => toggleDocument(doc.id)}
                      className="w-5 h-5 mt-0.5 rounded accent-blue-600 flex-shrink-0"
                    />
                    <div className="ml-3 flex-grow">
                      <p className="font-medium text-slate-900">
                        {doc.document_name}
                        {doc.format_required && (
                          <span className="text-xs text-slate-500 ml-2">
                            ({doc.format_required})
                          </span>
                        )}
                      </p>
                      {doc.description && (
                        <p className="text-sm text-slate-600 mt-1">{doc.description}</p>
                      )}
                      {doc.tips && (
                        <p className="text-xs text-blue-600 mt-2">💡 {doc.tips}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Timeline */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🗓️</span>
              Your Application Timeline
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Prepare Documents', timeframe: '1-2 weeks', desc: 'Gather items from your checklist' },
                { step: 2, title: 'Biometric Appointment', timeframe: '1-2 weeks', desc: 'Book at a UKVI centre, bring original documents' },
                { step: 3, title: 'Submit Application', timeframe: '1 day', desc: 'Use the official Gov.uk portal, upload scans' },
                { step: 4, title: 'Home Office Review', timeframe: '8-12 weeks', desc: 'Wait for decision letter, track progress' },
                { step: 5, title: 'Visa Decision', timeframe: 'Varies', desc: 'Approval or request for more documents' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    {idx < 4 && <div className="w-1 h-12 bg-blue-200 mt-2" />}
                  </div>
                  <div className="pb-4">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-blue-600 font-medium">{item.timeframe}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-4">👉 Standard processing time: 8-12 weeks · Most approvals arrive by week 10</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Alerts */}
          {riskAlerts && riskAlerts.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Risk Alerts
              </h3>
              <div className="space-y-3">
                {riskAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg ${getRiskColor(alert.severity)}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xl flex-shrink-0">{getRiskIcon(alert.severity)}</span>
                      <h4 className="font-semibold">{alert.title}</h4>
                    </div>
                    <p className="text-sm mt-2">{alert.description}</p>
                    {alert.recommendation && (
                      <p className="text-xs mt-2 font-medium">✓ {alert.recommendation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ready to Download */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Ready to Submit?</h3>
            <p className="text-sm text-blue-800 mb-6">
              Download your personalised application pack — ready to reference when you submit to the Home Office.
            </p>
            <button
              onClick={onDownload}
              className="btn-primary w-full py-3 font-semibold mb-3"
            >
              📥 Download My Application Pack
            </button>
            <p className="text-xs text-blue-700">
              ✓ Personalised checklist<br />
              ✓ Timeline reference<br />
              ✓ Risk alerts summary<br />
              ✓ Gov.uk links
            </p>
          </div>

          {/* Quick Stats */}
          <div className="card p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-3">At a Glance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Total Documents</span>
                <span className="font-semibold">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Completed</span>
                <span className="font-semibold">{completedDocs.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Risk Alerts</span>
                <span className="font-semibold">{riskAlerts?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="border-t border-slate-200 bg-slate-50 mt-12 py-6">
        <div className="container-max text-center">
          <p className="text-sm text-slate-600 mb-2">
            ⚠️ VisaBud is a guidance tool, not legal advice. Always verify with official Gov.uk guidance before submitting your application.
          </p>
          <p className="text-xs text-slate-500">
            Immigration requirements change — we update regularly, but final decisions rest with UKVI.
          </p>
        </div>
      </div>
    </div>
  );
}
