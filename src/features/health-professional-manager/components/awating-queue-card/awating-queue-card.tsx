import type { IQueueManagement } from '../../../../config/entities/queue-management/queue-management.entity';
import style from './awating-queue-card.module.scss';

interface AwaitingQueueCardProps {
  queueManagement?: IQueueManagement;
  onCall: (item: string) => void;
}

function AwaitingQueueCard({
  queueManagement,
  onCall,
}: AwaitingQueueCardProps) {
  const firstWaitingItem = queueManagement?.items[0];

  const canCall = !queueManagement?.currentItem && firstWaitingItem;
  return (
    <div className={style.container}>
      <span>{queueManagement?.queue.status}</span>
      {queueManagement?.items.map((item) => (
        <div key={item.queueItem._id}>
          <span>{item.queueItem.code}</span>
          <span>{item.user.name}</span>
          <span>{item.patient.priority}</span>
          <span>{item.queueItem.position}</span>
          <span>{item.queueItem.status}</span>

          {canCall && firstWaitingItem.queueItem._id === item.queueItem._id && (
            <button onClick={() => onCall(item.queueItem._id)}>
              Chamar paciente
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export { AwaitingQueueCard };
