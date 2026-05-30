# PHASE 5 — AI Engine Foundation

> **🏆 Competitive Context:** Our AI engine routes grammar/reasoning tasks to SambaNova (DeepSeek R1) because Talkpal users complain about AI hallucinating German grammar. Smart provider routing = competitive accuracy advantage.

## Objective
Build the core AI Engine with multi-provider support, smart routing, prompt template system, and evaluation modules. This is the foundation for all AI-powered features (chat, lesson generation, speaking evaluation, etc.).

## Prerequisites
- Phase 4 complete
- API keys for at least one AI provider (Gemini recommended for free tier)

## Architecture Overview

```
Student/Admin Request
        │
        ▼
┌─────────────────────┐
│  aiProviderRouter    │──→ Gemini (primary for generation)
│  (Smart Router)      │──→ Groq (real-time chat)
│                      │──→ OpenRouter (fallback)
│                      │──→ SambaNova (grammar/reasoning)
│                      │──→ Cerebras (batch evaluation)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐    ┌──────────────────────┐
│  PromptBuilder      │──→│  Prompt Templates    │
│  (Builds prompts    │    │  • lessonGeneration │
│   from templates)   │    │  • quizGeneration   │
└─────────┬───────────┘    │  • conversation     │
          │                │  • writingEval      │
          ▼                │  • speakingEval     │
┌─────────────────────┐    └──────────────────────┘
│  ContextManager     │──→ Few-Shot Examples
│  (Adds examples    │    (admin-provided training)
│   to prompts)      │
└─────────────────────┘
```

## Files to Create

### 1. AI Engine — Backend Services

**`backend/src/services/aiProviderRouter.js`** — Smart AI provider router:
```javascript
// Maps task types to preferred providers:
// - generate-lesson → gemini (1M token context, best for content)
// - chat → groq (ultra-low latency for real-time)
// - generate-quiz → openrouter (structured JSON output)
// - grammar-check → sambanova (reasoning-focused)
// - evaluate-answer → cerebras (high volume batch)
//
// Provider priority chain for each task type:
// Primary → if fails → Fallback 1 → Fallback 2 → ... → All exhausted
//
// Each provider method:
//   gemini: @google/generative-ai SDK
//   groq: groq-sdk
//   openrouter: raw axios POST to https://openrouter.ai/api/v1/chat/completions
//   sambanova: axios POST to SambaNova API
//   cerebras: axios POST to Cerebras API
//
// Usage: aiProviderRouter.call(taskType, prompt)
// Returns: { data, provider, model, promptTokens, outputTokens, duration }
//
// Features:
// - Quota tracking per provider (tracks daily usage)
// - Exponential backoff on rate limits
// - Automatic fallback chain
// - Logging to AIUsageLog table
// - Cost tracking (if provider has cost info)
```

**`backend/src/services/promptBuilder.js`** — Prompt construction:
```javascript
// class PromptBuilder:
//   registerTemplate(name, template) — store a template string
//   build(templateName, variables) — replace {variables} with values
//   buildWithExamples(templateName, variables, examples) — inject few-shot examples
//
// Template example:
//   "You are a German {level} teacher. Create a lesson about {topic}.\n
//    Include {numVocabulary} vocabulary words...\n\n
//    {adminProvidedExamples}\n\n
//    Return valid JSON with keys: title, vocabulary, grammar, exercises, summary"
```

**`backend/src/services/contextManager.js`** — Context management:
- Manages conversation context for AI tutor
- Tracks message history per user session
- Truncates context when token limit approached
- Stores context in ChatHistory table
- Returns relevant context when building chat prompts

### 2. AI Engine — Providers (Standalone)

**`ai-engine/providers/geminiProvider.js`** — Gemini integration:
```javascript
// Uses @google/generative-ai SDK
// Model: gemini-2.5-flash (free tier)
// Methods:
//   generateContent(prompt) — standard generation
//   generateContentStream(prompt) — streaming for real-time
//   countTokens(text) — token counting
// Configuration: API key from env, safety settings, generation config
```

**`ai-engine/providers/groqProvider.js`** — Groq integration:
```javascript
// Uses groq-sdk
// Model: llama-3.3-70b (free tier)
// Best for: low-latency real-time chat
// Methods: generateContent, generateContentStream
```

