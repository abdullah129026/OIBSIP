import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, ready } = useAuth();

  if (!ready) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};
