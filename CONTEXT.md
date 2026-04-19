# Hostel Management System — MERN Rebuild Context

## Project Overview
Full rebuild of a PHP-based Hostel Management System into MERN stack.

- **Original project:** `/Users/akshit/Freelance/portfolio/Hostel-Management/` (PHP + MySQL)
- **MERN project:** `/Users/akshit/Freelance/portfolio/Hostel-Management-MERN/`
- **Status:** Core system complete, some polish and minor pages missing

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS + react-router-dom v6 |
| Backend | Express.js + Node.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (stored in localStorage) |
| Email | Nodemailer (Gmail SMTP via .env) |
| Toast notifications | react-hot-toast |

---

## Three User Roles

| Role | Login URL | Default redirect after login |
|------|-----------|------------------------------|
| Student | `/` | `/home` |
| Hostel Manager | `/manager/login` | `/manager/home` |
| Admin | `/manager/login` (same form) | `/admin/home` |

Admin is a Manager with `isAdmin: true` in DB. JWT payload carries `role` field.

---

## Database — Mongoose Models

| Model | File | Key fields |
|-------|------|-----------|
| Student | `models/Student.js` | rollNo, firstName, lastName, mobileNo, department, yearOfStudy, password (bcrypt), hostel (ref), room (ref), bed |
| Manager | `models/Manager.js` | username, firstName, lastName, email, mobileNo, password (bcrypt), hostel (ref), isAdmin |
| Hostel | `models/Hostel.js` | name, type (attached/non-attached), totalRooms, feePerYear, floors, roomsPerFloor, bedsPerRoom |
| Room | `models/Room.js` | hostel (ref), floor, roomNumber, type, totalBeds, beds[] (bedLabel, isBooked, student ref), isUnlocked, isFull |
| Application | `models/Application.js` | student (ref), hostel (ref), roomNo, message, status (pending/approved/rejected) |
| Message | `models/Message.js` | sender, senderModel, receiver, receiverModel, hostel (ref), subject, message, status (pending/resolved), resolvedAt, resolvedBy |
| LeaveRequest | `models/LeaveRequest.js` | student (ref), manager (ref), hostel (ref), title, body, status (pending/approved/rejected), decidedAt, decidedBy, remarks |

### Roll Number Format (validated in model)
```
02fe + year(22-26) + dept(bcs|bci|bme|bca|bee|bch|bcv) + 3 digits
Example: 02fe22bcs117
```

---

## Backend — API Routes

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/student/register` | Public | Register student, returns JWT |
| POST | `/student/login` | Public | Login student, returns JWT + user object |
| POST | `/manager/login` | Public | Login manager/admin, returns JWT + role |

### Students (`/api/students`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | Student | Own profile with hostel+room populated |
| GET | `/` | Manager/Admin | List students (manager sees own hostel only) |
| GET | `/:id` | Manager/Admin | Single student detail |

### Hostels (`/api/hostels`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Any | All hostels |
| GET | `/type/:type` | Any | Hostels by type (attached/non-attached) |
| GET | `/:id` | Any | Single hostel |
| GET | `/:id/floors/:floor/rooms` | Any | Rooms on a specific floor |

### Rooms (`/api/rooms`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id` | Any | Room details with bed occupancy |
| POST | `/:id/book` | Student | Book a bed (body: bedLabel, parentEmail?) |
| POST | `/:id/vacate` | Student/Manager | Vacate a bed (manager passes studentId) |

### Applications (`/api/applications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Student | Submit application |
| GET | `/my` | Student | Own applications |
| GET | `/` | Manager/Admin | All applications for their hostel |
| PUT | `/:id` | Manager/Admin | Approve/reject application |

### Messages/Complaints (`/api/messages`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Student | Submit complaint to hostel manager |
| GET | `/my` | Student | Own complaints |
| GET | `/` | Manager/Admin | All complaints for their hostel |
| PUT | `/:id/resolve` | Manager/Admin | Resolve complaint |

### Leave Requests (`/api/leave`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Student | Submit leave request |
| GET | `/my` | Student | Own leave requests |
| GET | `/` | Manager/Admin | All leaves for their hostel |
| PUT | `/:id` | Manager/Admin | Approve/reject with remarks |

### Managers (`/api/managers`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | Manager/Admin | Own profile |
| GET | `/rooms/allocated` | Manager/Admin | Rooms with booked beds |
| GET | `/rooms/empty` | Manager/Admin | Rooms with free beds |
| POST | `/rooms/unlock` | Manager/Admin | Unlock a room for booking |
| POST | `/allocate` | Manager/Admin | Manually assign student to bed |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Admin | System-wide stats |
| GET | `/managers` | Admin | All non-admin managers |
| POST | `/managers` | Admin | Create hostel manager |
| DELETE | `/managers/:id` | Admin | Remove manager |
| GET | `/students` | Admin | All students |
| GET | `/hostels` | Admin | All hostels |
| POST | `/hostels` | Admin | Create hostel + auto-generate rooms |

