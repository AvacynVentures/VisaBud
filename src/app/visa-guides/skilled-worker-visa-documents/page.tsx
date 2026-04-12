import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Skilled Worker Visa Documents Needed 2025: Full List | VisaBud',
  description: 'Complete list of documents needed for a UK Skilled Worker visa in 2025. Certificate of Sponsorship, English language proof, financial evidence, and everything else you need to submit.',
};

const faqs = [
  {
    question: 'What documents do I need for a UK Skilled Worker visa?',
    answer: 'You need a valid Certificate of Sponsorship (CoS) from your employer, a valid passport, proof of English language ability (B1 level), proof of personal savings of at least £1,270 (unless your employer certifies maintenance), a criminal record certificate from any country you have lived in for 12+ months, and a TB test certificate if applying from a listed country.',
  },
  {
    question: 'What is a Certificate of Sponsorship (CoS)?',
    answer: 'A Certificate of Sponsorship is a digital reference number issued by your UK employer through the Sponsorship Management System (SMS). It contains details about the job, salary, and sponsor. It is not a physical document — you just need the reference number for your application.',
  },
  {
    question: 'How much money do I need in my bank account for a Skilled Worker visa?',
    answer: 'You need at least £1,270 in your bank account, held for at least 28 consecutive days. The 28-day period must end no more than 31 days before you submit your application. However, if your employer certifies maintenance on your CoS, you may not need to show this.',
  },
  {
    question: 'What level of English do I need for a Skilled Worker visa?',
    answer: 'You need English at CEFR level B1 (intermediate) in reading, writing, speaking, and listening. This is higher than the A1 required for spouse visas. You can prove it through an approved SELT test, a degree taught in English (confirmed by UK ENIC), or by being a national of a majority English-speaking country.',
  },
  {
    question: 'How long does a Skilled Worker visa take to process?',
    answer: 'Processing times are typically 3 weeks for applications from outside the UK and 8 weeks for switching within the UK. Priority services (5 working days) and super-priority services (next working day) are available for additional fees.',
  },
  {
    question: 'What is the minimum salary for a Skilled Worker visa in 2025?',
    answer: 'The general minimum salary threshold is £38,700 per year or the specific going rate for your occupation (whichever is higher). However, certain roles on the Immigration Salary List, new entrants, and specific occupations (like health and education) have lower thresholds.',
  },
];

const checklistPreview = [
  { text: 'Certificate of Sponsorship (CoS) reference number', critical: true },
  { text: 'Valid passport', critical: true },
  { text: 'English language proof (B1 CEFR)', critical: true },
  { text: 'Proof of funds (£1,270 for 28 days)', critical: true },
  { text: 'Criminal record certificate', critical: false },
  { text: 'TB test certificate (if applicable)', critical: false },
  { text: 'ATAS certificate (if applicable)', critical: false },
  { text: 'Qualifications and translations', critical: false },
];

const relatedGuides = [
  { title: 'How to Apply for a UK Visa', href: '/visa-guides/how-to-apply-uk-visa' },
  { title: 'UK Visa Processing Times', href: '/visa-guides/uk-visa-processing-times' },
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'TB Test Requirements by Country', href: '/visa-guides/tb-test-requirements-by-country' },
  { title: 'UK Visa Interview Preparation', href: '/visa-guides/uk-visa-interview-preparation' },
];

