import { CircleHelp, LogOut } from 'lucide-react';
import style from './profile.module.scss';
import { getUserInitials } from '../../config/utils';
import { endSession } from '../../services/session';
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
    endSession();
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

  const isHealthProfessional = user?.principalType === 'HEALTH_PROFESSIONAL';

  const { data: professional } = useHealthProfessionalById(user?._id, {
    enabled: Boolean(user?._id) && isHealthProfessional,
  });

  const userRole =
    user?.role === 'ADMIN'
      ? 'Administrador'
      : user?.principalType === 'RECEPTIONIST'
        ? 'Recepção'
        : professional?.specialty;

  return (
    <div className={style.container}>
      <div className={style.imgContainer}>
        <div className={style.profileImg}>
          {professional?.avatar ? (
            <img src={professional.avatar} alt={user?.name} />
          ) : (
            <span aria-hidden>{userInitials}</span>
          )}
        </div>
        <div className={style.userInfo}>
          <span className={style.userName}>{user?.name}</span>
          {userRole && <span className={style.userRole}>{userRole}</span>}
        </div>
      </div>
      <div className={style.actions}>
        <button
          type="button"
          className={style.helpButton}
          onClick={handleOpenDocs}
          title="Como usar o Manager"
          aria-label="Como usar o Manager"
        >
          <CircleHelp size={22} aria-hidden />
        </button>
        <button
          type="button"
          className={style.logoutButton}
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={22} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export { Profile };
