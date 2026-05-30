# PHASE 11 — Performance Optimization

> **Competitive Context:** Talkpal users complain about slow load times and laggy conversations. Our app must feel instant — fast initial load, smooth transitions, and responsive interactions. Performance is a competitive advantage.

## Objective
Optimize the application for maximum performance: fast initial load, smooth animations, efficient data fetching, and minimal bundle size. Target: Lighthouse score >90 on all metrics.

## Prerequisites
- Phases 0-10 complete
- App fully functional with all features
- Access to browser DevTools for profiling

## Architecture Overview

```
Performance Optimization Layers
─────────────────────────────────────────
Layer 1: Bundle Optimization
  ├── Code splitting (route-based)
  ├── Tree shaking (remove dead code)
  ├── Dynamic imports (lazy load heavy components)
  └── Bundle analysis (identify bloat)

Layer 2: Loading Strategy
  ├── Lazy load routes (React.lazy + Suspense)
  ├── Prefetch critical resources
  ├── Optimize images (WebP, responsive sizes)
  └── Preload key fonts

Layer 3: Runtime Performance
  ├── React.memo (prevent re-renders)
  ├── useMemo/useCallback (expensive computations)
  ├── Virtual scrolling (long lists)
  └── Debounce/throttle (user inputs)

Layer 4: Caching Strategy
  ├── API response caching (React Query/SWR)
  ├── Static asset caching (Cache-Control headers)
  ├── Service worker caching (offline support)
  └── Browser cache optimization

Layer 5: Backend Optimization
  ├── Database query optimization (indexes, N+1 prevention)
  ├── Response compression (gzip/brotli)
  ├── Connection pooling
  └── API response pagination
```

## Files to Create/Update

### 1. Frontend — Bundle Optimization

**`frontend/vite.config.js`** — Update with performance optimizations:
```javascript
// Add to existing vite.config.js:
// - manualChunks: Split vendor libraries into separate chunks
// - build.rollupOptions.output.manualChunks:
//   - 'react-vendor': ['react', 'react-dom', 'react-router-dom']
//   - 'ui-vendor': ['@headlessui/react', 'react-icons']
//   - 'chart-vendor': ['recharts']
//   - 'state-vendor': ['zustand']
// - build.rollupOptions.output.chunkFileNames: 'assets/[name]-[hash].js'
// - build.cssCodeSplit: true
// - build.sourcemap: false (production)
```

**`frontend/src/utils/lazyRoutes.js`** — Route-based code splitting:
```javascript
// Lazy load all route components:
// - Dashboard: React.lazy(() => import('../pages/Dashboard'))
// - Courses: React.lazy(() => import('../pages/Courses'))
// - CourseDetail: React.lazy(() => import('../pages/CourseDetail'))
// - LessonView: React.lazy(() => import('../pages/LessonView'))
// - AIChat: React.lazy(() => import('../pages/AIChat'))
// - SpeakingPractice: React.lazy(() => import('../pages/SpeakingPractice'))
// - WritingExercise: React.lazy(() => import('../pages/WritingExercise'))
// - VocabularyDrills: React.lazy(() => import('../pages/VocabularyDrills'))
// - Profile: React.lazy(() => import('../pages/Profile'))
// - Quiz: React.lazy(() => import('../pages/Quiz'))
// Export: { lazyRoutes object, LazyLoadWrapper component with Suspense + LoadingSpinner }
```

**`frontend/src/components/LoadingSpinner.jsx`** — Skeleton loading states:
```javascript
// Component: LoadingSpinner
// Props: { type: 'page' | 'card' | 'skeleton', size?: 'sm' | 'md' | 'lg' }
// Types:
//   - page: Full-page loading spinner with pulse animation
//   - card: Skeleton card with animated placeholder lines
//   - skeleton: Generic skeleton with customizable width/height
// Use CSS animation: pulse effect with gradient background
// Match Tailwind colors: bg-gray-200 dark:bg-gray-700
```

