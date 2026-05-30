# PHASE 12 — Security Hardening

> **Competitive Context:** Talkpal users report privacy concerns and aggressive marketing. Our app must be secure, privacy-respecting, and transparent. Security builds trust — a competitive advantage in EdTech.

## Objective
Implement comprehensive security measures: rate limiting, input validation, CORS, security headers, XSS prevention, SQL injection protection, and authentication hardening. Target: OWASP Top 10 compliance.

## Prerequisites
- Phases 0-10 complete
- All API routes functional
- Authentication system working

## Architecture Overview

```
Security Layers
─────────────────────────────────────────
Layer 1: Network Security
  ├── HTTPS enforcement (HSTS)
  ├── CORS configuration
  ├── Content Security Policy (CSP)
  └── Rate limiting (per IP, per user)

Layer 2: Input Validation
  ├── Request body validation (Joi/Zod)
  ├── Query parameter sanitization
  ├── File upload validation
  └── SQL injection prevention (Prisma handles this)

Layer 3: Authentication Security
  ├── Password hashing (bcrypt, 12 rounds)
  ├── JWT token security (short expiry, refresh tokens)
  ├── Session management
  └── Account lockout (brute force protection)

Layer 4: Authorization
  ├── Role-based access control (RBAC)
  ├── Resource-level permissions
  ├── Admin permission system
  └── API endpoint protection

Layer 5: Data Protection
  ├── Sensitive data encryption
  ├── Password masking in logs
  ├── API key rotation
  └── GDPR compliance (data export, deletion)
```

## Files to Create/Update

### 1. Rate Limiting

**`backend/src/middleware/rateLimiter.js`** — Rate limiting middleware:
```javascript
// Middleware: rateLimiter
// Implementation: express-rate-limit + memory store
// Configurations:
//   - global: 100 requests per 15 minutes per IP
//   - auth: 5 requests per 15 minutes per IP (login/register)
//   - ai: 30 requests per minute per user (AI endpoints)
//   - upload: 10 requests per hour per user
//   - passwordReset: 3 requests per hour per email
// Response: 429 Too Many Requests with Retry-After header
// Skip: Health checks, static assets
// Store: Memory (development), Redis (production-ready config)
```

**`backend/src/middleware/specificLimiters.js`** — Route-specific rate limiters:
```javascript
// Export: authLimiter, aiLimiter, uploadLimiter, apiLimiter
// authLimiter: 5 req/15min (login, register, password reset)
// aiLimiter: 30 req/min per user (all /api/ai/* routes)
// uploadLimiter: 10 req/hour per user (file uploads)
// apiLimiter: 100 req/15min per IP (general API)
// Each returns rateLimit middleware with specific config
```

### 2. Input Validation

**`backend/src/middleware/validate.js`** — Request validation middleware:
```javascript
// Middleware: validate(schema)
// Uses Joi for schema validation
// Validates: req.body, req.query, req.params
// Returns: 400 with detailed error messages
// Features:
//   - Strip unknown fields (prevent mass assignment)
//   - Sanitize strings (trim, escape HTML)
//   - Validate email format
//   - Validate password strength (min 8, uppercase, lowercase, number)
//   - Validate UUID format for IDs
//   - Custom error messages per field
```

**`backend/src/utils/validators.js`** — Validation schemas:
```javascript
// Joi schemas for all request types:
// - registerSchema: { name, email, password, nativeLanguage, level }
// - loginSchema: { email, password }
// - courseSchema: { title, description, level, imageUrl }
// - lessonSchema: { title, content, level, skillArea, duration }
// - exerciseSchema: { type, question, answer, points }
// - quizSchema: { title, questions, passingScore, timeLimit }
// - profileUpdateSchema: { name, nativeLanguage, level, bio }
// - adminCreateSchema: { email, password, name, role, permissions }
// - paginationSchema: { page, limit, sortBy, sortOrder }
// - searchSchema: { query, filters }
```

**`backend/src/middleware/sanitize.js`** — Input sanitization:
```javascript
// Middleware: sanitize
// Features:
//   - Strip HTML tags from string inputs (prevent XSS)
//   - Escape special characters
//   - Trim whitespace
//   - Normalize Unicode (prevent homograph attacks)
//   - Sanitize file names (prevent path traversal)
// Integration: Use before validation in route handlers
```

