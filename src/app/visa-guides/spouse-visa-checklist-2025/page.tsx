import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UK Spouse Visa Checklist 2025: Complete Document List | VisaBud',
  description: 'The definitive UK spouse visa checklist for 2025. Every document you need, financial requirements (£29,000 minimum income), supporting evidence, and expert tips to get approved first time.',
};

const faqs = [
  {
    question: 'What is the minimum income requirement for a UK spouse visa in 2025?',
    answer: 'As of 2025, the minimum income requirement is £29,000 per year. This was increased from £18,600 in April 2024 as part of a phased increase towards £38,700. You can meet this through employment income, cash savings, pension income, or a combination.',
  },
  {
    question: 'How much does a UK spouse visa cost in 2025?',
    answer: 'The UK spouse visa application fee is £1,846 (from outside the UK) or £1,048 (for extension/switch within the UK). On top of this, you must pay the Immigration Health Surcharge (IHS) of £1,035 per year (£2,587.50 for 2.5 years). Total cost is approximately £4,400-£4,500.',
  },
  {
    question: 'How long does a UK spouse visa take to process?',
    answer: 'Standard processing takes approximately 12 weeks (about 60 working days) from your biometrics appointment. Priority services are available in some countries for an additional £500-£1,000 and can reduce this to 5-10 working days.',
  },
  {
    question: 'Can I use savings instead of income for a spouse visa?',
    answer: 'Yes, you can use cash savings to meet the financial requirement. You need savings of at least £16,000 plus 2.5 times the shortfall between your income and the threshold, held for at least 6 months. For example, if you have zero income, you would need at least £88,500 in savings.',
  },
  {
    question: 'Do I need to take an English language test for a spouse visa?',
    answer: 'Yes, unless you are exempt. You need to prove your English at CEFR level A1 (speaking and listening) for the initial application. You can do this through a SELT test (like IELTS Life Skills A1), or you may be exempt if you are a national of a majority English-speaking country or hold a degree taught in English.',
  },
  {
    question: 'How long can I stay in the UK on a spouse visa?',
    answer: 'The initial spouse visa is granted for 33 months (if applying from outside the UK) or 30 months (if switching from within the UK). After this, you can extend for another 2.5 years, and after 5 years total, you can apply for Indefinite Leave to Remain (settlement).',
  },
];

const checklistPreview = [
  { text: 'Valid passport (6+ months validity)', critical: true },
  { text: 'Marriage/civil partnership certificate', critical: true },
  { text: 'English language test certificate (A1)', critical: true },
  { text: 'Financial evidence (6 months payslips/bank statements)', critical: true },
  { text: 'Proof of relationship genuineness', critical: false },
  { text: 'TB test certificate (if applicable)', critical: false },
  { text: 'Accommodation evidence', critical: false },
  { text: 'Two passport-sized photographs', critical: false },
];

const relatedGuides = [
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'UK Visa Processing Times', href: '/visa-guides/uk-visa-processing-times' },
  { title: 'Common Visa Rejection Reasons', href: '/visa-guides/common-visa-rejection-reasons' },
  { title: 'UK Visa Timeline Planning', href: '/visa-guides/uk-visa-timeline-planning' },
  { title: 'TB Test Requirements by Country', href: '/visa-guides/tb-test-requirements-by-country' },
];

