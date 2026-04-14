import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/email/subscribe
 * 
 * Captures email for the pre-paywall list.
 * Stores in Supabase, optionally syncs to SendGrid.
 * GDPR: requires explicit consent + timestamp.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, visa_type, nationality, urgency, consent, consent_timestamp, source } = body;

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: 'Consent is required (GDPR)' }, { status: 400 });
    }

    // Determine tags for segmentation
    const tags: string[] = [];
    if (visa_type) tags.push(`visa:${visa_type}`);
    if (urgency) tags.push(`urgency:${urgency}`);
    tags.push('stage:free_user');
    if (source) tags.push(`source:${source}`);

    // Save to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Upsert into email_subscribers table
      const { error: dbError } = await supabase
        .from('email_subscribers')
        .upsert(
          {
            email: email.toLowerCase().trim(),
            visa_type: visa_type || null,
            nationality: nationality || null,
            urgency: urgency || null,
            tags,
            source: source || 'wizard',
            email_consent: true,
            email_consent_timestamp: consent_timestamp || new Date().toISOString(),
            subscribed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );

      if (dbError) {
        console.error('Supabase email_subscribers upsert error:', dbError);
        // Don't block the user - log and continue
      }

      // Also update users table if email matches an auth user
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existingUser) {
        await supabase
          .from('users')
          .update({
            email_subscribed: true,
            email_consent_timestamp: consent_timestamp || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id);
      }
    }

    // Return success immediately (async background jobs below)
    const responseToSend = NextResponse.json({
      success: true,
      message: 'Email saved! You will receive your plan shortly.',
    });

    // Fire-and-forget: Sync to SendGrid + send welcome email (don't await)
    // These happen in background and won't block the user
    (async () => {
      try {
        const sendgridApiKey = process.env.SENDGRID_API_KEY;
        if (sendgridApiKey) {
          await Promise.race([
            fetch('https://api.sendgrid.com/v3/marketing/contacts', {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${sendgridApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contacts: [
                  {
                    email: email.toLowerCase().trim(),
                    custom_fields: {
                      ...(visa_type && { e1: visa_type }),
                      ...(nationality && { e2: nationality }),
                      ...(urgency && { e3: urgency }),
                      e4: 'free_user',
                    },
                  },
                ],
                ...(process.env.SENDGRID_LIST_ID && {
                  list_ids: [process.env.SENDGRID_LIST_ID],
                }),
              }),
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('SendGrid timeout')), 5000)),
          ]);
        }

        // Send welcome email via Resend
        if (process.env.RESEND_API_KEY) {
          await Promise.race([
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: process.env.EMAIL_FROM || 'VisaBud <hello@visabud.co.uk>',
                to: email,
                subject: 'Your personalised visa plan is ready 🎉',
                html: getWelcomeEmailHtml(visa_type),
              }),
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Resend timeout')), 5000)),
          ]);
        }
      } catch (bgErr) {
        // Log but don't propagate (user already got their success response)
        console.error('Background email sync error:', bgErr);
      }
    })();

    return responseToSend;
  } catch (err: any) {
    console.error('Email subscribe error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Welcome email HTML (Day 0)
 */
function getWelcomeEmailHtml(visaType?: string): string {
  const visaLabel = visaType === 'spouse'
    ? 'Spouse/Partner Visa'
    : visaType === 'skilled_worker'
    ? 'Skilled Worker Visa'
    : visaType === 'citizenship'
    ? 'British Citizenship'
    : 'UK Visa';

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
    h1 { font-size: 22px; color: #1e3a8a; margin: 0 0 8px 0; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .tip-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .tip-title { font-size: 13px; font-weight: 600; color: #1e3a8a; margin-bottom: 8px; }
    .tip-list { list-style: none; padding: 0; margin: 0; }
    .tip-list li { font-size: 13px; color: #3b82f6; padding: 3px 0; }
    .tip-list li::before { content: "✓ "; color: #10b981; }
    .cta { display: inline-block; background: #1d4ed8; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    .footer a { color: #64748b; }
    p { font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">VisaBud</div>
      <h1>Thanks for using VisaBud! 🎉</h1>
      <p class="subtitle">Your ${visaLabel} plan has been created.</p>
      
      <p>We've put together a personalised plan based on your answers. Here's what happens next:</p>
      
      <div class="tip-box">
        <div class="tip-title">Over the next few weeks, we'll send you:</div>
        <ul class="tip-list">
          <li>Tips specific to the ${visaLabel}</li>
          <li>Common mistakes to avoid (and how to fix them)</li>
          <li>Deadline reminders so nothing slips through</li>
          <li>Updates when immigration rules change</li>
        </ul>
      </div>

      <p>In the meantime, head back to your dashboard to start working through your checklist.</p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://visabud.co.uk'}/dashboard" class="cta">View My Dashboard →</a>

      <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
        <strong>Tip:</strong> The biggest reason applications get refused? Missing documents. 
        Your checklist is designed to prevent exactly that.
      </p>

      <div class="footer">
        <p>VisaBud Ltd · Not a law firm · For guidance only</p>
        <p>You're receiving this because you signed up at VisaBud.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://visabud.co.uk'}/api/email/unsubscribe?email={{email}}">Unsubscribe</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
