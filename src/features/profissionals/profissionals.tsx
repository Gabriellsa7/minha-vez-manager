import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import { HealthProfessionalModal } from './components/health-professional-modal/health-professional-modal';
import style from './profissionals.module.scss';
import { useHealthProfessionalsByUserId } from '../../config/api/get-health-professionals-by-user-id';
import { HealthProfessionalCard } from './components/health-professional-card/health-professional-card';
import { HealthProfessionalDetailModal } from './components/health-professional-detail-modal/health-professional-detail-modal';

function Professionals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const { data: user } = useCurrentUser();

  const { data: healthProfessionals } = useHealthProfessionalsByUserId(
    user?._id
  );
  const selectedProfessional =
    healthProfessionals?.find(
      (professional) => professional._id === selectedProfessionalId
    ) ?? null;

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
            title="Profissionais"
            subtitle="Gerencie os profissionais das suas unidades"
            buttonText="Novo profissional"
            onButtonClick={() => setIsModalOpen(true)}
          />
          <div className={style.professionalsSection}>
            {healthProfessionals?.map((professionals) => (
              <HealthProfessionalCard
                key={professionals._id}
                healthProfessional={professionals}
                onClick={() => setSelectedProfessionalId(professionals._id)}
              />
            ))}
          </div>
        </div>
      </div>
      <HealthProfessionalModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {selectedProfessional && (
        <HealthProfessionalDetailModal
          key={selectedProfessional._id}
          healthProfessional={selectedProfessional}
          userId={user?._id}
          onClose={() => setSelectedProfessionalId(null)}
        />
      )}
    </>
  );
}

export { Professionals };
