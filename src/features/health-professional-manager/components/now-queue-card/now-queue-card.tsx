import type { IQueueManagementItem } from '../../../../config/entities/queue-management/queue-management.entity';
import type { IQueue } from '../../../../config/entities/queue/queue.entity';
import { formatTime } from '../../../../config/utils';
import style from './now-queue-card.module.scss';

interface INowQueueCardProps {
  queue: IQueue;
  currentItem: IQueueManagementItem | null;
  onFinish?: () => void;
  onAbsent?: () => void;
}

function NowQueueCard({
  // queue,
  currentItem,
  onFinish,
  onAbsent,
}: INowQueueCardProps) {
  if (!currentItem) return null;

  return (
    <div className={style.container}>
      <div className={style.info}>
        <span className={style.label}>CHAMANDO AGORA</span>

        <h2 className={style.name}>{currentItem.user.name}</h2>

        <p className={style.details}>
          <span>Senha:</span>
          <strong>{currentItem.queueItem.code}</strong>
          <span>•</span>
          <span>{formatTime(currentItem.queueItem.calledAt) || null}</span>
          {/* <span>Sala {queue.room}</span> */}
        </p>

        <div className={style.actions}>
          <button className={style.finishButton} onClick={onFinish}>
            Concluir
          </button>
          <button className={style.absentButton} onClick={onAbsent}>
            Ausente
          </button>
        </div>
      </div>

      <div className={style.imageContainer}>
        <span className={style.status}>
          <span className={style.dot} />
          Atendimento Ativo
        </span>

        {/* <img src={currentItem.patient.photo} alt={currentItem.patient.name} /> */}
      </div>
    </div>
  );
}
export { NowQueueCard };
