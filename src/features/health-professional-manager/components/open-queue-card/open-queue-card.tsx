import {
  appointmentsStatus,
  type IAppointment,
} from '../../../../config/entities/appointments/appointment.entity';
import { formatDateTime } from '../../../../config/utils';
import style from './open-queue-card.module.scss';

interface OpenQueueCardProps {
  onOpen: () => void;
  appointment?: IAppointment[] | null;
}

function OpenQueueCard({ onOpen, appointment }: OpenQueueCardProps) {
  const nextAppointment = appointment
    ?.filter((a) => a.status === appointmentsStatus.SCHEDULED && !a.finishedAt)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )[0];
  return (
    <div className={style.container}>
      <div className={style.content}>
        <span className={style.title}>No queue is currently open</span>
        <span className={style.description}>
          Queue scheduled for{' '}
          <strong>{formatDateTime(nextAppointment?.dateTime)}</strong> is ready
          to be started.
        </span>
      </div>

      <button className={style.button} onClick={onOpen}>
        Open Queue
      </button>
    </div>
  );
}

export { OpenQueueCard };
