import { CheckCircle2, Clock3, UserRoundCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { EmptyState } from '../../../../components/empty-state/empty-state';
import { useCheckInQueueItem } from '../../../../config/api/check-in-queue-item';
import { QueueItemStatus } from '../../../../config/entities/queue-item/queue-item.entity';
import { formatTime } from '../../../../config/utils';
import { handleApiError } from '../../../../config/utils/handle-api-error';
import { useActiveQueueItem } from '../hooks/use-active-queue-item';
import style from './check-in-status.module.scss';

interface CheckInStatusProps {
  patientId: string;
}

function CheckInStatus({ patientId }: CheckInStatusProps) {
  const { activeQueueItem, isLoading } = useActiveQueueItem(patientId);
  const { mutate: checkIn, isPending } = useCheckInQueueItem();

  if (isLoading) {
    return (
      <section className={style.card}>
        <p className={style.loading}>Buscando atendimento do dia...</p>
      </section>
    );
  }

  if (!activeQueueItem) {
    return (
      <EmptyState
        icon={Clock3}
        title="Nenhuma consulta em andamento"
        description="Não encontramos uma consulta ativa para esse paciente hoje."
      />
    );
  }

  const handleCheckIn = () => {
    checkIn(activeQueueItem._id, {
      onSuccess: () => toast.success('Check-in confirmado com sucesso.'),
      onError: handleApiError,
    });
  };

  if (activeQueueItem.status === QueueItemStatus.IN_SERVICE) {
    return (
      <section className={style.card}>
        <div className={style.status} role="status">
          <UserRoundCheck size={18} aria-hidden />
          Paciente já está em atendimento.
        </div>
      </section>
    );
  }

  return (
    <section className={style.card} aria-label="Check-in">
      <div className={style.ticket}>
        <span>Senha</span>
        <strong>#{activeQueueItem.code}</strong>
      </div>

      {activeQueueItem.checkInTime ? (
        <div className={`${style.status} ${style.confirmed}`} role="status">
          <CheckCircle2 size={18} aria-hidden />
          Check-in confirmado às {formatTime(activeQueueItem.checkInTime)}
        </div>
      ) : (
        <>
          <div className={`${style.status} ${style.pending}`} role="status">
            <Clock3 size={18} aria-hidden />
            Check-in ainda não realizado.
          </div>
          <button
            type="button"
            className={style.confirmButton}
            disabled={isPending}
            onClick={handleCheckIn}
          >
            <UserRoundCheck size={16} aria-hidden />
            {isPending ? 'Confirmando...' : 'Confirmar check-in'}
          </button>
        </>
      )}
    </section>
  );
}

export { CheckInStatus };
