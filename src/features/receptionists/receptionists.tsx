import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitSelect } from '../../components/health-unit-select/health-unit-select';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { useReceptionistsByHealthUnitId } from '../../config/api/get-receptionists-by-health-unit-id';
import { ReceptionistModal } from './components/receptionist-modal/receptionist-modal';
import { ReceptionistDetailModal } from './components/receptionist-detail-modal/receptionist-detail-modal';
import { ReceptionistCard } from './components/receptionist-card/receptionist-card';
import style from './receptionists.module.scss';
import { EmptyState } from '../../components/empty-state/empty-state';
import { UserPlus } from 'lucide-react';

function Receptionists() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceptionistId, setSelectedReceptionistId] = useState<
    string | null
  >(null);
  const { data: user } = useCurrentUser();
  const { data: healthUnits } = useHealthUnitsByUserId(user?._id);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<string>();
  const healthUnitId = selectedHealthUnitId ?? healthUnits?.[0]?._id;

  const { data: receptionists, isLoading } =
    useReceptionistsByHealthUnitId(healthUnitId);

  const selectedReceptionist =
    receptionists?.find(
      (receptionist) => receptionist._id === selectedReceptionistId
    ) ?? null;

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Recepcionistas"
          subtitle="Gerencie quem pode marcar consultas e exames no balcão"
          buttonText="Nova recepcionista"
          onButtonClick={() => setIsModalOpen(true)}
          user={user}
        />
        <HealthUnitSelect
          healthUnits={healthUnits}
          value={healthUnitId}
          onChange={setSelectedHealthUnitId}
        />
        <div className={style.content}>
          {receptionists?.length ? (
            <div className={style.receptionistsSection}>
              {receptionists.map((receptionist) => (
                <ReceptionistCard
                  key={receptionist._id}
                  receptionist={receptionist}
                  onClick={() => setSelectedReceptionistId(receptionist._id)}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <EmptyState
                icon={UserPlus}
                title="Nenhuma recepcionista cadastrada"
                description="Recepcionistas fazem check-in e marcam consultas e exames no balcão da unidade."
              />
            )
          )}
        </div>
      </div>
      <ReceptionistModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        healthUnitId={healthUnitId}
      />
      {selectedReceptionist && (
        <ReceptionistDetailModal
          key={selectedReceptionist._id}
          receptionist={selectedReceptionist}
          onClose={() => setSelectedReceptionistId(null)}
        />
      )}
    </>
  );
}

export { Receptionists };
