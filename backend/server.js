import express from 'express';
import cors from 'cors';
import { studentsRouter } from './routes/students.js';
import { coursesRouter } from './routes/courses.js';
import { authRouter } from './routes/auth.js';
import { ensureDatabase } from './utils/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

ensureDatabase();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Student Course Registration API is running.' });
});

app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
