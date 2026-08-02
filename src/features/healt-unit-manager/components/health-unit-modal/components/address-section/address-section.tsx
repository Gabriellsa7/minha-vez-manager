import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Field } from '../../../../../../components/field/field';
import { formatZipCode } from '../../../../../../config/utils';
import style from './address-section.module.scss';
import type { HealthUnitModalFormData } from '../../entities/health-unit-modal.schema';

export interface AddressSectionProps {
  register: UseFormRegister<HealthUnitModalFormData>;
  errors: FieldErrors<HealthUnitModalFormData>;
}

function AddressSection({ register, errors }: AddressSectionProps) {
  return (
    <fieldset className={style.fieldset}>
      <legend>Endereço</legend>
      <div className={style.addressRow}>
        <Field label="Rua" error={errors.address?.street?.message}>
          <input {...register('address.street')} />
        </Field>
        <Field label="Número" error={errors.address?.number?.message}>
          <input {...register('address.number')} />
        </Field>
      </div>
      <Field label="Complemento" error={errors.address?.complement?.message}>
        <input {...register('address.complement')} />
      </Field>
      <div className={style.twoColumns}>
        <Field label="Bairro" error={errors.address?.neighborhood?.message}>
          <input {...register('address.neighborhood')} />
        </Field>
        <Field label="CEP" error={errors.address?.zipCode?.message}>
          <input
            {...register('address.zipCode', {
              onChange: (event) => {
                event.target.value = formatZipCode(event.target.value);
              },
            })}
            inputMode="numeric"
            maxLength={9}
            placeholder="00000-000"
          />
        </Field>
      </div>
      <div className={style.twoColumns}>
        <Field label="Cidade" error={errors.address?.city?.message}>
          <input {...register('address.city')} />
        </Field>
        <Field label="Estado" error={errors.address?.state?.message}>
          <input
            {...register('address.state')}
            maxLength={2}
            placeholder="UF"
          />
        </Field>
      </div>
    </fieldset>
  );
}

export { AddressSection };
