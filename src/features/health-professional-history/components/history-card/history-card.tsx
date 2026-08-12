import { CalendarClock, IdCard, User } from 'lucide-react';
import type { IQueueHistoryEntry } from '../../../../config/entities/queue-history/queue-history.entity';
import { formatDateTime } from '../../../../config/utils';
import { PRIORITY_LABEL } from '../../constants';
import style from './history-card.module.scss';

interface HistoryCardProps {
  entry: IQueueHistoryEntry;
  onClick?: () => void;
}

function HistoryCard({ entry, onClick }: HistoryCardProps) {
  return (
    <div
      className={style.card}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={style.iconWrapper}>
        <User size={22} />
      </div>

      <div className={style.content}>
        <h3>{entry.user.name}</h3>

        <div className={style.meta}>
          <IdCard size={14} />
          <span>Senha {entry.queueItem.code}</span>
        </div>

        <div className={style.meta}>
          <CalendarClock size={14} />
          <span>{formatDateTime(entry.queueItem.finishedAt)}</span>
        </div>

        <span
          className={`${style.priorityBadge} ${
            style[entry.patient.priority.toLowerCase()]
          }`}
        >
          {PRIORITY_LABEL[entry.patient.priority] ?? entry.patient.priority}
        </span>
      </div>
    </div>
  );
}

export { HistoryCard };
