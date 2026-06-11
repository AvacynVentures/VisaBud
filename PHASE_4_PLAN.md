# Phase 4: Dashboard 3-Free-Limit Tracking

**Estimated Duration**: 1-2 hours  
**Complexity**: Low-Medium (mostly UI, existing logic likely in place)

---

## Overview

Current state: Users can upload documents and get AI checks. We need to:
1. Show "3 free AI checks remaining" counter in dashboard
2. Track how many checks each user has used
3. After 3 checks: Show upgrade prompt instead of "check" button
4. Message: "You've used your 3 free AI document checks. Upgrade now to check the rest of your visa documents."

---

## Implementation Plan

### Step 1: Understand Current Check Tracking
**Files to review**:
- `src/app/dashboard/page.tsx` — Dashboard UI
- `src/app/api/documents/[documentId]/ai-check` — Check endpoint
- `src/lib/` — Look for check tracking logic (likely in auth or user context)

**Questions to answer**:
- [ ] Is there a `free_checks_used` field in the `users` table?
- [ ] Does the AI check endpoint already decrement this counter?
- [ ] Is there a function to check if user has checks remaining?

### Step 2: Update Dashboard UI
**Location**: `src/app/dashboard/page.tsx`

**Add to document list**:
```tsx
// Above the documents list
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <p className="text-sm font-semibold text-blue-900">
    📊 Free AI Checks Remaining: <span className="text-lg font-bold text-blue-700">{3 - freeChecksUsed}</span> of 3
  </p>
  {freeChecksUsed >= 3 && (
    <p className="text-xs text-orange-700 mt-2">
      ⚠️ You've used all 3 free checks. Upgrade to check more documents.
    </p>
  )}
</div>
```

### Step 3: Update Document Check Button Logic
**Location**: Document card or row in dashboard

**Current logic**:
```tsx
<button onClick={() => checkDocument(doc.id)}>
  Check Document
</button>
```

**New logic**:
```tsx
{freeChecksUsed < 3 ? (
  <button onClick={() => checkDocument(doc.id)} className="btn-primary">
    Check Document
  </button>
) : (
  <button onClick={() => navigate('/pricing')} className="btn-primary">
    Upgrade to Check
  </button>
)}
```

### Step 4: Add Upgrade Prompt Modal/Banner
**After user submits 3rd check**:
```tsx
// Show this when freeChecksUsed reaches 3
<div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 text-center">
  <h2 className="text-xl font-bold text-orange-900 mb-2">
    You've used your 3 free AI document checks
  </h2>
  <p className="text-sm text-orange-800 mb-4">
    Upgrade now to check the rest of your visa documents.
  </p>
  <div className="flex gap-3 justify-center">
    <button onClick={() => navigate('/pricing')} className="btn-primary px-6 py-2">
      Upgrade Now
    </button>
    <button onClick={() => closePrompt()} className="btn-secondary px-6 py-2">
      Continue with 3 Checks
    </button>
  </div>
</div>
```

---

## Database Check (If Needed)

If `free_checks_used` doesn't exist, you'll need to:

```sql
-- Add column to users table
ALTER TABLE users ADD COLUMN free_checks_used INT DEFAULT 0;

-- Or track in documents table
ALTER TABLE documents ADD COLUMN is_ai_checked BOOLEAN DEFAULT FALSE;
```

Then update the API endpoint:
```typescript
// In /api/documents/[documentId]/ai-check route
const { data: user } = await supabase
  .from('users')
  .select('free_checks_used')
  .eq('id', userId)
  .single();

if (user.free_checks_used >= 3) {
  return NextResponse.json(
    { error: 'Upgrade required. 3 free checks used.' },
    { status: 403 }
  );
}

// Increment counter
await supabase
  .from('users')
  .update({ free_checks_used: user.free_checks_used + 1 })
  .eq('id', userId);
```

---

## Testing Checklist

- [ ] Dashboard shows "3 free checks remaining" counter
- [ ] Counter updates after each check
- [ ] After 3 checks: "Upgrade Now" button appears
- [ ] Button links to pricing or checkout
- [ ] Upgrade prompt blocks further checks
- [ ] Free-tier users can still view uploaded documents (just not check them)
- [ ] Paid users have unlimited checks

---

## Deployment
```bash
git add -A
git commit -m "Phase 4: Dashboard 3-free-limit tracking and upgrade prompt"
git push origin main
# Vercel auto-deploys in 60 seconds
```

---

## Questions for Ruan

Before I implement Phase 4:
1. Should users still see the check results for all 3 free checks, or just the first one?
2. After upgrading, should they be able to check all previous documents, or just new ones?
3. Should we show a "you've saved £X by upgrading" message or just straightforward upgrade button?
4. Is there already logic for free_checks_used tracking, or should I set it up?

**Let me know and I'll implement Phase 4 immediately.**
