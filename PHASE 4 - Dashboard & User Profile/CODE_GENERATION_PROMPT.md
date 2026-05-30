# PHASE 4 — Dashboard & User Profile

## Objective
Build comprehensive student dashboard with progress analytics, learning streaks, and profile management. Create admin analytics dashboard with charts and reports.

## Prerequisites
- Phase 3 complete (Exercises + Quizzes working with progress tracking)
- UserProgress table has data to display

## Backend Files to Create/Update

### 1. Progress Controller (update if exists)

**`backend/src/controllers/progressController.js`** — Add:
- GET /api/progress/dashboard — Full dashboard stats:
  - Total exercises completed
  - Average score
  - Courses in progress
  - Completed courses
  - Current streak (consecutive days with activity)
  - Total learning time (sum of lesson durations completed)
  - Level progress (XP toward next level)
  - Recent activity (last 10 submissions)
- GET /api/progress/streak — Current streak data
- GET /api/progress/level — Level and XP info

### 2. Enrollment Controller

**`backend/src/controllers/enrollmentController.js`** — User + Course:
- POST /api/courses/:id/enroll — Enroll in a course
- GET /api/courses/enrolled — Get user's enrolled courses with progress
- DELETE /api/courses/:id/enroll — Unenroll

### 3. Enrollment Routes

**`backend/src/routes/enrollments.js`** — Express Router.

### 4. Admin Analytics Controller

**`backend/src/controllers/admin/analyticsController.js`** — Admin analytics:
- GET /api/admin/analytics/dashboard — Overall stats (total users, courses, lessons, exercises, active users today)
- GET /api/admin/analytics/users — User growth over time, level distribution, active users
- GET /api/admin/analytics/courses — Course popularity, completion rates, average scores
- GET /api/admin/analytics/engagement — Daily active users, submissions over time, avg session duration
- GET /api/admin/analytics/report — Generate period report (daily/weekly/monthly)

### 5. Admin Analytics Routes

**`backend/src/routes/admin/analytics.js`** — Protected routes.

## Frontend Files to Create

### 6. Dashboard Page

**`frontend/src/pages/Dashboard.jsx`** — Student dashboard:
- Welcome message with user name
- Stats cards row:
  - Courses in Progress (with progress bars)
  - Exercises Completed (number)
  - Average Score (percentage with color)
  - Current Streak (days with flame icon)
- Course progress grid (cards with circular progress indicators)
- Recent activity feed (last 10 exercises/quizzes with scores)
- Quick action buttons: Continue Learning, Practice Speaking, AI Chat
- XP bar showing progress to next level
- Weekly activity mini-chart (bars for each day)

### 7. Profile Page

**`frontend/src/pages/Profile.jsx`** — User profile:
- Avatar/initials display
- Name, email, native language (editable)
- Current level (A1-C1) with progress to next level
- Account creation date
- Edit profile form (name, native language)
- Change password form (current password, new password, confirm)
- Language statistics:
  - Total words learned
  - Grammar points mastered
  - Hours spent learning
  - Quizzes passed

### 8. ProgressChart Component

**`frontend/src/components/ProgressChart.jsx`** — Reusable chart:
- Uses Recharts
- Types: Line (progress over time), Bar (daily activity), Radar (skill breakdown)
- Configurable colors, size, labels
- Dark theme compatible

## Admin Panel Files to Create

### 9. Admin Dashboard

**`admin/src/pages/AdminDashboard.jsx`** — Admin overview:
- Stats cards: Total Users, Active Courses, Total Lessons, Today's Activity
- Recent registrations list
- Popular courses chart (bar chart)
- User growth chart (line chart — last 30 days)
- Quick actions: Add Course, View Users, AI Training

### 10. User Analytics Page

**`admin/src/pages/analytics/UserAnalytics.jsx`** — User analytics:
- User growth chart (daily/weekly/monthly)
- Level distribution pie chart
- Active vs. inactive users
- New users this period

### 11. Course Analytics Page

**`admin/src/pages/analytics/CourseAnalytics.jsx`** — Course analytics:
- Courses ranked by enrollment
- Completion rates per course
- Average scores per course
- Lesson completion funnel

### 12. Engagement Report Page

**`admin/src/pages/analytics/EngagementReport.jsx`** — Engagement:
- Daily active users chart
- Submissions over time
- Average session duration
- Period selector (7d, 30d, 90d)

### 13. Charts Component

**`admin/src/components/Charts.jsx`** — Reusable admin chart:
- Line, Bar, Pie, Doughnut variants
- Uses recharts
- Dark theme styling
- Responsive

### 14. Admin Analytics API

**`admin/src/api/analyticsAPI.js`** — Axios calls for all analytics endpoints.

## Store Updates

**`frontend/src/store/store.js`** — Add progress slice:
```javascript
stats: {
  totalExercises: 0,
  averageScore: 0,
  coursesInProgress: 0,
  completedCourses: 0,
  streak: 0,
  totalLearningTime: 0,
  levelProgress: 0,
  recentActivity: []
},
enrolledCourses: [],
// actions
fetchDashboard: async () => { ... },
fetchEnrolledCourses: async () => { ... },
enrollCourse: async (courseId) => { ... },
updateProfile: async (data) => { ... },
```

**`admin/src/store/adminDataStore.js`** — Create for admin analytics data management.

## Validation
1. Dashboard shows correct stats after completing exercises
2. Profile updates work (name, password)
3. Streak calculation works (daily activity)
4. Enrollment flow: enroll → see progress → unenroll
5. Admin analytics show real data from DB
6. Charts render correctly
7. `npm run build` for all apps
