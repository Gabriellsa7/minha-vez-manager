import { CalendarClock, FileText, Stethoscope, User } from 'lucide-react';
import type { IExam } from '../../config/entities/exam/exam.entity';
import { formatDate } from '../../config/utils';
import style from './exam-card.module.scss';

interface ExamCardProps {
  exam: IExam;
  onClick?: () => void;
}

function ExamCard({ exam, onClick }: ExamCardProps) {
  return (
    <div
      className={style.card}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={style.iconWrapper}>
        <FileText size={22} />
      </div>

      <div className={style.content}>
        <h3>{exam.examType}</h3>

        <div className={style.meta}>
          <User size={14} />
          <span>
            {exam.patientName} · {exam.patientCpf}
          </span>
        </div>

        {exam.examDate && (
          <div className={style.meta}>
            <CalendarClock size={14} />
            <span>{formatDate(exam.examDate)}</span>
          </div>
        )}

        {exam.doctorName && (
          <div className={style.meta}>
            <Stethoscope size={14} />
            <span>{exam.doctorName}</span>
          </div>
        )}

        <div className={style.healthUnit}>{exam.healthUnitName}</div>
      </div>
    </div>
  );
}

export { ExamCard };
