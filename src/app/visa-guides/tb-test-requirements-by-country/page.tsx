import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TB Test Requirements by Country for UK Visa 2025 | VisaBud',
  description: 'Find out if you need a tuberculosis (TB) test for your UK visa application. Complete list of countries requiring a TB test, how to book an approved clinic, costs, and what happens during the screening.',
};

const faqs = [
  {
    question: 'Do I need a TB test for a UK visa?',
    answer: 'You need a TB test if you are applying for a UK visa lasting more than 6 months and you are a resident of a country on the Home Office TB testing list. This includes most countries in Africa, South/Southeast Asia, the Middle East, and parts of Eastern Europe and South America.',
  },
  {
    question: 'How much does a TB test for a UK visa cost?',
    answer: 'The TB test typically costs between £50-£150 depending on the country. Some clinics may charge more in major cities. The cost is not refundable, even if your visa application is refused.',
  },
  {
    question: 'How long is a TB test certificate valid for?',
    answer: 'A TB test certificate is valid for 6 months from the date of the test. If your visa application is still being processed after 6 months, you may need to take a new test.',
  },
  {
    question: 'What happens during a TB test for UK visa?',
    answer: 'The test involves a chest X-ray. A doctor at an approved clinic will examine the X-ray for signs of active TB. If the X-ray is clear, you receive a certificate on the same day or within a few days. If TB is suspected, you may need further tests (sputum samples), which can take 2-8 weeks.',
  },
  {
    question: 'What if I have had TB in the past?',
    answer: 'If you have had TB previously and been fully treated, you should bring evidence of your treatment to the screening appointment. The doctor will assess whether you are clear of active TB. A history of TB does not automatically prevent you from getting a visa.',
  },
  {
    question: 'Are children exempt from the TB test?',
    answer: 'Children under 11 are generally not required to have a chest X-ray unless there is clinical concern. Children aged 11 and above must take the test like adults if applying from a listed country.',
  },
];

const checklistPreview = [
  { text: 'Check if your country is on the TB testing list', critical: true },
  { text: 'Find an approved IOM clinic in your country', critical: true },
  { text: 'Book appointment (bring passport + photos)', critical: true },
  { text: 'Receive certificate (valid 6 months)', critical: false },
  { text: 'Include certificate with visa application', critical: false },
  { text: 'Pregnant women: inform clinic beforehand', critical: false },
];

const relatedGuides = [
  { title: 'UK Spouse Visa Checklist 2025', href: '/visa-guides/spouse-visa-checklist-2025' },
  { title: 'Skilled Worker Visa Documents', href: '/visa-guides/skilled-worker-visa-documents' },
  { title: 'How to Apply for a UK Visa', href: '/visa-guides/how-to-apply-uk-visa' },
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'UK Visa Timeline Planning', href: '/visa-guides/uk-visa-timeline-planning' },
];

