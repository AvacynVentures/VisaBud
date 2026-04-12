import type { Metadata } from 'next';
import GuideLayout from '@/components/GuideLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'UK Visa Processing Times 2025: Every Visa Type | VisaBud',
  description: 'Current UK visa processing times for 2025. Spouse visa, skilled worker, student, visitor, and all other visa types. Plus priority service options and tips to speed up your application.',
};

const faqs = [
  {
    question: 'How long does a UK spouse visa take to process?',
    answer: 'UK spouse visa applications typically take 12 weeks (60 working days) from the date of your biometrics appointment. Priority service can reduce this to 5-10 working days for an additional fee of £500-£1,000.',
  },
  {
    question: 'How long does a UK Skilled Worker visa take?',
    answer: 'Skilled Worker visa applications from outside the UK take approximately 3 weeks. Applications to switch within the UK take about 8 weeks. Priority service (5 working days) and super-priority (next working day) are available.',
  },
  {
    question: 'Can I speed up my UK visa application?',
    answer: 'Yes, most visa types offer priority processing for an additional fee. Options include Priority (5-10 working days, £500) and Super Priority (1-2 working days, £800-£1,000). Not all visa types and countries offer these services.',
  },
  {
    question: 'Why is my UK visa taking longer than expected?',
    answer: 'Common reasons include: the caseworker has requested additional documents, your application was selected for further checks (security or verification), the processing centre is experiencing a backlog, or there are complexities in your case (previous refusals, criminal history).',
  },
  {
    question: 'What does "awaiting decision" mean on my visa tracking?',
    answer: 'It means your application has been reviewed and a caseworker has made a decision, but the decision letter has not yet been dispatched to the visa application centre. It usually takes 1-5 working days for the decision to be communicated after this status appears.',
  },
  {
    question: 'Can I contact UKVI about my visa application?',
    answer: 'Yes, you can contact UKVI through their paid phone line or email service. Phone costs £0.69/min from UK landlines. However, contacting them will not speed up your application. Only contact if your application has exceeded published processing times.',
  },
];

const checklistPreview = [
  { text: 'Check current processing times before applying', critical: true },
  { text: 'Submit complete application to avoid delays', critical: true },
  { text: 'Consider priority service if time-sensitive', critical: false },
  { text: 'Track application via VFS/TLS portal', critical: false },
  { text: 'Keep passport ready for collection', critical: false },
  { text: 'Plan travel after vignette is granted (90 days)', critical: false },
];

const relatedGuides = [
  { title: 'How to Apply for a UK Visa', href: '/visa-guides/how-to-apply-uk-visa' },
  { title: 'UK Visa Fees and Costs 2025', href: '/visa-guides/uk-visa-fees-costs' },
  { title: 'Common Visa Rejection Reasons', href: '/visa-guides/common-visa-rejection-reasons' },
  { title: 'UK Visa Timeline Planning', href: '/visa-guides/uk-visa-timeline-planning' },
  { title: 'UK Visa Interview Preparation', href: '/visa-guides/uk-visa-interview-preparation' },
];

