import { Bell, Plus } from 'lucide-react';
import style from './header-manager.module.scss';

interface HeaderManagerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
}

function HeaderManager({
  buttonText,
  onButtonClick,
  subtitle,
  title,
}: HeaderManagerProps) {
  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <span className={style.title}>{title}</span>
        <span className={style.subtitle}>{subtitle}</span>
      </div>
      <div className={style.buttonSection}>
        <Bell size={22} color="#007a78" />

        <button onClick={onButtonClick}>
          {' '}
          <Plus size={20} color="#FFFFFF" />
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export { HeaderManager };
