import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Apply for a UK Visa 2025: Step-by-Step Guide | VisaBud',
  description: 'A complete step-by-step guide to applying for a UK visa in 2025. From choosing the right visa type to biometrics, document submission, and getting your decision.',
};

const faqs = [
  {
    question: 'How do I start a UK visa application?',
    answer: 'Start by determining which visa type you need at GOV.UK. Then complete the online application form, pay the fees, book a biometrics appointment, gather your supporting documents, and submit everything through the designated visa application centre (VFS or TLS) in your country.',
  },
  {
    question: 'How long does a UK visa application take?',
    answer: 'Processing times vary by visa type: Visit visas take 3-6 weeks, Skilled Worker visas 3-8 weeks, Family/Spouse visas 12 weeks, and Student visas 3-6 weeks. Priority services can reduce these times significantly for an additional fee.',
  },
  {
    question: 'Can I apply for a UK visa online?',
    answer: 'Yes, all UK visa applications are now submitted online through GOV.UK. You complete the form online, pay fees online, and can upload most documents digitally. However, you still need to attend an in-person biometrics appointment.',
  },
  {
    question: 'What happens after I submit my UK visa application?',
    answer: 'After submission, UKVI processes your application. You may receive a request for additional documents. Once a decision is made, you will be notified by email and can collect your passport (with vignette, if approved) from the visa application centre.',
  },
  {
    question: 'Can I track my UK visa application?',
    answer: 'Yes, you can track your application through the VFS or TLS tracking system using the reference number provided when you submitted. Some visa categories also allow tracking through the UKVI online portal.',
  },
  {
    question: 'What if my UK visa application is refused?',
    answer: 'If refused, you will receive a refusal letter explaining the reasons. Depending on the visa type, you may have the right to appeal or request an administrative review. You can also reapply with a stronger application addressing the reasons for refusal.',
  },
];

const checklistPreview = [
  { text: 'Determine the correct visa type', critical: true },
  { text: 'Valid passport (6+ months validity)', critical: true },
  { text: 'Complete online application form', critical: true },
  { text: 'Pay application fee + IHS surcharge', critical: true },
  { text: 'Book biometrics appointment', critical: false },
  { text: 'Gather supporting documents', critical: false },
  { text: 'Attend biometrics', critical: false },
  { text: 'Upload/submit documents', critical: false },
];

const relatedGuides = [
  { title: 'UK Spouse Visa Checklist 2025', href: '/visa-guides/spouse-visa-checklist-2025' },
  { title: 'Skilled Worker Visa Documents', href: '/visa-guides/skilled-worker-visa-documents' },
  { title: 'UK Visa Processing Times', href: '/visa-guides/uk-visa-processing-times' },
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'Common Visa Rejection Reasons', href: '/visa-guides/common-visa-rejection-reasons' },
];

