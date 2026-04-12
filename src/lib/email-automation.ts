/**
 * Email Automation Service
 * 
 * Handles drip sequences and scheduled emails.
 * Integrates with SendGrid or Resend for delivery.
 * 
 * Automation flows:
 *   Day 0:  Welcome email (triggered on subscribe)
 *   Day 3:  First tip email (visa-type-specific advice)
 *   Day 7:  Upsell email (£149 review tier)
 *   Day 14: Re-engagement (for non-payers)
 *   Day 30: £149 upsell follow-up
 * 
 * Rate limit: max 1 email per 3 days per subscriber.
 */

export interface EmailSubscriber {
  email: string;
  visa_type?: string;
  nationality?: string;
  urgency?: string;
  tags: string[];
  subscribed: boolean;
  created_at: string;
  last_email_sent_at?: string;
}

export type EmailSequenceStep = {
  day: number;
  templateId: string;
  subject: string;
  condition?: (subscriber: EmailSubscriber) => boolean;
};

// Drip sequence definition
export const EMAIL_SEQUENCES: EmailSequenceStep[] = [
  {
    day: 0,
    templateId: 'welcome',
    subject: 'Your personalised visa plan is ready 🎉',
  },
  {
    day: 3,
    templateId: 'tip_1',
    subject: 'Your #1 tip for a stronger {{visa_type}} application',
  },
  {
    day: 7,
    templateId: 'upsell_review',
    subject: 'Want an expert to double-check your documents? 📋',
    condition: (sub) => !sub.tags.includes('stage:paid_user'),
  },
  {
    day: 14,
    templateId: 're_engagement',
    subject: 'Still working on your application? Here\'s what most people forget',
    condition: (sub) => !sub.tags.includes('stage:paid_user'),
  },
  {
    day: 30,
    templateId: 'upsell_followup',
    subject: '£149 document review — before you submit your application',
    condition: (sub) => !sub.tags.includes('stage:paid_user'),
  },
];

// Visa-specific tip content
export const VISA_TIPS: Record<string, { tip: string; detail: string }> = {
  spouse: {
    tip: 'Make sure your sponsor\'s income evidence covers the full 6-month period',
    detail: 'The Home Office checks your partner\'s income for the 6 months before you apply. Missing even one payslip or bank statement can lead to a request for more evidence — or worse, a refusal. Get all 6 months of payslips + matching bank statements now.',
  },
  skilled_worker: {
    tip: 'Confirm your Certificate of Sponsorship (CoS) details match your passport exactly',
    detail: 'Even a small typo in your CoS (wrong date of birth, misspelled name) can delay your application by weeks. Ask your employer\'s HR team to double-check before you submit. This is free to fix before submission, but costly after.',
  },
  citizenship: {
    tip: 'Count your days outside the UK carefully — the 450-day rule catches people out',
    detail: 'You can\'t have spent more than 450 days outside the UK in the 5-year qualifying period. Holidays, business trips, family emergencies — they all count. Use your passport stamps and flight records to build an accurate travel history.',
  },
};

/**
 * Get email template HTML for a specific step
 */
