# BUILD_PROGRESS.md

## Build: FEAT — Collapse to Single Paid Tier + Fix Per-App Paywall + Update Pricing UI
**Date:** 2026-06-06  
**Status:** ✅ COMPLETE

---

## TASK 1: Collapse Tiers in Type System ✅

### src/lib/application-types.ts
- Changed `PurchasedTier = 'none' | 'standard' | 'premium'` → `'none' | 'unlocked'`
- Updated `TIER_CONFIG` to remove 'standard'/'premium' keys, add 'unlocked' key

### src/lib/store.ts
- Changed `PurchasedTier = 'none' | 'standard' | 'premium'` → `'none' | 'unlocked'`

### src/lib/types.ts
- Updated `purchased_tier?: 'none' | 'standard' | 'premium'` → `'none' | 'unlocked'`

### src/lib/visa-data.ts
- Updated `tier?: 'free' | 'standard' | 'premium'` → `'free' | 'unlocked'`
- Replaced all `tier: 'standard'` with `tier: 'unlocked'` across all checklist items

### All other files with 'standard'/'premium' PurchasedTier references updated:
- `src/app/dashboard/page.tsx` — tier checks, backwards compat normalization
- `src/app/applications/page.tsx` — tier badge display
- `src/app/app/success/page.tsx` — was already using 'unlocked' ✓
- `src/components/TierFeatureButtons.tsx` — TIER_RANK, feature minTier, labels
- `src/components/TopNav.tsx` — tier prop type and display
- `src/components/PremiumUpgradeBanner.tsx` — simplified to single tier
- `src/components/PaywallModal.tsx` — replaced two-tier TIERS array with single 'unlocked' tier
- `src/components/PaymentSuccessBanner.tsx` — updated tierInfo to use 'unlocked' key
- `src/components/FeatureComparison.tsx` — rebuilt as single-column 'Full Access' table
- `src/components/PaywallFAQ.tsx` — updated FAQ content to single-tier messaging

---

## TASK 2: Update Stripe Config ✅

### src/lib/stripe.ts
- Changed `STRIPE_PRICE_IDS` from `{standard, premium}` to `{unlocked: process.env.STRIPE_PRICE_STANDARD!}`
- Updated `TIER_METADATA` to single 'unlocked' tier with comprehensive feature list

### src/app/api/checkout/route.ts
- Default tier changed from 'standard' to 'unlocked'
- Removed conditional `productType: 'premium_review'` logic
- Updated health check `priceIds` display

### src/app/api/checkout/premium-review/route.ts
- Deprecated; now routes all requests to 'unlocked' tier

### src/app/api/webhooks/stripe/route.ts
- Updated TIER_LABELS to use 'unlocked' (backwards compat entries for 'standard'/'premium' kept)
- Updated tier safety check to accept 'unlocked' | 'standard' | 'premium' (backwards compat)
- Both `handlePremiumReviewPurchase` and `handleFullPackPurchase` now write 'unlocked' to DB

### src/app/api/webhooks/stripe-prices/route.ts
- Updated price→tier mapping: STRIPE_PRICE_STANDARD → 'unlocked'

### src/app/api/user/tier/route.ts
- Added normalization: 'standard'/'premium' from DB → 'unlocked' (backwards compat)

---

## TASK 3: Fix Per-Application Paywall Leak ✅

### src/app/dashboard/page.tsx
- Added backwards compat normalization for old DB values ('standard'/'premium' → 'unlocked')
- Poll logic updated to set 'unlocked' for all successful payments
- All `purchasedTier === 'premium'` checks changed to `=== 'unlocked'`
- All `purchasedTier !== 'premium'` checks changed to `!== 'unlocked'`
- Source of truth remains DB (purchased_tier from application row), seeded into Zustand store

---

## TASK 4: Update Pricing UI ✅

### src/app/page.tsx
- Replaced two-tier pricing section with single "One price. Everything unlocked." card
- £9.99 per application, one-time, instant access
- 6-item feature list, single CTA button

---

## TASK 5: Update Email Sequences ✅

### src/lib/email-automation.ts
- Updated `upsell_review` subject + template: removed £149 document review, added £9.99 full access unlock CTA
- Updated `upsell_followup` subject + template: removed £149 reference, replaced with £9.99 unlock CTA
- Removed all human review / expert review references from drip sequences

---

## TypeScript Check ✅
`npx tsc --noEmit` — 0 errors

## Build Output ✅
`npm run build` — ✓ Generating static pages (55/55)
All pre-existing warnings unchanged (DYNAMIC_SERVER_USAGE in API routes, Prisma instrumentation, Supabase fetch during build) — not caused by this build.

---

## Previous Build
## Build: FEAT — Landing Page AI Hooks + Questionnaire Migration + Risk-Reactive CTA + Welcome Email Rewrite
**Commit:** 31eb8a4  
**Date:** 2026-06-06  
**Status:** ✅ COMPLETE
