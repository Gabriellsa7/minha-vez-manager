import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import type { EPrincipalType } from '../../config/entities/auth/auth.entity';

interface Props {
  allowedPrincipalTypes: EPrincipalType[];
}

export function PrincipalTypeOutlet({ allowedPrincipalTypes }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedPrincipalTypes.includes(user.principalType)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
