/**
 * GET    /api/applications/{id}  — Get single application with full data
 * PATCH  /api/applications/{id}  — Update application (wizard answers, checklist, name)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { UpdateApplicationRequest } from '@/lib/application-types';

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

// ─── GET: Single Application ────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { applicationId } = params;

  try {
    const { data: app, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (app.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ application: app });
  } catch (error) {
    console.error(`[GET /applications/${applicationId}] Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

// ─── PATCH: Update Application ──────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { applicationId } = params;

  try {
    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('user_id')
      .eq('id', applicationId)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const body: UpdateApplicationRequest = await req.json();

    // Build update object (only include provided fields)
    const update: Record<string, unknown> = {};

    if (body.name !== undefined) update.name = body.name;
    if (body.nationality !== undefined) update.nationality = body.nationality;
    if (body.relationshipStatus !== undefined) update.relationship_status = body.relationshipStatus;
    if (body.currentlyInUk !== undefined) update.currently_in_uk = body.currentlyInUk;
    if (body.relationshipDurationMonths !== undefined) update.relationship_duration_months = body.relationshipDurationMonths;
    if (body.annualIncomeRange !== undefined) update.annual_income_range = body.annualIncomeRange;
    if (body.employmentStatus !== undefined) update.employment_status = body.employmentStatus;
    if (body.urgency !== undefined) update.urgency = body.urgency;
    if (body.targetApplicationDate !== undefined) update.target_application_date = body.targetApplicationDate;
    if (body.hasPreviousRefusal !== undefined) update.has_previous_refusal = body.hasPreviousRefusal;
    if (body.hasPreviousOverstay !== undefined) update.has_previous_overstay = body.hasPreviousOverstay;
    if (body.onboardingCompleted !== undefined) update.onboarding_completed = body.onboardingCompleted;
    if (body.checklistProgress !== undefined) update.checklist_progress = body.checklistProgress;
    if (body.status !== undefined) update.status = body.status;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data: app, error } = await supabaseAdmin
      .from('applications')
      .update(update)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error(`[PATCH /applications/${applicationId}] Error:`, error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    return NextResponse.json({ application: app });
  } catch (error) {
    console.error(`[PATCH /applications/${applicationId}] Unexpected error:`, error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
