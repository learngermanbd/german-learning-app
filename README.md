# 🇩🇪 LEARNGERMAN — AI-Powered German Learning Platform

> **Master German through interactive lessons, AI conversation practice, personalized feedback, and real-time evaluations — all free.**

LEARNGERMAN is a full-stack, CEFR-aligned (A1–C1) German language learning platform built with modern web technologies. It features a multi-provider AI engine that intelligently routes requests across free-tier APIs for cost-effective scalability, along with a comprehensive admin panel for content management and AI training.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🎓 CEFR-Aligned Courses** | Structured curriculum from A1 to C1 with sequenced lessons, exercises, and quizzes |
| **🤖 AI Conversation Tutor** | Real-time chat practice powered by Groq (Llama 3) for low-latency responses |
| **🎤 Speaking Evaluation** | AI-generated feedback on pronunciation, fluency, intonation, and accuracy |
| **📝 Writing Evaluation** | Grammar, vocabulary, and structure feedback on written German |
| **📖 Reading Comprehension** | Level-adaptive reading passages with AI-generated comprehension questions |
| **🎧 Listening Practice** | Audio exercises with transcripts and comprehension checks |
| **📐 Grammar Practice** | Interactive grammar drills with instant correction and rule explanations |
| **📝 Vocabulary Flashcards** | Spaced-repetition flashcards with gender-color coding |
| **🧠 Multi-Provider AI Engine** | Intelligent routing across 5 free-tier AI providers with automatic failover |
| **🔐 Email Verification** | Supabase Auth with automatic email verification (no manual email code needed) |
| **🛡️ Captcha Protection** | Cloudflare Turnstile on registration and login — frictionless bot protection |
| **📊 Progress Analytics** | Per-skill mastery tracking, XP system, daily goals, and performance charts |
| **🔧 Admin Panel** | Course/lesson CRUD, user management, media library, analytics, AI training system |
| **⚡ WYSIWYG Editor** | WordPress-style HTML content editor for lesson content |
| **🔄 Auto-Update System** | One-click deployment with version history, rollback, and migration support |
| **🌐 Page Builder** | Drag-and-drop main website editor (home, about, pricing, FAQ pages) |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, React Router v6 | Student-facing learning app |
| **Admin Panel** | React 18, Vite, Tailwind CSS, Zustand, Recharts, react-quill | Admin content management |
| **Backend** | Node.js, Express.js, Prisma ORM | REST API server |
| **Database** | PostgreSQL (Supabase → self-hosted) | Data persistence |
| **Auth** | Supabase Auth + JWT | Authentication & email verification |
| **Captcha** | Cloudflare Turnstile | Bot protection (register + login) |
| **AI Engine** | Gemini, Groq, OpenRouter, SambaNova, Cerebras | Content generation & evaluation |
| **Deployment** | Docker, Coolify, Render | Hosting & CI/CD |

---

## 📁 Project Structure

```
├── frontend/                  # Student-facing React app (Vite)
│   ├── src/
│   │   ├── pages/            # Route pages (Auth, Dashboard, Courses, AI, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom hooks (useAuth, useCourses, etc.)
│   │   ├── store/            # Zustand stores
│   │   └── utils/            # API client, helpers
│   └── .env.example
│
├── admin/                     # Admin panel React app (Vite)
│   ├── src/
│   │   ├── pages/            # Admin pages
│   │   ├── components/       # Admin UI components
│   │   ├── hooks/            # useAdminAuth, etc.
│   │   └── store/            # Admin Zustand stores
│   └── .env.example
│
├── backend/                   # Express API server
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # Express routers
│   │   ├── middleware/       # Auth, validation, rate-limiting
│   │   ├── utils/            # JWT, Supabase client, helpers
│   │   └── prisma/
│   │       └── schema.prisma # Database schema
│   └── .env.example
│
├── ai-engine/                 # AI orchestration service
│   ├── providers/            # Gemini, Groq, OpenRouter, etc. adapters
│   ├── router.js             # Intelligent request routing
│   └── templates/            # Prompt templates
│
├── docker-compose.yml         # Production Docker setup
├── Dockerfile                 # Backend container
├── nginx.conf                 # Reverse proxy config
└── render.yaml                # Render blueprint
```

