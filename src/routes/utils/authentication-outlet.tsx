import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/use-auth';

function AuthenticationOutlet() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export { AuthenticationOutlet };