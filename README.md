# Hostel Management System — MERN Stack

A full-featured hostel management system rebuilt from PHP to **MongoDB + Express + React + Node.js**.

## Features

### Student
- Register / Login with roll number
- Browse hostels (Attached ₹75k/yr, Non-attached ₹65k/yr)
- Select floor → view rooms → book individual beds
- Optional parent email notification on booking
- Submit hostel application with special requests
- Submit and track leave requests
- Submit and track complaints/messages

### Hostel Manager
- Login and manage assigned hostel
- View allocated rooms with student details
- Vacate beds
- View & unlock empty rooms for booking
- Manually allocate rooms to students
- Approve / reject leave requests with remarks
- Resolve student complaints

### Admin
- Full system dashboard with stats
- Appoint and remove hostel managers
- View all students across all hostels

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Express.js + Node.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer (Gmail SMTP) |

## Project Structure

```
Hostel-Management-MERN/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # Mongoose schemas
│   │   ├── Student.js
│   │   ├── Manager.js
│   │   ├── Hostel.js
│   │   ├── Room.js
│   │   ├── Application.js
│   │   ├── Message.js
│   │   └── LeaveRequest.js
│   ├── routes/               # Express API routes
│   │   ├── auth.js
│   │   ├── student.js
│   │   ├── hostel.js
│   │   ├── room.js
│   │   ├── application.js
│   │   ├── message.js
│   │   ├── leave.js
│   │   ├── manager.js
│   │   └── admin.js
│   ├── middleware/auth.js     # JWT + role middleware
│   ├── utils/email.js        # Nodemailer helper
│   ├── seed.js               # DB seed script
│   └── server.js             # Express app entry
└── frontend/
    └── src/
        ├── api/axios.js       # Axios instance with JWT
        ├── contexts/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PrivateRoute.jsx
        │   └── ui/Spinner.jsx
        └── pages/
            ├── auth/          # Login & Signup
            ├── student/       # Student portal pages
            ├── manager/       # Manager portal pages
            └── admin/         # Admin portal pages
```

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Seed the database

```bash
cd backend
node seed.js
# Creates 4 hostels (A, B, C, D) with rooms + admin account
# Admin login: username=admin, password=admin123
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/student/register` | Public | Student register |
| POST | `/api/auth/student/login` | Public | Student login |
| POST | `/api/auth/manager/login` | Public | Manager/Admin login |
| GET | `/api/students/profile` | Student | Get own profile |
| GET | `/api/hostels/type/:type` | Any | Get hostels by type |
| GET | `/api/hostels/:id/floors/:floor/rooms` | Any | Get rooms on floor |
| POST | `/api/rooms/:id/book` | Student | Book a bed |
| POST | `/api/rooms/:id/vacate` | Student/Manager | Vacate a bed |
| POST | `/api/applications` | Student | Submit application |
| POST | `/api/messages` | Student | Submit complaint |
| POST | `/api/leave` | Student | Submit leave request |
| GET | `/api/managers/rooms/allocated` | Manager | Allocated rooms |
| GET | `/api/managers/rooms/empty` | Manager | Empty rooms |
| POST | `/api/managers/allocate` | Manager | Allocate room |
| GET | `/api/leave` | Manager | All leave requests |
| PUT | `/api/leave/:id` | Manager | Approve/reject leave |
| PUT | `/api/messages/:id/resolve` | Manager | Resolve complaint |
| GET | `/api/admin/dashboard` | Admin | System stats |
| POST | `/api/admin/managers` | Admin | Create manager |
| DELETE | `/api/admin/managers/:id` | Admin | Remove manager |
| POST | `/api/admin/hostels` | Admin | Create hostel + rooms |
