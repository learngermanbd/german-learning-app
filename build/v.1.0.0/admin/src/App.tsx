import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminCourses = lazy(() => import('./pages/AdminCourses'));
const EditCourse = lazy(() => import('./pages/EditCourse'));
const AdminLessons = lazy(() => import('./pages/AdminLessons'));
const EditLesson = lazy(() => import('./pages/EditLesson'));
const AdminExercises = lazy(() => import('./pages/AdminExercises'));
const EditExercise = lazy(() => import('./pages/EditExercise'));
const AdminQuizzes = lazy(() => import('./pages/AdminQuizzes'));
const EditQuiz = lazy(() => import('./pages/EditQuiz'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const EditUser = lazy(() => import('./pages/EditUser'));
const AdminMedia = lazy(() => import('./pages/AdminMedia'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const BackupSettings = lazy(() => import('./pages/settings/BackupSettings'));
const AITraining = lazy(() => import('./pages/ai-training/AITraining'));
const SpeakingScorer = lazy(() => import('./pages/ai-training/SpeakingScorer'));
const ReadingSets = lazy(() => import('./pages/ai-training/ReadingSets'));
const WritingPrompts = lazy(() => import('./pages/ai-training/WritingPrompts'));
const HearingExercises = lazy(() => import('./pages/ai-training/HearingExercises'));
const PromptTemplates = lazy(() => import('./pages/ai-training/PromptTemplates'));
const ModelConfig = lazy(() => import('./pages/ai-training/ModelConfig'));
const WebsiteEditor = lazy(() => import('./pages/WebsiteEditor'));
const WebsiteTemplates = lazy(() => import('./pages/WebsiteTemplates'));
const WebsitePublishing = lazy(() => import('./pages/WebsitePublishing'));
const UpdatesList = lazy(() => import('./pages/UpdatesList'));
const CreateUpdate = lazy(() => import('./pages/CreateUpdate'));
const EditUpdate = lazy(() => import('./pages/EditUpdate'));

export default function AdminApp() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0a0a0f]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/new" element={<EditCourse />} />
            <Route path="/admin/courses/:id/edit" element={<EditCourse />} />
            <Route path="/admin/lessons" element={<AdminLessons />} />
            <Route path="/admin/lessons/new" element={<EditLesson />} />
            <Route path="/admin/lessons/:id/edit" element={<EditLesson />} />
            <Route path="/admin/exercises" element={<AdminExercises />} />
            <Route path="/admin/exercises/:id/edit" element={<EditExercise />} />
            <Route path="/admin/quizzes" element={<AdminQuizzes />} />
            <Route path="/admin/quizzes/:id/edit" element={<EditQuiz />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id/edit" element={<EditUser />} />
            <Route path="/admin/media" element={<AdminMedia />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/settings/backup" element={<BackupSettings />} />
            <Route path="/admin/ai-training" element={<AITraining />} />
            <Route path="/admin/ai-training/speaking" element={<SpeakingScorer />} />
            <Route path="/admin/ai-training/reading" element={<ReadingSets />} />
            <Route path="/admin/ai-training/writing" element={<WritingPrompts />} />
            <Route path="/admin/ai-training/hearing" element={<HearingExercises />} />
            <Route path="/admin/ai-training/prompts" element={<PromptTemplates />} />
            <Route path="/admin/ai-training/models" element={<ModelConfig />} />
            <Route path="/admin/website-editor" element={<WebsiteEditor />} />
            <Route path="/admin/website-editor/templates" element={<WebsiteTemplates />} />
            <Route path="/admin/website-editor/publishing" element={<WebsitePublishing />} />
            <Route path="/admin/updates" element={<UpdatesList />} />
            <Route path="/admin/updates/new" element={<CreateUpdate />} />
            <Route path="/admin/updates/:id/edit" element={<EditUpdate />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
