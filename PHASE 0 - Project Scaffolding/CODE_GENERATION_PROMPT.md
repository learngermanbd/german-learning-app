# PHASE 0 — Project Scaffolding & Architecture Foundation

## Objective
Set up the complete project directory structure, all configuration files, and foundational code for the German Learning App. This phase creates the skeleton that all subsequent phases will build upon.

## Directory Structure to Create

```
german-learning-app/
├── frontend/                          # Student-facing React app
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Auth/
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AITutorBadge.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── FeedbackCard.jsx
│   │   │   └── ProgressChart.jsx
│   │   ├── pages/
│   │   │   ├── HearingPractice.jsx
│   │   │   └── GrammarPractice.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCourses.js
│   │   │   ├── useProgress.js
│   │   │   ├── useAIChat.js
│   │   │   ├── useSpeechRecognition.js
│   │   │   ├── useAIFeedback.js
│   │   │   ├── useHearing.js
│   │   │   └── useGrammarPractice.js
│   │   ├── store/
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── admin/                             # Admin Panel (separate React app)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── courses/
│   │   │   │   ├── CoursesList.jsx
│   │   │   │   ├── CreateCourse.jsx
│   │   │   │   └── EditCourse.jsx
│   │   │   ├── lessons/
│   │   │   │   ├── LessonsList.jsx
│   │   │   │   ├── CreateLesson.jsx
│   │   │   │   ├── EditLesson.jsx
│   │   │   │   └── LessonEditor.jsx
│   │   │   ├── exercises/
│   │   │   │   ├── ExercisesList.jsx
│   │   │   │   ├── CreateExercise.jsx
│   │   │   │   └── ExerciseBuilder.jsx
│   │   │   ├── quizzes/
│   │   │   │   ├── QuizzesList.jsx
│   │   │   │   ├── CreateQuiz.jsx
│   │   │   │   └── QuizBuilder.jsx
│   │   │   ├── users/
│   │   │   │   ├── UsersList.jsx
│   │   │   │   ├── UserDetails.jsx
│   │   │   │   └── AdminsList.jsx
│   │   │   ├── media/
│   │   │   │   ├── MediaLibrary.jsx
│   │   │   │   └── UploadMedia.jsx
│   │   │   ├── analytics/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── UserAnalytics.jsx
│   │   │   │   ├── CourseAnalytics.jsx
│   │   │   │   └── EngagementReport.jsx
│   │   │   ├── settings/
│   │   │   │   ├── GeneralSettings.jsx
│   │   │   │   ├── EmailTemplates.jsx
│   │   │   │   └── NotificationSettings.jsx
│   │   │   ├── adminManagement/
│   │   │   │   ├── AdminsList.jsx
│   │   │   │   ├── CreateAdmin.jsx
│   │   │   │   ├── PermissionsList.jsx
│   │   │   │   └── AdminLogs.jsx
│   │   │   ├── ai-training/
│   │   │   │   ├── TrainingDashboard.jsx
│   │   │   │   ├── PromptTemplates.jsx
│   │   │   │   ├── LessonGenerator.jsx
│   │   │   │   ├── ExamGenerator.jsx
│   │   │   │   ├── VocabularyManager.jsx
│   │   │   │   ├── ModelConfig.jsx
│   │   │   │   └── TrainingDataUploader.jsx
│   │   │   ├── website-editor/
│   │   │   │   ├── WebsitePagesList.jsx
│   │   │   │   ├── WebsitePageEditor.jsx
│   │   │   │   └── SectionBuilder.jsx
│   │   │   └── updates/
│   │   │       ├── UpdateManager.jsx
│   │   │       ├── UploadVersion.jsx
│   │   │       └── VersionHistory.jsx

│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── RichEditor.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── AIPreview.jsx
│   │   │   ├── WYSIWYGEditor.jsx
│   │   │   └── VersionUploader.jsx
│   │   ├── hooks/
│   │   │   ├── useAdminAuth.js
│   │   │   ├── useCourseAdmin.js
│   │   │   ├── useUserAdmin.js
│   │   │   ├── useMediaAdmin.js
│   │   │   ├── useAITraining.js
│   │   │   ├── useWebsiteEditor.js
│   │   │   └── useUpdateAdmin.js
│   │   ├── store/
│   │   │   ├── adminAuthStore.js
│   │   │   ├── adminUIStore.js
│   │   │   └── adminDataStore.js
│   │   ├── api/
│   │   │   ├── adminAPI.js
│   │   │   ├── courseAdminAPI.js
│   │   │   ├── userAdminAPI.js
│   │   │   ├── mediaAdminAPI.js
│   │   │   ├── analyticsAPI.js
│   │   │   ├── aiTrainingAPI.js
│   │   │   ├── websiteAdminAPI.js
│   │   │   └── updateAdminAPI.js
│   │   ├── utils/
│   │   │   ├── adminConfig.js
│   │   │   ├── permissions.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── backend/                           # Express API server
│   └── src/
│       ├── routes/
│       │   ├── auth.js
│       │   ├── courses.js
│       │   ├── lessons.js
│       │   ├── exercises.js
│       │   ├── quizzes.js
│       │   ├── progress.js
│       │   ├── flashcards.js
│       │   ├── ai/
│       │   │   ├── index.js        (aggregates AI routes)
│       │   │   ├── generate.js
│       │   │   ├── evaluate.js
│       │   │   ├── chat.js
│       │   │   ├── speaking.js
│       │   │   ├── writing.js
│       │   │   └── vocabulary.js
│       │   └── admin/
│       │       ├── index.js        (aggregates admin routes)
│       │       ├── auth.js
│       │       ├── courses.js
│       │       ├── lessons.js
│       │       ├── exercises.js
│       │       ├── quizzes.js
│       │       ├── users.js
│       │       ├── media.js
│       │       ├── analytics.js
│       │       ├── settings.js
│       │       ├── adminManagement.js
│       │       ├── emailTemplates.js
│       │       ├── backups.js
│       │       ├── logs.js
│       │       ├── ai-training.js
│       │       ├── website.js
│       │       └── updates.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── courseController.js
│       │   ├── ai/
│       │   │   ├── aiController.js
│       │   │   ├── aiProvider.js
│       │   │   ├── promptEngine.js
│       │   │   ├── trainingEngine.js
│       │   │   └── evaluationEngine.js
│       │   └── admin/
│       │       ├── adminAuthController.js
│       │       ├── courseAdminController.js
│       │       ├── lessonAdminController.js
│       │       ├── userAdminController.js
│       │       ├── mediaController.js
│       │       ├── analyticsController.js
│       │       ├── trainingController.js
│       │       ├── websiteController.js
│       │       └── updateController.js
│       ├── services/
│       │   ├── aiProviderRouter.js
│       │   ├── promptBuilder.js
│       │   ├── contextManager.js
│       │   └── ai/
│       │       ├── LessonAIService.js
│       │       ├── QuizAIService.js
│       │       ├── ChatAIService.js
│       │       ├── SpeakingAIService.js
│       │       ├── ReadingAIService.js
│       │       ├── WritingAIService.js
│       │       ├── HearingAIService.js
│       │       └── VocabularyAIService.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── adminAuth.js
│       │   ├── checkPermission.js
│       │   ├── adminLog.js
│       │   ├── errorHandler.js
│       │   ├── aiRateLimiter.js
│       │   └── aiFallback.js
│       ├── prisma/
│       │   └── schema.prisma
│       ├── utils/
│       │   ├── generateToken.js
│       │   ├── uploadFile.js
│       │   ├── validation.js
│       │   ├── emailSender.js
│       │   ├── aiCostTracker.js
│       │   └── textToSpeech.js
│       └── index.js
│   ├── package.json
│   ├── .env.example
│   └── uploads/
│
├── ai-engine/                         # Standalone AI Engine
│   ├── index.js
│   ├── providers/
│   │   ├── geminiProvider.js
│   │   ├── groqProvider.js
│   │   ├── openRouterProvider.js
│   │   └── providerManager.js
│   ├── training/
│   │   ├── promptTemplates/
│   │   │   ├── lessonGeneration.json
│   │   │   ├── quizGeneration.json
│   │   │   ├── conversation.json
│   │   │   ├── vocabulary.json
│   │   │   ├── writingEval.json
│   │   │   ├── speakingEval.json
│   │   │   ├── readingEval.json
│   │   │   └── hearingEval.json
│   │   ├── fewShotExamples/
│   │   │   ├── lessons/
│   │   │   ├── quizzes/
│   │   │   └── exercises/
│   │   └── trainingDataManager.js
│   ├── evaluation/
│   │   ├── grammarChecker.js
│   │   ├── pronunciationScorer.js
│   │   ├── writingGrader.js
│   │   └── comprehensionChecker.js
│   └── config/
│       ├── apiKeys.js
│       └── providerConfig.js
│
├── render.yaml
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── .gitignore
├── .env.example
├── README.md
└── CHAT_MEMORY.md
```

