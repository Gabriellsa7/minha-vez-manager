import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { SIDEBAR_MANAGER_ITEMS } from './constants';
import style from './health-unit-manager.module.scss';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitModal } from './components/health-unit-modal/health-unit-modal';
import { HealthUnitCard } from './components/health-unit-card/health-unit-card';
import { HealthUnitDetailModal } from './components/health-unit-detail-modal/health-unit-detail-modal';

function HealthUnitManager() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHealthUnitId, setSelectedHealthUnitId] = useState<
    string | null
  >(null);
  const { data: user } = useCurrentUser();

  const { data: healthUnit } = useHealthUnitsByUserId(user?._id);
  const selectedHealthUnit =
    healthUnit?.find((health) => health._id === selectedHealthUnitId) ??
    null;

  return (
    <>
      <div className={style.container}>
        <SideBar
          items={SIDEBAR_MANAGER_ITEMS}
          pageTitle="Painel Manager"
          user={user}
        />
        <div className={style.mainContent}>
          <HeaderManager
            title="Unidade de Saúde"
            subtitle="Gerencie suas unidades de Saúde"
            buttonText="Nova Unidade"
            onButtonClick={() => setOpenModal(true)}
          />
          <div className={style.healthUnitSection}>
            {healthUnit?.map((health) => (
              <HealthUnitCard
                key={health._id}
                healthUnit={health}
                onClick={() => setSelectedHealthUnitId(health._id)}
              />
            ))}
          </div>
        </div>
      </div>
      <HealthUnitModal
        onClose={() => setOpenModal(false)}
        open={openModal}
      />
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
