# PHASE 6 — AI-Powered Features

> **🏆 Competitive Context:** Talkpal's #1 complaint is AI hallucinating grammar corrections. Our grammar checker (Phase 5 routing → SambaNova) must validate AI output. Also: our free AI chat via Groq has NO daily limit vs Talkpal's 10-min crippled free tier.

## Objective
Build all AI-powered features: conversational tutor, speaking practice with pronunciation feedback, writing exercises with AI grading, AI-generated reading passages, vocabulary drills, and listening exercises. This phase brings the app to life with intelligent, adaptive learning.

## Prerequisites
- Phase 5 complete (AI Engine foundation with providers & prompt templates)
- At least one AI provider API key configured
- Gemini recommended for best results (free tier)

## Features Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AI FEATURES                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. AI Chat Tutor        — Real-time conversation practice   │
│  2. Speaking Practice    — Pronunciation analysis & feedback │
│  3. Writing Exercises    — AI-graded writing submissions     │
│  4. Reading Lessons      — AI-generated passages + questions │
│  5. Vocabulary Drills    — Adaptive word learning            │
│  6. Listening Exercises  — Text-to-speech + comprehension   │
│  7. Grammar Practice     — Rule-based drills & conjugation   │
│  8. AI Feedback System   — Unified feedback display          │
│  9. Floating AITutorBadge— Persistent AI assistant access   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Backend Files to Create

### 1. AI Chat Service

**`backend/src/services/ai/ChatAIService.js`** — Real-time conversation tutor:
- Maintains conversation history per user (stored in ChatHistory table)
- Uses Groq provider (preferred for low-latency chat) with Gemini fallback
- Builds prompts using conversation template with level-appropriate language
- Tracks vocabulary used in conversation
- Detects student's mistakes and provides gentle corrections
- Suggests conversation topics when stalled
- Supports context window management (sliding window of last N messages)
- Methods: chat(userId, message, context), getHistory(userId), clearHistory(userId)

### 2. Speaking AI Service

**`backend/src/services/ai/SpeakingAIService.js`** — Pronunciation analysis:
- Accepts audio URL or base64 audio data
- Transcribes audio to text (via Gemini or external STT)
- Compares transcript to expected script
- Evaluates pronunciation: accuracy, fluency, intonation, rhythm
- Returns: overall score, phoneme-level feedback, mispronounced words, improvement tips
- Methods: evaluate(audioUrl, script, level), getPronunciationFeedback(phonemeData)

### 3. Writing AI Service

**`backend/src/services/ai/WritingAIService.js`** — Writing evaluation:
- Grades German writing submissions against CEFR level standards
- Evaluates: grammar, vocabulary usage, sentence structure, coherence, task completion
- Returns: overall score, category breakdowns, line-by-line corrections, improvement suggestions
- Supports different prompt types: essay, email, dialogue, description, opinion
- Methods: evaluate(text, prompt, level), getDetailedFeedback(submissionId)

### 4. Reading AI Service

**`backend/src/services/ai/ReadingAIService.js`** — Reading comprehension:
- Generates reading passages at specified CEFR level
- Creates comprehension questions (multiple choice, true/false, short answer)
- Extracts vocabulary words from passage with definitions
- Provides cultural context notes
- Methods: generatePassage({ topic, level, length }), generateQuestions(passage), extractVocabulary(passage)

### 5. Vocabulary AI Service

**`backend/src/services/ai/VocabularyAIService.js`** — Vocabulary:
- Generates vocabulary lists by topic, level, or frequency
- Creates example sentences using new words
- Generates mnemonics for difficult words
- Creates mini-quizzes for vocabulary practice
- Methods: generate({ topic, level, count }), generateSentences(words), generateMnemonics(words), generateQuiz(words)

### 6. Hearing AI Service

**`backend/src/services/ai/HearingAIService.js`** — Listening exercises:
- Generates audio scripts at target level
- Creates TTS audio (via external service or browser TTS)
- Builds comprehension questions from audio content
- Methods: generateExercise({ topic, level }), getTranscript(exerciseId)

### 6b. Grammar AI Service

**`backend/src/services/ai/GrammarAIService.js`** — Grammar practice & evaluation:
- Generates grammar rule explanations with examples at target CEFR level
- Creates practice exercises: article selection, verb conjugation, sentence completion
- Evaluates grammar exercise answers with detailed feedback per rule violated
- Generates conjugation tables for any German verb in any tense
- Explains grammar errors with rule-based corrections and CEFR-aligned references
- Methods: generateRules({ level, topics }), generateExercise({ rule, level }), evaluateAnswer(exerciseId, answer), conjugateVerb(verb, tense)

### 7. AI Backend Routes (update existing)

