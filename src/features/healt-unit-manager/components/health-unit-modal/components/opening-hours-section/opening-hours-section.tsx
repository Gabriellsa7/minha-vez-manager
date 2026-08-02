import type { UseFormRegister } from 'react-hook-form';
import type { HealthUnitModalFormData } from '../../entities/health-unit-modal.schema';
import style from './opening-hours-section.module.scss';
import { weekDayLabel } from '../../constants';

export interface OpeningHoursSectionProps {
  register: UseFormRegister<HealthUnitModalFormData>;
  defaultValues: HealthUnitModalFormData;
}

function OpeningHoursSection({
  register,
  defaultValues,
}: OpeningHoursSectionProps) {
  return (
    <section className={style.openingHours}>
      <div className={style.sectionHeader}>
        <h3>Horário de funcionamento</h3>
      </div>

      {defaultValues.openingHours.map((openingHour, index) => (
        <div key={openingHour.day} className={style.openingHourRow}>
          <span className={style.day}>{weekDayLabel[openingHour.day]}</span>

          <label className={style.checkbox}>
            <input
              type="checkbox"
              {...register(`openingHours.${index}.isClosed`)}
            />
            Fechado
          </label>

          <input type="time" {...register(`openingHours.${index}.open`)} />

          <input type="time" {...register(`openingHours.${index}.close`)} />
        </div>
      ))}
    </section>
  );
}

export { OpeningHoursSection };
