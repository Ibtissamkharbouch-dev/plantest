import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext.jsx';

export function Layout() {
  const { student, logout } = useStudent();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Course Registration</h1>
          <p className="subtitle">Student portal</p>
        </div>

        <div className="student-card">
          <strong>{student?.name}</strong>
          <span>{student?.id}</span>
          <span>{student?.major}</span>
          <span>{student?.year}</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/courses">Browse Courses</NavLink>
        </nav>

        <button className="secondary-button" onClick={handleLogout}>Sign out</button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
