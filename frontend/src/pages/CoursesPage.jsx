import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { CourseCard } from '../components/CourseCard.jsx';
import { useStudent } from '../context/StudentContext.jsx';

export function CoursesPage() {
  const { student, refreshStudent } = useStudent();
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ search: '', department: '', term: '', availableOnly: false });
  const [loading, setLoading] = useState(true);
  const [busyCourseId, setBusyCourseId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses({
        search: filters.search,
        department: filters.department,
        term: filters.term,
        availableOnly: filters.availableOnly
      });
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters.search, filters.department, filters.term, filters.availableOnly]);

  const departments = useMemo(
    () => Array.from(new Set(courses.map((course) => course.department))).sort((a, b) => a.localeCompare(b)),
    [courses]
  );

  const terms = useMemo(
    () => Array.from(new Set(courses.map((course) => course.term))).sort((a, b) => a.localeCompare(b)),
    [courses]
  );

  const registeredIds = useMemo(
    () => new Set((student?.registeredCourses || []).map((course) => course.id)),
    [student]
  );

  const handleRegister = async (courseId) => {
    try {
      setBusyCourseId(courseId);
      setMessage('');
      setError('');
      const result = await api.registerCourse(student.id, courseId);
      setMessage(result.message);
      await Promise.all([refreshStudent(), fetchCourses()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyCourseId('');
    }
  };

  const handleDrop = async (courseId) => {
    try {
      setBusyCourseId(courseId);
      setMessage('');
      setError('');
      const result = await api.dropCourse(student.id, courseId);
      setMessage(result.message);
      await Promise.all([refreshStudent(), fetchCourses()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyCourseId('');
    }
  };

  return (
    <div className="page-stack">
      <section>
        <h2>Browse Courses</h2>
        <p>Search the course catalog, check prerequisites and seat availability, and add or drop classes.</p>
      </section>

      <section className="card filters-card">
        <div className="section-header">
          <div>
            <h3>Find a Course</h3>
            <p>Filter by keyword, department, term, or seat availability.</p>
          </div>
        </div>

        <div className="filters-grid">
          <input
            type="text"
            placeholder="Search by title, course code, instructor..."
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
          />

          <select
            value={filters.department}
            onChange={(event) => setFilters((prev) => ({ ...prev, department: event.target.value }))}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select value={filters.term} onChange={(event) => setFilters((prev) => ({ ...prev, term: event.target.value }))}>
            <option value="">All terms</option>
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(event) => setFilters((prev) => ({ ...prev, availableOnly: event.target.checked }))}
            />
            Show only available courses
          </label>
        </div>
      </section>

      {message ? <div className="alert success-alert">{message}</div> : null}
      {error ? <div className="alert error-alert">{error}</div> : null}

      <section className="course-list">
        {loading ? (
          <div className="card">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="card">No courses match the selected filters.</div>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              registered={registeredIds.has(course.id)}
              onRegister={handleRegister}
              onDrop={handleDrop}
              busy={busyCourseId === course.id}
            />
          ))
        )}
      </section>
    </div>
  );
}
