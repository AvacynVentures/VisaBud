'use client';

/**
 * UploadContext — Isolated upload state
 * Prevents race conditions between upload flow and auth state updates
 * (Fix #2: Isolate upload state from shared auth context)
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UploadStatus = 'idle' | 'uploading' | 'validating' | 'valid' | 'invalid' | 'error';

export interface DocumentUploadState {
  status: UploadStatus;
  feedback: string | null;
  fileName: string | null;
  fileData?: string | null; // base64
  mimeType?: string | null;
}

interface UploadContextType {
  documentUploads: Record<string, DocumentUploadState>;
  setDocumentUpload: (docId: string, state: Partial<DocumentUploadState>) => void;
  clearDocumentUpload: (docId: string) => void;
  clearAllUploads: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<Record<string, DocumentUploadState>>({});

  const setDocumentUpload = useCallback((docId: string, state: Partial<DocumentUploadState>) => {
    setUploads((prev) => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || { status: 'idle' as UploadStatus, feedback: null, fileName: null }),
        ...state,
      },
    }));
  }, []);

  const clearDocumentUpload = useCallback((docId: string) => {
    setUploads((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  }, []);

  const clearAllUploads = useCallback(() => {
    setUploads({});
  }, []);

  return (
    <UploadContext.Provider value={{ documentUploads: uploads, setDocumentUpload, clearDocumentUpload, clearAllUploads }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within UploadProvider');
  }
  return context;
}