export default function TBTestRequirements() {
  return (
    <GuideLayout
      title="TB Test Requirements by Country for UK Visa (2025)"
      subtitle="Everything you need to know about the tuberculosis screening requirement — which countries are listed, how to book an approved clinic, costs, and what to expect."
      lastUpdated="April 2025"
      readTime="10 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        If you&apos;re applying for a UK visa that lasts <strong>more than 6 months</strong>, you may need to take a <strong>tuberculosis (TB) screening test</strong> before you apply. This is a mandatory requirement for residents of countries on the Home Office&apos;s TB testing list.
      </p>
      <p>
        The test is a simple chest X-ray done at an approved clinic. If you&apos;re clear, you&apos;ll receive a certificate to include with your visa application. Without it, your application will be automatically refused.
      </p>

      <h2 id="who-needs">Who Needs a TB Test?</h2>
      <p>You need a TB test if:</p>
      <ul>
        <li>You are applying for a visa lasting <strong>more than 6 months</strong> (work, family, student, settlement).</li>
        <li>You are a <strong>resident of a listed country</strong> (see the full list below).</li>
        <li>You are <strong>aged 11 or older</strong> (under-11s are generally exempt).</li>
      </ul>
      <p>You do NOT need a TB test if:</p>
      <ul>
        <li>You are applying for a <strong>visit visa</strong> (6 months or less).</li>
        <li>You are a resident of a <strong>non-listed country</strong> (e.g., USA, Canada, most EU countries, Japan, Australia).</li>
        <li>You are a <strong>returning UK resident</strong> who has been away for less than 2 years (with proof of previous UK residence).</li>
        <li>You are a <strong>diplomat or their family member</strong>.</li>
      </ul>

      <h2 id="country-list">Countries Requiring TB Testing</h2>
      <p>The following countries are on the Home Office TB testing list. Residents of these countries must provide a TB certificate when applying for a UK visa of more than 6 months.</p>

      <h3>Africa</h3>
      <p>
        Angola, Benin, Botswana, Burkina Faso, Burundi, Cameroon, Cape Verde, Central African Republic, Chad, Comoros, Congo, Côte d&apos;Ivoire, Democratic Republic of the Congo, Djibouti, Equatorial Guinea, Eritrea, Eswatini (Swaziland), Ethiopia, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Kenya, Lesotho, Liberia, Madagascar, Malawi, Mali, Mauritania, Mauritius, Mozambique, Namibia, Niger, Nigeria, Rwanda, São Tomé and Príncipe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa, South Sudan, Sudan, Tanzania, Togo, Uganda, Zambia, Zimbabwe.
      </p>

      <h3>Asia</h3>
      <p>
        Afghanistan, Bangladesh, Bhutan, Brunei, Cambodia, China, East Timor, Hong Kong, India, Indonesia, Laos, Macau, Malaysia, Mongolia, Myanmar (Burma), Nepal, North Korea, Pakistan, Papua New Guinea, Philippines, Singapore, South Korea, Sri Lanka, Taiwan, Thailand, Vietnam.
      </p>

      <h3>Middle East</h3>
      <p>
        Bahrain, Iran, Iraq, Israel, Jordan, Kuwait, Lebanon, Oman, Palestinian Territories, Qatar, Saudi Arabia, Syria, United Arab Emirates, Yemen.
      </p>

      <h3>Europe</h3>
      <p>
        Belarus, Georgia, Kazakhstan, Kyrgyzstan, Moldova, Russia, Tajikistan, Turkmenistan, Ukraine, Uzbekistan.
      </p>

      <h3>Americas</h3>
      <p>
        Bolivia, Brazil, Colombia, Ecuador, Guatemala, Guyana, Haiti, Honduras, Mexico, Nicaragua, Panama, Paraguay, Peru, Suriname.
      </p>

      <h3>Pacific</h3>
      <p>
        Fiji, Kiribati, Marshall Islands, Micronesia, Nauru, Palau, Samoa, Solomon Islands, Tonga, Tuvalu, Vanuatu.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-blue-800 font-medium">💡 Note</p>
        <p className="text-sm text-blue-700 mt-1">This list is subject to change. Always verify the current list on GOV.UK before booking your test. If your country was recently added or removed, check the date your application is submitted against the list in force at that time.</p>
      </div>

      <h2 id="how-to-book">How to Book a TB Test</h2>
      <p>TB tests must be done at a clinic approved by the International Organization for Migration (IOM) or the Home Office.</p>
      <ol>
        <li><strong>Find your nearest approved clinic</strong> — search on GOV.UK for &quot;tuberculosis tests for UK visa&quot; and select your country. This lists all approved clinics with addresses and contact details.</li>
        <li><strong>Book an appointment</strong> — most clinics allow online or phone bookings. Some accept walk-ins, but booking is recommended.</li>
        <li><strong>Bring the following to your appointment:</strong>
          <ul>
            <li>Your current valid passport</li>
            <li>One passport-sized photograph (35mm × 45mm)</li>
            <li>The clinic fee (in local currency or as specified by the clinic)</li>
            <li>Any previous TB treatment records (if applicable)</li>
          </ul>
        </li>
        <li><strong>Attend the screening</strong> — a doctor will take a chest X-ray and examine it.</li>
        <li><strong>Receive your certificate</strong> — if clear, usually within 1-3 days. Some clinics provide same-day results.</li>
      </ol>

      <h2 id="what-happens">What Happens During the Test?</h2>
      <p>The TB screening is straightforward:</p>
      <ul>
        <li><strong>Chest X-ray:</strong> A standard X-ray of your chest. Takes about 5 minutes. You&apos;ll need to remove clothing from your upper body (you may be given a gown).</li>
        <li><strong>Doctor&apos;s assessment:</strong> A radiologist or doctor reviews the X-ray for signs of active pulmonary TB.</li>
        <li><strong>If clear:</strong> You receive a certificate stating you are free of active TB. This is valid for 6 months.</li>
        <li><strong>If inconclusive:</strong> You may need further tests — usually sputum samples (you cough into containers over 2-3 days). Lab results take 2-8 weeks.</li>
        <li><strong>If positive:</strong> You will be referred for treatment. You cannot get a TB certificate until you complete treatment and are clear of active TB. Treatment typically takes 6-9 months.</li>
      </ul>

      <h3>Special Circumstances</h3>
      <ul>
        <li><strong>Pregnant women:</strong> You should inform the clinic that you are pregnant. In early pregnancy, an X-ray may be delayed or the clinic may take additional precautions (lead apron shielding). Some clinics may request a medical letter confirming pregnancy stage.</li>
        <li><strong>Children under 11:</strong> Generally exempt from chest X-ray. If there is clinical concern, the doctor may examine the child physically.</li>
        <li><strong>Previous BCG vaccination:</strong> The BCG vaccine does not affect the chest X-ray result. Having been vaccinated does not exempt you from the test.</li>
        <li><strong>Previous TB treatment:</strong> Bring your treatment completion records. The doctor will assess whether you are currently clear.</li>
      </ul>

      <h2 id="validity-timing">Certificate Validity and Timing</h2>
      <p>
        Your TB test certificate is valid for <strong>6 months</strong> from the date of the test. This means:
      </p>
      <ul>
        <li>Don&apos;t take the test too early — if your application takes longer than expected, the certificate may expire before a decision is made.</li>
        <li>Don&apos;t take it too late — allow at least 1-2 weeks for the test and certificate to be ready before you submit your application.</li>
        <li><strong>Ideal timing:</strong> Take the test 2-4 weeks before you plan to submit your visa application.</li>
      </ul>
      <p>
        If your certificate expires during processing, UKVI may contact you to provide a new one. This adds significant delays — plan your timing carefully.
      </p>

      <h2 id="costs">TB Test Costs by Region</h2>
      <p>Costs vary by country and clinic. Here are approximate ranges:</p>
      <table>
        <thead><tr><th>Region</th><th>Approximate Cost</th></tr></thead>
        <tbody>
          <tr><td>India</td><td>₹3,400 (approx. £35)</td></tr>
          <tr><td>Pakistan</td><td>PKR 12,000-15,000 (approx. £35-£45)</td></tr>
          <tr><td>Nigeria</td><td>₦35,000-50,000 (approx. £30-£40)</td></tr>
          <tr><td>Bangladesh</td><td>BDT 5,000-7,000 (approx. £35-£50)</td></tr>
          <tr><td>Philippines</td><td>PHP 3,500-5,000 (approx. £50-£70)</td></tr>
          <tr><td>South Africa</td><td>ZAR 1,200-2,000 (approx. £50-£80)</td></tr>
          <tr><td>Kenya</td><td>KES 7,000-10,000 (approx. £40-£60)</td></tr>
          <tr><td>China</td><td>CNY 600-1,000 (approx. £65-£110)</td></tr>
        </tbody>
      </table>
      <p>Payment methods vary — some clinics accept cash only, others take cards. Check in advance.</p>

      <h2 id="common-issues">Common Issues</h2>
      <ul>
        <li><strong>Certificate expired before decision:</strong> Plan your timing. Take the test 2-4 weeks before applying, not 4-5 months before.</li>
        <li><strong>Clinic not approved:</strong> Tests from non-approved clinics are not accepted. Always verify the clinic is listed on GOV.UK.</li>
        <li><strong>Incorrect personal details:</strong> The name and passport number on the certificate must match your visa application exactly.</li>
        <li><strong>Lost certificate:</strong> Contact the clinic for a replacement. Some charge a reissue fee.</li>
        <li><strong>Applying from a non-listed country as a listed-country national:</strong> It&apos;s based on where you <em>reside</em>, not your nationality. If you&apos;re a Nigerian national living in the USA, you don&apos;t need a TB test.</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Check All Your Requirements at Once</h3>
        <p className="text-sm text-emerald-700 mb-3">
          TB test is just one piece of the puzzle. Our free tool checks your country, visa type, and circumstances to generate a complete personalised checklist — including whether you need a TB test.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Generate My Free Checklist
        </Link>
      </div>
    </GuideLayout>
  );
}
