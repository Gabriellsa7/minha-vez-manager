import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_PROFESSIONAL_MANAGER } from './constants';
import style from './health-professional-manager.module.scss';
import { AwaitingQueueCard } from './components/awating-queue-card/awating-queue-card';
import { useGetQueueByProfessionalId } from '../../config/api/get-queue-by-professional-id';
import { useGetQueueItemByQueueId } from '../../config/api/get-queue-item-by-queue-id';

function HealthProfessionalManager() {
  const [onModalOpen, setModalOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const { data: queue } = useGetQueueByProfessionalId(user?._id);

  const { data: queueItem } = useGetQueueItemByQueueId(queue?._id);

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
          <AwaitingQueueCard queueItem={queueItem} queue={queue} />
          <span>Health Professional Manager</span>
        </div>
      </div>
    </div>
  );
}

export { HealthProfessionalManager };