---

## 🚀 Quick Start — Local Development

### Prerequisites

| Tool | Version | Installation |
|------|---------|-------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 14+ | `brew install postgresql` or [postgresql.org](https://postgresql.org) |
| npm / pnpm | Latest | Ships with Node.js |
| Docker | Latest | [docker.com](https://docker.com) (optional) |

### 1. Clone & Install

```bash
git clone <repository-url>
cd learngerman

# Install all packages
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin
npm install --prefix ai-engine
```

### 2. Environment Variables

Copy the example `.env` files and configure them:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
cp ai-engine/.env.example ai-engine/.env
```

#### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/learngerman

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Supabase Auth
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Cloudflare Turnstile (Captcha)
CAPTCHA_SECRET_KEY=0x4AAAAAAA...

# Frontend URL (for CORS + email redirects)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_CAPTCHA_SITE_KEY=0x4AAAAAAA...
```

#### Admin Panel (`admin/.env`)

```env
VITE_API_URL=http://localhost:5000/api/admin
```

#### AI Engine (`ai-engine/.env`)

```env
# At least one API key required — add all for automatic failover
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
SAMBA_NOVA_API_KEY=
CEREBRAS_API_KEY=
```

### 3. Database Setup

```bash
cd backend

# Apply Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# (Optional) Seed sample data
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend (port 5000)
cd backend && npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend && npm run dev

# Terminal 3: Admin Panel (port 5174)
cd admin && npm run dev

# Terminal 4: AI Engine (port 3001)
cd ai-engine && npm run dev
```

Your app is now running:
- **🌐 Student App:** http://localhost:5173
- **🔐 Admin Panel:** http://localhost:5174
- **⚙️ API Server:** http://localhost:5000

---

## 🔐 Authentication Setup

### Supabase Auth + Email Verification

This app uses **Supabase Auth** for email verification — no manual email sending code needed.

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your **Project URL** and **anon public key**
3. Set them in `backend/.env`:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. In Supabase Dashboard → **Authentication → Settings**:
   - ✅ Turn **Enable email confirmations** ON
   - Set **Site URL** to `http://localhost:5173`
   - Add `http://localhost:5173/verify-email` to **Redirect URLs**
5. (Optional) Configure **Custom SMTP** in Auth → Settings to use branded email

**How it works:**
- User registers → Supabase sends a verification email automatically
- User clicks link → redirected to `/verify-email#access_token=xxx`
- Supabase client detects the hash fragment → signs user in → calls backend to confirm
- Backend validates with `supabase.auth.getUser()` → marks `emailVerified: true`

### Cloudflare Turnstile Captcha

Bot protection on registration and login — frictionless (no "select traffic lights" puzzles).

1. **Create a Cloudflare account** and go to [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/turnstile)
2. Click **Add Site** → choose **Managed** mode → add your domains:
   - `localhost` (development)
   - `your-app.onrender.com` (production)
3. Copy the **Site Key** and **Secret Key**
4. Set the keys:
   ```env
   # backend/.env
   CAPTCHA_SECRET_KEY=0x4AAAAAAA...
   
   # frontend/.env
   VITE_CAPTCHA_SITE_KEY=0x4AAAAAAA...
   ```

**Flow:** Turnstile widget renders on register/login pages → user completes passively → token sent with form → backend verifies via `/siteverify` endpoint.

---

## 🤖 AI Engine Configuration

The platform intelligently routes requests across multiple free-tier AI providers with automatic failover.

| Provider | Model | Free Daily Limit | Best For |
|----------|-------|-----------------|----------|
| **Google Gemini** | Gemini 2.5 Flash | ~1,500 requests | Lesson generation, reading content |
| **Groq** | Llama 3.3 70B | ~1,000 requests | Real-time AI chat tutoring |
| **OpenRouter** | Multiple models | ~200 requests | Fallback provider |
| **SambaNova** | DeepSeek R1 | Free tier | Grammar analysis, writing evaluation |
| **Cerebras** | Llama 3.3 70B | ~1,700 requests | Batch evaluation, exercise generation |

**At least one API key is required.** Add keys to `ai-engine/.env`. The engine will:
1. Try the primary provider for the task type
2. On failure/rate-limit → automatically failover to the next provider
3. Log all usage to the `AIUsageLog` table for analytics

---

## 🚢 Deployment

### Option 1: Render (Free Tier — Development)

1. Push your repo to GitHub/GitLab
2. Go to [render.com](https://render.com) → **New Blueprint**
3. Connect your repo → Render auto-detects `render.yaml`
4. Add environment variables in Render dashboard
5. Deploy — your app will be live at `https://your-app.onrender.com`

> ⚠️ **Note:** Render's free tier spins down after 15 min of inactivity. First request after idle takes ~5-10s to wake up.

### Option 2: VPS with Coolify (Production)

Deploy on a Hetzner or DigitalOcean VPS using Docker + Coolify:

```bash
# 1. Set up Coolify on your VPS
# 2. Connect your repo
# 3. Coolify auto-builds from docker-compose.yml
docker-compose up -d
```

**Recommended VPS specs:**
| Hosting | Plan | CPU | RAM | Cost |
|---------|------|-----|-----|------|
| **Hetzner** | CX22 | 2 vCPU | 4 GB | ~$10/mo |
| **Hetzner** | CX32 | 4 vCPU | 8 GB | ~$18/mo |
| **DigitalOcean** | Basic | 2 vCPU | 4 GB | ~$24/mo |

---

## 🧪 Validation & Testing

```bash
# Backend tests
cd backend && npm test

# Frontend build check
cd frontend && npm run build

# Admin build check
cd admin && npm run build

# Type check
cd backend && npx prisma validate
```

---

## 📋 API Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | — | Register (captcha + email verification) |
| `/api/auth/login` | POST | — | Login (captcha) |
| `/api/auth/verify-email` | POST | — | Verify email via Supabase session token |
| `/api/auth/resend-verification` | POST | Rate-limited | Resend verification email |
| `/api/auth/me` | GET | JWT | Get current user |
| `/api/courses` | GET | JWT | List all courses |
| `/api/courses/:id` | GET | JWT | Get course with lessons |
| `/api/lessons/:id` | GET | JWT | Get lesson with exercises |
| `/api/exercises/:id/submit` | POST | JWT | Submit exercise answer |
| `/api/ai/chat` | POST | JWT | AI conversation tutor |
| `/api/ai/speaking` | POST | JWT | Speaking evaluation |
| `/api/ai/writing` | POST | JWT | Writing evaluation |
| `/api/admin/*` | Various | Admin JWT | All admin CRUD endpoints |

---

## 🗺️ Roadmap

| Phase | Status |
|-------|--------|
| 0 — Project Scaffolding | ✅ Complete |
| 1 — Database & Authentication | ✅ Complete |
| 2 — Courses & Lessons Engine | ✅ Complete |
| 3 — Exercises & Quizzes Engine | ✅ Complete |
| 4 — Dashboard & User Profile | ✅ Complete |
| 5 — AI Engine Foundation | ✅ Complete |
| 6 — AI Features | ✅ Complete |
| 7 — Admin AI Training System | ✅ Complete |
| 8 — Deployment & DevOps | ✅ Complete |
| 9 — UI Polish & Components | ✅ Complete |
| 10 — Testing & Quality Assurance | ✅ Complete |
| 11 — Performance Optimization | 🔄 In Progress |
| 12 — Security Hardening | 🔄 In Progress |
| 13 — Analytics & Monitoring | 📅 Planned |
| 14 — API Documentation | 📅 Planned |
| 15 — Payment Integration | 📅 Planned |
| 16 — Mobile PWA Support | 📅 Planned |

---

## 📄 License

MIT — feel free to use, modify, and deploy.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for free-tier Auth + PostgreSQL
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile) for free bot protection
- [Google Gemini](https://deepmind.google/gemini), [Groq](https://groq.com), [OpenRouter](https://openrouter.ai), [SambaNova](https://sambanova.ai), [Cerebras](https://cerebras.ai) for AI API access
- [Render](https://render.com) for free-tier hosting
- [Talkpal.ai](https://talkpal.ai) and [Duolingo](https://duolingo.com) for UX inspiration
