import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import style from './health-professional-detail-modal.module.scss';
import type { IHealthProfessional } from '../../../../config/entities/health-profissional/health-professional.entity';
import { useUpdateHealthProfessional } from '../../../../config/api/update-health-professional';
import { useDeleteHealthProfessional } from '../../../../config/api/delete-health-professional';
import { GET_HEALTH_PROFESSIONALS_BY_USER_ID } from '../../../../config/api/get-health-professionals-by-user-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { getUserInitials } from '../../../../config/utils';
import { Field } from '../../../../components/field/field';
import { ConfirmDeleteModal } from '../../../../components/confirm-delete-modal/confirm-delete-modal';
import {
  healthProfessionalDetailModalSchema,
  type HealthProfessionalDetailModalFormData,
} from './entities/health-professional-detail-modal.schema';

interface HealthProfessionalDetailModalProps {
  healthProfessional: IHealthProfessional;
  userId?: string;
  onClose: () => void;
}

function buildDefaultValues(
  healthProfessional: IHealthProfessional
): HealthProfessionalDetailModalFormData {
  return {
    name: healthProfessional.name,
    specialty: healthProfessional.specialty,
    professionalLicense: healthProfessional.professionalLicense,
    room: healthProfessional.room,
    schedule: {
      appointmentDuration: healthProfessional.schedule.appointmentDuration,
      morning: {
        start: healthProfessional.schedule.morning?.start ?? '',
        end: healthProfessional.schedule.morning?.end ?? '',
      },
      afternoon: {
        start: healthProfessional.schedule.afternoon?.start ?? '',
        end: healthProfessional.schedule.afternoon?.end ?? '',
      },
    },
  };
}

function HealthProfessionalDetailModal({
  healthProfessional,
  userId,
  onClose,
}: HealthProfessionalDetailModalProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { mutate: updateHealthProfessional, isPending: isUpdating } =
    useUpdateHealthProfessional();
  const { mutate: deleteHealthProfessional, isPending: isDeleting } =
    useDeleteHealthProfessional();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthProfessionalDetailModalFormData>({
    resolver: zodResolver(healthProfessionalDetailModalSchema),
    defaultValues: buildDefaultValues(healthProfessional),
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

  const userInitials = getUserInitials(healthProfessional.name);

  const closeModal = () => {
    if (isUpdating) return;
    setIsEditing(false);
    onClose();
  };

  const startEditing = () => {
    reset(buildDefaultValues(healthProfessional));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset(buildDefaultValues(healthProfessional));
    setIsEditing(false);
  };

  const onSubmit = (data: HealthProfessionalDetailModalFormData) => {
    updateHealthProfessional(
      { id: healthProfessional._id, data },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [GET_HEALTH_PROFESSIONALS_BY_USER_ID, userId],
          });
          toast.success('Profissional atualizado com sucesso.');
          setIsEditing(false);
        },
        onError: handleApiError,
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteHealthProfessional(healthProfessional._id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [GET_HEALTH_PROFESSIONALS_BY_USER_ID, userId],
        });
        toast.success('Profissional excluído com sucesso.');
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
          aria-labelledby="health-professional-detail-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={style.header}>
            <h2 id="health-professional-detail-modal-title">
              {isEditing ? 'Editar profissional' : healthProfessional.name}
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
              <Field label="Nome completo" error={errors.name?.message}>
                <input {...register('name')} autoFocus />
              </Field>

              <div className={style.twoColumns}>
                <Field
                  label="Especialidade"
                  error={errors.specialty?.message}
                >
                  <input {...register('specialty')} />
                </Field>
                <Field label="Sala" error={errors.room?.message}>
                  <input
                    {...register('room', {
                      onChange: (event) => {
                        event.target.value = event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 4);
                      },
                    })}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                  />
                </Field>
              </div>

              <Field
                label="Registro profissional"
                error={errors.professionalLicense?.message}
              >
                <input {...register('professionalLicense')} />
              </Field>

              <div className={style.twoColumns}>
                <Field
                  label="Duração da consulta"
                  error={errors.schedule?.appointmentDuration?.message}
                >
                  <select
                    {...register('schedule.appointmentDuration', {
                      valueAsNumber: true,
                    })}
                  >
                    <option value={10}>10 minutos</option>
                    <option value={15}>15 minutos</option>
                    <option value={20}>20 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                  </select>
                </Field>
              </div>

              <h3>Turno da manhã</h3>
              <div className={style.twoColumns}>
                <Field
                  label="Início"
                  error={errors.schedule?.morning?.start?.message}
                >
                  <input type="time" {...register('schedule.morning.start')} />
                </Field>
                <Field
                  label="Fim"
                  error={errors.schedule?.morning?.end?.message}
                >
                  <input type="time" {...register('schedule.morning.end')} />
                </Field>
              </div>

              <h3>Turno da tarde</h3>
              <div className={style.twoColumns}>
                <Field
                  label="Início"
                  error={errors.schedule?.afternoon?.start?.message}
                >
                  <input
                    type="time"
                    {...register('schedule.afternoon.start')}
                  />
                </Field>
                <Field
                  label="Fim"
                  error={errors.schedule?.afternoon?.end?.message}
                >
                  <input type="time" {...register('schedule.afternoon.end')} />
                </Field>
              </div>

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
                <div className={style.profileHeader}>
                  <div className={style.profileImg}>
                    <span>{userInitials}</span>
                  </div>
                  <div>
                    <strong>{healthProfessional.name}</strong>
                    <span>{healthProfessional.specialty}</span>
                  </div>
                </div>

                <div className={style.infoGrid}>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>E-mail</span>
                    <span>{healthProfessional.email}</span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Sala</span>
                    <span>{healthProfessional.room}</span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>
                      Registro profissional
                    </span>
                    <span>{healthProfessional.professionalLicense}</span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>
                      Duração da consulta
                    </span>
                    <span>
                      {healthProfessional.schedule.appointmentDuration}{' '}
                      minutos
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Manhã</span>
                    <span>
                      {healthProfessional.schedule.morning?.start ?? '--'} às{' '}
                      {healthProfessional.schedule.morning?.end ?? '--'}
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Tarde</span>
                    <span>
                      {healthProfessional.schedule.afternoon?.start ?? '--'}{' '}
                      às {healthProfessional.schedule.afternoon?.end ?? '--'}
                    </span>
                  </div>
                </div>
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
        title="Excluir profissional"
        description={`Tem certeza que deseja excluir "${healthProfessional.name}"? Essa ação não pode ser desfeita.`}
        isDeleting={isDeleting}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export { HealthProfessionalDetailModal };
