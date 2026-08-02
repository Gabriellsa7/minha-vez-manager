import type {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';
import type { HealthUnitModalFormData } from '../../entities/health-unit-modal.schema';
import style from './services-section.module.scss';
import { Field } from '../../../../../../components/field/field';
import { Plus, Trash2 } from 'lucide-react';

export interface ServicesSectionProps {
  register: UseFormRegister<HealthUnitModalFormData>;
  errors: FieldErrors<HealthUnitModalFormData>;
  fields: FieldArrayWithId<HealthUnitModalFormData, 'services', 'id'>[];
  append: UseFieldArrayAppend<HealthUnitModalFormData, 'services'>;
  remove: UseFieldArrayRemove;
}
function ServicesSection({
  register,
  errors,
  fields,
  append,
  remove,
}: ServicesSectionProps) {
  return (
    <section className={style.services}>
      <div className={style.servicesHeader}>
        <div>
          <span>Serviços</span>
          {errors.services?.message && <small>{errors.services.message}</small>}
        </div>
        <button
          type="button"
          className={style.addService}
          onClick={() =>
            append({ name: '', description: '', duration: 30, price: 0 })
          }
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>
      {fields.map((field, index) => (
        <div className={style.serviceCard} key={field.id}>
          <div className={style.serviceTitle}>
            Serviço {index + 1}
            {fields.length > 1 && (
              <button
                type="button"
                aria-label={`Remover serviço ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <Field label="Nome" error={errors.services?.[index]?.name?.message}>
            <input {...register(`services.${index}.name`)} />
          </Field>
          <Field
            label="Descrição (opcional)"
            error={errors.services?.[index]?.description?.message}
          >
            <input {...register(`services.${index}.description`)} />
          </Field>
          <div className={style.twoColumns}>
            <Field
              label="Duração (min.)"
              error={errors.services?.[index]?.duration?.message}
            >
              <input
                type="number"
                min="1"
                {...register(`services.${index}.duration`, {
                  valueAsNumber: true,
                })}
              />
            </Field>
            <Field
              label="Preço (R$)"
              error={errors.services?.[index]?.price?.message}
            >
              <input
                type="number"
                min="0"
                step="0.01"
                {...register(`services.${index}.price`, {
                  valueAsNumber: true,
                })}
              />
            </Field>
          </div>
        </div>
      ))}
    </section>
  );
}

export { ServicesSection };
