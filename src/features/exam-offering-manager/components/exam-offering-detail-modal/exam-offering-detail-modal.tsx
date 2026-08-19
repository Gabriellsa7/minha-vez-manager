import { useEffect } from 'react';
import { Pencil, X } from 'lucide-react';
import style from './exam-offering-detail-modal.module.scss';
import type { IExamOffering } from '../../../../config/entities/exam-offering/exam-offering.entity';

interface ExamOfferingDetailModalProps {
  examOffering: IExamOffering | null;
  onClose: () => void;
  onEdit: (examOffering: IExamOffering) => void;
}

function ExamOfferingDetailModal({
  examOffering,
  onClose,
  onEdit,
}: ExamOfferingDetailModalProps) {
  useEffect(() => {
    if (!examOffering) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [examOffering, onClose]);

  if (!examOffering) return null;

  return (
    <div className={style.overlay} onMouseDown={onClose}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-offering-detail-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <div>
            <h2 id="exam-offering-detail-modal-title">{examOffering.name}</h2>
            {examOffering.category && (
              <span className={style.category}>{examOffering.category}</span>
            )}
          </div>
          <button
            className={style.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={style.body}>
          <span
            className={`${style.status} ${
              examOffering.isActive ? style.active : style.inactive
            }`}
          >
            {examOffering.isActive ? 'Ativo' : 'Inativo'}
          </span>

          {examOffering.description && (
            <p className={style.description}>{examOffering.description}</p>
          )}

          <div className={style.infoGrid}>
            {examOffering.code && (
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Código</span>
                <span>{examOffering.code}</span>
              </div>
            )}
            {examOffering.sampleType && (
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Tipo de material/coleta</span>
                <span>{examOffering.sampleType}</span>
              </div>
            )}
            <div className={style.infoItem}>
              <span className={style.infoLabel}>Duração aproximada</span>
              <span>{examOffering.durationMinutes} min</span>
            </div>
            {examOffering.resultTurnaroundEstimate && (
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Prazo do resultado</span>
                <span>{examOffering.resultTurnaroundEstimate}</span>
              </div>
            )}
            {typeof examOffering.price === 'number' && (
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Valor particular</span>
                <span>R$ {examOffering.price.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className={style.infoItem}>
              <span className={style.infoLabel}>Preparo</span>
              <span>
                {examOffering.requiresPreparation ? 'Exige preparo' : 'Não exige preparo'}
              </span>
            </div>
            <div className={style.infoItem}>
              <span className={style.infoLabel}>Jejum</span>
              <span>
                {examOffering.requiresFasting
                  ? `Exige jejum${
                      examOffering.fastingHours
                        ? ` de ${examOffering.fastingHours}h`
                        : ''
                    }`
                  : 'Não exige jejum'}
              </span>
            </div>
          </div>

          {examOffering.requiresPreparation &&
            examOffering.preparationInstructions && (
              <div className={style.infoItem}>
                <span className={style.infoLabel}>Orientações de preparo</span>
                <p>{examOffering.preparationInstructions}</p>
              </div>
            )}

          {examOffering.acceptedInsurances.length > 0 && (
            <div className={style.infoItem}>
              <span className={style.infoLabel}>Convênios aceitos</span>
              <div className={style.insurances}>
                {examOffering.acceptedInsurances.map((insurance) => (
                  <span key={insurance} className={style.insuranceTag}>
                    {insurance}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={style.actions}>
          <button
            type="button"
            className={style.editButton}
            onClick={() => onEdit(examOffering)}
          >
            <Pencil size={16} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

export { ExamOfferingDetailModal };
