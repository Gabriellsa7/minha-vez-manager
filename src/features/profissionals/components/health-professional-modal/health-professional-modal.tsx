import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../../../config/api/get-health-units-by-user-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { usePostHealthProfessional } from './api/post-health-professional';
import {
  healthProfessionalModalSchema,
  type HealthProfessionalModalFormData,
} from './entities/health-professional-modal.schema';
import style from './health-professional-modal.module.scss';

interface HealthProfessionalModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: HealthProfessionalModalFormData = {
  healthUnitId: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  room: '',
  specialty: '',
  professionalLicense: '',
  schedule: {
    appointmentDuration: 30,

    morning: {
      start: '08:00',
      end: '12:00',
    },

    afternoon: {
      start: '13:00',
      end: '17:00',
    },
  },
};

const normalizeEmail = (value: string) =>
  value.replace(/\s/g, '').toLowerCase();

function HealthProfessionalModal({
  open,
  onClose,
}: HealthProfessionalModalProps) {
  const { data: currentUser } = useCurrentUser({ enabled: open });
  const { data: healthUnits, isLoading: isLoadingUnits } =
    useHealthUnitsByUserId(currentUser?._id, {
      enabled: open && Boolean(currentUser?._id),
    });
  const { mutateAsync, isPending } = usePostHealthProfessional();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthProfessionalModalFormData>({
    resolver: zodResolver(healthProfessionalModalSchema),
    defaultValues,
  });

  const closeModal = () => {
    if (isPending) return;
    reset(defaultValues);
    onClose();
  };

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

  const onSubmit = async (data: HealthProfessionalModalFormData) => {
    try {
      await mutateAsync({
        userId: currentUser?._id,
        healthUnitId: data.healthUnitId,
        name: data.name,
        email: data.email,
        room: data.room,
        password: data.password,
        specialty: data.specialty,
        professionalLicense: data.professionalLicense,
        schedule: data.schedule,
      });
      toast.success('Profissional cadastrado com sucesso.');
      closeModal();
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!open) return null;
  const hasHealthUnits = Boolean(healthUnits?.length);

  return (
    <div className={style.overlay} onMouseDown={closeModal}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="health-professional-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 id="health-professional-modal-title">Cadastrar profissional</h2>
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
          <Field label="Unidade de saúde" error={errors.healthUnitId?.message}>
            <select
              {...register('healthUnitId')}
              disabled={isLoadingUnits || !hasHealthUnits}
            >
              <option value="">
                {isLoadingUnits
                  ? 'Carregando unidades...'
                  : hasHealthUnits
                    ? 'Selecione uma unidade'
                    : 'Nenhuma unidade cadastrada'}
              </option>
              {healthUnits?.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nome completo" error={errors.name?.message}>
            <input {...register('name')} autoFocus />
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

          <div className={style.twoColumns}>
            <Field label="Especialidade" error={errors.specialty?.message}>
              <input
                {...register('specialty')}
                placeholder="Ex.: Cardiologia"
              />
            </Field>
            <Field label="Sala" error={errors.room?.message}>
              <input {...register('room')} placeholder="Ex.: Sala 101" />
            </Field>
            <Field
              label="Registro profissional"
              error={errors.professionalLicense?.message}
            >
              <input
                {...register('professionalLicense')}
                placeholder="Ex.: CRM/SP 123456"
              />
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

            <Field label="Fim" error={errors.schedule?.morning?.end?.message}>
              <input type="time" {...register('schedule.morning.end')} />
            </Field>
          </div>

          <h3>Turno da tarde</h3>

          <div className={style.twoColumns}>
            <Field
              label="Início"
              error={errors.schedule?.afternoon?.start?.message}
            >
              <input type="time" {...register('schedule.afternoon.start')} />
            </Field>

            <Field label="Fim" error={errors.schedule?.afternoon?.end?.message}>
              <input type="time" {...register('schedule.afternoon.end')} />
            </Field>
          </div>
          <Field label="E-mail" error={errors.email?.message}>
            <input
              {...register('email', {
                onChange: (event) => {
                  event.target.value = normalizeEmail(event.target.value);
                },
              })}
              type="email"
              inputMode="email"
              placeholder="profissional@exemplo.com"
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
              disabled={isPending || !hasHealthUnits}
            >
              {isPending ? 'Cadastrando...' : 'Cadastrar profissional'}
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

export { HealthProfessionalModal };
