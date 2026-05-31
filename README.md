<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Redis-cache-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

<div align="center">
  <h1>🇩🇪 LEARNGERMAN</h1>
  <p><strong>AI-Powered German Language Learning Platform</strong></p>
  <p><em>Master German through interactive lessons, AI conversation practice, personalized feedback, and real-time evaluations — all free.</em></p>
  <br/>
  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-authentication">Auth</a> •
    <a href="#-ai-engine">AI Engine</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
</div>

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **🎓 CEFR-Aligned Courses** | Structured curriculum from A1 to C1 with sequenced lessons, exercises, and quizzes |
| **🤖 AI Conversation Tutor** | Real-time chat practice powered by Groq (Llama 3) — low-latency, context-aware responses |
| **🎤 Speaking Evaluation** | AI-generated feedback on pronunciation, fluency, intonation, and grammatical accuracy |
| **📝 Writing Evaluation** | Grammar, vocabulary, and structural feedback on written German compositions |
| **📖 Reading Comprehension** | Level-adaptive reading passages with AI-generated comprehension questions |
| **🎧 Listening Practice** | Audio exercises with transcripts, speed control, and comprehension checks |
| **📐 Grammar Practice** | Interactive drills covering cases, tenses, prepositions, and word order — with instant correction |
| **📝 Spaced-Repetition Flashcards** | Gender-color-coded flashcards with SM-2 spaced repetition algorithm |
| **🧠 Multi-Provider AI Engine** | Intelligent routing across 5 free-tier AI providers with Redis caching and BullMQ job queue |
| **🔐 Supabase Auth** | Email verification, password reset, social login, session management — all handled by Supabase |
| **📊 Progress Analytics** | Per-skill mastery tracking, XP system, daily streaks, performance charts, and leaderboards |
| **🔧 Admin Panel** | Full CRUD for courses/lessons/users/media, WYSIWYG editor, analytics dashboard |
| **⚙️ Admin AI Training** | Prompt template editor, few-shot example uploader, model configuration, usage analytics |
| **🌐 Page Builder** | Drag-and-drop editor for main website pages (home, about, pricing, FAQ) |
| **🔄 Auto-Update System** | One-click deployment with version history, rollback support, and migration scripts |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Language** | TypeScript (strict mode) | Full-stack type safety across all 4 applications |
| **Frontend** | React 18 + Vite + Tailwind CSS v4 | Student-facing learning application |
| **Admin Panel** | React 18 + Vite + Tailwind CSS v4 + Recharts + TipTap | Content and user management console |
| **Backend** | Node.js + Express + TypeScript | REST API server |
| **Database** | PostgreSQL + Prisma ORM | Data persistence with type-safe queries |
| **Auth** | Supabase Auth _(sole provider)_ | Email verification, password reset, social login — no custom JWT |
| **Caching** | Redis | AI response caching, BullMQ backing store, session store |
| **Queue** | BullMQ | Async AI generation job queue (prevents HTTP timeouts) |
| **AI Engine** | Gemini → Groq → OpenRouter → SambaNova → Cerebras | Content generation, evaluation, and tutoring |
| **Deployment** | Docker + Coolify / Render | Containerized hosting with CI/CD |
| **Monitoring** | Sentry + Winston | Error tracking and structured logging |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Student (React + Vite)     Admin Panel (React + Vite)         │
│  Port 5173                   Port 5174                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (Supabase session token)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend (Express + TypeScript)                                  │
│  Port 5000                                                       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Routes   │→│Controllers│→│Services  │→│ Prisma ORM    │   │
│  └──────────┘  └──────────┘  └──────────┘  │ PostgreSQL    │   │
│                                            └───────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ Redis    │  │ BullMQ   │  │ Supabase │                       │
│  │ Cache    │  │ Queue    │  │ Auth     │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ Internal HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  AI Engine (TypeScript, Port 6000)                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Gemini   │  │ Groq     │  │ Open     │  │ SambaNova     │   │
│  │ (primary)│  │ (chat)   │  │ Router   │  │ (grammar)     │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ Cerebras │  │ Prompt   │  │ Evaluator│                       │
│  │ (batch)  │  │ Templates│  │ Service  │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Installation |
|------|---------|-------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 14+ | [postgresql.org](https://postgresql.org) |
| npm | Latest | Ships with Node.js |
| Docker | Latest | [docker.com](https://docker.com) _(optional, for Redis)_ |

### 1. Clone & Generate Code

```bash
git clone <repository-url>
cd learngerman

# Option A: Generate via mega-prompt (recommended)
#   1. Copy roo-code-mega-prompt.txt
#   2. Paste into Roo Code — code generates under build/v.1.0.0/

# Option B: Code already generated
npm install
```

### 2. Environment Configuration

```bash
cp .env.example build/v.1.0.0/backend/.env
# Edit with your API keys (see below)
```

**Required environment variables:**

| Variable | Description | Provider |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Local / Supabase |
| `SUPABASE_URL` | Supabase project URL | [supabase.com](https://supabase.com) |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | [supabase.com](https://supabase.com) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | [supabase.com](https://supabase.com) |
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| `GROQ_API_KEY` | Groq API key | [console.groq.com](https://console.groq.com) |
| `REDIS_URL` | Redis connection string | `redis://default:password@localhost:6379` |

### 3. Database Setup

```bash
cd build/v.1.0.0/backend
npx prisma migrate dev --name init
npx prisma generate
# Optional: seed sample data
npx prisma db seed
```

### 4. Start Development Servers

```bash
cd build/v.1.0.0
npm run dev
```

| Service | URL | Port |
|---------|-----|------|
| 🌐 **Student App** | http://localhost:5173 | 5173 |
| 🔐 **Admin Panel** | http://localhost:5174 | 5174 |
| ⚙️ **API Server** | http://localhost:5000 | 5000 |
| 🧠 **AI Engine** | http://localhost:6000 | 6000 |

---

## 🔐 Authentication

LEARNGERMAN uses **Supabase Auth** as its **sole authentication provider**. There is no custom JWT implementation, no bcrypt, no jsonwebtoken, and no custom password hashing anywhere in the codebase.

### Why Supabase Auth?

- ✅ **Free tier** — up to 50,000 monthly active users
- ✅ **Email verification** — automatic, customizable email templates
- ✅ **Password reset** — built-in flow with email link
- ✅ **Social login** — Google, GitHub, Apple (configurable in Supabase dashboard)
- ✅ **Session management** — auto-refresh, multi-tab sync, secure storage
- ✅ **MFA support** — time-based one-time passwords (TOTP)
- ✅ **No security burden** — Supabase handles password hashing, brute-force protection, and token rotation

### Setup

```bash
# 1. Create a project at https://supabase.com
# 2. Go to Settings → API — copy URL + keys
# 3. Set in backend/.env:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. In Supabase Dashboard → Authentication → Settings:
#    - Enable email confirmations
#    - Set Site URL to http://localhost:5173
#    - Add http://localhost:5173 to Redirect URLs
```

### Auth Flow

```
User Registration (Frontend):
  supabase.auth.signUp({ email, password })
  → Supabase sends verification email
  → User clicks link → redirected to app with session token
  → Frontend detects session → POST /auth/register to backend
  → Backend creates User record with supabaseId

User Login (Frontend):
  supabase.auth.signInWithPassword({ email, password })
  → Supabase returns session token
  → Frontend stores session, calls GET /auth/me
  → Backend verifies token via supabaseAdmin.auth.getUser(token)
  → Returns user data

Protected Routes:
  axios interceptor attaches session token as Authorization header
  Backend authMiddleware verifies via supabaseAdmin.auth.getUser()
  Attaches user from database to req.user
```

---

## 🤖 AI Engine

### Provider Stack

| Provider | Model | Daily Limit | Best For |
|----------|-------|-------------|----------|
| **Google Gemini** | Gemini 2.5 Flash | ~1,500 req/day | Lesson generation, content creation |
| **Groq** | Llama 3.3 70B | ~1,000 req/day | Real-time AI chat tutoring |
| **OpenRouter** | Multiple free models | ~200 req/day | Fallback provider |
| **SambaNova** | DeepSeek R1 | Free tier | Grammar analysis, writing evaluation |
| **Cerebras** | Llama 3.3 70B | ~1,700 req/day | Batch evaluation |

### Request Pipeline (with Redis + BullMQ)

```
                     ┌──────────────┐
                     │  User Request │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │  Redis Cache │
                     │  (check hash)│
                     └──┬───────┬───┘
                        │       │
                   cache hit  cache miss
                        │       │
                        │  ┌────▼────────┐
                        │  │ BullMQ Queue │
                        │  │ (async job)  │
                        │  └────┬────────┘
                        │       │
                        │  ┌────▼───────────┐
                        │  │ Provider Router │
                        │  │ (failover chain)│
                        │  └────┬───────────┘
                        │       │
                        │  ┌────▼───────┐
                        │  │ Redis Cache │
                        │  │ (store)     │
                        │  └────┬───────┘
                        │       │
                        │  ┌────▼──────────┐
                        └──► Notify Client  │
                           └───────────────┘
```

### Why Redis + BullMQ?

| Concern | Without | With Redis + BullMQ |
|---------|---------|-------------------|
| **API quota exhaustion** | Every identical prompt burns quota | Cached responses return instantly (same hash = same result) |
| **Request timeout** | 30s HTTP timeout on long generations | Jobs processed asynchronously, frontend polls for result |
| **Concurrent users** | 5 users → 5 simultaneous API calls → quota drain | Queue processes one at a time with backpressure |
| **Failed requests** | User sees error, retries immediately | Automatic retry with exponential backoff (3 attempts) |

---

## 📁 Project Structure

```
build/v.1.0.0/
├── frontend/                    # Student-facing React app (Vite, TypeScript, port 5173)
│   └── src/
│       ├── pages/              # Route-level page components (Auth, Dashboard, Courses, AI, etc.)
│       ├── components/         # Reusable UI components (Button, Card, Modal, etc.)
│       ├── hooks/              # Custom hooks (useAuth, useCourses, useAIChat, useHearing)
│       ├── store/              # Zustand stores (auth, courses, progress, UI)
│       ├── utils/              # API client, Supabase client, formatters, validators
│       └── styles/             # Tailwind CSS v4 with custom theme
│
├── admin/                       # Admin panel (React, Vite, TypeScript, port 5174)
│   └── src/
│       ├── pages/              # Admin pages (Dashboard, Content, Users, AI Training, Website, Updates)
│       ├── components/         # Admin UI (DataTable, StatCard, WYSIWYGEditor, VersionUploader)
│       ├── hooks/              # Admin hooks
│       ├── store/              # Admin Zustand stores
│       ├── api/                # Admin API functions
│       └── utils/              # Admin utilities & permissions
│
├── backend/                     # Express API server (TypeScript, port 5000)
│   └── src/
│       ├── controllers/        # Route handler functions
│       ├── routes/             # Express routers (auth, courses, AI, admin, etc.)
│       ├── services/           # Business logic (AI orchestration, Redis cache, BullMQ queue)
│       ├── middleware/         # Supabase auth verification, validation, error handling
│       ├── cache/              # Redis caching service
│       ├── queue/              # BullMQ job queue for async AI generation
│       ├── prisma/             # Database schema + migrations
│       └── utils/              # Helpers & formatters
│
└── ai-engine/                   # AI orchestration service (TypeScript, port 6000)
    ├── providers/              # AI provider adapters (Gemini, Groq, OpenRouter, SambaNova, Cerebras)
    ├── services/               # Content generation, evaluation, vocabulary extraction
    └── templates/              # Prompt templates with level-appropriate content
```

---

## 📋 API Overview

| Endpoint | Method | Auth Required | Description |
|----------|--------|:---:|-------------|
| `GET /api/auth/me` | GET | ✅ | Get current user profile |
| `PUT /api/auth/profile` | PUT | ✅ | Update name, avatar, language preferences |
| `DELETE /api/auth/account` | DELETE | ✅ | Delete user account |
| `GET /api/courses` | GET | ✅ | List all published courses |
| `GET /api/courses/:id` | GET | ✅ | Get course details with lessons |
| `GET /api/lessons/:id` | GET | ✅ | Get lesson with exercises |
| `POST /api/exercises/:id/attempt` | POST | ✅ | Submit exercise answer (auto-graded) |
| `POST /api/quizzes/:id/start` | POST | ✅ | Start a quiz attempt |
| `POST /api/quizzes/attempt/:id/submit` | POST | ✅ | Submit quiz and get score |
| `POST /api/ai/chat` | POST | ✅ | Send message to AI Tutor |
| `POST /api/ai/speaking` | POST | ✅ | Submit speaking for evaluation |
| `POST /api/ai/writing` | POST | ✅ | Submit writing for evaluation |
| `GET /api/admin/*` | GET | ✅ + Admin | Admin CRUD operations |

> **Note:** Registration and login do NOT use backend endpoints — they go through Supabase Auth SDK on the frontend. The backend only has `GET /me`, `PUT /profile`, and `DELETE /account`.

---

## 🚢 Deployment

### Option 1: Render (Free Tier — Development/Staging)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Push repository to GitHub
2. Go to [render.com](https://render.com) → **New Blueprint**
3. Connect your repository — Render auto-detects `render.yaml`
4. Add environment variables in Render dashboard
5. Deploy

### Option 2: VPS + Coolify (Production)

```bash
# Hetzner CX22 (~€5/mo) or similar VPS with 2 vCPU, 4GB RAM
# Install Coolify:
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Deploy via Docker Compose:
docker-compose up -d
```

| Resource | Minimum Spec | Why |
|----------|-------------|-----|
| **vCPU** | 2 cores | 4 Node.js processes + PostgreSQL + Redis |
| **RAM** | 4 GB | Redis needs ~1GB, PostgreSQL ~512MB, Node ~256MB each |
| **Storage** | 20 GB SSD | Database + media uploads + logs |

---

## 🧪 Validation Commands

```bash
# TypeScript type checking (all sub-projects)
cd build/v.1.0.0/backend && npx tsc --noEmit
cd build/v.1.0.0/frontend && npx tsc --noEmit
cd build/v.1.0.0/admin && npx tsc --noEmit
cd build/v.1.0.0/ai-engine && npx tsc --noEmit

# Build verification
cd build/v.1.0.0/frontend && npm run build
cd build/v.1.0.0/admin && npm run build

# Database
cd build/v.1.0.0/backend && npx prisma validate
cd build/v.1.0.0/backend && npx prisma generate

# Tests
cd build/v.1.0.0/backend && npm test
cd build/v.1.0.0/frontend && npm test

# Linting (root)
npm run lint
```

---

## 🗺️ Development Roadmap

| Phase | Focus | Est. Files | Dependencies |
|:-----:|-------|:----------:|:------------:|
| **0** | 🏗️ Project Scaffolding | ~30 | None |
| **1** | 🔐 Database & Auth (Supabase) | ~15 | Phase 0 |
| **2** | 📚 Courses & Lessons Engine | ~25 | Phase 1 |
| **3** | ✏️ Exercises & Quizzes Engine | ~25 | Phase 2 |
| **4** | 📊 Dashboard & User Profile | ~20 | Phase 3 |
| **5** | 🧠 AI Engine Foundation (Redis + BullMQ) | ~25 | Phase 1 |
| **6** | 🤖 AI Features (Chat, Speaking, Writing, etc.) | ~25 | Phase 5 |
| **7** | ⚙️ Admin AI Training System | ~20 | Phase 5 |
| **8** | 🚢 Deployment & DevOps | ~10 | Phase 6 |
| **9** | 🎨 UI Polish & Components | ~20 | Phase 6 |
| **10** | ✅ Testing & QA | ~30 | Phase 9 |
| **11** | ⚡ Performance Optimization | ~15 | Phase 10 |
| **12** | 🔒 Security Hardening | ~12 | Phase 10 |
| **13** | 📈 Analytics & Monitoring | ~10 | Phase 10 |
| **14** | 📖 API Documentation | ~8 | Phase 10 |
| **15** | 💳 Payment Integration _(Optional)_ | ~12 | Phase 10 |
| **16** | 📱 Mobile PWA Support _(Optional)_ | ~10 | Phase 10 |

---

## 📄 License

MIT — See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) — Free PostgreSQL hosting + authentication
- [Google Gemini](https://deepmind.google.com/gemini) — Free AI content generation
- [Groq](https://groq.com) — Ultra-fast free inference (Llama 3)
- [OpenRouter](https://openrouter.ai) — Multi-provider AI fallback
- [SambaNova](https://sambanova.ai) — Free grammar analysis (DeepSeek R1)
- [Cerebras](https://cerebras.ai) — Free batch evaluation (Llama 3)
- [Render](https://render.com) — Free-tier hosting
- [Redis](https://redis.io) & [BullMQ](https://bullmq.io) — Caching & job queues
- [Talkpal.ai](https://talkpal.ai) & [Duolingo](https://duolingo.com) — UX inspiration

---

<p align="center"><em>Built with ❤️ for German learners everywhere.</em></p>
