import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const StudentContext = createContext(null);
const STORAGE_KEY = 'student-registration-active-student';

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  const refreshStudents = async () => {
    const availableStudents = await api.getStudents();
    setStudents(availableStudents);
    return availableStudents;
  };

  useEffect(() => {
    async function bootstrap() {
      try {
        await refreshStudents();

        const savedStudentId = localStorage.getItem(STORAGE_KEY);
        if (savedStudentId) {
          const profile = await api.getStudent(savedStudentId);
          setStudent(profile);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  const login = async (studentId, password) => {
    const result = await api.studentLogin(studentId, password);
    localStorage.setItem(STORAGE_KEY, result.student.id);
    const profile = await api.getStudent(result.student.id);
    setStudent(profile);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudent(null);
  };

  const refreshStudent = async () => {
    if (!student?.id) return;
    const profile = await api.getStudent(student.id);
    setStudent(profile);
    return profile;
  };

  const value = useMemo(
    () => ({ student, students, loading, login, logout, refreshStudent, refreshStudents, setStudent }),
    [student, students, loading]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
}
