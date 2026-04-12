import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UK Citizenship Requirements 2025: Complete Naturalisation Guide | VisaBud',
  description: 'Everything you need to know about becoming a British citizen in 2025. Residency requirements, Life in the UK test, English language proof, good character, and the full naturalisation process.',
};

const faqs = [
  {
    question: 'How long do you need to live in the UK to get citizenship?',
    answer: 'You generally need to have lived in the UK for at least 5 years (or 3 years if married to a British citizen) before applying for naturalisation. You must have had Indefinite Leave to Remain (ILR) or settled status for at least 12 months at the time of application.',
  },
  {
    question: 'How much does it cost to apply for British citizenship?',
    answer: 'The application fee for adult naturalisation is £1,580 (as of 2025). This includes a £80 citizenship ceremony fee. The Life in the UK test costs £50, and you may also need to pay for an English language test (£150-£200) if you don\'t have other proof.',
  },
  {
    question: 'Do I need to give up my other citizenship?',
    answer: 'The UK allows dual citizenship — you do not need to give up your existing nationality to become British. However, your home country may not allow dual nationality, so check their rules.',
  },
  {
    question: 'What is the Life in the UK test?',
    answer: 'The Life in the UK test is a computer-based multiple-choice test with 24 questions. You need to score at least 75% (18/24) to pass. It covers British values, history, traditions, and everyday life. The test costs £50 and you can book it online at approved test centres.',
  },
  {
    question: 'Can my children become British citizens?',
    answer: 'Children born in the UK to a British citizen parent are automatically British. Children born outside the UK to a British citizen parent may also be eligible. Children who are not automatically British can be registered as British citizens — the fee is £1,214.',
  },
  {
    question: 'How long does the citizenship application take?',
    answer: 'The Home Office aims to process citizenship applications within 6 months. In practice, most applications take 3-6 months. After approval, you must attend a citizenship ceremony within 3 months.',
  },
];

const checklistPreview = [
  { text: '5 years continuous UK residence (or 3 if married to British citizen)', critical: true },
  { text: 'Indefinite Leave to Remain / Settled Status for 12+ months', critical: true },
  { text: 'Life in the UK test pass certificate', critical: true },
  { text: 'English language at B1 level or above', critical: true },
  { text: 'Good character (no serious criminal convictions)', critical: false },
  { text: 'Two referees', critical: false },
  { text: 'Passport and BRP card', critical: false },
  { text: 'No excessive absences from UK', critical: false },
];

const relatedGuides = [
  { title: 'UK Spouse Visa Checklist 2025', href: '/visa-guides/spouse-visa-checklist-2025' },
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'UK Visa Processing Times', href: '/visa-guides/uk-visa-processing-times' },
  { title: 'UK Visa Interview Preparation', href: '/visa-guides/uk-visa-interview-preparation' },
  { title: 'UK Visa Timeline Planning', href: '/visa-guides/uk-visa-timeline-planning' },
];

