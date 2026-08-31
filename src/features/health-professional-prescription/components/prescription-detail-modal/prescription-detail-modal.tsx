import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { IPrescription } from '../../../../config/entities/prescription/prescription.entity';
import { formatDateTime } from '../../../../config/utils';
import style from './prescription-detail-modal.module.scss';

interface PrescriptionDetailModalProps {
  prescription: IPrescription;
  onClose: () => void;
}

function PrescriptionDetailModal({
  prescription,
  onClose,
}: PrescriptionDetailModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className={style.overlay} onMouseDown={onClose}>
      <div
        className={style.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prescription-detail-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={style.header}>
          <div>
            <h2 id="prescription-detail-modal-title">Receita</h2>
            <span>Paciente: {prescription.patientName}</span>
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
          <div className={style.metaRow}>
            <span className={style.metaLabel}>Criada em</span>
            <span className={style.metaValue}>
              {formatDateTime(prescription.createdAt)}
            </span>
          </div>

          <div className={style.section}>
            <span className={style.sectionLabel}>Exames</span>
            <ul className={style.examList}>
              {prescription.exams.map((exam, index) => (
                <li key={`${exam.examOfferingId}-${index}`}>
                  <span className={style.examName}>
                    {exam.examOfferingName}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {prescription.medications && (
            <div className={style.section}>
              <span className={style.sectionLabel}>Medicamentos</span>
              <p className={style.text}>{prescription.medications}</p>
            </div>
          )}

          {prescription.observations && (
            <div className={style.section}>
              <span className={style.sectionLabel}>Observações</span>
              <p className={style.text}>{prescription.observations}</p>
            </div>
          )}
        </div>

        <div className={style.actions}>
          <button
            type="button"
            className={style.closeActionButton}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export { PrescriptionDetailModal };