### 3. Security Headers

**`backend/src/middleware/securityHeaders.js`** — Helmet.js configuration:
```javascript
// Middleware: securityHeaders (helmet)
// Configuration:
//   - ContentSecurityPolicy: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       imgSrc: ["'self'", "data:", "https:"],
//       connectSrc: ["'self'", "https://api.openrouter.ai", "https://generativelanguage.googleapis.com"]
//     }
//   - HSTS: { maxAge: 31536000, includeSubDomains: true }
//   - ReferrerPolicy: { policy: "strict-origin-when-cross-origin" }
//   - X-Content-Type-Options: { nosniff: true }
//   - X-Frame-Options: { DENY: true }
//   - X-XSS-Protection: { mode: "block" }
```

**`backend/src/middleware/cors.js`** — CORS configuration:
```javascript
// Middleware: cors
// Configuration:
//   - origin: [FRONTEND_URL, ADMIN_URL] (from env)
//   - methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
//   - allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
//   - credentials: true (allow cookies)
//   - maxAge: 86400 (24 hours preflight cache)
// Development: Allow all origins with warning
// Production: Strict origin whitelist
```

### 4. Authentication Security

**`backend/src/utils/passwordUtils.js`** — Password security:
```javascript
// Utility functions:
// - hashPassword(password): bcrypt hash with 12 rounds
// - comparePassword(password, hash): Secure comparison
// - validatePasswordStrength(password): Check complexity
//   - Min 8 characters
//   - At least 1 uppercase, 1 lowercase, 1 number
//   - Not in common password list
//   - Not similar to email/name
// - generatePasswordResetToken(): Crypto-random token
// - hashToken(token): SHA-256 hash for storage
```

**`backend/src/middleware/accountSecurity.js`** — Account protection:
```javascript
// Middleware: accountSecurity
// Features:
//   - Track failed login attempts per email
//   - Lock account after 5 failed attempts (15 minute lockout)
//   - Log all auth events (login, logout, password change)
//   - Detect suspicious activity (multiple IPs, rapid requests)
//   - Require re-authentication for sensitive operations
// Storage: AccountSecurity table or Redis
```

**`backend/src/utils/tokenUtils.js`** — JWT token security:
```javascript
// Utility functions:
// - generateToken(payload, expiresIn): Create JWT
//   - Access token: 15 minutes expiry
//   - Refresh token: 7 days expiry
// - verifyToken(token): Verify and decode JWT
// - refreshAccessToken(refreshToken): Generate new access token
// - revokeToken(token): Add to blacklist (for logout)
// - decodeToken(token): Decode without verification (for logging)
// Security:
//   - Use different secrets for access/refresh tokens
//   - Include token fingerprint in payload
//   - Validate token not blacklisted
```

### 5. File Upload Security

**`backend/src/middleware/fileUploadSecurity.js`** — Secure file uploads:
```javascript
// Middleware: fileUploadSecurity
// Features:
//   - Validate file type (whitelist: jpg, png, webp, pdf, mp3, mp4)
//   - Validate file size (max 10MB for images, 50MB for video)
//   - Scan file name (prevent path traversal: ../, ..\)
//   - Generate random file name (prevent original name injection)
//   - Store outside web root (prevent direct access)
//   - Set correct Content-Type header
//   - Limit concurrent uploads (5 per user)
```

**`backend/src/utils/fileValidator.js`** — File validation utilities:
```javascript
// Utility functions:
// - validateFileType(file, allowedTypes): Check MIME type and extension
// - validateFileSize(file, maxSize): Check file size
// - sanitizeFileName(name): Remove special characters, generate safe name
// - generateUniqueFileName(originalName): UUID + extension
// - getFileExtension(mimetype): Map MIME type to extension
// Supported types:
//   - Images: image/jpeg, image/png, image/webp
//   - Documents: application/pdf
//   - Audio: audio/mpeg, audio/wav
//   - Video: video/mp4, video/webm
```

### 6. Data Protection

