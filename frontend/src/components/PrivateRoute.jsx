import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ROLE_REDIRECTS = {
  student: '/',
  manager: '/manager/login',
  admin: '/manager/login',
};

export default function PrivateRoute({ role }) {
  const { user, role: userRole } = useAuth();

  if (!user) return <Navigate to={ROLE_REDIRECTS[role] || '/'} replace />;
  if (userRole !== role) return <Navigate to={ROLE_REDIRECTS[role] || '/'} replace />;

  return <Outlet />;
}
