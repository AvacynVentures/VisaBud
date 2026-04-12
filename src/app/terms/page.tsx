import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | VisaBud',
  description: 'Terms and conditions for using VisaBud.',
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
          {/* Key Terms */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Key Terms</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-amber-900 mb-2">⚠️ VisaBud is NOT a Legal Service</p>
                <p>
                  VisaBud provides educational guidance based on official UK Home Office information. We are <strong>not</strong> lawyers, and using VisaBud does not create a legal relationship or provide legal advice. Always verify all information with the <a href="https://www.gov.uk/visas-immigration" className="underline text-amber-700">UK Home Office website</a> before submitting an application.
                </p>
              </div>
            </div>
          </section>

          {/* Payment & Refunds */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Payment & Refunds</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Price:</strong> The VisaBud Full Pack costs £50.00 GBP (one-time payment)</li>
                <li><strong>Payment Method:</strong> Stripe secure payment processing (card, Apple Pay, Google Pay, etc.)</li>
                <li><strong>No Subscription:</strong> This is a one-time purchase, not a recurring subscription</li>
                <li><strong>Refunds:</strong> Refunds are available within 14 days of purchase if you have not downloaded the full pack. After download, refunds are not available unless the service is materially broken</li>
                <li><strong>Cancellation:</strong> You can request a cancellation/refund by emailing <strong>hello@visabud.co.uk</strong></li>
              </ul>
            </div>
          </section>

          {/* Liability Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Limitation of Liability</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>VisaBud is provided "as-is" without warranty.</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not guarantee that using VisaBud will result in a successful visa application</li>
                <li>We are not responsible for visa refusals, delays, or any immigration decisions made by the UK Home Office</li>
                <li>We are not liable for errors, omissions, or inaccuracies in our guidance</li>
                <li>We are not liable for lost income, time, or emotional distress resulting from visa application outcomes</li>
                <li>The maximum liability of VisaBud is limited to the amount you paid (£50)</li>
              </ul>
            </div>
          </section>

          {/* Accuracy & Updates */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Accuracy & Immigration Rule Changes</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>We make reasonable efforts to keep VisaBud current with UK Home Office rules</li>
                <li>Immigration rules change frequently. Always verify requirements on <a href="https://www.gov.uk/visas-immigration" className="text-blue-600 underline">Gov.uk</a></li>
                <li>We update VisaBud as needed, but cannot guarantee real-time accuracy</li>
                <li>You are responsible for confirming all information with official sources before submitting</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Acceptable Use</h2>
            <div className="space-y-4 text-gray-700">
              <p>You agree to use VisaBud only for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your own personal visa application preparation</li>
                <li>Non-commercial purposes only</li>
              </ul>
              <p>You agree <strong>not</strong> to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Scrape, crawl, or automate access to VisaBud</li>
                <li>Reverse-engineer our code or attempt to steal our guidance</li>
                <li>Use VisaBud to provide consulting services to others without permission</li>
                <li>Upload viruses, malware, or other harmful content</li>
                <li>Share your account credentials with others</li>
              </ul>
            </div>
          </section>

          {/* Age Requirement */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Age Requirement</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be at least 18 years old to purchase and use VisaBud</li>
                <li>By purchasing, you confirm you are 18+ and legally entitled to make visa applications</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Intellectual Property</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>VisaBud, its name, logo, and all content are the property of VisaBud Ltd</li>
                <li>You may download and print your personal checklist for your own use only</li>
                <li>You may not reproduce, distribute, or commercially exploit VisaBud without permission</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Termination of Account</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>You can request account deletion at any time by emailing <strong>hello@visabud.co.uk</strong></li>
                <li>We reserve the right to suspend or terminate your account if you violate these terms</li>
                <li>Upon termination, your access to VisaBud is revoked, but you may request a copy of your data</li>
              </ul>
            </div>
          </section>

          {/* Changes to Service */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Changes to These Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update these terms at any time. Continued use of VisaBud means you accept the updated terms. We'll notify you of significant changes via email.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Questions or Issues?</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have questions about these terms, or need to report an issue:
              </p>
              <p>
                Email: <strong>hello@visabud.co.uk</strong>
              </p>
            </div>
          </section>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Summary:</strong> VisaBud is educational guidance, not legal advice. We're not liable for visa outcomes. Always verify with Gov.uk. Contact us at <strong>hello@visabud.co.uk</strong> with any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
