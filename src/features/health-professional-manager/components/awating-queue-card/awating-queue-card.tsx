import type { IQueueItem } from '../../../../config/entities/queue-item/queue-item.entity';
import type { IQueue } from '../../../../config/entities/queue/queue.entity';
import style from './awating-queue-card.module.scss';

interface AwaitingQueueCardProps {
  queueItem?: IQueueItem[];
  queue?: IQueue;
}

function AwaitingQueueCard({ queueItem, queue }: AwaitingQueueCardProps) {
  return (
    <div className={style.container}>
      {queueItem &&
        queueItem.map((queue) => (
          <div>
            <span>{queue.code}</span>
          </div>
        ))}
      {queue && (
        <div>
          <span>{queue.status}</span>
        </div>
      )}
      <span>AwaitingQueueCard</span>
    </div>
  );
}

export { AwaitingQueueCard };
