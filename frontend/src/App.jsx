import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminProtectedRoute } from './components/AdminProtectedRoute.jsx';
import { AdminLayout } from './components/AdminLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AdminLoginPage } from './pages/AdminLoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { CoursesPage } from './pages/CoursesPage.jsx';
import { useStudent } from './context/StudentContext.jsx';
import { useAdmin } from './context/AdminContext.jsx';
import { AdminPage } from './pages/AdminPage.jsx';

export default function App() {
  const { student } = useStudent();
  const { admin } = useAdmin();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to={student ? '/dashboard' : admin ? '/admin' : '/login'} replace />} />
    </Routes>
  );
}
