# 🇩🇪 LEARNGERMAN — Chat Memory File

> **Purpose:** This file preserves session context so future Codebuff sessions can seamlessly continue where the last one left off.
> **Auto-update:** Update this file at the end of every session and before significant changes.

---

## 📋 Session Overview

| Field | Value |
|---|---|
| **Project** | LEARNGERMAN — AI-Powered German Learning App |
| **Last Session** | Session 2 — May 29, 2026 |
| **Previous Session** | Session 1 — May 29, 2026 (Created CHAT_MEMORY.md) |
| **Session 2 Focus** | Redesigned phases per architecture, created 11 comprehensive code generation prompts |
| **Project Root** | `/root/LEARNGERMAN/` (symlink → `/storage/emulated/0/LEARNGERMAN/`) |
| **Build Status** | 📄 **Prompt phase complete** — 11 prompts ready for code generation |

---

## 🏗️ Project Architecture

### Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Zustand + React Router v6
- **Admin Panel:** React 18 + Vite (separate app) + Recharts + react-quill
- **Backend:** Node.js + Express + Prisma ORM + PostgreSQL + JWT
- **AI Engine:** Google Gemini (primary) → Groq (real-time) → OpenRouter (fallback) → SambaNova/Cerebras

### AI Providers (All Free)
| Provider | Model | Daily Limit | Best For |
|---|---|---|---|
| Google AI Studio | Gemini 2.5 Flash | ~1,500 req/day | Lesson generation, content creation |
| Groq | Llama 3.3 70B | ~1,000 req/day | Real-time chat/conversation |
| OpenRouter | Multiple free models | ~200 req/day | Testing & fallback |
| SambaNova | DeepSeek R1 | Free tier | Grammar explanations |
| Cerebras | Llama 3.3 70B | ~1,700 req/day | Batch evaluation |

### Hosting Strategy
- **Dev (Free):** Render free tier + Supabase (PostgreSQL) + Cloudinary (media)
- **Production (~$10-25/mo):** Hetzner VPS (CX22) + Coolify + DeepSeek V4 API

---

## 📁 Complete Project Structure

```
/root/LEARNGERMAN/
├── frontend/                     📁 Empty — code generated in Phase 0
├── admin/                        📁 Empty — code generated in Phase 0
├── backend/                      📁 Empty — code generated in Phase 0
├── ai-engine/                    📁 Empty — code generated in Phase 5
│
├── PHASE 0 - Project Scaffolding/
│   └── CODE_GENERATION_PROMPT.md    ✅ Full scaffolding: 30+ files, Prisma schema, configs
├── PHASE 1 - Database & Authentication/
│   └── CODE_GENERATION_PROMPT.md    ✅ 18 Prisma models, JWT auth, login/register
├── PHASE 2 - Courses & Lessons Engine/
│   └── CODE_GENERATION_PROMPT.md    ✅ Course CRUD, lesson player, admin management
├── PHASE 3 - Exercises & Quizzes Engine/
│   └── CODE_GENERATION_PROMPT.md    ✅ 5 exercise types, quiz engine, timer, scoring
├── PHASE 4 - Dashboard & User Profile/
│   └── CODE_GENERATION_PROMPT.md    ✅ Student dashboard, charts, admin analytics
├── PHASE 5 - AI Engine Foundation/
│   └── CODE_GENERATION_PROMPT.md    ✅ Multi-provider router, prompt templates, evaluation
├── PHASE 6 - AI Features/
│   └── CODE_GENERATION_PROMPT.md    ✅ Chat, speaking, writing, reading, vocabulary
├── PHASE 7 - Admin AI Training System/
│   └── CODE_GENERATION_PROMPT.md    ✅ Prompt editor, few-shot training, preview
├── PHASE 8 - Deployment & DevOps/
│   └── CODE_GENERATION_PROMPT.md    ✅ Docker, Render, Coolify, CI/CD, seed data
├── PHASE 9 - UI Polish & Components/
│   └── CODE_GENERATION_PROMPT.md    ✅ Design system, animations, mobile, themes
├── PHASE 10 - Testing & Quality Assurance/
│   └── CODE_GENERATION_PROMPT.md    ✅ Unit/integration/E2E tests, security, a11y
│
├── MASTER_PROMPT.md              ✅ Orchestrator — tells next session how to execute phases
├── CHAT_MEMORY.md                ✅ This file
├── ARCHITECTURE.md               ✅ Original architecture document
├── GUIDE.html                    ✅ Build guide for non-coders
├── preview.html                  ✅ Interactive UI demo
├── render.yaml                   ✅ Render deployment config
├── docker-compose.yml            ✅ Docker orchestration
├── Dockerfile                    ✅ Multi-stage Docker build
├── nginx.conf                    ✅ Nginx config for serving frontend + admin + API proxy
├── .gitignore
├── .env.example
└── README.md
```

