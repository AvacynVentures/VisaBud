'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  AlertTriangle,
  Loader2,
  RefreshCw,
  FileText,
  X,
  Lock,
  Download,
  ShieldCheck,
  Sparkles,
  ClipboardList,
  FileDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type {
  AIStatus,
  DocumentStatusResponse,
} from '@/lib/document-upload-types';
import { ConfettiBurst } from '@/lib/animations';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DocumentUploadV3Props {
  checklistItemId: string;
  requirement: string;
  locked?: boolean;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
  // Server-side document state (loaded from /api/documents/my)
  serverDoc?: {
    id: string;
    fileName: string;
    downloadUrl: string;
    aiStatus: AIStatus;
    confidenceScore: number | null;
    scoringFeedback: string | null;
    classificationFeedback: string | null;
    isDocument: boolean | null;
  } | null;
  onAIComplete?: (result: DocumentStatusResponse) => void;
  onViewReport?: () => void;
  onDownloadReport?: () => void;
  applicationId?: string | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const POLL_INTERVAL_MS = 500; // ← VERY FAST POLLING for instant UI updates
const MAX_POLL_ATTEMPTS = 180; // ← 9 minutes (was 4 min, pipeline can be slow)

// ─── Component ──────────────────────────────────────────────────────────────

export default function DocumentUploadV3({
  checklistItemId,
  requirement: _requirement,
  locked = false,
  isPremium = false,
  onUpgradeClick,
  serverDoc,
  onAIComplete,
  onViewReport,
  onDownloadReport,
  applicationId,
}: DocumentUploadV3Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [_pollCount, setPollCount] = useState(0);

  // Local state (merges server state with upload progress)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(serverDoc?.id || null);
  const [fileName, setFileName] = useState<string | null>(serverDoc?.fileName || null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(serverDoc?.downloadUrl || null);

  // AI state
  const [aiStatus, setAiStatus] = useState<AIStatus>(serverDoc?.aiStatus || 'none');
  const [confidenceScore, setConfidenceScore] = useState<number | null>(serverDoc?.confidenceScore ?? null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(
    serverDoc?.scoringFeedback || serverDoc?.classificationFeedback || null
  );
  const [isDocument, setIsDocument] = useState<boolean | null>(serverDoc?.isDocument ?? null);

  const hasSavedFile = !!uploadId;
  const isAIRunning = aiStatus === 'queued' || aiStatus === 'classifying' || aiStatus === 'analyzing';
  // const isAIDone = aiStatus === 'complete' || aiStatus === 'failed';

  // Sync server doc on initial mount only (not on every re-render)
  // Polling updates take priority over stale serverDoc
  const serverDocSynced = useRef(false);
  useEffect(() => {
    if (serverDoc && !serverDocSynced.current) {
      serverDocSynced.current = true;
      setUploadId(serverDoc.id);
      setFileName(serverDoc.fileName);
      setDownloadUrl(serverDoc.downloadUrl);
      setIsDocument(serverDoc.isDocument);
      setConfidenceScore(serverDoc.confidenceScore);
      setAiFeedback(serverDoc.scoringFeedback || serverDoc.classificationFeedback);

      // Only trust terminal AI states from server
      if (serverDoc.aiStatus === 'complete' || serverDoc.aiStatus === 'failed') {
        setAiStatus(serverDoc.aiStatus);
      } else {
        setAiStatus('none');
      }
    }
  }, [serverDoc]);

  // Confetti on AI complete with good score
  useEffect(() => {
    if (aiStatus === 'complete' && confidenceScore !== null && confidenceScore >= 70) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [aiStatus, confidenceScore]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // No resume polling on mount — in-progress states are treated as 'none'
  // User must click "AI Ready Check" again to re-trigger

  // ─── Auth Helper ────────────────────────────────────────────────────────

  const getToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // ─── Polling ────────────────────────────────────────────────────────────

  const startPolling = useCallback((docId: string, token: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    setPollCount(0);

    let count = 0;
    pollRef.current = setInterval(async () => {
      count++;
      setPollCount(count);
      console.log(`[poll] Attempt ${count}: Fetching status for ${docId}`);

      try {
        const response = await fetch(`/api/documents/${docId}/status`, {
          cache: 'no-store',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          console.warn(`[poll] Status ${response.status}, retrying...`);
          return;
        }

        const data: DocumentStatusResponse = await response.json();
        console.log(`[poll] Attempt ${count}: Got status="${data.aiStatus}", confidence=${data.confidenceScore}`);

        // Update AI status progressively
        setAiStatus(data.aiStatus);
        setIsDocument(data.isDocument);

        if (data.classificationFeedback) {
          setAiFeedback(data.classificationFeedback);
        }

        // Terminal state — stop polling
        if (data.aiStatus === 'complete' || data.aiStatus === 'failed') {
          console.log(`[poll] ✅ COMPLETE: status=${data.aiStatus}, stopping polling`);
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;

          setConfidenceScore(data.confidenceScore);
          setAiFeedback(data.scoringFeedback || data.classificationFeedback);
          onAIComplete?.(data);
          return;
        }
        
        console.log(`[poll] Status still "${data.aiStatus}", will check again...`);
      } catch (err) {
        console.warn(`[poll] Attempt ${count} ERROR:`, err);
      }

      // Max attempts - but still keep checking once per minute for up to 15 minutes total
      // This prevents "false timeouts" where backend is still processing
      if (count >= MAX_POLL_ATTEMPTS) {
        console.log(`[poll] ⚠️ MAX ATTEMPTS REACHED (${count}/${MAX_POLL_ATTEMPTS}), switching to slow polling...`);
        if (pollRef.current) clearInterval(pollRef.current);
        
        // Switch to slow polling (every 30s) instead of giving up
        console.log('[poll] Slow polling started (every 30s)...');
        pollRef.current = setInterval(async () => {
          try {
            const slowResponse = await fetch(`/api/documents/${docId}/status`, { cache: 'no-store' });
            if (!slowResponse.ok) return;
            const slowData: DocumentStatusResponse = await slowResponse.json();
            
            if (slowData.aiStatus === 'complete' || slowData.aiStatus === 'failed') {
              if (pollRef.current) clearInterval(pollRef.current);
              pollRef.current = null;
              setAiStatus(slowData.aiStatus);
              setConfidenceScore(slowData.confidenceScore);
              setAiFeedback(slowData.scoringFeedback || slowData.classificationFeedback);
              onAIComplete?.(slowData);
              console.log('[poll] Slow polling detected completion!');
            }
          } catch (e) {
            console.warn('[slow-poll] Error:', e);
          }
        }, 30000); // Check every 30 seconds
        
        setAiStatus('queued'); // Still processing
        setAiFeedback('Still analyzing your document... This may take a few more minutes. We\'ll update automatically when ready.');
      }
    }, POLL_INTERVAL_MS);
  }, [onAIComplete]);

  // ─── Upload Handler ─────────────────────────────────────────────────────

  const handleUpload = useCallback(async (file: File) => {
    // Client-side validation
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadState('error');
      setUploadError('Please upload a JPG, PNG, or PDF file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadState('error');
      setUploadError('File too large. Maximum 5MB.');
      return;
    }

    setUploadState('uploading');
    setUploadError(null);
    setFileName(file.name);

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('checklistItemId', checklistItemId);
      if (applicationId) formData.append('applicationId', applicationId);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Success!
      setUploadId(result.id);
      setDownloadUrl(result.downloadUrl);
      setUploadState('idle');
      setAiStatus('none');
      setConfidenceScore(null);
      setAiFeedback(null);
      setIsDocument(null);
    } catch (err: any) {
      console.error('[upload] Error:', err);
      setUploadState('error');
      setUploadError(err.message || 'Upload failed');
    }
  }, [checklistItemId]);

  // ─── AI Check Handler ───────────────────────────────────────────────────

  const handleAICheck = useCallback(async () => {
    if (!uploadId) return;

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      setAiStatus('queued');
      setConfidenceScore(null);
      setAiFeedback(null);

      // Start polling IMMEDIATELY (don't wait for the endpoint)
      startPolling(uploadId, token);

      // Fire the AI check — endpoint awaits pipeline completion
      // Meanwhile, polling picks up status changes from DB
      // When fetch completes, do a final status check as safety net
      fetch(`/api/documents/${uploadId}/ai-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        // Handle premium-required error
        if (response.status === 403) {
          console.log('[ai-check] Premium required');
          setAiStatus('none');
          setUploadError('Premium tier required for AI Check');
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          onUpgradeClick?.();
          return;
        }

        if (!response.ok) {
          console.error('[ai-check] Endpoint error:', response.status);
          setAiStatus('failed');
          setUploadError('AI analysis failed. Please try again.');
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          return;
        }

        const result = await response.json();
        console.log('[ai-check] Endpoint returned:', result);
        
        // Safety net: fetch final status after pipeline completes
        // In case polling missed the terminal state
        try {
          const statusRes = await fetch(`/api/documents/${uploadId}/status`, { cache: 'no-store' });
          if (statusRes.ok) {
            const statusData: DocumentStatusResponse = await statusRes.json();
            console.log('[ai-check] Final status:', statusData.aiStatus);
            
            if (statusData.aiStatus === 'complete' || statusData.aiStatus === 'failed') {
              // Stop polling if still running
              if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
              }
              setAiStatus(statusData.aiStatus);
              setConfidenceScore(statusData.confidenceScore);
              setAiFeedback(statusData.scoringFeedback || statusData.classificationFeedback);
              setIsDocument(statusData.isDocument);
              onAIComplete?.(statusData);
            }
          }
        } catch (statusErr) {
          console.warn('[ai-check] Final status check failed:', statusErr);
        }
      }).catch((err) => {
        console.error('[ai-check] Fetch error:', err);
        setAiStatus('failed');
        setAiFeedback('AI check failed. Please try again.');
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      });
    } catch (err: any) {
      console.error('[ai-check] Error:', err);
      setAiStatus('failed');
      setAiFeedback(err.message || 'AI check failed');
    }
  }, [uploadId, isPremium, startPolling]);

  // ─── Download Handler ───────────────────────────────────────────────────

  const handleDownload = useCallback(async () => {
    if (!downloadUrl) return;

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(downloadUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'document';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[download] Error:', err);
    }
  }, [downloadUrl, fileName]);

  // ─── Remove Handler ─────────────────────────────────────────────────────

  const handleRemove = useCallback(async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    
    // Delete from database (not just local state!)
    if (uploadId) {
      try {
        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        if (!token) {
          console.error('[remove] No auth token available');
          return;
        }
        
        const response = await fetch(`/api/documents/${uploadId}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          console.error('[remove] Failed to delete document:', response.status);
          // Still clear local state even if DB delete fails
        } else {
          console.log(`[remove] Document ${uploadId} deleted from database`);
        }
      } catch (err) {
        console.error('[remove] Error deleting document:', err);
      }
    }
    
    // Clear local state
    setUploadId(null);
    setFileName(null);
    setDownloadUrl(null);
    setUploadState('idle');
    setUploadError(null);
    setAiStatus('none');
    setConfidenceScore(null);
    setAiFeedback(null);
    setIsDocument(null);
  }, [uploadId]);

  // ─── Confidence Display ─────────────────────────────────────────────────

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', emoji: '🟢' };
    if (score >= 40) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', emoji: '🟡' };
    return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', emoji: '🔴' };
  };

  // ─── AI Status Label ───────────────────────────────────────────────────

  const getAIStatusLabel = (): string => {
    switch (aiStatus) {
      case 'queued': return '⏳ Queued, waiting for analysis...';
      case 'classifying': return '🔍 Classifying document (step 1/2)...';
      case 'analyzing': return '✓ Analyzing requirements (step 2/2)...';
      case 'complete': return confidenceScore !== null ? `${confidenceScore}%` : 'Complete';
      case 'failed': return 'Analysis failed';
      default: return '';
    }
  };

  // ─── Locked State ───────────────────────────────────────────────────────

  if (locked) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <Lock className="w-3.5 h-3.5" />
        <span>Unlock to upload documents</span>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────

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
        {/* ─── NO FILE UPLOADED ─── */}
        {!hasSavedFile && uploadState !== 'uploading' && uploadState !== 'error' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleUpload(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
              ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3 flex-1">
              <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">Upload Document</p>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                      <Sparkles className="w-3 h-3" />
                      AI Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or PDF • Max 5MB</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── UPLOADING ─── */}
        {uploadState === 'uploading' && (
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
                {fileName && <p className="text-xs text-blue-600 truncate mt-0.5">{fileName}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── UPLOAD ERROR ─── */}
        {uploadState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="border-2 border-red-200 rounded-xl p-4 bg-red-50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">Upload Failed</p>
                {uploadError && <p className="text-xs text-red-700 mt-1">{uploadError}</p>}
              </div>
            </div>
            <button
              onClick={() => { setUploadState('idle'); setUploadError(null); fileInputRef.current?.click(); }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-semibold rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </motion.div>
        )}

        {/* ─── FILE SAVED (Main State) ─── */}
        {hasSavedFile && uploadState !== 'uploading' && uploadState !== 'error' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`border-2 rounded-xl p-4 relative overflow-hidden ${
              aiStatus === 'complete' && confidenceScore !== null && confidenceScore >= 70
                ? 'border-emerald-200 bg-emerald-50'
                : aiStatus === 'complete' && confidenceScore !== null && confidenceScore < 40
                ? 'border-red-200 bg-red-50'
                : aiStatus === 'complete' && isDocument === false
                ? 'border-red-200 bg-red-50'
                : aiStatus === 'failed'
                ? 'border-amber-200 bg-amber-50'
                : isAIRunning
                ? 'border-violet-200 bg-violet-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {showConfetti && <ConfettiBurst active={true} />}

            {/* File info row */}
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {/* Filename — always prominent */}
                <p className="text-sm font-semibold text-gray-900 truncate">
                  📎 {fileName || 'Document'}
                </p>

                {/* Status line */}
                {aiStatus === 'none' && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">✅ Uploaded & saved</p>
                )}

                {isAIRunning && (
                  <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg bg-violet-100 border border-violet-300">
                    <Loader2 className="w-4 h-4 text-violet-700 animate-spin flex-shrink-0" />
                    <span className={`text-sm font-semibold ${
                      aiStatus === 'analyzing' ? 'text-violet-900' : 'text-violet-800'
                    }`}>
                      {getAIStatusLabel()}
                    </span>
                    <span className="text-xs text-violet-600 ml-auto">(polling...)</span>
                  </div>
                )}

                {aiStatus === 'complete' && confidenceScore !== null && isDocument !== false && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold ${getConfidenceColor(confidenceScore).text}`}>
                      {confidenceScore}% {getConfidenceColor(confidenceScore).emoji}
                    </span>
                  </div>
                )}

                {aiStatus === 'complete' && isDocument === false && (
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    ❌ This doesn't appear to be a valid document
                  </p>
                )}

                {aiStatus === 'failed' && (
                  <p className="text-xs text-amber-700 mt-1">
                    ⚠️ {aiFeedback || 'Analysis failed. Document is saved.'}
                  </p>
                )}

                {aiStatus === 'complete' && aiFeedback && isDocument !== false && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{aiFeedback}</p>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={handleRemove}
                className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors flex-shrink-0"
                title="Remove"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Download button — always visible */}
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
              >
                <Download className="w-3 h-3" /> Download
              </button>

              {/* Replace button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition"
              >
                <RefreshCw className="w-3 h-3" /> Replace
              </button>

              {/* AI Ready Check button (Premium) */}
              {isPremium ? (
                <button
                  onClick={handleAICheck}
                  disabled={isAIRunning}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                    isAIRunning
                      ? 'bg-violet-100 text-violet-600 border-violet-200 cursor-wait'
                      : aiStatus === 'complete'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
                  }`}
                >
                  {isAIRunning ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3 h-3" />
                  )}
                  {isAIRunning ? getAIStatusLabel() : aiStatus === 'complete' ? 'Re-check' : 'AI Ready Check'}
                </button>
              ) : (
                <button
                  onClick={onUpgradeClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition"
                >
                  <Lock className="w-3 h-3" />
                  <Sparkles className="w-3 h-3" />
                  AI Ready Check
                </button>
              )}

              {/* View Report — only when AI complete */}
              {aiStatus === 'complete' && confidenceScore !== null && onViewReport && (
                <button
                  onClick={onViewReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
                >
                  <ClipboardList className="w-3 h-3" /> View Report
                </button>
              )}

              {/* Download Report PDF — only when AI complete */}
              {aiStatus === 'complete' && confidenceScore !== null && onDownloadReport && (
                <button
                  onClick={onDownloadReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition"
                >
                  <FileDown className="w-3 h-3" /> Download Report
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
