# BUILD_PROGRESS.md

## Build: FEAT — Landing Page AI Hooks + Questionnaire Migration + Risk-Reactive CTA + Welcome Email Rewrite
**Commit:** 31eb8a4  
**Date:** 2026-06-06  
**Status:** ✅ COMPLETE

---

## TASK 1: Landing Page Copy (src/app/page.tsx) ✅

All 6 changes applied:
1. Hero subheadline → "Get AI-powered document checks..."
2. Free tier callout → "3 free AI document checks included · Full access from £9.99"
3. CTA sub-copy → "Takes 3 minutes · 3 free AI checks included · No spam, ever"
4. **New section inserted:** Free AI Checks Strip (emerald-50 bg) between Hero and Credibility Bar — 3 cards for Passport, Financial, Accommodation checks with "Free" badge
5. How it works Step 1 → "Choose your visa type" with updated description
6. Pricing callout → "3 AI checks free. Full checklist + 37 templates + risk management from £9.99."

---

## TASK 2: Questionnaire → Checklist Migration (src/lib/visa-data.ts) ✅

Added 4 common items to ALL 3 visa types (displayOrder 200-203), plus 1 spouse-only item:

**Spouse (sp- prefix): 5 new items**
- sp-location-status (displayOrder 200)
- sp-previous-refusal (displayOrder 201)
- sp-previous-overstay (displayOrder 202)
- sp-employment-status (displayOrder 203)
- sp-relationship-duration (displayOrder 204) — SPOUSE ONLY

**Skilled Worker (sw- prefix): 4 new items**
- sw-location-status (displayOrder 200)
- sw-previous-refusal (displayOrder 201)
- sw-previous-overstay (displayOrder 202)
- sw-employment-status (displayOrder 203)

**Citizenship (cit- prefix): 4 new items**
- cit-location-status (displayOrder 200)
- cit-previous-refusal (displayOrder 201)
- cit-previous-overstay (displayOrder 202)
- cit-employment-status (displayOrder 203)

---

## TASK 3: Risk-Reactive Upgrade CTA (src/app/dashboard/page.tsx) ✅

Added risk state calculation variables in ChecklistTab (locked view):
- Computes hasHighRisk, hasMediumRisk, totalFlags, anyChecksRun, lockedCount from freeUploads (serverDocs)
- Dynamic ctaCopy string reacts to AI scan results

Replaced static emerald button with dynamic risk-reactive CTA block:
- 🔴 Red (bg-red-50) if high risk detected
- 🟡 Amber (bg-amber-50) if medium risk detected
- 🔵 Blue (bg-blue-50) if clean/no checks run
- One-time payment · 7-day money-back guarantee footer

---

## TASK 4: Welcome Email Rewrite ✅

### email.ts — welcome template rewritten
- New subject: "You've got 3 free AI document checks waiting 🎉"
- Full HTML email with check-item cards (green bg), free badges, CTA → /applications
- Proper HTML entities (&amp; &pound; &rarr; etc.)
- Clean plain-text version

### email-automation.ts — welcome case added
- Added `case 'welcome':` BEFORE `default:` in getTemplateHtml switch
- Renders 3 free check cards (Financial, Passport, Accommodation) via wrapEmail()
- CTA → ${appUrl}/applications

---

## TypeScript Check ✅
`npx tsc --noEmit` — 0 errors

## Build Output ✅
`npm run build` — ✓ Generating static pages (55/55)  
All pre-existing warnings (DYNAMIC_SERVER_USAGE in API routes, Prisma instrumentation, Supabase fetch during build) unchanged — not caused by this build.

## Git ✅
Committed: 31eb8a4  
Pushed: main → origin/main
