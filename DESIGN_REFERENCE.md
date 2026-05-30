# 🎨 LEARNGERMAN — Design Reference

> **Inspiration:** Talkpal.ai landing page aesthetic
> **Last Updated:** May 29, 2026

---

## Visual Identity

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Primary** | `#6c5ce7` | Buttons, links, active states, primary accents |
| **Primary Dark** | `#5a4bd1` | Hover states on primary elements |
| **Primary Light** | `#a29bfe` | Subtle backgrounds, badges, highlights |
| **Secondary** | `#00cec9` | Success states, secondary accents, progress bars |
| **Background** | `#0a0a0f` | Main page background (dark mode) |
| **Surface** | `#111118` | Cards, panels, sidebars |
| **Surface Hover** | `#1a1a2e` | Card hover state |
| **Border** | `#1e1e30` | Card borders, dividers |
| **Text Primary** | `#f0f0f0` | Headings, primary text |
| **Text Secondary** | `#b0b0b0` | Body text, descriptions |
| **Text Muted** | `#666` | Captions, metadata |
| **Success** | `#6ee7b7` | Correct answers, completed |
| **Warning** | `#fbbf24` | Partial progress, warnings |
| **Error** | `#f87171` | Incorrect answers, errors |

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| **Headings (h1)** | Inter | 2.5–3.5rem | 800–900 |
| **Headings (h2)** | Inter | 1.5–2rem | 700–800 |
| **Headings (h3)** | Inter | 1.1–1.3rem | 600–700 |
| **Body** | Inter | 0.9–1rem | 400 |
| **Small/Code** | JetBrains Mono | 0.8–0.85rem | 400–500 |
| **Badges/Chips** | Inter | 0.75–0.8rem | 600 |

### Spacing System

Based on 4px grid: `4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128`

---

## Landing Page Layout (Talkpal-Inspired)

### Section Structure

```
┌─────────────────────────────────────────────────┐
│                   NAVBAR                         │
│  [Logo]  [Features] [Pricing] [About] [Login]   │
├─────────────────────────────────────────────────┤
│                                                   │
│  1. HERO SECTION                                  │
│  ┌──────────────────────────────────────┐         │
│  │  "Learn German Faster with AI"       │         │
│  │  Subtitle: personalized coach...     │         │
│  │  [Start Learning Free] [Learn More]  │         │
│  │  Language selector dropdown          │         │
│  │  (Default: German)                   │         │
│  └──────────────────────────────────────┘         │
│                                                   │
│  2. STATS BAR                                     │
│  10,000+ Users  │  4.8/5 Rating  │  300+ Lessons  │
│                                                   │
│  3. FEATURES ("The LEARNGERMAN Difference")       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │Struc-│  │AI    │  │Pro-  │  │Tea-  │          │
│  │tured │  │Chat  │  │gress │  │cher  │          │
│  │Cour- │  │Tutor │  │Track-│  │Tools │          │
│  │ses   │  │      │  │ing   │  │      │          │
│  └──────┘  └──────┘  └──────┘  └──────┘          │
│                                                   │
│  4. HOW IT WORKS (3 steps)                        │
│  Step 1: Pick your level (A1-C1)                 │
│  Step 2: Learn with structured lessons           │
│  Step 3: Practice with AI tutor                   │
│                                                   │
│  5. TESTIMONIALS (Scrolling carousel)             │
│  "Finally a German learning app that..."          │
│  — User Name                                      │
│                                                   │
│  6. CTA SECTION                                    │
│  "Start Your German Journey"                      │
│  [Create Free Account — No Credit Card]           │
│                                                   │
│  7. FAQ (Accordion)                               │
│                                                   │
│  8. FOOTER                                        │
│  [Courses] [Company] [Legal] [Social]            │
└─────────────────────────────────────────────────┘
```

### 1. Hero Section

```
┌──────────────────────────────────────────────────────┐
│  ┌─────────────────────┐    ┌──────────────────┐     │
│  │                     │    │                  │     │
│  │  Learn German       │    │  [Mockup of      │     │
│  │  Faster with 🧠 AI  │    │   lesson player  │     │
│  │                     │    │   or dashboard]  │     │
│  │  Your personal AI   │    │                  │     │
│  │  tutor that adapts  │    │                  │     │
│  │  to your level.     │    │                  │     │
│  │                     │    │                  │     │
│  │  [Start Learning]   │    │                  │     │
│  │  [See Courses ▼]    │    │                  │     │
│  │                     │    │                  │     │
│  │  🇩🇪 German selected │    │                  │     │
│  └─────────────────────┘    └──────────────────┘     │
└──────────────────────────────────────────────────────┘
```

**Specs:**
- Left: Text + CTAs, Right: Dashboard/lesson mockup image
- Gradient heading text (primary → secondary)
- Glass-effect CTA buttons with glow on hover
- Subtle animated background (particles or gradient shift)
- Tag: "100% Free — Powered by AI"

### 2. Stats Bar

Clean numbers with labels, centered, with subtle counting animation:
```
⭐ 10,000+ Active Learners   |   📚 300+ Structured Lessons
🎯 A1-C1 CEFR Curriculum     |   🤖 24/7 AI Tutor
```

