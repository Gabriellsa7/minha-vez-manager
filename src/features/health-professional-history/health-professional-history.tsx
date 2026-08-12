import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useGetQueueHistoryByProfessionalId } from '../../config/api/get-queue-history-by-professional-id';
import { SIDEBAR_PROFESSIONAL_MANAGER } from '../health-professional-manager/constants';
import { toApiDateRange } from '../../config/utils';
import { HistoryCard } from './components/history-card/history-card';
import { HistoryDetailModal } from './components/history-detail-modal/history-detail-modal';
import { HistoryFilter } from './components/history-filter/history-filter';
import style from './health-professional-history.module.scss';

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
      <div className={style.container}>
        <SideBar
          items={SIDEBAR_PROFESSIONAL_MANAGER}
          pageTitle="Painel de Gestão"
          user={user}
        />
        <div className={style.mainContent}>
          <HeaderManager
            title="Histórico"
            subtitle="Atendimentos que você já realizou"
            onButtonClick={() => {}}
            user={user}
          />

          <HistoryFilter
            startDateInput={startDateInput}
            endDateInput={endDateInput}
            hasAppliedFilter={Boolean(appliedRange.startDate)}
            onStartDateChange={setStartDateInput}
            onEndDateChange={setEndDateInput}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />

          <div className={style.historyGrid}>
            {history?.length ? (
              history.map((entry) => (
                <HistoryCard
                  key={entry.queueItem._id}
                  entry={entry}
                  onClick={() => setSelectedEntryId(entry.queueItem._id)}
                />
              ))
            ) : (
              <p className={style.empty}>
                Nenhum atendimento concluído encontrado para o período
                selecionado.
              </p>
            )}
          </div>
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
