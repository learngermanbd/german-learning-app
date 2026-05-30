# PHASE 1 — Database & Authentication System

> **🏆 Competitive Context:** Our DB schema must support structured CEFR courses (Talkpal has none), granular progress tracking (Talkpal has a basic streak), and admin training data (Talkpal has no teacher tools). Every table here enables a competitive advantage.

## Objective
Implement the complete authentication system for both students and admins, along with the full Prisma database schema. By the end of this phase, users can register, login, and access protected routes.

## Prerequisites
- Phase 0 completed (project scaffolding + Express server + Prisma setup)
- `cd backend && npx prisma generate` works

## Files to Create/Update

### 1. Prisma Schema (update if not complete from Phase 0)

**`backend/src/prisma/schema.prisma`** — Ensure ALL these models exist:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String
  nativeLanguage String  @default("en")
  level         String   @default("A1")  // A1, A2, B1, B2, C1
  role          String   @default("student")  // student | admin | superadmin
  isActive      Boolean  @default(true)
  emailVerified Boolean  @default(false)
  supabaseUid   String?  @unique  // Supabase Auth user ID
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  progress      UserProgress[]
  chatHistory   ChatHistory[]
  writingSubmissions WritingSubmission[]
  quizAttempts  QuizAttempt[]
}

model Admin {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String
  role          String   @default("admin")  // admin | superadmin
  permissions   String[]  // ["courses:create", "users:delete", "ai:train", ...]
  isActive      Boolean  @default(true)
  lastLogin     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Course {
  id          String   @id @default(uuid())
  title       String
  description String
  level       String
  imageUrl    String?
  isPublished Boolean  @default(false)
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lessons     Lesson[]
  enrollments Enrollment[]
}

model Lesson {
  id          String   @id @default(uuid())
  courseId     String
  title       String
  content     Json?
  level       String
  skillArea   String
  duration    Int
  order       Int
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  course      Course   @relation(fields: [courseId], references: [id])
  exercises   Exercise[]
  quizzes     Quiz[]
}

model Exercise {
  id          String   @id @default(uuid())
  lessonId    String
  type        String   // fillBlank, multipleChoice, matching, dragDrop, writing
  question    Json
  answer      Json
  explanation String?
  points      Int      @default(10)
  order       Int
  createdAt   DateTime @default(now())
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  submissions UserProgress[]
}

model Quiz {
  id          String   @id @default(uuid())
  lessonId    String
  title       String
  questions   Json
  passingScore Int     @default(70)
  timeLimit   Int?
  createdAt   DateTime @default(now())
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  attempts    QuizAttempt[]
}

model Enrollment {
  id        String   @id @default(uuid())
  userId    String
  courseId   String
  progress  Float    @default(0)
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  course    Course   @relation(fields: [courseId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model UserProgress {
  id            String   @id @default(uuid())
  userId        String
  exerciseId    String?
  quizAttemptId String?
  score         Int?
  completed     Boolean  @default(false)
  answer        Json?
  aiFeedback    Json?
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
  exercise      Exercise? @relation(fields: [exerciseId], references: [id])
}

model QuizAttempt {
  id        String   @id @default(uuid())
  userId    String
  quizId    String
  answers   Json
  score     Int
  passed    Boolean
  startedAt DateTime @default(now())
  completedAt DateTime?
  user      User     @relation(fields: [userId], references: [id])
  quiz      Quiz     @relation(fields: [quizId], references: [id])
}

model ChatHistory {
  id        String   @id @default(uuid())
  userId    String
  message   String
  response  String
  context   Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model WritingSubmission {
  id          String   @id @default(uuid())
  userId      String
  prompt      String
  text        String
  evaluation  Json?
  score       Int?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model Flashcard {
  id          String   @id @default(uuid())
  userId      String?
  lessonId    String?
  front       String
  back        String
  level       String
  tags        String[]
  reviewCount Int      @default(0)
  nextReview  DateTime?
  createdAt   DateTime @default(now())
}

model Media {
  id          String   @id @default(uuid())
  filename    String
  url         String
  type        String
  size        Int
  uploadedBy  String
  createdAt   DateTime @default(now())
}

model AITrainingData {
  id            String   @id @default(uuid())
  type          String   // lesson, quiz, vocabulary, writing, speaking, reading, hearing
  level         String   // A1-C1
  content       Json
  tags          String[]
  createdBy     String   // Admin ID
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PromptTemplate {
  id            String   @id @default(uuid())
  name          String   @unique
  type          String   // lessonGeneration, quizGeneration, conversation, etc.
  template      String   // Prompt template with {variables}
  variables     Json     // Variable definitions
  version       Int      @default(1)
  isActive      Boolean  @default(true)
  lastEditedBy  String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model AIUsageLog {
  id            String   @id @default(uuid())
  userId        String?
  adminId       String?
  provider      String   // gemini, groq, openrouter, etc.
  model         String
  taskType      String   // generate-lesson, evaluate-answer, chat, etc.
  promptTokens  Int?
  outputTokens  Int?
  duration      Int?     // ms
  success       Boolean
  errorMessage  String?
  cost          Float?   // USD
  createdAt     DateTime @default(now())
}

model AdminLog {
  id          String   @id @default(uuid())
  adminId     String
  action      String   // create, update, delete, login, etc.
  resource    String   // course, lesson, user, settings, etc.
  resourceId  String?
  details     Json?
  ipAddress   String?
  createdAt   DateTime @default(now())
}

model AppSetting {
  id    String @id @default(uuid())
  key   String @unique
  value Json
}

model EmailTemplate {
  id      String @id @default(uuid())
  name    String @unique
  subject String
  body    String
  variables String[]
}
```

### 2. Backend — Auth Controller

**Prerequisite:** Install Supabase SDK — `npm install @supabase/supabase-js`

**Setup:** Create `backend/src/utils/supabaseClient.js`
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
module.exports = supabase;
```

**Also install:** `npm install axios` (for server-side captcha verification)

**`backend/src/controllers/authController.js`** — Student authentication with Supabase Auth:

```javascript
const bcrypt = require('bcryptjs');
const axios = require('axios');
const supabase = require('../utils/supabaseClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/auth/register
// - Validates: name, email, password, confirmPassword in request body
// - Checks password === confirmPassword (400 if mismatch)
// - Validates password strength: min 8 chars, at least 1 uppercase, 1 number
// - **Validates captcha token (Cloudflare Turnstile)**
// - Checks if user exists in local DB (409 if duplicate)
// - Creates user in Supabase Auth (auto-sends verification email)
// - Hashes password with bcryptjs (10 rounds)
// - Creates local user record in Prisma with supabaseUid + emailVerified: false
// - Does NOT return JWT — user must verify email first
// - Returns 201: { message: "Registration successful. Please verify your email.", email }

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, nativeLanguage, captchaToken } = req.body;

  // 0. Captcha verification (Cloudflare Turnstile)
  if (!captchaToken) {
    return res.status(400).json({ error: 'Captcha verification is required' });
  }
  const captchaRes = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    secret: process.env.CAPTCHA_SECRET_KEY,
    response: captchaToken
  });
  if (!captchaRes.data.success) {
    return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
  }

  // 1. Confirm password validation
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // 2. Password strength validation
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 chars with 1 uppercase and 1 number' });
  }

  // 3. Check duplicate
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  // 4. Create Supabase Auth user (sends verification email automatically)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.FRONTEND_URL}/verify-email`,
      data: { name }  // metadata
    }
  });

  if (authError) return res.status(400).json({ error: authError.message });

  // 5. Hash password and create local user
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      nativeLanguage: nativeLanguage || 'en',
      supabaseUid: authData.user.id,
      emailVerified: false
    }
  });

  res.status(201).json({ message: 'Registration successful. Please verify your email.', email });
};

// POST /api/auth/verify-email
// - Called AFTER the user clicks the verification link and Supabase processes it
// - Frontend uses Supabase client to auto-detect the session from the URL hash fragment
//   (Supabase redirects to /verify-email#access_token=xxx&type=signup)
// - The Supabase client library detects this and signs the user in automatically
// - Body: { accessToken } — the Supabase access token from the client session
// - Uses supabase.auth.getUser(accessToken) to verify the email is confirmed on Supabase side
// - Updates local user: emailVerified = true
// - Returns JWT token + user data (auto-logs in on first verification)

exports.verifyEmail = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing verification token' });
  }

  // Verify with Supabase using the access token from the client session
  const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !supabaseUser?.email_confirmed_at) {
    return res.status(400).json({ error: 'Invalid or expired verification link' });
  }

  // Update local user
  const user = await prisma.user.update({
    where: { email: supabaseUser.email },
    data: { emailVerified: true }
  });

  // Generate JWT
  const jwtToken = require('../utils/generateToken')(user.id, 'student');

  res.json({
    token: jwtToken,
    user: { id: user.id, name: user.name, email: user.email, level: user.level, emailVerified: true }
  });
};

