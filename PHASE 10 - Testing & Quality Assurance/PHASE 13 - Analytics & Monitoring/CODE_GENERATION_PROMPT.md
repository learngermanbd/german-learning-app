# PHASE 13 — Analytics & Monitoring

> **Competitive Context:** Talkpal has basic streak tracking. Our analytics dashboard shows per-skill mastery, learning patterns, and AI usage — helping users *feel* they're improving. Data-driven learning is a competitive advantage.

## Objective
Implement comprehensive analytics: user behavior tracking, error monitoring, performance monitoring, health checks, and analytics dashboards. Target: Real-time visibility into app health and user engagement.

## Prerequisites
- Phases 0-10 complete
- All features functional
- Database with analytics-capable schema

## Architecture Overview

```
Analytics Architecture
─────────────────────────────────────────
┌─────────────────────────────────────────┐
│              DATA SOURCES                │
├─────────────────────────────────────────┤
│ Frontend Events │ Backend Logs │ DB Stats│
└────────┬────────┴──────┬───────┴───┬────┘
         │               │           │
         v               v           v
┌─────────────────────────────────────────┐
│           COLLECTION LAYER              │
├─────────────────────────────────────────┤
│ Event Tracker │ Request Logger │ DB Mon  │
└────────┬──────┴───────┬───────┴───┬────┘
         │              │           │
         v              v           v
┌─────────────────────────────────────────┐
│           PROCESSING LAYER              │
├─────────────────────────────────────────┤
│ Event Processor │ Aggregator │ Alerting │
└────────┬────────┴─────┬─────┴────┬─────┘
         │              │          │
         v              v          v
┌─────────────────────────────────────────┐
│           STORAGE LAYER                 │
├─────────────────────────────────────────┤
│ Analytics DB │ Logs │ Metrics Store     │
└────────┬──────┴──┬───┴────────┬────────┘
         │         │            │
         v         v            v
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
├─────────────────────────────────────────┤
│ Admin Dashboard │ Health Checks │ Alerts│
└─────────────────────────────────────────┘
```

## Files to Create/Update

### 1. Frontend — Event Tracking

**`frontend/src/utils/analytics.js`** — Analytics client:
```javascript
// Analytics client with queue and batch sending:
// - track(event, properties): Track a custom event
// - page(pageName, properties): Track page view
// - identify(userId, traits): Identify user
// - group(groupId, traits): Identify group/org
// - flush(): Send queued events immediately
// - enable/disable(): Toggle tracking
// Features:
//   - Queue events in memory, send in batches (every 30 seconds)
//   - Automatic context: page URL, user agent, timestamp
//   - Respect Do Not Track browser setting
//   - No PII in events (mask email, name)
//   - Offline support: queue events, send when online
```

**`frontend/src/hooks/useAnalytics.js`** — React analytics hook:
```javascript
// Hook: useAnalytics
// Returns: { track, page, identify, trackClick, trackFormSubmit }
// Auto-tracking:
//   - Page views on route change (React Router)
//   - Click events on buttons with data-track attribute
//   - Form submissions on forms with data-track attribute
//   - Scroll depth (25%, 50%, 75%, 100%)
//   - Time on page
// Usage: const { track } = useAnalytics(); track('Course Started', { courseId: 123 })
```

**`frontend/src/components/AnalyticsProvider.jsx`** — Analytics context:
```javascript
// Context Provider: AnalyticsProvider
// Wraps app to provide analytics context
// Features:
//   - Initialize analytics on mount
//   - Track page views on route change
//   - Provide analytics to all children via context
//   - Flush events on page unload (navigator.sendBeacon)
// Integration: Wrap App.jsx with <AnalyticsProvider>
```

### 2. Backend — Request Logging

**`backend/src/middleware/requestLogger.js`** — Request logging:
```javascript
// Middleware: requestLogger
// Logs: method, URL, status, response time, user ID, IP, user-agent
// Format: [INFO] GET /api/courses — 200 — 45ms — user:abc123 — 192.168.1.1
// Storage: RequestLog table or external logging service
// Features:
//   - Skip health checks and static assets
//   - Redact sensitive fields (passwords, tokens)
//   - Slow request alerts (>1000ms)
//   - Request ID for tracing (X-Request-ID header)
```

**`backend/src/middleware/errorLogger.js`** — Error logging:
```javascript
// Middleware: errorLogger
// Logs: error message, stack trace, request details, user context
// Format: [ERROR] POST /api/ai/chat — 500 — "Provider timeout" — user:abc123
// Storage: ErrorLog table
// Features:
//   - Capture full error context
//   - Don't log sensitive data (passwords, API keys)
//   - Deduplicate similar errors (count instead of repeat)
//   - Alert on critical errors (email/notification)
```