**`ai-engine/providers/openRouterProvider.js`** — OpenRouter integration:
```javascript
// Raw HTTP calls via axios
// Multiple free models available
// Best for: structured JSON generation (quizzes, exercises)
// Methods: generateContent
```

**`ai-engine/providers/providerManager.js`** — Provider orchestration:
```javascript
// class ProviderManager:
//   constructor() — initializes all providers with API keys
//   getProvider(name) — get provider by name
//   getPreferredProvider(taskType) — returns best provider for task
//   callWithFallback(taskType, prompt) — tries providers in priority order
//   checkQuota(provider) — checks daily usage limits
//   getFallbackResponse(taskType, prompt) — returns simplified response when all fail
//
// Provider priority map:
//   lessonGeneration: gemini → openrouter → groq
//   quizGeneration: openrouter → gemini → cerebras
//   chat: groq → gemini → openrouter
//   speakingEval: cerebras → sambanova → gemini
//   writingEval: sambanova → gemini → cerebras
//   vocabularyGen: gemini → groq → openrouter
//   grammarCheck: sambanova → gemini → groq
//   batchEval: cerebras → groq → openrouter
```

**`ai-engine/index.js`** — Engine entry point:
```javascript
// Exports:
//   providerManager — initialized instance
//   promptTemplates — loaded template collection
//   trainingDataManager — handles few-shot examples
//   evaluationModules — grammar, pronunciation, writing graders
```

### 3. AI Engine — Prompt Templates

**`ai-engine/training/promptTemplates/lessonGeneration.json`**:
```json
{
  "name": "lessonGeneration",
  "description": "Generates structured German lessons",
  "template": "You are a German {level} teacher creating a lesson about '{topic}' focusing on {skillArea}. Duration: {duration} minutes.\n\nINSTRUCTIONS:\n1. Include exactly {numVocabulary} new vocabulary words with German word, English translation, and example sentence\n2. Include {numGrammarPoints} grammar explanations appropriate for {level} level\n3. All exercises should practice the vocabulary and grammar introduced\n4. Include a short cultural note related to the topic\n5. Difficulty must strictly follow CEFR {level} standards\n\nOUTPUT FORMAT (return valid JSON only):\n{\n  \"title\": \"Lesson title\",\n  \"introduction\": \"Brief intro paragraph\",\n  \"vocabulary\": [{\"german\": \"das Wort\", \"english\": \"the word\", \"example\": \"Example sentence.\"}],\n  \"grammar\": [{\"topic\": \"Grammar point\", \"explanation\": \"Detailed explanation\", \"examples\": [\"Example 1\", \"Example 2\"]}],\n  \"dialog\": \"Optional: short dialog using the vocabulary\",\n  \"culturalNote\": \"Interesting cultural fact\",\n  \"exercises\": [{\"type\": \"fillBlank|multipleChoice|matching\", \"instruction\": \"...\", \"items\": [...]}],\n  \"summary\": \"Key takeaways paragraph\"\n}\n\n{adminProvidedExamples}",
  "variables": {
    "level": ["A1","A2","B1","B2","C1"],
    "skillArea": ["reading","writing","speaking","hearing","vocabulary","grammar"],
    "numVocabulary": "number",
    "numGrammarPoints": "number",
    "duration": "number"
  }
}
```

**`ai-engine/training/promptTemplates/quizGeneration.json`**:
```json
{
  "name": "quizGeneration",
  "description": "Generates quizzes with mixed question types",
  "template": "Create a German language quiz for {level} level on the topic: '{topic}'.\n\nInclude {numQuestions} questions with the following distribution:\n{questionTypeDistribution}\n\nOUTPUT FORMAT (return valid JSON):\n{\n  \"title\": \"Quiz Title\",\n  \"questions\": [\n    {\n      \"id\": 1,\n      \"type\": \"multipleChoice|trueFalse|fillBlank|ordering\",\n      \"question\": \"Question text\",\n      \"options\": [\"A\", \"B\", \"C\", \"D\"], // for multipleChoice\n      \"correctAnswer\": \"A\",\n      \"points\": 10,\n      \"explanation\": \"Why this answer is correct\"\n    }\n  ]\n}\n\n{adminProvidedExamples}",
  "variables": {
    "level": ["A1","A2","B1","B2","C1"],
    "numQuestions": "number",
    "questionTypeDistribution": "string"
  }
}
```