// POST /api/auth/resend-verification
// - Rate-limited: 1 request per 60 seconds per email
// - Body: { email }
// - Calls supabase.auth.resend() to resend verification email
// - Returns 200: { message: 'Verification email resent' }

exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${process.env.FRONTEND_URL}/verify-email` }
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Verification email resent successfully' });
};

// POST /api/auth/login
// - Validates email + password
// - **Validates captcha token (Cloudflare Turnstile)**
// - Finds user by email (401 if not found)
// - Compares password with bcrypt (401 if wrong)
// - Checks if user isActive (403 if disabled)
// - Checks emailVerified (403 if not verified — prompts user to check email)
// - Returns JWT token + user data

exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // 0. Captcha verification (Cloudflare Turnstile)
  if (!captchaToken) {
    return res.status(400).json({ error: 'Captcha verification is required' });
  }
  const captchaRes = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    secret: process.env.CAPTCHA_SECRET_KEY,
    response: captchaToken
  });
  if (!captchaRes.data.success) {
    return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  if (!user.isActive) return res.status(403).json({ error: 'Account has been disabled' });
  if (!user.emailVerified) {
    return res.status(403).json({
      error: 'Please verify your email before logging in',
      needsVerification: true,
      email: user.email
    });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

  const token = require('../utils/generateToken')(user.id, 'student');

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, level: user.level, emailVerified: true }
  });
};

// GET /api/auth/me
// - Protected route (auth middleware) — bypasses email verification check only for this endpoint
// - Returns current user data from req.user.id

exports.getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, level: true, nativeLanguage: true, emailVerified: true, isActive: true, role: true, createdAt: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
};

// PUT /api/auth/profile
// - Update name, nativeLanguage

exports.updateProfile = async (req, res) => { ... };

// PUT /api/auth/password
// - Update password (requires old password verification)

exports.updatePassword = async (req, res) => { ... };
```