---

## 📋 Phase Prompt Details

### Phase 0: Project Scaffolding (~30 files)
**Creates:** Directory structure, package.json files, vite/tailwind/postcss configs, Express server with all middleware, Prisma schema with ALL 18 models, full route structure for frontend/admin/backend/ai-engine, root files (README, .gitignore, .env.example, render.yaml, Dockerfile, docker-compose.yml, nginx.conf)
**Key files:** backend/src/index.js, backend/src/prisma/schema.prisma, frontend/src/App.jsx, admin/src/App.jsx

### Phase 1: Database & Authentication (~15 files)
**Creates:** Full Prisma schema (User, Admin, Course, Lesson, Exercise, Quiz, Enrollment, UserProgress, QuizAttempt, ChatHistory, WritingSubmission, Flashcard, Media, AITrainingData, PromptTemplate, AIUsageLog, AdminLog, AppSetting, EmailTemplate), JWT auth controller, admin auth controller, Login/Register pages, auth hooks + stores, admin login

### Phase 2: Courses & Lessons Engine (~25 files)
**Creates:** Course CRUD API, lesson player API, admin course/lesson controllers, Courses page with grid + filters, Lesson view page with rich content, admin CoursesList/Create/Edit, LessonsList/Create/Edit, LessonEditor with section builder, useCourses hook

### Phase 3: Exercises & Quizzes Engine (~25 files)
**Creates:** Exercise API (5 types: fillBlank, multipleChoice, matching, dragDrop, writing), Quiz API with timer + auto-grading, Progress tracking API, admin Exercise/Quiz CRUD, Exercise page with type-specific renderers, Quiz page with timer + navigation, ExerciseBuilder, QuizBuilder

### Phase 4: Dashboard & User Profile (~20 files)
**Creates:** Dashboard stats API, enrollment API, admin analytics API, Dashboard page (stats, progress, charts, streak), Profile page (edit, password, stats), admin Dashboard, User/Course/Engagement analytics pages, ProgressChart/Charts components

### Phase 5: AI Engine Foundation (~25 files)
**Creates:** aiProviderRouter with 5 providers + fallback, promptBuilder, contextManager, Gemini/Groq/OpenRouter/SambaNova/Cerebras providers, providerManager, 8 prompt templates (lessonGeneration, quizGeneration, conversation, vocabulary, writingEval, speakingEval, readingEval, hearingEval), evaluation modules (grammarChecker, pronunciationScorer, writingGrader, comprehensionChecker), AI routes/controllers, aiRateLimiter, aiFallback middleware, LessonAIService, QuizAIService, ChatAIService

### Phase 6: AI Features (~25 files)
**Creates:** ChatAIService, SpeakingAIService, WritingAIService, ReadingAIService, VocabularyAIService, HearingAIService, AI Chat page (streaming, voice input, conversation history), Speaking Practice page (record, waveform, phoneme feedback), Writing Exercise page (prompt, timer, AI grading display), Reading Lesson page (passage, vocab highlights, comprehension), Vocabulary Drills page (flashcards, swipe, spaced repetition), VoiceRecorder, FeedbackCard, AITutorBadge components, useAIChat, useSpeechRecognition, useAIFeedback hooks

### Phase 7: Admin AI Training System (~20 files)
**Creates:** Training controller (templates CRUD, examples CRUD, preview generation, usage analytics), TrainingDashboard, PromptTemplates page with version history + diff, TrainingDataUploader with bulk upload, LessonGenerator tool, ExamGenerator tool, VocabularyManager, ModelConfig page, AIPreview component, aiTrainingAPI

### Phase 8: Deployment & DevOps (~10 files)
**Creates:** Updated Dockerfile (multi-stage), docker-compose.yml, nginx.conf, render.yaml, .github/workflows/deploy.yml, seed.js (admin user, sample courses/lessons/exercises, prompt templates), health check endpoint, aiCostTracker, deployment docs in README

