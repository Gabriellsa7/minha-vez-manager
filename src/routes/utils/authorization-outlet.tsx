import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import type { EUserRole } from '../../config/entities/user/user.entity';

interface Props {
  allowedRoles: EUserRole[];
}

export function AuthorizationOutlet({ allowedRoles }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
