import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { usePostClinicAdmin } from '../../../../config/api/post-clinic-admin';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { normalizeEmail } from '../../../../config/utils';
import { Field } from '../../../../components/field/field';
import {
  clinicAdminModalSchema,
  type ClinicAdminModalFormData,
} from './entities/clinic-admin-modal.schema';
import style from './clinic-admin-modal.module.scss';

interface ClinicAdminModalProps {
  open: boolean;
  onClose: () => void;
}

function buildDefaultValues(): ClinicAdminModalFormData {
  return {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
}

function ClinicAdminModal({ open, onClose }: ClinicAdminModalProps) {
  const { mutateAsync, isPending } = usePostClinicAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClinicAdminModalFormData>({
    resolver: zodResolver(clinicAdminModalSchema),
    defaultValues: buildDefaultValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(buildDefaultValues());
  }, [open, reset]);

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

  const onSubmit = async (data: ClinicAdminModalFormData) => {
    try {
      await mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Administrador da clínica cadastrado com sucesso.');
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
        aria-labelledby="clinic-admin-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 id="clinic-admin-modal-title">
            Cadastrar administrador da clínica
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
              placeholder="admin@clinica.com"
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
              disabled={isPending}
            >
              {isPending ? 'Cadastrando...' : 'Cadastrar administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ClinicAdminModal };
