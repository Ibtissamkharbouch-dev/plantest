import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';

export function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return <div className="centered-page">Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