export default function UKCitizenshipRequirements() {
  return (
    <GuideLayout
      title="UK Citizenship Requirements 2025: Your Complete Guide to Naturalisation"
      subtitle="Ready to become a British citizen? Here's everything you need to know — residency rules, the Life in the UK test, language requirements, and the full step-by-step process."
      lastUpdated="April 2025"
      readTime="15 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        Becoming a <strong>British citizen</strong> through naturalisation is the final step in your immigration journey. It gives you the right to live and work in the UK permanently, vote in all elections, hold a British passport, and pass citizenship to your children.
      </p>
      <p>
        The process is straightforward if you plan ahead — but the requirements are strict. This guide walks you through every requirement, every document, and every step of the naturalisation process in 2025.
      </p>

      <h2 id="eligibility">Eligibility Requirements</h2>
      <p>To apply for British citizenship through naturalisation, you must meet <strong>all</strong> of the following requirements:</p>

      <h3>1. Age Requirement</h3>
      <p>You must be <strong>18 years or older</strong>. Children under 18 are registered (not naturalised) — this is a different process with different rules.</p>

      <h3>2. Residency Requirement</h3>
      <p>This is the most complex requirement. The rules depend on your relationship status:</p>
      <ul>
        <li><strong>Married to a British citizen:</strong> You must have lived in the UK for at least <strong>3 years</strong> before your application date.</li>
        <li><strong>Not married to a British citizen:</strong> You must have lived in the UK for at least <strong>5 years</strong> before your application date.</li>
      </ul>
      <p>Additionally:</p>
      <ul>
        <li>You must have had <strong>Indefinite Leave to Remain (ILR)</strong>, EU Settled Status, or equivalent for at least <strong>12 months</strong> at the time of application.</li>
        <li>You must not have been in breach of immigration laws during the residency period.</li>
      </ul>

      <h3>3. Absence Limits</h3>
      <p>This catches many applicants off-guard. During your qualifying period:</p>
      <ul>
        <li><strong>5-year route:</strong> No more than 450 days absent from the UK in the 5-year period, and no more than 90 days in the final 12 months.</li>
        <li><strong>3-year route:</strong> No more than 270 days absent from the UK in the 3-year period, and no more than 90 days in the final 12 months.</li>
      </ul>
      <p>
        <strong>Important:</strong> Count your absences carefully. The Home Office will check your travel history against passport stamps, airline records, and other data. If you&apos;re close to the limit, consider waiting until you have more margin.
      </p>

      <h3>4. Life in the UK Test</h3>
      <p>
        You must pass the <strong>Life in the UK test</strong> — a computer-based exam testing your knowledge of British history, values, traditions, and everyday life.
      </p>
      <p>Key details:</p>
      <ul>
        <li><strong>Format:</strong> 24 multiple-choice questions, 45 minutes.</li>
        <li><strong>Pass mark:</strong> 75% (18 out of 24 correct).</li>
        <li><strong>Cost:</strong> £50 per attempt. No limit on retakes, but you must wait 7 days between attempts.</li>
        <li><strong>Study material:</strong> The official handbook is &quot;Life in the United Kingdom: A Guide for New Residents&quot; (3rd edition). All questions come from this book.</li>
        <li><strong>Booking:</strong> Book online at <strong>lifeintheuktest.gov.uk</strong>. Centres are available across the UK.</li>
        <li><strong>Validity:</strong> Your pass does not expire — once passed, you can use it for any future citizenship or settlement application.</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-blue-800 font-medium">💡 Study tip</p>
        <p className="text-sm text-blue-700 mt-1">Most people study for 2-4 weeks. Focus on the chapters about British history and the political system — these have the most questions. Practice tests are available free online.</p>
      </div>

      <h3>5. English Language Requirement</h3>
      <p>
        You must prove your English at <strong>CEFR level B1</strong> or above (speaking, listening, reading, and writing). This is the same level required for ILR. If you already proved B1 for your settlement application, you can use the same evidence.
      </p>
      <p>Ways to prove English:</p>
      <ul>
        <li>An approved <strong>SELT test</strong> at B1 or above (IELTS Life Skills B1, Trinity ISE I, etc.).</li>
        <li>A <strong>degree taught in English</strong>, confirmed by UK ENIC.</li>
        <li>Being a <strong>national of a majority English-speaking country</strong>.</li>
        <li>If you passed the English requirement for <strong>ILR/settlement</strong>, you don&apos;t need to re-prove it.</li>
      </ul>
      <p>
        <strong>Exemptions:</strong> People aged 65+ and those with certain physical or mental conditions may be exempt.
      </p>

      <h3>6. Good Character Requirement</h3>
      <p>
        The Home Office will assess your &quot;good character.&quot; Factors they consider include:
      </p>
      <ul>
        <li><strong>Criminal convictions</strong> — any unspent convictions can lead to refusal. Serious convictions (4+ years imprisonment) result in automatic refusal.</li>
        <li><strong>Immigration offences</strong> — overstaying, working illegally, or using deception in previous applications.</li>
        <li><strong>Financial soundness</strong> — bankruptcy or insolvency may be considered.</li>
        <li><strong>Tax compliance</strong> — evidence of deliberate tax evasion can count against you.</li>
        <li><strong>Counter-terrorism</strong> — associations with extremist groups or activities.</li>
      </ul>
      <p>Spent convictions (under the Rehabilitation of Offenders Act) are generally not held against you, but they should still be declared on your application.</p>

      <h3>7. Intention to Live in the UK</h3>
      <p>
        You must intend to continue living in the UK (or continue in Crown service or work for a UK-based organisation abroad). If you plan to emigrate immediately after getting your passport, this could be grounds for refusal.
      </p>

      <h2 id="documents">Documents You&apos;ll Need</h2>
      <p>Gather these before starting your application:</p>

      <h3>Identity Documents</h3>
      <ul>
        <li><strong>Current valid passport</strong></li>
        <li><strong>Biometric Residence Permit (BRP)</strong> — showing your ILR/settled status</li>
        <li><strong>Previous passports</strong> — covering the qualifying residency period (to verify absences)</li>
        <li><strong>Birth certificate</strong> — original, with certified translation if not in English</li>
      </ul>

      <h3>Residency Evidence</h3>
      <ul>
        <li><strong>Travel history</strong> — dates of all trips outside the UK during the qualifying period. Be precise.</li>
        <li><strong>Proof of UK address</strong> — utility bills, council tax bills, bank statements spanning the residency period.</li>
        <li><strong>P60s or tax returns</strong> — for each year of the qualifying period.</li>
      </ul>

      <h3>Test Certificates</h3>
      <ul>
        <li><strong>Life in the UK test pass letter</strong></li>
        <li><strong>English language evidence</strong> (test certificate, degree, or nationality exemption)</li>
      </ul>

      <h3>Referees</h3>
      <p>You need <strong>two referees</strong> who:</p>
      <ul>
        <li>Have known you for at least 3 years</li>
        <li>Are aged 25+</li>
        <li>Are British citizens (or hold another type of professional standing)</li>
        <li>Are not your relative, solicitor, or agent</li>
        <li>One must be a professional person (doctor, teacher, solicitor, bank manager, etc.)</li>
      </ul>

      <h2 id="application-process">The Application Process</h2>
      <ol>
        <li><strong>Check eligibility</strong> — use the GOV.UK tool or our free wizard to confirm you qualify.</li>
        <li><strong>Pass the Life in the UK test</strong> — if you haven&apos;t already.</li>
        <li><strong>Complete form AN</strong> — the naturalisation application form, submitted online via GOV.UK.</li>
        <li><strong>Pay the fee</strong> — £1,580 (includes the £80 ceremony fee).</li>
        <li><strong>Submit biometrics</strong> — attend a UKVCAS appointment to give fingerprints and a photo.</li>
        <li><strong>Submit documents</strong> — upload digitally or post originals (which will be returned).</li>
        <li><strong>Wait for decision</strong> — the Home Office aims for 6 months but it can vary.</li>
        <li><strong>Attend citizenship ceremony</strong> — within 3 months of approval. You&apos;ll take the oath/affirmation of allegiance and pledge of loyalty.</li>
        <li><strong>Receive your certificate</strong> — you are now a British citizen from the date of the ceremony.</li>
        <li><strong>Apply for a British passport</strong> — optional but recommended. Costs £82.50 (online) or £93 (paper).</li>
      </ol>

      <h2 id="costs-summary">Costs Summary</h2>
      <table>
        <thead>
          <tr><th>Item</th><th>Cost (2025)</th></tr>
        </thead>
        <tbody>
          <tr><td>Naturalisation application fee</td><td>£1,580</td></tr>
          <tr><td>Life in the UK test</td><td>£50</td></tr>
          <tr><td>English language test (if needed)</td><td>£150–£200</td></tr>
          <tr><td>Biometrics appointment</td><td>£0 (included)</td></tr>
          <tr><td>British passport (online application)</td><td>£82.50</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>£1,860–£1,910</strong></td></tr>
        </tbody>
      </table>

      <h2 id="common-issues">Common Issues and Pitfalls</h2>
      <ul>
        <li><strong>Exceeding absence limits</strong> — the single most common reason for refusal or delay. Track your travel meticulously.</li>
        <li><strong>Applying too early</strong> — ensure you have held ILR for at least 12 months. Applying at 11 months will be refused.</li>
        <li><strong>Incorrect referee details</strong> — referees must meet specific criteria. Don&apos;t use relatives or your immigration solicitor.</li>
        <li><strong>Not declaring spent convictions</strong> — even minor driving offences should be declared. Non-disclosure is deception.</li>
        <li><strong>Passport gaps</strong> — if you don&apos;t have passports covering the full residency period, provide an explanation and alternative evidence (flight bookings, employment records).</li>
      </ul>

      <h2 id="after-ceremony">After Your Citizenship Ceremony</h2>
      <p>Congratulations — you&apos;re British! Here&apos;s what to do next:</p>
      <ul>
        <li><strong>Apply for a British passport</strong> — you can do this immediately online.</li>
        <li><strong>Register to vote</strong> — you now have full voting rights in all UK elections.</li>
        <li><strong>Update your records</strong> — bank, employer, HMRC, DVLA, GP.</li>
        <li><strong>Check dual nationality rules</strong> — confirm your other country allows dual citizenship.</li>
        <li><strong>Keep your naturalisation certificate safe</strong> — it&apos;s very expensive to replace (£250).</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Plan Your Path to Citizenship</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Whether you&apos;re on a spouse visa, skilled worker visa, or another route — our free tool helps you understand exactly what documents you need at every stage of your journey to British citizenship.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Plan My Visa Journey — Free
        </Link>
      </div>
    </GuideLayout>
  );
}
