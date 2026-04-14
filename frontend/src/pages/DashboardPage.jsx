import { useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { StatsCard } from '../components/StatsCard.jsx';
import { useStudent } from '../context/StudentContext.jsx';

export function DashboardPage() {
  const { student, refreshStudent } = useStudent();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busyCourseId, setBusyCourseId] = useState('');

  const remainingCredits = useMemo(() => student.maxCredits - student.totalCredits, [student]);

  const handleDrop = async (courseId) => {
    try {
      setBusyCourseId(courseId);
      setMessage('');
      setError('');
      const result = await api.dropCourse(student.id, courseId);
      setMessage(result.message);
      await refreshStudent();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyCourseId('');
    }
  };

  return (
    <div className="page-stack">
      <section>
        <h2>Welcome back, {student.name}</h2>
        <p>Review your current registrations, credit usage, and available space in your schedule.</p>
      </section>

      <section className="stats-grid">
        <StatsCard label="Current Credits" value={student.totalCredits} hint={`Max allowed: ${student.maxCredits}`} />
        <StatsCard label="Remaining Credits" value={remainingCredits} hint="Based on your academic limit" />
        <StatsCard label="Registered Courses" value={student.registeredCourses.length} hint="For the active term" />
      </section>

      {message ? <div className="alert success-alert">{message}</div> : null}
      {error ? <div className="alert error-alert">{error}</div> : null}

      <section className="card">
        <div className="section-header">
          <h3>My Current Schedule</h3>
        </div>

        {student.registeredCourses.length === 0 ? (
          <p>You are not registered for any courses yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Schedule</th>
                  <th>Credits</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {student.registeredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong>{course.code}</strong>
                      <div>{course.title}</div>
                    </td>
                    <td>{course.instructor}</td>
                    <td>{course.schedule}</td>
                    <td>{course.credits}</td>
                    <td>
                      <button
                        className="danger-button small-button"
                        onClick={() => handleDrop(course.id)}
                        disabled={busyCourseId === course.id}
                      >
                        Drop
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
