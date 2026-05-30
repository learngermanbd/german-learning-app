# PHASE 3 — Exercises & Quizzes Engine

## Objective
Build the exercise and quiz systems supporting multiple question types, scoring, timers, and progress tracking. Students can complete exercises and quizzes with immediate feedback. Admins can create/manage exercises and quizzes.

## Prerequisites
- Phase 2 complete (Courses + Lessons working)
- Lesson model has exercises and quizzes relations

## Backend Files to Create

### 1. Exercise Controller

**`backend/src/controllers/exerciseController.js`** — Student exercise API:
- GET /api/exercises/:id — Get exercise details (question, options, type)
- POST /api/exercises/:id/submit — Submit answer, get AI feedback if applicable
- GET /api/exercises/lesson/:lessonId — Get all exercises for a lesson

### 2. Exercise Routes

**`backend/src/routes/exercises.js`** — Express Router.

### 3. Quiz Controller

**`backend/src/controllers/quizController.js`** — Student quiz API:
- GET /api/quizzes/:id — Get quiz details (questions, timeLimit)
- POST /api/quizzes/:id/start — Start quiz attempt, returns attempt ID
- POST /api/quizzes/:id/submit — Submit all answers, auto-grade, return score
- GET /api/quizzes/:id/attempts — Get user's past attempts

### 4. Quiz Routes

**`backend/src/routes/quizzes.js`** — Express Router.

### 5. Progress Controller

**`backend/src/controllers/progressController.js`** — Progress tracking:
- GET /api/progress — Get user's overall progress (completed exercises, scores, streaks)
- GET /api/progress/course/:courseId — Progress in specific course
- GET /api/progress/lesson/:lessonId — Progress in specific lesson

### 6. Progress Routes

**`backend/src/routes/progress.js`** — Express Router (all auth-protected).

### 7. Admin Exercise Controller

**`backend/src/controllers/admin/exerciseAdminController.js`** — Full CRUD:
- GET /api/admin/exercises — List exercises (filter by lesson, type)
- GET /api/admin/exercises/:id — Get exercise
- POST /api/admin/exercises — Create exercise with type-specific question/answer structure
- PUT /api/admin/exercises/:id — Update exercise
- DELETE /api/admin/exercises/:id — Delete exercise
- PUT /api/admin/exercises/reorder — Batch reorder
- POST /api/admin/exercises/ai-generate — Generate exercises with AI

### 8. Admin Exercise Routes

**`backend/src/routes/admin/exercises.js`** — Protected admin routes.

### 9. Admin Quiz Controller

**`backend/src/controllers/admin/quizAdminController.js`** — Full CRUD (similar structure to exercises).

### 10. Admin Quiz Routes

**`backend/src/routes/admin/quizzes.js`** — Protected routes.

## Question Types to Support

### Exercise Types:
1. **fillBlank** — Sentence with blank, user types answer
2. **multipleChoice** — Question with 4 options, one correct
3. **matching** — Two columns, match items (word ↔ translation)
4. **dragDrop** — Order words to form a sentence
5. **writing** — Free-form writing prompt
6. **grammarFillBlank** — Fill in the correct article, verb conjugation, or adjective ending in context
7. **grammarConjugation** — Conjugate the given verb in the correct tense (Präsens, Perfekt, Präteritum, etc.)
8. **articleSelection** — Choose the correct article (der/die/das/den/dem/des) for the noun in context

### Quiz Question Types:
1. **multipleChoice** — Standard MCQ
2. **trueFalse** — True or false statements
3. **fillBlank** — Context-based fill-in
4. **ordering** — Put steps/words in correct order
5. **listening** — Play audio, answer question
6. **grammarRule** — Given a grammar rule, identify the correct example or fix the error in a sentence

## Frontend Files to Create

### 11. Exercise Page

**`frontend/src/pages/Exercise.jsx`** — Exercise player:
- Dynamic component based on exercise type:
  - FillBlank: Input field with sentence, underline blank
  - MultipleChoice: Radio buttons with styled options
  - Matching: Drag or click-to-match interface
  - DragDrop: Sortable word tiles
  - Writing: Textarea with prompt
- Submit button → sends answer
- Feedback display (correct/incorrect, AI explanation if available)
- Score animation
- Navigation: Next/Previous exercise
- Progress indicator (Exercise 3/10)

### 12. Quiz Page

**`frontend/src/pages/Quiz.jsx`** — Quiz player:
- Start screen with quiz info (title, question count, time limit, passing score)
- Timer countdown (red flash when < 1 min)
- Question navigation (numbered dots)
- Current question display (type-specific)
- Flag for review feature
- Submit screen with confirmation
- Results screen: score, passing status, per-question review
- Dark theme with quiz-specific styling

## Admin Panel Files to Create

### 13. Admin Exercise Pages

**`admin/src/pages/exercises/ExercisesList.jsx`** — Table: title, type, lesson, points, actions.

**`admin/src/pages/exercises/CreateExercise.jsx`** — Form:
- Lesson selector
- Type selector → renders type-specific form
- Question builder (dynamic based on type)
- Answer definition
- Points, order
- Save → creates exercise

**`admin/src/pages/exercises/ExerciseBuilder.jsx`** — Visual exercise builder:
- Preview panel (live preview of how exercise looks to student)
- Question editor (WYSIWYG-like)
- Answer key editor
- AI Generate button (placeholder)

### 14. Admin Quiz Pages

**`admin/src/pages/quizzes/QuizzesList.jsx`** — Table.

**`admin/src/pages/quizzes/CreateQuiz.jsx`** — Form: title, lesson, passing score, time limit.

**`admin/src/pages/quizzes/QuizBuilder.jsx`** — Visual quiz builder:
- Add/remove/reorder questions
- Per-question type selector
- Question editor with options
- Correct answer marking
- Points per question
- Preview mode
- AI Generate button (placeholder)

## Validation
1. Create exercise via admin API
2. Submit answer via student API → get score
3. Create quiz with multiple questions
4. Start quiz attempt, submit answers, verify auto-grading
5. Check progress tracking updates
6. Frontend exercise page renders all types correctly
7. Quiz timer works
8. `npm run build` for all apps
