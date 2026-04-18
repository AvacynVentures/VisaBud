'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import DocumentUpload from '@/components/DocumentUpload';
import { useApplicationStore } from '@/lib/store';
import { AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
  const store = useApplicationStore();
  const { documentUploads, visaType } = store;
  const [showGuidance, setShowGuidance] = useState(true);

  // Get documents based on visa type
  const documentsToUpload = useMemo(() => {
    if (visaType === 'spouse') {
      return [
        { id: 'passport', name: 'Passport (bio page)', category: 'Personal' },
        { id: 'bank_statements', name: 'Bank statements (6 months)', category: 'Financial' },
        { id: 'payslips', name: 'Payslips or employer letter', category: 'Financial' },
        { id: 'proof_relationship', name: 'Proof of relationship (photos/letters)', category: 'Supporting' },
        { id: 'utility_bill', name: 'Utility bill (showing address)', category: 'Supporting' },
      ];
    } else if (visaType === 'skilled_worker') {
      return [
        { id: 'passport', name: 'Passport (bio page)', category: 'Personal' },
        { id: 'job_offer', name: 'Job offer letter', category: 'Employment' },
        { id: 'payslips', name: 'Payslips (if already employed)', category: 'Financial' },
        { id: 'bank_statements', name: 'Bank statements (showing £1,270)', category: 'Financial' },
        { id: 'qualification', name: 'Qualification certificates', category: 'Supporting' },
      ];
    } else if (visaType === 'citizenship') {
      return [
        { id: 'passport', name: 'Passport (bio page)', category: 'Personal' },
        { id: 'council_tax', name: 'Council tax bills (5 years)', category: 'Supporting' },
        { id: 'english_test', name: 'English language test certificate', category: 'Supporting' },
        { id: 'life_in_uk', name: 'Life in the UK test certificate', category: 'Supporting' },
      ];
    }
    return [];
  }, [visaType]);

  // Risk dashboard
  const uploads = documentUploads || {};
  const uploadedDocs = Object.entries(uploads).filter(([, v]) => v.status !== 'idle');
  const validDocs = uploadedDocs.filter(([, v]) => v.status === 'valid').length;
  const invalidDocs = uploadedDocs.filter(([, v]) => v.status === 'invalid').length;
  const errorDocs = uploadedDocs.filter(([, v]) => v.status === 'error').length;
  const pendingDocs = uploadedDocs.filter(([, v]) => v.status === 'validating' || v.status === 'uploading').length;

  const riskLevel = useMemo(() => {
    if (invalidDocs > 0) return { level: 'HIGH', emoji: '🔴', color: 'red' };
    if (errorDocs > 0) return { level: 'MEDIUM', emoji: '🟡', color: 'yellow' };
    if (pendingDocs > 0) return { level: 'CHECKING', emoji: '⏳', color: 'blue' };
    if (validDocs === 0) return { level: 'UNKNOWN', emoji: '❓', color: 'gray' };
    if (validDocs === documentsToUpload.length) return { level: 'LOW', emoji: '🟢', color: 'green' };
    return { level: 'REVIEW NEEDED', emoji: '⚠️', color: 'orange' };
  }, [validDocs, invalidDocs, errorDocs, pendingDocs, documentsToUpload.length]);

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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{riskLevel.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Risk Level: {riskLevel.level}</h3>
                  <p className="text-sm text-slate-600">
                    {riskLevel.level === 'HIGH' && 'Critical: Documents need revision before submission'}
                    {riskLevel.level === 'MEDIUM' && 'Warning: Some documents may need attention'}
                    {riskLevel.level === 'CHECKING' && 'Validating your documents...'}
                    {riskLevel.level === 'LOW' && 'All checked documents look good!'}
                    {riskLevel.level === 'REVIEW NEEDED' && 'Upload remaining documents for full assessment'}
                    {riskLevel.level === 'UNKNOWN' && 'Upload documents to begin validation'}
                  </p>
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
                <h4 className="font-semibold text-blue-900 mb-1">How AI Review Works</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Our AI checks if your documents meet official Gov.uk standards:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ <strong>Format:</strong> Is it a clear image or PDF?</li>
                  <li>✓ <strong>Completeness:</strong> Are all required fields visible?</li>
                  <li>✓ <strong>Visa-relevance:</strong> Is this the right document type?</li>
                  <li>✓ <strong>Compliance:</strong> Does it match Home Office requirements?</li>
                </ul>
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
            {documentsToUpload.map((doc) => {
              const upload = uploads[doc.id];
              const status = upload?.status || 'idle';

              return (
                <div key={doc.id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                  {/* Document Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{doc.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{doc.category}</p>
                    </div>
                    {status === 'valid' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {status === 'invalid' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {(status === 'validating' || status === 'uploading') && (
                      <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                    )}
                  </div>

                  {/* Feedback */}
                  {upload?.feedback && (
                    <div
                      className={`text-xs p-3 rounded-lg mb-4 ${
                        status === 'valid'
                          ? 'bg-green-50 text-green-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {upload.feedback}
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
