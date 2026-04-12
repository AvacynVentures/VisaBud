import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About VisaBud | UK Visa Guidance',
  description: 'Learn about VisaBud and how we help UK visa applicants.',
};

export default function AboutPage() {
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
        <h1 className="text-3xl font-bold text-blue-900 mb-2">About VisaBud</h1>
        <p className="text-lg text-gray-600 mb-12">
          Helping UK visa applicants navigate the complex Home Office process with clarity and confidence.
        </p>

        <div className="space-y-8">
          {/* Mission */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The UK visa application process is stressful, confusing, and high-stakes. Applicants spend weeks deciphering Home Office jargon, worrying about missing documents, and wondering if they'll be refused.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>VisaBud cuts through the noise.</strong> In 3 minutes, you answer simple questions about your situation. We instantly generate:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
              <li>A personalised checklist of exactly which documents you need</li>
              <li>A week-by-week timeline showing when to do each step</li>
              <li>Risk alerts so you know exactly what could go wrong — and how to fix it</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              No jargon. No guessing. Just the information you actually need.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">How VisaBud Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Answer 5 Quick Questions</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Visa type, nationality, location, income, timeline. Nothing invasive.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Get Your Personalised Plan</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Checklist, timeline, risks, and all Gov.uk links — built in seconds.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Unlock Full Access (£50)</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Download a PDF pack, get submission links, and access all resources forever.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700 text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Submit with Confidence</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Follow your timeline, tick off your checklist, and submit knowing you've got it right.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Privacy */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Your Data Is Private</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We don't sell your data. We don't share it with immigration consultants. We encrypt everything and follow GDPR regulations.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>All data encrypted in transit and at rest</li>
              <li>Hosted on secure, GDPR-compliant servers</li>
              <li>You can delete your account anytime</li>
              <li>See our <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link> for full details</li>
            </ul>
          </section>

          {/* The Team */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">The Team</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              VisaBud is built by people who understand immigration anxiety. Our team includes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800">Ruan Van Vuuren</h3>
                <p className="text-sm text-gray-600">Founder & Strategy</p>
                <p className="text-sm text-gray-700 mt-2">
                  Supply chain consultant and venture builder. Obsessed with clarity and execution.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Chris</h3>
                <p className="text-sm text-gray-600">Product & UX Design</p>
                <p className="text-sm text-gray-700 mt-2">
                  Designed VisaBud's intuitive flow and risk engine. Every interaction counts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tim Vorster</h3>
                <p className="text-sm text-gray-600">Engineering & Deployment</p>
                <p className="text-sm text-gray-700 mt-2">
                  Built VisaBud's backend, Stripe integration, and production infrastructure.
                </p>
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Legal & Compliance</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-900 font-semibold text-sm mb-2">
                ⚠️ VisaBud is NOT a Legal Service
              </p>
              <p className="text-sm text-amber-800">
                We provide educational guidance based on official Gov.uk information, but we are not lawyers. Always verify all information with the <a href="https://www.gov.uk/visas-immigration" className="underline font-semibold">UK Home Office website</a> before submitting your application.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
              <li>See our <Link href="/terms" className="text-blue-600 underline">Terms of Service</Link> for full legal information</li>
              <li>Questions about immigration law? Contact a qualified immigration solicitor</li>
              <li>Always verify with Gov.uk before submitting any application</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Have a question? Spotted an error? Want to collaborate?
            </p>
            <a
              href="mailto:hello@visabud.co.uk"
              className="inline-block px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition"
            >
              Email Us: hello@visabud.co.uk
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
