import type { IHealthProfessional } from '../../../../config/entities/health-profissional/health-professional.entity';
import { getUserInitials } from '../../../../config/utils';
import style from './health-professional-card.module.scss';

interface HealthProfessionalProps {
  healthProfessional: IHealthProfessional;
  onClick?: () => void;
}

function HealthProfessionalCard({
  healthProfessional,
  onClick,
}: HealthProfessionalProps) {
  const userInitials = healthProfessional
    ? getUserInitials(healthProfessional.name)
    : '';

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
        {/* user Profile image */}
        <span> {userInitials}</span>
      </div>

      <div className={style.content}>
        <h3>{healthProfessional.name}</h3>

        <div className={style.address}>
          <span> {healthProfessional?.specialty}</span>
        </div>
      </div>
    </div>
  );
}

export { HealthProfessionalCard };
