// Email sending utilities (Resend integration)

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const emailTemplates = {
  welcome: (_userEmail: string): EmailTemplate => ({
    subject: "You've got 3 free AI document checks waiting 🎉",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 32px 20px; }
    .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
    .logo { font-size: 20px; font-weight: 700; color: #1e3a8a; margin-bottom: 24px; }
    h1 { font-size: 22px; color: #1e3a8a; margin: 0 0 12px 0; }
    p { font-size: 14px; line-height: 1.6; color: #334155; }
    .check-item { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px; margin: 10px 0; }
    .check-title { font-weight: 700; color: #166534; font-size: 14px; margin: 0 0 4px 0; }
    .check-desc { font-size: 12px; color: #15803d; margin: 0; }
    .free-badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-left: 6px; }
    .cta { display: inline-block; background: #1d4ed8; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 20px 0; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
    .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">VisaBud</div>
      <h1>Your account is ready — and you have 3 free AI checks waiting.</h1>
      <p>Hi,</p>
      <p>Most people preparing a UK visa application don't know what they're missing until it's too late. These 3 free AI checks are designed to catch the issues that cause refusals — before you submit.</p>

      <div class="check-item">
        <p class="check-title">&#x1F4B0; Financial Documents Cross-Check <span class="free-badge">FREE</span></p>
        <p class="check-desc">Upload your bank statements + payslips. AI flags salary mismatches, period gaps, and threshold issues.</p>
      </div>

      <div class="check-item">
        <p class="check-title">&#x1FAA3; Passport Identity &amp; Fraud Check <span class="free-badge">FREE</span></p>
        <p class="check-desc">Upload your passport. AI checks expiry date, MRZ integrity, and name consistency across your documents.</p>
      </div>

      <div class="check-item">
        <p class="check-title">&#x1F3E0; Accommodation &amp; Address Check <span class="free-badge">FREE</span></p>
        <p class="check-desc">Upload your proof of address. AI extracts and cross-references your address across all your documents.</p>
      </div>

      <p style="margin-top: 16px;">These checks are completely free. No payment needed.</p>

      <a href="https://visabud.co.uk/applications" class="cta">Start My Free AI Checks &rarr;</a>

      <hr class="divider">
      <p style="font-size: 13px; color: #64748b;">When you're ready for the full checklist — 30+ documents, 37 preparation templates, and complete risk management — it's a one-time payment from &pound;9.99.</p>
      <p style="font-size: 13px; color: #64748b;">Any questions? Just reply to this email.</p>
      <p style="font-size: 13px;">The VisaBud Team</p>
    </div>
    <div class="footer">
      <p>VisaBud Ltd &middot; Not a law firm &middot; For guidance only</p>
      <p>Always verify with official Gov.uk guidance before submitting your application.</p>
    </div>
  </div>
</body>
</html>`,
    text: `Your VisaBud account is ready — and you have 3 free AI checks waiting.

Hi,

Most people preparing a UK visa application don't know what they're missing until it's too late. These 3 free AI checks are designed to catch the issues that cause refusals — before you submit.

FREE: Financial Documents Cross-Check
Upload your bank statements + payslips. AI flags salary mismatches, period gaps, and threshold issues.

FREE: Passport Identity & Fraud Check
Upload your passport. AI checks expiry date, MRZ integrity, and name consistency across your documents.

FREE: Accommodation & Address Check
Upload your proof of address. AI extracts and cross-references your address for consistency.

Start your free checks: https://visabud.co.uk/applications

When you're ready for the full checklist (30+ documents, 37 templates, complete risk management), it's from £9.99 one-time.

The VisaBud Team

---
VisaBud Ltd · Not a law firm · For guidance only
`,
  }),

  paymentConfirmation: (_userEmail: string, downloadLink: string): EmailTemplate => ({
    subject: 'Your application pack is ready to download 📦',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { color: #1E3A8A; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { line-height: 1.6; margin-bottom: 20px; }
            .cta { background-color: #1E3A8A; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
            .footer { border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">VisaBud</div>
            <div class="content">
              <p>Payment confirmed! ✓</p>
              <p>Your application pack is ready.</p>
              <p><a href="${downloadLink}" class="cta">Download Your Pack</a></p>
              <p><strong>Pro tips:</strong></p>
              <ul>
                <li>Print it or save it to your phone</li>
                <li>Use it as a checklist while gathering documents</li>
                <li>Keep it with you at your biometric appointment</li>
                <li>Reference it when uploading to the portal</li>
              </ul>
              <p>Need help? Check out our FAQ or reply to this email.</p>
              <p>Good luck — you've got this! 🦅</p>
              <p>The VisaBud Team</p>
            </div>
            <div class="footer">
              <p>VisaBud Ltd · Not a law firm · For guidance only</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Payment confirmed! Your application pack is ready.

Download link: ${downloadLink}

Pro tips:
- Print it or save it to your phone
- Use as a checklist
- Keep it at biometric appointment
- Reference during submission

Good luck!

The VisaBud Team
    `,
  }),

  premiumReviewStarted: (_userEmail: string, tier: string): EmailTemplate => ({
    subject: 'Your document review has started 🔍',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { color: #1E3A8A; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { line-height: 1.6; margin-bottom: 20px; }
            .highlight { background: #F5F3FF; border-left: 4px solid #7C3AED; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
            .footer { border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">VisaBud</div>
            <div class="content">
              <p>Your ${tier === 'human_review_199' ? 'Expert Human' : 'AI Premium'} Document Review has started! 🎉</p>
              
              <div class="highlight">
                <p><strong>What's happening now:</strong></p>
                <ul>
                  <li>${tier === 'human_review_199' ? 'A qualified immigration expert is reviewing your documents' : 'Our AI is performing a thorough analysis of each document'}</li>
                  <li>Each document is checked against official UKVI requirements</li>
                  <li>Cross-document consistency checks are running</li>
                  <li>Risk scoring and specific feedback is being generated</li>
                </ul>
              </div>

              <p><strong>Expected completion:</strong> ${tier === 'human_review_199' ? 'Within 24 hours' : 'Within minutes — check your dashboard'}</p>

              <p>Once complete, you'll see:</p>
              <ul>
                <li>🔴🟡🟢 Risk level per document</li>
                <li>📊 Confidence scores</li>
                <li>🔧 Specific issues with exact fixes</li>
                <li>🔗 Cross-document consistency findings</li>
                <li>📝 Overall assessment and priority actions</li>
              </ul>

              <p>Check your dashboard for results.</p>
              <p>The VisaBud Team</p>
            </div>
            <div class="footer">
              <p>VisaBud Ltd · Not a law firm · For guidance only</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your ${tier === 'human_review_199' ? 'Expert Human' : 'AI Premium'} Document Review has started!

What's happening: Each document is being checked against UKVI requirements with risk scoring and specific feedback.

Expected completion: ${tier === 'human_review_199' ? 'Within 24 hours' : 'Within minutes'}

Check your dashboard for results.

The VisaBud Team`,
  }),

  premiumReviewComplete: (_userEmail: string, overallRisk: string, issueCount: number): EmailTemplate => ({
    subject: `Your document review is complete ${overallRisk === 'low' ? '✅' : overallRisk === 'medium' ? '🟡' : '🔴'}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { color: #1E3A8A; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { line-height: 1.6; margin-bottom: 20px; }
            .cta { background-color: #7C3AED; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
            .risk-badge { display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px; }
            .risk-high { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
            .risk-medium { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
            .risk-low { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
            .footer { border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">VisaBud</div>
            <div class="content">
              <p>Your document review is complete!</p>
              
              <p>
                <span class="risk-badge risk-${overallRisk}">
                  Overall Risk: ${overallRisk.toUpperCase()}
                </span>
              </p>

              <p>We found <strong>${issueCount} issue${issueCount !== 1 ? 's' : ''}</strong> across your documents.</p>

              ${overallRisk === 'high' ? '<p>⚠️ <strong>Action required:</strong> Some documents have critical issues that could lead to refusal. Please review the detailed feedback on your dashboard and address them before submitting.</p>' : ''}
              ${overallRisk === 'medium' ? '<p>🟡 Some documents have issues worth addressing. While not critical, fixing them will strengthen your application.</p>' : ''}
              ${overallRisk === 'low' ? '<p>✅ Your documents look strong! Minor suggestions are included in your dashboard.</p>' : ''}

              <p><a href="#" class="cta">View Full Review on Dashboard</a></p>

              <p>The VisaBud Team</p>
            </div>
            <div class="footer">
              <p>VisaBud Ltd · Not a law firm · For guidance only</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your document review is complete!

Overall Risk: ${overallRisk.toUpperCase()}
Issues found: ${issueCount}

View your full review on the dashboard.

The VisaBud Team`,
  }),

  upsellReminder: (_userEmail: string): EmailTemplate => ({
    subject: 'Getting nervous about your documents? 😰',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { color: #1E3A8A; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { line-height: 1.6; margin-bottom: 20px; }
            .cta { background-color: #1E3A8A; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
            .footer { border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">VisaBud</div>
            <div class="content">
              <p>Hi,</p>
              <p>Most people tell us they're nervous about one thing: <strong>"What if I'm missing something?"</strong></p>
              <p>If that's you, we offer <strong>document reviews (£99)</strong> where we check your pack against official requirements and flag any gaps.</p>
              <p><a href="#" class="cta">Get Peace of Mind</a></p>
              <p>Reply to this email and we'll help.</p>
              <p>The VisaBud Team</p>
            </div>
            <div class="footer">
              <p>VisaBud Ltd · Not a law firm · For guidance only</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi,

Most people worry: "What if I'm missing something?"

We offer document reviews (£99) where we check your pack and flag gaps.

Reply to this email if interested.

The VisaBud Team
    `,
  }),
};

export async function sendEmail(
  to: string,
  template: EmailTemplate,
  resendApiKey: string = process.env.RESEND_API_KEY || ''
) {
  if (!resendApiKey) {
    console.error('[email] RESEND_API_KEY not set — cannot send email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VisaBud <noreply@visabud.co.uk>',
        reply_to: 'tim.bot@silvergriffindsc.com',
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[email] Resend API error:', res.status, errData);
      return { success: false, error: errData?.message || `Resend API error: ${res.status}` };
    }

    const data = await res.json();
    console.log(`[email] Sent to ${to}: ${template.subject} (id: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('[email] Send error:', err);
    return { success: false, error: err.message };
  }
}
