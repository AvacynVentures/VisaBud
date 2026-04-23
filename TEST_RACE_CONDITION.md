# Document Upload Race Condition Test

## Test Objective
Verify that document uploads complete successfully even when Supabase auth token refresh happens during validation.

## Test Procedure

### Setup
1. Open VisaBud in browser (dev or prod)
2. Login with test account
3. Navigate to checklist page
4. Open DevTools (F12) → Console tab

### Test Case 1: Normal Upload (Control)
1. Upload a valid document (e.g., passport copy)
2. Observe: Document should show "validating..." spinner
3. After 3-5 seconds: Should show "✅ Document verified" or validation feedback
4. **Expected:** No console errors, upload completes

### Test Case 2: Upload + Auth Token Refresh (Race Condition Test)
1. Start document upload
2. Wait 1-2 seconds (while "validating...")
3. Open DevTools → Application → Cookies
4. Find the Supabase auth token cookie and **delete it**
   - Cookie name: `sb-sviztvlddcqffjtuzwhw-auth-token`
5. Within 2 seconds, Supabase will attempt to refresh the token
6. Observe upload behavior:
   - Should either complete successfully (API already sent the request before token expired)
   - Or should show proper error message ("Validation timed out...")
   - Should NOT show a cryptic auth error

### Test Case 3: Rapid Fire Uploads (Stress Test)
1. Select 3 documents from the checklist
2. Upload them all simultaneously (click upload, don't wait between)
3. Observe DevTools Console:
   - Should NOT see "Multiple GoTrueClient instances" warning
   - Should NOT see race condition errors
4. All uploads should progress independently
5. **Expected:** All complete without interference

### Acceptance Criteria
- ✅ No "Multiple GoTrueClient instances" warnings in console
- ✅ Upload completes even if auth token expires during validation
- ✅ Multiple uploads don't interfere with each other
- ✅ Error messages are user-friendly (not cryptic auth errors)
- ✅ Abort signal properly cancels in-flight requests

## Console Commands (Manual Testing)

If you want to manually test the abort signal:

```javascript
// Simulate upload timeout
fetch('/api/validate-document', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: 'base64-data-here',
    requirement: 'Passport biographical page',
    mimeType: 'image/png'
  }),
  signal: AbortSignal.timeout(3000) // Will abort after 3 seconds
}).then(r => r.json()).then(console.log).catch(e => console.error('Aborted:', e.name));
```

## Post-Fix Expectations

### Before Fixes
- Supabase GoTrueClient warns about multiple instances
- Upload may fail if auth token refreshes during validation
- Rapid uploads might interfere with each other

### After Fixes
1. ✅ Single Supabase client instance (singleton pattern in lib/supabase.ts)
2. ✅ Upload state isolated (upload-context.tsx)
3. ✅ Explicit cleanup on unmount (DocumentUpload.tsx useEffect)
4. ✅ 25-second timeout with proper abort handling
5. ✅ No console warnings about GoTrueClient

## Regression Testing

Run these after each fix:
- [ ] Test normal upload flow (single document)
- [ ] Test rapid uploads (3+ documents at once)
- [ ] Check console for any GoTrueClient warnings
- [ ] Monitor F12 → Network tab for /api/validate-document requests
- [ ] Verify all requests have proper timeouts

## Files Modified

- **lib/supabase.ts** — Already has singleton pattern ✅
- **components/HomeNavigation.tsx** — Now uses singleton client (Fix #1)
- **components/OnboardingGate.tsx** — Now uses singleton client (Fix #1)
- **lib/upload-context.tsx** — New file (Fix #2 - isolated state)
- **components/DocumentUpload.tsx** — Added cleanup hook (Fix #3)

## Next Steps

1. Deploy fixes to production
2. Monitor Sentry/console for upload errors in first 24h
3. Run race condition test after deployment
4. Document any edge cases found
