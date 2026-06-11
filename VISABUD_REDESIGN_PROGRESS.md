# VisaBud Homepage & UX Redesign
**Started:** 11 June 2026  
**Status:** 🔄 PHASE 4 IN PROGRESS

## Scope (Ruan's 9-Point Requirements)

1. ✅ Hero Section: Add AI document checker visual mockup on right side (82% payslip example)
2. ✅ Visa Type Selector: Remove blue ribbon, replace with clean buttons + "Choose your visa pathway" heading
3. ✅ Layout Spacing: Reduce white space throughout (homepage + visa pathway pages)
4. ✅ Email Subscribe: Fix placeholder/icon overlap AND change confirmation message
5. ✅ Visa Pathway Pages: Improve layout for conversion focus
6. ✅ Remove "Get Three Free AI Checks" email button
7. ✅ Replace with "Upload one visa document and try it free" or "Get access to your full document checklist now"
8. ⏳ Dashboard/Upload Area: Upload all docs, but only AI-check 3 free. Show "Upgrade Now" after 3 used.
9. ✅ Overall: Cleaner, compact, less empty, conversion-focused, obvious what VisaBud does

## Implementation Phases

### PHASE 1: Email & Quick Wins ✅ COMPLETE
- ✅ Fix email placeholder overlap in FooterEmailCapture.tsx (pl-9→pl-10, shortened placeholder)
- ✅ Update email success message (UI): "Thank you for subscribing! Check your inbox for visa tips."
- ✅ Update welcome email HTML (API): Changed to subscription-focused messaging
- ✅ Tighten hero section spacing (py-16→py-12, reduced gaps)
- ✅ Replace visa type ribbon with button layout (cleaner, compact buttons)

### PHASE 2: Homepage Visual Updates ✅ COMPLETE
- ✅ Add 82% payslip mockup to hero right side (new grid layout with visual example)
- ✅ Restructure visa pathway buttons section (clean buttons, no cards)
- ✅ Reduce spacing throughout homepage (py-16→py-10, gaps 8→6, etc.)
- ✅ Update button messaging & CTAs
- ✅ Update "How It Works" steps (renamed to Upload→AI Checks→Apply)
- ✅ Tighten testimonial section (removed large quote, condensed text)
- ✅ Tighten pricing section (reduced padding, removed extra benefit)
- ✅ Updated final CTA to "Ready to upload your first document?"

### PHASE 3: Visa Guidance Pages ✅ COMPLETE
- ✅ Reduce spacing and whitespace (py-12→py-10 throughout)
- ✅ Improve conversion focus
- ✅ Update "Get Three Free AI Checks" → "Try a Free Demo"
- ✅ Update to "Get your full checklist now" with free upload + 3 checks message
- ✅ Tighten footer (py-10→py-6)

### PHASE 4: Dashboard & Upload ⏳ PENDING
- [ ] Show 3 free AI checks limit in dashboard
- [ ] After 3 checks used: Show upgrade prompt
- [ ] Add "Upgrade Now" button prominently

---

## Detailed Changes Made

### 1. FooterEmailCapture.tsx
- **Placeholder fix**: Changed from "your@email.com" to shorter "you@email.com" 
- **Icon padding**: Increased `pl-9` to `pl-10` and added `pointer-events-none` to icon
- **Success message**: "You're subscribed! Check your inbox." → "Thank you for subscribing! Check your inbox for visa tips."

### 2. Email Subscribe API (route.ts)
- **Welcome email subject**: Remains "Your personalised visa plan is ready 🎉"
- **Email body**: Completely rewritten to be subscription-focused instead of visa application focused
  - Headline: "Thank you for subscribing! ✨"
  - Subtitle: "You'll now receive helpful visa guidance, document tips, and VisaBud updates."
  - CTA: "Get Started Free" instead of "View My Dashboard"

### 3. Homepage (page.tsx)

**Hero Section**:
- Changed from single column to 2-column grid layout (desktop)
- Left: Copy + CTA
- Right: AI document checker visual example (82% payslip mockup)
- Reduced padding: py-16 md:py-24 → py-12 md:py-16
- Shortened subheading, reduced gaps

**Visa Type Selector**:
- **Before**: Large blue ribbon with 4 cards + descriptions
- **After**: Clean 4-button grid with just visa names
- Simpler styling, more compact
- Border styling: `border-slate-300 hover:border-blue-500`

**Free AI Checks Strip**:
- Padding: py-8 → py-6
- Gap: gap-4 → gap-3
- Label: text-sm → text-xs
- Margin: mb-5 → mb-4

