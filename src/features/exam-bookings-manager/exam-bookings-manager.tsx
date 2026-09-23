import { useState } from 'react';
import { CalendarX2 } from 'lucide-react';
import { DatePicker } from '../../components/date-picker/date-picker';
import { EmptyState } from '../../components/empty-state/empty-state';
import {
  ExamBookingAction,
  ExamBookingRow,
} from '../../components/exam-booking-row/exam-booking-row';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamBookingsByHealthUnitId } from '../../config/api/get-exam-bookings-by-health-unit-id';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { usePatchExamBookingCancel } from '../../config/api/patch-exam-booking-cancel';
import { usePatchExamBookingStatus } from '../../config/api/patch-exam-booking-status';
import {
  examBookingStatus,
  type ExamBookingStatus,
  type IExamBooking,
} from '../../config/entities/exam-booking/exam-booking.entity';
import { getDateKey } from '../../config/utils';
import { handleApiError } from '../../config/utils/handle-api-error';
import style from './exam-bookings-manager.module.scss';

function ExamBookingsManager() {
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<string>();
  const healthUnitId = selectedHealthUnitId ?? healthUnits?.[0]?._id;

  const [date, setDate] = useState(() => getDateKey(new Date()));

  const { data: bookings, isLoading } = useGetExamBookingsByHealthUnitId(
    healthUnitId,
    { date }
  );

  const { mutate: updateStatus, isPending: isUpdating } =
    usePatchExamBookingStatus({ onError: handleApiError });
  const { mutate: cancelBooking, isPending: isCanceling } =
    usePatchExamBookingCancel({ onError: handleApiError });
  const isBusy = isUpdating || isCanceling;

  const changeStatus = (id: string, status: ExamBookingStatus) =>
    updateStatus({ id, status });

  const renderActions = (booking: IExamBooking) => {
    if (
      booking.status === examBookingStatus.SCHEDULED ||
      booking.status === examBookingStatus.CONFIRMED
    ) {
      return (
        <>
          <ExamBookingAction
            disabled={isBusy}
            onClick={() =>
              changeStatus(booking._id, examBookingStatus.IN_PROGRESS)
            }
          >
            Iniciar atendimento
          </ExamBookingAction>
          <ExamBookingAction
            disabled={isBusy}
            onClick={() => changeStatus(booking._id, examBookingStatus.NO_SHOW)}
          >
            Não compareceu
          </ExamBookingAction>
          <ExamBookingAction
            variant="danger"
            disabled={isBusy}
            onClick={() => cancelBooking({ id: booking._id })}
          >
            Cancelar
          </ExamBookingAction>
        </>
      );
    }

    if (booking.status === examBookingStatus.IN_PROGRESS) {
      return (
        <ExamBookingAction
          disabled={isBusy}
          onClick={() => changeStatus(booking._id, examBookingStatus.COMPLETED)}
        >
          Concluir
        </ExamBookingAction>
      );
    }

    return null;
  };

  return (
    <div className={style.mainContent}>
      <HeaderManager
        title="Agenda de Exames"
        subtitle="Acompanhe e gerencie os exames agendados"
        user={user}
      />
      <HealthUnitSelect
        healthUnits={healthUnits}
        value={healthUnitId}
        onChange={setSelectedHealthUnitId}
      />

      <div className={style.content}>
        <label className={style.filter}>
          Data
          <DatePicker value={date} onChange={setDate} />
        </label>

        {bookings?.length ? (
          <div className={style.list}>
            {bookings.map((booking) => (
              <ExamBookingRow key={booking._id} booking={booking}>
                {renderActions(booking)}
              </ExamBookingRow>
            ))}
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              icon={CalendarX2}
              title="Nenhum exame agendado"
              description="Não há exames marcados para a data selecionada."
            />
          )
        )}
      </div>
    </div>
  );
}

export { ExamBookingsManager };
