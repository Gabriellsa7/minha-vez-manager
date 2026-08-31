import { CalendarClock, FileText } from 'lucide-react';
import type { IPrescription } from '../../../../config/entities/prescription/prescription.entity';
import { formatDate } from '../../../../config/utils';
import style from './prescription-card.module.scss';

interface PrescriptionCardProps {
  prescription: IPrescription;
  onClick: () => void;
}

function PrescriptionCard({ prescription, onClick }: PrescriptionCardProps) {
  return (
    <button type="button" className={style.card} onClick={onClick}>
      <div className={style.header}>
        <span className={style.patientName}>{prescription.patientName}</span>
        <span className={style.date}>
          <CalendarClock size={14} />
          {formatDate(prescription.createdAt)}
        </span>
      </div>

      <div className={style.examBadges}>
        {prescription.exams.map((exam, index) => (
          <span key={`${exam.examOfferingId}-${index}`} className={style.badge}>
            <FileText size={12} />
            {exam.examOfferingName}
          </span>
        ))}
      </div>

      {prescription.medications && (
        <p className={style.medications}>{prescription.medications}</p>
      )}
    </button>
  );
}

export { PrescriptionCard };
