import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Common UK Visa Rejection Reasons 2025 & How to Avoid Them | VisaBud',
  description: 'The top reasons UK visa applications get refused and exactly how to avoid each one. Learn from others\' mistakes — insufficient funds, weak evidence, deception, and more.',
};

const faqs = [
  {
    question: 'What is the most common reason for UK visa refusal?',
    answer: 'The most common reason is insufficient financial evidence — either not meeting the income threshold, not providing enough months of bank statements, or bank statements that don\'t clearly show the required funds. For visitor visas, the top reason is failure to prove ties to the home country.',
  },
  {
    question: 'Can I reapply after a UK visa refusal?',
    answer: 'Yes, in most cases you can reapply immediately. There is no mandatory waiting period (unless a ban was imposed). However, you should address every reason for refusal in your new application. Simply resubmitting the same evidence will likely result in another refusal.',
  },
  {
    question: 'Does a visa refusal affect future applications?',
    answer: 'Yes, you must declare all previous refusals on future applications. A previous refusal does not automatically mean your next application will be refused, but it does mean additional scrutiny. The key is showing what has changed since the refusal.',
  },
  {
    question: 'Can I appeal a UK visa refusal?',
    answer: 'It depends on the visa type. Human rights-based applications (like spouse visas) often have a right of appeal to the First-tier Tribunal. Most other visa types only have administrative review, which checks for caseworker errors. Visit visa refusals generally have no appeal right.',
  },
  {
    question: 'What is "deception" in a visa application?',
    answer: 'Deception means providing false information, false documents, or withholding material information. It can include submitting forged bank statements, fake employment letters, or not declaring previous refusals. Deception can result in a 10-year ban from UK visa applications.',
  },
  {
    question: 'How do I know why my visa was refused?',
    answer: 'You will receive a detailed refusal letter explaining the specific reasons your application was rejected. Read this carefully — it tells you exactly what was wrong and what you need to fix for a reapplication.',
  },
];

const checklistPreview = [
  { text: 'Provide complete financial evidence (6+ months)', critical: true },
  { text: 'Ensure all documents are genuine and verified', critical: true },
  { text: 'Declare all previous refusals and immigration history', critical: true },
  { text: 'Include certified translations for all non-English documents', critical: true },
  { text: 'Prove ties to home country (for visitor visas)', critical: false },
  { text: 'Double-check all dates and names match', critical: false },
];

const relatedGuides = [
  { title: 'UK Spouse Visa Checklist 2025', href: '/visa-guides/spouse-visa-checklist-2025' },
  { title: 'Skilled Worker Visa Documents', href: '/visa-guides/skilled-worker-visa-documents' },
  { title: 'How to Apply for a UK Visa', href: '/visa-guides/how-to-apply-uk-visa' },
  { title: 'UK Visa Interview Preparation', href: '/visa-guides/uk-visa-interview-preparation' },
  { title: 'UK Visa Timeline Planning', href: '/visa-guides/uk-visa-timeline-planning' },
];