**`ai-engine/training/promptTemplates/conversation.json`**:
```json
{
  "name": "conversation",
  "description": "AI German conversation tutor",
  "template": "You are a German language conversation partner for a {level} student. Their native language is {nativeLanguage}.\n\nRULES:\n- Respond primarily in German, adjusting complexity to {level}\n- If the student makes a mistake, gently correct them\n- Keep the conversation natural and engaging\n- Suggest topics when conversation stalls\n- Track vocabulary used and introduce new words naturally\n- Provide English translations in parentheses for difficult words\n\nConversation context:\n{conversationHistory}\n\nStudent: {userMessage}\nTutor:",
  "variables": {
    "level": ["A1","A2","B1","B2","C1"],
    "nativeLanguage": "string",
    "conversationHistory": "string",
    "userMessage": "string"
  }
}
```

**`ai-engine/training/promptTemplates/vocabulary.json`** — Vocabulary generation template
**`ai-engine/training/promptTemplates/writingEval.json`** — Writing evaluation template
**`ai-engine/training/promptTemplates/speakingEval.json`** — Speaking evaluation template
**`ai-engine/training/promptTemplates/readingEval.json`** — Reading comprehension template
**`ai-engine/training/promptTemplates/hearingEval.json`** — Listening exercise template

### 4. AI Engine — Evaluation Modules

**`ai-engine/evaluation/grammarChecker.js`**:
```javascript
// checkGrammar(text, level) → { hasErrors, errors[], overallScore }
// Uses SambaNova preferred for grammar checking
// Returns structured error list with corrections and explanations
```

**`ai-engine/evaluation/pronunciationScorer.js`**:
```javascript
// evaluatePronunciation(audioUrl, expectedScript, level) → { score, phonemes[], feedback }
// Uses speech recognition + AI analysis
// Returns score breakdown, mispronounced words, improvement tips
```

**`ai-engine/evaluation/writingGrader.js`**:
```javascript
// gradeWriting(text, prompt, level, rubric) → { overall, grammar, vocabulary, structure, coherence, feedback, corrections[] }
// Evaluates against CEFR level standards
// Returns detailed feedback with line-by-line corrections
```

**`ai-engine/evaluation/comprehensionChecker.js`**:
```javascript
// checkComprehension(question, answer, expectedAnswer, level) → { correct, score, feedback }
// Flexible matching (accepts synonyms and minor errors)
```

### 5. AI Engine — Configuration

**`ai-engine/config/apiKeys.js`**:
```javascript
// Loads API keys from environment variables
// Validates required keys
// Exports provider configs
```

**`ai-engine/config/providerConfig.js`**:
```javascript
// Provider-specific configuration:
// - API endpoints
// - Model names
// - Rate limits
// - Timeouts
// - Max tokens
// - Daily quotas
```

### 6. Backend — AI Routes

**`backend/src/routes/ai/index.js`** — Aggregates all AI routes:
```javascript
const router = require('express').Router();
router.use('/generate', require('./generate'));
router.use('/evaluate', require('./evaluate'));
router.use('/chat', require('./chat'));
router.use('/speaking', require('./speaking'));
router.use('/writing', require('./writing'));
router.use('/vocabulary', require('./vocabulary'));
module.exports = router;
```

**`backend/src/routes/ai/generate.js`** — Generation endpoints:
- POST /api/ai/generate/lesson — Generate lesson (calls LessonAIService)
- POST /api/ai/generate/quiz — Generate quiz
- POST /api/ai/generate/vocabulary — Generate vocabulary list

**`backend/src/routes/ai/evaluate.js`** — Evaluation endpoints:
- POST /api/ai/evaluate/answer — Evaluate a single answer
- POST /api/ai/evaluate/grammar — Check grammar
- POST /api/ai/evaluate/comprehension — Check comprehension

**`backend/src/routes/ai/chat.js`** — Chat endpoint:
- POST /api/ai/chat — Send message to AI tutor
- GET /api/ai/chat/history — Get chat history

**`backend/src/routes/ai/speaking.js`** — Speaking endpoints:
- POST /api/ai/speaking/evaluate — Evaluate pronunciation