### Phase 9: UI Polish & Components (~20 files)
**Creates:** Complete design system CSS (glass cards, gradient text, glow effects, btn-primary, input-field), AnimatedCard with IntersectionObserver, LoadingSpinner with skeletons, Modal with AnimatePresence, redesigned Home page (hero, features grid, level path, stats), ThemeToggle (dark/light), Toast notification system, page transition animations, mobile responsive layouts, framer-motion integration

### Phase 10: Testing & Quality Assurance (~30 files)
**Creates:** Jest config, test setup with in-memory DB, auth tests (10+), course/lesson/exercise/quiz tests, AI service tests (mock providers), middleware tests, frontend Vitest config, Auth/Component tests, store tests, admin tests, integration API flow tests, Cypress E2E tests, security checklist, performance optimization, accessibility audit

---

## 📊 Phase Dependency Graph

```
Phase 0 (Scaffolding)
    │
    ▼
Phase 1 (Auth) ──────────────────────┐
    │                                │
    ▼                                │
Phase 2 (Courses & Lessons)          │
    │                                │
    ▼                                │
Phase 3 (Exercises & Quizzes)        │
    │                                │
    ▼                                │
Phase 4 (Dashboard)                  │
    │                                │
    ▼                                ▼
Phase 5 (AI Engine) ────────►  Phase 7 (Admin AI Training)
    │
    ▼
Phase 6 (AI Features)
    │
    ▼
Phase 8 (Deployment)
    │
    ▼
Phase 9 (UI Polish)
    │
    ▼
Phase 10 (Testing)
```

---

## ⚙️ Technical Setup

### Symlink
```bash
ln -s '/storage/emulated/0/LEARNGERMAN' /root/LEARNGERMAN
```

### Working with This Project
- All file paths should start with `/root/LEARNGERMAN/`
- The basher tool (terminal) can use full paths directly
- All write/create tools work via the symlink

---

## 📝 Instructions for Next Session

**To continue building, the next session should:**

1. Read this CHAT_MEMORY.md for full context
2. Read MASTER_PROMPT.md for the execution plan
3. Start with **Phase 0** prompt for project scaffolding
4. Follow the phase dependency graph above
5. After completing each phase, update CHAT_MEMORY.md

**Quick start command for next session:**
> "Read CHAT_MEMORY.md and MASTER_PROMPT.md from LEARNGERMAN, then start building Phase 0"

---

## 🔑 Key Files Quick Reference

| File | Description |
|---|---|
| `MASTER_PROMPT.md` | Orchestrator — phase order, dependencies, how to execute |
| `PHASE 0-10/*.md` | Detailed code generation prompts for each phase |
| `ARCHITECTURE.md` | 38KB complete architecture plan |
| `GUIDE.html` | Build guide for non-coders |
| `preview.html` | Interactive UI demo with all pages |
| `render.yaml` | Render deployment blueprint |
| `docker-compose.yml` | Docker orchestration for production |
| `Dockerfile` | Multi-stage Docker build |

---

## 🏆 Session 3 — Competitive Analysis (May 29, 2026)

**Focus:** Analyzed Talkpal.ai as primary competitor — deep research of product, pricing, user reviews, and strategic positioning.

### Work Completed
- Researched Talkpal.ai comprehensively (web scraping, user reviews on Reddit/Trustpilot, feature analysis)
- Added **full Competitive Analysis section** to `ARCHITECTURE.md` — including Talkpal's 8 weaknesses, pricing comparison, feature matrix, strategic positioning, and 5 actionable moves
- Created `COMPETITIVE_LANDSCAPE.md` — dedicated document with feature comparison, user sentiment quotes, market positioning matrix, and competitive advantages
- Updated `MASTER_PROMPT.md` with competitive positioning reference

### Key Insight
> **LEARNGERMAN = Duolingo + Custom AI Teacher** (structured, deep, teachable, German-focused)
> **Talkpal = ChatGPT for language learning** (broad, shallow, conversational)

### Files Created/Updated
| File | Action |
|---|---|
| `ARCHITECTURE.md` | ✅ Updated — added Competitive Analysis section before Database Schema |
| `COMPETITIVE_LANDSCAPE.md` | ✅ Created — dedicated competitive intelligence document |
| `MASTER_PROMPT.md` | ✅ Updated — added positioning line in Key Principles |
| `CHAT_MEMORY.md` | ✅ Updated — this entry |

