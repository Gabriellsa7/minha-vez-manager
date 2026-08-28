import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import style from './receptionist-detail-modal.module.scss';
import type { IReceptionist } from '../../../../config/entities/receptionist/receptionist.entity';
import { useUpdateReceptionist } from '../../../../config/api/update-receptionist';
import { useDeleteReceptionist } from '../../../../config/api/delete-receptionist';
import { GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY } from '../../../../config/api/get-receptionists-by-health-unit-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { getUserInitials } from '../../../../config/utils';
import { Field } from '../../../../components/field/field';
import { ConfirmDeleteModal } from '../../../../components/confirm-delete-modal/confirm-delete-modal';
import {
  receptionistDetailModalSchema,
  type ReceptionistDetailModalFormData,
} from './entities/receptionist-detail-modal.schema';

interface ReceptionistDetailModalProps {
  receptionist: IReceptionist;
  onClose: () => void;
}

function buildDefaultValues(
  receptionist: IReceptionist
): ReceptionistDetailModalFormData {
  return {
    name: receptionist.name,
    email: receptionist.email,
    active: receptionist.active,
  };
}

function ReceptionistDetailModal({
  receptionist,
  onClose,
}: ReceptionistDetailModalProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { mutate: updateReceptionist, isPending: isUpdating } =
    useUpdateReceptionist();
  const { mutate: deleteReceptionist, isPending: isDeleting } =
    useDeleteReceptionist();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReceptionistDetailModalFormData>({
    resolver: zodResolver(receptionistDetailModalSchema),
    defaultValues: buildDefaultValues(receptionist),
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

  const userInitials = getUserInitials(receptionist.name);

  const closeModal = () => {
    if (isUpdating) return;
    setIsEditing(false);
    onClose();
  };

  const startEditing = () => {
    reset(buildDefaultValues(receptionist));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset(buildDefaultValues(receptionist));
    setIsEditing(false);
  };

  const onSubmit = (data: ReceptionistDetailModalFormData) => {
    updateReceptionist(
      { id: receptionist._id, data },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [
              GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY,
              receptionist.healthUnitId,
            ],
          });
          toast.success('Recepcionista atualizada com sucesso.');
          setIsEditing(false);
        },
        onError: handleApiError,
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteReceptionist(receptionist._id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY,
            receptionist.healthUnitId,
          ],
        });
        toast.success('Recepcionista excluída com sucesso.');
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
          aria-labelledby="receptionist-detail-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={style.header}>
            <h2 id="receptionist-detail-modal-title">
              {isEditing ? 'Editar recepcionista' : receptionist.name}
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

              <Field label="E-mail" error={errors.email?.message}>
                <input {...register('email')} type="email" />
              </Field>

              <label className={style.checkbox}>
                <input type="checkbox" {...register('active')} />
                Recepcionista ativa
              </label>

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
                    <strong>{receptionist.name}</strong>
                    <span>{receptionist.active ? 'Ativa' : 'Inativa'}</span>
                  </div>
                </div>

                <div className={style.infoGrid}>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>E-mail</span>
                    <span>{receptionist.email}</span>
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
        title="Excluir recepcionista"
        description={`Tem certeza que deseja excluir "${receptionist.name}"? Essa ação não pode ser desfeita.`}
        isDeleting={isDeleting}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export { ReceptionistDetailModal };
