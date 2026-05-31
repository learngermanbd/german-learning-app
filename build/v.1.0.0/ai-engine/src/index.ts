import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { ProviderFactory } from './providers/providerFactory.js';
import { contentGenerator } from './services/contentGenerator.js';
import { evaluateSpeaking, evaluateWriting } from './services/responseEvaluator.js';
import { buildLessonContext, buildUserContext } from './services/contextBuilder.js';
import { extractFromText, getDefinition } from './services/vocabularyExtractor.js';

const app = express();
const PORT = config.port;

app.use(cors({
  origin: [config.frontendUrl, config.adminUrl, config.backendUrl],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate/lesson', async (req, res) => {
  try {
    const { topic, level } = req.body;
    const apiKey = config.gemini.apiKey || '';
    const result = await contentGenerator.generateLessonContent(topic, level, apiKey);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/generate/exercise', async (req, res) => {
  try {
    const { exerciseType, topic, level } = req.body;
    const apiKey = config.gemini.apiKey || '';
    const result = await contentGenerator.generateExercise(exerciseType, topic, level, apiKey);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/generate/quiz', async (req, res) => {
  try {
    const { topic, level, questionCount } = req.body;
    const apiKey = config.gemini.apiKey || '';
    const result = await contentGenerator.generateQuiz(topic, level, questionCount, apiKey);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/evaluate/speaking', async (req, res) => {
  try {
    const { transcript, exerciseContext } = req.body;
    const result = await evaluateSpeaking(transcript, exerciseContext);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/evaluate/writing', async (req, res) => {
  try {
    const { text, prompt, level } = req.body;
    const result = await evaluateWriting(text, prompt, level);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/chat/message', async (req, res) => {
  try {
    const { message } = req.body;
    const provider = ProviderFactory.getProvider('gemini', { apiKey: config.gemini.apiKey || '' });
    const result = await provider.generate(message, { temperature: 0.8 });
    res.json({ success: true, data: { text: result.text } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/speaking/analyze', async (req, res) => {
  try {
    const { transcript, exerciseContext } = req.body;
    const result = await evaluateSpeaking(transcript, exerciseContext);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/speaking/practice', async (req, res) => {
  try {
    const { topic, level } = req.body;
    const provider = ProviderFactory.getProvider('gemini', { apiKey: config.gemini.apiKey || '' });
    const prompt = `Create a German speaking practice exercise for level ${level} about "${topic}". Include a dialogue scenario and prompt.`;
    const result = await provider.generate(prompt);
    res.json({ success: true, data: { text: result.text } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/writing/evaluate', async (req, res) => {
  try {
    const { text, prompt, level } = req.body;
    const result = await evaluateWriting(text, prompt, level);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/writing/correct', async (req, res) => {
  try {
    const { text } = req.body;
    const provider = ProviderFactory.getProvider('gemini', { apiKey: config.gemini.apiKey || '' });
    const prompt = `Correct the following German text and explain each correction:\n\n${text}`;
    const result = await provider.generate(prompt);
    res.json({ success: true, data: { corrected: result.text } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/vocabulary/extract', async (req, res) => {
  try {
    const { text, level } = req.body;
    const words = extractFromText(text, level);
    res.json({ success: true, data: words });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/vocabulary/related/:word', async (req, res) => {
  try {
    const { word } = req.params;
    const definition = getDefinition(word, '');
    res.json({ success: true, data: definition });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('AI Engine Error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`AI Engine running on port ${PORT}`);
});

export default app;