---

## 🎨 Session 4 — Landing Page Design Direction (May 29, 2026)

**Focus:** Established Talkpal.ai-inspired landing page as the visual design direction for LEARNGERMAN.

### Work Completed
- Researched Talkpal.ai landing page design: hero, features, testimonials, stats, FAQ, footer layout
- Created `DESIGN_REFERENCE.md` — full design spec with color palette, typography, spacing, section-by-section layout, component specs, animations, responsive breakpoints
- Updated **Phase 0 prompt** — Home.jsx now includes Talkpal-inspired landing page structure (hero with mockup, stats bar, feature cards, footer)
- Updated **Phase 9 prompt** — Home Page Redesign section expanded to full 9-section Talkpal-inspired layout with detailed specs for each section
- Updated `ARCHITECTURE.md` — added design reference note to the competitive analysis section

### Design Direction Summary
> **Talkpal** = Clean, card-based, high-contrast, dark-themed SaaS aesthetic with glass-morphism
> **LEARNGERMAN** = Same refined aesthetic + German flag colors (#DD0000, #FFCC00) as accents, purple primary (#6c5ce7)

### Files Created/Updated
| File | Action |
|---|---|
| `DESIGN_REFERENCE.md` | ✅ Created — complete design system with 9 landing page sections |
| `PHASE 0/CODE_GENERATION_PROMPT.md` | ✅ Updated — Home.jsx now follows Talkpal structure |
| `PHASE 9/CODE_GENERATION_PROMPT.md` | ✅ Updated — full Talkpal-inspired landing page spec (9 sections) |
| `CHAT_MEMORY.md` | ✅ Updated — this entry |

---

## 🖼️ Session 5 — Visual Previews & Feature Expansion (May 30, 2026)

**Focus:** Created `preview-2.html` with complete visual mockups of all student website pages (14) and admin panel pages (12), fixed all validation errors, expanded admin features, updated prompt files.

### Work Completed

#### 🎨 Visual Preview (`preview-2.html`)
- **14 Student pages:** Home, Login/Register, Dashboard, Courses, Lesson, Exercise/Quiz, AI Chat, Speaking Practice, Reading Comprehension, Writing Practice, Vocabulary Flashcards, Profile Settings, **Hearing Practice**, **Grammar Practice**
- **12 Admin pages:** Dashboard, Courses, Lessons, Users, Media, Analytics, Settings, AI Training, Admin Mgmt, **HTML Content Editor**, **Auto-Update System**, **Main Website Page Editor**
- Tab switcher between Student/Admin views, dark theme with purple accents, glass-morphism cards, fully responsive
- Fixed **306 inline styles** → CSS utility classes (`is-0` to `is-150`), 118 duplicate class attributes, 4 malformed `<tbody>`, 17 bare `&`, 4 missing button `type` — **0 html-validate errors**

#### 🆕 New Admin Features Added
1. **HTML Content Editor** (WordPress-style WYSIWYG) — toolbar (B/I/U, H1/H2, lists, links, images), Visual/HTML/Preview mode tabs, publish flow
2. **Auto-Update System** — version upload panel, version info, deploy button, version history with rollback, migration status with zero-downtime guarantee
3. **Main Website Page Editor** — page tree sidebar (7 pages with status dots), section-based canvas (Hero, Text+Image, Features Grid, CTA blocks with ↑↓✏️🗑️), SEO settings panel

#### 🆕 New Student Features Added
4. **Hearing Practice (Listening Comprehension)** — audio player with play/progress/time/speed controls, transcript with reveal toggle, comprehension Q&A
5. **Grammar Practice** — rule cards (Nominativ/Akkusativ), fill-in-the-blank article exercises with correct/incorrect feedback

#### 📝 Prompt File Updates
| File | Changes |
|---|---|
| `PHASE 0/CODE_GENERATION_PROMPT.md` | Added `website-editor/` and `updates/` admin directories (6 pages), `WYSIWYGEditor.jsx`/`VersionUploader.jsx` components, `website.js`/`updates.js` routes + controllers + API files + hooks, added `/hearing` and `/grammar-practice` routes, added `HearingPractice.jsx`/`GrammarPractice.jsx` pages, `useHearing.js`/`useGrammarPractice.js` hooks |
| `PHASE 2/CODE_GENERATION_PROMPT.md` | Enhanced `LessonEditor.jsx` with WYSIWYG detail, added §13b with full WYSIWYGEditor component spec (toolbar, modes, publish flow, German char support) |
| `PHASE 3/CODE_GENERATION_PROMPT.md` | Added 3 exercise types (`grammarFillBlank`, `grammarConjugation`, `articleSelection`) + `grammarRule` quiz question type |
| `PHASE 6/CODE_GENERATION_PROMPT.md` | Added §8 Hearing Practice Page (audio player, TTS, transcript, comprehension), §9 Grammar Practice Page (rule cards, 5 exercise types, conjugation tables, reference sidebar), Grammar AI Service (`GrammarAIService.js`), hearing/grammar routes, `useHearing.js`/`useGrammarPractice.js` hooks, renumbered all sections sequentially |
| `PHASE 8/CODE_GENERATION_PROMPT.md` | Added §8 Auto-Update System — `updateController.js`, `updateManager.js` (blue-green engine), `AppVersion` Prisma model, admin UI pages, `VersionUploader.jsx`, zero-downtime strategy (7-step blue-green), data safety guarantee. Renamed old §8 → §9 |
| `PHASE 9/CODE_GENERATION_PROMPT.md` | Added Main Website Page Editor — `WebsitePagesList.jsx` (page tree), `WebsitePageEditor.jsx` (sidebar + section canvas + SEO panel), `SectionBuilder.jsx`, backend `websiteController.js` + `WebsitePage` model |

### Key Insight
> **preview-2.html** serves as the living design reference — a visual catalog of every page that should be built. All validation scripts cleaned up. File passes `html-validate` with **0 errors**.

### Files Created/Updated
| File | Action |
|---|---|
| `preview-2.html` | ✅ Created & iterated — complete visual preview with all student + admin pages |
| `PHASE 0/CODE_GENERATION_PROMPT.md` | ✅ Updated — directory tree, routes, components, hooks for new features |
| `PHASE 2/CODE_GENERATION_PROMPT.md` | ✅ Updated — WYSIWYG Editor component and API |
| `PHASE 3/CODE_GENERATION_PROMPT.md` | ✅ Updated — grammar exercise/quiz types |
| `PHASE 6/CODE_GENERATION_PROMPT.md` | ✅ Updated — Hearing + Grammar pages, services, routes, hooks |
| `PHASE 8/CODE_GENERATION_PROMPT.md` | ✅ Updated — Auto-Update System section |
| `PHASE 9/CODE_GENERATION_PROMPT.md` | ✅ Updated — Main Website Page Editor section |
| `CHAT_MEMORY.md` | ✅ Updated — this entry |

## 📧 Session 6 — Email Verification & Confirm Password (May 30, 2026)

**Focus:** Added Supabase Auth email verification flow + confirm password field to registration system.

### Work Completed
- **Updated Phase 1 prompt** — Full Supabase Auth integration:
  - Added `emailVerified` and `supabaseUid` fields to User Prisma model
  - Rewrote `authController.js` — registration now uses `supabase.auth.signUp()` for automatic email verification
  - Added `verifyEmail` controller — handles OTP verification via Supabase
  - Added `resendVerification` controller — resends verification email via Supabase
  - Added **confirm password validation** on backend (400 if mismatch)
  - Added **password strength validation** (min 8 chars, 1 uppercase, 1 number)
  - Updated `login` controller — returns 403 with `needsVerification: true` if not yet verified
  - Added `VerifyEmail.jsx` page — post-registration screen with resend button, countdown, and redirect handler
  - Updated `Register.jsx` — password show/hide toggle, strength indicator, confirm password with real-time match validation
  - Added email verification check in auth middleware (403 if unverified, exception for verify/resend routes)
  - Added `supabaseClient.js` utility + `@supabase/supabase-js` dependency
  - Added Supabase setup checklist in Validation section
  - Updated validation tests (confirm password mismatch, weak password, unverified login, resend, verified login)

### Files Updated
| File | Action |
|---|---|
| `PHASE 1/CODE_GENERATION_PROMPT.md` | ✅ Updated — Supabase Auth, email verification, confirm password, password strength |
| `CHAT_MEMORY.md` | ✅ Updated — this entry |

*Last updated: May 30, 2026 — End of Session 6 (Email Verification & Confirm Password)*
