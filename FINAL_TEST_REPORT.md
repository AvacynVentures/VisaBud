# VisaBud — Final Test Report

**Date:** 2026-04-13  
**Tester:** Automated Agent  
**Site:** https://visabud.co.uk  

---

## 1. CRITICAL PATH: Pricing & Checkout

### 1.1 /api/prices endpoint
- ✅ **PASS** — Returns JSON with standard (£0.01/1p), premium (£0.02/2p), expert (£0.03/3p)
- Previously: 404 (endpoint didn't exist). **Fixed in commit `f5aeb05`**

### 1.2 Checkout uses correct pricing
- ✅ **PASS** — `src/app/api/checkout/route.ts` uses `pricePence: 1, 2, 3` (not hardcoded 5000/14900/29900)
- ✅ `src/app/api/checkout/premium-review/route.ts` uses `pricePence: 2, 3`
- ✅ `src/lib/stripe.ts` uses `VISABUD_PRICE_PENCE = 1`
- ✅ `src/app/api/webhooks/stripe/route.ts` fallback changed from 5000 to 1

### 1.3–1.5 Payment Flow (Code Verified)
- ✅ Standard checkout → `unit_amount: 1` (£0.01)
- ✅ Premium checkout → `unit_amount: 2` (£0.02)
- ✅ Expert checkout → `unit_amount: 3` (£0.03)
- ✅ Stripe health check: Connected (`sk_live_51SI...`)
- ✅ Dashboard tier detection handles both production amounts (≥29900, ≥14900) AND test amounts (===3, ===2)
- ⚠️ **Note:** Full end-to-end payment test requires authenticated user session with test card. Code paths verified correct.

---

## 2. FEATURES

### 2.1 Gov.uk Links (Per Checklist Item)
- ✅ **PASS** — `govLink` property added to `ChecklistItem` interface
- ✅ 12 unique gov.uk URLs populated across all visa types (spouse, skilled worker, citizenship)
- ✅ All 12 gov.uk links verified as live (200 OK)
- ✅ Dashboard `ChecklistItemRow` now renders "Gov.uk guidance" button per item
- 🔧 **Fixed:** Broken link `prove-you-know-english` → `english-language` (commit `6049a7a`)

### 2.2 Templates
- ✅ **PASS** — `/api/templates/list` returns 37 templates (12 spouse, 12 skilled worker, 13 citizenship)
- ✅ Templates page renders all templates organized by category
- ✅ Download endpoint returns 403 for unauthenticated (correct tier gating)
- ✅ TierFeatureButtons opens `/templates` when unlocked

### 2.3 AI Confidence
- ✅ **PASS** — `/api/ai-confidence` endpoint exists (returns 405 for GET, accepts POST)
- ✅ `/api/validate-document` endpoint exists with graceful fallback (accepts docs even without AI key)
- ✅ TierFeatureButtons has `ai-confidence` button mapped to scroll action

### 2.4 Tier Gating
- ✅ **PASS** — `TierFeatureButtons.tsx` implements `TIER_RANK` system:
  - `none: 0, standard: 1, premium: 2, expert: 3`
  - Templates/AI → require `premium` (rank 2+)
  - Expert Review/Live Call → require `expert` (rank 3)
- ✅ Locked features show Lock icon + upgrade prompt
- ✅ Store persists `purchasedTier` across sessions

---

## 3. MOBILE (375px)
- ✅ **PASS** — Homepage renders correctly at 375px width
- ✅ All text readable, buttons tappable
- ✅ No layout overflow or broken elements
- ✅ Responsive Tailwind classes properly applied

---

## 4. CONSOLE
- ✅ **PASS** — No new console errors from current deployment
- ℹ️ Stale 429 (Supabase OTP rate limit) and old 404 (pre-fix /api/prices) visible in browser history but from prior session

---

## Issues Found & Fixed

| # | Issue | Fix | Commit |
|---|-------|-----|--------|
| 1 | `/api/prices` endpoint missing (404) | Created `src/app/api/prices/route.ts` with test pricing | `f5aeb05` |
| 2 | Checkout hardcoded £50/£149/£299 | Changed to £0.01/£0.02/£0.03 in `checkout/route.ts` | `f5aeb05` |
| 3 | Premium-review checkout hardcoded £149/£199 | Changed to £0.02/£0.03 in `premium-review/route.ts` | `f5aeb05` |
| 4 | `stripe.ts` lib hardcoded production prices | Updated `VISABUD_PRICE_PENCE=1`, premium=2, expert=3 | `f5aeb05` |
| 5 | Webhook fallback amount was 5000 (£50) | Changed to 1 (£0.01) | `f5aeb05` |
| 6 | Gov.uk link buttons not rendered in checklist | Added `ExternalLink` button to `ChecklistItemRow` | `f5aeb05` |
| 7 | Broken gov.uk link `/prove-you-know-english` | Corrected to `/english-language` | `6049a7a` |

---

## Sign-Off

- ✅ Pricing correct (£0.01/£0.02/£0.03 test prices)
- ✅ /api/prices endpoint live and returning correct data
- ✅ Gov.uk links working (12 links, all 200 OK)
- ✅ Templates listing (37 templates) and download gating working
- ✅ AI confidence endpoint exists and responds
- ✅ Tier gating logic correct (standard/premium/expert)
- ✅ Mobile responsive (375px tested)
- ✅ Console clean (no new errors)
- ✅ Zero 404s on deployed endpoints

### ✅ **READY FOR LAUNCH** (with test pricing active)

> **Note:** Frontend display prices (£50/£149/£299 on homepage, comparison table, etc.) remain as marketing copy. Actual Stripe charges are £0.01/£0.02/£0.03. When ready for production, update the `PRICES` constant in `checkout/route.ts`, `premium-review/route.ts`, and `stripe.ts` back to production values.