**`backend/src/routes/ai/chat.js`** — Updated with full implementation:
- POST /api/ai/chat — Send message (returns AI response)
- POST /api/ai/chat/stream — SSE streaming response
- GET /api/ai/chat/history — Get conversation history
- DELETE /api/ai/chat/history — Clear conversation

**`backend/src/routes/ai/speaking.js`** — Updated:
- POST /api/ai/speaking/evaluate — Upload audio + script for evaluation
- POST /api/ai/speaking/practice — Get a speaking prompt

**`backend/src/routes/ai/writing.js`** — Updated:
- POST /api/ai/writing/evaluate — Submit writing for grading
- POST /api/ai/writing/prompts — Get writing prompts by level

**`backend/src/routes/ai/vocabulary.js`** — Updated:
- POST /api/ai/vocabulary/generate — Generate word list
- POST /api/ai/vocabulary/practice — Get vocab practice session

**`backend/src/routes/ai/hearing.js`** — New hearing endpoints:
- POST /api/ai/hearing/exercise — Generate a listening exercise with audio script + questions
- POST /api/ai/hearing/evaluate — Submit listening comprehension answers for evaluation
- POST /api/ai/hearing/tts — Generate TTS audio from German text

**`backend/src/routes/ai/grammar.js`** — New grammar endpoints:
- POST /api/ai/grammar/exercise — Generate grammar practice exercises by topic and level
- POST /api/ai/grammar/evaluate — Submit grammar exercise answers for evaluation
- POST /api/ai/grammar/rules — Get grammar rule explanations with examples
- POST /api/ai/grammar/conjugate — Get conjugation table for a verb

## Frontend Files to Create

### 8. Hearing Practice Page (Listening Comprehension)

**`frontend/src/pages/HearingPractice.jsx`** — AI-powered listening exercises:
- Audio player with play/pause, progress bar, speed control (0.5x-2x), volume slider
- Playback position indicator (current time / total duration)
- Transcript panel with reveal/hide toggle — key German phrases highlighted
- Audio source from TTS (browser SpeechSynthesis or external API) following level-appropriate scripts
- Comprehension questions below player (multiple choice after audio finishes)
- Question feedback with transcript reference: "The answer is in line 4..."
- Exercise progress: "Exercise 3 of 6" with completion tracking
- Repeat and Replay buttons for difficult sections
- Level filter: A1-C1 audio complexity
- Slow-play mode: slowed-down German audio with natural pause insertion between phrases
- Auto-scroll transcript that follows audio playback position
- Vocabulary extraction: clickable words in transcript show definition + usage
- Uses HearingAIService for exercise generation and evaluation
- Dark theme with waveform-inspired audio visualization

### 9. Grammar Practice Page

**`frontend/src/pages/GrammarPractice.jsx`** — Rule-based grammar drills:
- Grammar rule cards with clear explanations, example sentences, and CEFR level indicators
- Rule categories: Articles (der/die/das/den/dem/des), Verb Conjugation (sein, haben, werden + regular/irregular), Cases (Nominativ, Akkusativ, Dativ, Genitiv), Prepositions, Adjective Endings, Sentence Structure (Hauptsatz, Nebensatz), Tenses (Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur)
- Interactive exercises per rule:
  - **GrammarFillBlank:** Fill in the correct article, verb form, or adjective ending in sentence context
  - **ConjugationTable:** Complete the conjugation table for a given verb in a specific tense
  - **ArticleSelection:** Select der/die/das/den/dem/des based on case and gender
  - **SentenceReorder:** Reorder scrambled words into a grammatically correct German sentence
  - **ErrorCorrection:** Identify and fix the grammar mistake in a given sentence
- Immediate feedback after each answer with the rule highlighted and explained
- Score tracking per rule category with visible progress bars
- Conjugation table reference lookup (search any verb + tense, shows full table)
- Difficulty progression: same rule at harder levels as student improves
- Spaced repetition: rules the student struggles with appear more frequently
- Grammar reference sidebar: quick-access lookup for all rules with examples
- Uses GrammarAIService for exercise generation and evaluation
- Links to relevant lessons in the course for each grammar topic

### 10. AI Chat Page

**`frontend/src/pages/AIChat.jsx`** — AI conversation tutor:
- Chat interface with message bubbles (user = right, AI = left)
- Input field with send button (Enter to send)
- Streaming response display (characters appear as generated)
- Voice input button (uses Web Speech API)
- Level badge showing current CEFR level
- Topic suggestions chips (clickable)
- Conversation history sidebar
- Settings: level selector, topic focus, formal/informal mode
- Dark theme with purple AI message bubbles
- Typing indicator while AI generates

### 11. Speaking Practice Page

**`frontend/src/pages/SpeakingPractice.jsx`** — Pronunciation practice:
- Scenario/prompt display (topic to speak about)
- Script display (text to read aloud)
- Record button with pulsing animation
- Audio waveform visualization
- Submission → AI analysis display
- Results: overall score, pronunciation accuracy %, fluency score
- Phoneme-level feedback with color coding (green=good, yellow=okay, red=needs work)
- Mispronounced words list with correct pronunciation
- Improvement tips section
- Practice history with progress chart
- Uses VoiceRecorder component

