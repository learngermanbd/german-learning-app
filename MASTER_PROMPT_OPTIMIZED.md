# LearnGerman — Master Code Generation Orchestrator (Optimized)

> **Purpose:** Orchestrator prompt for building the LEARNGERMAN AI-Powered German Learning Platform. Tells the AI what to build, in what order, prerequisites, validation steps, and troubleshooting guides.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Phase Execution Order](#phase-execution-order)
3. [Phase Dependency Matrix](#phase-dependency-matrix)
4. [How to Execute Each Phase](#how-to-execute-each-phase)
5. [Session Handoff Protocol](#session-handoff-protocol)
6. [Project Structure](#project-structure)
7. [Competitive Positioning](#competitive-positioning)
8. [Key Architecture Decisions](#key-architecture-decisions)
9. [Tech Stack Reference](#tech-stack-reference)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Decision Log](#decision-log)

---

## Quick Start

```bash
# 1. Read the memory file for project context
cat /root/LEARNGERMAN/CHAT_MEMORY.md

# 2. Read this orchestrator for execution plan
cat /root/LEARNGERMAN/MASTER_PROMPT.md

# 3. Pick a phase prompt and start building
cat "/root/LEARNGERMAN/PHASE 0 - Project Scaffolding/CODE_GENERATION_PROMPT.md"

# 4. After completing a phase, update memory
# Edit CHAT_MEMORY.md with completion status
```

---

## Phase Execution Order

Build the project by executing phases **in order**. Each phase depends on the previous one.

| Phase | Name | Description | Est. Files | Est. Time | Priority |
|-------|------|-------------|-----------|-----------|----------|
| **0** | Project Scaffolding | Directory structure, configs, Prisma schema, Express server, Vite setup | ~30 | 2-3h | Core |
| **1** | Database & Authentication | All Prisma models, JWT auth, login/register, admin auth | ~15 | 3-4h | Core |
| **2** | Courses & Lessons Engine | Course CRUD, lesson player, admin management, lesson editor | ~25 | 4-5h | Core |
| **3** | Exercises & Quizzes Engine | 5 exercise types, quiz engine with timer, scoring, progress | ~25 | 4-5h | Core |
| **4** | Dashboard & User Profile | Student dashboard, progress charts, admin analytics | ~20 | 3-4h | Core |
| **5** | AI Engine Foundation | Multi-provider router, prompt templates, evaluation modules | ~25 | 5-6h | Core |
| **6** | AI Features | Chat tutor, speaking, writing, reading, vocabulary, voice | ~25 | 5-6h | Core |
| **7** | Admin AI Training System | Prompt editor, few-shot uploader, preview system, usage analytics | ~20 | 4-5h | Core |
| **8** | Deployment & DevOps | Docker, Render config, Coolify setup, CI/CD, seed data | ~10 | 2-3h | Core |
| **9** | UI Polish & Components | Design system, animations, mobile responsive, theme toggle | ~20 | 4-5h | Core |
| **10** | Testing & QA | Unit tests, integration tests, security audit, a11y | ~30 | 5-6h | Core |
| **11** | Performance Optimization | Code splitting, lazy loading, caching, bundle optimization | ~15 | 3-4h | High |
| **12** | Security Hardening | Rate limiting, input validation, CORS, helmet, XSS prevention | ~12 | 3-4h | High |
| **13** | Analytics & Monitoring | User tracking, Sentry, health checks, usage dashboard | ~10 | 2-3h | High |
| **14** | API Documentation | OpenAPI/Swagger, interactive explorer, SDK generation | ~8 | 2-3h | Medium |
| **15** | Payment Integration | Stripe, subscriptions, premium tiers, invoicing | ~12 | 3-4h | Optional |
| **16** | Mobile PWA Support | PWA manifest, service worker, offline support, push notifications | ~10 | 3-4h | Optional |

**Total: ~320+ source files across 4 codebases | ~55-70 hours estimated**

---

## Phase Dependency Matrix

```
Phase 0 (Scaffolding)
    |
    v
Phase 1 (Auth) -----------------------------------------+
    |                                                   |
    v                                                   |
Phase 2 (Courses & Lessons)                             |
    |                                                   |
    v                                                   |
Phase 3 (Exercises & Quizzes)                           |
    |                                                   |
    v                                                   |
Phase 4 (Dashboard)                                     |
    |                                                   |
    v                                                   v
Phase 5 (AI Engine) --------------------------> Phase 7 (Admin AI Training)
    |
    v
Phase 6 (AI Features)
    |
    +------> Phase 11 (Performance) ---+--- Phase 12 (Security)
    |                                  |
    v                                  v
Phase 8 (Deployment) --------> Phase 13 (Analytics)
    |
    v
Phase 9 (UI Polish)
    |
    v
Phase 10 (Testing) ---------> Phase 14 (API Docs)
    |
    +------> Phase 15 (Payments) [Optional]
    |
    +------> Phase 16 (PWA) [Optional]
```

**Critical Path:** 0 → 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10
**Parallelizable:** 11, 12, 13 can run after Phase 6
**Optional:** 15, 16 can be added anytime after Phase 10

---

## How to Execute Each Phase

### Pre-Flight Checklist (Before Every Phase)

- [ ] Read `CHAT_MEMORY.md` for current project status
- [ ] Verify previous phase files exist and are complete
- [ ] Check no conflicting changes are in progress
- [ ] Read the phase's `CODE_GENERATION_PROMPT.md` fully
- [ ] Note the prerequisites section — install any missing dependencies

### Execution Steps

1. **Read the phase prompt** from `PHASE X - Name/CODE_GENERATION_PROMPT.md`
2. **Check prerequisites** — ensure previous phase files exist
3. **Create all listed files** following the specifications exactly
4. **Install dependencies** as needed (`npm install --prefix backend`, etc.)
5. **Run validations** listed at the bottom of each phase prompt
6. **Update CHAT_MEMORY.md** with completion status

### Post-Phase Validation (After Every Phase)

```bash
# Backend validation
cd backend && npm run lint          # Check for lint errors
cd backend && npx prisma generate   # Verify Prisma schema compiles
cd backend && node -e "require('./src/index.js')"  # Server starts without crash

# Frontend validation
cd frontend && npm run lint         # Check for lint errors
cd frontend && npm run build        # Build succeeds

# Admin validation
cd admin && npm run lint
cd admin && npm run build

# Cross-check
ls -la backend/src/routes/          # Verify routes exist
ls -la frontend/src/pages/          # Verify pages exist
```

### Quality Checkpoints

After each phase, verify:

- [ ] All files from the phase prompt exist
- [ ] No TypeScript/ESLint errors
- [ ] Backend server starts without crashes
- [ ] Frontend builds without errors
- [ ] Database migrations run successfully (if applicable)
- [ ] Basic manual test: can navigate to new pages

---

## Session Handoff Protocol

When ending a session or handing off to a new session:

### 1. Update CHAT_MEMORY.md

```markdown
## Session N — [Date]
**Focus:** [What was worked on]
**Completed:** [List of files/features completed]
**In Progress:** [Any partially completed work]
**Next Steps:** [What to do next]
**Blockers:** [Any issues encountered]
```

### 2. Commit Changes

```bash
git add -A
git commit -m "Phase X: [description] — [N] files created/updated"
```

### 3. Quick Resume Command for Next Session

```
"Read CHAT_MEMORY.md from LEARNGERMAN, check what phase we're on, and continue from there."
```

---

## Project Structure (After All Phases)

```
LEARNGERMAN/
├── frontend/                    # React + Vite + Tailwind (Student app, port 5173)
│   └── src/
│       ├── pages/               # Route pages (Home, Dashboard, Courses, AI features)
│       ├── components/          # Reusable UI components
│       ├── hooks/               # Custom React hooks
│       ├── store/               # Zustand state management
│       └── utils/               # API client, helpers
│
├── admin/                       # React + Vite + Tailwind (Admin panel, port 5174)
│   └── src/
│       ├── pages/               # Admin pages (Dashboard, Content, Users, AI Training)
│       ├── components/          # Admin-specific components
│       ├── hooks/               # Admin hooks
│       ├── store/               # Admin state
│       └── api/                 # Admin API functions
│
├── backend/                     # Express + Prisma (API server, port 5000)
│   └── src/
│       ├── routes/              # Express routes (auth, courses, AI, admin)
│       ├── controllers/         # Route handlers
│       ├── services/            # Business logic (AI services, etc.)
│       ├── middleware/          # Auth, validation, error handling
│       ├── prisma/              # Schema and migrations
│       └── utils/               # Helpers (tokens, uploads, validation)
│
├── ai-engine/                   # Standalone AI engine (providers, templates, evaluation)
│   ├── providers/               # Gemini, Groq, OpenRouter, SambaNova, Cerebras
│   ├── training/                # Prompt templates, few-shot examples
│   └── evaluation/              # Grammar checker, pronunciation scorer, writing grader
│
├── PHASE 0-16/                  # Code generation prompts (these files)
├── MASTER_PROMPT.md             # Original orchestrator
├── MASTER_PROMPT_OPTIMIZED.md   # This file (enhanced orchestrator)
├── CHAT_MEMORY.md               # Session memory (auto-updated)
├── ARCHITECTURE.md              # Full architecture documentation
├── COMPETITIVE_LANDSCAPE.md     # Competitive analysis
├── DESIGN_REFERENCE.md          # Design system and UI specs
├── render.yaml                  # Render deployment config
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # Multi-stage build
├── nginx.conf                   # Nginx config
├── .gitignore
├── .env.example
└── README.md
```

---

## Competitive Positioning

**Primary competitor: Talkpal.ai** (5M+ users, 4.7/5 rating, 130 languages, pure conversational AI).

**LEARNGERMAN's position:** "Duolingo + Custom AI Teacher" — structured CEFR courses + exercises + quizzes, powered by customizable AI that teachers can train.

### Key Differentiators

| Feature | Talkpal | LEARNGERMAN | Advantage |
|---------|---------|-------------|-----------|
| Structured CEFR Courses | None | A1-C1 with lessons, exercises, quizzes | LEARNGERMAN |
| Admin Training System | No teacher tools | Prompt editor, few-shot upload, preview | LEARNGERMAN |
| German-Only Depth | 130 languages (shallow) | Deep grammar (cases, gender, word order) | LEARNGERMAN |
| Free Tier | 10 min/day | Full courses + limited AI (provider stacking) | LEARNGERMAN |
| AI Grammar Accuracy | Hallucinations reported | SambaNova DeepSeek R1 for reasoning | LEARNGERMAN |
| Progress Tracking | Basic streak | Per-skill mastery, XP, charts | LEARNGERMAN |
| B2B Revenue | Consumer only | Admin panel for schools ($50-200/mo) | LEARNGERMAN |

### Competitive Advantage Verification (Check After Each Phase)

- [ ] **Phase 1-4:** Does our DB schema support structured CEFR courses that Talkpal lacks?
- [ ] **Phase 5-6:** Is our AI routing smarter than Talkpal's single-provider approach?
- [ ] **Phase 7:** Can teachers customize AI behavior in ways Talkpal doesn't offer?
- [ ] **Phase 9:** Is our UI cleaner and more professional than Talkpal?
- [ ] **Phase 11-12:** Are we faster and more secure than competitors?
- [ ] **Phase 13:** Do we have better analytics than Talkpal's basic streak?

---

## Key Architecture Decisions (Don't Change)

1. **4 separate apps** under one repo: frontend, admin, backend, ai-engine
2. **Dark theme by default** with purple (#6c5ce7) as primary color
3. **JWT auth** with separate middleware for students and admins
4. **Prisma ORM** with PostgreSQL (Supabase dev, self-hosted prod)
5. **AI providers** via smart router with automatic fallback
6. **Admin Training** uses prompt engineering + few-shot (no fine-tuning)
7. **Containerized** from day 1 (Docker multi-stage build)
8. **Free tier first** — all dependencies have free tiers
9. **Structured learning first, AI second** — courses & exercises are core, AI chat is enhancement
10. **Talkpal-inspired landing page** — see DESIGN_REFERENCE.md for full design specs

---

## Tech Stack Reference

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React + Vite | 18.x / 5.x | SPA framework |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State | Zustand | 4.x | Lightweight state management |
| Routing | React Router | 6.x | Client-side routing |
| Backend | Node.js + Express | 20.x / 4.x | API server |
| Database | PostgreSQL + Prisma | 16.x / 5.x | Data persistence |
| Auth | JWT (jsonwebtoken) | 9.x | Authentication |
| AI Primary | Google Gemini | Latest | Content generation (1,500 req/day free) |
| AI Real-time | Groq (Llama 3.3) | Latest | Chat/conversation (1,000 req/day free) |
| AI Grammar | SambaNova (DeepSeek R1) | Latest | Grammar/reasoning tasks |
| AI Fallback | OpenRouter | Latest | Testing & fallback (200 req/day free) |
| AI Batch | Cerebras (Llama 3.3) | Latest | Answer evaluation (1,700 req/day free) |
| Charts | Recharts | 2.x | Progress visualization |
| Icons | react-icons | 5.x | Icon library |
| Deployment | Docker + Coolify/Render | Latest | Container orchestration |
| Monitoring | Sentry | Latest | Error tracking (optional, Phase 13) |
| Payments | Stripe | Latest | Subscriptions (optional, Phase 15) |

---

## Troubleshooting Guide

### Common Issues by Phase

#### Phase 0-1: Setup Issues

| Problem | Solution |
|---------|----------|
| `prisma generate` fails | Run `npm install --prefix backend` first, then `npx prisma generate` |
| Port 5000 already in use | Change PORT in .env or kill the process using it |
| Vite build fails | Check Node.js version (need 18+), run `npm install` again |

#### Phase 2-4: CRUD Issues

| Problem | Solution |
|---------|----------|
| 404 on API routes | Check route files are imported in `routes/index.js` |
| Prisma relation errors | Verify schema has correct `@relation` fields |
| CORS errors | Ensure backend CORS middleware allows frontend URL |

#### Phase 5-6: AI Engine Issues

| Problem | Solution |
|---------|----------|
| AI API errors | Check API keys in .env, verify quotas |
| AI responses empty | Check prompt templates, verify provider is available |
| Rate limit errors | Implement exponential backoff, check provider quotas |

#### Phase 7: Admin Training Issues

| Problem | Solution |
|---------|----------|
| Templates not saving | Check PromptTemplate model, verify admin permissions |
| Preview not working | Ensure AI provider is configured and has quota |

#### Phase 8: Deployment Issues

| Problem | Solution |
|---------|----------|
| Render deploy fails | Check build logs, verify buildCommand in render.yaml |
| Docker build fails | Check Dockerfile paths, verify .dockerignore |
| Cold start delays | Expected on free tier, upgrade to paid or use VPS |

#### Phase 9: UI Issues

| Problem | Solution |
|---------|----------|
| Tailwind classes not working | Check tailwind.config.js content paths |
| Animations janky | Use `will-change` property, reduce DOM complexity |
| Mobile layout broken | Check responsive breakpoints, test at 375px width |

#### Phase 10: Test Issues

| Problem | Solution |
|---------|----------|
| Tests fail with DB errors | Use in-memory SQLite for tests, not production DB |
| Mock AI not working | Verify mock is set up before test runs |
| Coverage below threshold | Add more test cases for uncovered branches |

#### Phase 11: Performance Issues

| Problem | Solution |
|---------|----------|
| Bundle too large | Check bundle analyzer, split large imports |
| Slow initial load | Implement code splitting, lazy load routes |
| Images slow | Use WebP format, implement lazy loading |

#### Phase 12: Security Issues

| Problem | Solution |
|---------|----------|
| Rate limiting too aggressive | Adjust limits in rate limiter config |
| CORS blocking requests | Add frontend URL to CORS whitelist |
| Helmet blocking resources | Configure CSP directives properly |

### Getting Unstuck

1. **Read the error message** — most issues have clear error messages
2. **Check CHAT_MEMORY.md** — see if a previous session noted the issue
3. **Read the phase prompt** — verify you created all required files
4. **Check prerequisites** — ensure previous phases are complete
5. **Search the codebase** — grep for the error or related code
6. **Ask the AI** — describe the error and paste the relevant code

---

## Decision Log

Record significant architecture decisions here:

| Date | Decision | Reason | Alternatives Considered |
|------|----------|--------|------------------------|
| 2026-05-29 | 4 separate apps in one repo | Better organization, shared types, single deployment | Monolith, separate repos |
| 2026-05-29 | Prisma over Drizzle | Better DX, excellent migrations, strong typing | Drizzle ORM, raw SQL |
| 2026-05-29 | Multi-provider AI routing | Free tier stacking, fallback resilience | Single provider (Gemini) |
| 2026-05-29 | Dark theme default | Modern SaaS aesthetic, reduces eye strain | Light theme default |
| 2026-05-29 | Prompt engineering over fine-tuning | Free, instant updates, admin-controllable | Fine-tuning (expensive, slow) |

---

## Important Notes

- **All source code goes in:** frontend/, admin/, backend/, ai-engine/
- **Phase prompts stay in:** PHASE X - Name/CODE_GENERATION_PROMPT.md
- **Update CHAT_MEMORY.md** after completing each phase
- **Don't skip validation steps** — run the commands listed in each phase
- **If a file already exists**, review it before overwriting
- **Follow existing conventions** — match the style of neighboring files
- **Use proper error handling** — all API routes should have try/catch
- **No `any` types** — use proper validation and error handling
- **Commit after each phase** with descriptive commit messages

---

*Last updated: Session 5 — Optimized orchestrator with 16 phases*
