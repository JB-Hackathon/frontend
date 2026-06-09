import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ReviewPage from '@/pages/ReviewPage';
import DashboardPage from '@/pages/DashboardPage';
import UploadPage from '@/pages/UploadPage';
import ContentDetailPage from '@/pages/ContentDetailPage';
import ResubmitPage from '@/pages/ResubmitPage';
import EditorPage from '@/pages/EditorPage';
import AIRevisionPage from '@/pages/AIRevisionPage';
import AITranslatePage from '@/pages/AITranslatePage';
import ChannelPublishPage from '@/pages/ChannelPublishPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/content/:id" element={<ProtectedRoute><ContentDetailPage /></ProtectedRoute>} />
      <Route path="/content/:id/resubmit" element={<ProtectedRoute><ResubmitPage /></ProtectedRoute>} />
      <Route path="/content/:id/ai-revision" element={<ProtectedRoute><AIRevisionPage /></ProtectedRoute>} />
      <Route path="/content/:id/translate" element={<ProtectedRoute><AITranslatePage /></ProtectedRoute>} />
      <Route path="/content/:id/publish" element={<ProtectedRoute><ChannelPublishPage /></ProtectedRoute>} />
      <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      <Route path="/review/:id" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      <Route path="/editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
      <Route path="/editor/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-gray-500">404 Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;
