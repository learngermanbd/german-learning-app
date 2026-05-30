# PHASE 16 — Mobile PWA Support (Optional)

> **Competitive Context:** Talkpal is available as a native mobile app. Our PWA provides app-like experience without App Store fees, updates instantly, and works on all devices. Mobile-first design is essential for language learners.

## Objective
Transform the web app into a Progressive Web App (PWA): installable on mobile, offline support, push notifications, and app-like experience. Target: Native app feel without App Store distribution.

## Prerequisites
- Phases 0-10 complete
- App fully functional
- HTTPS required for PWA (service workers)

## Architecture Overview

```
PWA Architecture
─────────────────────────────────────────
┌─────────────────────────────────────────┐
│           PWA COMPONENTS                │
├─────────────────────────────────────────┤
│ Manifest │ Service Worker │ Cache API   │
└────┬─────┴───────┬────────┴─────┬──────┘
     │             │              │
     v             v              v
┌─────────────────────────────────────────┐
│           FEATURES                      │
├─────────────────────────────────────────┤
│ Install │ Offline │ Push │ Background   │
└────┬────┴────┬────┴──┬───┴──────┬──────┘
     │         │       │          │
     v         v       v          v
┌─────────────────────────────────────────┐
│           USER EXPERIENCE               │
├─────────────────────────────────────────┤
│ App-like UI │ Splash Screen │ Home Icon │
└─────────────────────────────────────────┘
```

## Files to Create/Update

### 1. PWA Manifest

**`frontend/public/manifest.json`** — PWA manifest:
```json
{
  "name": "LEARNGERMAN - AI German Learning",
  "short_name": "LEARNGERMAN",
  "description": "Learn German with AI-powered courses, exercises, and conversation practice",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#6c5ce7",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en",
  "categories": ["education", "language"],
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/desktop.png", "sizes": "1920x1080", "type": "image/png", "form_factor": "wide" },
    { "src": "/screenshots/mobile.png", "sizes": "1080x1920", "type": "image/png", "form_factor": "narrow" }
  ],
  "shortcuts": [
    { "name": "AI Chat", "url": "/ai-chat", "icons": [{ "src": "/icons/chat-96x96.png", "sizes": "96x96" }] },
    { "name": "Courses", "url": "/courses", "icons": [{ "src": "/icons/courses-96x96.png", "sizes": "96x96" }] },
    { "name": "Vocabulary", "url": "/vocabulary", "icons": [{ "src": "/icons/vocab-96x96.png", "sizes": "96x96" }] }
  ]
}
```

### 2. Service Worker

**`frontend/public/sw.js`** — Service worker:
```javascript
// Service Worker: sw.js
// Strategy: Cache-first for static assets, Network-first for API
//
// Cache Names:
//   - static-v1: Static assets (HTML, CSS, JS, images)
//   - api-v1: API responses
//   - images-v1: Images and media
//   - fonts-v1: Web fonts
//
// Events:
//   - install: Pre-cache critical assets
//   - activate: Clean old caches
//   - fetch: Serve from cache or network
//
// Caching Strategy:
//   Static assets (/, /assets/*, /icons/*):
//     Cache-first, fallback to network
//   API requests (/api/*):
//     Network-first, fallback to cache (for offline)
//   Images (/images/*, cloudinary URLs):
//     Cache-first with network update
//   Fonts (Google Fonts):
//     Cache-first, long TTL
//
// Offline Fallback:
//   - Cache the app shell (index.html + critical JS/CSS)
//   - Serve cached app shell when offline
//   - Show "You're offline" banner
//   - Queue actions for sync when online
//
// Background Sync:
//   - Queue failed API requests
//   - Retry when connection restored
//   - Sync user progress when online
```

**`frontend/src/utils/registerServiceWorker.js`** — Service worker registration:
```javascript
// Registration logic:
// - Check if service workers are supported
// - Register sw.js on app load
// - Listen for updates (updatefound event)
// - Show "Update available" prompt to user
// - Handle offline/online events
// - Unregister old service workers
// Features:
//   - Auto-register on production only
//   - Skip waiting for new service worker
//   - Notify user of updates
//   - Track registration status
```

