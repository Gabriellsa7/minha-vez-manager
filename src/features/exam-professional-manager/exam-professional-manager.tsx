import { useState } from 'react';
import { CalendarCheck2 } from 'lucide-react';
import { DatePicker } from '../../components/date-picker/date-picker';
import { EmptyState } from '../../components/empty-state/empty-state';
import {
  ExamBookingAction,
  ExamBookingRow,
} from '../../components/exam-booking-row/exam-booking-row';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamBookingsByHealthUnitId } from '../../config/api/get-exam-bookings-by-health-unit-id';
import { usePatchExamBookingStatus } from '../../config/api/patch-exam-booking-status';
import {
  examBookingStatus,
  type ExamBookingStatus,
  type IExamBooking,
} from '../../config/entities/exam-booking/exam-booking.entity';
import { getDateKey } from '../../config/utils';
import { handleApiError } from '../../config/utils/handle-api-error';
import style from './exam-professional-manager.module.scss';

const PENDING_STATUSES: ExamBookingStatus[] = [
  examBookingStatus.SCHEDULED,
  examBookingStatus.CONFIRMED,
  examBookingStatus.IN_PROGRESS,
];

const byScheduledAt = (a: IExamBooking, b: IExamBooking) =>
  new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();

function ExamProfessionalManager() {
  const { data: user } = useCurrentUser();
  const [date, setDate] = useState(() => getDateKey(new Date()));

  const { data: bookings, isLoading } = useGetExamBookingsByHealthUnitId(
    user?.healthUnitId,
    { date }
  );

  const { mutate: updateStatus, isPending } = usePatchExamBookingStatus({
    onError: handleApiError,
  });

  const changeStatus = (id: string, status: ExamBookingStatus) =>
    updateStatus({ id, status });

  const pendingBookings = (bookings ?? [])
    .filter((booking) => PENDING_STATUSES.includes(booking.status))
    .sort(byScheduledAt);

  const renderActions = (booking: IExamBooking) => {
    if (booking.status === examBookingStatus.IN_PROGRESS) {
      return (
        <ExamBookingAction
          disabled={isPending}
          onClick={() => changeStatus(booking._id, examBookingStatus.COMPLETED)}
        >
          Concluir
        </ExamBookingAction>
      );
    }

    return (
      <>
        <ExamBookingAction
          disabled={isPending}
          onClick={() =>
            changeStatus(booking._id, examBookingStatus.IN_PROGRESS)
          }
        >
          Iniciar
        </ExamBookingAction>
        <ExamBookingAction
          variant="danger"
          disabled={isPending}
          onClick={() => changeStatus(booking._id, examBookingStatus.NO_SHOW)}
        >
          Não compareceu
        </ExamBookingAction>
      </>
    );
  };

  return (
    <div className={style.mainContent}>
      <HeaderManager
        title="Exames do dia"
        subtitle="Pacientes agendados para realizar exames"
        user={user}
      />

      <div className={style.content}>
        <label className={style.filter}>
          Data
          <DatePicker value={date} onChange={setDate} />
        </label>

        {pendingBookings.length ? (
          <div className={style.list}>
            {pendingBookings.map((booking) => (
              <ExamBookingRow key={booking._id} booking={booking}>
                {renderActions(booking)}
              </ExamBookingRow>
            ))}
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              icon={CalendarCheck2}
              title="Nenhum exame pendente"
              description="Todos os exames desta data já foram atendidos, ou nenhum foi agendado."
            />
          )
        )}
      </div>
    </div>
  );
}

export { ExamProfessionalManager };
