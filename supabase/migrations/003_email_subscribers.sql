-- Email Subscribers table for pre-paywall list building
-- GDPR compliant: explicit consent + timestamp + easy unsubscribe

CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  visa_type TEXT,                         -- spouse, skilled_worker, citizenship
  nationality TEXT,
  urgency TEXT,                           -- urgent, normal, ahead
  tags TEXT[] DEFAULT '{}',              -- Segmentation tags: visa:spouse, stage:free_user, etc.
  source TEXT DEFAULT 'wizard',           -- wizard, footer, landing
  subscribed BOOLEAN DEFAULT true,
  email_consent BOOLEAN DEFAULT false,
  email_consent_timestamp TIMESTAMPTZ,
  last_email_sent_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  sendgrid_contact_id TEXT,              -- External reference for SendGrid
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for drip processing queries
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed 
  ON email_subscribers(subscribed) WHERE subscribed = true;

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email 
  ON email_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_visa_type 
  ON email_subscribers(visa_type);

-- Email sent log for tracking drip sequences
CREATE TABLE IF NOT EXISTS email_sent_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_email TEXT NOT NULL REFERENCES email_subscribers(email) ON DELETE CASCADE,
  template_id TEXT NOT NULL,              -- welcome, tip_1, upsell_review, etc.
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ,                 -- Tracking pixel (if implemented)
  clicked_at TIMESTAMPTZ                  -- Link click tracking
);

CREATE INDEX IF NOT EXISTS idx_email_sent_log_subscriber 
  ON email_sent_log(subscriber_email);

CREATE INDEX IF NOT EXISTS idx_email_sent_log_template 
  ON email_sent_log(template_id);

-- Add email fields to existing users table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    -- Add email_subscribed column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_subscribed') THEN
      ALTER TABLE users ADD COLUMN email_subscribed BOOLEAN DEFAULT false;
    END IF;
    
    -- Add email_consent_timestamp column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_consent_timestamp') THEN
      ALTER TABLE users ADD COLUMN email_consent_timestamp TIMESTAMPTZ;
    END IF;
    
    -- Add sendgrid_contact_id column
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'sendgrid_contact_id') THEN
      ALTER TABLE users ADD COLUMN sendgrid_contact_id TEXT;
    END IF;
  END IF;
END $$;

-- RLS policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sent_log ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access on email_subscribers"
  ON email_subscribers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on email_sent_log"
  ON email_sent_log FOR ALL
  USING (auth.role() = 'service_role');

-- Users can read their own subscription status
CREATE POLICY "Users can read own email_subscribers"
  ON email_subscribers FOR SELECT
  USING (email = auth.jwt()->>'email');
