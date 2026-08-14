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
import { healthProfessionalType } from '../../config/entities/health-profissional/health-professional.entity';
import { apiClient } from '../../services/axios';
import styles from './login.module.scss';
import { HealthIcon } from '../../assets/svg';
import loginHero from '../../assets/img/login-hero.png';

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
        if (
          response.principal.healthProfessionalType ===
          healthProfessionalType.EXAM_PROFESSIONAL
        ) {
          navigate('/exam-professional');
          return;
        }

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
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.healthCenter}>
          <span className={styles.icon}>
            <HealthIcon />
          </span>
          <div className={styles.titleArea}>
            <h3>Central da Saúde</h3>
            <span>Entre com suas credenciais para acessar o painel</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.loginArea}>
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={styles.input}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={styles.input}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password.message}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className={styles.loginButton}
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
      <div className={styles.heroImage}>
        <img className={styles.img} src={loginHero} alt="Gestão de Saúde" />
      </div>
    </div>
  );
}

export { Login };
