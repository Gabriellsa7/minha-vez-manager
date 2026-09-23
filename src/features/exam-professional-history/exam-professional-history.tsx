import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetExamBookingsByHealthUnitId } from '../../config/api/get-exam-bookings-by-health-unit-id';
import { toApiDateRange } from '../../config/utils';
import { History } from 'lucide-react';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ExamBookingRow } from '../../components/exam-booking-row/exam-booking-row';
import {
  examBookingStatus,
  type ExamBookingStatus,
} from '../../config/entities/exam-booking/exam-booking.entity';
import { HistoryFilter } from '../health-professional-history/components/history-filter/history-filter';
import style from './exam-professional-history.module.scss';

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

  const { data: bookings, isLoading } = useGetExamBookingsByHealthUnitId(
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
    <div className={style.mainContent}>
      <HeaderManager
        title="Histórico"
        subtitle="Exames já realizados, cancelados ou não comparecidos"
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

        {historyBookings.length ? (
          <div className={style.list}>
            {historyBookings.map((booking) => (
              <ExamBookingRow key={booking._id} booking={booking} showDate />
            ))}
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              icon={History}
              title="Nenhum exame no histórico"
              description="Não encontramos exames realizados, cancelados ou com falta no período selecionado."
            />
          )
        )}
      </div>
    </div>
  );
}

export { ExamProfessionalHistory };