**`frontend/src/hooks/useVirtualScroll.js`** — Virtual scrolling for long lists:
```javascript
// Hook: useVirtualScroll
// Params: { items: any[], itemHeight: number, containerHeight: number, overscan?: number }
// Returns: { visibleItems, totalHeight, scrollTop, handleScroll, containerRef }
// Use for: Course lists, lesson lists, chat history, vocabulary lists
// Performance: Only renders visible items + overscan buffer
```

**`frontend/src/components/MemoizedCard.jsx`** — Prevent unnecessary re-renders:
```javascript
// Component: MemoizedCourseCard, MemoizedLessonCard, MemoizedExerciseCard
// Use React.memo with custom comparison function
// Compare: id, title, progress, lastModified
// Use useMemo for computed values (progress percentage, formatted dates)
// Use useCallback for event handlers (onClick, onComplete)
```

### 2. Frontend — Image Optimization

**`frontend/src/utils/imageOptimizer.js`** — Image optimization utilities:
```javascript
// Utility functions:
// - getOptimizedImageUrl(url, width, quality): Generate responsive image URLs
// - getWebPUrl(url): Convert image URL to WebP format
// - getImageDimensions(url): Get image dimensions for aspect ratio
// - preloadImage(url): Preload critical images
// Integration with Cloudinary for automatic format conversion
// Default quality: 80, supported formats: webp, avif, png, jpg
```

**`frontend/src/components/OptimizedImage.jsx`** — Lazy loading image component:
```javascript
// Component: OptimizedImage
// Props: { src, alt, width, height, className, lazy?: boolean, priority?: boolean }
// Features:
//   - IntersectionObserver for lazy loading (load when 100px from viewport)
//   - Blur placeholder while loading (use tiny base64 preview)
//   - Responsive srcSet for different screen sizes
//   - WebP format with fallback
//   - Priority loading for above-the-fold images (hero, course thumbnails)
```

### 3. Frontend — Caching Layer

**`frontend/src/hooks/useApiCache.js`** — API response caching:
```javascript
// Hook: useApiCache
// Params: { key: string, fetcher: () => Promise, ttl?: number, staleWhileRevalidate?: boolean }
// Returns: { data, error, isLoading, isValidating, mutate }
// Features:
//   - Cache responses in memory with configurable TTL (default: 5 minutes)
//   - stale-while-revalidate: show cached data, fetch fresh in background
//   - Deduplicate concurrent requests with same key
//   - Manual cache invalidation via mutate()
//   - Persist critical data to localStorage (user profile, course progress)
```

**`frontend/src/utils/cacheConfig.js`** — Cache configuration:
```javascript
// Cache configuration:
// - defaultTTL: 5 * 60 * 1000 (5 minutes)
// - staleWhileRevalidate: true
// - persistToLocalStorage: ['userProfile', 'courseProgress', 'settings']
// - cacheKeys: { courses: 'courses', lessons: 'lessons', progress: 'progress', ... }
// - invalidationRules: { onLogout: clearAll, onEnrollment: invalidateCourses, ... }
```

### 4. Backend — Database Optimization

**`backend/src/utils/queryOptimizer.js`** — Query optimization utilities:
```javascript
// Utility functions:
// - addPagination(query, page, limit): Add pagination with总数
// - selectFields(query, fields): Only select needed fields (avoid SELECT *)
// - includeRelations(query, relations): Eager load relations (prevent N+1)
// - addIndexes(model, fields): Add database indexes for frequent queries
// - batchInsert(model, data): Batch insert for bulk operations
// - explainQuery(query): Log query execution plan (development only)
```

**`backend/src/prisma/migrations/performance_indexes.sql`** — Database indexes:
```sql
-- Add indexes for frequently queried fields:
-- CREATE INDEX idx_courses_level ON Course(level);
-- CREATE INDEX idx_courses_published ON Course(isPublished);
-- CREATE INDEX idx_lessons_courseId ON Lesson(courseId);
-- CREATE INDEX idx_lessons_level ON Lesson(level);
-- CREATE INDEX idx_exercises_lessonId ON Exercise(lessonId);
-- CREATE INDEX idx_quiz_attempts_userId ON QuizAttempt(userId);
-- CREATE INDEX idx_user_progress_userId ON UserProgress(userId);
-- CREATE INDEX idx_chat_history_userId ON ChatHistory(userId);
-- CREATE INDEX idx_chat_history_createdAt ON ChatHistory(createdAt);
-- CREATE INDEX idx_enrollments_userId ON Enrollment(userId);
-- CREATE INDEX idx_enrollments_courseId ON Enrollment(courseId);
```

