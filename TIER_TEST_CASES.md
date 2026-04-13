# VisaBud 3-Tier Payment Test Cases

**Goal:** Verify all 3 tiers (Standard, Premium, Expert) process payments correctly, fire webhooks, and unlock proper access.

**Cost:** ~3 pence total
**Time:** ~15 minutes (5 min per tier)
**Date:** Monday 13 April 2026

---

## SETUP: Adjust Pricing in Stripe

Before running any tests, reduce prices to test amounts:

1. Go to **Stripe Dashboard → Products**
2. Click **Standard Checklist** → Edit price
   - Change from £50.00 → **£0.01 GBP**
   - Save

3. Click **AI Premium Review** → Edit price
   - Change from £149.00 → **£0.02 GBP**
   - Save

4. Click **Expert Human Review** → Edit price
   - Change from £299.00 → **£0.03 GBP**
   - Save

✅ **All 3 prices now at test amounts. Ready for testing.**

---

## TEST CASE 1: Standard Tier (£0.01)

### Pre-Test
- [ ] New incognito browser window
- [ ] Navigate to https://visabud.co.uk

### Steps
1. [ ] Click **"Start Free"**
2. [ ] **Sign up with email:** `test-standard-TIMESTAMP@gmail.com` (e.g., test-standard-120926@gmail.com)
3. [ ] Receive magic link, click it
4. [ ] Dashboard loads (free preview visible)
5. [ ] Click **"Unlock Full Access"**
6. [ ] Paywall modal opens
7. [ ] Click **"Standard Checklist — £0.01"**
8. [ ] Stripe checkout loads
9. [ ] **Enter card details:**
   - Card: `4242 4242 4242 4242`
   - Exp: `12/25`
   - CVC: `123`
   - Name: `Test User`
   - Email: Auto-filled from signup
   - Postcode: `12345`
10. [ ] Click **"Pay £0.01"**
11. [ ] Payment processes
12. [ ] Redirected to success page (`/dashboard?payment=success`)

### Verification
- [ ] Success page shows:
  - ✓ Tier: "Standard Checklist"
  - ✓ Amount: "£0.01"
  - ✓ Confetti animation
  - ✓ "View Your Features" button clickable
- [ ] Click **"View Your Features"**
- [ ] Dashboard shows **full checklist unlocked** (not just preview)
- [ ] Browser console: **Zero errors**
- [ ] **Webhook fired:** Go to Stripe Dashboard → Events, look for `payment_intent.succeeded` + `charge.succeeded` events

### Expected Result
✅ **PASS** — User charged £0.01, webhook fired, dashboard unlocked for Standard tier.

---

## TEST CASE 2: Premium Tier (£0.02)

### Pre-Test
- [ ] New incognito browser window
- [ ] Navigate to https://visabud.co.uk

### Steps
1. [ ] Click **"Start Free"**
2. [ ] **Sign up with email:** `test-premium-TIMESTAMP@gmail.com`
3. [ ] Receive magic link, click it
4. [ ] Dashboard loads (free preview visible)
5. [ ] Click **"Unlock Full Access"**
6. [ ] Paywall modal opens
7. [ ] Click **"AI Premium Review — £0.02"** (the "Most Popular" badge is visible)
8. [ ] Stripe checkout loads
9. [ ] **Enter card details:**
   - Card: `4242 4242 4242 4242`
   - Exp: `12/25`
   - CVC: `123`
   - Name: `Test User`
   - Email: Auto-filled from signup
   - Postcode: `12345`
10. [ ] Click **"Pay £0.02"**
11. [ ] Payment processes
12. [ ] Redirected to success page (`/dashboard?payment=success`)

### Verification
- [ ] Success page shows:
  - ✓ Tier: "Premium AI Document Review"
  - ✓ Amount: "£0.02"
  - ✓ Confetti animation
  - ✓ "View Your Features" button clickable
- [ ] Click **"View Your Features"**
- [ ] Dashboard shows **full premium checklist unlocked** (more features than Standard)
- [ ] Browser console: **Zero errors**
- [ ] **Webhook fired:** Check Stripe Dashboard → Events for `payment_intent.succeeded` + `charge.succeeded`

### Expected Result
✅ **PASS** — User charged £0.02, webhook fired, dashboard unlocked for Premium tier.

---

## TEST CASE 3: Expert Tier (£0.03)

### Pre-Test
- [ ] New incognito browser window
- [ ] Navigate to https://visabud.co.uk

### Steps
1. [ ] Click **"Start Free"**
2. [ ] **Sign up with email:** `test-expert-TIMESTAMP@gmail.com`
3. [ ] Receive magic link, click it
4. [ ] Dashboard loads (free preview visible)
5. [ ] Click **"Unlock Full Access"**
6. [ ] Paywall modal opens
7. [ ] Click **"Expert Human Review — £0.03"**
8. [ ] Stripe checkout loads
9. [ ] **Enter card details:**
   - Card: `4242 4242 4242 4242`
   - Exp: `12/25`
   - CVC: `123`
   - Name: `Test User`
   - Email: Auto-filled from signup
   - Postcode: `12345`
10. [ ] Click **"Pay £0.03"**
11. [ ] Payment processes
12. [ ] Redirected to success page (`/dashboard?payment=success`)

### Verification
- [ ] Success page shows:
  - ✓ Tier: "Expert Human Review"
  - ✓ Amount: "£0.03"
  - ✓ Confetti animation
  - ✓ "View Your Features" button clickable
- [ ] Click **"View Your Features"**
- [ ] Dashboard shows **full expert checklist unlocked** (premium features + expert features)
- [ ] Browser console: **Zero errors**
- [ ] **Webhook fired:** Check Stripe Dashboard → Events for `payment_intent.succeeded` + `charge.succeeded`

### Expected Result
✅ **PASS** — User charged £0.03, webhook fired, dashboard unlocked for Expert tier.

---

## SUMMARY: Post-Test

### If All 3 Pass ✅
- [ ] All webhooks fired successfully
- [ ] All 3 tiers unlocked correctly
- [ ] No console errors
- [ ] Success pages show correct tier + amount

**NEXT STEP:**
1. Go to **Stripe Dashboard → Products**
2. **Revert pricing back to production amounts:**
   - Standard: £50.00
   - Premium: £149.00
   - Expert: £299.00
3. **Done. Launch Monday 17:00.**

### If Any Fail ⚠️
1. Check Stripe logs for payment errors
2. Check Supabase logs for webhook processing errors
3. Check browser console for JS errors
4. Report issue + fix
5. Re-test that tier
6. Repeat until all pass
7. Then revert pricing

---

## Quick Reference: Test Card Details

```
Card Number:  4242 4242 4242 4242
Expiry:       12/25
CVC:          123
Postcode:     12345
Name:         Test User
```

---

## Notes

- **Timing:** Each test ~5 min. Do all 3 sequentially = 15 min total.
- **Cost:** £0.01 + £0.02 + £0.03 = **£0.06 total** (refunded or negligible).
- **Webhook verification:** Don't rely on email notifications; check Stripe Dashboard → Events directly for confirmed webhook delivery.
- **Browser console:** Use F12 to open DevTools → Console tab. Should be completely clean (no red errors).
- **Incognito windows:** Ensures fresh auth state for each test (no session bleed).

---

**Ready? Run the tests and report results.** 🚀
