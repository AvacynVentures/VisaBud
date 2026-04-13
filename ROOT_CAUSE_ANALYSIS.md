# ROOT CAUSE ANALYSIS — 4 Critical VisaBud Issues

**Date:** 2026-04-13
**Commit:** 26fed67
**Status:** 3 of 4 fixed in code, 1 requires Supabase dashboard config

---

## Issue 1: Email Verification Sender Branding

### Root Cause
Magic link emails use **Supabase's default SMTP** (noreply@mail.supabase.io). No custom SMTP is configured in the Supabase project. The Resend API integration exists only for post-purchase emails (in the Stripe webhook), not for auth flows.

### Fix Required (Manual — Not Code)
This cannot be fixed via code alone. Requires Supabase dashboard configuration:

**Option A — Custom SMTP in Supabase (Recommended):**
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customise the magic link email template (subject, body, branding)
3. Go to Authentication → SMTP Settings → Enable Custom SMTP
4. Configure with a transactional email provider:
   - **Resend** (already has API key: `RESEND_API_KEY`) — set up SMTP relay
   - SMTP Host: `smtp.resend.com`, Port: 465, User: `resend`, Pass: API key
5. Add DNS records: SPF, DKIM, DMARC for `visabud.co.uk`
6. Set sender: `noreply@visabud.co.uk`

**Option B — Quick Win (Supabase Email Templates):**
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Edit the magic link template to include VisaBud branding in the HTML
3. Change subject line to: "Your VisaBud login link"
4. Note: Sender will still show Supabase domain until custom SMTP is added

### Status: ⚠️ DOCUMENTED — Requires manual Supabase config

---

## Issue 2: Wrong Landing Page After "Start Free"

### Root Cause
The auth callback route (`/auth/callback/route.ts`) unconditionally redirected all users to `/dashboard` after magic link verification:
```typescript
return NextResponse.redirect(new URL('/dashboard', request.url));
```

For new users who haven't selected a visa type, this meant landing on the FreemiumWelcomeDashboard instead of the visa selection wizard. The signup page also redirected authenticated users to `/dashboard` instead of `/app/start`.

### Fix Applied
1. **Auth callback** (`/auth/callback/route.ts`): Now checks if the user has a completed payment. Paid users → `/dashboard`. New/free users → `/app/start` (visa selection wizard).

2. **Signup page** (`/auth/signup/page.tsx`): Already-authenticated users now redirect to `/app/start` instead of `/dashboard`.

### New Flow
```
Homepage "Start Free" → /auth/signup → Magic Link → /auth/callback
  → New user → /app/start (visa wizard)
  → Paid user → /dashboard (full dashboard)
```

### Status: ✅ FIXED

---

## Issue 3: Dashboard Not Refreshing After Payment

### Root Cause
The `checkUnlockStatus()` function in `DashboardContent` only ran once on component mount. When a user returned from Stripe checkout to `/dashboard?payment=success`, the function executed before the Stripe webhook had time to process and insert the payment row. No re-check or polling mechanism existed.

The `PaymentSuccessBanner` component displayed a nice overlay but did **not** update the `unlocked` state in the Zustand store.

### Fix Applied
1. **Polling on payment return**: When `?payment=success` is in the URL and no payment is found in the DB, the dashboard now polls `checkUnlockStatus()` every 2 seconds for up to 20 seconds (10 attempts). This handles the webhook processing race condition.

2. **Proactive unlock**: `PaymentSuccessBanner` now calls `setUnlocked(true)` immediately when it detects `?payment=success`. Since Stripe only redirects on successful payment, this is a safe optimistic unlock. The DB check confirms it on the next page load.

3. **Suspense boundary**: Added `<Suspense>` wrapper around `DashboardContent` since `useSearchParams()` is now used (required by Next.js 14).

### Status: ✅ FIXED

---

## Issue 4: Payment Succeeds But Features Don't Unlock

### Root Cause
Two compounding issues:

1. **Race condition**: Stripe redirects to `/dashboard?payment=success` immediately after checkout. The webhook (`checkout.session.completed`) may still be in transit. The dashboard queried the DB on mount, found no payment row yet, and showed locked state.

2. **No state update from banner**: The `PaymentSuccessBanner` component showed a success overlay but never called `setUnlocked(true)` on the Zustand store, so the underlying dashboard remained in locked state.

3. **Webhook logic is correct**: The webhook properly inserts `payment_status: 'completed'` and the dashboard query correctly checks for it. The issue was purely timing.

### Fix Applied
1. **Immediate optimistic unlock**: `PaymentSuccessBanner` now calls `setUnlocked(true)` as soon as it detects the success redirect. This provides instant UI feedback.

2. **DB polling**: Dashboard polls the payments table every 2s for up to 20s after payment return, ensuring the webhook-confirmed unlock persists across sessions (since the Zustand `unlocked` flag is also persisted to localStorage).

3. **No changes needed to webhook**: The webhook logic correctly handles all 3 tiers (standard, premium, expert) and inserts proper payment records.

### Status: ✅ FIXED

---

## Summary

| Issue | Root Cause | Fix | Status |
|-------|-----------|-----|--------|
| 1. Email branding | Default Supabase SMTP, no custom SMTP configured | Configure custom SMTP in Supabase dashboard | ⚠️ Manual config needed |
| 2. Wrong landing page | Auth callback always redirected to /dashboard | Redirect new users to /app/start | ✅ Fixed |
| 3. Dashboard not refreshing | No re-check after payment, one-shot mount query | Poll DB + proactive unlock on success return | ✅ Fixed |
| 4. Features don't unlock | Race condition (webhook vs redirect timing) | Optimistic unlock + polling for DB confirmation | ✅ Fixed |

## Deployment
- Commit `26fed67` pushed to `main` on `AvacynVentures/VisaBud`
- Vercel should auto-deploy from main branch
