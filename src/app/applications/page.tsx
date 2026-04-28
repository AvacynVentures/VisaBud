'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthGate from '@/components/AuthGate';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Plus, FileText, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { PageFadeIn } from '@/lib/animations';
import type { ApplicationSummary } from '@/lib/application-types';
import { VISA_TYPE_CONFIG, TIER_CONFIG } from '@/lib/application-types';

function ApplicationsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const response = await fetch('/api/applications', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error('[Applications] Failed to load:', err);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">V</span>
              </div>
              <span className="font-bold text-blue-900 tracking-tight text-lg">VisaBud</span>
            </Link>
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hey {firstName} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {applications.length === 0
              ? "Ready to start your UK visa journey? Let's go."
              : 'Your visa applications'
            }
          </p>
        </div>

        {/* Application Cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing applications */}
            {applications.map((app, i) => {
              const config = VISA_TYPE_CONFIG[app.visaType];
              const tier = TIER_CONFIG[app.purchasedTier];
              const progress = app.checklistTotal > 0
                ? Math.round((app.checklistCompleted / app.checklistTotal) * 100)
                : 0;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => router.push(`/dashboard?app=${app.id}`)}
                    className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    {/* Visa type + tier badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
                          <p className="text-xs text-gray-500">{config.label}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        app.purchasedTier === 'premium'
                          ? 'bg-emerald-100 text-emerald-700'
                          : app.purchasedTier === 'standard'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tier.badge}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{app.checklistCompleted}/{app.checklistTotal} documents</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {app.documentCount} uploaded
                      </span>
                      {app.purchasedTier === 'premium' && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Sparkles className="w-3 h-3" />
                          AI enabled
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-900 transition">
                        Continue
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                </motion.div>
              );
            })}

            {/* New Application Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: applications.length * 0.08 }}
            >
              <button
                onClick={() => router.push('/app/start')}
                className="w-full h-full min-h-[200px] text-left bg-white rounded-2xl border-2 border-dashed border-gray-300 p-5 hover:border-blue-400 hover:bg-blue-50/30 transition-all group flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-sm">New Application</p>
                  <p className="text-xs text-gray-500 mt-1">Start a new visa application</p>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Empty state message */}
          {applications.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                No applications yet. Click "New Application" to get started with your visa journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageFadeIn>
  );
}

export default function ApplicationsPage() {
  return (
    <AuthGate>
      <ApplicationsContent />
    </AuthGate>
  );
}
