import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import {
  GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY,
  useGetExamBookingsByHealthUnitId,
} from '../../config/api/get-exam-bookings-by-health-unit-id';
import { usePatchExamBookingStatus } from '../../config/api/patch-exam-booking-status';
import { handleApiError } from '../../config/utils/handle-api-error';
import { formatTime } from '../../config/utils';
import {
  examBookingStatus,
  type ExamBookingStatus,
  type IExamBooking,
} from '../../config/entities/exam-booking/exam-booking.entity';
import { SIDEBAR_EXAM_PROFESSIONAL_MANAGER } from './constants';
import style from './exam-professional-manager.module.scss';

const STATUS_LABEL: Record<ExamBookingStatus, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em atendimento',
  COMPLETED: 'Realizado',
  CANCELED: 'Cancelado',
  NO_SHOW: 'Não compareceu',
};

const PENDING_STATUSES: ExamBookingStatus[] = [
  examBookingStatus.SCHEDULED,
  examBookingStatus.CONFIRMED,
  examBookingStatus.IN_PROGRESS,
];

function todayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function ExamProfessionalManager() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const [date, setDate] = useState(todayDateInputValue());

  const { data: bookings } = useGetExamBookingsByHealthUnitId(
    user?.healthUnitId,
    { date }
  );

  const { mutate: updateStatus } = usePatchExamBookingStatus();

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: [
        GET_EXAM_BOOKINGS_BY_HEALTH_UNIT_ID_KEY,
        user?.healthUnitId,
      ],
    });
  };

  const handleStatusChange = (id: string, status: ExamBookingStatus) => {
    updateStatus(
      { id, status },
      { onSuccess: invalidate, onError: handleApiError }
    );
  };

  const pendingBookings = (bookings ?? [])
    .filter((booking) => PENDING_STATUSES.includes(booking.status))
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

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
            Iniciar
          </button>
          <button
            type="button"
            className={style.dangerButton}
            onClick={() =>
              handleStatusChange(booking._id, examBookingStatus.NO_SHOW)
            }
          >
            Não compareceu
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
        items={SIDEBAR_EXAM_PROFESSIONAL_MANAGER}
        pageTitle="Painel de Exames"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Exames do dia"
          subtitle="Pacientes agendados para realizar exames"
          onButtonClick={() => {}}
          user={user}
        />

        <div className={style.content}>
          <div className={style.filters}>
            <label>
              Data
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
          </div>

          <div className={style.list}>
            {pendingBookings.length ? (
              pendingBookings.map((booking) => (
                <div key={booking._id} className={style.row}>
                  <div className={style.rowInfo}>
                    <strong>{booking.patientName}</strong>
                    <span>{formatTime(booking.scheduledAt, 'UTC')}</span>
                    <span>{booking.examOfferingName}</span>
                    <span
                      className={`${style.status} ${style[booking.status]}`}
                    >
                      {STATUS_LABEL[booking.status]}
                    </span>
                  </div>
                  <div className={style.rowActions}>
                    {renderActions(booking)}
                  </div>
                </div>
              ))
            ) : (
              <p className={style.empty}>
                Nenhum exame pendente para esta data.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ExamProfessionalManager };
