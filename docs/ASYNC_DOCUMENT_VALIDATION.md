# Async Document Validation — Implementation Guide

## Problem

The original architecture sent the file to `/api/validate-document` and waited for Claude to respond (20–40s). The frontend's `fetch()` blocked the entire time, causing:

- UI hangs with a spinner stuck on "AI is checking..."
- Vercel function timeouts (default 10s on Hobby, 30s on Pro)
- 40-second force-complete hacks that marked invalid documents as valid
- Poor UX — users couldn't download their file or navigate away

## Solution: Async Upload + Polling

```
┌─────────┐     POST /api/documents      ┌──────────┐    Supabase Storage
│ Browser  │ ──────────────────────────▶  │  Upload   │ ──────▶ documents/
│          │ ◀── 201 { documentId }       │  Endpoint │ ──────▶ document_validations (pending)
│          │                              └──────────┘
│          │                                   │
│          │                              waitUntil() fires background job
│          │                                   │
│          │    GET /api/documents/{id}/status  ▼
│          │ ──────────────────────────▶ ┌──────────────┐
│          │ ◀── { status, feedback }    │ Status       │
│          │    (every 2s)               │ Endpoint     │
│          │                             └──────────────┘
│          │                                   │ reads
│          │                                   ▼
│          │                             document_validations
│          │                                   ▲ writes
│          │                                   │
│          │                             ┌──────────────┐
│          │                             │ Background   │
│          │                             │ Validator    │
│          │                             │ (waitUntil)  │
│          │                             └──────────────┘
└─────────┘                              Downloads file from storage
                                         Calls Claude vision API
                                         Updates DB row with result
```

### Key Benefits

1. **Upload returns in <2 seconds** — file is saved, user sees "Saved! AI checking..."
2. **No frontend timeout** — validation runs server-side in the background
3. **Download button immediately available** — file is already in storage
4. **Survives page reload** — `documentId` is persisted in Zustand; polling resumes
5. **Graceful degradation** — after 3 min of polling, marks document as saved with note

## Files Changed/Created

### New Files

| File | Purpose |
|------|---------|
| `src/app/api/documents/route.ts` | POST endpoint — saves file to Storage, creates DB row, fires async validation |
| `src/app/api/documents/[documentId]/status/route.ts` | GET endpoint — returns current validation status |
| `src/lib/document-validator.ts` | Background validation logic — downloads file, runs classification + AI check |
| `src/lib/document-types.ts` | Shared TypeScript types for the async system |
| `supabase/migrations/007_document_validations.sql` | DB migration for `document_validations` table |

### Modified Files

| File | Changes |
|------|---------|
| `src/components/DocumentUpload.tsx` | Refactored: uploads via FormData, polls for status, shows pending state with download |
| `src/lib/store.ts` | Added `documentId` to `DocumentUploadState`, updated persist logic for pending state |

### Preserved (Not Deleted)

| File | Why |
|------|-----|
| `src/app/api/validate-document/route.ts` | Kept for backward compatibility — other parts of the app may use it |

## Setup Steps

### 1. Run the Database Migration

```bash
# Via Supabase CLI (if linked)
supabase db push

# Or manually in Supabase Dashboard → SQL Editor:
# Paste contents of supabase/migrations/007_document_validations.sql
```

### 2. Create the Storage Bucket

The migration attempts to create it, but if that fails (permission), do it manually:

1. Go to Supabase Dashboard → Storage
2. Create bucket named `documents`
3. Set it to **Private** (not public)
4. No additional policies needed — we use the service role key server-side

### 3. Verify Environment Variables

These should already exist:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # Required for server-side storage/DB ops
ANTHROPIC_API_KEY=...             # For Claude vision
```

### 4. Deploy

```bash
git add -A
git commit -m "feat: async document validation with polling"
git push origin main
```

Vercel will auto-deploy. The `after()` (Next.js 15) or fire-and-forget pattern handles async validation on Vercel serverless.

## Architecture Decisions

### Why DB Polling Instead of Inngest?

1. **Zero additional services** — no Inngest account, no webhook URL config, no extra billing
2. **Works on Vercel Hobby + Pro** — `waitUntil`/`after` is native
3. **Simpler debugging** — just check the `document_validations` table
4. **Good enough** — at VisaBud's scale, polling every 2s is negligible load
5. **Easy to migrate later** — if you need Inngest, the `runDocumentValidation()` function is already extracted

### Why `waitUntil` / `after` Instead of a Separate Cron?

- Validation starts immediately after upload (no delay waiting for cron tick)
- No additional Vercel cron job to configure
- `after()` (Next.js 14.1+) is purpose-built for this pattern
- Falls back gracefully to fire-and-forget if `after` isn't available

### Why Keep Base64 in Zustand?

- Enables instant download button without hitting Supabase Storage
- Stripped from localStorage persistence to avoid bloat
- Only lives in memory during the session

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Page reload during validation | `documentId` persists in localStorage; polling resumes on mount |
| Claude takes >3 minutes | Polling stops, marks as "saved" with note to check back |
| Network error during polling | Polling continues — single failures don't stop the loop |
| Upload fails | Error state with retry button, nothing saved to DB |
| No API key configured | Validation row set to "error" with helpful message |
| User cancels during upload | AbortController cancels fetch, polling stops, state resets |
| User cancels during validation | Polling stops, state resets (DB row stays for cleanup) |
| Multiple uploads to same doc slot | Previous polling stops, new upload starts fresh |

## Monitoring

Check the `document_validations` table for stuck jobs:

```sql
-- Documents stuck in pending/processing for >5 minutes
SELECT id, doc_id, file_name, status, created_at
FROM document_validations
WHERE status IN ('pending', 'processing')
AND created_at < now() - interval '5 minutes'
ORDER BY created_at DESC;
```

Optional: add a Supabase Edge Function or cron to retry stuck validations.
