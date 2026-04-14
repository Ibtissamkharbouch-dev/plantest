import express from 'express';
import { readDb } from '../utils/db.js';

export const authRouter = express.Router();

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

function sanitizeStudent(student) {
  const { password, ...safeStudent } = student;
  return safeStudent;
}

authRouter.post('/student-login', (req, res) => {
  const db = readDb();
  const { studentId, password } = req.body;

  const normalizedStudentId = String(studentId || '').trim().toUpperCase();
  const normalizedPassword = String(password || '');

  if (!normalizedStudentId || !normalizedPassword) {
    return res.status(400).json({ message: 'Student ID and password are required.' });
  }

  const student = db.students.find((item) => item.id.toUpperCase() === normalizedStudentId);

  if (!student || String(student.password || '') !== normalizedPassword) {
    return res.status(401).json({ message: 'Invalid student ID or password.' });
  }

  return res.json({
    message: 'Student login successful.',
    student: sanitizeStudent(student)
  });
});

authRouter.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  if (String(username || '') !== ADMIN_USERNAME || String(password || '') !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin username or password.' });
  }

  return res.json({
    message: 'Admin login successful.',
    admin: {
      username: ADMIN_USERNAME,
      name: 'System Administrator'
    }
  });
});
