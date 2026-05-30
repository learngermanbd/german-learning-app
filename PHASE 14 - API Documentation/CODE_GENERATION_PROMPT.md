# PHASE 14 — API Documentation

> **Competitive Context:** LEARNGERMAN's B2B model requires selling to schools and institutions. Professional API documentation is essential for enterprise adoption and developer trust. Talkpal has no API — we do, and it's well-documented.

## Objective
Create comprehensive API documentation using OpenAPI/Swagger: interactive API explorer, auto-generated reference, SDK generation, and Postman collection export. Target: Developer-friendly, enterprise-ready API documentation.

## Prerequisites
- Phases 0-10 complete
- All API routes finalized
- Backend fully functional

## Architecture Overview

```
API Documentation Architecture
─────────────────────────────────────────
┌─────────────────────────────────────────┐
│           DOCUMENTATION SOURCES         │
├─────────────────────────────────────────┤
│ OpenAPI Spec │ Route Annotations │ Types│
└────────┬──────┴────────┬─────────┴──┬──┘
         │               │            │
         v               v            v
┌─────────────────────────────────────────┐
│           GENERATION LAYER              │
├─────────────────────────────────────────┤
│ Swagger UI │ Redoc │ TypeGen │ SDK Gen  │
└────────┬────┴───┬───┴───┬────┴────┬────┘
         │        │       │         │
         v        v       v         v
┌─────────────────────────────────────────┐
│           OUTPUT LAYER                  │
├─────────────────────────────────────────┤
│ Interactive UI │ Reference Docs │ SDKs  │
└─────────────────────────────────────────┘
```

## Files to Create/Update

### 1. OpenAPI Specification

**`backend/src/docs/openapi.json`** — OpenAPI 3.0 specification:
```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "LEARNGERMAN API",
    "description": "AI-Powered German Learning Platform API",
    "version": "1.0.0",
    "contact": { "name": "LEARNGERMAN Support", "email": "api@learngerman.de" }
  },
  "servers": [
    { "url": "http://localhost:5000", "description": "Development" },
    { "url": "https://api.learngerman.de", "description": "Production" }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "User": { ... },
      "Course": { ... },
      "Lesson": { ... },
      "Exercise": { ... },
      "Quiz": { ... },
      "AIChatRequest": { ... },
      "AIChatResponse": { ... },
      "Error": { ... }
    }
  },
  "paths": {
    "/api/auth/register": { ... },
    "/api/auth/login": { ... },
    "/api/courses": { ... },
    "/api/courses/{id}": { ... },
    "/api/courses/{id}/lessons": { ... },
    "/api/lessons/{id}": { ... },
    "/api/exercises/{id}/submit": { ... },
    "/api/quizzes/{id}/start": { ... },
    "/api/quizzes/{id}/submit": { ... },
    "/api/ai/chat": { ... },
    "/api/ai/speaking/evaluate": { ... },
    "/api/ai/writing/grade": { ... },
    "/api/admin/courses": { ... },
    "/api/admin/lessons": { ... },
    "/api/admin/users": { ... },
    "/api/admin/analytics/overview": { ... }
  },
  "tags": [
    { "name": "Auth", "description": "Authentication & registration" },
    { "name": "Courses", "description": "Course browsing & enrollment" },
    { "name": "Lessons", "description": "Lesson content & progress" },
    { "name": "Exercises", "description": "Exercise submission & scoring" },
    { "name": "Quizzes", "description": "Quiz taking & results" },
    { "name": "AI", "description": "AI-powered features" },
    { "name": "Admin", "description": "Admin management endpoints" },
    { "name": "Analytics", "description": "Analytics & reporting" }
  ]
}
```

### 2. Swagger UI Setup

