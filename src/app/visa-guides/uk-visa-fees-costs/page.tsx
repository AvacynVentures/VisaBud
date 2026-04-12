import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UK Visa Fees and Costs 2025: Complete Breakdown | VisaBud',
  description: 'Full breakdown of UK visa fees for 2025. Application fees, IHS surcharge, biometric costs, priority service fees, and hidden costs most applicants miss. Every visa type covered.',
};

const faqs = [
  {
    question: 'How much does a UK visa cost in 2025?',
    answer: 'UK visa costs range from £100 (standard visitor visa) to over £5,000 (spouse visa total). The main components are the application fee, Immigration Health Surcharge (IHS), biometric enrolment fee, and optional priority service. For example, a spouse visa from outside the UK costs approximately £4,400-£5,000 in total.',
  },
  {
    question: 'What is the Immigration Health Surcharge (IHS)?',
    answer: 'The IHS is a mandatory payment for most visa applicants staying in the UK for more than 6 months. It costs £1,035 per year (or £776 for students and under-18s). It gives you access to NHS healthcare on the same basis as UK residents.',
  },
  {
    question: 'Can I get a refund on my visa fee if refused?',
    answer: 'The visa application fee is non-refundable, even if your application is refused. However, the Immigration Health Surcharge is refunded automatically if your visa is refused or you leave the UK before your visa expires.',
  },
  {
    question: 'Is there a fee waiver for UK visa applications?',
    answer: 'Fee waivers are available in very limited circumstances — primarily for applications based on human rights (Article 8 ECHR) where the applicant cannot afford the fee and has no alternative source of funding. You must provide extensive evidence of financial hardship.',
  },
  {
    question: 'How much does priority processing cost?',
    answer: 'Priority processing costs £500 (for a decision in 5 working days) and Super Priority costs £800-£1,000 (for a next-day decision, in-UK only). Not all visa types and countries offer priority services.',
  },
  {
    question: 'Do children pay the same visa fees as adults?',
    answer: 'Children generally pay the same application fee as adults. However, the IHS is reduced to £776 per year for under-18s (compared to £1,035 for adults). Some visa categories have specific fee reductions for dependants.',
  },
];

const checklistPreview = [
  { text: 'Budget for application fee + IHS + biometrics', critical: true },
  { text: 'Check if priority service is needed and available', critical: false },
  { text: 'Include dependant fees in your budget', critical: false },
  { text: 'Allow for translation and certification costs', critical: false },
  { text: 'Keep payment confirmation for your records', critical: false },
  { text: 'Check if fee waiver eligibility applies', critical: false },
];

const relatedGuides = [
  { title: 'UK Spouse Visa Checklist 2025', href: '/visa-guides/spouse-visa-checklist-2025' },
  { title: 'Skilled Worker Visa Documents', href: '/visa-guides/skilled-worker-visa-documents' },
  { title: 'UK Visa Processing Times', href: '/visa-guides/uk-visa-processing-times' },
  { title: 'How to Apply for a UK Visa', href: '/visa-guides/how-to-apply-uk-visa' },
  { title: 'UK Visa Timeline Planning', href: '/visa-guides/uk-visa-timeline-planning' },
];

