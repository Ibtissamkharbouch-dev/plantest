# Student Course Registration App

A full-stack web application for student course registration built with:

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **Persistence:** JSON file-based storage seeded with sample students, courses, and registrations

## Features

- Separate **student** and **admin** login pages
- Simple password authentication for both students and admin
- Student dashboard with current registrations and credit summary
- Browse all available courses
- Search and filter by department, term, and available seats
- Register for courses with validation for:
  - duplicate enrollment
  - course capacity
  - maximum credit limit
  - prerequisites
- Drop registered courses
- Dedicated **admin dashboard** for:
  - creating new students
  - creating new courses
- Demo data so the app runs immediately after setup

## Project Structure

```text
student-course-registration-app/
  backend/
  frontend/
  package.json
```

## Requirements

- Node.js 18+
- npm 9+

## Run in VS Code

Open the extracted folder in VS Code, then use the integrated terminal from the project root.

### 1) Install dependencies

```bash
npm run install:all
```

### 2) Start the backend

```bash
npm run dev:backend
```

The backend runs at `http://localhost:4000`.

### 3) Start the frontend in a second terminal

```bash
npm run dev:frontend
```

The frontend runs at `http://localhost:5173`.

## Login Credentials

### Student Portal (`/login`)

- `S1001` / `alice123`
- `S1002` / `brian123`
- `S1003` / `sofia123`

### Admin Portal (`/admin/login`)

- Username: `admin`
- Password: `admin`

## API Endpoints

- `GET /api/health`
- `POST /api/auth/student-login`
- `POST /api/auth/admin-login`
- `GET /api/students`
- `POST /api/students`
- `GET /api/students/:studentId`
- `GET /api/students/:studentId/registrations`
- `POST /api/students/:studentId/register`
- `DELETE /api/students/:studentId/register/:courseId`
- `GET /api/courses`
- `POST /api/courses`

## Notes

- Data is stored in `backend/data/db.json`.
- Student passwords are stored in the JSON file for this simple demo app.
- The seeded admin account is fixed as `admin` / `admin`.
- New student accounts created by the admin dashboard require a password.
