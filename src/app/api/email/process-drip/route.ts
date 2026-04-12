import { NextRequest, NextResponse } from 'next/server';
import {
  getNextSequenceStep,
  getTemplateHtml,
  canSendEmail,
  type EmailSubscriber,
} from '@/lib/email-automation';

/**
 * POST /api/email/process-drip
 * 
 * Background job to process email drip sequences.
 * Should be called by a cron job (e.g., Vercel Cron, every 6 hours).
 * 
 * Authorization: requires CRON_SECRET header.
 * Rate limit: max 1 email per 3 days per subscriber.
 * Batch size: processes up to 50 subscribers per run.
 */
export async function POST(req: NextRequest) {
  // Verify authorization
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get active subscribers who haven't unsubscribed
    const { data: subscribers, error: fetchErr } = await supabase
      .from('email_subscribers')
      .select('*')
      .eq('subscribed', true)
      .order('created_at', { ascending: true })
      .limit(50);

    if (fetchErr || !subscribers) {
      return NextResponse.json({ error: 'Failed to fetch subscribers', detail: fetchErr?.message }, { status: 500 });
    }

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      // Check rate limit (3 days between emails)
      if (!canSendEmail(sub.last_email_sent_at)) {
        skipped++;
        continue;
      }

      // Get completed email steps for this subscriber
      const { data: sentEmails } = await supabase
        .from('email_sent_log')
        .select('template_id')
        .eq('subscriber_email', sub.email);

      const completedSteps = (sentEmails || []).map((e: any) => e.template_id);

      const subscriber: EmailSubscriber = {
        email: sub.email,
        visa_type: sub.visa_type,
        nationality: sub.nationality,
        urgency: sub.urgency,
        tags: sub.tags || [],
        subscribed: sub.subscribed,
        created_at: sub.created_at,
        last_email_sent_at: sub.last_email_sent_at,
      };

      // Find next email to send
      const nextStep = getNextSequenceStep(subscriber, completedSteps);

      if (!nextStep) {
        skipped++;
        continue;
      }

      // Generate email content
      const html = getTemplateHtml(nextStep.templateId, subscriber);
      if (!html) {
        skipped++;
        continue;
      }

      // Resolve subject line placeholders
      const visaLabel = sub.visa_type === 'spouse' ? 'Spouse/Partner Visa'
        : sub.visa_type === 'skilled_worker' ? 'Skilled Worker Visa'
        : sub.visa_type === 'citizenship' ? 'British Citizenship'
        : 'UK Visa';
      const subject = nextStep.subject.replace('{{visa_type}}', visaLabel);

      // Send via Resend or SendGrid
      let emailSent = false;

      if (process.env.RESEND_API_KEY) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || 'VisaBud <hello@visabud.co.uk>',
              to: sub.email,
              subject,
              html,
            }),
          });
          emailSent = res.ok;
          if (!res.ok) {
            errors.push(`Resend failed for ${sub.email}: ${await res.text()}`);
          }
        } catch (e: any) {
          errors.push(`Resend error for ${sub.email}: ${e.message}`);
        }
      } else if (process.env.SENDGRID_API_KEY) {
        try {
          const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: sub.email }] }],
              from: { email: process.env.EMAIL_FROM_ADDRESS || 'hello@visabud.co.uk', name: 'VisaBud' },
              subject,
              content: [{ type: 'text/html', value: html }],
            }),
          });
          emailSent = res.ok || res.status === 202;
          if (!emailSent) {
            errors.push(`SendGrid failed for ${sub.email}: ${await res.text()}`);
          }
        } catch (e: any) {
          errors.push(`SendGrid error for ${sub.email}: ${e.message}`);
        }
      } else {
        // No email provider configured — log only
        console.log(`[DRY RUN] Would send "${subject}" to ${sub.email}`);
        emailSent = true; // Mark as sent in dev mode
      }

      if (emailSent) {
        // Log the sent email
        await supabase.from('email_sent_log').insert({
          subscriber_email: sub.email,
          template_id: nextStep.templateId,
          subject,
          sent_at: new Date().toISOString(),
        });

        // Update last_email_sent_at
        await supabase
          .from('email_subscribers')
          .update({
            last_email_sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('email', sub.email);

        sent++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: subscribers.length,
      sent,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error('Drip processing error:', err);
    return NextResponse.json({ error: 'Internal error', detail: err.message }, { status: 500 });
  }
}
