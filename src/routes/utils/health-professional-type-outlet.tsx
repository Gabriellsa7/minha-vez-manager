import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/use-auth';
import { healthProfessionalType } from '../../config/entities/health-profissional/health-professional.entity';

interface Props {
  onlyExamProfessional?: boolean;
}

export function HealthProfessionalTypeOutlet({
  onlyExamProfessional = false,
}: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isExamProfessional =
    user.healthProfessionalType === healthProfessionalType.EXAM_PROFESSIONAL;

  if (onlyExamProfessional !== isExamProfessional) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
