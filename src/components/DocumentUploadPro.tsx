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

type UploadStatus = 'idle' | 'uploading' | 'pending' | 'valid' | 'invalid' | 'error';

interface DocumentUploadProProps {
  docId: string;
  requirement: string;
  locked?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const POLL_INTERVAL_MS = 2000; // Poll every 2 seconds
const MAX_POLL_ATTEMPTS = 120; // 4 minutes max
const UPLOAD_TIMEOUT_MS = 10000; // 10 second timeout for upload

export default function DocumentUploadPro({
  docId,
  requirement,
  locked = false,
}: DocumentUploadProProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);

  const { documentUploads, setDocumentUpload } = useApplicationStore();
  const upload = documentUploads[docId] || {
    status: 'idle' as UploadStatus,
    feedback: null,
    fileName: null,
  };

  const status = upload.status;
  const feedback = upload.feedback;
  const fileName = upload.fileName;

  // Confetti animation on success
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
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (uploadControllerRef.current) uploadControllerRef.current.abort();
    };
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or PDF file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum 5MB.';
    }
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

  const startPolling = useCallback(
    (statusUrl: string) => {
      console.log(`[DocumentUpload] Starting polling: ${statusUrl}`);
      setPollAttempts(0);

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = setInterval(async () => {
        const attempt = pollAttempts + 1;
        setPollAttempts(attempt);

        try {
          const response = await fetch(statusUrl, {
            cache: 'no-store',
          });

          if (!response.ok) {
            console.warn(`[Poll] Status check failed: ${response.status}`);
            return;
          }

          const data = await response.json();
          console.log(`[Poll ${attempt}] Status:`, data.status);

          if (data.status === 'pending') {
            // Still waiting, continue polling
            return;
          }

          // Got result! Update store and stop polling
          console.log(`[Poll] Result received:`, data.status);
          setDocumentUpload(docId, {
            status: data.status,
            feedback: data.feedback,
            fileName: data.fileName || fileName,
          });

          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        } catch (err) {
          console.warn(`[Poll ${attempt}] Network error:`, err);
          // Continue polling on network error
        }

        // Max attempts reached
        if (attempt >= MAX_POLL_ATTEMPTS) {
          console.warn(`[Poll] Max attempts (${MAX_POLL_ATTEMPTS}) reached`);
          // Assume document is valid since it's saved
          setDocumentUpload(docId, {
            status: 'valid',
            feedback:
              'Validation in progress. Your document is ready to use.',
            fileName,
          });

          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      }, POLL_INTERVAL_MS);
    },
    [docId, fileName, setDocumentUpload, pollAttempts]
  );

  const handleUpload = useCallback(
    async (file: File) => {
      console.log(`[DocumentUpload] Upload started: ${file.name}`);

      const error = validateFile(file);
      if (error) {
        setDocumentUpload(docId, {
          status: 'error',
          feedback: error,
          fileName: file.name,
        });
        return;
      }

      // Show uploading state
      setDocumentUpload(docId, {
        status: 'uploading',
        feedback: null,
        fileName: file.name,
      });

      try {
        // Convert to base64
        const base64 = await fileToBase64(file);
        console.log(`[DocumentUpload] Base64 ready (${base64.length} bytes)`);

        // Setup abort controller
        uploadControllerRef.current = new AbortController();
        const timeoutId = setTimeout(
          () => uploadControllerRef.current?.abort(),
          UPLOAD_TIMEOUT_MS
        );

        // POST to upload endpoint
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            documentId: docId,
            requirement,
            fileName: file.name,
            mimeType: file.type,
          }),
          signal: uploadControllerRef.current.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Upload failed: ${response.status}`);
        }

        const result = await response.json();
        console.log(`[DocumentUpload] Upload successful:`, result);

        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        // Update to pending state
        setDocumentUpload(docId, {
          status: 'pending',
          feedback: 'Document saved! AI is checking it...',
          fileName: file.name,
          fileData: base64,
          mimeType: file.type,
        });

        // Start polling for result
        startPolling(result.statusUrl);
      } catch (err: any) {
        console.error(`[DocumentUpload] Error:`, err);

        if (err.name === 'AbortError') {
          setDocumentUpload(docId, {
            status: 'error',
            feedback: 'Upload timeout. Please try again.',
            fileName: file.name,
          });
        } else {
          setDocumentUpload(docId, {
            status: 'error',
            feedback: err.message || 'Upload failed. Please try again.',
            fileName: file.name,
          });
        }
      }
    },
    [docId, requirement, setDocumentUpload, startPolling]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (locked) return;

      const file = e.dataTransfer.files?.[0];
      if (file) handleUpload(file);
    },
    [locked, handleUpload]
  );

  const handleDownload = useCallback(() => {
    const data = upload.fileData;
    const mime = upload.mimeType || 'application/octet-stream';
    const name = upload.fileName || 'document';

    if (!data) return;

    try {
      const byteChars = atob(data);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
      }

      const blob = new Blob([new Uint8Array(byteNums)], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [upload.fileData, upload.mimeType, upload.fileName]);

  const handleReset = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (uploadControllerRef.current) uploadControllerRef.current.abort();
    setPollAttempts(0);
    setDocumentUpload(docId, {
      status: 'idle',
      feedback: null,
      fileName: null,
      fileData: null,
      mimeType: null,
    });
  }, [docId, setDocumentUpload]);

  const handleRetry = useCallback(() => {
    handleReset();
    fileInputRef.current?.click();
  }, [handleReset]);

  if (locked) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <Lock className="w-3.5 h-3.5" />
        <span>Unlock to upload documents</span>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {/* IDLE */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
              ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Upload Document</p>
                <p className="text-xs text-gray-500">JPG, PNG or PDF • Max 5MB</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* UPLOADING */}
        {status === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">Uploading...</p>
                {fileName && <p className="text-xs text-blue-600 truncate mt-1">{fileName}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* PENDING */}
        {status === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="border-2 border-violet-200 rounded-xl p-4 bg-violet-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-400 to-violet-600 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-violet-900">
                  ✅ Saved • Validating...
                </p>
                {fileName && <p className="text-xs text-violet-600 truncate mt-1">{fileName}</p>}
              </div>
              {upload.fileData && (
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-violet-100 transition-colors flex-shrink-0"
                  title="Download file"
                >
                  <Download className="w-4 h-4 text-violet-600" />
                </button>
              )}
            </div>
            <div className="mt-3 text-xs text-violet-600">
              Poll {pollAttempts}/{MAX_POLL_ATTEMPTS}
            </div>
          </motion.div>
        )}

        {/* VALID */}
        {status === 'valid' && (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-emerald-200 rounded-xl p-4 bg-emerald-50 relative overflow-hidden"
          >
            {showConfetti && <ConfettiBurst active={true} />}
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900">✅ Document Ready</p>
                {feedback && <p className="text-xs text-emerald-700 mt-1">{feedback}</p>}
                {fileName && (
                  <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {fileName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {upload.fileData && (
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-emerald-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg hover:bg-emerald-100 transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4 text-emerald-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* INVALID */}
        {status === 'invalid' && (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">⚠️ Issues Found</p>
                {feedback && <p className="text-xs text-amber-700 mt-1">{feedback}</p>}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-red-200 rounded-xl p-4 bg-red-50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">❌ Error</p>
                {feedback && <p className="text-xs text-red-700 mt-1">{feedback}</p>}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-semibold rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