export default function UKVisaFeesCosts() {
  return (
    <GuideLayout
      title="UK Visa Fees and Costs 2025: The Complete Breakdown"
      subtitle="Every fee, surcharge, and hidden cost you'll face when applying for a UK visa. We break it all down so there are no surprises."
      lastUpdated="April 2025"
      readTime="11 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        UK visa fees have increased significantly in recent years, and the <strong>total cost</strong> is often much higher than the headline application fee suggests. Between the application fee, Immigration Health Surcharge, biometric enrolment, and various optional services, many applicants end up spending thousands of pounds more than expected.
      </p>
      <p>
        This guide breaks down <strong>every cost</strong> for every major visa type, so you can budget accurately and avoid nasty surprises.
      </p>

      <h2 id="application-fees">Application Fees by Visa Type</h2>
      <p>These are the core application fees charged by the Home Office (as of April 2025):</p>

      <h3>Visit Visas</h3>
      <table>
        <thead><tr><th>Visa Type</th><th>Fee</th></tr></thead>
        <tbody>
          <tr><td>Standard Visitor (6 months)</td><td>£100</td></tr>
          <tr><td>Long-term Visitor (2 years)</td><td>£376</td></tr>
          <tr><td>Long-term Visitor (5 years)</td><td>£670</td></tr>
          <tr><td>Long-term Visitor (10 years)</td><td>£837</td></tr>
          <tr><td>Transit Visitor (airside)</td><td>£35</td></tr>
          <tr><td>Transit Visitor (landside)</td><td>£64</td></tr>
        </tbody>
      </table>

      <h3>Work Visas</h3>
      <table>
        <thead><tr><th>Visa Type</th><th>Up to 3 years</th><th>Over 3 years</th></tr></thead>
        <tbody>
          <tr><td>Skilled Worker (medium sponsor)</td><td>£719</td><td>£1,420</td></tr>
          <tr><td>Skilled Worker (small sponsor)</td><td>£719</td><td>£1,420</td></tr>
          <tr><td>Health &amp; Care Worker</td><td>£284</td><td>£551</td></tr>
          <tr><td>Global Talent</td><td colSpan={2}>£716</td></tr>
          <tr><td>Innovator Founder</td><td colSpan={2}>£1,191</td></tr>
          <tr><td>Graduate</td><td colSpan={2}>£822</td></tr>
        </tbody>
      </table>

      <h3>Family Visas</h3>
      <table>
        <thead><tr><th>Visa Type</th><th>Fee</th></tr></thead>
        <tbody>
          <tr><td>Spouse/Partner (from outside UK)</td><td>£1,846</td></tr>
          <tr><td>Spouse/Partner (extension in UK)</td><td>£1,048</td></tr>
          <tr><td>Parent visa</td><td>£1,846</td></tr>
          <tr><td>Child joining parent</td><td>£1,846</td></tr>
        </tbody>
      </table>

      <h3>Student Visas</h3>
      <table>
        <thead><tr><th>Visa Type</th><th>Fee</th></tr></thead>
        <tbody>
          <tr><td>Student (from outside UK)</td><td>£490</td></tr>
          <tr><td>Student (extension in UK)</td><td>£490</td></tr>
          <tr><td>Child Student</td><td>£490</td></tr>
        </tbody>
      </table>

      <h3>Settlement and Citizenship</h3>
      <table>
        <thead><tr><th>Application Type</th><th>Fee</th></tr></thead>
        <tbody>
          <tr><td>Indefinite Leave to Remain (ILR)</td><td>£2,885</td></tr>
          <tr><td>Naturalisation (British Citizenship)</td><td>£1,580</td></tr>
          <tr><td>Registration of a Child as British Citizen</td><td>£1,214</td></tr>
        </tbody>
      </table>

      <h2 id="ihs">Immigration Health Surcharge (IHS)</h2>
      <p>
        The <strong>IHS</strong> is charged on top of the application fee for most visas lasting more than 6 months. It gives you access to NHS healthcare at no additional cost (except prescription charges in England).
      </p>
      <table>
        <thead><tr><th>Applicant Type</th><th>Annual Rate</th></tr></thead>
        <tbody>
          <tr><td>Standard adult</td><td>£1,035/year</td></tr>
          <tr><td>Student</td><td>£776/year</td></tr>
          <tr><td>Under 18</td><td>£776/year</td></tr>
          <tr><td>Youth Mobility Scheme</td><td>£776/year</td></tr>
        </tbody>
      </table>
      <p>
        <strong>How it works:</strong> You pay upfront for the full duration of your visa. For a 2.5-year spouse visa, that&apos;s £1,035 × 2.5 = <strong>£2,587.50</strong>. For a 3-year skilled worker visa, it&apos;s £1,035 × 3 = <strong>£3,105</strong>.
      </p>
      <p>
        <strong>Exemptions:</strong> Health and Care Worker visa applicants and their dependants are exempt from the IHS. Some diplomatic staff and armed forces members are also exempt.
      </p>
      <p>
        <strong>Refunds:</strong> If your visa is refused, the IHS is refunded automatically. If you leave the UK before your visa expires, you can apply for a partial refund.
      </p>

      <h2 id="biometrics">Biometric Enrolment Fees</h2>
      <p>These fees are charged by the Visa Application Centre (VAC) — operated by VFS Global or TLS Contact — and are separate from the Home Office application fee.</p>
      <ul>
        <li><strong>Standard biometric appointment:</strong> Typically £55-£90, varies by country.</li>
        <li><strong>Premium lounge service:</strong> £100-£200 — faster processing, comfortable waiting area.</li>
        <li><strong>Self-upload of documents:</strong> Sometimes included, sometimes £25-£50 extra.</li>
        <li><strong>SMS notifications:</strong> £2-£5 for status update texts.</li>
        <li><strong>Courier return of passport:</strong> £20-£50 (to avoid collecting in person).</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-amber-800 font-medium">⚠️ Watch out for VAC upselling</p>
        <p className="text-sm text-amber-700 mt-1">VFS and TLS centres aggressively push premium services during your appointment. Most are unnecessary. The standard service is perfectly adequate — don&apos;t be pressured into paying for &quot;premium&quot; or &quot;gold&quot; packages.</p>
      </div>

      <h2 id="priority-fees">Priority Processing Fees</h2>
      <table>
        <thead><tr><th>Service Level</th><th>Cost</th><th>Speed</th><th>Availability</th></tr></thead>
        <tbody>
          <tr><td>Standard</td><td>Included</td><td>3-12 weeks</td><td>All applications</td></tr>
          <tr><td>Priority</td><td>£500</td><td>5 working days</td><td>Most visa types</td></tr>
          <tr><td>Super Priority</td><td>£800-£1,000</td><td>Next working day</td><td>In-UK applications only</td></tr>
          <tr><td>ILR Walk-in</td><td>£800</td><td>Same day</td><td>Settlement only</td></tr>
        </tbody>
      </table>

      <h2 id="hidden-costs">Hidden Costs Most Applicants Miss</h2>
      <p>Beyond the official fees, there are several costs that catch applicants by surprise:</p>

      <h3>Document Preparation</h3>
      <ul>
        <li><strong>Certified translations:</strong> £20-£50 per page. If you have 10 documents to translate, that&apos;s £200-£500.</li>
        <li><strong>English language test:</strong> £150-£200 for IELTS Life Skills or equivalent.</li>
        <li><strong>TB test:</strong> £50-£150 depending on the country.</li>
        <li><strong>Criminal record certificate:</strong> £0-£80 depending on the country (ACRO in the UK charges £55).</li>
        <li><strong>UK ENIC statement:</strong> £49.50 for degree comparison (if using overseas degree for English proof).</li>
      </ul>

      <h3>Professional Help</h3>
      <ul>
        <li><strong>Immigration solicitor:</strong> £1,000-£5,000+ depending on complexity.</li>
        <li><strong>Document review service:</strong> £200-£500 for professional review without full representation.</li>
        <li><strong>Cover letter drafting:</strong> £100-£300 from a professional.</li>
      </ul>

      <h3>Post-Visa Costs</h3>
      <ul>
        <li><strong>Flight to the UK:</strong> Variable, but plan ahead — you have 90 days to enter on your vignette.</li>
        <li><strong>BRP collection:</strong> Free, but you must do it within 10 days of arriving.</li>
        <li><strong>Life in the UK test:</strong> £50 (required for ILR and citizenship, not initial visas).</li>
      </ul>

      <h2 id="total-costs">Total Cost Examples</h2>
      <p>Here&apos;s what real applicants typically spend in total:</p>

      <h3>Spouse Visa (2.5 years, from outside UK)</h3>
      <table>
        <thead><tr><th>Item</th><th>Cost</th></tr></thead>
        <tbody>
          <tr><td>Application fee</td><td>£1,846</td></tr>
          <tr><td>IHS (2.5 years)</td><td>£2,587.50</td></tr>
          <tr><td>Biometrics + VAC fee</td><td>£80</td></tr>
          <tr><td>English test</td><td>£150</td></tr>
          <tr><td>TB test</td><td>£100</td></tr>
          <tr><td>Translations (5 docs)</td><td>£150</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>£4,913.50</strong></td></tr>
        </tbody>
      </table>

      <h3>Skilled Worker Visa (3 years)</h3>
      <table>
        <thead><tr><th>Item</th><th>Cost</th></tr></thead>
        <tbody>
          <tr><td>Application fee</td><td>£719</td></tr>
          <tr><td>IHS (3 years)</td><td>£3,105</td></tr>
          <tr><td>Biometrics + VAC fee</td><td>£80</td></tr>
          <tr><td>Criminal record certificate</td><td>£55</td></tr>
          <tr><td>English test</td><td>£170</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>£4,129</strong></td></tr>
        </tbody>
      </table>

      <h2 id="saving-money">Tips to Reduce Costs</h2>
      <ul>
        <li><strong>Apply online</strong> — it&apos;s cheaper than paper applications (where available).</li>
        <li><strong>Skip unnecessary VAC services</strong> — the standard appointment is sufficient.</li>
        <li><strong>Use VisaBud instead of a solicitor</strong> — our free checklist tool ensures you have the right documents without the £1,000+ solicitor fee.</li>
        <li><strong>Book your English test early</strong> — last-minute bookings may only be available at distant centres, adding travel costs.</li>
        <li><strong>Get translations from approved translators</strong> — not the most expensive agency in town.</li>
        <li><strong>Apply at the right time</strong> — submitting a complete, correct application the first time avoids refusal and having to pay again.</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Know Exactly What You Need — For Free</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Don&apos;t spend £1,000+ on a solicitor for a straightforward application. Our free tool generates a personalised document checklist so you know exactly what to prepare.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Generate My Free Checklist
        </Link>
      </div>
    </GuideLayout>
  );
}