### 3. Features Section ("The LEARNGERMAN Difference")

Four feature cards in a 2x2 or 4-column grid:

| Card | Icon | Title | Description |
|---|---|---|---|
| 1 | 📚 | Structured Courses | CEFR-aligned A1 to C1 with lessons, exercises, and quizzes |
| 2 | 🤖 | AI Conversation Tutor | Practice speaking anytime with real-time corrections |
| 3 | 📊 | Smart Progress Tracking | See your improvement with detailed analytics and charts |
| 4 | 👩‍🏫 | Teacher Tools (B2B) | Customize the AI, create courses, track your class |

Each card: glass-morphism background, subtle border, icon on top, title, short description, hover lift effect.

### 4. How It Works (3 Steps)

Clean 3-column layout with step numbers:

```
Step 1                    Step 2                    Step 3
🎯 Choose Your Level      📖 Learn & Practice       🤖 Master with AI
Take a placement test     Follow structured         Practice conversation
or pick A1-C1 directly.   lessons with exercises.    with AI feedback.
```

### 5. Testimonials

Carousel/slider with user reviews. Cards with quote, name, and star rating. Auto-scrolls with pause on hover.

### 6. CTA Section

Full-width gradient banner:
```
"Start Speaking German Today"
"It's free, it's fun, and it works."
[Create Free Account →]
"No credit card required • 100% free"
```

### 7. FAQ

Accordion with common questions:
- Is it really free?
- How is this different from Duolingo?
- Do I need a tutor?
- What level will I reach?
- Can teachers use this?

### 8. Footer

4-column layout: Product, Learning (CEFR levels), Company, Language. Social links, copyright.

---

## Component Design Specs

### Cards
- Background: `#111118`
- Border: `1px solid #1e1e30`
- Border-radius: `12px`
- Padding: `1.25rem`
- Hover: `border-color: #3a3a5e`, `transform: translateY(-2px)`, smooth transition
- Box shadow on hover: `0 8px 30px rgba(108, 92, 231, 0.15)`

### Buttons

| Type | Style |
|---|---|
| **Primary** | Gradient bg (`#6c5ce7` → `#5a4bd1`), white text, border-radius 10px, px-6 py-3, font-semibold, hover: brighter, active: scale(0.98) |
| **Secondary** | Transparent bg, border `1px solid #333`, white text, hover: border `#6c5ce7` |
| **Ghost** | Transparent, no border, white text, hover: bg `rgba(108,92,231,0.1)` |

### Input Fields
- Background: `#111118`
- Border: `1px solid #2a2a4e`
- Border-radius: `10px`
- Padding: `0.75rem 1rem`
- Focus: border `#6c5ce7`, ring `rgba(108,92,231,0.3)`
- Placeholder: `#555`

### Animations
- **Page transitions:** Fade + slide up (0.3s)
- **Card hover:** Lift + border glow (0.2s ease)
- **Button hover:** Brightness increase + subtle scale (0.15s)
- **Testimonials:** Auto-scroll (30s loop, pause on hover)
- **Stats count-up:** Animated number increment on scroll into view
- **Hero gradient:** Subtle animated gradient shift
- **Loading skeletons:** Pulse animation

### Layout
- Max content width: `1200px`
- Section spacing: `py-16` to `py-24`
- Responsive breakpoints: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px`
- Mobile: single column, hamburger nav, full-width CTAs

---

## Dark Theme (Default)

The app defaults to dark mode. All colors above are for dark theme. Light theme support is optional (Phase 9).

---

## Key UI Principles (From Talkpal)

1. **Clean and uncluttered** — lots of whitespace, focused layouts
2. **High contrast** — dark backgrounds + bright accent colors
3. **Card-based** — information organized into bounded cards
4. **Social proof visible** — stats and testimonials prominent
5. **Low friction** — clear CTAs, minimal form fields, one primary action per section
6. **Mobile-first** — all sections stack cleanly on mobile
7. **Subtle animations** — polish without being distracting
8. **Glass morphism** — frosted glass effects on cards and navbars

---

## Page-Specific Design Notes

### Home Page (`/`)
- Landing page as described above (Talkpal-inspired)
- Hero section with CTA + language selector
- Not logged in → show landing page
- Logged in → redirect to dashboard

### Dashboard (`/dashboard`)
- Stats cards at top (XP, streak, lessons completed, accuracy)
- Progress charts (Recharts)
- Continue learning card (resume last lesson)
- Quick actions: Practice speaking, Take quiz, Chat with AI
- Recent activity feed

### Course Browser (`/courses`)
- Grid of course cards with level badges
- Filter by level (A1-C1)
- Each card: image, title, level, lesson count, progress bar
- Click → course detail page

### Lesson View (`/lesson/:id`)
- Left: lesson content (vocabulary, grammar, reading)
- Right: exercises sidebar
- Progress indicator at top
- Next/Previous navigation

### AI Chat (`/ai-chat`)
- Full-screen chat interface
- Message bubbles (user right, AI left)
- Input bar at bottom
- Level badge, topic suggestions
- Purple accent for AI messages
