# Visa Advisor — Integration Guide

## Files Created

1. **`src/app/api/visa-advisor/route.ts`** — POST endpoint, calls Claude Haiku via Anthropic API
2. **`src/components/VisaAdvisor.tsx`** — Full chat UI with paygate, context awareness, suggested questions

## How It Works

### API Endpoint (`POST /api/visa-advisor`)
- Accepts: `{ message, history[], context{} }`
- Context includes: visa type, nationality, urgency, completed docs, purchased tier, etc.
- Builds a rich system prompt with all user context + gov.uk links + visa-specific knowledge
- Uses `claude-haiku-4-5-20250414` (fast, cheap, good enough for Q&A)
- Returns: `{ message, usage{ inputTokens, outputTokens } }`
- Rate limited at API level (429 handling built in)
- Uses `ANTHROPIC_API_KEY` env var (already configured for the project)

### Chat UI Component (`VisaAdvisor`)
Props:
- `unlocked` (boolean) — controls paygate. When false, shows locked preview.
- `compact` (boolean) — when true, renders as floating chat bubble (bottom-right corner)

Features:
- Full message history with markdown rendering (bold, links, bullets, headers)
- Gov.uk links rendered as clickable
- Typing indicator (bouncing dots)
- Suggested questions per visa type
- Context indicator showing doc completion
- Keyboard shortcut: Enter to send, Shift+Enter for newline
- Auto-scrolls to latest message
- Error handling with dismiss option

## Integration Points

### 1. Dashboard Page (`src/app/dashboard/page.tsx`)

Add as floating chat bubble (compact mode):

```tsx
import VisaAdvisor from '@/components/VisaAdvisor';

// Inside the dashboard JSX, at the bottom (before closing tags):
<VisaAdvisor unlocked={unlocked} compact />
```

### 2. Success Page (`src/app/app/success/page.tsx`)

Add as inline section (full mode):

```tsx
import VisaAdvisor from '@/components/VisaAdvisor';

// Inside the success page JSX, after the checklist:
<div className="mt-8">
  <VisaAdvisor unlocked={true} />
</div>
```

### 3. Any page behind paywall

```tsx
import VisaAdvisor from '@/components/VisaAdvisor';
import { useApplicationStore } from '@/lib/store';

// In component:
const { unlocked } = useApplicationStore();

// In JSX:
<VisaAdvisor unlocked={unlocked} />
```

## Environment Variables

No new env vars needed — uses existing `ANTHROPIC_API_KEY`.

## Cost Estimate

- Claude Haiku: ~$0.25/1M input tokens, ~$1.25/1M output tokens
- Average conversation turn: ~2K input tokens, ~500 output tokens
- **Cost per message: ~$0.001** (a tenth of a penny)
- 1,000 messages/day ≈ $1/day

## What It Answers

- "How do I submit?" → Full step-by-step submission walkthrough
- "What documents do I need?" → References their checklist, flags missing docs
- "How long will it take?" → Processing times with gov.uk source
- "Can I work while waiting?" → Visa-type-specific restrictions
- "What if I get refused?" → Options: admin review, appeal, reapply
- "How much does it cost?" → Full fee breakdown including IHS
- General visa Q&A with gov.uk links

## TypeScript

- Clean compile: `npx tsc --noEmit` passes with zero errors
- All types properly imported from existing `@/lib/store` and `@/lib/types`
- No new dependencies added