---

## Frontend — Pages

### Auth Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/auth/StudentLogin.jsx` | `/` | Student login form |
| `pages/auth/StudentSignup.jsx` | `/signup` | Student registration with all validations |
| `pages/auth/ManagerLogin.jsx` | `/manager/login` | Manager + Admin login |

### Student Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/student/Dashboard.jsx` | `/home` | Welcome banner with allocation status + quick links |
| `pages/student/Profile.jsx` | `/profile` | Full profile: personal info + room allocation details |
| `pages/student/Services.jsx` | `/services` | Choose hostel type: Attached (₹75k) vs Non-Attached (₹65k) |
| `pages/student/SelectFloor.jsx` | `/select-floor?type=` | Pick hostel block + floor |
| `pages/student/RoomView.jsx` | `/room?hostelId=&type=&floor=` | Room grid with bed status + booking modal (parent email optional) |
| `pages/student/ApplicationForm.jsx` | `/apply` | Submit hostel application + view own applications |
| `pages/student/LeaveRequest.jsx` | `/leave` | Submit leave + view leave history with status |
| `pages/student/Messages.jsx` | `/messages` | Submit complaint + view complaint history |

### Manager Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/manager/Dashboard.jsx` | `/manager/home` | Stats cards + quick action links |
| `pages/manager/AllocatedRooms.jsx` | `/manager/allocated` | All booked rooms with student details + vacate button |
| `pages/manager/EmptyRooms.jsx` | `/manager/empty` | Table of empty rooms + unlock button |
| `pages/manager/AllocateRoom.jsx` | `/manager/allocate` | Manual room/bed assignment form |
| `pages/manager/LeaveRequests.jsx` | `/manager/leave` | Pending leaves with approve/reject + remarks field |
| `pages/manager/Messages.jsx` | `/manager/messages` | Pending complaints + resolve button |

### Admin Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/admin/Dashboard.jsx` | `/admin/home` | System stats: students, managers, hostels, rooms |
| `pages/admin/Managers.jsx` | `/admin/managers` | Table of all managers + remove button |
| `pages/admin/CreateManager.jsx` | `/admin/managers/create` | Form to appoint a new manager to a hostel |
| `pages/admin/Students.jsx` | `/admin/students` | Searchable table of all students |

### Shared Components
| File | Description |
|------|-------------|
| `components/Navbar.jsx` | Role-aware nav with links per role + logout |
| `components/PrivateRoute.jsx` | Route guard — redirects if wrong role or not logged in |
| `components/ui/Spinner.jsx` | Loading spinner |
| `contexts/AuthContext.jsx` | Auth state: user, role, login(), logout(), updateUser() |
| `api/axios.js` | Axios instance — auto-attaches JWT, redirects to login on 401 |

---

## Room Booking Logic
1. Seed creates hostels with rooms. Floor 1, Room 1 starts `isUnlocked: true`
2. Student browses: Services → SelectFloor → RoomView
3. RoomView shows beds per room. Only unlocked rooms show "Book" buttons
4. On booking: bed marked `isBooked`, student gets `room`, `hostel`, `bed` fields
5. When all beds in a room fill up → `isFull: true` → next room auto-unlocks
6. Manager can manually unlock any room via EmptyRooms page

---

## Seed Script (`backend/seed.js`)
Run once to set up DB:
```bash
cd backend && node seed.js
```
Creates:
- Hostel A — attached, ₹75,000/yr, 4 floors × 25 rooms × 3 beds
- Hostel B — attached, ₹75,000/yr, 4 floors × 25 rooms × 3 beds
- Hostel C — non-attached, ₹65,000/yr, 4 floors × 25 rooms × 3 beds
- Hostel D — non-attached, ₹65,000/yr, 4 floors × 25 rooms × 3 beds
- Admin account: `username=admin`, `password=admin123`

---

## Environment Setup (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d

EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password

CLIENT_URL=http://localhost:5173
```

---

## How to Run

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
node seed.js              # run once to populate DB
npm run dev               # starts on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev               # starts on port 5173
```

---

## What Is DONE ✅

