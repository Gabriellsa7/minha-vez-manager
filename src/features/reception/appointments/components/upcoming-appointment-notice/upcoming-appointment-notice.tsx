import { CalendarClock } from 'lucide-react';
import type { IUpcomingAppointment } from '../../../../../config/entities/patient/patient.entity';
import style from './upcoming-appointment-notice.module.scss';

const BRAZIL_TIME_ZONE = 'America/Sao_Paulo';

interface UpcomingAppointmentNoticeProps {
  appointment: IUpcomingAppointment;
  healthUnitId?: string;
  professionalName?: string;
  onSearchAnother: () => void;
}

const formatAppointmentDate = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: BRAZIL_TIME_ZONE,
  });
  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: BRAZIL_TIME_ZONE,
  });
  return `${day} às ${time}`;
};

// Shown instead of the booking form when the patient found by CPF already has an
// appointment coming up: the reception books one appointment per patient at a time.
function UpcomingAppointmentNotice({
  appointment,
  healthUnitId,
  professionalName,
  onSearchAnother,
}: UpcomingAppointmentNoticeProps) {
  const isInThisUnit =
    Boolean(healthUnitId) && appointment.healthUnitId === healthUnitId;
  const isInProgress = appointment.status === 'IN_PROGRESS';

  const where = isInThisUnit
    ? professionalName
      ? ` com ${professionalName}, nesta unidade`
      : ', nesta unidade'
    : ', em outra unidade de saúde';

  return (
    <section
      className={style.card}
      role="alert"
      aria-labelledby="upcoming-appointment-title"
    >
      <span className={style.icon} aria-hidden>
        <CalendarClock size={20} />
      </span>

      <div className={style.content}>
        <h2 id="upcoming-appointment-title" className={style.title}>
          {isInProgress
            ? 'Este paciente está em atendimento'
            : 'Este paciente já tem uma consulta marcada'}
        </h2>
        <p className={style.text}>
          Consulta {isInProgress ? 'em andamento' : 'marcada'} para{' '}
          <strong>{formatAppointmentDate(appointment.dateTime)}</strong>
          {where}. Uma nova consulta só pode ser marcada depois que essa for
          concluída ou cancelada.
        </p>
        <button
          type="button"
          className={style.button}
          onClick={onSearchAnother}
        >
          Buscar outro paciente
        </button>
      </div>
    </section>
  );
}

export { UpcomingAppointmentNotice };
