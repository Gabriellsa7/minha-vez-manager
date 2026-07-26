import type { IQueueItem } from '../../../../config/entities/queue-item/queue-item.entity';
import style from './awating-queue-card.module.scss';

interface AwaitingQueueCardProps {
  queueItem: IQueueItem[];
}

function AwaitingQueueCard({ queueItem }: AwaitingQueueCardProps) {
  return (
    <div className={style.container}>
      {queueItem.map((queue) => (
        <div>
          <span>{queue.code}</span>
        </div>
      ))}
      <span>AwaitingQueueCard</span>
    </div>
  );
}

export { AwaitingQueueCard };
