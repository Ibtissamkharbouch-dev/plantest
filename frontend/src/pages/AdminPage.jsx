import { useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { useStudent } from '../context/StudentContext.jsx';

const initialStudentForm = {
  id: '',
  name: '',
  major: '',
  year: 'Freshman',
  maxCredits: 15,
  completedCourses: '',
  password: ''
};

const initialCourseForm = {
  code: '',
  title: '',
  department: '',
  instructor: '',
  credits: 3,
  term: 'Fall 2026',
  schedule: '',
  room: '',
  capacity: 30,
  prerequisites: '',
  description: ''
};

export function AdminPage() {
  const { students, refreshStudents } = useStudent();
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [studentBusy, setStudentBusy] = useState(false);
  const [courseBusy, setCourseBusy] = useState(false);
  const [studentMessage, setStudentMessage] = useState('');
  const [studentError, setStudentError] = useState('');
  const [courseMessage, setCourseMessage] = useState('');
  const [courseError, setCourseError] = useState('');
  const [recentCourse, setRecentCourse] = useState(null);

  const studentIds = useMemo(() => students.map((item) => item.id), [students]);

  const handleCreateStudent = async (event) => {
    event.preventDefault();
    setStudentMessage('');
    setStudentError('');

    try {
      setStudentBusy(true);
      const result = await api.createStudent(studentForm);
      await refreshStudents();
      setStudentForm(initialStudentForm);
      setStudentMessage(`${result.message} New ID: ${result.student.id}.`);
    } catch (err) {
      setStudentError(err.message);
    } finally {
      setStudentBusy(false);
    }
  };

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    setCourseMessage('');
    setCourseError('');

    try {
      setCourseBusy(true);
      const result = await api.createCourse(courseForm);
      setCourseForm(initialCourseForm);
      setRecentCourse(result.course);
      setCourseMessage(`${result.message} New code: ${result.course.code}.`);
    } catch (err) {
      setCourseError(err.message);
    } finally {
      setCourseBusy(false);
    }
  };

  return (
    <div className="page-stack">
      <section>
        <h2>Admin Dashboard</h2>
        <p>Create and manage academic records from one place. Use this page to add students and publish new courses.</p>
      </section>

      <section className="stats-grid">
        <div className="card stat-card">
          <span className="stat-label">Student Accounts</span>
          <strong className="stat-value">{students.length}</strong>
          <span className="stat-hint">Available for sign-in</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Latest Student IDs</span>
          <strong className="stat-value admin-mini-list">{studentIds.slice(-3).join(', ') || 'None'}</strong>
          <span className="stat-hint">Most recently visible records</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Latest Course</span>
          <strong className="stat-value admin-mini-list">{recentCourse ? recentCourse.code : 'Not created yet'}</strong>
          <span className="stat-hint">Updates after a new course is added</span>
        </div>
      </section>

      <div className="admin-grid">
        <section className="card">
          <div className="section-header">
            <div>
              <h3>Create Student</h3>
              <p>Add a new student profile for portal access.</p>
            </div>
          </div>

          <form onSubmit={handleCreateStudent} className="form-grid">
            <input
              type="text"
              placeholder="Student ID (e.g. S2001)"
              value={studentForm.id}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, id: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Full name"
              value={studentForm.name}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Major"
              value={studentForm.major}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, major: event.target.value }))}
            />
            <select
              value={studentForm.year}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, year: event.target.value }))}
            >
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Graduate</option>
            </select>
            <input
              type="number"
              min="1"
              placeholder="Max credits"
              value={studentForm.maxCredits}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, maxCredits: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Completed courses (comma-separated)"
              value={studentForm.completedCourses}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, completedCourses: event.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={studentForm.password}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, password: event.target.value }))}
            />

            {studentMessage ? <div className="alert success-alert full-width-input">{studentMessage}</div> : null}
            {studentError ? <div className="alert error-alert full-width-input">{studentError}</div> : null}

            <button type="submit" className="primary-button full-width-input" disabled={studentBusy}>
              {studentBusy ? 'Creating student...' : 'Create Student'}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="section-header">
            <div>
              <h3>Create Course</h3>
              <p>Publish a new course offering for registration.</p>
            </div>
          </div>

          <form onSubmit={handleCreateCourse} className="form-grid">
            <input
              type="text"
              placeholder="Course code (e.g. CS350)"
              value={courseForm.code}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, code: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Course title"
              value={courseForm.title}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Department"
              value={courseForm.department}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, department: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Instructor"
              value={courseForm.instructor}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, instructor: event.target.value }))}
            />
            <input
              type="number"
              min="1"
              placeholder="Credits"
              value={courseForm.credits}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, credits: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Term (e.g. Fall 2026)"
              value={courseForm.term}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, term: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Schedule"
              value={courseForm.schedule}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, schedule: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Room"
              value={courseForm.room}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, room: event.target.value }))}
            />
            <input
              type="number"
              min="1"
              placeholder="Capacity"
              value={courseForm.capacity}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, capacity: event.target.value }))}
            />
            <input
              type="text"
              placeholder="Prerequisites (comma-separated)"
              value={courseForm.prerequisites}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, prerequisites: event.target.value }))}
            />
            <textarea
              rows="5"
              placeholder="Course description"
              value={courseForm.description}
              onChange={(event) => setCourseForm((prev) => ({ ...prev, description: event.target.value }))}
            />

            {courseMessage ? <div className="alert success-alert full-width-input">{courseMessage}</div> : null}
            {courseError ? <div className="alert error-alert full-width-input">{courseError}</div> : null}

            <button type="submit" className="primary-button full-width-input" disabled={courseBusy}>
              {courseBusy ? 'Creating course...' : 'Create Course'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
