import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../services/react-query';
import { usePostLogin } from './api/post-login';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormData } from './entities/login.schema';
import { authStorage } from '../../hooks/auth-storage';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleApiError } from '../../config/utils/handle-api-error';
import { UserRole } from '../../config/entities/user/user.entity';
import { HealthProfessionalRole } from '../../config/entities/auth/auth.entity';
import { apiClient } from '../../services/axios';

function Login() {
  const navigate = useNavigate();

  const { mutateAsync, isPending } = usePostLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await mutateAsync(data);

      authStorage.save(response);

      await queryClient.fetchQuery({
        queryKey: ['GET_CURRENT_USER'],
        queryFn: async () => {
          const response = await apiClient.get('/users/me');
          return response.data;
        },
      });

      if (
        response.principalType === HealthProfessionalRole.HEALTH_PROFESSIONAL
      ) {
        navigate('/health-professional-manager');
        return;
      }

      switch (response.principal.role) {
        case UserRole.ADMIN:
          navigate('/');
          break;

        default:
          navigate('/');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">E-mail</label>

        <input id="email" type="email" {...register('email')} />

        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Senha</label>

        <input id="password" type="password" {...register('password')} />

        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

export { Login };
