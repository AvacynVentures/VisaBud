'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  FileText,
  X,
  Lock,
  Download,
} from 'lucide-react';
import { useApplicationStore } from '@/lib/store';
import { ConfettiBurst } from '@/lib/animations';
import type { DocumentStatusResponse } from '@/lib/document-types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'pending' | 'validating' | 'valid' | 'invalid' | 'error';

interface DocumentUploadProps {
  docId: string;
  requirement: string;
  locked?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 90; // 90 × 2s = 3 minutes max polling

// ─── Component ──────────────────────────────────────────────────────────────

export default function DocumentUpload({ docId, requirement, locked = false }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);

  const { documentUploads, setDocumentUpload } = useApplicationStore();

  const upload = documentUploads[docId] || {
    status: 'idle' as UploadStatus,
    feedback: null,
    fileName: null,
    documentId: null,
  };
  const status = upload.status;
  const feedback = upload.feedback;
  const fileName = upload.fileName;

  // AbortController for cancellation
  const abortRef = useRef<AbortController | null>(null);

  // ─── Polling logic ──────────────────────────────────────────────────────

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    pollAttemptsRef.current = 0;
  }, []);

  const pollStatus = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/status`);
      if (!response.ok) {
        console.warn(`[DocumentUpload] Poll returned ${response.status}`);
        return;
      }

      const data: DocumentStatusResponse = await response.json();
      console.log(`[DocumentUpload] Poll result for ${docId}: ${data.status}`);

      switch (data.status) {
        case 'valid':
          stopPolling();
          setDocumentUpload(docId, {
            ...upload,
            status: 'valid',
            feedback: data.feedback,
            documentId,
          });
          break;

        case 'invalid':
          stopPolling();
          setDocumentUpload(docId, {
            ...upload,
            status: 'invalid',
            feedback: data.feedback,
            documentId,
          });
          break;

        case 'error':
          stopPolling();
          setDocumentUpload(docId, {
            ...upload,
            status: 'error',
            feedback: data.feedback || 'Validation failed. Your document has been saved.',
            documentId,
          });
          break;

        // 'pending' or 'processing' — keep polling
        default:
          break;
      }
    } catch (err) {
      console.warn(`[DocumentUpload] Poll error for ${docId}:`, err);
      // Don't stop polling on network hiccup — it will retry
    }
  }, [docId, upload, setDocumentUpload, stopPolling]);

  const startPolling = useCallback((documentId: string) => {
    stopPolling();
    pollAttemptsRef.current = 0;

    pollTimerRef.current = setInterval(() => {
      pollAttemptsRef.current += 1;

      if (pollAttemptsRef.current > MAX_POLL_ATTEMPTS) {
        stopPolling();
        setDocumentUpload(docId, {
          ...upload,
          status: 'valid',
          feedback: 'Document saved! AI validation is taking longer than expected — check back for detailed feedback.',
          documentId,
        });
        return;
      }

      pollStatus(documentId);
    }, POLL_INTERVAL_MS);

    // Also poll immediately (don't wait 2s for first check)
    pollStatus(documentId);
  }, [docId, upload, setDocumentUpload, stopPolling, pollStatus]);

  // Resume polling on mount if status is 'pending' with a documentId
  useEffect(() => {
    if ((status === 'pending' || status === 'validating') && upload.documentId) {
      console.log(`[DocumentUpload] Resuming poll for ${docId} (documentId=${upload.documentId})`);
      startPolling(upload.documentId);
    }

    return () => {
      stopPolling();
    };
    // Only run on mount and when status/documentId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, upload.documentId]);

  // Trigger confetti on valid status
  useEffect(() => {
    if (status === 'valid') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopPolling();
    };
  }, [stopPolling]);

  // ─── File validation ──────────────────────────────────────────────────

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Please upload a JPG, PNG, or PDF file.';
    if (file.size > MAX_FILE_SIZE) return 'File too large. Maximum size is 5MB.';
    return null;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ─── Upload handler (async — returns immediately) ─────────────────────

  const handleFile = useCallback(async (file: File) => {
    console.log(`[DocumentUpload] Starting upload for ${docId}:`, file.name);
    const error = validateFile(file);
    if (error) {
      setDocumentUpload(docId, { status: 'error', feedback: error, fileName: file.name });
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setDocumentUpload(docId, { status: 'uploading', feedback: null, fileName: file.name });

    try {
      // Convert to base64 for local download capability
      const base64 = await fileToBase64(file);

      if (signal.aborted) return;

      // Build FormData for server upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docId', docId);
      formData.append('requirement', requirement);

      console.log(`[DocumentUpload] Uploading to /api/documents...`);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
        signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(
          (errorBody as { error?: string }).error || `Upload failed: ${response.status}`
        );
      }

      const result = await response.json() as { documentId: string; status: string; message: string };
      console.log(`[DocumentUpload] Upload complete, documentId=${result.documentId}`);

      // Move to pending state with download capability
      setDocumentUpload(docId, {
        status: 'pending',
        feedback: null,
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
        documentId: result.documentId,
      });

      // Start polling for validation result
      startPolling(result.documentId);
    } catch (err) {
      if (signal.aborted) return;

      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      console.error(`[DocumentUpload] Upload error:`, err);
      setDocumentUpload(docId, { status: 'error', feedback: message, fileName: file.name });
    }
  }, [docId, requirement, setDocumentUpload, startPolling]);

  // ─── Action handlers ──────────────────────────────────────────────────

  const handleCancel = () => {
    abortRef.current?.abort();
    stopPolling();
    setDocumentUpload(docId, { status: 'idle', feedback: null, fileName: null });
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!locked) setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (locked) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRetry = () => {
    stopPolling();
    setDocumentUpload(docId, { status: 'idle', feedback: null, fileName: null });
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    stopPolling();
    setDocumentUpload(docId, { status: 'idle', feedback: null, fileName: null, fileData: null, mimeType: null, documentId: null });
  };

  const handleDownload = () => {
    const data = upload.fileData;
    const mime = upload.mimeType || 'application/octet-stream';
    const name = upload.fileName || 'document';
    if (!data) return;
    const byteChars = atob(data);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNums)], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Locked state ─────────────────────────────────────────────────────

  if (locked) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <Lock className="w-3.5 h-3.5" />
        <span>Unlock to upload documents</span>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="mt-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={onFileSelect}
        className="hidden"
        aria-label={`Upload document for ${requirement}`}
      />

      <AnimatePresence mode="wait">
        {/* IDLE */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-3 transition-all cursor-pointer touch-target
              ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-4 h-4 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">
                  {isDragging ? 'Drop your document here' : 'Upload Document'}
                </p>
                <p className="text-xs text-gray-400">JPG, PNG or PDF · Max 5MB</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* UPLOADING — fast, just saving to Supabase */}
        {status === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-blue-200 rounded-xl p-3 bg-blue-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-700">Saving document...</p>
                {fileName && <p className="text-xs text-blue-500 truncate">{fileName}</p>}
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
                title="Cancel upload"
              >
                <X className="w-4 h-4 text-blue-400 hover:text-blue-600" />
              </button>
            </div>
            <div className="mt-2 w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '90%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* PENDING — Document saved, AI checking in background */}
        {(status === 'pending' || status === 'validating') && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-violet-200 rounded-xl p-3 bg-violet-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-violet-700">
                  Saved! AI is checking your document...
                </p>
                {fileName && (
                  <p className="text-xs text-violet-500 truncate flex items-center gap-1">
                    <FileText className="w-3 h-3" />{fileName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {upload.fileData && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                    className="p-1.5 rounded-lg hover:bg-violet-100 transition-colors"
                    title="Download uploaded file"
                  >
                    <Download className="w-3.5 h-3.5 text-violet-600" />
                  </button>
                )}
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-lg hover:bg-violet-100 transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4 text-violet-400 hover:text-violet-600" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        {/* VALID — Success with bounce + confetti */}
        {status === 'valid' && (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="border-2 border-emerald-200 rounded-xl p-3 bg-emerald-50/50 relative overflow-hidden animate-greenGlow"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 relative">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </motion.div>
                {showConfetti && <ConfettiBurst active={true} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-700">✅ Document verified</p>
                {feedback && <p className="text-xs text-emerald-600 mt-0.5">{feedback}</p>}
                {fileName && (
                  <p className="text-xs text-emerald-500 mt-0.5 truncate flex items-center gap-1">
                    <FileText className="w-3 h-3" />{fileName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {upload.fileData && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                    className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5 text-emerald-500" />
                </button>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg transition-all touch-target"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload New Version
            </button>
          </motion.div>
        )}

        {/* INVALID */}
        {status === 'invalid' && (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-amber-200 rounded-xl p-3 bg-amber-50/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-700">⚠️ Issues found</p>
                {feedback && <p className="text-xs text-amber-600 mt-1">{feedback}</p>}
                <p className="text-xs text-amber-500 mt-1">Try uploading a clearer copy</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-semibold rounded-lg transition-all touch-target"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload New Version
            </button>
          </motion.div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-red-200 rounded-xl p-3 bg-red-50/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700">Upload failed</p>
                {feedback && <p className="text-xs text-red-500 mt-0.5">{feedback}</p>}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-all touch-target"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
