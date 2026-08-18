import style from './health-unit-card.module.scss';
import Hospital from '../../../../assets/img/Hospital.png';
import { MapPin } from 'lucide-react';
import {
  EHealthUnitType,
  type IHealthUnit,
} from '../../../../config/entities/health-unit/health-unit.entity';

interface HealthUnitCardProps {
  healthUnit: IHealthUnit;
  onClick?: () => void;
}

export function HealthUnitCard({ healthUnit, onClick }: HealthUnitCardProps) {
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
      <img
        src={healthUnit.img || Hospital}
        alt={healthUnit.name}
        className={style.image}
      />

      <div className={style.content}>
        <h3>{healthUnit.name}</h3>

        <span
          className={`${style.badge} ${
            healthUnit.unitType === EHealthUnitType.PRIVATE
              ? style.badgePrivate
              : style.badgePublic
          }`}
        >
          {healthUnit.unitType === EHealthUnitType.PRIVATE
            ? 'Privada'
            : 'Pública'}
        </span>

        <div className={style.address}>
          <MapPin size={16} />

          <span>
            {' '}
            {healthUnit?.address.street}, {healthUnit?.address.number} -{' '}
            {healthUnit?.address.neighborhood} , {healthUnit?.address.city} -{' '}
            {healthUnit?.address.state}
          </span>
        </div>
      </div>
    </div>
  );
}
