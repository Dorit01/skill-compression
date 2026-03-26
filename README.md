# Skill Compression AI 🚀

A production-ready SaaS MVP for ultra-fast skill acquisition using AI-generated micro-learning.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **AI:** OpenAI GPT-4o
- **Payments:** Stripe

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database

### 2. Installation

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate one using `openssl rand -base64 32`
- `OPENAI_API_KEY`: From OpenAI Dashboard
- `STRIPE_SECRET_KEY`: From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET`: From Stripe CLI or Dashboard
- `STRIPE_PREMIUM_PRICE_ID`: Create a subscription product in Stripe

### 4. Database Initialization

```bash
npx prisma db push
```

### 5. Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🔑 Key Features fully implemented:
- **Auth:** Signup, Login, Protected Routes.
- **Skill Generation:** AI-powered curriculum creation with actionable exercises.
- **Mastery Player:** Step-by-step learning interface with progress persistence.
- **Spaced Repetition (SRS):** Automatic review scheduling (1d, 3d, 7d) for Pro users.
- **Monetization:** Stripe Checkout integration & automated webhook syncing.
- **Limits:** Freemium logic enforced on the backend (1 active skill, 5 gens for free).

## 🗄 Project Structure
- `/src/app/api`: Backend routes (Auth, Skills, Stripe).
- `/src/app/dashboard`: Main user hub.
- `/src/app/skills`: Learning experience player.
- `/src/lib`: Core services (AI, Auth, Stripe, Prisma).
- `/prisma`: Database schema.

## 💰 Monetization Logic
- **Free Tier:** 1 active skill, 5 total generations, no SRS.
- **Pro Tier ($10/mo):** Unlimited everything + Spaced Repetition.
