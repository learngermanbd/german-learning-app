# PHASE 9 — UI Polish & Components Library

## Objective
Polish every UI element with animations, transitions, and micro-interactions. Create a cohesive design system with reusable components. Make the app feel premium and production-quality.

## Prerequisites
- Phases 0-4 complete (basic UI working)
- Tailwind CSS configured
- React Router working

## Design System

### Color Palette
```
Dark Theme (default):
  Background: #0a0a0f (near-black)
  Surface: #111118 (dark card)
  Surface Hover: #1c1c2e
  Primary: #6c5ce7 (purple)
  Primary Light: #a29bfe
  Accent: #00cec9 (teal)
  German Red: #DD0000 (flag accent)
  German Gold: #FFCC00 (flag accent)
  Success: #00b894 (green)
  Warning: #fdcb6e (yellow)
  Error: #e17055 (red)
  Text Primary: #f0f0f0
  Text Secondary: #a0a0b0
  Border: #2d2d3d
```

### Typography
- Font: Inter (Google Fonts)
- Scale: 12/14/16/18/20/24/30/36/48px
- Headings: font-bold, tracking-tight
- Body: font-normal, leading-relaxed
- German text: slightly larger line-height for umlauts

### Spacing
- 4px base unit
- Consistent padding: p-4 (cards), p-6 (sections), p-8 (pages)
- Gap: gap-4 (grid items), gap-6 (sections)

### Border Radius
- Cards: rounded-xl (12px)
- Buttons: rounded-lg (8px)
- Inputs: rounded-lg (8px)
- Badges: rounded-full
- Modals: rounded-2xl (16px)

### Shadows
- Card: shadow-lg with colored tint
- Modal: shadow-2xl with backdrop blur
- Dropdown: shadow-xl
- Button hover: shadow-md with primary tint

## Files to Create/Update

### 1. Global Styles Update

**`frontend/src/index.css`** — Complete design system:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg: #0a0a0f;
    --surface: #141420;
    --surface-hover: #1c1c2e;
    --primary: #6c5ce7;
    --primary-light: #a29bfe;
    --accent: #00cec9;
    --success: #00b894;
    --warning: #fdcb6e;
    --error: #e17055;
    --text: #ffffff;
    --text-secondary: #a0a0b0;
    --border: #2d2d3d;
    --radius: 12px;
  }
}

