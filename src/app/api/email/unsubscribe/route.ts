import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/email/unsubscribe?email=xxx
 * 
 * One-click unsubscribe (GDPR compliant).
 * Sets subscribed=false in the database.
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return new NextResponse(unsubscribeHtml('Missing email parameter.', false), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase
        .from('email_subscribers')
        .update({
          subscribed: false,
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase().trim());

      // Also update users table
      await supabase
        .from('users')
        .update({ email_subscribed: false, updated_at: new Date().toISOString() })
        .eq('email', email.toLowerCase().trim());
    }

    // Remove from SendGrid if configured
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (sendgridApiKey) {
      try {
        // Search for contact by email
        const searchRes = await fetch('https://api.sendgrid.com/v3/marketing/contacts/search/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emails: [email.toLowerCase().trim()] }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const contact = searchData.result?.[email.toLowerCase().trim()];
          if (contact?.contact?.id) {
            // Add to suppression group or delete
            await fetch(`https://api.sendgrid.com/v3/marketing/contacts?ids=${contact.contact.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${sendgridApiKey}` },
            });
          }
        }
      } catch (sgErr) {
        console.error('SendGrid unsubscribe error:', sgErr);
      }
    }

    return new NextResponse(unsubscribeHtml("You've been unsubscribed.", true), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return new NextResponse(unsubscribeHtml('Something went wrong. Please try again or contact us.', false), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function unsubscribeHtml(message: string, success: boolean): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - VisaBud</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px; }
    .card { max-width: 400px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #e2e8f0; }
    .icon { font-size: 40px; margin-bottom: 16px; }
    h1 { color: #1e3a8a; font-size: 20px; margin-bottom: 8px; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; }
    a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '✓' : '⚠️'}</div>
    <h1>${success ? 'Unsubscribed' : 'Error'}</h1>
    <p>${message}</p>
    ${success ? '<p style="margin-top: 16px;">We\'re sorry to see you go. You can always re-subscribe from your dashboard.</p>' : ''}
    <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || '/'}">← Back to VisaBud</a></p>
  </div>
</body>
</html>`;
}
