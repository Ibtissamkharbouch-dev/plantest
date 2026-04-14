import express from 'express';
import { readDb, writeDb } from '../utils/db.js';

export const coursesRouter = express.Router();

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

coursesRouter.get('/', (req, res) => {
  const { department, term, availableOnly, search } = req.query;
  const db = readDb();

  let courses = db.courses.map((course) => ({
    ...course,
    availableSeats: course.capacity - course.enrolledStudentIds.length
  }));

  if (department) {
    courses = courses.filter((course) => course.department.toLowerCase() === String(department).toLowerCase());
  }

  if (term) {
    courses = courses.filter((course) => course.term.toLowerCase() === String(term).toLowerCase());
  }

  if (availableOnly === 'true') {
    courses = courses.filter((course) => course.availableSeats > 0);
  }

  if (search) {
    const value = String(search).toLowerCase();
    courses = courses.filter((course) =>
      [course.code, course.title, course.instructor, course.department].some((field) =>
        field.toLowerCase().includes(value)
      )
    );
  }

  res.json(courses);
});

coursesRouter.post('/', (req, res) => {
  const db = readDb();
  const {
    id,
    code,
    title,
    department,
    instructor,
    credits,
    term,
    schedule,
    room,
    capacity,
    prerequisites,
    description
  } = req.body;

  const normalizedId = String(id || code || '').trim().toUpperCase();
  const normalizedCode = String(code || id || '').trim().toUpperCase();
  const normalizedTitle = String(title || '').trim();
  const normalizedDepartment = String(department || '').trim();
  const normalizedInstructor = String(instructor || '').trim();
  const normalizedTerm = String(term || '').trim();
  const normalizedSchedule = String(schedule || '').trim();
  const normalizedRoom = String(room || '').trim();
  const normalizedDescription = String(description || '').trim();
  const normalizedCredits = Number(credits);
  const normalizedCapacity = Number(capacity);
  const normalizedPrerequisites = normalizeList(prerequisites).map((item) => item.toUpperCase());

  if (
    !normalizedId ||
    !normalizedCode ||
    !normalizedTitle ||
    !normalizedDepartment ||
    !normalizedInstructor ||
    !normalizedTerm ||
    !normalizedSchedule ||
    !normalizedRoom ||
    !normalizedDescription ||
    !Number.isFinite(normalizedCredits) ||
    !Number.isFinite(normalizedCapacity)
  ) {
    return res.status(400).json({
      message: 'Course code, title, department, instructor, credits, term, schedule, room, capacity, and description are required.'
    });
  }

  if (normalizedCredits <= 0 || normalizedCapacity <= 0) {
    return res.status(400).json({ message: 'Credits and capacity must be greater than 0.' });
  }

  if (
    db.courses.some(
      (course) =>
        course.id.toLowerCase() === normalizedId.toLowerCase() || course.code.toLowerCase() === normalizedCode.toLowerCase()
    )
  ) {
    return res.status(400).json({ message: 'A course with this code already exists.' });
  }

  const newCourse = {
    id: normalizedId,
    code: normalizedCode,
    title: normalizedTitle,
    department: normalizedDepartment,
    instructor: normalizedInstructor,
    credits: normalizedCredits,
    term: normalizedTerm,
    schedule: normalizedSchedule,
    room: normalizedRoom,
    capacity: normalizedCapacity,
    enrolledStudentIds: [],
    prerequisites: normalizedPrerequisites,
    description: normalizedDescription
  };

  db.courses.push(newCourse);
  writeDb(db);

  return res.status(201).json({
    message: 'Course created successfully.',
    course: {
      ...newCourse,
      availableSeats: newCourse.capacity
    }
  });
});