### 3. Offline Support

**`frontend/src/utils/offlineManager.js`** — Offline detection and management:
```javascript
// Offline manager:
// - isOnline(): Check current connection status
// - onStatusChange(callback): Listen for online/offline events
// - queueAction(action): Queue action for when online
// - syncQueuedActions(): Process queued actions when online
// - getQueuedCount(): Get number of pending actions
// Features:
//   - Visual indicator (banner/toast) when offline
//   - Queue form submissions (progress, quiz answers)
//   - Queue chat messages
//   - Sync when connection restored
//   - Show "Saved locally" indicator
```

**`frontend/src/components/OfflineBanner.jsx`** — Offline status banner:
```javascript
// Component: OfflineBanner
// Features:
//   - Fixed position at top of screen
//   - Shows when offline: "You're offline. Changes will sync when connected."
//   - Shows when syncing: "Syncing changes..."
//   - Shows queued actions count
//   - Auto-hide when online
//   - Dismissible (stays hidden for session)
// Design: Yellow/orange background, warning icon
```

**`frontend/src/utils/queueSync.js`** — Action queue for offline:
```javascript
// Queue sync utility:
// - addToQueue(action): Add action to queue
//   - { type: 'progress', data: { lessonId, score } }
//   - { type: 'chat', data: { message } }
//   - { type: 'quiz', data: { quizId, answers } }
// - processQueue(): Process all queued actions
// - clearQueue(): Clear processed actions
// - getQueueStatus(): Get queue stats
// Storage: IndexedDB (more storage than localStorage)
// Conflict resolution: Last-write-wins for progress, queue all for chat
```

### 4. Push Notifications

**`backend/src/services/pushNotification.js`** — Push notification service:
```javascript
// Push notification service:
// - subscribe(userId, subscription): Save push subscription
// - unsubscribe(userId): Remove push subscription
// - sendNotification(userId, title, body, data): Send push
// - sendBulkNotification(userIds, title, body, data): Send to many
// - sendDailyReminder(): Send daily learning reminder
// - sendAchievementUnlocked(userId, achievement): Gamification
// - sendStreakWarning(userId, streak): Streak about to break
// Library: web-push (npm package)
// VAPID keys: Generate once, store in env
```

**`backend/src/routes/push.js`** — Push notification API:
```javascript
// Push endpoints:
// POST /api/push/subscribe — Register push subscription
//   - Input: { endpoint, keys: { p256dh, auth } }
//   - Saves subscription for current user
//
// DELETE /api/push/unsubscribe — Unregister push
//
// POST /api/push/test — Send test notification (admin only)
//
// PUT /api/push/preferences — Update notification preferences
//   - Input: { dailyReminder: true, achievements: true, streak: true }
//
// GET /api/push/preferences — Get notification preferences
```

**`frontend/src/utils/pushNotifications.js`** — Push notification client:
```javascript
// Push notification client:
// - requestPermission(): Request notification permission
// - subscribe(): Subscribe to push notifications
// - unsubscribe(): Unsubscribe from push
// - isSubscribed(): Check subscription status
// - getPermission(): Get current permission state
// Features:
//   - Auto-request on first login
//   - Handle notification click (navigate to relevant page)
//   - Handle notification close
//   - Track notification engagement
```

### 5. Install Prompt

**`frontend/src/components/InstallPrompt.jsx`** — PWA install prompt:
```javascript
// Component: InstallPrompt
// Features:
//   - Detect if app is installable
//   - Show install button/banner
//   - Custom install UI (not browser default)
//   - "Add to Home Screen" instructions for iOS (no auto-prompt)
//   - Dismiss and don't show again option
//   - Track install conversion
// Design: Bottom sheet or banner with app icon + "Install" button
```

**`frontend/src/hooks/useInstallPrompt.js`** — Install prompt hook:
```javascript
// Hook: useInstallPrompt
// Returns: { isInstallable, isInstalled, promptInstall, dismiss }
// Features:
//   - Listen for beforeinstallprompt event
//   - Track if app is already installed
//   - Custom install flow
//   - Remember dismissal (don't show again for 7 days)
```

