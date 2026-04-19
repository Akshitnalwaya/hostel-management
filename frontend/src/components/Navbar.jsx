import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const studentLinks = [
  { to: '/home', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/services', label: 'Book Room' },
  { to: '/apply', label: 'Apply' },
  { to: '/leave', label: 'Leave' },
  { to: '/messages', label: 'Complaints' },
];

const managerLinks = [
  { to: '/manager/home', label: 'Dashboard' },
  { to: '/manager/allocated', label: 'Allocated Rooms' },
  { to: '/manager/empty', label: 'Empty Rooms' },
  { to: '/manager/applications', label: 'Applications' },
  { to: '/manager/leave', label: 'Leave Requests' },
  { to: '/manager/messages', label: 'Complaints' },
];

const adminLinks = [
  { to: '/admin/home', label: 'Dashboard' },
  { to: '/admin/managers', label: 'Managers' },
  { to: '/admin/students', label: 'Students' },
];

const LINKS = { student: studentLinks, manager: managerLinks, admin: adminLinks };

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = LINKS[role] || [];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-lg hidden sm:block">HMS</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-slate-500 hidden sm:block">
                {user.firstName || user.username}
                <span className="ml-1.5 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium capitalize">{role}</span>
              </span>
            )}
            <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-4">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
