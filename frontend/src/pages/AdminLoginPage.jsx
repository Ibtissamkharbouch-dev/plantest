import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext.jsx';

export function AdminLoginPage() {
  const { admin, loading, login } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && admin) {
      navigate('/admin', { replace: true });
    }
  }, [admin, loading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="centered-page gradient-bg">
      <div className="card login-card">
        <h1>Administrator Access</h1>
        <p>Use the dedicated administrator account to create students and publish courses.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="adminUsername">Username</label>
          <input
            id="adminUsername"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
          />

          <label htmlFor="adminPassword">Password</label>
          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="admin"
          />

          {error ? <div className="alert error-alert">{error}</div> : null}

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Open Admin Dashboard'}
          </button>
        </form>

        <div className="demo-box">
          <strong>Demo admin credentials</strong>
          <span>Username: admin</span>
          <span>Password: admin</span>
        </div>

        <div className="admin-note">
          <strong>Student account?</strong>
          <Link to="/login">Go to the student login page</Link>
        </div>
      </div>
    </div>
  );
}
