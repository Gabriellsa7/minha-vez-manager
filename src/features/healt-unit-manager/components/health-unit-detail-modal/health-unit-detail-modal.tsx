import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import style from './health-unit-detail-modal.module.scss';
import type { IHealthUnit } from '../../../../config/entities/health-unit/health-unit.entity';
import { useUpdateHealthUnit } from '../../../../config/api/update-health-unit';
import { useDeleteHealthUnit } from '../../../../config/api/delete-health-unit';
import { GET_HEALTH_UNITS_BY_USER_ID_KEY } from '../../../../config/api/get-health-units-by-user-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { formatPhone, formatZipCode, normalizeEmail } from '../../../../config/utils';
import { Field } from '../../../../components/field/field';
import { ConfirmDeleteModal } from '../../../../components/confirm-delete-modal/confirm-delete-modal';
import {
  healthUnitDetailModalSchema,
  type HealthUnitDetailModalFormData,
} from './entities/health-unit-detail-modal.schema';

interface HealthUnitDetailModalProps {
  healthUnit: IHealthUnit;
  onClose: () => void;
}

function buildDefaultValues(
  healthUnit: IHealthUnit
): HealthUnitDetailModalFormData {
  return {
    name: healthUnit.name,
    phone: healthUnit.phone,
    email: healthUnit.email,
    description: healthUnit.description ?? '',
    img: healthUnit.img ?? '',
    address: {
      street: healthUnit.address.street,
      number: healthUnit.address.number,
      complement: healthUnit.address.complement ?? '',
      neighborhood: healthUnit.address.neighborhood,
      city: healthUnit.address.city,
      state: healthUnit.address.state,
      zipCode: healthUnit.address.zipCode,
    },
  };
}

function HealthUnitDetailModal({
  healthUnit,
  onClose,
}: HealthUnitDetailModalProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { mutate: updateHealthUnit, isPending: isUpdating } =
    useUpdateHealthUnit();
  const { mutate: deleteHealthUnit, isPending: isDeleting } =
    useDeleteHealthUnit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthUnitDetailModalFormData>({
    resolver: zodResolver(healthUnitDetailModalSchema),
    defaultValues: buildDefaultValues(healthUnit),
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUpdating && !isConfirmDeleteOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isConfirmDeleteOpen, isUpdating, onClose]);

  const closeModal = () => {
    if (isUpdating) return;
    setIsEditing(false);
    onClose();
  };

  const startEditing = () => {
    reset(buildDefaultValues(healthUnit));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset(buildDefaultValues(healthUnit));
    setIsEditing(false);
  };

  const onSubmit = (data: HealthUnitDetailModalFormData) => {
    updateHealthUnit(
      {
        id: healthUnit._id,
        data: {
          ...data,
          description: data.description || undefined,
          img: data.img || undefined,
          address: {
            ...data.address,
            complement: data.address.complement || undefined,
          },
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [GET_HEALTH_UNITS_BY_USER_ID_KEY, healthUnit.userId],
          });
          toast.success('Unidade de saúde atualizada com sucesso.');
          setIsEditing(false);
        },
        onError: handleApiError,
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteHealthUnit(healthUnit._id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [GET_HEALTH_UNITS_BY_USER_ID_KEY, healthUnit.userId],
        });
        toast.success('Unidade de saúde excluída com sucesso.');
        setIsConfirmDeleteOpen(false);
        onClose();
      },
      onError: handleApiError,
    });
  };

  return (
    <>
      <div className={style.overlay} onMouseDown={closeModal}>
        <div
          className={style.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="health-unit-detail-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={style.header}>
            <h2 id="health-unit-detail-modal-title">
              {isEditing ? 'Editar unidade de saúde' : healthUnit.name}
            </h2>
            <button
              className={style.closeButton}
              type="button"
              onClick={closeModal}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>
          </div>

          {isEditing ? (
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
                        event.target.value = normalizeEmail(
                          event.target.value
                        );
                      },
                    })}
                    type="email"
                    inputMode="email"
                  />
                </Field>
              </div>

              <fieldset className={style.fieldset}>
                <legend>Endereço</legend>
                <div className={style.twoColumns}>
                  <Field label="Rua" error={errors.address?.street?.message}>
                    <input {...register('address.street')} />
                  </Field>
                  <Field
                    label="Número"
                    error={errors.address?.number?.message}
                  >
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
                  <Field
                    label="CEP"
                    error={errors.address?.zipCode?.message}
                  >
                    <input
                      {...register('address.zipCode', {
                        onChange: (event) => {
                          event.target.value = formatZipCode(
                            event.target.value
                          );
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
                  <Field
                    label="Estado"
                    error={errors.address?.state?.message}
                  >
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
              <Field
                label="URL da imagem (opcional)"
                error={errors.img?.message}
              >
                <input
                  {...register('img')}
                  type="url"
                  placeholder="https://..."
                />
              </Field>

              <div className={style.actions}>
                <button
                  type="button"
                  className={style.cancelButton}
                  onClick={cancelEditing}
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={style.submitButton}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className={style.body}>
                <div className={style.address}>
                  <MapPin size={16} />
                  <span>
                    {healthUnit.address.street}, {healthUnit.address.number}
                    {healthUnit.address.complement
                      ? ` - ${healthUnit.address.complement}`
                      : ''}{' '}
                    - {healthUnit.address.neighborhood},{' '}
                    {healthUnit.address.city} - {healthUnit.address.state}
                    {healthUnit.address.zipCode
                      ? ` · CEP ${healthUnit.address.zipCode}`
                      : ''}
                  </span>
                </div>

                <div className={style.infoGrid}>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Telefone</span>
                    <span>{healthUnit.phone}</span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>E-mail</span>
                    <span>{healthUnit.email}</span>
                  </div>
                </div>

                {healthUnit.description && (
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Descrição</span>
                    <p>{healthUnit.description}</p>
                  </div>
                )}
              </div>

              <div className={style.actions}>
                <button
                  type="button"
                  className={style.deleteButton}
                  onClick={() => setIsConfirmDeleteOpen(true)}
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
                <button
                  type="button"
                  className={style.editButton}
                  onClick={startEditing}
                >
                  <Pencil size={16} />
                  Editar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={isConfirmDeleteOpen}
        title="Excluir unidade de saúde"
        description={`Tem certeza que deseja excluir "${healthUnit.name}"? Essa ação não pode ser desfeita.`}
        isDeleting={isDeleting}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export { HealthUnitDetailModal };
