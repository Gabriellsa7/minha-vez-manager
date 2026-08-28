import { CircleHelp, LogOut } from 'lucide-react';
import style from './profile.module.scss';
import { clearAccessToken, getUserInitials } from '../../config/utils';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../config/entities/user/user.entity';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';

const MANAGER_DOCS_URL = {
  ADMIN: 'https://minha-vez-docs.vercel.app/manager/admin/primeiros-passos',
  HEALTH_PROFESSIONAL:
    'https://minha-vez-docs.vercel.app/manager/medico/primeiros-passos',
  RECEPTIONIST:
    'https://minha-vez-docs.vercel.app/manager/recepcionista/primeiros-passos',
} as const;

interface ProfileProps {
  user?: IUser;
}

function Profile({ user }: ProfileProps) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAccessToken();
    navigate('/login', { replace: true });
  }

  function handleOpenDocs() {
    const docsUrl =
      user?.role === 'ADMIN'
        ? MANAGER_DOCS_URL.ADMIN
        : user?.principalType === 'RECEPTIONIST'
          ? MANAGER_DOCS_URL.RECEPTIONIST
          : MANAGER_DOCS_URL.HEALTH_PROFESSIONAL;

    window.open(docsUrl, '_blank', 'noopener,noreferrer');
  }

  const userInitials = user ? getUserInitials(user.name) : '';

  const { data: professional } = useHealthProfessionalById(user?._id);

  const userRole =
    user?.role === 'ADMIN'
      ? 'Administrador'
      : user?.principalType === 'HEALTH_PROFESSIONAL'
        ? professional?.specialty
        : '';

  return (
    <div className={style.container}>
      <div className={style.imgContainer}>
        <div className={style.profileImg}>
          {professional?.avatar ? (
            <img src={professional.avatar} alt={user?.name} />
          ) : (
            <span> {userInitials}</span>
          )}
        </div>
        <div className={style.userInfo}>
          <span>{user?.name}</span>

          <span>{userRole}</span>
        </div>
      </div>
      <div className={style.actions}>
        <button
          className={style.helpButton}
          onClick={handleOpenDocs}
          title="Como usar o Manager"
          aria-label="Como usar o Manager"
        >
          <CircleHelp size={24} />
        </button>
        <button
          className={style.logoutButton}
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
}

export { Profile };
