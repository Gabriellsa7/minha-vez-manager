import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { useHealthUnitsByUserId } from '../../config/api/get-health-units-by-user-id';
import { SIDEBAR_MANAGER_ITEMS } from './constants';
import style from './health-unit-manager.module.scss';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { HealthUnitModal } from './components/health-unit-modal/health-unit-modal';
import { HealthUnitCard } from './components/health-unit-card/health-unit-card';

function HealthUnitManager() {
  const [openModal, setOpenModal] = useState(false);
  const { data: user } = useCurrentUser();

  const { data: healthUnit } = useHealthUnitsByUserId(user?._id);

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
              <HealthUnitCard key={health._id} healthUnit={health} />
            ))}
          </div>
        </div>
      </div>
      <HealthUnitModal
        onClose={() => setOpenModal(false)}
        open={openModal}
      />
    </>
  );
}

export { HealthUnitManager };
