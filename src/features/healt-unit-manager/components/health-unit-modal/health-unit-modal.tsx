import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import style from './health-unit-modal.module.scss';
import {
  healthUnitModalSchema,
  type HealthUnitModalFormData,
} from './entities/health-unit-modal.schema';
import { usePostHealthUnit } from './api/post-health-unit';
import { GET_HEALTH_UNITS_BY_USER_ID_KEY } from '../../../../config/api/get-health-units-by-user-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { useCurrentUser } from '../../../../config/api/get-current-user';
import { WeekDay } from '../../../../config/entities/health-unit/health-unit.entity';
import { formatPhone, normalizeEmail } from '../../../../config/utils';
import { Field } from '../../../../components/field/field';
import { AddressSection } from './components/address-section/address-section';
import { ServicesSection } from './components/services-section/services-section';
import { OpeningHoursSection } from './components/opening-hours-section/opening-hours-section';

interface CreateHealthUnitModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: HealthUnitModalFormData = {
  name: '',
  phone: '',
  email: '',
  description: '',
  img: '',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  },
  services: [{ name: '', description: '', duration: 30, price: 0 }],
  openingHours: [
    { day: WeekDay.MONDAY, open: '08:00', close: '18:00', isClosed: false },
    { day: WeekDay.TUESDAY, open: '08:00', close: '18:00', isClosed: false },
    { day: WeekDay.WEDNESDAY, open: '08:00', close: '18:00', isClosed: false },
    { day: WeekDay.THURSDAY, open: '08:00', close: '18:00', isClosed: false },
    { day: WeekDay.FRIDAY, open: '08:00', close: '18:00', isClosed: false },
    { day: WeekDay.SATURDAY, open: '', close: '', isClosed: true },
    { day: WeekDay.SUNDAY, open: '', close: '', isClosed: true },
  ],
};

function HealthUnitModal({ onClose, open }: CreateHealthUnitModalProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser({ enabled: open });
  const userId = currentUser?._id;
  const { mutateAsync, isPending } = usePostHealthUnit();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthUnitModalFormData>({
    resolver: zodResolver(healthUnitModalSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        reset(defaultValues);
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPending, onClose, open, reset]);

  const closeModal = () => {
    if (isPending) return;
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data: HealthUnitModalFormData) => {
    if (!userId) {
      toast.error('Não foi possível identificar o usuário responsável.');
      return;
    }

    try {
      await mutateAsync({
        ...data,
        userId,
        description: data.description || undefined,
        img: data.img || undefined,
        address: {
          ...data.address,
          complement: data.address.complement || undefined,
        },
        services: data.services.map((service) => ({
          ...service,
          description: service.description || undefined,
        })),
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_HEALTH_UNITS_BY_USER_ID_KEY, userId],
      });
      toast.success('Unidade de saúde cadastrada com sucesso.');
      closeModal();
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!open) return null;

  return (
    <div className={style.overlay} onMouseDown={closeModal}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="health-unit-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 id="health-unit-modal-title">Cadastrar unidade de saúde</h2>
          <button
            className={style.closeButton}
            type="button"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <Field label="Nome da unidade" error={errors.name?.message}>
            <input {...register('name')} autoFocus />
          </Field>
          <div className={style.twoColumns}>
            <Field label="Telefone" error={errors.phone?.message}>
              <input
                {...register('phone', {
                  onChange: (event) => {
                    event.target.value = formatPhone(event.target.value);
                  },
                })}
                inputMode="tel"
                maxLength={15}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="E-mail" error={errors.email?.message}>
              <input
                {...register('email', {
                  onChange: (event) => {
                    event.target.value = normalizeEmail(event.target.value);
                  },
                })}
                type="email"
                inputMode="email"
                placeholder="contato@unidade.com"
              />
            </Field>
          </div>

          <AddressSection register={register} errors={errors} />

          <Field
            label="Descrição (opcional)"
            error={errors.description?.message}
          >
            <textarea {...register('description')} rows={3} />
          </Field>
          <Field label="URL da imagem (opcional)" error={errors.img?.message}>
            <input {...register('img')} type="url" placeholder="https://..." />
          </Field>

          <ServicesSection
            register={register}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
          />

          <OpeningHoursSection
            register={register}
            defaultValues={defaultValues}
          />

          <div className={style.actions}>
            <button
              type="button"
              className={style.cancelButton}
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={style.submitButton}
              disabled={isPending || !userId}
            >
              {isPending ? 'Cadastrando...' : 'Cadastrar unidade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { HealthUnitModal };
