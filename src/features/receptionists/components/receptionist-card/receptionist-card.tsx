import type { IReceptionist } from '../../../../config/entities/receptionist/receptionist.entity';
import { getUserInitials } from '../../../../config/utils';
import style from './receptionist-card.module.scss';

interface ReceptionistCardProps {
  receptionist: IReceptionist;
  onClick?: () => void;
}

function ReceptionistCard({ receptionist, onClick }: ReceptionistCardProps) {
  const userInitials = getUserInitials(receptionist.name);

  return (
    <div
      className={style.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={style.profileImg}>
        <span>{userInitials}</span>
      </div>

      <div className={style.content}>
        <h3>{receptionist.name}</h3>
        <div className={style.email}>
          <span>{receptionist.email}</span>
        </div>
      </div>
    </div>
  );
}

export { ReceptionistCard };
