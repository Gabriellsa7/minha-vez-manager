import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamBookingsByHealthUnitId } from '../../config/api/get-exam-bookings-by-health-unit-id';
import { toApiDateRange, formatDate, formatTime } from '../../config/utils';
import {
  examBookingStatus,
  type ExamBookingStatus,
} from '../../config/entities/exam-booking/exam-booking.entity';
import { HistoryFilter } from '../health-professional-history/components/history-filter/history-filter';
import { SIDEBAR_EXAM_PROFESSIONAL_MANAGER } from '../exam-professional-manager/constants';
import style from './exam-professional-history.module.scss';

const STATUS_LABEL: Record<ExamBookingStatus, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em atendimento',
  COMPLETED: 'Realizado',
  CANCELED: 'Cancelado',
  NO_SHOW: 'Não compareceu',
};

const HISTORY_STATUSES: ExamBookingStatus[] = [
  examBookingStatus.COMPLETED,
  examBookingStatus.CANCELED,
  examBookingStatus.NO_SHOW,
];

function ExamProfessionalHistory() {
  const { data: user } = useCurrentUser();

  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [appliedRange, setAppliedRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: bookings } = useGetExamBookingsByHealthUnitId(
    user?.healthUnitId,
    {
      startDate: appliedRange.startDate,
      endDate: appliedRange.endDate,
    }
  );

  const handleApplyFilter = () => {
    if (!startDateInput || !endDateInput) return;

    setAppliedRange(toApiDateRange(startDateInput, endDateInput));
  };

  const handleClearFilter = () => {
    setStartDateInput('');
    setEndDateInput('');
    setAppliedRange({});
  };

  const historyBookings = (bookings ?? [])
    .filter((booking) => HISTORY_STATUSES.includes(booking.status))
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

  return (
    <div className={style.container}>
      <SideBar
        items={SIDEBAR_EXAM_PROFESSIONAL_MANAGER}
        pageTitle="Painel de Exames"
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Histórico"
          subtitle="Exames já realizados, cancelados ou não comparecidos"
          onButtonClick={() => {}}
          user={user}
        />

        <div className={style.content}>
          <HistoryFilter
            startDateInput={startDateInput}
            endDateInput={endDateInput}
            hasAppliedFilter={Boolean(appliedRange.startDate)}
            onStartDateChange={setStartDateInput}
            onEndDateChange={setEndDateInput}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />

          <div className={style.list}>
            {historyBookings.length ? (
              historyBookings.map((booking) => (
                <div key={booking._id} className={style.row}>
                  <div className={style.rowInfo}>
                    <strong>{booking.patientName}</strong>
                    <span>
                      {formatDate(booking.scheduledAt, 'UTC')}{' '}
                      {formatTime(booking.scheduledAt, 'UTC')}
                    </span>
                    <span>{booking.examOfferingName}</span>
                    <span
                      className={`${style.status} ${style[booking.status]}`}
                    >
                      {STATUS_LABEL[booking.status]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={style.empty}>
                Nenhum exame encontrado para o período selecionado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ExamProfessionalHistory };
