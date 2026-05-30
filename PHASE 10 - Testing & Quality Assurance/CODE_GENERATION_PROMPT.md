# PHASE 10 — Testing & Quality Assurance

## Objective
Implement comprehensive testing across all layers: backend unit tests, frontend component tests, API integration tests, and end-to-end testing. Also includes security audit, performance optimization, and accessibility improvements.

## Prerequisites
- Phases 0-9 complete
- Jest installed in backend
- Testing libraries available

## Test Strategy

```
TEST PYRAMID:
        ╱╲
       ╱ E2E ╲          ← 5-10 critical user flows
      ╱────────╲
     ╱Integration╲       ← 20-30 API/component integration tests
    ╱──────────────╲
   ╱   Unit Tests   ╲    ← 50-100 individual function/component tests
  ╱────────────────────╲
╱  Manual Testing + QA   ╲  ← Exploratory, visual, UX review
╱──────────────────────────╲
```

## Backend Tests

### 1. Test Setup

**`backend/jest.config.js`** — Jest configuration:
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterSetup: ['./src/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  coverageThreshold: {
    global: { branches: 70%, functions: 70%, lines: 70%, statements: 70% }
  }
};
```

**`backend/src/tests/setup.js`** — Test setup:
- In-memory SQLite database for tests (or test PostgreSQL)
- Prisma test client
- Mock AI providers (prevent actual API calls)
- Test user creation helper
- Test admin creation helper
- JWT token generation for test auth
- Clean database between test runs

### 2. Auth Tests

**`backend/src/tests/auth.test.js`** — Authentication tests:
- POST /api/auth/register — success (201, returns token)
- POST /api/auth/register — duplicate email (409)
- POST /api/auth/register — invalid email (400)
- POST /api/auth/register — weak password (400)
- POST /api/auth/login — success (200, returns token)
- POST /api/auth/login — wrong password (401)
- POST /api/auth/login — disabled user (403)
- GET /api/auth/me — valid token (200, returns user)
- GET /api/auth/me — no token (401)
- GET /api/auth/me — expired token (401)
- PUT /api/auth/password — correct old password (200)
- PUT /api/auth/password — wrong old password (401)

### 3. Course Tests

**`backend/src/tests/courses.test.js`** — Course API tests:
- GET /api/courses — returns published courses (200)
- GET /api/courses — filtered by level (200)
- GET /api/courses/:id — valid course (200)
- GET /api/courses/:id — not found (404)
- POST /api/admin/courses — create course (201)
- PUT /api/admin/courses/:id — update course (200)
- DELETE /api/admin/courses/:id — delete course (200)
- POST /api/admin/courses — without auth (401)
- POST /api/admin/courses — as student (403)

### 4. Lesson Tests

**`backend/src/tests/lessons.test.js`** — Lesson API tests:
- GET /api/courses/:id/lessons — returns lessons (200)
- GET /api/lessons/:id — with exercises + quizzes (200)
- POST /api/admin/lessons — create with valid data (201)
- PUT /api/admin/lessons/:id — update (200)
- PUT /api/admin/lessons/reorder — batch reorder (200)

### 5. Exercise Tests

**`backend/src/tests/exercises.test.js`** — Exercise tests:
- POST /api/exercises/:id/submit — correct answer (200, score: 100)
- POST /api/exercises/:id/submit — wrong answer (200, score: 0)
- POST /api/exercises/:id/submit — partial answer (200, score > 0)
- GET /api/exercises/lesson/:lessonId — all exercises (200)

### 6. Quiz Tests

**`backend/src/tests/quizzes.test.js`** — Quiz tests:
- POST /api/quizzes/:id/start — returns attempt ID (201)
- POST /api/quizzes/:id/submit — all correct (200, passed: true)
- POST /api/quizzes/:id/submit — all wrong (200, passed: false)
- POST /api/quizzes/:id/submit — score calculation accuracy
- GET /api/quizzes/:id/attempts — returns history (200)

### 7. AI Service Tests

**`backend/src/tests/ai.test.js`** — AI service tests:
- aiProviderRouter — returns mock response (no real API calls)
- aiProviderRouter — fallback on provider failure
- promptBuilder — replaces all variables correctly
- promptBuilder — handles missing variables gracefully
- evaluationEngine — parse AI response to structured JSON
- evaluationEngine — handle malformed AI response

### 8. Middleware Tests

**`backend/src/tests/middleware.test.js`** — Middleware tests:
- auth middleware — valid token passes
- auth middleware — invalid token rejects
- adminAuth middleware — admin token passes
- adminAuth middleware — student token rejects
- errorHandler — returns correct status codes
- errorHandler — sanitizes error in production

## Frontend Tests

### 9. Test Setup

**`frontend/vitest.config.js`** or update package.json with test script:
- Vitest configuration
- @testing-library/react
- jsdom environment
- Coverage configuration

### 10. Auth Page Tests

**`frontend/src/__tests__/Auth.test.jsx`**:
- Login form renders all fields
- Login calls API on submit
- Login shows error on failure
- Login redirects on success
- Register form validates passwords match
- Register creates account successfully

### 11. Component Tests

**`frontend/src/__tests__/Navbar.test.jsx`**:
- Renders logo and nav links
- Shows login button when not authenticated
- Shows user name when authenticated
- Mobile hamburger menu works

**`frontend/src/__tests__/CourseCard.test.jsx`**:
- Renders course title and level badge
- Shows progress bar when enrolled
- Click navigates to course detail

**`frontend/src/__tests__/Exercise.test.jsx`**:
- Renders correct component based on type
- FillBlank: input field for answer
- MultipleChoice: radio buttons for options
- Submit button triggers answer check
- Feedback displays after submission

**`frontend/src/__tests__/Quiz.test.jsx`**:
- Start screen renders with quiz info
- Timer counts down
- Question navigation works
- Submit shows results

### 12. Store Tests

**`frontend/src/__tests__/store.test.js`**:
- Login updates auth state
- Logout clears auth state
- Fetch courses updates courses array
- Submit exercise updates progress

## Admin Panel Tests

### 13. Admin Test Setup

**`admin/vitest.config.js`** — Similar to frontend test setup.

### 14. Admin Page Tests

**`admin/src/__tests__/AdminLogin.test.jsx`**:
- Login form renders
- Invalid credentials show error
- Valid login redirects to dashboard

**`admin/src/__tests__/CoursesList.test.jsx`**:
- Table renders with correct columns
- Create button navigates to /admin/courses/new
- Delete shows confirmation modal

**`admin/src/__tests__/TrainingDashboard.test.jsx`**:
- Stats cards render
- Charts display data correctly
- Navigation to sub-pages works

## Integration Tests

### 15. API Integration Tests

**`backend/src/tests/integration/api.test.js`** — Full flow tests:
- Register → Login → Get Profile → Update Profile → Logout
- Create Course → Add Lessons → Add Exercises → Enroll → Complete → Verify Progress
- Create Quiz → Start Attempt → Submit Answers → Verify Score
- Admin Login → CRUD Course → CRUD Lesson → Manage Users
- Generate Lesson via AI → Preview → Publish → Student Views

## E2E Tests (Optional — Cypress)

### 16. Cypress Setup

**`cypress.config.js`** at root:
- Base URL: http://localhost:5173
- Viewport: 1280x720
- Video recording on failure
- Retries: 2

**`cypress/e2e/`** test files:
- auth.cy.js: Register → Login → Profile → Logout
- courses.cy.js: Browse → Enroll → View Lesson → Complete Exercise
- ai-chat.cy.js: Open Chat → Send Message → Receive Response
- admin.cy.js: Login → Create Course → Add Lesson → Generate Content

## Security Audit

### 17. Security Checklist
- [ ] JWT tokens expire and are validated
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevention (React auto-escapes, Content-Security-Policy headers)
- [ ] CORS configured for specific origins only
- [ ] Rate limiting on auth routes (express-rate-limit)
- [ ] Helmet middleware for security headers
- [ ] File upload validation (type, size, path traversal)
- [ ] Environment variables for secrets (no hardcoded keys)
- [ ] Admin routes protected by both auth + permission check
- [ ] Input validation on all endpoints (express-validator)
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enforced in production
- [ ] API keys stored server-side only

### 18. Performance Optimization
- [ ] Frontend bundle size analyzed (use vite-bundle-analyzer)
- [ ] Lazy loading for route pages (React.lazy + Suspense)
- [ ] Image optimization (Sharp on backend, lazy loading on frontend)
- [ ] API response pagination (all list endpoints)
- [ ] Database query optimization (Prisma select only needed fields)
- [ ] N+1 query prevention (Prisma include/join properly)
- [ ] Redis caching for frequent queries (optional)
- [ ] Static file caching (nginx cache headers)
- [ ] Gzip/Brotli compression enabled
- [ ] Lighthouse score target: 90+ Performance, 90+ Accessibility

### 19. Accessibility (a11y)
- [ ] Semantic HTML (nav, main, section, article, aside)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation (tab order, focus indicators)
- [ ] Color contrast ratio >= 4.5:1
- [ ] Screen reader friendly (alt text, aria-live regions)
- [ ] Focus management in modals and dialogs
- [ ] Form error announcements
- [ ] Reduced motion media query for animations
- [ ] Touch targets >= 44x44px on mobile

## Test Scripts

**`backend/package.json`** — Update test scripts:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:integration": "jest --testPathPattern=integration",
  "lint": "eslint src/"
}
```

**`frontend/package.json`** — Add test scripts:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Validation
1. `cd backend && npm test` — all backend tests pass
2. `cd frontend && npm test` — all frontend tests pass
3. `cd admin && npm test` — all admin tests pass
4. Coverage report shows > 70% coverage
5. Security checklist items all verified
6. Lighthouse scores meet targets
7. Keyboard navigation works throughout app
8. `npm run build` for all apps succeeds