**`backend/src/docs/swagger.js`** — Swagger configuration:
```javascript
// Swagger configuration:
// - Serve Swagger UI at /api/docs
// - Serve OpenAPI JSON at /api/docs/openapi.json
// - Custom CSS for LEARNGERMAN branding (dark theme)
// - Try-it-out enabled by default
// - Authorization header support
// - Request/response examples
// - Schema display enabled
// Integration: app.use('/api/docs', swaggerRouter)
```

**`backend/src/middleware/swaggerUi.js`** — Swagger UI middleware:
```javascript
// Middleware: swaggerUi
// Serves Swagger UI static files
// Configuration:
//   - Custom favicon
//   - Custom logo
//   - Dark theme CSS
//   - Expand all tags by default
//   - Show request duration
//   - Copy button for code blocks
//   - Try-it-out button enabled
//   - Persist authorization between requests
```

### 3. Route Annotations

**`backend/src/docs/annotations/auth.js`** — Auth route annotations:
```javascript
// JSDoc annotations for auth routes:
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new student account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: SecurePass123!
 *               name:
 *                 type: string
 *                 example: Max Müller
 *               nativeLanguage:
 *                 type: string
 *                 default: en
 *               level:
 *                 type: string
 *                 enum: [A1, A2, B1, B2, C1]
 *                 default: A1
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
```

**`backend/src/docs/annotations/courses.js`** — Course route annotations:
```javascript
// JSDoc annotations for course routes:
/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get all published courses
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [A1, A2, B1, B2, C1]
 *         description: Filter by CEFR level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
```

### 4. Type Generation

**`backend/src/docs/generateTypes.js`** — TypeScript type generator:
```javascript
// Script: generateTypes.js
// Reads: openapi.json
// Outputs: 
//   - frontend/src/types/api.ts (TypeScript interfaces)
//   - admin/src/types/api.ts (same types for admin)
// Features:
//   - Generate interfaces for all schemas
//   - Generate request/response types
//   - Generate enum types
//   - Generate API client functions
//   - Add JSDoc comments from OpenAPI descriptions
// Usage: node src/docs/generateTypes.js
```

**`frontend/src/types/api.ts`** — Generated TypeScript types:
```typescript
// Auto-generated from OpenAPI spec (don't edit manually):
// export interface User { id: string; email: string; name: string; ... }
// export interface Course { id: string; title: string; ... }
// export interface Lesson { id: string; courseId: string; ... }
// export interface Exercise { id: string; lessonId: string; ... }
// export interface Quiz { id: string; lessonId: string; ... }
// export interface AIChatRequest { message: string; context?: string; }
// export interface AIChatResponse { response: string; correction?: string; }
// export interface PaginatedResponse<T> { data: T[]; pagination: Pagination; }
// export interface ApiError { message: string; code: string; details?: any; }
```

### 5. SDK Generation

**`backend/src/docs/generateSdk.js`** — JavaScript SDK generator:
```javascript
// Script: generateSdk.js
// Reads: openapi.json
// Outputs: frontend/src/api/generated.js
// Features:
//   - Generate fetch-based API client
//   - Automatic auth header injection
//   - Request/response interceptors
//   - Error handling
//   - TypeScript definitions
//   - Tree-shakeable exports
// Usage: node src/docs/generateSdk.js
```

**`frontend/src/api/generated.js`** — Generated API client:
```javascript
// Auto-generated API client:
// import { apiClient } from './generated';
//
// // Auth
// apiClient.auth.register({ email, password, name })
// apiClient.auth.login({ email, password })
//
// // Courses
// apiClient.courses.list({ level, page, limit })
// apiClient.courses.get(id)
// apiClient.courses.lessons(courseId)
//
// // AI
// apiClient.ai.chat({ message, context })
// apiClient.ai.speaking.evaluate({ audio, sentence })
// apiClient.ai.writing.grade({ text, prompt })
//
// // Admin
// apiClient.admin.courses.create({ title, description, level })
// apiClient.admin.users.list({ page, limit })
// apiClient.admin.analytics.overview()
```

### 6. Postman Collection

