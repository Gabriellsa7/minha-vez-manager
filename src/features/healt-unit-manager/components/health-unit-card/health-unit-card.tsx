import style from './health-unit-card.module.scss';
import Hospital from '../../../../assets/img/Hospital.png';
import { MapPin } from 'lucide-react';
import type { IHealthUnit } from '../../../../config/entities/health-unit/health-unit.entity';

interface HealthUnitCardProps {
  healthUnit: IHealthUnit;
}

export function HealthUnitCard({ healthUnit }: HealthUnitCardProps) {
  return (
    <div className={style.card}>
      <img
        src={healthUnit.img || Hospital}
        alt={healthUnit.name}
        className={style.image}
      />

      <div className={style.content}>
        <h3>{healthUnit.name}</h3>

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
