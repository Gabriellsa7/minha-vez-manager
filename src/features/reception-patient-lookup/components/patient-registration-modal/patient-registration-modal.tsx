import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { usePostUser } from '../../../../config/api/post-user';
import { useDeleteUser } from '../../../../config/api/delete-user';
import { usePostPatient } from '../../../../config/api/post-patient';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { normalizeEmail, formatPhone } from '../../../../config/utils';
import {
  formatBirthDate,
  normalizeBirthDate,
} from '../../../../config/utils/patient-input';
import { PRIORITY_LABEL } from '../../../../config/entities/patient/patient.entity';
import { patientPriority } from '../../../../config/entities/patient/patient.entity';
import type { IPatient } from '../../../../config/entities/patient/patient.entity';
import { Field } from '../../../../components/field/field';
import {
  patientRegistrationModalSchema,
  type PatientRegistrationModalFormData,
} from './entities/patient-registration-modal.schema';
import style from './patient-registration-modal.module.scss';

interface PatientRegistrationModalProps {
  open: boolean;
  cpf: string;
  onClose: () => void;
  onRegistered: (patient: IPatient) => void;
}

const defaultValues: PatientRegistrationModalFormData = {
  name: '',
  email: '',
  password: '',
  birthDate: '',
  phone: '',
  priority: patientPriority.NORMAL,
};

function PatientRegistrationModal({
  open,
  cpf,
  onClose,
  onRegistered,
}: PatientRegistrationModalProps) {
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    usePostUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: createPatient, isPending: isCreatingPatient } =
    usePostPatient();
  const isPending = isCreatingUser || isCreatingPatient;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientRegistrationModalFormData>({
    resolver: zodResolver(patientRegistrationModalSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPending, onClose, open]);

  const closeModal = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit = async (data: PatientRegistrationModalFormData) => {
    let createdUserId: string | undefined;

    try {
      const user = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      createdUserId = user._id;

      const patient = await createPatient({
        userId: user._id,
        cpf,
        birthDate: normalizeBirthDate(data.birthDate),
        phone: data.phone,
        priority: data.priority,
      });

      toast.success('Paciente cadastrado com sucesso.');
      onRegistered(patient);
    } catch (error) {
      // The account was already created in the step above — roll it back so
      // a failed patient step (e.g. CPF already in use) doesn't leave an
      // orphaned login the receptionist can't recreate under the same e-mail.
      if (createdUserId) {
        await deleteUser(createdUserId).catch(() => {});
      }
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
        aria-labelledby="patient-registration-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 id="patient-registration-modal-title">Cadastrar paciente</h2>
          <button
            className={style.closeButton}
            type="button"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>
        <p className={style.subtitle}>
          Esses dados serão usados pelo paciente para entrar no app Minha Vez.
        </p>

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <Field label="CPF">
            <input value={cpf} disabled />
          </Field>
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
              placeholder="paciente@exemplo.com"
            />
          </Field>
          <Field label="Senha" error={errors.password?.message}>
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
            />
          </Field>
          <div className={style.twoColumns}>
            <Field
              label="Data de nascimento"
              error={errors.birthDate?.message}
            >
              <input
                {...register('birthDate', {
                  onChange: (event) => {
                    event.target.value = formatBirthDate(
                      event.target.value
                    );
                  },
                })}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
              />
            </Field>
            <Field label="Telefone" error={errors.phone?.message}>
              <input
                {...register('phone', {
                  onChange: (event) => {
                    event.target.value = formatPhone(event.target.value);
                  },
                })}
                placeholder="(11) 99999-9999"
                inputMode="numeric"
              />
            </Field>
          </div>
          <Field label="Prioridade de atendimento" error={errors.priority?.message}>
            <select {...register('priority')}>
              {Object.entries(PRIORITY_LABEL)
                .filter(([value]) => value !== patientPriority.ELDERLY)
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </select>
          </Field>

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
              {isPending ? 'Cadastrando...' : 'Cadastrar e continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { PatientRegistrationModal };
