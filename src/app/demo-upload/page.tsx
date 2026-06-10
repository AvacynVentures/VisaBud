'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { ArrowRight, Check, AlertCircle, X } from 'lucide-react';

const validateDocumentType = (filename: string): { valid: boolean; type?: string } => {
  const lower = filename.toLowerCase();
  
  if (lower.includes('payslip')) return { valid: true, type: 'Payslip' };
  if (lower.includes('bank') || lower.includes('statement')) return { valid: true, type: 'Bank Statement' };
  if (lower.includes('passport')) return { valid: true, type: 'Passport' };
  if (lower.includes('employment') || lower.includes('contract')) return { valid: true, type: 'Employment Contract' };
  if (lower.includes('marriage') || lower.includes('certificate')) return { valid: true, type: 'Marriage Certificate' };
  if (lower.includes('utility') || lower.includes('bill')) return { valid: true, type: 'Utility Bill' };
  if (lower.includes('sponsor')) return { valid: true, type: 'Sponsor Document' };
  if (lower.includes('medical') || lower.includes('health')) return { valid: true, type: 'Medical Record' };
  
  return { valid: false };
};

export default function DemoUploadPage() {
  const searchParams = useSearchParams();
  const visaType = searchParams.get('visa') || 'spouse';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [isValidDocument, setIsValidDocument] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      simulateReview(selectedFile.name);
    }
  };

  const simulateReview = (filename: string) => {
    setIsReviewing(true);
    setTimeout(() => {
      const validation = validateDocumentType(filename);
      setDetectedType(validation.type || null);
      setIsValidDocument(validation.valid);
      setIsReviewing(false);
      setShowResult(true);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      simulateReview(selectedFile.name);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setShowResult(false);
    setIsReviewing(false);
    setDetectedType(null);
    setIsValidDocument(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <section className="container-max py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Try VisaBud AI for Free</h1>
            <p className="text-slate-800">Upload any visa-related document. See what our AI finds.</p>
          </div>

          {!showResult ? (
            <>
              {/* Upload Box */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-dashed border-blue-400 rounded-lg p-12 mb-8 text-center cursor-pointer hover:border-blue-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-4xl mb-4">📄</div>
                <p className="font-bold text-slate-900 mb-2">Drag & Drop Your Document</p>
                <p className="text-sm text-slate-600 mb-4">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-xs text-slate-600">
                  PDF, JPG, PNG, DOC supported (up to 10MB)
                </p>
              </div>

              {/* Selected File */}
              {file && (
                <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div className="text-left">
                        <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                        <p className="text-xs text-slate-600">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => resetUpload()}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Reviewing State */}
              {isReviewing && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-8 text-center">
                  <div className="inline-block animate-spin mb-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                  </div>
                  <p className="font-bold text-slate-900">Analyzing Your Document...</p>
                  <p className="text-sm text-slate-600 mt-2">Our AI is scanning for issues</p>
                </div>
              )}

              {/* Info */}
              <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600">
                  No account required. No credit card. No data stored.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* RESULT OR ERROR */}
              <div className="mb-12">
                {!isValidDocument ? (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8 text-center mb-8">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">We Couldn't Identify This Document</h3>
                    <p className="text-slate-800 mb-6">This doesn't appear to be a visa-related document. Please upload one of the following:</p>
                    <div className="grid md:grid-cols-2 gap-3 mb-8 max-w-md mx-auto">
                      {['Passport', 'Bank Statement', 'Payslip', 'Marriage Certificate', 'Employment Contract', 'Utility Bill', 'Sponsor Document', 'Medical Records'].map((doc, i) => (
                        <div key={i} className="flex items-center gap-2 text-left text-slate-800">
                          <Check className="w-4 h-4 text-red-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        resetUpload();
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                    >
                      📁 Try Another Document
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full text-sm text-emerald-700 font-bold mb-6">
                      ✓ Document Identified
                    </div>

                    {/* DOCUMENT TYPE DETECTED */}
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                      <p className="text-sm font-bold text-slate-900">Document Type Detected</p>
                      <p className="text-lg font-bold text-blue-700 mt-1">{detectedType} ✅</p>
                    </div>

                    {/* Main Score Card */}
                    <div className="bg-white border-2 border-emerald-400 rounded-lg p-8 mb-8 shadow-md">
                      <p className="text-xs font-bold text-slate-700 mb-4 uppercase">AI Review Result</p>
                      <div className="mb-6">
                        <p className="text-5xl font-bold text-emerald-600 mb-2">82%</p>
                        <p className="text-lg text-slate-800">Confidence Score</p>
                        <p className="text-sm text-slate-600">This document meets visa requirements</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-8">
                        <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '82%' }}></div>
                      </div>

                      {/* Status Items */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-slate-800">Document is legible and clear</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-slate-800">All required fields present</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <span className="text-sm text-slate-800">Date expires in 18 months (still valid)</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <span className="text-sm text-slate-800">Consider adding bank statement for additional evidence</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-8">
                      <p className="font-bold text-slate-900 mb-2">💡 Recommendation</p>
                      <p className="text-sm text-slate-800">
                        This document is strong. To reach 95% readiness, upload one supporting financial document (payslip or bank statement).
                      </p>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-6 mb-8">
                      <p className="font-bold text-slate-900 mb-4">What Happens Next?</p>
                      <ol className="space-y-3">
                        <li className="flex gap-3">
                          <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                          <span className="text-sm text-slate-800">Create a VisaBud account (free, no credit card)</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                          <span className="text-sm text-slate-800">Upload up to 3 documents for full AI review</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                          <span className="text-sm text-slate-800">Track your visa readiness score as you improve</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                          <span className="text-sm text-slate-800">Submit your application with confidence</span>
                        </li>
                      </ol>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-8 text-white text-center">
                      <h3 className="text-2xl font-bold mb-2">See This For All Your Documents</h3>
                      <p className="text-emerald-100 mb-6">Get 3 free AI reviews. No credit card required.</p>
                      <Link
                        href={`/auth/signup?visa=${visaType}`}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all"
                      >
                        Start Your Free Reviews
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Back Link */}
          <div className="mt-12 text-center">
            <Link href={`/visa-guidance/${visaType}`} className="text-slate-600 hover:text-slate-900 text-sm font-semibold">
              ← Back to {visaType} visa info
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-slate-300 bg-slate-900 py-10 mt-20">
        <div className="container-max text-center">
          <p className="text-slate-400 text-sm">
            This is a demo. Files are not stored. No account required.
          </p>
        </div>
      </footer>
    </div>
  );
}
