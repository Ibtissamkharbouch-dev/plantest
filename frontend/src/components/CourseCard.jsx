export function CourseCard({ course, registered, onRegister, onDrop, busy }) {
  const availableSeats = course.capacity - course.enrolledStudentIds.length;

  return (
    <div className="card course-card">
      <div className="course-card-header">
        <div>
          <h3>{course.code} — {course.title}</h3>
          <p>{course.department} • {course.term}</p>
        </div>
        <span className={`badge ${availableSeats > 0 ? 'badge-open' : 'badge-closed'}`}>
          {availableSeats > 0 ? `${availableSeats} seats left` : 'Full'}
        </span>
      </div>

      <p className="course-description">{course.description}</p>

      <div className="course-grid">
        <div><strong>Instructor:</strong> {course.instructor}</div>
        <div><strong>Credits:</strong> {course.credits}</div>
        <div><strong>Schedule:</strong> {course.schedule}</div>
        <div><strong>Room:</strong> {course.room}</div>
        <div><strong>Prerequisites:</strong> {course.prerequisites.length ? course.prerequisites.join(', ') : 'None'}</div>
        <div><strong>Enrolled:</strong> {course.enrolledStudentIds.length}/{course.capacity}</div>
      </div>

      <div className="course-actions">
        {registered ? (
          <button className="danger-button" onClick={() => onDrop(course.id)} disabled={busy}>
            Drop Course
          </button>
        ) : (
          <button className="primary-button" onClick={() => onRegister(course.id)} disabled={busy || availableSeats === 0}>
            Register
          </button>
        )}
      </div>
    </div>
  );
}
