import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetQueueHistoryByProfessionalId } from '../../config/api/get-queue-history-by-professional-id';
import { toApiDateRange } from '../../config/utils';
import { HistoryCard } from './components/history-card/history-card';
import { HistoryDetailModal } from './components/history-detail-modal/history-detail-modal';
import { HistoryFilter } from './components/history-filter/history-filter';
import style from './health-professional-history.module.scss';
import { EmptyState } from '../../components/empty-state/empty-state';
import { History } from 'lucide-react';

function HealthProfessionalHistory() {
  const { data: user } = useCurrentUser();

  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [appliedRange, setAppliedRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const { data: history } = useGetQueueHistoryByProfessionalId({
    professionalId: user?._id,
    startDate: appliedRange.startDate,
    endDate: appliedRange.endDate,
  });

  const handleApplyFilter = () => {
    if (!startDateInput || !endDateInput) return;

    setAppliedRange(toApiDateRange(startDateInput, endDateInput));
  };

  const handleClearFilter = () => {
    setStartDateInput('');
    setEndDateInput('');
    setAppliedRange({});
  };

  const selectedEntry =
    history?.find((entry) => entry.queueItem._id === selectedEntryId) ?? null;

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Histórico"
          subtitle="Atendimentos que você já realizou"
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

          {history?.length ? (
            <div className={style.historyGrid}>
              {history.map((entry) => (
                <HistoryCard
                  key={entry.queueItem._id}
                  entry={entry}
                  onClick={() => setSelectedEntryId(entry.queueItem._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="Nenhum atendimento encontrado"
              description="Não há atendimentos concluídos no período selecionado."
            />
          )}
        </div>
      </div>
      <HistoryDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntryId(null)}
      />
    </>
  );
}

export { HealthProfessionalHistory };