### 3. Backend — Student Auth Routes

**`backend/src/routes/auth.js`** — Express Router:
- POST /register → authController.register
- POST /verify-email → authController.verifyEmail
- POST /resend-verification → authController.resendVerification (rate-limited)
- POST /login → authController.login
- GET /me → auth middleware → authController.getMe
- PUT /profile → auth middleware → authController.updateProfile
- PUT /password → auth middleware → authController.updatePassword

### 4. Backend — Admin Auth Controller

**`backend/src/controllers/admin/adminAuthController.js`** — Admin authentication:
- POST /api/admin/auth/login — verify admin email/password, return admin JWT
- GET /api/admin/auth/me — return current admin data
- PUT /api/admin/auth/password — change password
- POST /api/admin/auth/logout — optional (client-side token removal)

### 5. Backend — Admin Auth Routes

**`backend/src/routes/admin/auth.js`** — Express Router:
- POST /login → adminAuthController.login
- GET /me → adminAuth middleware → adminAuthController.getMe
- PUT /password → adminAuth middleware → change password

**`backend/src/routes/admin/index.js`** — Aggregates ALL admin routes:
```javascript
const router = require('express').Router();
router.use('/auth', require('./auth'));
router.use('/courses', require('./courses'));
router.use('/lessons', require('./lessons'));
router.use('/exercises', require('./exercises'));
router.use('/quizzes', require('./quizzes'));
router.use('/users', require('./users'));
router.use('/media', require('./media'));
router.use('/analytics', require('./analytics'));
router.use('/settings', require('./settings'));
router.use('/admins', require('./adminManagement'));
router.use('/ai-training', require('./ai-training'));
module.exports = router;
```

### 6. Frontend — Auth Pages

**`frontend/src/pages/Auth/Login.jsx`** — Login form:
- Email + password inputs
- **Cloudflare Turnstile captcha widget** renders below the password field
  - Install: `npm install react-turnstile`
  - Import: `import Turnstile from 'react-turnstile'`
  - Render with `sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}`
  - Store the token in state: `onVerify={(token) => setCaptchaToken(token)}`