export function getTemplateHtml(templateId: string, subscriber: EmailSubscriber): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://visabud.co.uk';
  const unsubUrl = `${appUrl}/api/email/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
  const visaType = subscriber.visa_type || 'general';
  const visaLabel = visaType === 'spouse' ? 'Spouse/Partner Visa'
    : visaType === 'skilled_worker' ? 'Skilled Worker Visa'
    : visaType === 'citizenship' ? 'British Citizenship'
    : 'UK Visa';

  const tip = VISA_TIPS[visaType] || VISA_TIPS.spouse;

  switch (templateId) {
    case 'tip_1':
      return wrapEmail(`
        <h1>Your #1 tip for the ${visaLabel}</h1>
        <p>Hi there,</p>
        <p>We've been helping hundreds of applicants prepare their ${visaLabel} applications. Here's the most important thing we've learned:</p>
        
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="font-weight: 600; color: #1e3a8a; margin: 0 0 8px 0;">💡 ${tip.tip}</p>
          <p style="font-size: 13px; color: #3b82f6; margin: 0;">${tip.detail}</p>
        </div>

        <p>Head to your dashboard to check this off your list:</p>
        <a href="${appUrl}/dashboard" style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">View My Checklist →</a>
        
        <p style="color: #64748b; font-size: 13px; margin-top: 20px;">More tips coming soon. We'll space them out — no spam, promise.</p>
      `, unsubUrl);

    case 'upsell_review':
      return wrapEmail(`
        <h1>Want peace of mind before you submit? 📋</h1>
        <p>Hi there,</p>
        <p>Most people tell us the scariest part isn't gathering documents — it's wondering <strong>"did I miss something?"</strong></p>
        <p>A single missing document can mean:</p>
        <ul style="color: #ef4444; font-size: 14px;">
          <li>Weeks of delays while they request more evidence</li>
          <li>Having to re-submit (and pay fees again)</li>
          <li>In worst cases, a full refusal</li>
        </ul>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="font-weight: 700; color: #166534; font-size: 18px; margin: 0 0 4px 0;">Document Review — £149</p>
          <p style="color: #15803d; font-size: 13px; margin: 0 0 12px 0;">We check your pack against official requirements and flag any gaps</p>
          <a href="${appUrl}/dashboard" style="display: inline-block; background: #16a34a; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Get Your Review →</a>
        </div>
        
        <p style="font-size: 13px; color: #64748b;">Not ready yet? No worries — your free checklist is always available in your dashboard.</p>
      `, unsubUrl);

    case 're_engagement':
      return wrapEmail(`
        <h1>Still working on your application? 👋</h1>
        <p>Hi there,</p>
        <p>It's been a couple of weeks since you created your ${visaLabel} plan. How's it going?</p>
        <p>Here's what most people forget at this stage:</p>
        <ul style="font-size: 14px; color: #334155;">
          <li><strong>Financial documents</strong> — bank statements must be recent (usually within 28 days of applying)</li>
          <li><strong>Translations</strong> — any document not in English needs a certified translation</li>
          <li><strong>Photos</strong> — biometric photos have strict requirements. Most high-street booths work</li>
        </ul>
        <p>Your personalised checklist has all of this and more:</p>
        <a href="${appUrl}/dashboard" style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Continue My Checklist →</a>
      `, unsubUrl);

    case 'upsell_followup':
      return wrapEmail(`
        <h1>Before you submit: one last check ✅</h1>
        <p>Hi there,</p>
        <p>If you're getting close to submitting your ${visaLabel} application, this is the most important email we'll send you.</p>
        <p>Our £149 document review catches an average of <strong>2.3 issues</strong> per application. Things like:</p>
        <ul style="font-size: 14px; color: #334155;">
          <li>Missing pages from bank statements</li>
          <li>Income evidence that doesn't cover the right period</li>
          <li>Documents that need to be certified but aren't</li>
          <li>Format issues that trigger unnecessary delays</li>
        </ul>
        
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="font-weight: 700; color: #1e3a8a; font-size: 16px; margin: 0 0 4px 0;">£149 now could save you £1,000+ in resubmission fees</p>
          <a href="${appUrl}/dashboard" style="display: inline-block; background: #1d4ed8; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 12px;">Get Expert Review →</a>
        </div>

        <p style="font-size: 13px; color: #64748b;">This is the last upsell email we'll send. From here, we'll only share useful tips and updates. Good luck with your application! 🦅</p>
      `, unsubUrl);

    default:
      return '';
  }
}

function wrapEmail(content: string, unsubUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 32px 20px; }
    .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
    .logo { font-size: 20px; font-weight: 700; color: #1e3a8a; margin-bottom: 24px; }
    h1 { font-size: 20px; color: #1e3a8a; margin: 0 0 16px 0; }
    p { font-size: 14px; line-height: 1.6; }
    ul { line-height: 1.8; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    .footer a { color: #64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">VisaBud</div>
      ${content}
      <div class="footer">
        <p>VisaBud Ltd · Not a law firm · For guidance only</p>
        <p><a href="${unsubUrl}">Unsubscribe</a> · You received this because you signed up at VisaBud</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Check minimum spacing between emails (3 days)
 */
export function canSendEmail(lastSentAt?: string): boolean {
  if (!lastSentAt) return true;
  const lastSent = new Date(lastSentAt);
  const now = new Date();
  const diffDays = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 3;
}

/**
 * Determine which sequence step a subscriber should receive next
 */
export function getNextSequenceStep(
  subscriber: EmailSubscriber,
  completedSteps: string[]
): EmailSequenceStep | null {
  const subscribedDate = new Date(subscriber.created_at);
  const now = new Date();
  const daysSinceSubscribed = Math.floor(
    (now.getTime() - subscribedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  for (const step of EMAIL_SEQUENCES) {
    // Skip already completed
    if (completedSteps.includes(step.templateId)) continue;
    // Skip if not yet time
    if (daysSinceSubscribed < step.day) continue;
    // Check condition
    if (step.condition && !step.condition(subscriber)) continue;
    return step;
  }

  return null;
}