export default function UKVisaProcessingTimes() {
  return (
    <GuideLayout
      title="UK Visa Processing Times 2025: Complete Guide by Visa Type"
      subtitle="How long each UK visa type really takes in 2025. Current standard and priority processing times, what affects speed, and how to plan your timeline."
      lastUpdated="April 2025"
      readTime="10 min"
      faqs={faqs}
      checklistPreview={checklistPreview}
      relatedGuides={relatedGuides}
    >
      <p>
        One of the most stressful parts of any visa application is the <strong>wait</strong>. Will it take 3 weeks or 3 months? Can you book flights? Should you give notice at your job?
      </p>
      <p>
        This guide gives you <strong>realistic processing times</strong> for every major UK visa type in 2025, based on Home Office published targets and real applicant experiences. We also cover priority services, what causes delays, and how to plan your timeline.
      </p>

      <h2 id="processing-times-table">Current Processing Times (2025)</h2>
      <p>These are the current Home Office target times, measured from the date of your biometrics appointment:</p>

      <table>
        <thead>
          <tr><th>Visa Type</th><th>Standard Time</th><th>Priority Available?</th><th>Priority Time</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Standard Visitor</strong></td><td>3 weeks (15 working days)</td><td>Yes, in some countries</td><td>5-7 working days</td></tr>
          <tr><td><strong>Skilled Worker (outside UK)</strong></td><td>3 weeks</td><td>Yes</td><td>5 working days</td></tr>
          <tr><td><strong>Skilled Worker (switch in UK)</strong></td><td>8 weeks</td><td>Yes</td><td>5 working days</td></tr>
          <tr><td><strong>Health &amp; Care Worker</strong></td><td>3 weeks</td><td>Yes</td><td>5 working days</td></tr>
          <tr><td><strong>Spouse/Family (outside UK)</strong></td><td>12 weeks (60 working days)</td><td>Limited</td><td>5-10 working days</td></tr>
          <tr><td><strong>Spouse/Family (switch in UK)</strong></td><td>8 weeks</td><td>Yes</td><td>5 working days</td></tr>
          <tr><td><strong>Student Visa</strong></td><td>3 weeks (outside UK) / 8 weeks (in UK)</td><td>Yes</td><td>5 working days</td></tr>
          <tr><td><strong>Graduate Visa</strong></td><td>8 weeks</td><td>No</td><td>—</td></tr>
          <tr><td><strong>Global Talent</strong></td><td>8 weeks (endorsement) + 3 weeks (visa)</td><td>No</td><td>—</td></tr>
          <tr><td><strong>Indefinite Leave to Remain</strong></td><td>6 months</td><td>Yes (walk-in)</td><td>Same day / next day</td></tr>
          <tr><td><strong>Naturalisation (Citizenship)</strong></td><td>6 months</td><td>No</td><td>—</td></tr>
        </tbody>
      </table>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 not-prose">
        <p className="text-sm text-amber-800 font-medium">⚠️ Important note</p>
        <p className="text-sm text-amber-700 mt-1">These are target times, not guarantees. Actual processing can be faster or slower depending on the complexity of your case, the processing centre workload, and whether additional checks are needed.</p>
      </div>

      <h2 id="priority-services">Priority and Super-Priority Services</h2>
      <p>
        For time-sensitive applications, UKVI offers expedited processing. Availability depends on visa type and country of application.
      </p>

      <h3>Priority Service</h3>
      <ul>
        <li><strong>Cost:</strong> £500 (outside UK) or £500 (inside UK)</li>
        <li><strong>Speed:</strong> Decision within 5 working days of biometrics</li>
        <li><strong>Available for:</strong> Most work visas, family visas, student visas</li>
        <li><strong>Not available for:</strong> Graduate visa, some citizenship applications</li>
      </ul>

      <h3>Super Priority Service</h3>
      <ul>
        <li><strong>Cost:</strong> £800-£1,000</li>
        <li><strong>Speed:</strong> Decision by end of next working day</li>
        <li><strong>Available for:</strong> In-UK applications only (switching, extending)</li>
        <li><strong>Booking:</strong> Limited availability — book well in advance</li>
      </ul>

      <h3>ILR Walk-in / Same-Day Service</h3>
      <ul>
        <li><strong>Cost:</strong> £800</li>
        <li><strong>Speed:</strong> Decision on the same day you attend</li>
        <li><strong>Available for:</strong> Settlement (ILR) applications at premium service centres</li>
        <li><strong>Booking:</strong> Must book online — slots fill fast, especially in London</li>
      </ul>

      <h2 id="factors">What Affects Processing Speed?</h2>
      <p>Several factors can make your application faster or slower:</p>

      <h3>Things That Speed Up Processing</h3>
      <ul>
        <li><strong>Complete application</strong> — no missing documents or unanswered questions.</li>
        <li><strong>Straightforward case</strong> — no previous refusals, overstays, or criminal history.</li>
        <li><strong>Clear financial evidence</strong> — well-organised bank statements that clearly show the threshold.</li>
        <li><strong>Priority service</strong> — paying for expedited processing.</li>
        <li><strong>Off-peak timing</strong> — applying outside busy seasons (August-October for students, January-March for family visas).</li>
      </ul>

      <h3>Things That Slow Down Processing</h3>
      <ul>
        <li><strong>Missing documents</strong> — the caseworker must request them, adding weeks.</li>
        <li><strong>Previous refusals or immigration issues</strong> — triggers additional scrutiny.</li>
        <li><strong>Complex financial arrangements</strong> — self-employment income, multiple sources, or cash savings require more verification.</li>
        <li><strong>Security checks</strong> — certain nationalities or backgrounds trigger additional security screening that can add 3-6 months.</li>
        <li><strong>High-volume periods</strong> — summer is the busiest time for most visa categories.</li>
        <li><strong>Application errors</strong> — inconsistencies between your form and documents flag your application for review.</li>
      </ul>

      <h2 id="tracking">How to Track Your Application</h2>
      <p>After submitting, you can monitor progress:</p>
      <ul>
        <li><strong>VFS Global tracking:</strong> Use your GWF reference number at vfsglobal.com. Statuses include &quot;Application Received,&quot; &quot;In Process,&quot; &quot;Processed,&quot; and &quot;Ready for Collection.&quot;</li>
        <li><strong>TLS Contact tracking:</strong> Similar system if you applied through a TLS centre.</li>
        <li><strong>UKVI email updates:</strong> You&apos;ll receive email notifications for key milestones.</li>
        <li><strong>Paid enquiry line:</strong> Call UKVI on their paid line (£0.69/min) if your application has exceeded standard processing times.</li>
      </ul>

      <h2 id="realistic-timeline">Realistic Timeline Expectations</h2>
      <p>Here&apos;s what a realistic end-to-end timeline looks like for common visa types:</p>

      <h3>Spouse Visa (from outside UK)</h3>
      <ul>
        <li>Document preparation: 4-8 weeks</li>
        <li>Application submission + biometrics: 1-2 weeks</li>
        <li>Processing: 12 weeks (standard) / 5-10 days (priority)</li>
        <li>Vignette collection + travel: 1-2 weeks</li>
        <li><strong>Total: 4-6 months (standard) or 2-3 months (priority)</strong></li>
      </ul>

      <h3>Skilled Worker Visa (from outside UK)</h3>
      <ul>
        <li>CoS assigned by employer: 1-4 weeks</li>
        <li>Application submission + biometrics: 1 week</li>
        <li>Processing: 3 weeks (standard) / 5 days (priority)</li>
        <li>Vignette collection + travel: 1-2 weeks</li>
        <li><strong>Total: 6-10 weeks (standard) or 3-4 weeks (priority)</strong></li>
      </ul>

      <h3>Settlement (ILR)</h3>
      <ul>
        <li>Document preparation: 2-4 weeks</li>
        <li>Life in the UK test: 1-2 weeks (including study time)</li>
        <li>Application + biometrics: 1 week</li>
        <li>Processing: 6 months (standard) / same day (walk-in)</li>
        <li><strong>Total: 7+ months (standard) or 1-2 months (walk-in)</strong></li>
      </ul>

      <p>
        For a detailed week-by-week plan, check our <Link href="/visa-guides/uk-visa-timeline-planning" className="text-blue-600">visa timeline planning guide</Link>.
      </p>

      <h2 id="what-to-do">What to Do While Waiting</h2>
      <ul>
        <li><strong>Don&apos;t book non-refundable travel</strong> — until you have your visa in hand.</li>
        <li><strong>Keep your email updated</strong> — UKVI communicates primarily by email.</li>
        <li><strong>Don&apos;t submit a new application</strong> — this can cause confusion and delays with your existing one.</li>
        <li><strong>Prepare for arrival</strong> — research accommodation, register for services, and plan your first weeks in the UK.</li>
        <li><strong>Keep original documents safe</strong> — you may need them when you arrive.</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-8 not-prose">
        <h3 className="font-bold text-emerald-900 text-lg mb-2">🎯 Plan Your Timeline Properly</h3>
        <p className="text-sm text-emerald-700 mb-3">
          Our free tool generates a personalised document checklist AND a recommended timeline based on your visa type and circumstances. Start planning today.
        </p>
        <Link href="/app/start" className="inline-block bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Get My Free Checklist & Timeline
        </Link>
      </div>
    </GuideLayout>
  );
}
