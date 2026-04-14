'use client';

import { useState } from 'react';
import { Download, Lock } from 'lucide-react';

interface GetTemplateButtonProps {
  itemTitle: string;
  templateFilename?: string;
  isPremium: boolean;
  onUnlock?: () => void;
}

export default function GetTemplateButton({
  itemTitle,
  templateFilename,
  isPremium,
  onUnlock,
}: GetTemplateButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!templateFilename) {
    return null; // No template for this item
  }

  if (!isPremium) {
    return (
      <button
        onClick={onUnlock}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
        title="Unlock Premium to download templates"
      >
        <Lock className="w-3.5 h-3.5" />
        Template
      </button>
    );
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/templates/${templateFilename}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = templateFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert(`Failed to download template for: ${itemTitle}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        isDownloading
          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
          : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
      }`}
      title={`Download template: ${itemTitle}`}
    >
      <Download className="w-3.5 h-3.5" />
      {isDownloading ? 'Downloading...' : 'Template'}
    </button>
  );
}
