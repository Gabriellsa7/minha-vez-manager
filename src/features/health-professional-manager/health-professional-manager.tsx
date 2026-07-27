import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_PROFESSIONAL_MANAGER } from './constants';
import style from './health-professional-manager.module.scss';
import { AwaitingQueueCard } from './components/awating-queue-card/awating-queue-card';
import { useGetQueueManagement } from './api/get-queue-management-by-professional-id';
import { NowQueueCard } from './components/now-queue-card/now-queue-card';

function HealthProfessionalManager() {
  const [onModalOpen, setModalOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const { data: queueManagement } = useGetQueueManagement(user?._id);

  const handleFinish = () => {
    console.log('Finish attendance');
  };

  const handleAbsent = () => {
    console.log('Patient absent');
  };

  console.log(onModalOpen);
  return (
    <div className={style.container}>
      <SideBar
        pageTitle="Painel de Gestão"
        items={SIDEBAR_PROFESSIONAL_MANAGER}
        user={user}
      />
      <div className={style.mainContent}>
        <HeaderManager
          title="Painel de Gestão"
          subtitle="Status da Clinica: Operação Normal"
          onButtonClick={() => setModalOpen(true)}
          user={user}
        />
        <div className={style.queueContainer}>
          {queueManagement && (
            <>
              <AwaitingQueueCard queueManagement={queueManagement} />

              <NowQueueCard
                queue={queueManagement.queue}
                currentItem={queueManagement.currentItem}
                onFinish={handleFinish}
                onAbsent={handleAbsent}
              />
            </>
          )}
          <span>Health Professional Manager</span>
        </div>
      </div>
    </div>
  );
}

export { HealthProfessionalManager };
