'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

interface LockedFeatureOverlayProps {
  feature: 'ai-checker' | 'templates';
  onClose: () => void;
}

export default function LockedFeatureOverlay({ feature, onClose }: LockedFeatureOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        {feature === 'ai-checker' && (
          <div>
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Want us to check this document with AI?
            </h2>
            <p className="text-slate-700 text-sm mb-6">
              Unlock AI document checking to reduce the risk of missing or incorrect evidence before you submit.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all"
              >
                Upgrade to VisaBud Premium — £9.99
              </Link>
              <button
                onClick={onClose}
                className="block w-full text-center border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-2.5 rounded-lg transition-all"
              >
                Continue Free
              </button>
            </div>
          </div>
        )}

        {feature === 'templates' && (
          <div>
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Need help preparing this document?
            </h2>
            <p className="text-slate-700 text-sm mb-6">
              Unlock templates and guidance to ensure your document meets visa requirements.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all"
              >
                Upgrade to VisaBud Premium — £9.99
              </Link>
              <button
                onClick={onClose}
                className="block w-full text-center border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-2.5 rounded-lg transition-all"
              >
                Continue Free
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