export default function CommonVisaRejectionReasons() {
  return (
    <GuideLayout
      title="Common UK Visa Rejection Reasons: How to Avoid Refusal (2025)"
      subtitle="Learn from other applicants' mistakes. Here are the top reasons UK visa applications get refused — and exactly how to make sure it doesn't happen to you."
      lastUpdated="April 2025"
      readTime="14 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        A UK visa refusal is more than just disappointing — it costs you money (fees are non-refundable), time, and it goes on your immigration record. Every future application will ask if you&apos;ve ever been refused, and a &quot;yes&quot; always triggers extra scrutiny.
      </p>
      <p>
        The good news? <strong>Most refusals are entirely preventable.</strong> The same mistakes come up again and again. This guide covers the top reasons for refusal across all visa types, with specific guidance on how to avoid each one.
      </p>

      <h2 id="reason-1">1. Insufficient Financial Evidence</h2>
      <p><strong>Affected visa types:</strong> Spouse, Visitor, Student, Skilled Worker</p>
      <p>
        This is consistently the <strong>#1 reason</strong> for UK visa refusals across all categories. The financial requirement is strict and specific — close enough isn&apos;t good enough.
      </p>
      <p>Common financial evidence mistakes:</p>
      <ul>
        <li><strong>Not enough months of evidence:</strong> The spouse visa requires 6 months of payslips and bank statements. Submitting 4-5 months will be refused, even if the income is sufficient.</li>
        <li><strong>Income below the threshold:</strong> For spouse visas, the threshold is £29,000 as of 2025. Even £28,900 will be refused.</li>
        <li><strong>Bank statements don&apos;t match payslips:</strong> If your payslip shows £2,500/month but only £1,800 appears in your bank account (after deductions), this creates discrepancies. Provide an explanation letter.</li>
        <li><strong>Cash savings not held for 28 days:</strong> For Skilled Worker visas, £1,270 must be held for 28 consecutive days. A dip below this amount at any point in the 28 days means the requirement is not met.</li>
        <li><strong>Third-party funds without explanation:</strong> Large deposits from unknown sources raise suspicion. Always provide an explanation and supporting evidence for irregular deposits.</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-amber-800 font-medium">⚡ Prevention</p>
        <p className="text-sm text-amber-700 mt-1">Start collecting financial evidence 6+ months before applying. Set up a consistent savings pattern. Make sure every payslip has a matching deposit in your bank statement. If there are discrepancies, write an explanation letter.</p>
      </div>

      <h2 id="reason-2">2. Incomplete Application or Missing Documents</h2>
      <p><strong>Affected visa types:</strong> All</p>
      <p>
        Submitting an incomplete application is one of the easiest mistakes to make — and one of the most frustrating, because it&apos;s entirely avoidable.
      </p>
      <p>Commonly missing documents:</p>
      <ul>
        <li><strong>TB test certificate</strong> — forgotten by applicants who don&apos;t realise their country is on the list.</li>
        <li><strong>English language certificate</strong> — expired, from a non-approved test provider, or at the wrong level.</li>
        <li><strong>Certified translations</strong> — submitting documents in a foreign language without a certified English translation.</li>
        <li><strong>Sponsor documents</strong> — applicant submits their documents but forgets their UK-based sponsor&apos;s evidence.</li>
        <li><strong>Marriage certificate</strong> — submitting a wedding photo instead of an official marriage certificate.</li>
      </ul>
      <p>
        <strong>Prevention:</strong> Use a comprehensive checklist before submitting. This is exactly what <Link href="/app/start" className="text-blue-600">our free tool</Link> is designed for — it generates a personalised list based on your specific situation.
      </p>

      <h2 id="reason-3">3. Failure to Prove Genuine Relationship</h2>
      <p><strong>Affected visa types:</strong> Spouse, Partner, Fiancé(e)</p>
      <p>
        For family visa applications, the Home Office must be satisfied that your relationship is &quot;genuine and subsisting.&quot; Weak relationship evidence is the second most common reason for spouse visa refusals.
      </p>
      <p>What counts as weak evidence:</p>
      <ul>
        <li><strong>Only 2-3 photographs</strong> — the caseworker wants to see a range of photos spanning the relationship.</li>
        <li><strong>No communication evidence</strong> — if you live in different countries, you should show regular communication (messages, call logs, video call screenshots).</li>
        <li><strong>No evidence of visits</strong> — if you&apos;ve never visited each other, this raises serious concerns about whether the relationship is real.</li>
        <li><strong>Inconsistent timelines</strong> — if your application says you met in 2020 but your photos are all from 2024, there&apos;s a gap that needs explaining.</li>
        <li><strong>Cultural marriage with no ongoing relationship</strong> — some arranged marriages need extra evidence showing the relationship has developed beyond the ceremony.</li>
      </ul>
      <p>
        <strong>Prevention:</strong> Submit 10-20 photos, communication screenshots spanning several months, flight bookings for visits, joint financial activity, and letters from family/friends. Write a 2-3 page cover letter telling your story.
      </p>

      <h2 id="reason-4">4. Deception or False Documents</h2>
      <p><strong>Affected visa types:</strong> All</p>
      <p>
        This is the most serious ground for refusal. If the Home Office believes you have used <strong>deception</strong>, the consequences are severe:
      </p>
      <ul>
        <li><strong>Automatic refusal</strong> of the current application.</li>
        <li><strong>10-year ban</strong> from UK visa applications (in most cases).</li>
        <li><strong>Permanent record</strong> of deception on your immigration file.</li>
      </ul>
      <p>What constitutes deception:</p>
      <ul>
        <li>Submitting forged or doctored bank statements.</li>
        <li>Fake employment or employer reference letters.</li>
        <li>Using a proxy test-taker for English language tests.</li>
        <li>Not declaring previous visa refusals or deportations.</li>
        <li>Providing incorrect personal details (false name, DOB, marital status).</li>
        <li>Omitting material information (like a criminal conviction).</li>
      </ul>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-red-800 font-medium">🚫 Zero tolerance</p>
        <p className="text-sm text-red-700 mt-1">The Home Office uses advanced document verification technology and cross-references information with employers, banks, and other governments. Fake documents WILL be detected. The consequences (10-year ban) far outweigh any perceived benefit.</p>
      </div>

      <h2 id="reason-5">5. Failure to Prove Ties to Home Country (Visitor Visas)</h2>
      <p><strong>Affected visa types:</strong> Visitor visa</p>
      <p>
        For visitor visas, the caseworker must be satisfied that you will <strong>leave the UK at the end of your visit</strong>. If you can&apos;t demonstrate strong ties to your home country, refusal is likely.
      </p>
      <p>Weak ties indicators:</p>
      <ul>
        <li><strong>Unemployed or recently resigned</strong> — no job to return to.</li>
        <li><strong>No property or significant assets</strong> — nothing anchoring you to your home country.</li>
        <li><strong>Young, single, no dependants</strong> — higher perceived risk of overstaying.</li>
        <li><strong>Family already in the UK</strong> — suggests a motivation to stay.</li>
        <li><strong>No travel history</strong> — never having left your country before can (unfairly) count against you.</li>
      </ul>
      <p>
        <strong>Prevention:</strong> Provide strong evidence of ties — employment letter confirming ongoing employment, property ownership, university enrolment, family responsibilities. A detailed travel itinerary with return flights also helps.
      </p>

      <h2 id="reason-6">6. Previous Immigration Violations</h2>
      <p><strong>Affected visa types:</strong> All</p>
      <p>
        If you have ever overstayed a visa, worked illegally, or breached visa conditions in the UK or any other country, this will significantly affect your application.
      </p>
      <ul>
        <li><strong>Overstaying</strong> — even by 1 day, if your previous visa expired and you didn&apos;t leave or extend in time.</li>
        <li><strong>Working without permission</strong> — working on a visitor visa or exceeding student work hour limits.</li>
        <li><strong>Breach of conditions</strong> — accessing public funds when your visa prohibited it.</li>
      </ul>
      <p>
        <strong>Prevention:</strong> Declare everything. If you had previous immigration issues, provide a full explanation in your cover letter. Showing what has changed since then and why this application is different can help overcome the negative history.
      </p>

      <h2 id="reason-7">7. English Language Not Met</h2>
      <p><strong>Affected visa types:</strong> Spouse, Skilled Worker, Student, Settlement</p>
      <ul>
        <li><strong>Wrong test provider</strong> — a general IELTS Academic test is NOT the same as IELTS for UKVI. Only SELT tests from approved providers are accepted.</li>
        <li><strong>Wrong level</strong> — spouse visa requires A1 (initial), A2 (extension), B1 (settlement). Skilled Worker requires B1.</li>
        <li><strong>Expired test</strong> — SELT test results are typically valid for 2 years.</li>
        <li><strong>Test taken at non-approved centre</strong> — the test must be at an approved SELT centre.</li>
      </ul>

      <h2 id="reason-8">8. Application Form Errors</h2>
      <p><strong>Affected visa types:</strong> All</p>
      <p>Seemingly minor errors on the application form can cause problems:</p>
      <ul>
        <li><strong>Name spelled differently</strong> from passport.</li>
        <li><strong>Incorrect dates</strong> — wrong date of birth, travel dates, or employment dates.</li>
        <li><strong>Answering &quot;No&quot; to a question that should be &quot;Yes&quot;</strong> — especially regarding previous refusals or criminal history.</li>
        <li><strong>Leaving sections blank</strong> — an unanswered question is treated as missing information.</li>
        <li><strong>Wrong visa category selected</strong> — applying under the wrong route is an automatic refusal.</li>
      </ul>

      <h2 id="reason-9">9. Inadequate Accommodation Evidence</h2>
      <p><strong>Affected visa types:</strong> Spouse, Family</p>
      <p>
        You must prove you have adequate, non-overcrowded accommodation in the UK. Common issues:
      </p>
      <ul>
        <li>No evidence provided at all.</li>
        <li>Tenancy agreement expired or about to expire.</li>
        <li>Property too small for the number of occupants (overcrowding).</li>
        <li>No letter from homeowner if living with family/friends.</li>
      </ul>

      <h2 id="reason-10">10. Applying Too Early or Too Late</h2>
      <p><strong>Affected visa types:</strong> Various</p>
      <ul>
        <li><strong>CoS expired</strong> (Skilled Worker) — must apply within 3 months of CoS being assigned.</li>
        <li><strong>CAS expired</strong> (Student) — must apply within 6 months and no more than 6 months before course start.</li>
        <li><strong>Applying before eligible</strong> (ILR) — you must have completed the required residency period. Applying 1 day early = automatic refusal.</li>
        <li><strong>TB certificate expired</strong> — valid for only 6 months from the test date.</li>
      </ul>

      <h2 id="what-to-do">What to Do If You&apos;re Refused</h2>
      <ol>
        <li><strong>Read the refusal letter carefully</strong> — every reason is listed. Address each one.</li>
        <li><strong>Understand your options:</strong>
          <ul>
            <li><strong>Administrative review</strong> — for caseworker errors (available for most non-family visas). Fee: £80.</li>
            <li><strong>Appeal</strong> — for human rights-based refusals (family visas). This goes to the First-tier Tribunal.</li>
            <li><strong>Reapplication</strong> — you can reapply immediately with a stronger application.</li>
          </ul>
        </li>
        <li><strong>Don&apos;t resubmit the same application</strong> — if nothing has changed, the result will be the same.</li>
        <li><strong>Consider professional help</strong> — if your case is complex or you&apos;ve been refused twice, an immigration solicitor may be worthwhile.</li>
      </ol>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Avoid Refusal — Get It Right First Time</h3>
        <p className="text-sm text-emerald-700 mb-3">
          The best way to avoid refusal is to submit a complete, accurate application with all the right documents. Our free tool generates a personalised checklist for your specific situation — nothing missed, nothing forgotten.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Generate My Free Checklist
        </Link>
      </div>
    </GuideLayout>
  );
}
