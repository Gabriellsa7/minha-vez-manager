import { Clock, Droplet, Pencil } from 'lucide-react';
import style from './exam-offering-card.module.scss';
import type { IExamOffering } from '../../../../config/entities/exam-offering/exam-offering.entity';

interface ExamOfferingCardProps {
  examOffering: IExamOffering;
  onEdit: () => void;
}

function ExamOfferingCard({ examOffering, onEdit }: ExamOfferingCardProps) {
  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <h3>{examOffering.name}</h3>
        <button
          type="button"
          className={style.editButton}
          onClick={onEdit}
          aria-label={`Editar ${examOffering.name}`}
        >
          <Pencil size={16} />
        </button>
      </div>

      {examOffering.category && (
        <span className={style.category}>{examOffering.category}</span>
      )}

      <div className={style.meta}>
        <span>
          <Clock size={14} /> {examOffering.durationMinutes} min
        </span>
        {examOffering.requiresFasting && (
          <span>
            <Droplet size={14} /> Jejum
            {examOffering.fastingHours ? ` de ${examOffering.fastingHours}h` : ''}
          </span>
        )}
      </div>

      {typeof examOffering.price === 'number' && (
        <span className={style.price}>
          R$ {examOffering.price.toFixed(2).replace('.', ',')}
        </span>
      )}

      <span
        className={`${style.status} ${
          examOffering.isActive ? style.active : style.inactive
        }`}
      >
        {examOffering.isActive ? 'Ativo' : 'Inativo'}
      </span>
    </div>
  );
}

export { ExamOfferingCard };
