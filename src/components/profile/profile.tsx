import { LogOut } from 'lucide-react';
import style from './profile.module.scss';
import { clearAccessToken, getUserInitials } from '../../config/utils';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../config/entities/user/user.entity';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';

interface ProfileProps {
  user?: IUser;
}

function Profile({ user }: ProfileProps) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAccessToken();
    navigate('/login', { replace: true });
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
          {/* user Profile image */}
          <span> {userInitials}</span>
        </div>
        <div className={style.userInfo}>
          <span>{user?.name}</span>

          <span>{userRole}</span>
        </div>
      </div>
      <div>
        <button onClick={handleLogout}>
          <LogOut size={24} color="#6b7280" />
        </button>
      </div>
    </div>
  );
}

export { Profile };