**`backend/src/middleware/dataProtection.js`** — Data security middleware:
```javascript
// Middleware: dataProtection
// Features:
//   - Mask sensitive fields in logs (email, password, tokens)
//   - Prevent logging of request bodies for auth routes
//   - Sanitize error messages (don't expose stack traces in production)
//   - Add request ID for tracing
//   - Log security events (failed auth, rate limit hits)
```

**`backend/src/utils/encryption.js`** — Encryption utilities:
```javascript
// Utility functions:
// - encrypt(text, key): AES-256-GCM encryption
// - decrypt(encrypted, key): AES-256-GCM decryption
// - hash(data): SHA-256 hash
// - generateKey(): Generate random encryption key
// Use cases:
//   - Encrypt sensitive data at rest (API keys, personal data)
//   - Hash tokens for storage
//   - Generate secure random values
```

**`backend/src/utils/gdprUtils.js`** — GDPR compliance:
```javascript
// Utility functions:
// - exportUserData(userId): Export all user data as JSON
// - deleteUserData(userId): Soft delete all user data
// - anonymizeUserData(userId): Replace PII with anonymized values
// - getDataRetentionReport(): List data older than retention period
// - consentManager(userId, consentType, granted): Track consent
// Compliance:
//   - Right to access (export)
//   - Right to erasure (delete)
//   - Right to portability (JSON export)
//   - Consent management
```

### 7. Security Monitoring

**`backend/src/middleware/securityLogger.js`** — Security event logging:
```javascript
// Middleware: securityLogger
// Logs:
//   - Failed login attempts (email, IP, user-agent)
//   - Rate limit violations (IP, endpoint)
//   - Invalid input attempts (endpoint, error type)
//   - Unauthorized access attempts (resource, user)
//   - File upload violations (file type, size)
//   - CORS violations (origin, endpoint)
// Storage: SecurityLog table or external service
// Alerts: Email on suspicious activity (configurable)
```

**`backend/src/routes/security.js`** — Security audit endpoints:
```javascript
// Admin-only endpoints:
// GET /api/admin/security/logs — Recent security events
// GET /api/admin/security/stats — Security statistics
// GET /api/admin/security/rate-limits — Current rate limit status
// POST /api/admin/security/rotate-keys — Rotate API keys
// DELETE /api/admin/security/sessions/:id — Revoke user session
// GET /api/admin/security/audit — Full audit log
```

## Validation Checklist

After completing this phase, verify:

- [ ] Rate limiting works: Send 6 rapid requests to /api/auth/login → 429 on 6th
- [ ] Input validation works: Send invalid data → 400 with error messages
- [ ] Security headers present: Check response headers (CSP, HSTS, X-Frame-Options)
- [ ] CORS works: Request from wrong origin → blocked
- [ ] Password hashing: Check database → passwords are bcrypt hashes
- [ ] JWT expiry: Tokens expire after 15 minutes
- [ ] File upload validation: Upload .exe file → rejected
- [ ] SQL injection: Send `'; DROP TABLE users;--` → handled safely (Prisma)
- [ ] XSS prevention: Send `<script>alert('xss')</script>` → sanitized
- [ ] Error messages don't leak: Stack traces not exposed in production
- [ ] Security events logged: Check security logs after failed login

## Security Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| OWASP Top 10 Coverage | 100% | Security audit checklist |
| Rate Limiting | Working | Manual testing with curl/Postman |
| Input Validation | All endpoints | Automated testing |
| Password Hashing | bcrypt, 12 rounds | Check code |
| JWT Expiry | 15 min access, 7 day refresh | Check code |
| Security Headers | All present | SecurityHeaders.com scan |
| CORS | Properly configured | Browser DevTools |
| Error Handling | No stack traces | Manual testing |

## Competitive Advantage Check

- [ ] We're more secure than Talkpal (they have no admin training security)
- [ ] Privacy-respecting: No dark patterns, easy data export
- [ ] Transparent: Clear privacy policy, no hidden tracking
- [ ] GDPR compliant: Data export, deletion, consent management
- [ ] Enterprise-ready: Admin security logs, audit trail

---

*Estimated time: 3-4 hours | Files: ~12 | Priority: High*
