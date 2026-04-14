import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext.jsx';

export function LoginPage() {
  const { students, login, student, loading } = useStudent();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && student) {
      navigate('/dashboard', { replace: true });
    }
  }, [student, loading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!studentId || !password) {
      setError('Please enter both student ID and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(studentId, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="centered-page gradient-bg">
      <div className="card login-card">
        <h1>Student Course Registration</h1>
        <p>Sign in with your student account to manage schedule changes and course enrollments.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="studentId">Student ID</label>
          <input
            id="studentId"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="e.g. S1001"
          />

          <label htmlFor="studentPassword">Password</label>
          <input
            id="studentPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />

          {error ? <div className="alert error-alert">{error}</div> : null}

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Enter Student Portal'}
          </button>
        </form>

        <div className="demo-box">
          <strong>Demo student credentials</strong>
          <span>S1001 / alice123</span>
          <span>S1002 / brian123</span>
          <span>S1003 / sofia123</span>
        </div>

        <div className="admin-note">
          <strong>Administrator?</strong>
          <Link to="/admin/login">Go to the separate admin login</Link>
        </div>

        <div className="demo-box">
          <strong>Available student IDs</strong>
          <span>{students.map((item) => item.id).join(', ')}</span>
        </div>
      </div>
    </div>
  );
}
