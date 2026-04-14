import { Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';

export function AdminLayout() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Student and course management</p>
        </div>

        <div className="student-card">
          <strong>{admin?.name}</strong>
          <span>{admin?.username}</span>
          <span>Administrator</span>
        </div>

        <div className="nav-links">
          <span className="nav-static-item">Administration Panel</span>
        </div>

        <button className="secondary-button" onClick={handleLogout}>Sign out</button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