### 6. App Shell & Splash Screen

**`frontend/public/index.html`** — Update for PWA:
```html
<!-- Add to <head>: -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#6c5ce7">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="LEARNGERMAN">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
<!-- Preload critical assets for faster first paint -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/app.css" as="style">
<link rel="preload" href="/assets/app.js" as="script">
```

**`frontend/src/components/SplashScreen.jsx`** — Loading splash screen:
```javascript
// Component: SplashScreen
// Features:
//   - Show while app is loading
//   - LEARNGERMAN logo + loading animation
//   - Fade out when app is ready
//   - Maximum display time: 3 seconds
//   - Don't show on subsequent visits (session storage)
```

### 7. Mobile Optimization

**`frontend/src/styles/mobile.css`** — Mobile-specific styles:
```css
/* Mobile optimizations: */
/* - Touch-friendly tap targets (min 44px) */
/* - Safe area insets for notch phones */
/* - Prevent zoom on input focus */
/* - Smooth scrolling */
/* - Pull-to-refresh gesture */
/* - Swipe gestures for navigation */
/* - Bottom navigation bar */
/* - Full-width buttons on mobile */
/* - Reduced animations for performance */
/* - Dark mode support (prefers-color-scheme) */
```

**`frontend/src/components/MobileNav.jsx`** — Mobile bottom navigation:
```javascript
// Component: MobileNav
// Features:
//   - Fixed bottom bar on mobile
//   - 5 tabs: Home, Courses, AI Chat, Progress, Profile
//   - Active tab indicator
//   - Badge for notifications
//   - Hide on scroll down, show on scroll up
//   - Safe area padding for notch phones
// Design: Glass morphism background, icons + labels
```

**`frontend/src/hooks/useMobile.js`** — Mobile detection hook:
```javascript
// Hook: useMobile
// Returns: { isMobile, isTablet, isDesktop, orientation }
// Features:
//   - Detect device type based on screen width
//   - Detect orientation (portrait/landscape)
//   - Listen for resize events
//   - Touch detection
// Usage: Conditionally render mobile-specific UI
```

### 8. iOS-Specific PWA

**`frontend/public/apple-touch-icon.png`** — Apple touch icon (180x180)

**`frontend/public/screenshots/`** — App Store screenshots:
```
screenshots/
├── desktop.png     (1920x1080)
└── mobile.png      (1080x1920)
```

**iOS PWA meta tags** (in index.html):
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="LEARNGERMAN">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

## Validation Checklist

After completing this phase, verify:

- [ ] Manifest loads: Check DevTools → Application → Manifest
- [ ] Service worker registers: Check DevTools → Application → Service Workers
- [ ] App is installable: Chrome shows install prompt
- [ ] Install works: App appears on home screen
- [ ] Offline mode works: Disable network, app still loads
- [ ] Offline actions queue: Submit form offline, check queue
- [ ] Sync works: Go online, queued actions process
- [ ] Push notifications work: Subscribe, send test notification
- [ ] Notification click works: Click notification, navigates to correct page
- [ ] Splash screen shows: Clear cache, load app
- [ ] Mobile layout works: Test on 375px viewport
- [ ] Touch targets are large enough: 44px minimum
- [ ] No horizontal scroll on mobile
- [ ] iOS PWA works: Test on iPhone Safari

## PWA Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Lighthouse PWA Score | >90 | Lighthouse audit |
| Service Worker Install | <1s | Time to register |
| Cache Hit Rate | >80% | Service worker logs |
| Offline Load Time | <2s | Time to load from cache |
| Install Prompt | <3s | Time from prompt to installed |
| Push Notification Delivery | <5s | Time from send to received |

## Competitive Advantage Check

- [ ] We're installable like Talkpal (but no App Store fees)
- [ ] Works offline (Talkpal requires connection for AI)
- [ ] Updates instantly (no App Store review delay)
- [ ] Works on all devices (Talkpal has separate iOS/Android apps)
- [ ] Smaller footprint than native app (<5MB vs 50MB+)

---

*Estimated time: 3-4 hours | Files: ~10 | Priority: Optional*
