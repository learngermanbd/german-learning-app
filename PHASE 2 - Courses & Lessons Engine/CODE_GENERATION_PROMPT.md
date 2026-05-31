# PHASE 2 — Courses & Lessons Engine

## Objective

Build the complete course and lesson management system. Students can browse courses, view lessons, and track progress. Admins can create, edit, and manage courses/lessons with a rich lesson editor.

## Prerequisites

- Phase 1 complete (DB + Auth working)
- Prisma tables migrated
- Auth middleware working

## Backend Files to Create

### 1. Course Controller (Student-facing)

**`backend/src/controllers/courseController.js`** — Public course API:

- GET /api/courses — List published courses (with pagination, level filter, search)
- GET /api/courses/:id — Get course with lessons list
- GET /api/courses/:id/lessons — Get lessons for a course

### 2. Course Routes

**`backend/src/routes/courses.js`** — Express Router with auth middleware on protected routes.

### 3. Lesson Controller (Student-facing)

**`backend/src/controllers/lessonController.js`** — Add this file:

- GET /api/lessons/:id — Get lesson with exercises and quizzes (auth required)
- POST /api/lessons/:id/complete — Mark lesson as complete (track progress)

### 4. Lesson Routes

**`backend/src/routes/lessons.js`** — Express Router.

### 5. Admin Course Controller

**`backend/src/controllers/admin/courseAdminController.js`** — Full CRUD:

- GET /api/admin/courses — List ALL courses (including unpublished), paginated, searchable
- GET /api/admin/courses/:id — Get course with full lesson details
- POST /api/admin/courses — Create course
- PUT /api/admin/courses/:id — Update course
- DELETE /api/admin/courses/:id — Delete course (cascade lessons?)
- POST /api/admin/courses/:id/publish — Toggle publish status
- PUT /api/admin/courses/reorder — Batch reorder courses

### 6. Admin Course Routes

**`backend/src/routes/admin/courses.js`** — All routes protected by adminAuth middleware.

### 7. Admin Lesson Controller

**`backend/src/controllers/admin/lessonAdminController.js`** — Full CRUD:

- GET /api/admin/lessons — List lessons (filter by course, level, skillArea)
- GET /api/admin/lessons/:id — Get lesson with exercises and quizzes
- POST /api/admin/lessons — Create lesson (with courseId, title, content JSON, level, skillArea, duration, order)
- PUT /api/admin/lessons/:id — Update lesson
- DELETE /api/admin/lessons/:id — Delete lesson
- PUT /api/admin/lessons/reorder — Batch reorder lessons
- POST /api/admin/lessons/ai-generate — Generate lesson with AI (calls LessonAIService, to be fully built in Phase 6)

### 8. Admin Lesson Routes

**`backend/src/routes/admin/lessons.js`** — Protected admin routes.

## Frontend Files to Create

### 9. Course Listing Page

**`frontend/src/pages/Courses.jsx`** — Course catalog:

- Grid of course cards with image, title, level badge, description
- Level filter tabs (A1, A2, B1, B2, C1, All)
- Search bar
- Pagination
- Progress indicator for enrolled courses
- Click → navigates to course detail / lessons
- Dark theme with purple accents

### 10. Lesson View Page

**`frontend/src/pages/Lesson.jsx`** — Lesson player:

- Lesson title, level badge, skill area, duration
- Rich content renderer (parses JSON content structure)
- Progress bar at top
- Navigation: prev/next lesson buttons
- List of exercises at bottom with completion status
- List of quizzes at bottom
- Mark complete button
- Breadcrumb: Course > Lesson

### 11. Frontend Hooks

**`frontend/src/hooks/useCourses.js`** — Custom hook:

- fetchCourses(filters) — GET /api/courses
- fetchCourse(id) — GET /api/courses/:id
- fetchLessons(courseId) — GET /api/courses/:id/lessons
- fetchLesson(id) — GET /api/lessons/:id
- completeLesson(id) — POST /api/lessons/:id/complete