### 3. Database — Analytics Models

**`backend/src/prisma/schema.prisma`** — Add analytics models:
```prisma
// Add to existing schema:

model AnalyticsEvent {
  id          String   @id @default(uuid())
  event       String
  userId      String?
  properties  Json?
  context     Json?    // { page, userAgent, ip, timestamp }
  createdAt   DateTime @default(now())
  @@index([event])
  @@index([userId])
  @@index([createdAt])
}

model RequestLog {
  id          String   @id @default(uuid())
  method      String
  url         String
  status      Int
  duration    Int      // ms
  userId      String?
  ip          String?
  userAgent   String?
  requestId   String?
  createdAt   DateTime @default(now())
  @@index([method, url])
  @@index([status])
  @@index([createdAt])
}

model ErrorLog {
  id          String   @id @default(uuid())
  message     String
  stack       String?
  method      String?
  url         String?
  userId      String?
  context     Json?
  count       Int      @default(1)
  lastSeen    DateTime @default(now())
  createdAt   DateTime @default(now())
  @@index([message])
  @@index([createdAt])
}

model HealthCheck {
  id          String   @id @default(uuid())
  service     String   // "database", "ai-provider", "backend"
  status      String   // "healthy", "degraded", "down"
  latency     Int?     // ms
  details     Json?
  checkedAt   DateTime @default(now())
  @@index([service, checkedAt])
}
```

### 4. Health Check System

**`backend/src/routes/health.js`** — Health check endpoints:
```javascript
// Public endpoints:
// GET /api/health — Basic health check (200 OK)
// GET /api/health/detailed — Detailed health (admin only)
//
// Checks:
//   - Database connectivity (Prisma query)
//   - AI provider availability (test call to Gemini)
//   - Memory usage (process.memoryUsage())
//   - Disk space (if applicable)
//   - Uptime (process.uptime())
//
// Response format:
// {
//   status: "healthy" | "degraded" | "down",
//   timestamp: "2026-05-30T10:00:00Z",
//   uptime: 86400,
//   services: {
//     database: { status: "healthy", latency: 12 },
//     ai: { status: "healthy", latency: 245 },
//     memory: { status: "healthy", usage: "120MB/512MB" }
//   }
// }
```

**`backend/src/services/healthChecker.js`** — Health check service:
```javascript
// Service: healthChecker
// Methods:
//   - checkDatabase(): Prisma query latency
//   - checkAIProviders(): Test each provider availability
//   - checkMemory(): Process memory usage
//   - checkDisk(): Disk space (if applicable)
//   - runAllChecks(): Execute all checks, return summary
//   - getHistoricalChecks(service, hours): Get past health data
//   - storeCheck(result): Save to HealthCheck table
// Schedule: Run checks every 5 minutes (setInterval)
// Alerts: Email/notification on status change (down → healthy, healthy → down)
```

### 5. Admin Analytics Dashboard

**`backend/src/routes/admin/analytics.js`** — Analytics API:
```javascript
// Admin endpoints:
// GET /api/admin/analytics/overview — Dashboard stats
//   - Total users, active today, new this week/month
//   - Total courses, lessons, exercises
//   - AI usage (requests, tokens, cost)
//   - Average scores, completion rates
//
// GET /api/admin/analytics/users — User analytics
//   - User growth over time
//   - Active users (daily, weekly, monthly)
//   - User retention (D1, D7, D30)
//   - Top users by engagement
//
// GET /api/admin/analytics/courses — Course analytics
//   - Most popular courses
//   - Course completion rates
//   - Average scores per course
//   - Time spent per course
//
// GET /api/admin/analytics/engagement — Engagement analytics
//   - Feature usage (chat, speaking, writing)
//   - Session duration distribution
//   - Peak usage hours
//   - Device/browser breakdown
//
// GET /api/admin/analytics/ai — AI usage analytics
//   - Requests per provider
//   - Token usage and cost
//   - Error rates per provider
//   - Response time distribution
```

**`admin/src/pages/analytics/AnalyticsDashboard.jsx`** — Main analytics page:
```javascript
// Page: AnalyticsDashboard
// Layout:
//   - Top row: 4 stat cards (Users, Courses, AI Requests, Avg Score)
//   - Second row: User growth chart (Recharts LineChart)
//   - Third row: Feature usage (BarChart) + Engagement (PieChart)
//   - Bottom: Recent activity feed
// Filters: Date range (7d, 30d, 90d, custom)
// Auto-refresh: Every 60 seconds
```

