'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import DocumentUpload from '@/components/DocumentUpload';
import { useApplicationStore } from '@/lib/store';
import { AlertCircle, CheckCircle, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getRequirements, type GovernmentRequirement } from '@/lib/gov-requirements';

export default function DocumentsPage() {
  const router = useRouter();
  const store = useApplicationStore();
  const { documentUploads, visaType } = store;
  const [showGuidance, setShowGuidance] = useState(true);

  // Get OFFICIAL gov.uk requirements for this visa type
  const govRequirements = useMemo(() => {
    try {
      return getRequirements(visaType as any);
    } catch {
      return null;
    }
  }, [visaType]);

  const documentsToUpload = useMemo(() => {
    if (!govRequirements) return [];
    return govRequirements.documents;
  }, [govRequirements]);

  // Risk dashboard
  const uploads = documentUploads || {};
  const uploadedDocs = Object.entries(uploads).filter(([, v]) => v.status !== 'idle');
  const validDocs = uploadedDocs.filter(([, v]) => v.status === 'valid').length;
  const invalidDocs = uploadedDocs.filter(([, v]) => v.status === 'invalid').length;
  const errorDocs = uploadedDocs.filter(([, v]) => v.status === 'error').length;
  const pendingDocs = uploadedDocs.filter(([, v]) => v.status === 'validating' || v.status === 'uploading').length;

  // Enhanced risk calculation accounting for criticality
  const criticalDocuments = useMemo(() => {
    if (!govRequirements) return [];
    return govRequirements.documents.filter(doc => doc.criticality === 'CRITICAL');
  }, [govRequirements]);

  const criticalMissing = useMemo(() => {
    if (!govRequirements) return [];
    return criticalDocuments.filter(doc => {
      const upload = uploads[doc.id];
      return upload?.status !== 'valid';
    });
  }, [criticalDocuments, uploads, govRequirements]);

  const riskLevel = useMemo(() => {
    // CRITICAL risk: missing ANY critical documents
    if (criticalMissing.length > 0) {
      return { 
        level: 'CRITICAL RISK', 
        emoji: '🔴', 
        color: 'red',
        detail: `Missing ${criticalMissing.length} critical document(s) = auto-refusal`
      };
    }
    
    // HIGH risk: any invalid documents
    if (invalidDocs > 0) return { level: 'HIGH', emoji: '🔴', color: 'red', detail: 'Documents need revision' };
    
    // MEDIUM risk: errors or pending validation
    if (errorDocs > 0) return { level: 'MEDIUM', emoji: '🟡', color: 'yellow', detail: 'Some issues detected' };
    if (pendingDocs > 0) return { level: 'CHECKING', emoji: '⏳', color: 'blue', detail: 'Validating documents...' };
    
    // UNKNOWN: nothing uploaded yet
    if (validDocs === 0) return { level: 'NOT STARTED', emoji: '❓', color: 'gray', detail: 'Upload documents to begin' };
    
    // LOW: all documents valid
    if (validDocs === documentsToUpload.length) return { 
      level: 'LOW RISK', 
      emoji: '🟢', 
      color: 'green',
      detail: 'All uploaded documents pre-checked ✓'
    };
    
    // REVIEW NEEDED: partial completion
    return { 
      level: 'INCOMPLETE', 
      emoji: '⚠️', 
      color: 'orange',
      detail: `${validDocs}/${documentsToUpload.length} documents validated`
    };
  }, [validDocs, invalidDocs, errorDocs, pendingDocs, documentsToUpload.length, criticalMissing]);

  return (
    <AuthGate>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Document Review</h1>
              <p className="text-sm text-slate-600 mt-1">
                Upload & validate your documents before submitting to Home Office
              </p>
            </div>
            <Link
              href="/app/dashboard"
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Back to Checklist
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Risk Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Main Risk Card */}
            <div className={`rounded-2xl border-2 p-6 ${
              riskLevel.color === 'red' ? 'bg-red-50 border-red-200' :
              riskLevel.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
              riskLevel.color === 'blue' ? 'bg-blue-50 border-blue-200' :
              riskLevel.color === 'orange' ? 'bg-orange-50 border-orange-200' :
              riskLevel.color === 'green' ? 'bg-green-50 border-green-200' :
              'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{riskLevel.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">Risk Level: {riskLevel.level}</h3>
                  <p className="text-sm text-slate-600 mt-1">{(riskLevel as any).detail}</p>
                  {criticalMissing.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs font-semibold text-red-900 mb-1">Critical documents missing:</p>
                      <ul className="text-xs text-red-800 space-y-1">
                        {criticalMissing.slice(0, 3).map(doc => (
                          <li key={doc.id}>• {doc.name}</li>
                        ))}
                        {criticalMissing.length > 3 && <li>• + {criticalMissing.length - 3} more</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Validation Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700 font-medium">✓ Valid: {validDocs}</span>
                  <span className="text-slate-600">{validDocs} of {documentsToUpload.length}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(validDocs / documentsToUpload.length) * 100}%` }}
                  />
                </div>
                {invalidDocs > 0 && (
                  <p className="text-red-700 text-sm font-medium mt-2">
                    ⚠️ {invalidDocs} document(s) need revision
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Guidance Banner */}
          {showGuidance && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">AI Pre-Check: What This Does (and Doesn't) Do</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Our AI <strong>pre-checks</strong> your documents. It helps catch obvious issues early, but:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 mb-2">
                  <li>✓ <strong>What it checks:</strong> Format, readability, document type, basic completeness</li>
                  <li>✓ <strong>What it DOESN'T:</strong> This is NOT a guarantee of Home Office acceptance</li>
                  <li>⚠️ <strong>Final check:</strong> Only the Home Office has authority to approve or refuse</li>
                </ul>
                <p className="text-xs text-blue-900 font-semibold">
                  Always verify against official Gov.uk guidance before submitting to Home Office. This tool is a helper, not a substitute for official requirements.
                </p>
              </div>
              <button
                onClick={() => setShowGuidance(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex-shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentsToUpload.map((doc: GovernmentRequirement) => {
              const upload = uploads[doc.id];
              const status = upload?.status || 'idle';
              const isCritical = doc.criticality === 'CRITICAL';

              return (
                <div 
                  key={doc.id} 
                  className={`border rounded-xl p-6 hover:border-slate-300 transition-colors ${
                    isCritical && status !== 'valid'
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Document Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{doc.name}</h4>
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                            🔴 CRITICAL
                          </span>
                        )}
                        {!isCritical && doc.criticality === 'HIGH' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                            ⚠️ HIGH
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{doc.description}</p>
                      {doc.notes && doc.notes.length > 0 && (
                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          {doc.notes.slice(0, 2).map((note, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="flex-shrink-0">•</span>
                              <span>{note}</span>
                            </div>
                          ))}
                          {doc.notes.length > 2 && (
                            <p className="text-slate-500 italic">+ {doc.notes.length - 2} more requirements</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {status === 'valid' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {status === 'invalid' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                      {(status === 'validating' || status === 'uploading') && (
                        <Clock className="w-6 h-6 text-blue-600 animate-spin" />
                      )}
                    </div>
                  </div>

                  {/* Criticality Warning */}
                  {isCritical && status !== 'valid' && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4 text-sm text-red-800">
                      <strong>⚠️ Missing this document = automatic refusal</strong>
                      <p className="text-xs mt-1">This is mandatory per UK Home Office requirements.</p>
                    </div>
                  )}

                  {/* Feedback */}
                  {upload?.feedback && (
                    <div
                      className={`text-xs p-3 rounded-lg mb-4 ${
                        status === 'valid'
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {status === 'valid' ? '✓' : '✕'} {upload.feedback}
                    </div>
                  )}

                  {/* Upload Component */}
                  <DocumentUpload docId={doc.id} requirement={doc.name} locked={false} />
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 justify-between">
            <button
              onClick={() => router.push('/app/dashboard')}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
            {validDocs > 0 && (
              <button
                onClick={() => router.push('/app/submit')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Submission ({validDocs}/{documentsToUpload.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
