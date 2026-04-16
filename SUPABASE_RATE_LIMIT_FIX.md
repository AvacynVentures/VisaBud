# Supabase Rate Limit Increase — Monday Launch Prep

**Status:** NEEDS RUAN ACTION (dashboard access required)
**Urgency:** Before Monday 17:00 launch

---

## Problem
Supabase GoTrue (auth service) has default rate limits:
- **3 signups per email per hour**
- **3-6 signups per IP per hour**
- **6 magic link requests per hour**

These are too strict for launch day. Users hitting rate limits on signup = bad UX + lost revenue.

---

## Solution: Increase Limits via Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Navigate to: https://app.supabase.com/
2. Select project: **visabud** (ID: `sviztvlddcqffjtuzwhw`)
3. Go to **Settings** (left sidebar) → **Auth**

### Step 2: Scroll to "Rate Limiting"
Look for section: **Rate Limit Configuration**

### Step 3: Update These Values
| Setting | Current | Recommended | Notes |
|---------|---------|-----------|-------|
| Signups per email per hour | 3 | 10 | Allows retries + multiple users from same org |
| Signups per IP per hour | 3-6 | 15 | Allows corporate/shared networks |
| Magic link requests per hour | 6 | 20 | Users can retry if email is slow |

### Step 4: Save Changes
Click **Save** and confirm.

---

## Monitoring After Launch (Monday 17:00)

Tim has set up **Sentry error tracking** (commit `20f3e5c`). This will track:
- Every rate limit block (with email domain + timestamps)
- Alert threshold: >10 blocks per hour = potential issue

**Dashboard:** https://sentry.io/ (will be live post-deployment with Sentry DSN in Vercel env vars)

---

## If You Can't Find Rate Limiting in Dashboard
1. Contact Supabase support (in-app chat, https://app.supabase.com/support)
2. Or check Supabase docs: https://supabase.com/docs/guides/platform/rate-limits

---

## Fallback: API Approach (Not Recommended)
If dashboard is unavailable, you can use Supabase Management API:
```bash
curl -X PATCH \
  https://api.supabase.com/v1/projects/sviztvlddcqffjtuzwhw/auth/config \
  -H "Authorization: Bearer YOUR_MANAGEMENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit_email_signup_confirm": 10,
    "rate_limit_ip_signup_confirm": 15,
    "rate_limit_email_token_create": 20
  }'
```

**Note:** Requires Supabase Management API key (not included in .env). Only do this if comfortable with API calls.

---

## What Tim Did (No Action Needed)
✅ Improved error messaging (commit `555192c`)
✅ Added Sentry monitoring (commit `20f3e5c`)
⏳ Waiting for: Rate limit increase in dashboard

---

**Action Required From Ruan:**
1. Log into Supabase dashboard
2. Navigate to Settings → Auth → Rate Limiting
3. Increase limits (see table above)
4. Save
5. Reply: "Done" when complete

**ETA to Complete:** 3 minutes
**Deadline:** Monday 17:00 launch

---

**Tim's next steps after this is done:**
- Deploy code with Sentry + improved messaging (Vercel auto-deploy on git push)
- Add SENTRY_DSN + NEXT_PUBLIC_SENTRY_DSN to Vercel env vars
- Test signup flow Monday morning
- Launch 17:00
