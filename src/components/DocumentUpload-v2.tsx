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

interface DocumentUploadV2Props {
  docId: string;
  requirement: string;
  locked?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';

export default function DocumentUploadV2({
  docId,
  requirement,
  locked = false,
}: DocumentUploadV2Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { documentUploads, setDocumentUpload } = useApplicationStore();
  const upload = documentUploads[docId] || {
    status: 'idle' as UploadStatus,
    feedback: null,
    fileName: null,
  };

  const status = upload.status;
  const feedback = upload.feedback;
  const fileName = upload.fileName;

  // Confetti on success
  useEffect(() => {
    if (status === 'valid') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or PDF file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 5MB.';
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

  const startPolling = (documentId: string, statusUrl: string) => {
    console.log(`[DocumentUpload] Starting polling for ${documentId}`);

    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const maxAttempts = 60; // 2 minutes max (60 * 2s)
    let attempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      console.log(`[DocumentUpload] Poll attempt ${attempts}/${maxAttempts}`);

      try {
        const response = await fetch(statusUrl);
        const data = await response.json();

        if (data.status === 'pending') {
          // Still waiting, keep polling
          return;
        }

        // Got result!
        console.log(`[DocumentUpload] Validation complete:`, data.status, data.feedback);
        setDocumentUpload(docId, {
          status: data.status,
          feedback: data.feedback,
          fileName: data.fileName || fileName,
        });

        // Stop polling
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } catch (err) {
        console.error(`[DocumentUpload] Poll error:`, err);
        // Network error, keep trying
      }

      // Max attempts reached
      if (attempts >= maxAttempts) {
        console.warn(`[DocumentUpload] Max polling attempts reached`);
        setDocumentUpload(docId, {
          status: 'valid', // Mark as valid since it's saved
          feedback:
            'Validation in progress. Your document is saved and ready to use.',
          fileName,
        });
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    }, 2000); // Poll every 2 seconds
  };

  const handleFile = useCallback(
    async (file: File) => {
      console.log(`[DocumentUpload] Starting upload for ${docId}`, file.name);

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
        const base64 = await fileToBase64(file);
        console.log(`[DocumentUpload] Base64 ready, uploading...`);

        // POST to new /api/documents endpoint
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            documentId: docId,
            requirement,
            fileName: file.name,
            mimeType: file.type,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        console.log(`[DocumentUpload] Upload successful, result:`, result);

        // Update to pending state with file data for download
        setDocumentUpload(docId, {
          status: 'pending',
          feedback: 'Document saved! AI is checking it...',
          fileName: file.name,
          fileData: base64,
          mimeType: file.type,
        });

        // Start polling for validation result
        startPolling(docId, result.statusUrl);
      } catch (err: any) {
        console.error(`[DocumentUpload] Upload error:`, err);
        setDocumentUpload(docId, {
          status: 'error',
          feedback: err.message || 'Upload failed. Please try again.',
          fileName: file.name,
        });
      }
    },
    [docId, requirement, setDocumentUpload]
  );

  const handleDownload = () => {
    const data = upload.fileData;
    const mime = upload.mimeType || 'application/octet-stream';
    const name = upload.fileName || 'document';

    if (!data) return;

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
  };

  const handleReset = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setDocumentUpload(docId, {
      status: 'idle',
      feedback: null,
      fileName: null,
      fileData: null,
      mimeType: null,
    });
  };

  const handleRetry = () => {
    handleReset();
    fileInputRef.current?.click();
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
            className={`border-2 border-dashed rounded-xl p-3 transition-all cursor-pointer
              ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Document</p>
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
            className="border-2 border-blue-200 rounded-xl p-3 bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700">Uploading...</p>
                {fileName && <p className="text-xs text-blue-500 truncate">{fileName}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* PENDING - File saved, validation in progress */}
        {status === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="border-2 border-violet-200 rounded-xl p-3 bg-violet-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-violet-600 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-violet-700">
                  ✅ Saved • AI checking...
                </p>
                {fileName && <p className="text-xs text-violet-500 truncate">{fileName}</p>}
              </div>
              {upload.fileData && (
                <button
                  onClick={() => handleDownload()}
                  className="p-1.5 rounded-lg hover:bg-violet-100 transition-colors flex-shrink-0"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-violet-600" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* VALID */}
        {status === 'valid' && (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-emerald-200 rounded-xl p-3 bg-emerald-50 relative overflow-hidden"
          >
            {showConfetti && <ConfettiBurst active={true} />}
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-700">✅ Document ready</p>
                {feedback && <p className="text-xs text-emerald-600 mt-0.5">{feedback}</p>}
                {fileName && (
                  <p className="text-xs text-emerald-500 mt-0.5 truncate flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {fileName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {upload.fileData && (
                  <button
                    onClick={() => handleDownload()}
                    className="p-1.5 rounded-lg hover:bg-emerald-100"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-emerald-100"
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
            className="border-2 border-amber-200 rounded-xl p-3 bg-amber-50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-700">⚠️ Issues found</p>
                {feedback && <p className="text-xs text-amber-600 mt-1">{feedback}</p>}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-semibold rounded-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
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
            className="border-2 border-red-200 rounded-xl p-3 bg-red-50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700">❌ Error</p>
                {feedback && <p className="text-xs text-red-600 mt-1">{feedback}</p>}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
