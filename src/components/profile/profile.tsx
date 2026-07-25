import { LogOut } from 'lucide-react';
import style from './profile.module.scss';
import { clearAccessToken, getUserInitials } from '../../config/utils';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../config/entities/user/user.entity';

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

  const userRole = user?.role === 'ADMIN' ? 'Administrador' : '';

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
