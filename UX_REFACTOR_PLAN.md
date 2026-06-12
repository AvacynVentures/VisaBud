# VisaBud UX Refactor — Task Breakdown

**Objective:** Reduce friction, eliminate generic sections, move CTAs higher, allow unsigned access to checklist.

**Timeline:** All changes in one sprint (no dependencies).

---

## COMPONENT MAPPING

### Files to Modify

1. **src/app/page.tsx** — Main homepage
2. **src/app/visa-guidance/[type]/page.tsx** — Visa-type landing pages (Spouse, Skilled, Student, Citizenship)
3. **src/app/auth/signup/page.tsx** — Signup flow (adjust redirect/gating)
4. **src/app/dashboard/page.tsx** — Checklist & document upload (adjust auth gating)
5. **src/components/** — Create new components for locked feature messaging

---

## TASK 1: MAIN PAGE CLEANUP

**File:** `src/app/page.tsx`

### 1a. Remove Pricing Section
- **Current:** Section "Simple pricing" (heading + £9.99 pricing card)
- **Lines:** Search for "Simple pricing" heading
- **Action:** DELETE entire pricing `<section>` block
- **Reason:** Homepage should focus on visa type selection first; pricing distracts before user knows their visa route

### 1b. Remove Generic Upload Section
- **Current:** Section "Ready to upload your first document?" (blue CTA banner)
- **Lines:** Search for "Ready to upload your first document"
- **Action:** DELETE entire final CTA `<section>` (before disclaimer)
- **Reason:** This block is too generic and appears before the user has selected a visa type

### 1c. Keep & Verify Visa Type Selector
- **Current:** "Choose your visa pathway" section (4 visa type buttons)
- **Action:** NO CHANGE — this is the key focus now
- **Note:** This should be the main CTA for unsigned users

### 1d. Layout Result
After cleanup, homepage flow should be:
1. Hero (headline + value prop + "3 free AI checks")
2. Visa Type Selector (4 buttons: Spouse, Skilled, Student, Citizenship)
3. Free AI Checks Strip
4. Credibility Bar
5. Trust Signals
6. How It Works
7. Testimonial
8. Footer

---

## TASK 2: VISA GUIDANCE PAGE — CONDENSE HERO BANNER

**File:** `src/app/visa-guidance/[type]/page.tsx`

### 2a. Condense Top Banner
- **Current:** Hero section with:
  - Large "Avoid Costly Visa Mistakes Before You Submit" heading (4xl/5xl)
  - Description paragraph
  - "Try a Free Demo" button
  - Large visual diagram (hidden on mobile) showing 4-step flow
- **Action:** Reduce to compact horizontal layout:
  - Heading: Reduce to 2xl (smaller, snappier)
  - Keep description (one line max)
  - Keep "Try Free Demo" button
  - **COMPRESS the visual flow diagram** (keep it, but smaller: reduce gap/spacing, shrink circles, tighten font)
  
**New Layout:**
```
Small heading: "Avoid Costly Visa Mistakes"
One-line description: "Upload any document and see exactly what VisaBud finds."
[Try Free Demo] button
[Flow diagram - COMPACT] (smaller circles, tighter spacing)
```
- **Height:** Target ~150-180px (currently ~300px+)
- **Reason:** Flow diagram helps demystify the process (keep it!). Compress spacing/sizing to reduce height while preserving understanding.

### 2b. Remove/Condense Section: "TRUST STATEMENT"
- **Current:** Green banner with 4 bullet-point checks
- **Action:** Consider moving this lower (after CTAs) or condensing to 2-line statement
- **Reason:** It's informational but comes before user understands the offer

---

## TASK 3: VISA GUIDANCE PAGE — MOVE CTAs HIGHER

**File:** `src/app/visa-guidance/[type]/page.tsx`

### 3a. Reorder Sections
**Current order:**
1. Hero banner (large)
2. Trust statement
3. Quick try box + checklist box (CTAs)
4. AI example
5. Why applications fail
6. Typical documents
7. What VisaBud does
8. Security
9. Example issues
10. Timeline
11. Final CTA

**New order:**
1. **Compact hero** (reduced height, includes "Try Free Demo" button)
2. **CTA Box: "Skip Demo, Go Straight to Checklist"** (this is the main action)
3. Trust statement (condensed, moved down)
4. AI example
5. Why applications fail
6. Typical documents
7. What VisaBud does
8. Security
9. Example issues
10. Timeline

**Detailed changes:**
- Move "Skip Demo, Go Straight to Checklist" box **immediately below hero** (was previously 3 sections down)
- Keep "Try Free Demo" in hero button
- Remove the final CTA section (it's redundant after moving CTAs higher)
- Merge the two CTA boxes into one section: "Pick Your Path"
  - Option 1: Try Free Demo (button)
  - Option 2: Start Checklist (button)

---

## TASK 4: CHECKLIST ACCESS FLOW — UNSIGNED USER ACCESS

**Files:**
- `src/app/dashboard/page.tsx` — Main checklist interface
- `src/app/auth/signup/page.tsx` — Signup flow
- `src/lib/auth-context.tsx` — Auth context (if exists)
- `src/components/` — New locked feature messaging components

### 4a. Adjust Signup Redirect
- **Current:** "Start My Document Checklist" button goes to `/auth/signup?visa=X`
- **New:** "Start My Document Checklist" button goes to `/app/start?visa=X` **without** requiring auth first
- **User flow:**
  1. Click "Start Checklist"
  2. Go directly to checklist page (no login form)
  3. User can upload documents and see their checklist immediately
  4. When they try to use AI checker or templates → show locked feature modal

### 4b. Create Locked Feature Component
- **File:** `src/components/LockedFeatureOverlay.tsx`
- **Purpose:** Show when user tries to access AI checks or templates without paying
- **Content:**
  ```
  🔒 Want us to check this document with AI before you submit?
  Unlock AI document checking to reduce the risk of missing or incorrect evidence.
  
  [Upgrade to VisaBud Premium - £9.99]
  [Create Account]
  ```
- **Also for templates:**
  ```
  🔒 Need help preparing this document?
  Unlock templates and guidance to ensure your document meets visa requirements.
  
  [Upgrade to VisaBud Premium - £9.99]
  [Create Account]
  ```

### 4c. Adjust Dashboard Gating
- **Current:** Dashboard requires `user` (signed-in)
- **New:** Dashboard allows unsigned access with limited features:
  - ✅ Checklist visible and editable
  - ✅ Document upload available
  - ❌ AI Checking button shows "Locked" state with upgrade prompt
  - ❌ Templates button shows "Locked" state with upgrade prompt
- **Implementation:**
  - Remove/relax auth check in `/app/dashboard` (or `/app/start`)
  - Check for `user` when attempting AI check or template access
  - Show modal if not authenticated/paid

### 4d. Session Persistence for Unsigned Users
- **Challenge:** How do unsigned users keep their checklist data?
- **Solution:** Use browser localStorage for temporary session
  - Store document list, checklist state in localStorage
  - When user signs up/pays, migrate localStorage to database
  - Show message: "Your documents are saved locally. Sign up to keep them permanently."

---

## TASK 5: NEW MESSAGING & COPY

### For Locked Features (AI Checker)
```
Want us to check this document with AI before you submit?
Unlock AI document checking to reduce the risk of 
missing or incorrect evidence.

[Upgrade to Premium - £9.99]
```

### For Locked Features (Templates)
```
Need help preparing this document?
Unlock templates and guidance to ensure your document 
meets visa requirements.

[Upgrade to Premium - £9.99]
```

### For Unsigned Checklist Page
```
You can organize your documents for free.
Premium features (AI checking & templates) unlock when you upgrade.
[Learn More]
```

---

## IMPLEMENTATION ORDER (No Dependencies)

1. **Phase 1 — Main Page (10 min)**
   - Remove pricing section
   - Remove final CTA section
   - Test homepage render

2. **Phase 2 — Visa Guidance Hero (10 min)**
   - Condense blue banner
   - Remove visual flow diagram
   - Adjust height/spacing

3. **Phase 3 — Reorder Sections (10 min)**
   - Move CTA boxes higher
   - Remove redundant sections
   - Adjust section order

4. **Phase 4 — Checklist Gating (20 min)**
   - Create LockedFeatureOverlay component
   - Adjust dashboard auth check
   - Add localStorage for unsigned users
   - Connect overlay to AI/template buttons

5. **Phase 5 — Testing (15 min)**
   - Visual smoke test (main page, visa page, checklist)
   - Check button flows (signed-in vs unsigned)
   - Test localStorage persistence
   - Verify locked features show correctly

---

## Success Criteria

✅ Main page: No pricing, no generic upload section, focus on visa type selection
✅ Visa page: Hero banner is compact (<150px)
✅ Visa page: CTAs appear within first visible fold (no scroll required)
✅ Unsigned users: Can access checklist and upload documents
✅ Unsigned users: See locked feature prompts for AI checks and templates
✅ Signed-in users: All features work as before (no changes to paid experience)
✅ Browser console: No errors during unsigned flow
✅ Mobile: Layout still works on small screens (CTAs still visible)

---

## Rollback Plan

All changes in single commit. If issues arise:
- `git revert` the commit
- No data loss (no database changes)
- No user-facing impact if reverted within 1 hour

---

**Status:** Ready for implementation
**Estimate:** 60 minutes total
**Risk:** Low (UI/UX only, no backend changes)
