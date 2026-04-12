import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UK Visa Timeline Planning Guide 2025: Week-by-Week Plan | VisaBud',
  description: 'Plan your UK visa application timeline week by week. From initial research to receiving your decision — never miss a deadline. Spouse, skilled worker, student, and visitor visa timelines.',
};

const faqs = [
  {
    question: 'How far in advance should I start preparing my UK visa application?',
    answer: 'We recommend starting 3-6 months before your intended travel or move date for long-term visas (spouse, skilled worker) and 6-8 weeks for visitor visas. Some documents (criminal record certificates, English language tests) take weeks to obtain.',
  },
  {
    question: 'What is the earliest I can apply for a UK visa?',
    answer: 'For most visa types, you can apply up to 3 months before your intended travel date. Student visas can be submitted up to 6 months before the course start date. Skilled Worker applicants must apply within 3 months of their CoS being assigned.',
  },
  {
    question: 'How do I plan around the financial evidence period?',
    answer: 'Financial evidence windows are strict. For spouse visas, you need 6 months of payslips/bank statements ending within 28 days of your application. Start collecting these early and ensure there are no gaps. For skilled worker visas, £1,270 must be held for 28 consecutive days ending within 31 days of application.',
  },
  {
    question: 'What if my TB test expires before I get a decision?',
    answer: 'TB certificates are valid for 6 months. If processing takes longer, UKVI may ask for a new one. To minimise this risk, take the TB test 3-4 weeks before submitting (not months before). For spouse visas (12-week processing), take it no earlier than 3 months before applying.',
  },
  {
    question: 'Should I book flights before my visa is approved?',
    answer: 'Do not book non-refundable flights before receiving your visa decision. If you must show a travel itinerary (for visitor visas), book refundable tickets or use a flight reservation service that provides a valid booking without full payment.',
  },
  {
    question: 'How long after approval do I have to enter the UK?',
    answer: 'For long-term visas (spouse, skilled worker, student), your entry clearance vignette is valid for 90 days. You must enter the UK within this window. For visitor visas, the visa is valid for 6 months from the date of issue.',
  },
];

const checklistPreview = [
  { text: 'Create timeline 3-6 months before travel date', critical: true },
  { text: 'Order criminal record certificates early (2-3 months)', critical: true },
  { text: 'Book English language test (1-2 months before)', critical: true },
  { text: 'Start collecting financial evidence (6 months)', critical: true },
  { text: 'Schedule TB test 3-4 weeks before application', critical: false },
  { text: 'Book biometrics as soon as form is submitted', critical: false },
];

const relatedGuides = [
  { title: 'How to Apply for a UK Visa', href: '/visa-guides/how-to-apply-uk-visa' },
  { title: 'UK Visa Processing Times', href: '/visa-guides/uk-visa-processing-times' },
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'UK Spouse Visa Checklist 2025', href: '/visa-guides/spouse-visa-checklist-2025' },
  { title: 'Common Visa Rejection Reasons', href: '/visa-guides/common-visa-rejection-reasons' },
];

