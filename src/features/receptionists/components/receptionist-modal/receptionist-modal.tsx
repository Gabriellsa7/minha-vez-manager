import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { usePostReceptionist } from '../../../../config/api/post-receptionist';
import { GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY } from '../../../../config/api/get-receptionists-by-health-unit-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { normalizeEmail } from '../../../../config/utils';
import { Field } from '../../../../components/field/field';
import {
  receptionistModalSchema,
  type ReceptionistModalFormData,
} from './entities/receptionist-modal.schema';
import style from './receptionist-modal.module.scss';

interface ReceptionistModalProps {
  open: boolean;
  onClose: () => void;
  healthUnitId?: string;
}

function buildDefaultValues(healthUnitId?: string): ReceptionistModalFormData {
  return {
    healthUnitId: healthUnitId ?? '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
}

function ReceptionistModal({
  open,
  onClose,
  healthUnitId,
}: ReceptionistModalProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostReceptionist();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReceptionistModalFormData>({
    resolver: zodResolver(receptionistModalSchema),
    defaultValues: buildDefaultValues(healthUnitId),
  });

  useEffect(() => {
    if (!open) return;
    reset(buildDefaultValues(healthUnitId));
  }, [open, healthUnitId, reset]);

  const closeModal = () => {
    if (isPending) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPending, onClose, open]);

  const onSubmit = async (data: ReceptionistModalFormData) => {
    try {
      await mutateAsync({
        healthUnitId: data.healthUnitId,
        name: data.name,
        email: data.email,
        password: data.password,
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_RECEPTIONISTS_BY_HEALTH_UNIT_ID_KEY, data.healthUnitId],
      });
      toast.success('Recepcionista cadastrada com sucesso.');
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
        aria-labelledby="receptionist-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 id="receptionist-modal-title">Cadastrar recepcionista</h2>
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
          <Field label="Nome completo" error={errors.name?.message}>
            <input {...register('name')} autoFocus />
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
              placeholder="recepcao@exemplo.com"
            />
          </Field>
          <div className={style.twoColumns}>
            <Field label="Senha" error={errors.password?.message}>
              <input
                {...register('password')}
                type="password"
                autoComplete="new-password"
              />
            </Field>
            <Field
              label="Confirmar senha"
              error={errors.confirmPassword?.message}
            >
              <input
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
              />
            </Field>
          </div>
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
              disabled={isPending || !healthUnitId}
            >
              {isPending ? 'Cadastrando...' : 'Cadastrar recepcionista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ReceptionistModal };
