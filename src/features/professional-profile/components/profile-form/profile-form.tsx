import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Field } from '../../../../components/field/field';
import { useUpdateHealthProfessional } from '../../../../config/api/update-health-professional';
import { GET_HEALTH_PROFESSIONALS_BY_USER_ID } from '../../../../config/api/get-health-professional-by-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import type { IHealthProfessional } from '../../../../config/entities/health-profissional/health-professional.entity';
import { profileFormSchema, type ProfileFormData } from './entities/profile-form.schema';
import style from './profile-form.module.scss';

interface ProfileFormProps {
  professional: IHealthProfessional;
}

function ProfileForm({ professional }: ProfileFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: professional.name,
      specialty: professional.specialty,
      room: professional.room,
    },
  });

  useEffect(() => {
    reset({
      name: professional.name,
      specialty: professional.specialty,
      room: professional.room,
    });
  }, [professional, reset]);

  const { mutateAsync, isPending } = useUpdateHealthProfessional();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await mutateAsync({ id: professional._id, data });

      await queryClient.invalidateQueries({
        queryKey: [GET_HEALTH_PROFESSIONALS_BY_USER_ID, professional._id],
      });

      toast.success('Perfil atualizado com sucesso.');
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
      <Field label="Nome" error={errors.name?.message}>
        <input {...register('name')} placeholder="Seu nome completo" />
      </Field>

      <div className={style.twoColumns}>
        <Field label="Especialidade" error={errors.specialty?.message}>
          <input {...register('specialty')} placeholder="Ex.: Cardiologia" />
        </Field>

        <Field label="Sala" error={errors.room?.message}>
          <input {...register('room')} placeholder="Ex.: Sala 3" />
        </Field>
      </div>

      <div className={style.readonlyGrid}>
        <div>
          <span className={style.label}>E-mail</span>
          <strong>{professional.email}</strong>
        </div>

        <div>
          <span className={style.label}>Registro profissional</span>
          <strong>{professional.professionalLicense}</strong>
        </div>

        <div>
          <span className={style.label}>Duração da consulta</span>
          <strong>{professional.schedule.appointmentDuration} min</strong>
        </div>

        {professional.schedule.morning?.start && (
          <div>
            <span className={style.label}>Turno manhã</span>
            <strong>
              {professional.schedule.morning.start} às{' '}
              {professional.schedule.morning.end}
            </strong>
          </div>
        )}

        {professional.schedule.afternoon?.start && (
          <div>
            <span className={style.label}>Turno tarde</span>
            <strong>
              {professional.schedule.afternoon.start} às{' '}
              {professional.schedule.afternoon.end}
            </strong>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={style.submitButton}
        disabled={isPending || !isDirty}
      >
        {isPending ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  );
}

export { ProfileForm };