export default function UKVisaTimelinePlanning() {
  return (
    <GuideLayout
      title="UK Visa Timeline Planning: Your Week-by-Week Guide (2025)"
      subtitle="Take the stress out of your visa application with a clear, structured timeline. Know exactly when to do what — from first research to packing your bags."
      lastUpdated="April 2025"
      readTime="13 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        The biggest mistake visa applicants make isn&apos;t about documents or money — it&apos;s about <strong>timing</strong>. They start too late, discover a document takes 3 months to obtain, rush through the application, and either submit incomplete evidence or miss their target travel date entirely.
      </p>
      <p>
        This guide gives you a <strong>week-by-week timeline</strong> for the most common UK visa types. Follow it, and you&apos;ll submit a strong, complete application with time to spare.
      </p>

      <h2 id="spouse-timeline">Spouse/Partner Visa Timeline (5-6 Months)</h2>
      <p>The spouse visa is the most document-intensive UK visa. Start early — 5-6 months before your intended move date.</p>

      <h3>Months 5-6 Before Travel: Research & Planning</h3>
      <ul>
        <li>✅ Confirm eligibility — check income threshold (£29,000), English requirement, relationship evidence needed.</li>
        <li>✅ Start collecting <strong>financial evidence</strong> — ensure your UK sponsor&apos;s payslips and bank statements cover 6 months. If there&apos;s a shortfall, start planning now.</li>
        <li>✅ Book your <strong>English language test</strong> (IELTS Life Skills A1 or equivalent). Test centres fill up — book 4-6 weeks in advance.</li>
        <li>✅ Order your <strong>marriage certificate</strong> — get an official copy if you don&apos;t already have one.</li>
        <li>✅ Check if you need a <Link href="/visa-guides/tb-test-requirements-by-country" className="text-blue-600">TB test</Link> — identify the approved clinic in your area.</li>
        <li>✅ Start organising <strong>relationship evidence</strong> — photos, messages, visit records, joint activities.</li>
      </ul>

      <h3>Months 3-4 Before Travel: Document Collection</h3>
      <ul>
        <li>✅ Take your <strong>English language test</strong>. Results come within 7-14 days.</li>
        <li>✅ Gather all <strong>personal documents</strong> — passports, birth certificates, previous divorce decrees.</li>
        <li>✅ Request <strong>employer reference letter</strong> for your UK-based sponsor.</li>
        <li>✅ Collect <strong>6 months of payslips and bank statements</strong> for the sponsor.</li>
        <li>✅ Get a <strong>P60</strong> from the sponsor&apos;s employer (if available).</li>
        <li>✅ Arrange <strong>certified translations</strong> for any non-English documents.</li>
        <li>✅ Arrange <strong>accommodation evidence</strong> — tenancy agreement, mortgage statement, or homeowner letter.</li>
        <li>✅ Compile <strong>relationship evidence folder</strong> — 10-20 photos, messages, visit evidence, joint finances.</li>
      </ul>

      <h3>Month 2 Before Travel: Application & TB Test</h3>
      <ul>
        <li>✅ Take your <strong>TB test</strong> at an approved clinic (certificate valid for 6 months).</li>
        <li>✅ Complete the <strong>online application form</strong> on GOV.UK.</li>
        <li>✅ Pay the <strong>application fee</strong> (£1,846) and <strong>IHS surcharge</strong> (£2,587.50).</li>
        <li>✅ Book your <strong>biometrics appointment</strong> at the nearest VAC.</li>
        <li>✅ Write a <strong>cover letter</strong> — 2-3 pages explaining your relationship and circumstances.</li>
        <li>✅ Final document review — check everything against a <Link href="/app/start" className="text-blue-600">personalised checklist</Link>.</li>
      </ul>

      <h3>Month 1 Before Travel: Submit & Wait</h3>
      <ul>
        <li>✅ Attend <strong>biometrics appointment</strong>.</li>
        <li>✅ Submit all <strong>supporting documents</strong> (upload or hand in at VAC).</li>
        <li>✅ Begin the <strong>12-week wait</strong> (standard processing).</li>
        <li>✅ Check email regularly for any requests for additional evidence.</li>
        <li>✅ Start preparing for your move — research accommodation, NHS registration, banking.</li>
      </ul>

      <h3>After Decision: Arrival</h3>
      <ul>
        <li>✅ Collect your passport with <strong>90-day vignette</strong>.</li>
        <li>✅ Book flights — enter the UK within the 90-day window.</li>
        <li>✅ Collect your <strong>BRP card</strong> from the designated Post Office within 10 days of arrival.</li>
        <li>✅ Register with a <strong>GP</strong>.</li>
        <li>✅ Open a <strong>UK bank account</strong>.</li>
      </ul>

      <h2 id="skilled-worker-timeline">Skilled Worker Visa Timeline (6-10 Weeks)</h2>
      <p>The skilled worker timeline is shorter because your employer handles much of the preparation. But don&apos;t underestimate the personal document requirements.</p>

      <h3>Weeks 8-10 Before Start Date</h3>
      <ul>
        <li>✅ Employer applies for and receives your <strong>Certificate of Sponsorship (CoS)</strong>.</li>
        <li>✅ Start collecting <strong>personal documents</strong> — passport, qualifications, translations.</li>
        <li>✅ Request <strong>criminal record certificates</strong> from every country you&apos;ve lived in for 12+ months. <strong>Start this immediately</strong> — some countries take 3-6 months.</li>
        <li>✅ Confirm your <strong>English language evidence</strong> — test, degree, or nationality exemption.</li>
        <li>✅ Check if you need a <strong>TB test</strong> or <strong>ATAS certificate</strong>.</li>
      </ul>

      <h3>Weeks 4-6 Before Start Date</h3>
      <ul>
        <li>✅ Ensure £1,270 has been in your bank for <strong>28 consecutive days</strong> (unless employer certifies maintenance).</li>
        <li>✅ Take your <strong>TB test</strong> (if required).</li>
        <li>✅ Complete the <strong>online application</strong> within 3 months of CoS assignment.</li>
        <li>✅ Pay <strong>fees</strong> (£719-£1,420 + IHS).</li>
        <li>✅ Book and attend <strong>biometrics</strong>.</li>
      </ul>

      <h3>Weeks 1-3: Wait for Decision</h3>
      <ul>
        <li>✅ Standard processing: <strong>3 weeks</strong> (from outside UK) or <strong>8 weeks</strong> (switching in UK).</li>
        <li>✅ Priority: <strong>5 working days</strong>.</li>
        <li>✅ Collect passport with vignette → enter UK within 90 days.</li>
        <li>✅ Collect BRP within 10 days of arrival.</li>
      </ul>

      <h2 id="student-timeline">Student Visa Timeline (3-4 Months)</h2>

      <h3>Months 3-4 Before Course Start</h3>
      <ul>
        <li>✅ Accept your university offer and receive your <strong>CAS (Confirmation of Acceptance for Studies)</strong>.</li>
        <li>✅ Pay any required <strong>tuition deposit</strong>.</li>
        <li>✅ Check if you need an <strong>ATAS certificate</strong> (for postgraduate research in certain subjects). Apply early — takes several weeks.</li>
        <li>✅ Confirm your <strong>English language evidence</strong>.</li>
        <li>✅ Ensure you have <strong>28 days of maintenance funds</strong> in your bank (amount varies by study location: £1,334/month in London, £1,023/month outside London, for 9 months).</li>
      </ul>

      <h3>Months 1-2 Before Course Start</h3>
      <ul>
        <li>✅ Take your <strong>TB test</strong> (if required).</li>
        <li>✅ Complete the <strong>online application</strong> — can apply up to 6 months before course start.</li>
        <li>✅ Pay <strong>fees</strong> (£490 + IHS at student rate £776/year).</li>
        <li>✅ Book and attend <strong>biometrics</strong>.</li>
        <li>✅ Processing: approximately <strong>3 weeks</strong>.</li>
      </ul>

      <h3>After Decision</h3>
      <ul>
        <li>✅ Collect passport with vignette.</li>
        <li>✅ Arrange <strong>accommodation</strong> in the UK.</li>
        <li>✅ Enter the UK and collect <strong>BRP</strong>.</li>
        <li>✅ Register at your <strong>university</strong>.</li>
      </ul>

      <h2 id="visitor-timeline">Visitor Visa Timeline (6-8 Weeks)</h2>

      <h3>Weeks 6-8 Before Travel</h3>
      <ul>
        <li>✅ Confirm your travel dates and <strong>book refundable flights/accommodation</strong> (or use a reservation service).</li>
        <li>✅ Gather <strong>financial evidence</strong> — bank statements showing sufficient funds for your stay.</li>
        <li>✅ Get an <strong>employment letter</strong> confirming your job, salary, and approved leave dates.</li>
        <li>✅ Prepare <strong>invitation letter</strong> (if visiting someone in the UK).</li>
        <li>✅ Compile <strong>ties to home country</strong> — property deed, family photo, university enrolment, business registration.</li>
      </ul>

      <h3>Weeks 3-5 Before Travel</h3>
      <ul>
        <li>✅ Complete the <strong>online application</strong>.</li>
        <li>✅ Pay the <strong>£100 fee</strong>.</li>
        <li>✅ Book and attend <strong>biometrics</strong>.</li>
        <li>✅ Submit documents.</li>
      </ul>

      <h3>Weeks 1-3: Decision</h3>
      <ul>
        <li>✅ Standard processing: <strong>3 weeks</strong> (15 working days).</li>
        <li>✅ Collect passport with visa.</li>
        <li>✅ Confirm flights and travel arrangements.</li>
      </ul>

      <h2 id="critical-timing">Critical Timing Rules to Remember</h2>
      <p>These deadlines are hard rules — missing them means automatic problems:</p>
      <table>
        <thead><tr><th>Rule</th><th>Deadline</th><th>Consequence if Missed</th></tr></thead>
        <tbody>
          <tr><td>CoS validity</td><td>3 months from assignment</td><td>Must request new CoS</td></tr>
          <tr><td>TB certificate validity</td><td>6 months from test date</td><td>Must retake test</td></tr>
          <tr><td>Financial evidence (Skilled Worker)</td><td>28 days held, ending within 31 days of application</td><td>Financial requirement not met</td></tr>
          <tr><td>Financial evidence (Spouse)</td><td>6 months, ending within 28 days of application</td><td>Financial requirement not met</td></tr>
          <tr><td>Vignette entry</td><td>90 days from visa grant</td><td>Entry clearance expires; must request new vignette</td></tr>
          <tr><td>BRP collection</td><td>10 days from UK arrival</td><td>Immigration offence</td></tr>
          <tr><td>Biometrics after online application</td><td>Within 90 days</td><td>Application lapses</td></tr>
        </tbody>
      </table>

      <h2 id="tips">Timeline Planning Tips</h2>
      <ol>
        <li><strong>Work backwards from your target date</strong> — when do you need to be in the UK? Subtract processing time + document preparation time.</li>
        <li><strong>Start criminal record certificates first</strong> — they take the longest and you can&apos;t control the speed.</li>
        <li><strong>Don&apos;t take the TB test too early</strong> — 3-4 weeks before application submission is ideal.</li>
        <li><strong>Keep a tracking spreadsheet</strong> — list every document, its status, and when you expect it.</li>
        <li><strong>Build in 2-4 weeks of buffer</strong> — things always take longer than expected.</li>
        <li><strong>Coordinate with your sponsor/employer</strong> — they may need time to prepare their side of the evidence.</li>
      </ol>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Get Your Personalised Timeline</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Every visa journey is different. Our free tool generates a personalised document checklist with recommended timelines based on your specific visa type and circumstances.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Start My Free Checklist
        </Link>
      </div>
    </GuideLayout>
  );
}
