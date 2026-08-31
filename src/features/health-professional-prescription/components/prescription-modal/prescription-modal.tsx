import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Field } from '../../../../components/field/field';
import { useGetExamOfferingsByHealthUnitId } from '../../../../config/api/get-exam-offerings-by-health-unit-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import type { IHealthProfessional } from '../../../../config/entities/health-profissional/health-professional.entity';
import { queryClient } from '../../../../services/react-query';
import { GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY } from '../../api/get-prescriptions-by-patient-id';
import { GET_PRESCRIPTIONS_BY_PROFESSIONAL_ID_KEY } from '../../api/get-prescriptions-by-professional-id';
import { usePostPrescription } from '../../api/post-prescription';
import {
  prescriptionFormSchema,
  type PrescriptionFormData,
} from './entities/prescription-modal.schema';
import style from './prescription-modal.module.scss';

interface PrescriptionModalProps {
  onClose: () => void;
  professional: IHealthProfessional;
  patientId: string;
  patientName: string;
  queueItemId: string;
}

const defaultExam = { examOfferingId: '' };

const defaultValues: PrescriptionFormData = {
  medications: '',
  observations: '',
  exams: [defaultExam],
};

// Mounted by the parent only while the modal should be visible, so state
// naturally starts fresh on every open instead of needing a reset effect.
function PrescriptionModal({
  onClose,
  professional,
  patientId,
  patientName,
  queueItemId,
}: PrescriptionModalProps) {
  const { data: examOfferings } = useGetExamOfferingsByHealthUnitId(
    professional.healthUnitId,
    false
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exams',
  });

  const { mutateAsync, isPending } = usePostPrescription();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPending, onClose]);

  const closeModal = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      await mutateAsync({
        patientId,
        queueItemId,
        medications: data.medications || undefined,
        observations: data.observations || undefined,
        exams: data.exams.map((exam) => ({
          examOfferingId: exam.examOfferingId,
        })),
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY, patientId],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_PRESCRIPTIONS_BY_PROFESSIONAL_ID_KEY, professional._id],
        }),
      ]);

      toast.success('Receita registrada com sucesso.');
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className={style.overlay} onMouseDown={closeModal}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prescription-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <div>
            <h2 id="prescription-modal-title">Nova receita</h2>
            <span>Paciente: {patientName}</span>
          </div>
          <button
            className={style.closeButton}
            type="button"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form className={style.body} onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="Medicamentos (opcional)"
            error={errors.medications?.message}
          >
            <textarea
              {...register('medications')}
              rows={3}
              placeholder="Ex.: Amoxicilina 500mg, 1 cp de 8/8h por 7 dias"
            />
          </Field>

          <Field
            label="Observações (opcional)"
            error={errors.observations?.message}
          >
            <textarea {...register('observations')} rows={2} />
          </Field>

          <div className={style.exams}>
            <span className={style.sectionLabel}>Exames</span>

            {fields.map((field, index) => (
              <div key={field.id} className={style.examRow}>
                <Field
                  label="Exame"
                  error={errors.exams?.[index]?.examOfferingId?.message}
                >
                  <select {...register(`exams.${index}.examOfferingId`)}>
                    <option value="">Selecione um exame</option>
                    {examOfferings?.map((offering) => (
                      <option key={offering._id} value={offering._id}>
                        {offering.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <button
                  type="button"
                  className={style.removeButton}
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label="Remover exame"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {errors.exams?.message && (
              <p className={style.error}>{errors.exams.message}</p>
            )}

            <button
              type="button"
              className={style.addButton}
              onClick={() => append(defaultExam)}
            >
              <Plus size={16} />
              Adicionar exame
            </button>
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
              disabled={isPending || isSubmitting}
            >
              {isPending ? 'Salvando...' : 'Salvar receita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { PrescriptionModal };
