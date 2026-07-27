import { Bell, Plus } from 'lucide-react';
import style from './header-manager.module.scss';
import type { IUser } from '../../config/entities/user/user.entity';

interface HeaderManagerProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonClick: () => void;
  user?: IUser;
}

function HeaderManager({
  buttonText,
  onButtonClick,
  subtitle,
  title,
  user,
}: HeaderManagerProps) {
  const isProfessional = user?.principalType === 'HEALTH_PROFESSIONAL';

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <span className={style.title}>{title}</span>
        <span className={style.subtitle}>{subtitle}</span>
      </div>
      <div className={style.buttonSection}>
        <Bell size={22} color="#007a78" />

        {isProfessional ? (
          ''
        ) : (
          <button onClick={onButtonClick} className={style.healthUnitButton}>
            <Plus size={20} color="#FFFFFF" />
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export { HeaderManager };
