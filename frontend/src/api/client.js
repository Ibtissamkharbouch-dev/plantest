async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  studentLogin: async (studentId, password) =>
    handleResponse(
      await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password })
      })
    ),
  adminLogin: async (username, password) =>
    handleResponse(
      await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
    ),
  getStudents: async () => handleResponse(await fetch('/api/students')),
  getStudent: async (studentId) => handleResponse(await fetch(`/api/students/${studentId}`)),
  createStudent: async (payload) =>
    handleResponse(
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    ),
  getCourses: async (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        searchParams.set(key, value);
      }
    });
    const query = searchParams.toString();
    return handleResponse(await fetch(`/api/courses${query ? `?${query}` : ''}`));
  },
  createCourse: async (payload) =>
    handleResponse(
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    ),
  registerCourse: async (studentId, courseId) =>
    handleResponse(
      await fetch(`/api/students/${studentId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
    ),
  dropCourse: async (studentId, courseId) =>
    handleResponse(
      await fetch(`/api/students/${studentId}/register/${courseId}`, {
        method: 'DELETE'
      })
    )
};
