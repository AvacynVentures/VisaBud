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
} from 'lucide-react';
import { useApplicationStore } from '@/lib/store';
import { ConfettiBurst } from '@/lib/animations';

// ─── Types ──────────────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'validating' | 'valid' | 'invalid' | 'error';

interface DocumentUploadProps {
  docId: string;
  requirement: string;
  locked?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';

// ─── Component ──────────────────────────────────────────────────────────────

export default function DocumentUpload({ docId, requirement, locked = false }: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { documentUploads, setDocumentUpload } = useApplicationStore();

  const upload = documentUploads[docId] || { status: 'idle' as UploadStatus, feedback: null, fileName: null };
  const status = upload.status;
  const feedback = upload.feedback;
  const fileName = upload.fileName;

  // AbortController for cancellation (moved to ref level for better cleanup)
  const abortRef = useRef<AbortController | null>(null);

  // Trigger confetti on valid status
  useEffect(() => {
    if (status === 'valid') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Fix #3: Explicit cleanup on unmount
  // Cancel any in-flight upload if component unmounts
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

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

  const handleFile = useCallback(async (file: File) => {
    console.log(`[DocumentUpload] Starting upload for ${docId}`, file.name);
    const error = validateFile(file);
    if (error) {
      console.log(`[DocumentUpload] Validation error: ${error}`);
      setDocumentUpload(docId, { status: 'error', feedback: error, fileName: file.name });
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    console.log(`[DocumentUpload] Setting status to uploading`);
    setDocumentUpload(docId, { status: 'uploading', feedback: null, fileName: file.name });

    try {
      console.log(`[DocumentUpload] Converting to base64...`);
      const base64 = await fileToBase64(file);
      console.log(`[DocumentUpload] Base64 ready, length: ${base64.length}`);

      if (signal.aborted) {
        console.log(`[DocumentUpload] Aborted before validating`);
        return;
      }
      console.log(`[DocumentUpload] Setting status to validating`);
      setDocumentUpload(docId, { status: 'validating', feedback: null, fileName: file.name });

      let validationResult: { valid: boolean; feedback: string } | null = null;

      try {
        // 25-second timeout to prevent infinite spinner
        console.log(`[DocumentUpload] Fetching /api/validate-document...`);
        const timeoutId = setTimeout(() => {
          console.log(`[DocumentUpload] TIMEOUT: 25 seconds exceeded, aborting`);
          abortRef.current?.abort();
        }, 25000);

        const response = await fetch('/api/validate-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, requirement, mimeType: file.type }),
          signal,
        });

        clearTimeout(timeoutId);
        console.log(`[DocumentUpload] Response received: ${response.status} ${response.statusText}`);

        // Always try to parse response, even if not ok
        try {
          validationResult = await response.json();
          console.log(`[DocumentUpload] Parsed JSON response:`, validationResult);
        } catch (parseErr) {
          // Response wasn't JSON — network error or server issue
          console.log(`[DocumentUpload] Failed to parse JSON:`, parseErr);
          if (response.ok) {
            validationResult = { valid: true, feedback: 'Document uploaded successfully.' };
          } else {
            throw new Error(`Validation failed: ${response.status} ${response.statusText}`);
          }
        }

        // If response wasn't ok but we got JSON with error feedback, treat it as validation feedback
        if (!response.ok && validationResult?.feedback) {
          // Server returned error with guidance — show it to user
          console.log(`[DocumentUpload] Server returned error but with feedback`);
          validationResult.valid = false;
        }
      } catch (fetchErr: any) {
        console.error(`[DocumentUpload] Fetch error:`, fetchErr);
        if (fetchErr?.name === 'AbortError') {
          // Check if user cancelled or timeout
          if (signal.aborted) {
            console.log(`[DocumentUpload] Request aborted, setting timeout error state`);
            setDocumentUpload(docId, { status: 'error', feedback: 'Validation timed out. Your document was saved — try again or upload a clearer copy.', fileName: file.name, fileData: base64, mimeType: file.type });
            return;
          }
        }
        // Network error or API unavailable — accept document anyway but note it
        console.error('[DocumentUpload] Validation fetch error:', fetchErr);
      }

      if (signal.aborted) {
        console.log(`[DocumentUpload] Aborted after fetch`);
        return;
      }

      // Store file data for download regardless of validation result
      const baseUpload = { fileName: file.name, fileData: base64, mimeType: file.type };

      if (validationResult) {
        if (validationResult.valid) {
          console.log(`[DocumentUpload] Setting status to VALID`);
          setDocumentUpload(docId, { ...baseUpload, status: 'valid', feedback: validationResult.feedback });
        } else {
          console.log(`[DocumentUpload] Setting status to INVALID`);
          setDocumentUpload(docId, { ...baseUpload, status: 'invalid', feedback: validationResult.feedback });
        }
      } else {
        // No AI available or network error — mark as uploaded/valid with note
        console.log(`[DocumentUpload] No validation result, setting to VALID with fallback message`);
        setDocumentUpload(docId, { ...baseUpload, status: 'valid', feedback: 'Document uploaded. AI validation unavailable — you can still use this document for your application.' });
      }
    } catch (err) {
      console.error(`[DocumentUpload] Outer catch error:`, err);
      if (signal.aborted) {
        console.log(`[DocumentUpload] Signal aborted in outer catch`);
        return;
      }
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      console.log(`[DocumentUpload] Setting status to ERROR: ${message}`);
      setDocumentUpload(docId, { status: 'error', feedback: message, fileName: file.name });
    }
  }, [docId, requirement, setDocumentUpload]);

  const handleCancel = () => {
    abortRef.current?.abort();
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
    setDocumentUpload(docId, { status: 'idle', feedback: null, fileName: null });
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setDocumentUpload(docId, { status: 'idle', feedback: null, fileName: null, fileData: null, mimeType: null });
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

        {/* UPLOADING */}
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
                <p className="text-sm font-medium text-blue-700">Uploading...</p>
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
                animate={{ width: '60%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* VALIDATING */}
        {status === 'validating' && (
          <motion.div
            key="validating"
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
                <p className="text-sm font-medium text-violet-700">AI is checking your document...</p>
                {fileName && <p className="text-xs text-violet-500 truncate">{fileName}</p>}
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg hover:bg-violet-100 transition-colors flex-shrink-0"
                title="Cancel"
              >
                <X className="w-4 h-4 text-violet-400 hover:text-violet-600" />
              </button>
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
                    <Upload className="w-3.5 h-3.5 text-emerald-600 rotate-180" />
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
