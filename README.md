# VisaBud - UK Visa Application Guidance SaaS

> Get your UK visa ready without the stress. Personalized checklist, documents, and step-by-step guidance.

## 🚀 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel
- **DNS:** Cloudflare

## 📁 Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── lib/                      # Utilities
│   ├── supabase.ts          # Supabase client
│   ├── stripe.ts            # Stripe client
│   └── types.ts             # TypeScript types
└── components/               # Reusable components (TBD)
```

## 🛠️ Getting Started

### 1. Clone & Install

```bash
cd 04_Code
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in credentials:

```bash
cp .env.example .env.local
```

**Required credentials:**
- Supabase URL + keys (create free project at https://supabase.com)
- Stripe keys (https://stripe.com)
- Resend API key (https://resend.com)

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 📋 Feature Roadmap

### Phase 1 (MVP - Week 1)
- [x] Landing page with hero + trust signals
- [ ] Onboarding form (5 steps)
  - Visa type selection
  - Personal situation questionnaire
  - Financial & employment info
  - Review & confirmation
  - Payment gate
- [ ] Results dashboard
  - Interactive checklist
  - Timeline visualization
  - Risk alerts
  - PDF export
- [ ] Stripe payment integration
- [ ] Email sequences

### Phase 2 (V1.1)
- [ ] Multi-visa types (Skilled Worker, Citizenship)
- [ ] Document review upsell service (£99)
- [ ] Priority support subscription (£19/month)
- [ ] User authentication & account dashboard
- [ ] Analytics & conversion tracking

### Phase 3 (Growth)
- [ ] AI assistant panel (ChatGPT for Q&A)
- [ ] Mobile app (React Native)
- [ ] Multi-country expansion (Australia, Canada)
- [ ] Partner integrations (immigration lawyers)

## 🔐 Security

- Row-level security (RLS) on all Supabase tables
- HTTPS only
- GDPR compliant (user data encryption, deletion rights)
- Stripe PCI compliance
- OWASP security headers

## 💰 Unit Economics (Target)

| Metric | Value |
|--------|-------|
| Price | £34.99 |
| Gross Margin | 95% |
| Net Margin | 75-80% |
| Target CAC | £5-10 |
| LTV | £45-55 |
| Break-even | 40-60 sales/month |
| Scale potential | £26K/month net at 1000 users/month |

## 📊 Launch Checklist

- [ ] Supabase schema deployed
- [ ] Stripe product & pricing configured
- [ ] Domain registered & DNS configured
- [ ] SSL certificate (auto via Vercel)
- [ ] Environment variables set
- [ ] Landing page live
- [ ] Onboarding flow complete
- [ ] Payment flow tested
- [ ] Legal docs (Privacy, ToS, Disclaimers)
- [ ] Analytics tracking
- [ ] Email sequences ready
- [ ] Community seeding plan

## 🚢 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Database (Supabase)

1. Create project at https://supabase.com
2. Run schema.sql in SQL editor
3. Copy credentials to env variables

### Payments (Stripe)

1. Create account at https://stripe.com
2. Create product (VisaBud Full Access)
3. Create price (£34.99)
4. Set webhook endpoint: `yourdomain.com/api/webhooks/stripe`

## 📚 Documentation

- `/01_Research/` - Market research & personas
- `/02_Copy/` - UI microcopy & email templates
- `/03_Backend/` - Database schema & API docs
- `/SPRINT.md` - Build timeline & tasks

## 🤝 Contributing

This is a closed-source, single-founder project. No external contributions.

## 📄 License

Proprietary. All rights reserved.

---

**Built by Tim Vorster** | **For Ruan Van Vuuren** | **Avacyn Ventures Ltd**