- Submit calls API with `captchaToken` in the body
- On success: stores JWT in localStorage, redirects to /dashboard
- Error display
- Link to register
- Dark theme styling with tailwind
- Loading spinner on submit

**`frontend/src/pages/Auth/Register.jsx`** — Registration form:
- Name, email, password, confirm password, native language (select)
- **Password field** with show/hide toggle and strength indicator (min 8 chars, uppercase, number)
- **Confirm password** field with real-time match validation (inline error if mismatch)
- **Cloudflare Turnstile captcha widget** renders below the confirm password field
  - Install: `npm install react-turnstile`
  - Import: `import Turnstile from 'react-turnstile'`
  - Render with `sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}`
  - Store the token in state: `onVerify={(token) => setCaptchaToken(token)}`
- Validation: passwords match, email format valid, all fields filled, captcha completed
- On submit: calls POST /api/auth/register (with name, email, password, nativeLanguage, captchaToken)
- On success: shows a **"Verify Your Email"** success screen (not auto-login)
  - Message: "We've sent a verification link to your@email.com. Please check your inbox."
  - "Resend email" button (calls POST /api/auth/resend-verification, 60s cooldown)
  - "Check inbox" button (opens user's email provider if detectable)
  - Link to login page: "Already verified? Log in"
- Link to login below the form: "Already have an account? Log in"

### 7. Frontend — Auth Pages (New)

**`frontend/src/pages/Auth/VerifyEmail.jsx`** — Email verification status page (dual-purpose):
- **Mode A — Post-registration screen** (user has NOT yet clicked verification link):
  - 📧 Icon animation
  - "Check your email" heading
  - "We sent a verification link to your@email.com"
  - Instructions: "Click the link in the email to activate your account"
  - "Didn't receive the email?" with "Resend" button (60s cooldown with countdown timer)
  - "Change email" link → goes back to register page
  - "Back to login" link → goes to /login

- **Mode B — Redirect handler** (user just clicked the verification link):
  - On mount: initializes Supabase client and calls `supabase.auth.getSession()`
  - Supabase automatically detects the URL hash fragment (`#access_token=xxx&type=signup`)
    and processes the session — no manual URL parsing needed
  - If a valid session is found with type `signup`:
    - Gets the access token from `session.access_token`
    - Calls `POST /api/auth/verify-email` with `{ accessToken: session.access_token }`
    - On success: auto-login (store JWT) + redirect to /dashboard
    - Shows success animation: ✅ "Email verified! Redirecting..."
  - If `onAuthStateChange` fires with `SIGNED_IN`:
    - Also triggers the verification flow (catches cases where Supabase signs user in before our code runs)
  - On failure/expired: shows error with "Resend verification" button and link to login

### 8. Frontend — Auth Hook & Store

**`frontend/src/hooks/useAuth.js`** — Custom hook:
- register(data) — calls POST /api/auth/register, returns { needsVerification: true, email }
- login(email, password) — calls POST /api/auth/login, stores token on success
- logout() — clears token, redirects to /login
- getToken() — returns JWT from localStorage
- isAuthenticated — boolean check
- user — current user object with emailVerified field
- verifyEmail(accessToken) — calls POST /api/auth/verify-email with the Supabase access token
- resendVerification(email) — calls POST /api/auth/resend-verification
- needsVerification — boolean, true if registered but not yet verified

**`frontend/src/store/store.js`** — Update auth slice:
```javascript
// Zustand store with persist middleware
{
  user: null,
  token: null,
  needsVerification: false,  // true after register, before email verified
  verificationEmail: null,   // email that needs verification
  login: async (email, password) => { ... },
  register: async (data) => { ... },
  logout: () => { ... },
  loadUser: async () => { ... },
  verifyEmail: async (accessToken) => { ... },
  resendVerification: async (email) => { ... },
  isAuthenticated: false,
}
```

### 9. Auth Middleware — Email Verification Check

**`backend/src/middleware/auth.js`** — Updated to check email verification:
- Extract and verify JWT token (existing logic)
- After attaching `req.user`, check if `emailVerified === true`
- If not verified: return 403 "Please verify your email before accessing this resource"
- Exception: allow access to `/api/auth/verify-email` and `/api/auth/resend-verification` and `/api/auth/me` (so user can check their verification status)
- The middleware should look up the user from DB on each request (not rely solely on JWT claims) so that emailVerified status is always current

### 10. Admin Panel — Auth Pages

**`admin/src/pages/AdminLogin.jsx`** — Admin login form:
- Email + password
- Submit calls POST /api/admin/auth/login
- Stores admin token, redirects to /admin
- Error handling

**`admin/src/hooks/useAdminAuth.js`** — Similar to useAuth but for admin.

**`admin/src/store/adminAuthStore.js`** — Zustand store for admin auth with persist middleware.

## Validation
1. Run `npx prisma migrate dev --name init` — should create all tables
2. **Test registration (with confirm password + captcha):**
```bash
# Should succeed — passwords match + valid captcha
curl -X POST localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test123!","confirmPassword":"Test123!","name":"Test User","captchaToken":"<valid-turnstile-token>"}'
# Expected: 201 — { message: "Registration successful. Please verify your email.", email }

# Should fail — missing captcha token
curl -X POST localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test123!","confirmPassword":"Test123!","name":"Test User"}'
# Expected: 400 — { error: "Captcha verification is required" }

# Should fail — passwords mismatch
curl -X POST localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test2@test.com","password":"Test123!","confirmPassword":"Different123!","name":"Test User"}'
# Expected: 400 — { error: "Passwords do not match" }

# Should fail — weak password (no uppercase)
curl -X POST localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test3@test.com","password":"test1234","confirmPassword":"test1234","name":"Test User"}'
# Expected: 400 — { error: "Password must be at least 8 chars with 1 uppercase and 1 number" }
```
3. **Test login (with captcha):**
```bash
# Should fail — valid captcha but email not verified
curl -X POST localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test123!","captchaToken":"<valid-turnstile-token>"}'
# Expected: 403 — { error: "Please verify your email before logging in", needsVerification: true, email: "test@test.com" }

# Should fail — missing captcha token
curl -X POST localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test123!"}'
# Expected: 400 — { error: "Captcha verification is required" }
```
4. **Test verification** (requires actual Supabase — click link from email, or check Supabase dashboard to manually confirm the user)
5. **Test login after verified:** `curl -X POST localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"test@test.com","password":"Test123!"}'` — returns token + user
6. **Test resend verification:** `curl -X POST localhost:5000/api/auth/resend-verification -H 'Content-Type: application/json' -d '{"email":"test@test.com"}'` — returns 200
7. **Test protected route:** `curl localhost:5000/api/auth/me -H 'Authorization: Bearer <token>'` — returns user
8. **Test unverified user accessing protected route:** — 403
9. Test admin login: similar with admin credentials
10. `cd frontend && npm run build` succeeds
11. `cd admin && npm run build` succeeds

### 🔧 Setup Checklists

#### 🔧 Supabase Auth Setup
- [ ] Created a Supabase project at [supabase.com](https://supabase.com)
- [ ] Copied the **Project URL** and **anon public key** from Settings → API
- [ ] Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- [ ] In Supabase Dashboard → Authentication → Settings → **Enable email confirmations** (turned ON)
- [ ] Set **Site URL** in Auth → Settings to match `FRONTEND_URL` (e.g. `http://localhost:5173` for dev)
- [ ] Added `/verify-email` to **Redirect URLs** in Auth → Settings (e.g. `http://localhost:5173/verify-email`)
- [ ] (Optional) Configured Custom SMTP in Supabase Auth → Settings to use branded emails

#### 🔧 Cloudflare Turnstile Captcha Setup
- [ ] Created a Cloudflare account and went to [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/turnstile)
- [ ] Clicked **Add Site** → chose "Managed" mode → added your domain (e.g. `localhost` for dev)
- [ ] Copied the **Site Key** and **Secret Key**
- [ ] Set `CAPTCHA_SECRET_KEY` in backend `.env`:
  ```env
  CAPTCHA_SECRET_KEY=0x4AAAAAAA...
  ```
- [ ] Set `VITE_CAPTCHA_SITE_KEY` in frontend `.env`:
  ```env
  VITE_CAPTCHA_SITE_KEY=0x4AAAAAAA...
  ```
- [ ] Added the Turnstile widget import in both `Register.jsx` and `Login.jsx`
