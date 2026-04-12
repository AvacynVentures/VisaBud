# VisaBud Deployment Guide

## ✅ COMPLETED
- [x] Rebrand: All VisaPath → VisaBud across entire codebase
- [x] Git repo initialized with clean commit
- [x] GitHub repo created: https://github.com/AvacynVentures/VisaBud (PUBLIC)
- [x] Code pushed to main branch

## 🔲 RUAN ACTION REQUIRED

### Step 1: Create Vercel Account & Import Project
1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub" → authorize with AvacynVentures account
3. Click "Add New..." → "Project"
4. Import the **VisaBud** repo from GitHub
5. Framework preset should auto-detect **Next.js**
6. **Before clicking Deploy**, add environment variables (Step 2)

### Step 2: Add Environment Variables in Vercel
In the Vercel project settings, add ALL of these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (from .env.local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from .env.local) |
| `SUPABASE_SERVICE_ROLE_KEY` | (from .env.local) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (from .env.local) |
| `STRIPE_SECRET_KEY` | (from .env.local) |
| `STRIPE_WEBHOOK_SECRET` | (from .env.local — will be updated after creating webhook) |
| `NEXT_PUBLIC_STRIPE_PRICE_STANDARD` | (from .env.local) |
| `NEXT_PUBLIC_STRIPE_PRICE_PREMIUM` | (from .env.local) |
| `NEXT_PUBLIC_STRIPE_PRICE_EXPERT` | (from .env.local) |
| `NEXT_PUBLIC_SITE_URL` | `https://visabud.co.uk` |
| `NEXT_PUBLIC_APP_URL` | `https://visabud.co.uk` |

> **Note:** All secret values are in `.env.local` (not committed to git). Copy from there.

7. Click **Deploy**

### Step 3: Add Custom Domain
1. After deploy succeeds, go to Project Settings → Domains
2. Add `visabud.co.uk`
3. Vercel will show you DNS records to configure
4. **Option A (Recommended - CNAME):** In Namecheap Advanced DNS:
   - Add CNAME: `@` → `cname.vercel-dns.com`
   - Add CNAME: `www` → `cname.vercel-dns.com`
5. **Option B (Nameservers):** Change Namecheap nameservers to Vercel's
6. Wait 5-15 min for propagation
7. Vercel auto-provisions SSL certificate

### Step 4: Update Supabase Auth Redirect
1. Go to https://supabase.com → project settings → Authentication → URL Configuration
2. Set **Site URL** to: `https://visabud.co.uk`
3. Add to **Redirect URLs**: `https://visabud.co.uk/auth/callback`

### Step 5: Stripe Webhook
1. Go to https://dashboard.stripe.com → Developers → Webhooks
2. Add endpoint: `https://visabud.co.uk/api/webhooks/stripe`
3. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the new webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel env vars
6. Redeploy

### Step 6: Smoke Test
- [ ] https://visabud.co.uk loads
- [ ] SSL padlock shows
- [ ] Sign up with email works
- [ ] 5-step wizard completes
- [ ] Dashboard shows "VisaBud" branding
- [ ] Paywall modal shows 3 tiers
- [ ] Stripe checkout redirects properly
- [ ] /visa-guides pages load
- [ ] /sitemap.xml returns XML
- [ ] /robots.txt returns correct content