export default function SkilledWorkerVisaDocuments() {
  return (
    <GuideLayout
      title="Skilled Worker Visa Documents Needed: Complete 2025 List"
      subtitle="Every document your employer and you need to prepare for a successful UK Skilled Worker visa application. Updated for the April 2025 immigration rules."
      lastUpdated="April 2025"
      readTime="14 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        The <strong>UK Skilled Worker visa</strong> (which replaced the Tier 2 General visa) is the primary route for overseas workers to take up employment in the UK. It requires your employer to hold a valid sponsor licence and issue you a Certificate of Sponsorship (CoS).
      </p>
      <p>
        While your employer handles the sponsorship side, <strong>you</strong> are responsible for gathering and submitting the right personal documents. This guide covers everything you need — from both sides of the application.
      </p>

      <h2 id="cos">Certificate of Sponsorship (CoS)</h2>
      <p>
        The <strong>Certificate of Sponsorship</strong> is the cornerstone of your application. It&apos;s a virtual document — a reference number your employer assigns to you through the Home Office&apos;s Sponsorship Management System.
      </p>
      <p>Your CoS must contain:</p>
      <ul>
        <li><strong>Job title and SOC code</strong> — the occupation code that determines salary thresholds and eligibility.</li>
        <li><strong>Salary details</strong> — must meet the general threshold (£38,700) or the going rate for your occupation, whichever is higher.</li>
        <li><strong>Start date</strong> — your CoS must be used within 3 months of being assigned.</li>
        <li><strong>Sponsor details</strong> — your employer&apos;s sponsor licence number.</li>
        <li><strong>Working hours</strong> — confirming whether the role is full-time or part-time.</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-amber-800 font-medium">⚡ Time-sensitive</p>
        <p className="text-sm text-amber-700 mt-1">Your CoS is valid for 3 months. If you don&apos;t submit your application within this window, it expires and your employer must request a new one.</p>
      </div>

      <h2 id="personal-docs">Personal Documents</h2>
      <p>These are the documents <strong>you</strong> need to provide:</p>

      <h3>Identity and Travel</h3>
      <ul>
        <li><strong>Current valid passport</strong> — must have at least one blank page. Make sure it won&apos;t expire during your intended stay.</li>
        <li><strong>Previous passports</strong> — especially if they contain travel history to the UK or immigration stamps.</li>
        <li><strong>Passport-sized photographs</strong> — 2 photos, 45mm × 35mm, white background, taken within the last 6 months.</li>
        <li><strong>National ID card</strong> — if applicable to your nationality.</li>
      </ul>

      <h3>English Language Evidence</h3>
      <p>
        You must prove English at <strong>CEFR level B1</strong> (intermediate) in all four skills: reading, writing, speaking, and listening. Acceptable evidence includes:
      </p>
      <ul>
        <li><strong>IELTS for UKVI (Academic or General Training)</strong> — minimum 4.0 in each component. This is the most common test.</li>
        <li><strong>PTE Academic UKVI</strong> — Pearson Test of English, accepted since 2020.</li>
        <li><strong>LanguageCert</strong> — another approved SELT provider.</li>
        <li><strong>Degree taught in English</strong> — confirmed by UK ENIC as equivalent to a UK degree. You&apos;ll need the degree certificate and an ENIC statement of comparability.</li>
        <li><strong>Nationality exemption</strong> — citizens of majority English-speaking countries (USA, Canada, Australia, New Zealand, Ireland, etc.) are exempt.</li>
      </ul>

      <h3>Financial Evidence</h3>
      <p>
        You need to show you can support yourself when you arrive in the UK. The requirement is <strong>£1,270 held for 28 consecutive days</strong>, ending no more than 31 days before your application date.
      </p>
      <p>Acceptable evidence:</p>
      <ul>
        <li><strong>Personal bank statements</strong> — showing a balance of £1,270+ throughout the 28-day period. Statements must be from a recognised financial institution.</li>
        <li><strong>Building society passbook</strong></li>
        <li><strong>Letter from your bank</strong> — confirming the funds held, covering the 28-day period, on headed paper with your name and account number.</li>
      </ul>
      <p>
        <strong>Employer certification:</strong> If your employer has certified maintenance on your CoS (by ticking the relevant box in the SMS), you do not need to provide financial evidence. Most large employers do this as standard.
      </p>

      <h3>Criminal Record Certificate</h3>
      <p>
        You must provide a <strong>criminal record certificate</strong> from any country where you have lived for <strong>12 months or more</strong> (continuously or in total) in the 10 years before your application.
      </p>
      <p>This includes:</p>
      <ul>
        <li>Your home country</li>
        <li>Any country where you studied or worked for 12+ months</li>
        <li>The UK (if you&apos;re switching from another visa) — this is an ACRO certificate</li>
      </ul>
      <p>
        Processing times vary wildly by country — some take 2-3 weeks, others 3-6 months. <strong>Start this early.</strong>
      </p>

      <h3>TB Test Certificate</h3>
      <p>
        If you are applying from a <Link href="/visa-guides/tb-test-requirements-by-country" className="text-blue-600">country on the TB testing list</Link>, you need a valid TB test certificate from an approved clinic. The certificate is valid for <strong>6 months</strong> from the date of the test.
      </p>

      <h2 id="job-specific">Job-Specific Documents</h2>
      <p>Depending on your role, you may also need:</p>

      <h3>ATAS Certificate</h3>
      <p>
        An <strong>Academic Technology Approval Scheme (ATAS) certificate</strong> is required if your job involves research at PhD level or above in certain sensitive subjects (engineering, technology, science). Your employer should tell you if this applies. ATAS certificates are free but can take several weeks.
      </p>

      <h3>Professional Registration</h3>
      <p>For regulated professions, you need evidence of UK registration:</p>
      <ul>
        <li><strong>Doctors:</strong> GMC registration</li>
        <li><strong>Nurses:</strong> NMC registration or a decision letter</li>
        <li><strong>Engineers:</strong> Engineering Council registration (if required by the role)</li>
        <li><strong>Teachers:</strong> QTS or equivalent for teaching roles in schools</li>
        <li><strong>Solicitors/lawyers:</strong> SRA or relevant bar admission</li>
      </ul>

      <h3>Qualifications</h3>
      <ul>
        <li><strong>Degree certificates</strong> — original or certified copy.</li>
        <li><strong>Academic transcripts</strong> — especially if your employer referenced your qualifications in the CoS.</li>
        <li><strong>UK ENIC statement of comparability</strong> — if your degree is from outside the UK and you&apos;re using it to prove English or as a job requirement.</li>
        <li><strong>Professional qualifications</strong> — any relevant professional certifications.</li>
        <li><strong>Certified translations</strong> — all documents not in English must be accompanied by a certified translation.</li>
      </ul>

      <h2 id="salary-thresholds">Salary Thresholds in 2025</h2>
      <p>The salary landscape changed significantly in April 2024. Here&apos;s the current picture:</p>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Minimum Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>General threshold</td><td>£38,700/year</td></tr>
          <tr><td>Going rate (varies by occupation)</td><td>Check SOC code</td></tr>
          <tr><td>New entrant (under 26, recent graduate, PhD, switchable visa)</td><td>£30,960/year (80% of going rate)</td></tr>
          <tr><td>Immigration Salary List roles</td><td>£30,960/year (80% of going rate)</td></tr>
          <tr><td>Health and education roles</td><td>Specific rates apply</td></tr>
        </tbody>
      </table>
      <p>Your salary must meet <strong>both</strong> the general threshold and the going rate for your specific occupation — whichever is higher applies.</p>

      <h2 id="employer-docs">What Your Employer Needs to Do</h2>
      <p>While this is primarily your employer&apos;s responsibility, it helps to understand what they need:</p>
      <ul>
        <li><strong>Valid sponsor licence</strong> — they must be a licensed sponsor (you can check the public register).</li>
        <li><strong>Assign a CoS</strong> — either a defined CoS (for applications from outside the UK) or an undefined CoS (for switching within the UK).</li>
        <li><strong>Resident labour market test</strong> — no longer required since the post-Brexit system, but the role must be genuine and at the appropriate skill level (RQF 3+).</li>
        <li><strong>Right to work check</strong> — they&apos;ll need to verify your right to work once your visa is granted.</li>
      </ul>

      <h2 id="switching">Switching from Another Visa</h2>
      <p>
        If you&apos;re already in the UK on another visa (Student, Graduate, etc.), you can often <strong>switch</strong> to a Skilled Worker visa without leaving. Additional considerations:
      </p>
      <ul>
        <li>Your current visa must allow switching (most do, with exceptions like Visit visas).</li>
        <li>You may qualify for <strong>new entrant rates</strong> if switching from a Student or Graduate visa.</li>
        <li>You&apos;ll need an <strong>ACRO criminal record certificate</strong> for your time in the UK.</li>
        <li>Processing is done within the UK — typically 8 weeks standard, or 5 working days with priority.</li>
      </ul>

      <h2 id="application-steps">Application Steps</h2>
      <ol>
        <li><strong>Receive your CoS</strong> — your employer assigns it and gives you the reference number.</li>
        <li><strong>Complete the online application</strong> on GOV.UK.</li>
        <li><strong>Pay the fees</strong> — application fee (£719-£1,420 depending on job type and duration) plus IHS (£1,035/year).</li>
        <li><strong>Book biometrics</strong> — at a VFS/TLS centre (outside UK) or UKVCAS centre (inside UK).</li>
        <li><strong>Upload documents</strong> — submit everything digitally through the application portal.</li>
        <li><strong>Attend biometrics</strong> — fingerprints and photo.</li>
        <li><strong>Wait for decision</strong> — keep checking your email for updates.</li>
      </ol>

      <h2 id="common-mistakes">Common Mistakes</h2>
      <ul>
        <li><strong>CoS expired before application submitted</strong> — don&apos;t delay. Apply within days of receiving your CoS.</li>
        <li><strong>Bank statements don&apos;t cover 28 consecutive days</strong> — the most common financial evidence error.</li>
        <li><strong>Criminal record certificate from wrong country</strong> — remember, it&apos;s every country you&apos;ve lived in for 12+ months in the last 10 years.</li>
        <li><strong>English test from non-approved provider</strong> — only SELT tests are accepted. A general IELTS Academic test is NOT the same as IELTS for UKVI.</li>
        <li><strong>Wrong SOC code on CoS</strong> — check this carefully. If the code is wrong, the entire application can be refused.</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Get Your Personalised Checklist</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Your exact document requirements depend on your nationality, where you&apos;re applying from, your job type, and more. Our free tool asks 5 quick questions and generates exactly what you need.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Generate My Free Checklist
        </Link>
      </div>
    </GuideLayout>
  );
}
