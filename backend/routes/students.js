import express from 'express';
import { readDb, writeDb } from '../utils/db.js';

export const studentsRouter = express.Router();

function computeStudentRegistrations(db, studentId) {
  const registeredCourses = db.courses
    .filter((course) => course.enrolledStudentIds.includes(studentId))
    .map((course) => ({
      ...course,
      availableSeats: course.capacity - course.enrolledStudentIds.length
    }));

  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);

  return { registeredCourses, totalCredits };
}

function sanitizeStudent(student) {
  const { password, ...safeStudent } = student;
  return safeStudent;
}

function normalizeCompletedCourses(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

studentsRouter.get('/', (_req, res) => {
  const db = readDb();
  const students = db.students.map(({ completedCourses, password, ...student }) => student);
  res.json(students);
});

studentsRouter.post('/', (req, res) => {
  const db = readDb();
  const { id, name, major, year, maxCredits, completedCourses, password } = req.body;

  const normalizedId = String(id || '').trim().toUpperCase();
  const normalizedName = String(name || '').trim();
  const normalizedMajor = String(major || '').trim();
  const normalizedYear = String(year || '').trim();
  const normalizedMaxCredits = Number(maxCredits);
  const normalizedCompletedCourses = normalizeCompletedCourses(completedCourses);
  const normalizedPassword = String(password || '').trim();

  if (!normalizedId || !normalizedName || !normalizedMajor || !normalizedYear || !Number.isFinite(normalizedMaxCredits) || !normalizedPassword) {
    return res.status(400).json({ message: 'Student ID, name, major, year, password, and max credits are required.' });
  }

  if (normalizedMaxCredits <= 0) {
    return res.status(400).json({ message: 'Max credits must be greater than 0.' });
  }

  if (db.students.some((student) => student.id.toLowerCase() === normalizedId.toLowerCase())) {
    return res.status(400).json({ message: 'A student with this ID already exists.' });
  }

  const newStudent = {
    id: normalizedId,
    name: normalizedName,
    major: normalizedMajor,
    year: normalizedYear,
    maxCredits: normalizedMaxCredits,
    completedCourses: normalizedCompletedCourses,
    password: normalizedPassword
  };

  db.students.push(newStudent);
  writeDb(db);

  return res.status(201).json({
    message: 'Student created successfully.',
    student: {
      id: newStudent.id,
      name: newStudent.name,
      major: newStudent.major,
      year: newStudent.year,
      maxCredits: newStudent.maxCredits
    }
  });
});

studentsRouter.get('/:studentId', (req, res) => {
  const db = readDb();
  const student = db.students.find((item) => item.id === req.params.studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const { registeredCourses, totalCredits } = computeStudentRegistrations(db, student.id);
  return res.json({ ...sanitizeStudent(student), registeredCourses, totalCredits });
});

studentsRouter.get('/:studentId/registrations', (req, res) => {
  const db = readDb();
  const student = db.students.find((item) => item.id === req.params.studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  return res.json(computeStudentRegistrations(db, student.id));
});

studentsRouter.post('/:studentId/register', (req, res) => {
  const { courseId } = req.body;
  const studentId = req.params.studentId;
  const db = readDb();

  const student = db.students.find((item) => item.id === studentId);
  const course = db.courses.find((item) => item.id === courseId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  if (course.enrolledStudentIds.includes(studentId)) {
    return res.status(400).json({ message: 'Student is already registered for this course.' });
  }

  if (course.enrolledStudentIds.length >= course.capacity) {
    return res.status(400).json({ message: 'Course is full.' });
  }

  const missingPrerequisites = course.prerequisites.filter(
    (prerequisite) => !student.completedCourses.includes(prerequisite)
  );

  if (missingPrerequisites.length > 0) {
    return res.status(400).json({
      message: `Missing prerequisites: ${missingPrerequisites.join(', ')}`
    });
  }

  const { totalCredits } = computeStudentRegistrations(db, studentId);
  if (totalCredits + course.credits > student.maxCredits) {
    return res.status(400).json({
      message: `Credit limit exceeded. Maximum allowed is ${student.maxCredits}.`
    });
  }

  course.enrolledStudentIds.push(studentId);
  writeDb(db);

  const updated = computeStudentRegistrations(db, studentId);
  return res.status(201).json({ message: 'Registration successful.', ...updated });
});

studentsRouter.delete('/:studentId/register/:courseId', (req, res) => {
  const { studentId, courseId } = req.params;
  const db = readDb();

  const student = db.students.find((item) => item.id === studentId);
  const course = db.courses.find((item) => item.id === courseId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  if (!course.enrolledStudentIds.includes(studentId)) {
    return res.status(400).json({ message: 'Student is not registered for this course.' });
  }

  course.enrolledStudentIds = course.enrolledStudentIds.filter((id) => id !== studentId);
  writeDb(db);

  const updated = computeStudentRegistrations(db, studentId);
  return res.json({ message: 'Course dropped successfully.', ...updated });
});
