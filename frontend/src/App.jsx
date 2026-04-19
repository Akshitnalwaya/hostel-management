import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth pages
import StudentLogin from './pages/auth/StudentLogin';
import StudentSignup from './pages/auth/StudentSignup';
import ManagerLogin from './pages/auth/ManagerLogin';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Services from './pages/student/Services';
import SelectFloor from './pages/student/SelectFloor';
import RoomView from './pages/student/RoomView';
import ApplicationForm from './pages/student/ApplicationForm';
import LeaveRequest from './pages/student/LeaveRequest';
import StudentMessages from './pages/student/Messages';

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard';
import AllocatedRooms from './pages/manager/AllocatedRooms';
import EmptyRooms from './pages/manager/EmptyRooms';
import ManagerLeaveRequests from './pages/manager/LeaveRequests';
import ManagerMessages from './pages/manager/Messages';
import AllocateRoom from './pages/manager/AllocateRoom';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import CreateManager from './pages/admin/CreateManager';
import AdminStudents from './pages/admin/Students';
import AdminManagers from './pages/admin/Managers';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<StudentLogin />} />
        <Route path="/signup" element={<StudentSignup />} />
        <Route path="/manager/login" element={<ManagerLogin />} />

        {/* Student */}
        <Route element={<PrivateRoute role="student" />}>
          <Route path="/home" element={<StudentDashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/select-floor" element={<SelectFloor />} />
          <Route path="/room" element={<RoomView />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/leave" element={<LeaveRequest />} />
          <Route path="/messages" element={<StudentMessages />} />
        </Route>

        {/* Manager */}
        <Route element={<PrivateRoute role="manager" />}>
          <Route path="/manager/home" element={<ManagerDashboard />} />
          <Route path="/manager/allocated" element={<AllocatedRooms />} />
          <Route path="/manager/empty" element={<EmptyRooms />} />
          <Route path="/manager/leave" element={<ManagerLeaveRequests />} />
          <Route path="/manager/messages" element={<ManagerMessages />} />
          <Route path="/manager/allocate" element={<AllocateRoom />} />
        </Route>

        {/* Admin */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin/home" element={<AdminDashboard />} />
          <Route path="/admin/managers" element={<AdminManagers />} />
          <Route path="/admin/managers/create" element={<CreateManager />} />
          <Route path="/admin/students" element={<AdminStudents />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