## Files to Create

### 1. Root Configuration Files

**`README.md`** — Full project README:
- 🇩🇪 German Learning App — AI-powered language learning platform
- Tech stack overview (React, Vite, Tailwind, Node, Express, Prisma, PostgreSQL)
- Project structure tree
- Quick start: install → configure .env → migrate DB → dev
- Free API setup (Gemini, Groq, OpenRouter keys)
- Deployment: Render (free dev) → VPS + Coolify (production)
- Phase roadmap with links to each phase prompt

**`.gitignore`** — node_modules/, dist/, .env, *.log, uploads/* (except !uploads/.gitkeep), .prisma/

**`.env.example`** — All env vars:
```
DATABASE_URL=postgresql://user:password@host:5432/germanapp
SUPABASE_URL=
SUPABASE_ANON_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
SAMBANOVA_API_KEY=
CEREBRAS_API_KEY=
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_API_KEY=
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
PORT=5000
```

### 2. Backend — Core Setup

**`backend/package.json`** — Dependencies: express, cors, dotenv, bcryptjs, jsonwebtoken, multer, sharp, nodemailer, express-rate-limit, @google/generative-ai, groq-sdk, axios, helmet, morgan, express-validator, uuid, @prisma/client. Dev: nodemon, prisma, jest. Scripts: dev (nodemon), start (node), db:migrate (prisma migrate), db:seed, test.

**`backend/src/index.js`** — Express server:
- Load dotenv, configure CORS (FRONTEND_URL + ADMIN_URL origins)
- JSON body parser (10mb limit), cookieParser
- Morgan (dev), Helmet
- Static serving for /uploads
- Mount routes: /api/auth, /api/courses, /api/lessons, /api/exercises, /api/quizzes, /api/progress, /api/flashcards, /api/ai, /api/admin
- Error handler middleware last
- Listen on PORT

**`backend/src/prisma/schema.prisma`** — Complete Prisma schema with ALL models: User, Admin, Course, Lesson, Exercise, Quiz, Enrollment, UserProgress, QuizAttempt, ChatHistory, WritingSubmission, Flashcard, Media, AITrainingData, PromptTemplate, AIUsageLog, AdminLog, AppSetting, EmailTemplate. (Full field definitions in PHASE 1 prompt.)

**`backend/src/middleware/auth.js`** — JWT verify for students. Extracts Bearer token, verifies, attaches `req.user`.

**`backend/src/middleware/adminAuth.js`** — JWT verify for admins. Verifies against Admin model, attaches `req.admin`.

**`backend/src/middleware/errorHandler.js`** — Global error handler. Returns { error: message } with appropriate status.

**`backend/src/utils/generateToken.js`** — `jwt.sign({ id, role }, secret, { expiresIn })`.

### 3. Frontend — Core Setup

**`frontend/package.json`** — react, react-dom, react-router-dom, zustand, axios, recharts, react-icons. Dev: @vitejs/plugin-react, vite, tailwindcss, postcss, autoprefixer.

**`frontend/vite.config.js`** — React plugin, port 5173, proxy /api → http://localhost:5000.

**`frontend/tailwind.config.js`** — Content: ./index.html, ./src/**/*.{js,jsx}. Dark mode: 'class'. Extend colors: primary (#6c5ce7), accent (#a29bfe), german-black (#000000), german-red (#DD0000), german-gold (#FFCC00).

**`frontend/postcss.config.js`** — tailwindcss + autoprefixer.

**`frontend/index.html`** — Title "🇩🇪 LearnGerman — AI-Powered Language Learning", Google Fonts (Inter), root div.

**`frontend/src/main.jsx`** — BrowserRouter > App.

**`frontend/src/index.css`** — @tailwind base/components/utilities, CSS vars (--bg: #0a0a0f, --surface: #141420, --accent: #6c5ce7), dark scrollbar, Inter font.

**`frontend/src/App.jsx`** — Routes: / (Home), /login, /register, /dashboard, /courses, /lesson/:id, /exercise/:id, /quiz/:id, /profile, /ai-chat, /speaking, /writing, /reading, /vocabulary, /hearing, /grammar-practice. Navbar + Footer layout. Floating AITutorBadge.

**`frontend/src/pages/Home.jsx`** — Minimal placeholder (will be fully redesigned in Phase 9). Just:
- Centered `<h1>`: "🇩🇪 LearnGerman"
- Subtitle: "AI-Powered German Learning"
- One CTA button: "Get Started" (links to /register)
- Dark theme bg
- That's it — Phase 9 builds the full Talkpal-inspired landing page from scratch

**`frontend/src/utils/api.js`** — Axios instance with baseURL, JWT interceptor, 401 redirect.

**`frontend/src/store/store.js`** — Zustand: auth slice, courses slice, progress slice, ui slice.

### 4. Admin Panel — Core Setup

**`admin/package.json`** — Same deps + recharts, react-quill.

**`admin/vite.config.js`** — Port 5174, proxy /api.

**`admin/tailwind.config.js`** — Same as frontend but primary: #4f46e5 (indigo).

**`admin/index.html`** — Title "LearnGerman — Admin Panel".

**`admin/src/main.jsx`** — BrowserRouter > App.

**`admin/src/App.jsx`** — Routes wrapped in AdminLayout with Sidebar. /admin/login, /admin, /admin/courses/*, /admin/lessons/*, /admin/exercises/*, /admin/quizzes/*, /admin/users/*, /admin/media, /admin/analytics, /admin/settings, /admin/ai-training/*, /admin/admins/*, /admin/website-editor/* (Main Website Page Editor), /admin/updates/* (Auto-Update System).

**`admin/src/api/adminAPI.js`** — Axios instance with admin token.

### 5. AI Engine — Foundation

**`ai-engine/package.json`** — Dependencies: axios, dotenv, @google/generative-ai, groq-sdk.

**`ai-engine/index.js`** — Exports ProviderManager, template loaders, evaluation modules.

## Validation
1. `cd backend && npm install` succeeds
2. `cd frontend && npm install` succeeds
3. `cd admin && npm install` succeeds
4. `cd ai-engine && npm install` succeeds
5. `npx prisma generate` succeeds
6. `npm run build` for both frontend and admin succeeds
