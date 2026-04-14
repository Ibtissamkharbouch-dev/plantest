import { Navigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext.jsx';

export function ProtectedRoute({ children }) {
  const { student, loading } = useStudent();

  if (loading) {
    return <div className="centered-page">Loading...</div>;
  }

  if (!student) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
