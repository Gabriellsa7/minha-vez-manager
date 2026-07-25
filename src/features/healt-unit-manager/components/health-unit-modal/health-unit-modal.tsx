import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
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
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const normalizeEmail = (value: string) => value.replace(/\s/g, '').toLowerCase();

const formatZipCode = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
};

function HealthUnitModal({
  onClose,
  open,
}: CreateHealthUnitModalProps) {
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
            <Field
              label="Complemento"
              error={errors.address?.complement?.message}
            >
              <input {...register('address.complement')} />
            </Field>
            <div className={style.twoColumns}>
              <Field
                label="Bairro"
                error={errors.address?.neighborhood?.message}
              >
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

          <Field
            label="Descrição (opcional)"
            error={errors.description?.message}
          >
            <textarea {...register('description')} rows={3} />
          </Field>
          <Field label="URL da imagem (opcional)" error={errors.img?.message}>
            <input {...register('img')} type="url" placeholder="https://..." />
          </Field>

          <section className={style.services}>
            <div className={style.servicesHeader}>
              <div>
                <span>Serviços</span>
                {errors.services?.message && (
                  <small>{errors.services.message}</small>
                )}
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
                <Field
                  label="Nome"
                  error={errors.services?.[index]?.name?.message}
                >
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={style.field}>
      <span>{label}</span>
      {children}
      {error && <small className={style.error}>{error}</small>}
    </label>
  );
}

export { HealthUnitModal };
