import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client (with service key for admin operations)
export const supabaseServer = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createClient(supabaseUrl, supabaseAnonKey);

/**
 * Save wizard answers to Supabase
 */
export async function saveWizardAnswers(sessionId: string, answers: any) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .upsert({
        session_id: sessionId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        visa_type: answers.visa,
        answers: JSON.stringify(answers),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'session_id',
      });

    if (error) {
      console.error('Error saving answers:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception saving answers:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Get user's session from Supabase
 */
export async function getSession(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching session:', err);
    return null;
  }
}

/**
 * Record payment in Supabase
 */
export async function recordPayment(userId: string, stripeSessionId: string, amount: number) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_session_id: stripeSessionId,
        amount,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error recording payment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception recording payment:', err);
    return { success: false, error: String(err) };
  }
}

/**
 * Update user unlock status
 */
export async function updateUserUnlockStatus(userId: string, unlocked: boolean) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        unlocked,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception updating user status:', err);
    return { success: false, error: String(err) };
  }
}

// ============================================================================
// FRAUD MONITORING - Silent tracking (no UI changes)
// ============================================================================

/**
 * Track a visa application submission (silent, non-blocking)
 * Called after user submits their application - never blocks the UI flow
 */
export async function trackVisaApplication(data: {
  applicant_name: string;
  applicant_email: string;
  applicant_passport_id?: string;
  visa_type: string;
}): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    // Get user's latest payment
    const { data: latestPayment } = await supabaseServer
      .from('payments')
      .select('id')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!latestPayment) return;

    // Record application (upsert to handle duplicates gracefully)
    await supabaseServer.from('visa_applications').upsert({
      user_id: userData.user.id,
      payment_id: latestPayment.id,
      applicant_name: data.applicant_name,
      applicant_email: data.applicant_email,
      applicant_passport_id: data.applicant_passport_id || null,
      visa_type: data.visa_type,
      application_status: 'submitted',
      submitted_at: new Date().toISOString(),
    }, {
      onConflict: 'payment_id,applicant_email,visa_type',
    });
  } catch (err) {
    // Silent fail - tracking should never break the user experience
    console.error('[tracking] Failed to track visa application:', err);
  }
}

/**
 * Track PDF export (silent, non-blocking)
 */
export async function trackPDFExport(visaType: string): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabaseServer.from('feature_access_logs').insert({
      user_id: userData.user.id,
      feature: 'pdf_export',
      visa_type: visaType,
      logged_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[tracking] Failed to track PDF export:', err);
  }
}

/**
 * Track template download (silent, non-blocking)
 */
export async function trackTemplateDownload(visaType: string): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabaseServer.from('feature_access_logs').insert({
      user_id: userData.user.id,
      feature: 'template_download',
      visa_type: visaType,
      logged_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[tracking] Failed to track template download:', err);
  }
}

/**
 * Track expert review access (silent, non-blocking)
 */
export async function trackExpertReview(visaType: string): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabaseServer.from('feature_access_logs').insert({
      user_id: userData.user.id,
      feature: 'expert_review',
      visa_type: visaType,
      logged_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[tracking] Failed to track expert review:', err);
  }
}

// ============================================================================
// EXISTING FUNCTIONS
// ============================================================================

/**
 * Add audit log entry
 */
export async function addAuditLog(userId: string, action: string) {
  try {
    const { error } = await supabase
      .from('audit_log')
      .insert({
        user_id: userId,
        action,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error adding audit log:', error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception adding audit log:', err);
    return { success: false };
  }
}
