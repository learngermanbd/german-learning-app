# PHASE 7 — Admin AI Training System

> **🏆 Competitive Context:** THIS IS YOUR KILLER FEATURE. Talkpal has NO teacher/admin tools at all. Schools will pay $50-200/month for this system alone. The admin training dashboard is your sustainable B2B revenue model.

## Objective
Build the Admin AI Training Dashboard — the platform's competitive advantage. Admins can teach the AI by editing prompt templates, uploading few-shot examples, previewing AI outputs, and configuring model behavior — all without writing any code.

## Prerequisites
- Phase 5 & 6 complete (AI Engine + Features working)
- Admin auth working
- AIUsageLog tables have usage data

## Core Concept
Instead of expensive model fine-tuning, this system uses **Prompt Engineering + Few-Shot Learning**. Admins can instantly update AI behavior by editing prompts and uploading examples through the admin panel UI.

```
Admin Panel                          AI Engine                    Student
┌──────────────────┐               ┌───────────────────┐        ┌─────────┐
│ Prompt Editor    │──Edit──►      │ Prompt Templates  │──►     │  Better │
│ (Tweak AI        │               │ (stored in DB)    │        │ Content │
│  instructions)   │               └───────────────────┘        └─────────┘
└──────────────────┘                          ▲
                                               │
┌──────────────────┐               ┌───────────┴───────────┐
│ Upload Examples  │──Save──►      │ Few-Shot Examples    │
│ (lessons, etc)   │               │ (stored in DB)       │
└──────────────────┘               └───────────────────────┘
                                               │
┌──────────────────┐                           ▼
│ Preview Output   │◄──Render──┐  ┌───────────────────────┐
│ (See AI result)  │           │  │ AI Generation        │
└──────────────────┘           │  │ (with examples as    │
                               │  │  context)            │
└──────────────────────────┘  └───────────────────────┘
```

## Backend Files to Create/Update

### 1. AI Training Controller

**`backend/src/controllers/admin/trainingController.js`** — Training management:
- GET /api/admin/ai-training/dashboard — Training dashboard stats (templates count, examples count, recent generations, usage metrics)
- GET /api/admin/ai-training/templates — List all prompt templates with versions
- GET /api/admin/ai-training/templates/:id — Get template detail with version history
- POST /api/admin/ai-training/templates — Create new template
- PUT /api/admin/ai-training/templates/:id — Update template (creates new version)
- POST /api/admin/ai-training/templates/:id/restore — Rollback to previous version
- GET /api/admin/ai-training/examples — List training examples (filter by type, level, tags)
- POST /api/admin/ai-training/examples — Upload new training example
- PUT /api/admin/ai-training/examples/:id — Update example
- DELETE /api/admin/ai-training/examples/:id — Delete example
- POST /api/admin/ai-training/examples/bulk-upload — Bulk upload JSON/CSV
- POST /api/admin/ai-training/generate — Generate AI content using current templates + examples (preview)
- POST /api/admin/ai-training/test — Test a modified template without saving
- GET /api/admin/ai-training/usage — AI usage analytics (requests/day, provider distribution, cost)
- GET /api/admin/ai-training/usage/cost — Cost breakdown by provider

### 2. AI Training Routes

**`backend/src/routes/admin/ai-training.js`** — All routes protected by adminAuth + permission check.

### 3. Admin Training API

**`admin/src/api/aiTrainingAPI.js`** — Axios calls:
- getDashboard(), getTemplates(), getTemplate(id), createTemplate(data), updateTemplate(id, data), restoreTemplate(id)
- getExamples(filters), createExample(data), updateExample(id, data), deleteExample(id), bulkUpload(data)
- generatePreview(params), testTemplate(template)
- getUsage(filters), getCostData()

## Admin Panel Files to Create

### 4. Training Dashboard

**`admin/src/pages/ai-training/TrainingDashboard.jsx`** — Main AI training overview:
- Stats cards: Total Templates, Total Examples, AI Requests Today, Avg Response Time
- Quick action buttons: Edit Prompts, Upload Examples, Test Generation
- Recent AI generations table (last 20, with status, type, duration)
- Usage chart (requests over time — last 7/30 days)
- Provider distribution bar chart (Gemini vs Groq vs OpenRouter)
- Template health indicators (last used, version count, success rate)

### 5. Prompt Templates Page

**`admin/src/pages/ai-training/PromptTemplates.jsx`** — Template management:
- Table: Name, Type, Version, Last Edited, Status (active/inactive), Actions
- Search and filter by type
- Create New Template button
- Click template → expand to show template preview and edit option
- Version history badge showing number of versions
- Status toggle (active/inactive)

