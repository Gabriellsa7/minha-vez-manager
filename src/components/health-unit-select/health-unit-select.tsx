import { Field } from '../field/field';
import type { IHealthUnit } from '../../config/entities/health-unit/health-unit.entity';
import style from './health-unit-select.module.scss';

interface HealthUnitSelectProps {
  healthUnits?: IHealthUnit[];
  value?: string;
  onChange: (healthUnitId: string) => void;
}

function HealthUnitSelect({
  healthUnits,
  value,
  onChange,
}: HealthUnitSelectProps) {
  if (!healthUnits || healthUnits.length <= 1) return null;

  return (
    <div className={style.wrapper}>
      <Field label="Unidade de saúde">
        <select
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        >
          {healthUnits.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.name}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

export { HealthUnitSelect };
