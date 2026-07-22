import { useCurrentUser } from '../config/api/get-current-user';
import { HealthProfessionalRole } from '../config/entities/auth/auth.entity';
import { UserRole } from '../config/entities/user/user.entity';
import { authStorage } from './auth-storage';

export const useAuth = () => {
  const accessToken = authStorage.getAccessToken();

  const {
    data: user,
    isLoading,
    isSuccess,
  } = useCurrentUser({
    enabled: !!accessToken,
    retry: false,
  });

  console.log({
    accessToken,
    user,
    isLoading,
    isSuccess,
  });

  return {
    user,

    role: user?.role,
    principalType: user?.principalType,

    isAdmin:
      user?.principalType === HealthProfessionalRole.USER &&
      user.role === UserRole.ADMIN,

    isUser:
      user?.principalType === HealthProfessionalRole.USER &&
      user.role === UserRole.USER,

    isHealthProfessional:
      user?.principalType === HealthProfessionalRole.HEALTH_PROFESSIONAL,

    isAuthenticated: !!accessToken && isSuccess,
    isLoading,
  };
};
