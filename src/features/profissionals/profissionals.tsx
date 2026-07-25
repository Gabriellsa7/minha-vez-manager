import { useState } from 'react';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_MANAGER_ITEMS } from '../healt-unit-manager/constants';
import { HealthProfessionalModal } from './components/health-professional-modal/health-professional-modal';
import style from './profissionals.module.scss';
import { useHealthProfessionalsByUserId } from '../../config/api/get-health-professionals-by-user-id';
import { HealthProfessionalCard } from './components/health-professional-card/health-professional-card';

function Professionals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const { data: healthProfessionals } = useHealthProfessionalsByUserId(
    user?._id
  );

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
              <HealthProfessionalCard healthProfessional={professionals} />
            ))}
          </div>
        </div>
      </div>
      <HealthProfessionalModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export { Professionals };