### 6. Template Editor

**`admin/src/components/AIPreview.jsx`** (or inline in PromptTemplates) — Template editor:
- Name field, Type selector (lessonGeneration, quizGeneration, conversation, etc.)
- Template text editor (monospace textarea with syntax highlighting)
- Variable highlighting: `{variable}` tags shown in different color
- Variables panel: list of available variables for the template type
- Test button: renders template with sample variables → shows result
- Version history sidebar:
  - Timestamp of each version
  - Who edited it
  - Diff view (green/red highlighting changes)
  - Rollback button per version
- Save / Save as New Version buttons
- Preview panel: generate AI content with current template

### 7. Training Examples Page

**`admin/src/pages/ai-training/TrainingDataUploader.jsx`** — Example management:
- List of uploaded examples with: Type, Level, Tags, Preview, Status
- Filter by type (lesson, quiz, vocabulary, writing, speaking, reading, hearing)
- Filter by level (A1-C1)
- Filter by tags
- Search content
- Upload new example: Form with Type, Level, Tags (multi-input), Content JSON editor
- Bulk upload: Drag-and-drop JSON/CSV file uploader
- Edit example: inline editor
- Delete with confirmation
- Activate/deactivate toggle per example
- Preview example content (collapsible JSON viewer)

### 8. Lesson Generator

**`admin/src/pages/ai-training/LessonGenerator.jsx`** — AI lesson generation tool:
- Form: Topic, Level (A1-C1), Skill Area, Duration, Number of vocabulary words, Number of grammar points
- Upload example lessons as training data (optional)
- Generate button → calls AI with current templates + examples
- Preview panel: shows generated lesson in structured format
- Edit generated content before publishing
- Publish directly to lessons database
- Save as training example (adds to few-shot pool)
- Generation history sidebar

### 9. Exam Generator

**`admin/src/pages/ai-training/ExamGenerator.jsx`** — Quiz/exam generation:
- Quiz title, Lesson selector, Level, Number of questions
- Question type distribution sliders (% MC, % FillBlank, % TrueFalse, % Ordering)
- Difficulty distribution (easy %, medium %, hard %)
- Upload past exams as training data
- Generate → preview quiz
- Edit questions individually
- Set passing score
- Publish to quizzes database

### 10. Vocabulary Manager

**`admin/src/pages/ai-training/VocabularyManager.jsx`** — Vocabulary management:
- Upload word lists (CSV: German, English, Level, Topic)
- AI generates: example sentences, mnemonics, audio pronunciations
- Organize by topic and level
- Edit individual entries
- Bulk operations
- Export as JSON/CSV

### 11. Model Configuration

**`admin/src/pages/ai-training/ModelConfig.jsx`** — AI provider settings:
- Provider status indicators (online/offline/quota remaining)
- Per-provider settings:
  - Model selection dropdown
  - Max tokens slider
  - Temperature slider
  - Timeout setting
- Provider priority order (drag to reorder)
- Daily quota usage bars (current usage / daily limit)
- Fallback configuration
- Test connection button per provider

## Components

### 12. AIPreview Component

**`admin/src/components/AIPreview.jsx`** — AI content preview:
- Renders AI-generated content in structured format
- Shows raw JSON toggle
- Edit in-place capability
- Publish button → saves to database
- Regenerate button
- Loading state with skeleton
- Error state with retry
- Feedback: thumbs up/down for quality rating

## Store Updates

**`admin/src/store/adminDataStore.js`** — Add AI training state:
```javascript
aiTraining: {
  templates: [],
  examples: [],
  generationHistory: [],
  usage: {},
  // actions
  fetchTemplates: async () => { ... },
  fetchExamples: async (filters) => { ... },
  generatePreview: async (params) => { ... },
  saveExample: async (data) => { ... },
}
```

## Admin Panel Routes Update

**`admin/src/App.jsx`** — Ensure all ai-training routes are registered:
- /admin/ai-training → TrainingDashboard
- /admin/ai-training/templates → PromptTemplates
- /admin/ai-training/lesson-generator → LessonGenerator
- /admin/ai-training/exam-generator → ExamGenerator
- /admin/ai-training/vocabulary → VocabularyManager
- /admin/ai-training/data → TrainingDataUploader
- /admin/ai-training/config → ModelConfig

## Validation
1. Create a prompt template → test it with the "test" endpoint
2. Upload a few-shot example → generate content using it as context
3. Preview AI-generated lesson → verify it matches the template format
4. Edit template → save as new version → verify version history
5. Rollback to previous template version → verify it works
6. Bulk upload training data → verify all items created
7. AI usage analytics show correct data from AIUsageLog
8. `npm run build` for admin app