**`backend/src/middleware/compression.js`** — Response compression:
```javascript
// Middleware: compression
// Use gzip/brotli compression for API responses
// Configuration:
//   - threshold: 1024 (only compress responses > 1KB)
//   - level: 6 (balanced speed/compression)
//   - filter: Skip compression for images (already compressed)
// Integration: app.use(compression()) in index.js
```

### 5. Backend — Pagination & Optimization

**`backend/src/utils/pagination.js`** — Standardized pagination:
```javascript
// Middleware/Utility: paginate
// Usage: router.get('/courses', paginate, controller.getAll)
// Features:
//   - Parse ?page=1&limit=20 from query string
//   - Default: page=1, limit=20, maxLimit=100
//   - Return: { data: [], pagination: { page, limit, total, totalPages, hasNext, hasPrev } }
//   - Apply to all list endpoints (courses, lessons, users, etc.)
```

**`backend/src/utils/responseCache.js`** — API response caching:
```javascript
// Middleware: responseCache
// Configuration:
//   - TTL: 60 seconds default, configurable per route
//   - Cache key: method + URL + userId (for authenticated routes)
//   - Invalidation: POST/PUT/DELETE invalidate related caches
//   - Storage: In-memory Map (development), Redis (production)
// Usage: router.get('/courses', responseCache(300), controller.getAll)
```

### 6. Performance Monitoring

**`frontend/src/hooks/usePerformanceMonitor.js`** — Core Web Vitals tracking:
```javascript
// Hook: usePerformanceMonitor
// Tracks: LCP, FID, CLS, FCP, TTFB
// Reports to analytics endpoint (Phase 13) or console.log (development)
// Features:
//   - reportWebVitals(callback): Send metrics to analytics
//   - measureComponentRender(componentName, renderFn): Measure render time
//   - trackInteraction(name, startTime): Track user interaction duration
```

**`backend/src/middleware/requestTimer.js`** — API response time tracking:
```javascript
// Middleware: requestTimer
// Logs: method, URL, response time, status code
// Format: [PERF] POST /api/courses - 245ms - 200
// Store slow requests (>1000ms) in database for analysis
// Integration: app.use(requestTimer) in index.js
```

## Validation Checklist

After completing this phase, verify:

- [ ] Frontend build produces optimized chunks (check dist/ folder sizes)
- [ ] Code splitting works: each route loads its own chunk
- [ ] Images use lazy loading (check Network tab)
- [ ] API responses are compressed (check Content-Encoding header)
- [ ] Database queries have proper indexes (check query plans)
- [ ] Lighthouse Performance score >90
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] Time to Interactive <3s
- [ ] Bundle size <500KB gzipped (excluding images)

## Performance Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Lighthouse Performance | >90 | Chrome DevTools → Lighthouse |
| First Contentful Paint | <1.5s | Lighthouse, Web Vitals |
| Largest Contentful Paint | <2.5s | Lighthouse, Web Vitals |
| Cumulative Layout Shift | <0.1 | Lighthouse, Web Vitals |
| Time to Interactive | <3s | Lighthouse, Web Vitals |
| Total Bundle Size | <500KB gzip | `npx vite-bundle-visualizer` |
| API Response Time (p95) | <200ms | Backend logs, monitoring |
| Database Query Time (p95) | <50ms | Prisma query logging |

## Competitive Advantage Check

- [ ] Our app loads faster than Talkpal's web app
- [ ] Smooth 60fps animations (Talkpal users report lag)
- [ ] Works well on slow connections (optimistic updates, caching)
- [ ] Minimal data usage (compressed responses, efficient images)
- [ ] Feels instant after first load (caching, prefetching)

---

*Estimated time: 3-4 hours | Files: ~15 | Priority: High*