**Trust Signals Section**:
- Padding: py-12 → py-8
- Gap: gap-8 → gap-6

**How It Works**:
- Padding: py-16 → py-10
- Margin: mb-12 → mb-8
- **Updated 3 steps**:
  1. "Choose your visa type" → "Upload Your Documents"
  2. "Get your personalised plan" → "Get AI Checks Free"
  3. "Apply with confidence" → "Apply With Confidence"

**Testimonial**:
- Padding: py-12 → py-8
- Removed large opening quote
- Shortened text
- Reduced avatar size

**Pricing**:
- Padding: py-16 → py-10
- Card padding: p-8 → p-6
- Removed "Risk scoring & confidence scores" from benefits
- Removed "Full Application Unlock" label
- Simpler messaging

**Final CTA**:
- Changed headline: "Stop guessing. Know exactly what to do." → "Ready to upload your first document?"
- Reduced padding, simpler design
- Rounded corners: rounded-2xl → rounded-lg

**Disclaimer**:
- Padding: py-8 → py-6
- Shortened text

**Footer**:
- Padding: py-10 → py-8

### 4. Visa Guidance Page ([type]/page.tsx)

**Hero**:
- Padding: py-16 md:py-20 → py-12 md:py-14
- CTA button: "Get 3 Free AI Checks" → "Try a Free Demo"
- Link: /auth/signup → /demo-upload
- Improved headline and description

**Quick Try Box**:
- Padding: p-8 md:p-12 → p-6 md:p-8
- Simplified layout from 2-column to flex
- Removed list of uploadable documents
- Cleaner CTA

**Final CTA**:
- Padding: p-8 md:p-12 → p-6 md:p-8
- Headline: "Ready to apply with confidence?" → "Get your full checklist now"
- Added context: "Upload all documents, check 3 free, then unlock full access for just £9.99."

**Footer**:
- Padding: py-10 → py-6
- Simplified disclaimer text

**Other Sections**:
- All py-12 reduced to py-10
- All py-16 reduced to py-12
- Border thickness: border-2 → border where appropriate

---

## Files Modified

### ✅ COMPLETED
- `src/components/FooterEmailCapture.tsx` 
- `src/app/api/email/subscribe/route.ts` 
- `src/app/page.tsx` 
- `src/app/visa-guidance/[type]/page.tsx`

### ⏳ TODO (PHASE 4)
- `src/app/dashboard/page.tsx` (upload area + 3 free limit UI)
- `src/components/DocumentUploadArea.tsx` (if exists)
- Document tracking logic (track free checks used)

---

## Build Status

✅ **Build Success**: `npm run build` completed with exit code 0  
✅ **No new errors introduced**: All warnings are pre-existing  
✅ **Ready to test**: Changes compiled successfully

### Build Details
- Route (app) / — 7.2 kB size, 194 kB First Load JS
- All 56 routes compiled successfully
- Warnings: Pre-existing Prisma/OpenTelemetry instrumentation warnings (not related to these changes)

---

## Next Steps (PHASE 4)
1. Update dashboard to show "3 free AI checks" limit
2. Track AI checks per user (existing logic likely in place)
3. Show "You've used 3 free checks. Upgrade Now." after limit reached
4. Add prominent "Upgrade Now" button
5. Test end-to-end flow: upload → 3 free checks → upgrade prompt
6. Deploy to Vercel via git push

---

## Key Metrics Achieved

✅ Fewer blank sections (reduced all major spacing)  
✅ Clearer value prop (82% example in hero now visible)  
✅ Better conversion funnel (demo → upload → try 3 free → upgrade)  
✅ More obvious product demo (AI checker visual mockup on homepage hero)  
✅ Tighter layout (py-16→py-10, py-12→py-8 throughout)  
✅ Email messaging fixed (no longer sounds like visa app signup)  
✅ Button messaging improved (demo-focused, action-focused)  
✅ Removed email capture buttons (now leading to product first, not email)  

---

## Deployment Readiness

- **Build Status**: ✅ PASSING
- **Code Changes**: Ready for review
- **Testing**: Manual testing recommended before production
- **Deployment**: Ready for git push → Vercel auto-deploy
- **Rollback Plan**: git revert or restore from last commit

---

**Status**: 🔄 PHASE 4 IN PROGRESS  
**Last Updated**: 11 June 2026, 10:25 GMT+1  
**Build**: ✅ PASSING  
**Next**: Deploy & test with Ruan  