- [x] Student registration with roll number validation
- [x] Student login with JWT
- [x] Manager login (shared with admin — `isAdmin` flag routes correctly)
- [x] Role-based route protection (PrivateRoute per role)
- [x] JWT auto-attach via Axios interceptor + 401 auto-logout
- [x] Student dashboard with allocation status banner
- [x] Student profile page
- [x] Hostel type selection (attached vs non-attached with pricing)
- [x] Floor selection with hostel block picker
- [x] Room view with bed-level booking
- [x] Booking confirmation modal with optional parent email
- [x] Auto-unlock next room when current room fills
- [x] Email notification to parent on booking (Nodemailer)
- [x] Hostel application form with own application history
- [x] Leave request submission + history with status badges
- [x] Complaint submission + history with status badges
- [x] Manager dashboard with live stats (pending complaints, leaves, etc.)
- [x] View allocated rooms with student details
- [x] Vacate a bed (manager)
- [x] View empty rooms with unlock action
- [x] Manual room allocation (manager assigns student to bed)
- [x] Approve/reject leave requests with remarks
- [x] Resolve complaints
- [x] Admin dashboard with system-wide stats
- [x] Admin: view all managers + remove manager
- [x] Admin: appoint new manager to a hostel
- [x] Admin: view all students with search
- [x] Seed script for hostels + rooms + admin account
- [x] bcrypt password hashing on Student and Manager models

---

## What Is LEFT / MISSING ❌

### Must Do (for complete feature parity with PHP)
- [ ] **Manager profile page** — `/manager/profile` route and page exists in App.jsx but the page component was not created. API `GET /api/managers/profile` is ready.
- [ ] **Student vacate own bed** — API `POST /rooms/:id/vacate` works without `studentId` for student role, but no UI button exists in student dashboard or profile page.
- [ ] **Hamburger menu for mobile** — Navbar links collapse on small screens but there's no toggle button to show/hide them.

### Nice to Have (not in core flow)
- [ ] **Admin create hostel from UI** — API `POST /api/admin/hostels` exists and auto-generates rooms, but no frontend page. Currently done via seed script only.
- [ ] **Application approval triggers room assignment** — Currently approving an application only updates status; it doesn't auto-assign a room to the student.
- [ ] **Pagination** — All list pages (students, rooms, messages) load everything at once. Needs `?page=&limit=` params for large datasets.
- [ ] **Search/filter on manager pages** — Students table (admin) has search; manager room/leave pages don't.
- [ ] **SMS notifications** — PHP had Twilio config as placeholder. Not implemented in MERN either.
- [ ] **Password reset / forgot password** — Not in PHP original, not here either.
- [ ] **About / Contact / Projects info pages** — PHP had static info pages. Not ported (not core functionality).
- [ ] **404 page** — Currently redirects to `/` on unknown routes.
- [ ] **Loading skeletons** — Only a spinner exists, no skeleton placeholders.
- [ ] **Admin: view applications across all hostels** — API supports it but no admin page for it.
- [ ] **Admin: create hostel page** — No UI; must use seed or raw API.

---

## File Map

```
Hostel-Management-MERN/
├── CONTEXT.md                        ← this file
├── README.md                         ← setup + API reference
├── backend/
│   ├── .env.example
│   ├── server.js
│   ├── seed.js
│   ├── config/db.js
│   ├── middleware/auth.js            ← protect + requireRole
│   ├── utils/email.js               ← nodemailer wrapper
│   ├── models/
│   │   ├── Student.js
│   │   ├── Manager.js
│   │   ├── Hostel.js
│   │   ├── Room.js
│   │   ├── Application.js
│   │   ├── Message.js
│   │   └── LeaveRequest.js
│   └── routes/
│       ├── auth.js
│       ├── student.js
│       ├── hostel.js
│       ├── room.js
│       ├── application.js
│       ├── message.js
│       ├── leave.js
│       ├── manager.js
│       └── admin.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                   ← all routes defined here
        ├── main.jsx
        ├── index.css                 ← Tailwind + custom classes
        ├── api/axios.js
        ├── contexts/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PrivateRoute.jsx
        │   └── ui/Spinner.jsx
        └── pages/
            ├── auth/
            │   ├── StudentLogin.jsx
            │   ├── StudentSignup.jsx
            │   └── ManagerLogin.jsx
            ├── student/
            │   ├── Dashboard.jsx
            │   ├── Profile.jsx
            │   ├── Services.jsx
            │   ├── SelectFloor.jsx
            │   ├── RoomView.jsx
            │   ├── ApplicationForm.jsx
            │   ├── LeaveRequest.jsx
            │   └── Messages.jsx
            ├── manager/
            │   ├── Dashboard.jsx
            │   ├── AllocatedRooms.jsx
            │   ├── EmptyRooms.jsx
            │   ├── AllocateRoom.jsx
            │   ├── LeaveRequests.jsx
            │   └── Messages.jsx
            └── admin/
                ├── Dashboard.jsx
                ├── Managers.jsx
                ├── CreateManager.jsx
                └── Students.jsx
```