## Admin Panel Files to Create

### 12. Admin Course Pages

**`admin/src/pages/courses/CoursesList.jsx`** — Data table:

- Columns: Title, Level, Lessons count, Published status, Order, Actions
- Search bar, level filter, publish status filter
- Create button → /admin/courses/new
- Edit button → /admin/courses/:id
- Delete with confirmation modal
- Pagination
- Drag-to-reorder (simple up/down buttons)

**`admin/src/pages/courses/CreateCourse.jsx`** — Form:

- Title, description (textarea), level (select A1-C1), image URL, order number
- Validation on submit
- On success → redirect to edit page or list

**`admin/src/pages/courses/EditCourse.jsx`** — Same form with pre-filled data.

### 13. Admin Lesson Pages

**`admin/src/pages/lessons/LessonsList.jsx`** — Table with course filter.

**`admin/src/pages/lessons/CreateLesson.jsx`** — Form:

- Course selector (dropdown)
- Title, level, skill area (select: reading/writing/speaking/hearing/vocabulary/grammar)
- Duration (minutes), order
- Save → creates lesson, redirects to editor

**`admin/src/pages/lessons/EditLesson.jsx`** — Same form pre-filled.

**`admin/src/pages/lessons/LessonEditor.jsx`** — Rich lesson editor with WordPress-style WYSIWYG:

- Section builder (add/remove/reorder content sections)
- Section types: Text, Vocabulary List, Grammar Explanation, Example Dialog, Exercise Reference, Image, Audio
- Each section has title + content
- Preview mode toggle
- Save lesson content as JSON
- AI Generate button (placeholder — will work in Phase 6)

### 13b. HTML Content Editor Component

**`admin/src/components/WYSIWYGEditor.jsx`** — WordPress-style visual content editor:

- **Toolbar:** Bold (B), Italic (I), Underline (U), Heading H1/H2, bullet list, numbered list, link insert, image insert, undo/redo
- **Mode tabs:** Visual, HTML, Preview — toggle between editing modes
- **Visual mode:** Rich text editing with formatting preserved (contenteditable or React Quill)
- **HTML mode:** Monospace textarea showing raw HTML for direct editing
- **Preview mode:** Rendered output as students will see it
- **Content area:** Editable with placeholder text, supports German characters (umlauts, ß)
- **Insert media:** Image upload button, audio file embed for German pronunciation clips
- **Publish flow:** Publish (live) / Save as Draft buttons with confirmation
- **Storage:** Content saved as HTML string in lesson content JSON
- **Responsive:** Toolbar wraps on narrow screens

**`admin/src/api/courseAdminAPI.js`** — Add WYSIWYG content save endpoints:

- PUT /api/admin/lessons/:id/content — Save WYSIWYG content as HTML
- GET /api/admin/lessons/:id/content — Fetch saved HTML content

### 14. Admin Hooks

**`admin/src/hooks/useCourseAdmin.js`** — Custom hook wrapping courseAdminAPI calls.

### 15. Admin API

**`admin/src/api/courseAdminAPI.js`** — Axios calls:

- getCourses(params), getCourse(id), createCourse(data), updateCourse(id, data), deleteCourse(id), reorderCourses(orders)

## Store Updates

**`frontend/src/store/store.js`** — Add courses slice:

```javascript
courses: [],
currentCourse: null,
currentLesson: null,
enrollments: [],
// actions
fetchCourses: async (filters) => { ... },
fetchCourse: async (id) => { ... },
setCurrentLesson: (lesson) => { ... },
enrollCourse: async (courseId) => { ... },
```

## Validation

1. Test all course CRUD endpoints with curl
2. Test all lesson CRUD endpoints with curl
3. Frontend course list renders correctly
4. Lesson player loads lesson content
5. Admin course creation + editing works end-to-end
6. `npm run build` for both frontend
