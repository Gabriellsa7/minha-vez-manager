import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/use-auth';

function AuthenticationOutlet() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export { AuthenticationOutlet };