### 12. Writing Exercise Page

**`frontend/src/pages/WritingExercise.jsx`** — Writing practice:
- Writing prompt display with level indicator
- Word count target and current count
- Rich text area for writing
- Timer (optional, configurable)
- Submit for AI grading
- Results display:
  - Overall score with circular progress
  - Category breakdown: Grammar, Vocabulary, Structure, Coherence
  - Line-by-line corrections (original → corrected with explanation)
  - Overall feedback paragraph
  - Suggestions for improvement
- Writing history with scores over time
- Uses FeedbackCard component

### 13. Reading Lesson Page

**`frontend/src/pages/ReadingLesson.jsx`** — AI-generated reading:
- Reading passage display with comfortable typography
- Vocabulary highlights (clickable for definition)
- Comprehension questions below passage
- Progress tracking (words read, time spent)
- Audio playback (TTS reading the passage)
- Level-appropriate difficulty
- Cultural notes section
- Key vocabulary list with English translations

### 14. Vocabulary Drills Page

**`frontend/src/pages/VocabularyDrills.jsx`** — Vocabulary practice:
- Flashcard-style word display
- Flip animation (front: German word, back: English + example)
- Swipe gestures: know (right) / don't know (left)
- Spaced repetition scheduling
- Progress tracking: words learned, streak, accuracy
- Multiple drill modes:
  - German → English
  - English → German
  - Fill in the blank
  - Multiple choice
- Topic/level filters
- Search functionality
- Mnemonic display for difficult words

### 15. Components

**`frontend/src/components/VoiceRecorder.jsx`** — Voice recording component:
- Microphone button with permission handling
- Recording state visualization (pulse animation)
- Audio level meter
- Recording duration display
- Playback of recorded audio
- Re-record option
- Submit callback

**`frontend/src/components/FeedbackCard.jsx`** — AI feedback display:
- Animated score display (circular or bar)
- Category breakdown with bars
- Color-coded sections (green/yellow/red)
- Expandable detailed feedback
- Correction display (original ↔ corrected)
- Improvement suggestions list

**`frontend/src/components/AITutorBadge.jsx`** — Floating AI tutor button:
- Fixed bottom-right position
- Pulsing glow animation
- Tooltip on hover: "Need help? Ask AI!"
- Click → opens chat modal or navigates to /ai-chat
- Badge showing unread messages count (if any)
- Minimizable during active chat

### 16. Hooks

**`frontend/src/hooks/useAIChat.js`** — Chat hook:
- sendMessage(text) → streaming response
- getHistory() → load chat history
- clearHistory() → reset conversation
- isStreaming state
- currentResponse state

**`frontend/src/hooks/useSpeechRecognition.js`** — Speech recognition hook:
- Uses Web Speech API (SpeechRecognition)
- startListening() / stopListening()
- interimTranscript / finalTranscript
- isListening state
- browser support check
- Language set to "de-DE" for German

**`frontend/src/hooks/useAIFeedback.js`** — AI feedback hook:
- submitExercise(exerciseId, answer) → get feedback
- submitWriting(text, prompt) → get grading
- submitSpeaking(audioBlob, script) → get evaluation
- isEvaluating state
- feedback result

**`frontend/src/hooks/useHearing.js`** — Hearing practice hook:
- generateExercise({ topic, level }) → get listening exercise
- submitAnswers(exerciseId, answers) → get evaluation
- getTTS(text, options) → get audio URL
- isGenerating state

**`frontend/src/hooks/useGrammarPractice.js`** — Grammar hook:
- generateExercise({ rule, level }) → get grammar exercise
- submitAnswer(exerciseId, answer) → get evaluation with rule explanation
- getRules(level, topic) → fetch grammar rules
- conjugateVerb(verb, tense) → get conjugation table
- isEvaluating state

## Store Updates

**`frontend/src/store/store.js`** — Add AI features slice:
```javascript
aiFeatures: {
  // Chat
  chatMessages: [],
  isChatLoading: false,
  // Speaking
  speakingHistory: [],
  // Writing
  writingHistory: [],
  // Vocabulary
  vocabWords: [],
  vocabProgress: {},
  // Reading
  currentPassage: null,
}
```

## Validation
1. Chat: send message → receive AI response with conversation context
2. Speaking: record audio → AI evaluates pronunciation
3. Writing: submit text → AI grades with detailed feedback
4. Reading: generate passage → comprehension questions work
5. Vocabulary: generate word list → practice session works
6. AI feedback displays correctly with animations
7. Voice recorder captures and submits audio
8. Floating AI tutor badge appears and navigates correctly
9. `npm run build` for all apps