export default function HowToApplyUKVisa() {
  return (
    <GuideLayout
      title="How to Apply for a UK Visa: Complete Step-by-Step Guide (2025)"
      subtitle="The definitive walkthrough for anyone applying for a UK visa — from choosing the right category to receiving your decision. Every step explained clearly."
      lastUpdated="April 2025"
      readTime="13 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        Applying for a <strong>UK visa</strong> can feel overwhelming — there are dozens of visa types, complex rules, and the stakes are high. But the process itself follows a clear, repeatable structure regardless of which visa you&apos;re applying for.
      </p>
      <p>
        This guide walks you through the <strong>entire process from start to finish</strong>, covering every visa category. Whether you&apos;re joining your spouse, taking up a job offer, studying, or visiting — the core steps are the same.
      </p>

      <h2 id="step-1">Step 1: Determine Your Visa Type</h2>
      <p>
        The UK immigration system has dozens of visa categories. Choosing the right one is the most critical decision you&apos;ll make — applying under the wrong category means automatic refusal.
      </p>
      <p>The most common visa types:</p>
      <ul>
        <li><strong>Standard Visitor Visa</strong> — for tourism, business visits, or short medical treatment (up to 6 months).</li>
        <li><strong>Skilled Worker Visa</strong> — for employment with a UK sponsor. See our <Link href="/visa-guides/skilled-worker-visa-documents" className="text-blue-600">Skilled Worker guide</Link>.</li>
        <li><strong>Family Visa (Spouse/Partner)</strong> — for joining your partner/spouse in the UK. See our <Link href="/visa-guides/spouse-visa-checklist-2025" className="text-blue-600">Spouse Visa checklist</Link>.</li>
        <li><strong>Student Visa</strong> — for studying at a UK institution with a confirmed offer (CAS).</li>
        <li><strong>Graduate Visa</strong> — for staying in the UK after completing a degree (2-3 years).</li>
        <li><strong>Global Talent Visa</strong> — for leaders and emerging talent in science, engineering, arts, and digital technology.</li>
        <li><strong>Innovator Founder Visa</strong> — for setting up a business in the UK.</li>
        <li><strong>Health and Care Worker Visa</strong> — a sub-category of Skilled Worker with reduced fees for NHS and care workers.</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-amber-800 font-medium">⚡ Not sure which visa you need?</p>
        <p className="text-sm text-amber-700 mt-1">Our free wizard helps you identify the right visa type and generates a personalised document checklist in 3 minutes.</p>
        <Link href="/app/start" className="inline-block mt-2 text-sm font-semibold text-amber-900 hover:underline">Start the wizard →</Link>
      </div>

      <h2 id="step-2">Step 2: Check Eligibility</h2>
      <p>Each visa type has specific eligibility criteria. Common requirements across most visa types include:</p>
      <ul>
        <li><strong>Valid passport</strong> — with at least 6 months validity remaining.</li>
        <li><strong>Financial requirement</strong> — proof you can support yourself (varies by visa type).</li>
        <li><strong>English language</strong> — required for most long-term visas (not visitor visas).</li>
        <li><strong>No immigration breaches</strong> — previous overstays or refusals can affect eligibility.</li>
        <li><strong>TB test</strong> — required if applying from <Link href="/visa-guides/tb-test-requirements-by-country" className="text-blue-600">certain countries</Link>.</li>
      </ul>
      <p>GOV.UK has an eligibility checker tool, but our <Link href="/app/start" className="text-blue-600">free wizard</Link> gives you a more detailed, personalised assessment.</p>

      <h2 id="step-3">Step 3: Gather Your Documents</h2>
      <p>
        Document preparation is where applications succeed or fail. <strong>Start gathering documents at least 4-8 weeks before you plan to apply.</strong> Some documents (like criminal record certificates) can take months.
      </p>
      <p>Universal documents (needed for almost every visa type):</p>
      <ul>
        <li><strong>Current passport</strong> — and any previous passports with UK stamps.</li>
        <li><strong>Passport photographs</strong> — 2 photos, 45mm × 35mm, recent.</li>
        <li><strong>Financial evidence</strong> — bank statements, payslips, or employer letters.</li>
        <li><strong>TB test certificate</strong> — if applicable to your country.</li>
        <li><strong>Proof of English</strong> — test certificate, degree, or exemption (for long-term visas).</li>
      </ul>
      <p>Visa-specific documents:</p>
      <ul>
        <li><strong>Spouse visa:</strong> Marriage certificate, relationship evidence, sponsor&apos;s financial documents.</li>
        <li><strong>Skilled Worker:</strong> Certificate of Sponsorship, qualifications, criminal record certificate.</li>
        <li><strong>Student visa:</strong> CAS number, proof of course fees paid, ATAS certificate (if applicable).</li>
        <li><strong>Visitor visa:</strong> Travel itinerary, accommodation booking, ties to home country.</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-blue-800 font-medium">💡 Pro tip</p>
        <p className="text-sm text-blue-700 mt-1">All documents not in English or Welsh must be accompanied by a certified translation. Use a professional translation service — translations by friends or family are not accepted.</p>
      </div>

      <h2 id="step-4">Step 4: Complete the Online Application</h2>
      <p>All UK visa applications are now submitted online through GOV.UK. Here&apos;s what to expect:</p>
      <ol>
        <li><strong>Create an account</strong> on the UKVI online portal.</li>
        <li><strong>Select your visa type</strong> — be careful to choose the exact right category.</li>
        <li><strong>Fill in the application form</strong> — this takes 30-60 minutes. You can save and return.</li>
        <li><strong>Answer all questions honestly</strong> — inconsistencies between your form and documents will raise red flags.</li>
        <li><strong>Review everything</strong> — check names, dates, and reference numbers against your documents.</li>
      </ol>
      <p><strong>Key information you&apos;ll need:</strong></p>
      <ul>
        <li>Full travel history for the past 10 years</li>
        <li>Employment history for the past 10 years</li>
        <li>Details of any previous visa applications or refusals</li>
        <li>Your sponsor&apos;s details (for family and work visas)</li>
        <li>Your CoS or CAS reference number (for work and student visas)</li>
      </ul>

      <h2 id="step-5">Step 5: Pay the Fees</h2>
      <p>
        UK visa fees vary significantly by visa type. You&apos;ll typically pay two components:
      </p>
      <ul>
        <li><strong>Application fee</strong> — the main visa fee (£100 to £1,846 depending on type).</li>
        <li><strong>Immigration Health Surcharge (IHS)</strong> — £1,035 per year for most applicants, £776 per year for students and under-18s. This gives you access to NHS healthcare.</li>
      </ul>
      <p>
        Payment is made online by debit or credit card when you submit your application. For a complete breakdown, see our <Link href="/visa-guides/uk-visa-fees-costs" className="text-blue-600">UK visa fees guide</Link>.
      </p>

      <h2 id="step-6">Step 6: Book and Attend Biometrics</h2>
      <p>
        After paying, you&apos;ll be directed to book a <strong>biometrics appointment</strong> at a Visa Application Centre (VAC) near you. These are run by VFS Global or TLS Contact, depending on your country.
      </p>
      <p>At the appointment:</p>
      <ul>
        <li>Your <strong>fingerprints</strong> will be taken (all 10 fingers).</li>
        <li>A <strong>digital photograph</strong> will be taken.</li>
        <li>You may submit physical documents or be asked to upload them digitally.</li>
        <li>Bring your <strong>passport</strong>, <strong>appointment confirmation</strong>, and <strong>application reference</strong>.</li>
      </ul>
      <p>
        <strong>Timing:</strong> You must attend biometrics within <strong>90 days</strong> of submitting your online application. Book early — popular centres fill up fast.
      </p>

      <h2 id="step-7">Step 7: Submit Your Supporting Documents</h2>
      <p>
        Depending on your country and visa type, you&apos;ll either upload documents through the online portal or submit physical copies at the VAC. Increasingly, the process is going fully digital.
      </p>
      <p>Document submission tips:</p>
      <ul>
        <li><strong>Organise documents in order</strong> — match them to the sections of your application form.</li>
        <li><strong>Use a cover sheet</strong> — a single page listing every document you&apos;re submitting, with reference numbers.</li>
        <li><strong>Scan clearly</strong> — if uploading, ensure documents are legible, right-side up, and complete.</li>
        <li><strong>Don&apos;t send originals unless required</strong> — for digital submission, scans/photos are fine.</li>
        <li><strong>Include translations</strong> — paired with the original document they translate.</li>
      </ul>

      <h2 id="step-8">Step 8: Wait for Your Decision</h2>
      <p>
        After submission, your application enters the processing queue. For current processing times by visa type, see our <Link href="/visa-guides/uk-visa-processing-times" className="text-blue-600">processing times guide</Link>.
      </p>
      <p>During this period:</p>
      <ul>
        <li><strong>Don&apos;t panic</strong> — processing times are targets, not guarantees. Many applications take longer.</li>
        <li><strong>Check your email regularly</strong> — UKVI may request additional documents.</li>
        <li><strong>Don&apos;t contact UKVI repeatedly</strong> — excessive enquiries don&apos;t speed up your application.</li>
        <li><strong>Track your application</strong> — use the VFS/TLS tracking portal with your reference number.</li>
      </ul>
      <p>
        <strong>If you&apos;re called for an interview:</strong> This is more common for visit visas and spouse visas. See our <Link href="/visa-guides/uk-visa-interview-preparation" className="text-blue-600">interview preparation guide</Link>.
      </p>

      <h2 id="step-9">Step 9: Receive Your Decision</h2>
      <p>You&apos;ll be notified of the decision by email. If <strong>approved</strong>:</p>
      <ul>
        <li>Collect your passport from the VAC (it will contain a <strong>vignette sticker</strong> — your entry clearance).</li>
        <li>For long-term visas: the vignette is valid for <strong>90 days</strong>. You must enter the UK within this window.</li>
        <li>After arrival, collect your <strong>BRP card</strong> from the designated Post Office within 10 days.</li>
      </ul>
      <p>If <strong>refused</strong>:</p>
      <ul>
        <li>Read the refusal letter carefully — it explains the specific reasons.</li>
        <li>Consider your options: <strong>administrative review</strong>, <strong>appeal</strong>, or <strong>reapplication</strong>.</li>
        <li>Address every reason for refusal before reapplying.</li>
        <li>See our guide on <Link href="/visa-guides/common-visa-rejection-reasons" className="text-blue-600">common visa rejection reasons</Link> for prevention strategies.</li>
      </ul>

      <h2 id="tips">Top Tips for a Successful Application</h2>
      <ol>
        <li><strong>Apply early</strong> — don&apos;t wait until the last minute. Allow buffer time for delays.</li>
        <li><strong>Be honest</strong> — any deception (even omission) can result in a 10-year ban.</li>
        <li><strong>Over-document, don&apos;t under-document</strong> — it&apos;s better to provide too much evidence than too little.</li>
        <li><strong>Follow the specification exactly</strong> — if they ask for 6 months of bank statements, provide 6 months. Not 5.</li>
        <li><strong>Keep copies of everything</strong> — before submitting, scan or photograph every document.</li>
        <li><strong>Don&apos;t use a template cover letter</strong> — caseworkers see thousands of applications. A genuine, specific cover letter stands out.</li>
        <li><strong>Check the latest rules</strong> — immigration rules change frequently. Verify everything against current GOV.UK guidance.</li>
      </ol>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Get Your Personalised Document Checklist</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Stop guessing what you need. Answer 5 quick questions about your situation and get a complete, personalised checklist — tailored to your visa type, nationality, and circumstances.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Generate My Free Checklist
        </Link>
      </div>
    </GuideLayout>
  );
}
