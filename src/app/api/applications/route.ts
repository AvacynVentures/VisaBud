/**
 * GET  /api/applications     — List all applications for current user
 * POST /api/applications     — Create a new application
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { CreateApplicationRequest, ApplicationSummary } from '@/lib/application-types';
import { CHECKLISTS } from '@/lib/visa-data';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ─── GET: List Applications ─────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    // Look up custom users table ID from auth_id
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (!userData) {
      return NextResponse.json({ applications: [] });
    }

    const { data: apps, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('user_id', userData.id)
      .in('status', ['active', 'submitted'])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[GET /applications] Error:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    // Get document counts per application
    const appIds = (apps || []).map((a: Record<string, any>) => a.id);
    const docCounts: Record<string, number> = {};

    if (appIds.length > 0) {
      const { data: docs } = await supabaseAdmin
        .from('document_uploads')
        .select('application_id')
        .in('application_id', appIds)
        .is('replaced_by', null);

      if (docs) {
        for (const doc of docs as Array<{ application_id: string | null }>) {
          if (doc.application_id) {
            docCounts[doc.application_id] = (docCounts[doc.application_id] || 0) + 1;
          }
        }
      }
    }

    // Transform to summaries
    const applications: ApplicationSummary[] = (apps || []).map((app: Record<string, any>) => {
      const visaType = app.visa_type as 'spouse' | 'skilled_worker' | 'citizenship';
      const checklist = CHECKLISTS[visaType] || [];
      const checklistProgress = app.checklist_progress || {};
      const checklistCompleted = Object.values(checklistProgress).filter(Boolean).length;

      // Auto-generate name if not set
      const VISA_LABELS: Record<string, string> = {
        spouse: 'Spouse / Partner Visa',
        skilled_worker: 'Skilled Worker Visa',
        citizenship: 'British Citizenship',
      };

      return {
        id: app.id,
        name: app.name || VISA_LABELS[app.visa_type] || app.visa_type,
        visaType: app.visa_type,
        purchasedTier: app.purchased_tier,
        status: app.status,
        onboardingCompleted: app.onboarding_completed,
        checklistTotal: checklist.length,
        checklistCompleted,
        documentCount: docCounts[app.id] || 0,
        createdAt: app.created_at,
        updatedAt: app.updated_at,
      };
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('[GET /applications] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// ─── POST: Create Application ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  console.log('[POST /api/applications] Request received');
  console.log('[POST /api/applications] URL:', req.url);
  console.log('[POST /api/applications] Headers:', req.headers);
  
  const user = await getUser(req);
  console.log('[POST /api/applications] User:', user?.id);
  
  if (!user) {
    console.log('[POST /api/applications] No user - returning 401');
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body: CreateApplicationRequest = await req.json();
    console.log('[POST /api/applications] Body:', body);

    if (!body.visaType || !['spouse', 'skilled_worker', 'citizenship'].includes(body.visaType)) {
      return NextResponse.json({ error: 'Valid visa_type required' }, { status: 400 });
    }

    // Look up custom users table ID from auth_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (userError || !userData) {
      console.error('[POST /applications] User lookup failed:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Auto-generate name if not provided
    const VISA_NAMES: Record<string, string> = {
      spouse: 'Spouse / Partner Visa',
      skilled_worker: 'Skilled Worker Visa',
      citizenship: 'British Citizenship',
    };
    const autoName = body.name || VISA_NAMES[body.visaType] || body.visaType;

    const { data: app, error } = await supabaseAdmin
      .from('applications')
      .insert({
        user_id: userData.id,
        name: autoName,
        visa_type: body.visaType,
        nationality: body.nationality || null,
        relationship_status: body.relationshipStatus || null,
        currently_in_uk: body.currentlyInUk ?? null,
        relationship_duration_months: body.relationshipDurationMonths ?? null,
        annual_income_range: body.annualIncomeRange || null,
        employment_status: body.employmentStatus || null,
        urgency: body.urgency || null,
        target_application_date: body.targetApplicationDate || null,
        onboarding_completed: true,
        checklist_progress: {},
        purchased_tier: 'none',
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /applications] Error:', error);
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
    }

    console.log(`[POST /applications] Created ${app.id} for user ${user.id} (${body.visaType})`);

    return NextResponse.json({ application: app }, { status: 201 });
  } catch (error) {
    console.error('[POST /applications] Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
