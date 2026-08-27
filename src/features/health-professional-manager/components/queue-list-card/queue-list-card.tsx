import type { IQueue } from '../../../../config/entities/queue/queue.entity';
import { formatDate } from '../../../../config/utils';
import style from './queue-list-card.module.scss';

interface QueueListCardProps {
  queue: IQueue;
  isToday: boolean;
  hasShiftStarted: boolean;
  isActive: boolean;
  isBlocked: boolean;
  onOpen: (queueId: string) => void;
  onClose: (queueId: string) => void;
  isOpening?: boolean;
  isClosing?: boolean;
}

const STATUS_LABEL: Record<IQueue['status'], string> = {
  OPEN: 'Aberta',
  IN_PROGRESS: 'Em atendimento',
  CLOSED: 'Fechada',
};

function QueueListCard({
  queue,
  isToday,
  hasShiftStarted,
  isActive,
  isBlocked,
  onOpen,
  onClose,
  isOpening,
  isClosing,
}: QueueListCardProps) {
  const canOpen = !isActive && isToday && hasShiftStarted && !isBlocked;

  const hint = isActive
    ? undefined
    : !isToday
      ? 'Só pode ser aberta na data agendada'
      : !hasShiftStarted
        ? 'Fila da tarde só pode ser aberta a partir das 12:30'
        : isBlocked
          ? 'Feche a fila em atendimento para abrir esta'
          : undefined;

  return (
    <div className={style.container}>
      <div className={style.info}>
        <span className={style.date}>{formatDate(queue.queueDate)}</span>
        <span className={`${style.badge} ${style[queue.status.toLowerCase()]}`}>
          {STATUS_LABEL[queue.status]}
        </span>
        {hint && <span className={style.hint}>{hint}</span>}
      </div>

      {isActive ? (
        <button
          className={style.closeButton}
          onClick={() => onClose(queue._id)}
          disabled={isClosing}
        >
          {isClosing ? 'Fechando...' : 'Fechar fila'}
        </button>
      ) : (
        <div className={style.actions}>
          <button
            className={style.openButton}
            onClick={() => onOpen(queue._id)}
            disabled={!canOpen || isOpening}
          >
            {isOpening ? 'Abrindo...' : 'Abrir fila'}
          </button>
          <button
            className={style.cancelButton}
            onClick={() => onClose(queue._id)}
            disabled={isClosing}
          >
            {isClosing ? 'Cancelando...' : 'Cancelar fila'}
          </button>
        </div>
      )}
    </div>
  );
}

export { QueueListCard };
