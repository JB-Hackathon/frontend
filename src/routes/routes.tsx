import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ReviewPage from '@/pages/ReviewPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/review/:id" element={<ReviewPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;