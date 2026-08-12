import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import style from './exam-offering-modal.module.scss';
import {
  examOfferingModalSchema,
  type ExamOfferingModalFormData,
} from './entities/exam-offering-modal.schema';
import { usePostExamOffering } from '../../api/post-exam-offering';
import { usePatchExamOffering } from '../../api/patch-exam-offering';
import { GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY } from '../../../../config/api/get-exam-offerings-by-health-unit-id';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { Field } from '../../../../components/field/field';
import type { IExamOffering } from '../../../../config/entities/exam-offering/exam-offering.entity';

interface ExamOfferingModalProps {
  open: boolean;
  onClose: () => void;
  healthUnitId?: string;
  examOffering?: IExamOffering | null;
}

const defaultValues: ExamOfferingModalFormData = {
  name: '',
  code: '',
  description: '',
  category: '',
  sampleType: '',
  durationMinutes: 30,
  resultTurnaroundEstimate: '',
  requiresPreparation: false,
  preparationInstructions: '',
  requiresFasting: false,
  fastingHours: undefined,
  price: undefined,
  acceptedInsurances: '',
  isActive: true,
};

function toFormValues(examOffering: IExamOffering): ExamOfferingModalFormData {
  return {
    name: examOffering.name,
    code: examOffering.code ?? '',
    description: examOffering.description ?? '',
    category: examOffering.category ?? '',
    sampleType: examOffering.sampleType ?? '',
    durationMinutes: examOffering.durationMinutes,
    resultTurnaroundEstimate: examOffering.resultTurnaroundEstimate ?? '',
    requiresPreparation: examOffering.requiresPreparation,
    preparationInstructions: examOffering.preparationInstructions ?? '',
    requiresFasting: examOffering.requiresFasting,
    fastingHours: examOffering.fastingHours,
    price: examOffering.price,
    acceptedInsurances: examOffering.acceptedInsurances.join(', '),
    isActive: examOffering.isActive,
  };
}

function ExamOfferingModal({
  open,
  onClose,
  healthUnitId,
  examOffering,
}: ExamOfferingModalProps) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(examOffering);
  const { mutateAsync: createOffering, isPending: isCreating } =
    usePostExamOffering();
  const { mutateAsync: updateOffering, isPending: isUpdating } =
    usePatchExamOffering();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExamOfferingModalFormData>({
    resolver: zodResolver(examOfferingModalSchema),
    defaultValues,
  });

  const requiresPreparation = watch('requiresPreparation');
  const requiresFasting = watch('requiresFasting');

  useEffect(() => {
    if (!open) return;
    reset(examOffering ? toFormValues(examOffering) : defaultValues);
  }, [open, examOffering, reset]);

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

  const closeModal = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit = async (data: ExamOfferingModalFormData) => {
    const acceptedInsurances = data.acceptedInsurances
      .split(',')
      .map((insurance) => insurance.trim())
      .filter(Boolean);

    const payload = {
      name: data.name,
      code: data.code || undefined,
      description: data.description || undefined,
      category: data.category || undefined,
      sampleType: data.sampleType || undefined,
      durationMinutes: data.durationMinutes,
      resultTurnaroundEstimate: data.resultTurnaroundEstimate || undefined,
      requiresPreparation: data.requiresPreparation,
      preparationInstructions: data.preparationInstructions || undefined,
      requiresFasting: data.requiresFasting,
      fastingHours: data.fastingHours,
      price: data.price,
      acceptedInsurances,
    };

    try {
      if (isEditing && examOffering) {
        await updateOffering({
          id: examOffering._id,
          ...payload,
          isActive: data.isActive,
        });
        toast.success('Exame atualizado com sucesso.');
      } else {
        if (!healthUnitId) {
          toast.error('Não foi possível identificar a unidade de saúde.');
          return;
        }
        await createOffering({ healthUnitId, ...payload });
        toast.success('Exame cadastrado com sucesso.');
      }

      await queryClient.invalidateQueries({
        queryKey: [GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY, healthUnitId],
      });
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
        aria-labelledby="exam-offering-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <h2 id="exam-offering-modal-title">
            {isEditing ? 'Editar exame' : 'Cadastrar exame'}
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
          <Field label="Nome do exame" error={errors.name?.message}>
            <input {...register('name')} autoFocus placeholder="Ex.: Hemograma completo" />
          </Field>

          <div className={style.twoColumns}>
            <Field label="Código (opcional)" error={errors.code?.message}>
              <input {...register('code')} />
            </Field>
            <Field label="Categoria (opcional)" error={errors.category?.message}>
              <input {...register('category')} placeholder="Ex.: Sangue, Imagem" />
            </Field>
          </div>

          <Field label="Descrição (opcional)" error={errors.description?.message}>
            <textarea {...register('description')} rows={2} />
          </Field>

          <div className={style.twoColumns}>
            <Field
              label="Tipo de material/coleta (opcional)"
              error={errors.sampleType?.message}
            >
              <input {...register('sampleType')} placeholder="Ex.: Sangue venoso" />
            </Field>
            <Field
              label="Duração aproximada (min.)"
              error={errors.durationMinutes?.message}
            >
              <input
                type="number"
                min="1"
                {...register('durationMinutes', { valueAsNumber: true })}
              />
            </Field>
          </div>

          <Field
            label="Prazo estimado do resultado (opcional)"
            error={errors.resultTurnaroundEstimate?.message}
          >
            <input
              {...register('resultTurnaroundEstimate')}
              placeholder="Ex.: 3 dias úteis"
            />
          </Field>

          <label className={style.checkbox}>
            <input type="checkbox" {...register('requiresPreparation')} />
            Exige preparo
          </label>
          {requiresPreparation && (
            <Field
              label="Orientações de preparo"
              error={errors.preparationInstructions?.message}
            >
              <textarea {...register('preparationInstructions')} rows={2} />
            </Field>
          )}

          <label className={style.checkbox}>
            <input type="checkbox" {...register('requiresFasting')} />
            Exige jejum
          </label>
          {requiresFasting && (
            <Field
              label="Horas de jejum"
              error={errors.fastingHours?.message}
            >
              <input
                type="number"
                min="0"
                {...register('fastingHours', { valueAsNumber: true })}
              />
            </Field>
          )}

          <div className={style.twoColumns}>
            <Field label="Valor particular (R$, opcional)" error={errors.price?.message}>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
              />
            </Field>
            <Field
              label="Convênios aceitos (opcional)"
              error={errors.acceptedInsurances?.message}
            >
              <input
                {...register('acceptedInsurances')}
                placeholder="Separe por vírgula"
              />
            </Field>
          </div>

          {isEditing && (
            <label className={style.checkbox}>
              <input type="checkbox" {...register('isActive')} />
              Exame ativo (disponível para agendamento)
            </label>
          )}

          <div className={style.actions}>
            <button type="button" className={style.cancelButton} onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className={style.submitButton} disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar exame'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ExamOfferingModal };