**`admin/src/pages/analytics/UserAnalytics.jsx`** — User analytics page:
```javascript
// Page: UserAnalytics
// Features:
//   - User growth timeline (LineChart)
//   - Active users table with filters
//   - Retention cohort analysis
//   - User segmentation by level/activity
//   - Export to CSV button
```

**`admin/src/pages/analytics/CourseAnalytics.jsx`** — Course analytics page:
```javascript
// Page: CourseAnalytics
// Features:
//   - Course performance table (views, enrollments, completions)
//   - Completion rate by course (BarChart)
//   - Average score distribution
//   - Time spent analysis
//   - Course comparison tool
```

**`admin/src/pages/analytics/AIUsageAnalytics.jsx`** — AI usage page:
```javascript
// Page: AIUsageAnalytics
// Features:
//   - AI requests by provider (PieChart)
//   - Token usage over time (LineChart)
//   - Cost tracking (daily, weekly, monthly)
//   - Error rate monitoring
//   - Response time percentiles
//   - Quota remaining per provider
```

### 6. User-Facing Analytics

**`frontend/src/pages/Analytics.jsx`** — Student analytics page:
```javascript
// Page: Analytics (student-facing)
// Features:
//   - Learning time chart (daily, weekly)
//   - Skill progress over time (RadarChart)
//   - Streak visualization
//   - XP history
//   - Quiz score trends
//   - AI usage stats (chat sessions, speaking practice)
//   - Goal tracking (daily/weekly targets)
```

**`frontend/src/components/StatsCard.jsx`** — Reusable stats card:
```javascript
// Component: StatsCard
// Props: { title, value, change, icon, color, trend }
// Displays: Stat value with trend indicator (up/down arrow)
// Animations: Count-up animation on mount
// Variants: primary, success, warning, danger
```

### 7. Error Monitoring Integration

**`frontend/src/utils/errorMonitor.js`** — Frontend error monitoring:
```javascript
// Error monitoring client:
// - init(): Initialize error tracking
// - captureError(error, context): Capture and report error
// - captureMessage(message, level): Capture info/warning/error
// - setUserContext(userId, email): Set user context
// - setTag(key, value): Add metadata tags
// Features:
//   - Global error handler (window.onerror)
//   - Unhandled promise rejection handler
//   - React error boundary integration
//   - Source map support for production errors
//   - Breadcrumb trail (last 10 actions before error)
```

**`frontend/src/components/ErrorBoundary.jsx`** — React error boundary:
```javascript
// Component: ErrorBoundary
// Catches: Component rendering errors
// Displays: User-friendly error page with retry button
// Reports: Sends error to monitoring service
// Features:
//   - Fallback UI with "Something went wrong" message
//   - Retry button to reset error state
//   - "Report Issue" link (pre-filled with error details)
//   - Development mode: Show full error + stack trace
```

## Validation Checklist

After completing this phase, verify:

- [ ] Health check endpoint returns 200: `curl /api/health`
- [ ] Detailed health check shows all services: `curl /api/health/detailed`
- [ ] Request logs are being created: Check RequestLog table
- [ ] Error logs capture exceptions: Trigger error, check ErrorLog table
- [ ] Analytics events are tracked: Check AnalyticsEvent table
- [ ] Admin analytics dashboard loads: Navigate to /admin/analytics
- [ ] Charts display data: Verify Recharts components render
- [ ] Date filters work: Change date range, verify data updates
- [ ] Export works: Click export, verify CSV downloads
- [ ] Frontend errors are caught: Trigger JS error, check monitoring
- [ ] Health checks run periodically: Wait 5 minutes, check HealthCheck table

## Monitoring Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Health Check Latency | <100ms | Health check response time |
| Analytics Event Processing | <1s | Time from event to storage |
| Dashboard Load Time | <2s | Admin analytics page load |
| Error Capture Rate | 100% | All errors captured |
| Data Retention | 90 days | Configure in database |
| Alert Response | <5 min | Time from alert to notification |

## Competitive Advantage Check

- [ ] Our analytics are more detailed than Talkpal's basic streak
- [ ] Users can see per-skill mastery (Talkpal shows nothing)
- [ ] Admin dashboard provides business intelligence (Talkpal has no admin)
- [ ] AI usage transparency (users know what they're using)
- [ ] Health monitoring ensures reliability (Talkpal has outages)

---

*Estimated time: 2-3 hours | Files: ~10 | Priority: High*