**`backend/src/routes/ai/writing.js`** — Writing endpoints:
- POST /api/ai/writing/evaluate — Evaluate writing submission

**`backend/src/routes/ai/vocabulary.js`** — Vocabulary endpoints:
- POST /api/ai/vocabulary/generate — Generate word list

### 7. Backend — AI Controllers

**`backend/src/controllers/ai/aiController.js`**:
- generate(req, res) — Generic generation endpoint
- generateLesson(req, res) — Lesson generation
- generateQuiz(req, res) — Quiz generation

**`backend/src/controllers/ai/aiProvider.js`**:
- getProviderForTask(taskType) — Returns provider name
- call(taskType, prompt) — Calls provider with fallback

**`backend/src/controllers/ai/promptEngine.js`**:
- registerTemplate(name, template) — Register template
- build(templateName, variables) — Build prompt
- buildWithExamples(templateName, variables, examples) — Build with few-shot examples

**`backend/src/controllers/ai/trainingEngine.js`**:
- getTrainingExamples(type, level, limit) — Fetch few-shot examples from DB
- getPromptTemplate(name) — Fetch template from DB
- generateWithTraining(taskType, params) — Generate with training context
- saveTrainingData(data) — Save admin-uploaded training examples

**`backend/src/controllers/ai/evaluationEngine.js`**:
- evaluateAnswer(question, userAnswer, correctAnswer, type) — Evaluate and provide feedback
- gradeWriting(text, prompt, level, rubric) — Grade writing
- checkGrammar(text, level) — Grammar check

### 8. Backend — AI Middleware

**`backend/src/middleware/aiRateLimiter.js`**:
- Rate limits AI API calls per user
- Configurable limits per task type
- Returns 429 if exceeded

**`backend/src/middleware/aiFallback.js`**:
- Catches AI provider errors
- Returns cached or simplified responses
- Logs errors for monitoring

### 9. Backend — AI Services

**`backend/src/services/ai/LessonAIService.js`**:
```javascript
// class LessonAIService:
//   generateLesson({ topic, level, skillArea, duration }) → lesson object
//   generateWithExamples({ ...params, lessonExamples }) → uses admin examples
//   parseLessonResponse(rawResponse) → validates and structures JSON
```

**`backend/src/services/ai/QuizAIService.js`**:
```javascript
// class QuizAIService:
//   generateQuiz({ lessonId, questionTypes, numQuestions, difficulty }) → quiz object
//   generateWithExamples(lessonId, examples) → quiz matching admin style
//   evaluateQuiz(attempt) → score and feedback
```

**`backend/src/services/ai/ChatAIService.js`**:
```javascript
// class ChatAIService:
//   chat(userId, message, context) → AI response
//   getContext(userId) → conversation history
//   saveContext(userId, message, response) → persist
//   clearContext(userId) → reset conversation
```

### 10. AI Engine — Training Data Manager

**`ai-engine/training/trainingDataManager.js`**:
```javascript
// class TrainingDataManager:
//   loadTrainingData(type, level) — Load from DB
//   getPromptTemplates() — Load all templates
//   saveTrainingExample(data) — Save new example
//   deleteTrainingExample(id) — Remove example
//   activate/deactivateTrainingData(id)
```

## Store Updates

**`frontend/src/store/store.js`** — Add AI state:
```javascript
ai: {
  isGenerating: false,
  chatHistory: [],
  lastResponse: null,
  // actions
  generateLesson: async (params) => { ... },
  generateQuiz: async (params) => { ... },
  sendChatMessage: async (message) => { ... },
  evaluateAnswer: async (exerciseId, answer) => { ... },
}
```

## Validation
1. Test Gemini provider: generate a simple prompt, verify response
2. Test provider fallback: disable one provider, verify next one works
3. Build prompt from template: verify variables are replaced
4. Test prompt with few-shot examples: verify examples included
5. Test AI usage logging: check AIUsageLog table for entries
6. All routes respond correctly
7. `npm run build` for all apps

## Free API Setup

For testing during development, get API keys:
- **Gemini**: https://aistudio.google.com/app/apikey (free, 1,500 req/day)
- **Groq**: https://console.groq.com/keys (free, 1,000 req/day)
- **OpenRouter**: https://openrouter.ai/keys (free tier available)
