# BUILD_PROGRESS.md

## Task: Remove Questionnaire — Replace with Simple Visa Type Selector
**Date:** 2026-06-06  
**Status:** IN PROGRESS

---

## What Changed

### `src/app/app/start/page.tsx`
- **Before:** Rendered `<OnboardingGate><Onboarding /></OnboardingGate>` — a full 5-step wizard
- **After:** Renders `<OnboardingGate><VisaTypeSelector /></OnboardingGate>` — simple 3-card picker
- The new `VisaTypeSelector` is defined inline in this file (no new component file needed)

### Behaviour
1. User sees 3 cards: Spouse/Partner Visa, Skilled Worker Visa, British Citizenship
2. Clicking a card immediately calls `POST /api/applications` with just `{ visaType }`
3. Loading spinner shown on the selected card while creating
4. On success (or failure) → redirect to `/applications`
5. Auth guard still active via `OnboardingGate`

### `src/components/Onboarding.tsx`
- **NOT deleted** — left as-is for safety
- No longer imported anywhere (only was imported in `start/page.tsx`)

---

## ⚠️ Conditional Logic Note — IMPORTANT, DO NOT REMOVE

The following questionnaire fields are used in conditional checklist/risk logic and **must remain in the codebase**:

| Field | Used In | Effect |
|-------|---------|--------|
| `currentlyInUk` | `visa-data.ts` line 1793, `dashboard/page.tsx` lines 131, 252, 262 | Marks location-dependent checklist items as N/A; affects risk display |
| `relationshipDurationMonths` | `visa-data.ts` lines 1738, 2106–2110 | Flags short-relationship risk for spouse visa |
| `hasPreviousRefusal` | `visa-data.ts` lines 1767, 2122 | Shows refusal-specific checklist warnings |
| `hasPreviousOverstay` | `visa-data.ts` lines 1780, 2127 | Shows overstay-specific checklist warnings |

**These fields are now NULL on newly-created applications** (they were previously populated by the questionnaire). The conditional logic gracefully handles null values — it simply won't show those conditional items/risks if the data isn't present.

**Do NOT remove this logic.** It may be re-introduced later via an in-app settings/profile editor so users can still provide this context after initial application creation.

---

## API Used
- `POST /api/applications` — requires `visaType` only, all other fields optional
- Sets `onboarding_completed: true` on the application record
- Returns `{ application: { id, ... } }`

---

## Build Steps
- [ ] `npx tsc --noEmit` — type check
- [ ] `npm run build` — full build
- [ ] `git commit && git push`