@layer components {
  /* Glass morphism card */
  .glass-card {
    @apply bg-[var(--surface)] border border-[var(--border)] rounded-xl backdrop-blur-sm;
  }
  
  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent;
  }
  
  /* Glow effect */
  .glow {
    box-shadow: 0 0 20px rgba(108, 92, 231, 0.3);
  }
  
  /* Animated button */
  .btn-primary {
    @apply px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] 
           text-white font-semibold rounded-lg transition-all duration-300
           hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:scale-[1.02]
           active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  /* Input styling */
  .input-field {
    @apply w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg
           text-white placeholder-[var(--text-secondary)] transition-all duration-200
           focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20;
  }
}
```

### 2. Navbar Component

**`frontend/src/components/Navbar.jsx`** — Premium navigation:
- Fixed top with backdrop-blur glass effect
- Logo: "🇩🇪 LearnGerman" with gradient text
- Nav links: Home, Courses, Dashboard, AI Chat (with active indicator)
- Right side: level badge, profile avatar (initials), notification bell
- Mobile: hamburger menu with slide-in drawer
- Smooth scroll behavior
- Transition on scroll (hide/show based on scroll direction)
- Dropdown menu for profile

### 3. Footer Component

**`frontend/src/components/Footer.jsx`** — Clean footer:
- Links: About, Privacy, Terms, Contact
- Copyright with current year
- German flag emoji + "LearnGerman" branding
- Social media icons (placeholder)
- Minimal, border-top only

### 4. Animated Components

**`frontend/src/components/AnimatedCard.jsx`** — Reusable animated card:
- Fade-in on scroll (Intersection Observer)
- Hover: subtle lift + glow border
- Click ripple effect
- Skeleton loading state
- Props: title, children, className, onClick, loading

**`frontend/src/components/LoadingSpinner.jsx`** — Loading states:
- Spinning circle with gradient
- Skeleton blocks for content loading
- Full-page loader with German flag colors
- Sizes: sm, md, lg

**`frontend/src/components/Modal.jsx`** — Modal component:
- Backdrop with blur effect
- Scale-in animation on open
- Smooth close animation
- Click outside to close
- Escape key to close
- Sizes: sm, md, lg, fullscreen
- Header, body, footer slots
- Transition group for enter/exit

### 5. Home Page Redesign (Talkpal.ai Inspired)

**`frontend/src/pages/Home.jsx`** — Full landing page redesign following the Talkpal-inspired layout from `DESIGN_REFERENCE.md`:

**Sections (top to bottom):**

1. **Navbar** — Fixed top, glass-morphism (backdrop-blur), logo with gradient text "🇩🇪 LearnGerman", nav links (Home, Courses, AI Chat, Pricing), auth buttons (Login / Sign Up). Mobile: hamburger drawer.

2. **Hero Section** — Two-column layout:
   - Left: Large gradient heading "Learn German Faster with AI", descriptive subtitle, two CTA buttons ("Start Learning Free" primary gradient, "See Courses" outlined secondary), language selector showing "🇩🇪 German" selected
   - Right: Mockup/illustration placeholder (dashboard preview or lesson player image)
   - Background: subtle animated gradient or particle effect
   - Countdown/urgency element (optional): "Free — No credit card needed"

3. **Stats Bar** — Centered row of statistics with counting animation on scroll:
   - "10,000+ Active Learners"
   - "300+ Structured Lessons"
   - "A1-C1 CEFR Curriculum"
   - "4.8/5 User Rating"

4. **Features Section** ("The LEARNGERMAN Difference") — 4 glass-morphism cards in a grid:
   - 📚 **Structured Courses** — CEFR-aligned A1 to C1 with lessons, exercises, and quizzes
   - 🤖 **AI Conversation Tutor** — Practice speaking anytime with real-time corrections
   - 📊 **Smart Progress Tracking** — See your improvement with detailed analytics and charts
   - 👩‍🏫 **Teacher Tools (B2B)** — Customize the AI, create courses, track your class
   - Each card: glass bg (#111118), border (#1e1e30), rounded-xl (12px), hover lift + glow effect

5. **How It Works** — 3-column step walkthrough:
   - Step 1: 🎯 Choose Your Level (placement test or pick A1-C1)
   - Step 2: 📖 Learn & Practice (structured lessons with exercises)
   - Step 3: 🤖 Master with AI (conversation practice with AI feedback)

6. **Testimonials** — Auto-scrolling carousel with user review cards:
   - Card with quote, name, star rating
   - Smooth horizontal scroll (30s loop, pauses on hover)
   - Gradient fade on edges

7. **CTA Section** — Full-width gradient banner (no urgency timers — LEARNGERMAN is genuinely free):
   - "Start Speaking German Today"
   - "It's free, it's fun, and it works."
   - [Create Free Account →] button
   - "No credit card required • 100% free"

8. **FAQ** — Accordion-style with common questions:
   - Is it really free?
   - How is this different from Duolingo / Talkpal?
   - Do I need a tutor?
   - What level will I reach?
   - Can teachers use this?

9. **Footer** — 4-column layout:
   - Product (Features, Pricing, AI Chat, Courses)
   - Learning (A1, A2, B1, B2, C1 Levels)
   - Company (About, Blog, Contact, Privacy)
   - Language selection + Social links

**Design specs:** Dark theme (#0a0a0f bg), purple primary (#6c5ce7), glass-morphism cards, Inter font, responsive (stacks to single column on mobile), subtle animations throughout. See `DESIGN_REFERENCE.md` for complete color palette, spacing, and component specs.

### 6. Page Transition Animations

**`frontend/src/App.jsx`** — Add page transitions:
- Wrap routes with AnimatePresence (framer-motion)
- Page enter: fade in + slide up (0.3s)
- Page exit: fade out + scale down (0.2s)
- Route change loader

### 7. Micro-interactions

Add these throughout the app:
- Button hover: scale 1.02 + shadow glow
- Card hover: translateY(-2px) + border glow
- Input focus: border color transition + ring glow
- Badge: pulse animation on new content
- Notification dot: pulse animation
- Loading skeleton: shimmer gradient animation
- Progress bars: animated fill on load
- Score display: count-up animation
- Streak flame: flickering animation

### 8. Mobile Responsiveness

Ensure all pages are fully responsive:
- Navbar: hamburger menu on mobile (< 768px)
- Course grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Dashboard stats: stacked (mobile) → 2x2 grid (tablet) → row (desktop)
- AI Chat: full screen on mobile, sidebar on desktop
- Admin panel: collapsible sidebar on mobile
- Touch-friendly buttons (min 44px)
- Smooth scrolling on iOS
- Safe area insets for notched devices

### 9. Dark/Light Theme Toggle

**`frontend/src/components/ThemeToggle.jsx`** — Theme switcher:
- Sun/Moon icon toggle
- Smooth transition between themes (0.3s)
- Persists preference in localStorage
- Respects system preference (prefers-color-scheme)
- Applied via Tailwind dark mode class strategy

### 10. Toast Notification System

**`frontend/src/components/Toast.jsx`** — Notification system:
- Position: bottom-right
- Types: success (green), error (red), warning (yellow), info (blue)
- Auto-dismiss (3-5s)
- Stack multiple toasts
- Slide-in animation
- Close button
- Zustand store for toast state

## Admin Panel Polish

Apply the same design system to the admin panel:
- **`admin/src/index.css`** — Same design tokens (adjust primary to indigo #4f46e5)
- **`admin/src/components/Sidebar.jsx`** — Collapsible sidebar with icons, active indicator, smooth transitions
- **`admin/src/components/TopBar.jsx`** — Breadcrumbs, search, notifications, admin avatar
- **`admin/src/components/DataTable.jsx`** — Sortable columns, search, pagination, row hover highlight, bulk selection
- **`admin/src/components/Modal.jsx`** — Same as frontend modal
- **`admin/src/components/FormBuilder.jsx`** — Form components with validation, error states, loading states

### Main Website Page Editor (Admin)

A full page builder for editing the public-facing website pages (Home, About, Features, Pricing, FAQ, Contact, Footer) from the admin panel — no code changes needed.

#### Admin Pages

**`admin/src/pages/website-editor/WebsitePagesList.jsx`** — Page tree view:
- List of all public website pages with order, status (published/draft), last edited
- Page tree: visual hierarchy showing parent/child page relationships
- Status indicators: green dot (published), orange dot (draft), gray (hidden)
- Quick actions per page: Edit, Toggle Publish, Preview
- Create New Page button → opens empty editor
- Search/filter pages by name

**`admin/src/pages/website-editor/WebsitePageEditor.jsx`** — Full page editor:
- **Left sidebar — Page Tree:** 130px collapsible panel listing all pages with active state highlighting and status dots
- **Center — Section Canvas:** Visual editor where page sections can be added, removed, and reordered:
  - **Hero Block:** Full-width gradient heading with subtitle, CTA buttons, background color/image selector
  - **Text + Image Block:** Two-column layout with rich text left side and image placeholder right side
  - **Features Grid Block:** 3-column grid with title, description, and icon per feature card
  - **CTA Block:** Single call-to-action with heading, description, and button
  - **FAQ Block:** Accordion-style list with question/answer pairs
  - **Footer Block:** Multi-column layout with link groups
- Each block has actions: ↑ (move up), ↓ (move down), ✏️ (edit), 🗑️ (delete)
- Drag handles for reordering section blocks (visual feedback: highlight on drag over)
- **Right panel — SEO Settings:**
  - Meta Title (input, character counter)
  - Meta Description (textarea, character counter)
  - URL Slug (auto-generated from page name, editable)
  - Auto-save note: "Changes are saved as drafts automatically"
- Publish / Save Draft buttons at top
- Preview button → opens page in new tab with current editor state

**`admin/src/pages/website-editor/SectionBuilder.jsx`** — Reusable section block editor:
- Block type selector (Hero, Text+Image, Features Grid, CTA, FAQ, Footer)
- Per-block field editor (title, description, image URL, button text, etc.)
- Block preview rendered in real-time
- Duplicate block action

#### Backend API

**`backend/src/controllers/admin/websiteController.js`** — Page management:
- GET /api/admin/website/pages — List all pages with status, order, last edited
- GET /api/admin/website/pages/:id — Get page with all sections and SEO data
- POST /api/admin/website/pages — Create new page
- PUT /api/admin/website/pages/:id — Update page (saves as draft)
- PUT /api/admin/website/pages/:id/publish — Toggle publish status
- PUT /api/admin/website/pages/reorder — Batch reorder pages
- DELETE /api/admin/website/pages/:id — Delete page
- GET /api/admin/website/pages/:id/preview — Get rendered preview HTML

**`backend/src/routes/admin/website.js`** — Protected admin routes.

**`backend/src/prisma/schema.prisma`** — Add WebsitePage model:
```prisma
model WebsitePage {
  id            String   @id @default(cuid())
  title         String   // e.g. "Home", "About Us"
  slug          String   @unique // e.g. "/", "/about"
  description   String?
  status        String   @default("draft") // draft | published | hidden
  order         Int      @default(0)
  content       Json     // array of section blocks [{ type, fields }]
  metaTitle     String?
  metaDesc      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  publishedAt   DateTime?
  createdBy     String
}
```

#### Store Updates

**`admin/src/store/adminDataStore.js`** — Add website editor state:
```javascript
websiteEditor: {
  pages: [],
  currentPage: null,
  currentSections: [],
  isDirty: false,
  // actions
  fetchPages: async () => { ... },
  fetchPage: async (id) => { ... },
  savePage: async (id, data) => { ... },
  publishPage: async (id) => { ... },
  addSection: (type) => { ... },
  removeSection: (index) => { ... },
  reorderSections: (from, to) => { ... },
}
```

#### API Client

**`admin/src/api/websiteAdminAPI.js`** — Axios calls:
- getPages(), getPage(id), createPage(data), updatePage(id, data), publishPage(id), deletePage(id), reorderPages(orders), previewPage(id)

## Framer Motion Setup

**`frontend/package.json`** — Add framer-motion dependency if not present.

## Validation
1. All animations work smoothly (no jank)
2. Mobile responsive: test at 375px, 768px, 1024px, 1440px
3. Dark/light theme toggle works across all pages
4. Page transitions are smooth
5. Toast notifications appear and auto-dismiss
6. Loading skeletons display correctly
7. Hover effects work on all interactive elements
8. Admin panel matches the same quality
9. `npm run build` succeeds
