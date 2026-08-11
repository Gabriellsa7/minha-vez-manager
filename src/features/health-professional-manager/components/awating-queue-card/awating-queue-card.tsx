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
  const nextQueueItemId = queueManagement?.nextQueueItemId;

  const canCall = !queueManagement?.currentItem && Boolean(nextQueueItemId);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div>
          <h2>Fila de Espera</h2>
          <span>
            {queueManagement?.items.length ?? 0} pacientes aguardando
            atendimento
          </span>
        </div>

        <button className={style.link}>Ver fila completa →</button>
      </div>

      <div className={style.list}>
        {queueManagement?.items.map((item) => {
          const initials = item.user.name
            .split(' ')
            .slice(0, 2)
            .map((name) => name[0])
            .join('');

          const isNext = nextQueueItemId === item.queueItem._id;

          return (
            <div key={item.queueItem._id} className={style.card}>
              <div className={style.patient}>
                <div className={style.avatar}>{initials}</div>

                <div>
                  <strong>
                    {item.user.name}
                    {item.isReturn && (
                      <span className={style.returnTag}>Retorno</span>
                    )}
                  </strong>
                  <span>Senha: {item.queueItem.code}</span>
                </div>
              </div>

              <div className={style.info}>
                <div>
                  <label>ESPERA</label>
                  <span>
                    {typeof item.queueItem.estimatedWaitMinutes === 'number'
                      ? `${item.queueItem.estimatedWaitMinutes} min`
                      : '--'}
                  </span>
                </div>

                <div>
                  <label>PRIORIDADE</label>

                  <span
                    className={`${style.priority} ${
                      style[item.patient.priority.toLowerCase()]
                    }`}
                  >
                    {item.patient.priority}
                  </span>
                </div>

                {canCall && isNext && (
                  <button
                    className={style.callButton}
                    onClick={() => onCall(item.queueItem._id)}
                  >
                    Chamar paciente
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { AwaitingQueueCard };