export default function SpouseVisaChecklist2025() {
  return (
    <GuideLayout
      title="UK Spouse Visa Checklist 2025: Complete Document Guide"
      subtitle="Everything you need to gather for a successful UK spouse or partner visa application. Updated for the April 2025 rules with the new £29,000 income threshold."
      lastUpdated="April 2025"
      readTime="12 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        Applying for a <strong>UK spouse visa</strong> (officially the &quot;Family visa — partner route&quot;) is one of the most document-intensive applications you can make to UK Visas and Immigration (UKVI). Missing even a single document can lead to delays, additional evidence requests, or outright refusal.
      </p>
      <p>
        This guide gives you the <strong>complete 2025 checklist</strong> — every document, every requirement, every tip — so you can submit a strong application the first time. We&apos;ve built this using the official Home Office guidance (Appendix FM and related immigration rules) and feedback from hundreds of successful applicants.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-amber-800 font-medium">⚡ Want a personalised checklist based on your specific situation?</p>
        <p className="text-sm text-amber-700 mt-1">Our free tool asks 5 questions and generates exactly what <em>you</em> need — no more, no less.</p>
        <Link href="/app/start" className="inline-block mt-2 text-sm font-semibold text-amber-900 hover:underline">Generate my checklist →</Link>
      </div>

      <h2 id="who-can-apply">Who Can Apply for a UK Spouse Visa?</h2>
      <p>
        You can apply for a UK spouse visa if you are the <strong>husband, wife, or civil partner</strong> of a British citizen or a person with settled status (Indefinite Leave to Remain) in the UK. You can also apply as an unmarried partner if you have been living together in a relationship akin to marriage for at least 2 years.
      </p>
      <p>Key eligibility requirements include:</p>
      <ul>
        <li><strong>You are aged 18 or over</strong> (both you and your partner)</li>
        <li><strong>Your relationship is genuine and subsisting</strong> — you intend to live together permanently in the UK</li>
        <li><strong>You meet the financial requirement</strong> — minimum £29,000 per year as of 2025</li>
        <li><strong>You meet the English language requirement</strong> — CEFR level A1</li>
        <li><strong>Adequate accommodation</strong> — you have somewhere to live in the UK without recourse to public funds</li>
      </ul>

      <h2 id="financial-requirement">Financial Requirement: The £29,000 Threshold</h2>
      <p>
        The financial requirement is where most applications stumble. Since April 2024, the UK government has been phasing in increases to the minimum income threshold. As of 2025, the threshold sits at <strong>£29,000 per year</strong>, up from £18,600.
      </p>
      <h3>How to Meet the Financial Requirement</h3>
      <p>There are several ways to meet this threshold:</p>
      <ul>
        <li><strong>Category A (salaried employment):</strong> Your UK-based sponsor has been in the same job for at least 6 months and earns £29,000+. You&apos;ll need 6 months of payslips and matching bank statements.</li>
        <li><strong>Category B (variable income):</strong> Your sponsor has been employed for at least 6 months but changed jobs. You need 12 months of payslips showing total income of at least £29,000.</li>
        <li><strong>Category C (self-employment):</strong> Your sponsor is self-employed and has earned £29,000+ over the most recent full financial year. You need SA302 tax calculations, tax year overviews, and business accounts.</li>
        <li><strong>Category D (cash savings):</strong> You hold at least £16,000 + 2.5× the shortfall. With zero income, that means £88,500 in savings held for 6+ months.</li>
        <li><strong>Category E (pension):</strong> UK state or private pension income.</li>
        <li><strong>Combination:</strong> You can combine different sources to reach the threshold.</li>
      </ul>

      <h3>Financial Documents You&apos;ll Need</h3>
      <p>For <strong>employed sponsors</strong>, prepare:</p>
      <ul>
        <li>6 months of dated payslips (or 12 months for Category B)</li>
        <li>6 months of bank statements showing salary deposits</li>
        <li>Letter from employer confirming: job title, salary, start date, type of contract</li>
        <li>P60 for the most recent tax year</li>
        <li>Contract of employment (if changed jobs recently)</li>
      </ul>
      <p>For <strong>self-employed sponsors</strong>, prepare:</p>
      <ul>
        <li>SA302 tax calculation from HMRC for the most recent full financial year</li>
        <li>Corresponding tax year overview from HMRC</li>
        <li>Business bank statements for the relevant period</li>
        <li>Business accounts (if applicable)</li>
        <li>Evidence of ongoing self-employment (invoices, contracts)</li>
      </ul>

      <h2 id="personal-documents">Personal Documents Checklist</h2>
      <p>Both the applicant and the UK-based sponsor need to provide personal documents. Here&apos;s the full list:</p>

      <h3>Applicant (Overseas Partner)</h3>
      <ul>
        <li><strong>Valid passport</strong> — must be valid for the entire duration of your visa. Check expiry dates carefully.</li>
        <li><strong>Previous passports</strong> — if they contain any UK visa stamps or entry stamps.</li>
        <li><strong>Two biometric passport photographs</strong> — 45mm × 35mm, taken within the last 6 months.</li>
        <li><strong>National ID card</strong> — if applicable to your country.</li>
        <li><strong>Birth certificate</strong> — with certified translation if not in English.</li>
        <li><strong>Decree absolute or death certificate</strong> — if either partner has been previously married/in a civil partnership.</li>
      </ul>

      <h3>UK-Based Sponsor</h3>
      <ul>
        <li><strong>Valid British passport</strong> or <strong>Biometric Residence Permit (BRP)</strong> showing settled status.</li>
        <li><strong>Proof of address</strong> — council tax bill, utility bills, or mortgage statement.</li>
      </ul>

      <h2 id="relationship-evidence">Relationship Evidence</h2>
      <p>
        UKVI will assess whether your relationship is <strong>&quot;genuine and subsisting.&quot;</strong> This is where many applicants underperform. You need to build a compelling picture of your life together.
      </p>
      <p>Strong relationship evidence includes:</p>
      <ul>
        <li><strong>Marriage or civil partnership certificate</strong> — the single most important document. Get an official copy (not a photocopy).</li>
        <li><strong>Photographs together</strong> — 10-20 photos spanning the relationship, with different people, locations, and time periods. Include photos with family members.</li>
        <li><strong>Communication evidence</strong> — screenshots of messages, call logs, or video call records. Especially important if you&apos;ve been living apart.</li>
        <li><strong>Evidence of visits</strong> — flight bookings, hotel receipts, entry stamps in passports showing you visited each other.</li>
        <li><strong>Joint financial evidence</strong> — shared bank accounts, money transfers between you, joint bills.</li>
        <li><strong>Letters or cards</strong> — from family or friends acknowledging your relationship.</li>
        <li><strong>Wedding invitation and guest list</strong> — if you held a ceremony.</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-blue-800 font-medium">💡 Pro tip</p>
        <p className="text-sm text-blue-700 mt-1">Create a cover letter (2-3 pages) telling the story of your relationship: how you met, when you got engaged, your plans for the future. This gives the caseworker context for all the evidence.</p>
      </div>

      <h2 id="english-language">English Language Requirement</h2>
      <p>
        For the initial spouse visa, you need to prove English at <strong>CEFR level A1</strong> (speaking and listening only). This is the most basic level. Options include:
      </p>
      <ul>
        <li><strong>IELTS Life Skills A1</strong> — the most commonly used test. Costs approximately £150. Results within 7 days.</li>
        <li><strong>Trinity College London GESE Grade 2</strong> — an alternative speaking-only exam.</li>
        <li><strong>Degree taught in English</strong> — must be confirmed by UK ENIC (formerly NARIC) as equivalent to a UK degree.</li>
        <li><strong>National of a majority English-speaking country</strong> — automatic exemption for nationals of countries like the USA, Canada, Australia, New Zealand, Jamaica, etc.</li>
      </ul>
      <p>
        <strong>Important:</strong> You must take the test at an <strong>approved SELT centre</strong>. Tests taken at non-approved centres will not be accepted.
      </p>

      <h2 id="tb-test">TB Test Certificate</h2>
      <p>
        If you are applying from a <Link href="/visa-guides/tb-test-requirements-by-country" className="text-blue-600">country where TB testing is required</Link>, you must provide a valid tuberculosis test certificate. The test must be done at an approved clinic, and results are valid for 6 months.
      </p>
      <p>Common countries requiring a TB test include India, Pakistan, Bangladesh, Nigeria, the Philippines, South Africa, and many more. Check the full list in our <Link href="/visa-guides/tb-test-requirements-by-country" className="text-blue-600">TB test guide</Link>.</p>

      <h2 id="accommodation">Accommodation Evidence</h2>
      <p>
        You need to show that you will have adequate accommodation in the UK without relying on public funds. This means:
      </p>
      <ul>
        <li><strong>If your sponsor owns a property:</strong> Mortgage statement or title deed, plus a recent utility bill.</li>
        <li><strong>If renting:</strong> Tenancy agreement, landlord&apos;s letter confirming the applicant can live there, and evidence of rent payments.</li>
        <li><strong>If living with family/friends:</strong> Letter from the homeowner/tenant confirming you can live there, plus their proof of ownership/tenancy.</li>
      </ul>
      <p>The accommodation must not be overcrowded. If a local council housing inspection report is available, include it.</p>

      <h2 id="application-process">The Application Process: Step by Step</h2>
      <ol>
        <li><strong>Complete the online application</strong> on the GOV.UK website (form VAF4A for the initial application).</li>
        <li><strong>Pay the application fee</strong> (£1,846) and the IHS surcharge (£2,587.50 for 2.5 years).</li>
        <li><strong>Book and attend biometrics</strong> at a VFS or TLS centre in your country. You&apos;ll have your fingerprints and photograph taken.</li>
        <li><strong>Submit your documents</strong> — upload digitally via the TLS/VFS portal or submit physical copies depending on your country.</li>
        <li><strong>Wait for a decision</strong> — standard processing is approximately 12 weeks from biometrics.</li>
        <li><strong>Collect your vignette</strong> — if approved, you&apos;ll get a 90-day entry vignette in your passport. You must enter the UK within this window.</li>
        <li><strong>Collect your BRP</strong> — within 10 days of arriving in the UK, collect your Biometric Residence Permit from the designated Post Office.</li>
      </ol>

      <h2 id="common-mistakes">Common Mistakes to Avoid</h2>
      <p>Based on Home Office refusal statistics and applicant feedback, these are the most frequent mistakes:</p>
      <ul>
        <li><strong>Insufficient financial evidence</strong> — submitting 3 months of payslips instead of 6, or bank statements that don&apos;t cover the full period.</li>
        <li><strong>Weak relationship evidence</strong> — only providing 2-3 photos or minimal communication evidence.</li>
        <li><strong>Expired TB test</strong> — the certificate is only valid for 6 months. If your application is delayed, it may expire before a decision.</li>
        <li><strong>Missing certified translations</strong> — all non-English documents must have a certified translation.</li>
        <li><strong>Incorrect financial category</strong> — applying under Category A when you&apos;ve changed jobs (should be Category B).</li>
        <li><strong>Not declaring previous immigration issues</strong> — any previous refusals, overstays, or bans must be declared. Failure to disclose is treated as deception.</li>
      </ul>
      <p>
        For a deeper dive into what goes wrong, see our guide on <Link href="/visa-guides/common-visa-rejection-reasons" className="text-blue-600">common UK visa rejection reasons</Link>.
      </p>

      <h2 id="timeline">Recommended Timeline</h2>
      <p>We recommend starting your preparation <strong>at least 3-4 months</strong> before you intend to submit your application. Here&apos;s a suggested timeline:</p>
      <ul>
        <li><strong>Month 1:</strong> Gather personal documents, book your English language test, check if you need a TB test.</li>
        <li><strong>Month 2:</strong> Compile financial evidence (ensure you have 6 months of payslips and bank statements). Start organising relationship evidence.</li>
        <li><strong>Month 3:</strong> Complete the online application, pay fees, book biometrics appointment. Do a final review of all documents.</li>
        <li><strong>Month 4:</strong> Attend biometrics, submit documents, and wait for the decision.</li>
      </ul>
      <p>
        For a detailed week-by-week plan, see our <Link href="/visa-guides/uk-visa-timeline-planning" className="text-blue-600">UK visa timeline planning guide</Link>.
      </p>

      <h2 id="costs-summary">Total Costs Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Cost (2025)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Application fee (from outside UK)</td><td>£1,846</td></tr>
          <tr><td>Immigration Health Surcharge (2.5 years)</td><td>£2,587.50</td></tr>
          <tr><td>Biometrics (VFS/TLS fee)</td><td>£55–£200</td></tr>
          <tr><td>English language test</td><td>£150–£200</td></tr>
          <tr><td>TB test (if required)</td><td>£50–£150</td></tr>
          <tr><td>Document translation</td><td>£20–£50 per page</td></tr>
          <tr><td>Priority service (optional)</td><td>£500–£1,000</td></tr>
          <tr><td><strong>Total (standard)</strong></td><td><strong>£4,700–£5,000</strong></td></tr>
        </tbody>
      </table>
      <p>
        For a full breakdown, see our <Link href="/visa-guides/uk-visa-fees-costs" className="text-blue-600">UK visa fees and costs guide</Link>.
      </p>

      <h2 id="after-approval">After Your Visa Is Approved</h2>
      <p>Once approved, you will receive:</p>
      <ul>
        <li>A <strong>vignette sticker</strong> in your passport — valid for 90 days. You must enter the UK within this window.</li>
        <li>A <strong>decision letter</strong> confirming your visa grant.</li>
      </ul>
      <p>After arriving in the UK:</p>
      <ul>
        <li>Collect your <strong>BRP card</strong> from the designated Post Office within 10 days.</li>
        <li>Register with a <strong>GP</strong> (doctor) — your IHS payment covers NHS treatment.</li>
        <li>You are allowed to <strong>work</strong> in the UK without restrictions on your spouse visa.</li>
        <li>Start planning for your <strong>extension</strong> — you&apos;ll need to extend after 2.5 years, meeting a higher English language requirement (A2) and a potentially higher income threshold.</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Don&apos;t Leave It to Guesswork</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Every person&apos;s situation is different — your country of origin, your sponsor&apos;s employment type, your relationship history all affect what you need. Our free tool generates a personalised checklist tailored to you.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Get My Personalised Checklist — Free
        </Link>
      </div>
    </GuideLayout>
  );
}
