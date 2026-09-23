import { useState } from 'react';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import style from './health-unit-manager.module.scss';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitModal } from './components/health-unit-modal/health-unit-modal';
import { HealthUnitCard } from './components/health-unit-card/health-unit-card';
import { HealthUnitDetailModal } from './components/health-unit-detail-modal/health-unit-detail-modal';
import { EmptyState } from '../../components/empty-state/empty-state';
import { Hospital } from 'lucide-react';

function HealthUnitManager() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<
    string | null
  >(null);
  const { data: user } = useCurrentUser();

  const { data: healthUnit, isLoading } = useHealthUnitsByUserId(user?._id);
  const selectedHealthUnit =
    healthUnit?.find((health) => health._id === selectedHealthUnitId) ?? null;

  return (
    <>
      <div className={style.mainContent}>
        <HeaderManager
          title="Unidade de Saúde"
          subtitle="Gerencie suas unidades de Saúde"
          buttonText="Nova Unidade"
          onButtonClick={() => setOpenModal(true)}
        />
        <div className={style.content}>
          {healthUnit?.length ? (
            <div className={style.healthUnitSection}>
              {healthUnit.map((health) => (
                <HealthUnitCard
                  key={health._id}
                  healthUnit={health}
                  onClick={() => setSelectedHealthUnitId(health._id)}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <EmptyState
                icon={Hospital}
                title="Nenhuma unidade cadastrada"
                description="Cadastre a primeira unidade de saúde para organizar profissionais, filas e exames."
              />
            )
          )}
        </div>
      </div>
      <HealthUnitModal onClose={() => setOpenModal(false)} open={openModal} />
      {selectedHealthUnit && (
        <HealthUnitDetailModal
          key={selectedHealthUnit._id}
          healthUnit={selectedHealthUnit}
          onClose={() => setSelectedHealthUnitId(null)}
        />
      )}
    </>
  );
}

export { HealthUnitManager };
