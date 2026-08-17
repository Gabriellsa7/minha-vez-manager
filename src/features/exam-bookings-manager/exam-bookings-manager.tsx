import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { DatePicker } from '../../components/date-picker/date-picker';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import {
  GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY,
  useGetExamBookingsByHealthUnitId,
} from '../../config/api/get-exam-bookings-by-health-unit-id';
import { usePatchExamBookingStatus } from '../../config/api/patch-exam-booking-status';
import { usePatchExamBookingCancel } from '../../config/api/patch-exam-booking-cancel';
import { handleApiError } from '../../config/utils/handle-api-error';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import {
  examBookingStatus,
  type ExamBookingStatus,
  type IExamBooking,
} from '../../config/entities/exam-booking/exam-booking.entity';
import style from './exam-bookings-manager.module.scss';

const STATUS_LABEL: Record<ExamBookingStatus, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em atendimento',
  COMPLETED: 'Realizado',
  CANCELED: 'Cancelado',
  NO_SHOW: 'Não compareceu',
};

function todayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function ExamBookingsManager() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<string>();
  const healthUnitId = selectedHealthUnitId ?? healthUnits?.[0]?._id;

  const [date, setDate] = useState(todayDateInputValue());

  const { data: bookings } = useGetExamBookingsByHealthUnitId(healthUnitId, {
    date,
  });

  const { mutate: updateStatus } = usePatchExamBookingStatus();
  const { mutate: cancelBooking } = usePatchExamBookingCancel();

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: [GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY, healthUnitId],
    });
  };

  const handleStatusChange = (id: string, status: ExamBookingStatus) => {
    updateStatus(
      { id, status },
      { onSuccess: invalidate, onError: handleApiError },
    );
  };

  const handleCancel = (id: string) => {
    cancelBooking(
      { id },
      { onSuccess: invalidate, onError: handleApiError },
    );
  };

  const renderActions = (booking: IExamBooking) => {
    if (
      booking.status === examBookingStatus.SCHEDULED ||
      booking.status === examBookingStatus.CONFIRMED
    ) {
      return (
        <>
          <button
            type="button"
            onClick={() =>
              handleStatusChange(booking._id, examBookingStatus.IN_PROGRESS)
            }
          >
            Iniciar atendimento
          </button>
          <button
            type="button"
            onClick={() =>
              handleStatusChange(booking._id, examBookingStatus.NO_SHOW)
            }
          >
            Não compareceu
          </button>
          <button
            type="button"
            className={style.dangerButton}
            onClick={() => handleCancel(booking._id)}
          >
            Cancelar
          </button>
        </>
      );
    }

    if (booking.status === examBookingStatus.IN_PROGRESS) {
      return (
        <button
          type="button"
          onClick={() =>
            handleStatusChange(booking._id, examBookingStatus.COMPLETED)
          }
        >
          Concluir
        </button>
      );
    }

    return null;
  };

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_MANAGER_ITEMS}
        pageTitle="Painel Manager"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Agenda de Exames"
          subtitle="Acompanhe e gerencie os exames agendados"
          onButtonClick={() => {}}
          user={user}
        />
        <HealthUnitSelect
          healthUnits={healthUnits}
          value={healthUnitId}
          onChange={setSelectedHealthUnitId}
        />

        <div className={style.content}>
          <div className={style.filters}>
            <label>
              Data
              <DatePicker value={date} onChange={setDate} />
            </label>
          </div>

          <div className={style.list}>
            {bookings?.length ? (
              bookings.map((booking) => (
                <div key={booking._id} className={style.row}>
                  <div className={style.rowInfo}>
                    <strong>{booking.patientName}</strong>
                    <span>{booking.examOfferingName}</span>
                    <span>
                      {new Date(booking.scheduledAt).toLocaleTimeString(
                        'pt-BR',
                        { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' },
                      )}
                    </span>
                    <span
                      className={`${style.status} ${style[booking.status]}`}
                    >
                      {STATUS_LABEL[booking.status]}
                    </span>
                  </div>
                  <div className={style.rowActions}>{renderActions(booking)}</div>
                </div>
              ))
            ) : (
              <p className={style.empty}>
                Nenhum exame agendado para esta data.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ExamBookingsManager };
