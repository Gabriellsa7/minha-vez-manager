import { Bell, Plus } from 'lucide-react';
import style from './header-manager.module.scss';
import type { IUser } from '../../config/entities/user/user.entity';

interface HeaderManagerProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonClick?: () => void;
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
  const showAction = !isProfessional && buttonText && onButtonClick;

  return (
    <header className={style.container}>
      <div className={style.titleContainer}>
        <h1 className={style.title}>{title}</h1>
        <p className={style.subtitle}>{subtitle}</p>
      </div>
      <div className={style.buttonSection}>
        <Bell size={22} className={style.bellIcon} aria-hidden />

        {showAction && (
          <button
            type="button"
            onClick={onButtonClick}
            className={style.healthUnitButton}
          >
            <Plus size={20} aria-hidden />
            {buttonText}
          </button>
        )}
      </div>
    </header>
  );
}

export { HeaderManager };