**`backend/src/docs/postman.json`** — Postman collection:
```json
{
  "info": {
    "name": "LEARNGERMAN API",
    "description": "Complete API collection for testing",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{ "key": "token", "value": "{{token}}" }]
  },
  "variables": [
    { "key": "baseUrl", "value": "http://localhost:5000" },
    { "key": "token", "value": "" }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        { "name": "Register", "request": { ... } },
        { "name": "Login", "request": { ... } },
        { "name": "Get Profile", "request": { ... } }
      ]
    },
    {
      "name": "Courses",
      "item": [
        { "name": "List Courses", "request": { ... } },
        { "name": "Get Course", "request": { ... } },
        { "name": "Get Lessons", "request": { ... } }
      ]
    },
    {
      "name": "AI",
      "item": [
        { "name": "Chat", "request": { ... } },
        { "name": "Speaking Evaluate", "request": { ... } },
        { "name": "Writing Grade", "request": { ... } }
      ]
    }
  ]
}
```

### 7. Documentation Pages

**`admin/src/pages/docs/ApiDocs.jsx`** — Admin API docs page:
```javascript
// Page: ApiDocs
// Embeds Swagger UI in admin panel
// Features:
//   - Full Swagger UI iframe
//   - Quick reference sidebar
//   - API key management
//   - Usage statistics
//   - Rate limit info
// Route: /admin/docs/api
```

**`frontend/src/pages/Developer.jsx`** — Developer portal page:
```javascript
// Page: Developer
// Public developer documentation
// Sections:
//   - Quick Start guide
//   - Authentication guide
//   - API reference (embedded Swagger)
//   - Code examples (JavaScript, Python, cURL)
//   - SDKs and libraries
//   - Webhooks (if applicable)
//   - Rate limits
//   - Error codes
// Route: /developer
```

### 8. Documentation Generation Script

**`backend/src/docs/generateDocs.js`** — Documentation generator:
```javascript
// Script: generateDocs.js
// Tasks:
//   1. Read all route annotations (JSDoc)
//   2. Generate openapi.json
//   3. Generate TypeScript types
//   4. Generate JavaScript SDK
//   5. Generate Postman collection
//   6. Validate OpenAPI spec
// Usage: node src/docs/generateDocs.js
// npm script: "docs": "node src/docs/generateDocs.js"
```

## Validation Checklist

After completing this phase, verify:

- [ ] Swagger UI loads at /api/docs
- [ ] OpenAPI spec is valid: `npx @redocly/cli lint openapi.json`
- [ ] Try-it-out works: Send requests from Swagger UI
- [ ] Auth works in Swagger: Paste JWT token, test protected routes
- [ ] All endpoints documented: Check every route has annotations
- [ ] TypeScript types generate: Run type generator, check output
- [ ] SDK generates: Run SDK generator, check output
- [ ] Postman collection imports: Import in Postman, verify
- [ ] Examples work: Copy-paste example requests, verify responses
- [ ] Error responses documented: Check 400, 401, 403, 404, 500
- [ ] Admin docs page loads: Navigate to /admin/docs/api

## Documentation Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Endpoint Coverage | 100% | All routes have OpenAPI annotations |
| Schema Coverage | 100% | All request/response schemas defined |
| Example Coverage | >80% | Most endpoints have examples |
| Swagger UI Load | <2s | Page load time |
| Type Generation | <5s | Script execution time |
| SDK Size | <50KB | Bundle size of generated SDK |

## Competitive Advantage Check

- [ ] We have API documentation (Talkpal has no API)
- [ ] Enterprise-ready: Schools can integrate with our platform
- [ ] Developer-friendly: Easy to build on top of LEARNGERMAN
- [ ] Professional appearance: Builds trust with B2B customers
- [ ] Self-service: Developers can explore without contacting sales

---

*Estimated time: 2-3 hours | Files: ~8 | Priority: Medium*
