import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | VisaBud',
  description: 'Our commitment to protecting your data and privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
              <span className="text-white text-sm">V</span>
            </div>
            <span className="font-bold text-blue-900">VisaBud</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
          {/* What We Collect */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">What Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                When you use VisaBud, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Email address</strong> — to create and manage your account</li>
                <li><strong>Visa type, nationality, income, location</strong> — your wizard answers for personalization</li>
                <li><strong>Document metadata</strong> — filenames of documents you upload (not the files themselves)</li>
                <li><strong>Payment information</strong> — processed securely via Stripe (we don't store card details)</li>
                <li><strong>Usage data</strong> — which pages you visit, how long you spend on each section</li>
              </ul>
            </div>
          </section>

          {/* How We Use It */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">How We Use Your Information</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>To generate your personalised visa checklist, timeline, and risk assessment</li>
                <li>To send you email confirmations of your account and purchases</li>
                <li>To improve VisaBud (analyse which visa types are most used, etc.)</li>
                <li>To detect and prevent fraud or security breaches</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Data Security & Encryption</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We take your privacy seriously:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All data is encrypted in transit (HTTPS/TLS)</li>
                <li>All data is encrypted at rest (AES-256)</li>
                <li>We use Supabase, a secure PostgreSQL provider, for data storage</li>
                <li>Payment information is processed exclusively via Stripe (PCI DSS Level 1 compliant)</li>
                <li>We never store your payment card details</li>
              </ul>
            </div>
          </section>

          {/* Your Rights (GDPR) */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Your Rights (GDPR)</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you're in the EU, UK, or other GDPR-covered regions, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access</strong> — request a copy of all data we hold about you</li>
                <li><strong>Correction</strong> — correct inaccurate or incomplete data</li>
                <li><strong>Deletion</strong> — request deletion of your account and data (right to be forgotten)</li>
                <li><strong>Portability</strong> — receive your data in a portable format</li>
                <li><strong>Object</strong> — object to certain types of processing</li>
              </ul>
              <p>
                To exercise any of these rights, email <strong>hello@visabud.co.uk</strong> with your request. We'll respond within 30 days.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Data Retention</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Your account data is retained for as long as your account is active</li>
                <li>If you request deletion, we remove all personal data within 30 days</li>
                <li>Payment records are retained for 7 years (required by UK tax law)</li>
                <li>We may retain anonymised, non-personal data for analytics</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Cookies & Tracking</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>We use <strong>session cookies</strong> to keep you logged in</li>
                <li>We use <strong>analytics cookies</strong> (from Vercel/Supabase) to understand how users interact with VisaBud</li>
                <li>You can disable cookies in your browser, though this may affect functionality</li>
              </ul>
            </div>
          </section>

          {/* Third Parties */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Third-Party Services</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Supabase</strong> (PostgreSQL hosting) — <a href="https://supabase.com/privacy" className="text-blue-600 underline">Privacy Policy</a></li>
                <li><strong>Stripe</strong> (payment processing) — <a href="https://stripe.com/privacy" className="text-blue-600 underline">Privacy Policy</a></li>
                <li><strong>Vercel</strong> (application hosting) — <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 underline">Privacy Policy</a></li>
              </ul>
              <p>
                These services may collect usage data as described in their own privacy policies. We recommend reviewing them.
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Changes to This Policy</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this privacy policy from time to time. We'll notify you by email if there are significant changes. Continued use of VisaBud after updates means you accept the new policy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have questions about this privacy policy or our data practices:
              </p>
              <p>
                Email: <strong>hello@visabud.co.uk</strong>
              </p>
              <p>
                We'll respond within 7 business days.
              </p>
            </div>
          </section>

          {/* Gov.uk Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> VisaBud is not a legal service. Always verify information with the <a href="https://www.gov.uk/visas-immigration" className="underline font-semibold">UK Home Office website</a> before submitting an application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
