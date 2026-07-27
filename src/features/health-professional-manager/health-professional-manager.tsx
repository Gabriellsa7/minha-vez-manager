import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { SIDEBAR_PROFESSIONAL_MANAGER } from './constants';
import style from './health-professional-manager.module.scss';
import { AwaitingQueueCard } from './components/awating-queue-card/awating-queue-card';
import {
  GET_QUEUE_MANAGEMENT,
  useGetQueueManagement,
} from './api/get-queue-management-by-professional-id';
import { NowQueueCard } from './components/now-queue-card/now-queue-card';
import { useOpenQueue } from '../../config/api/open-queue';
import { queryClient } from '../../services/react-query';
import { GET_QUEUE_BY_PROFESSIONAL_ID } from '../../config/api/get-queue-by-professional-id';
import { OpenQueueCard } from './components/open-queue-card/open-queue-card';
import { useGetQueuesByProfessionalId } from './api/get-queues-by-professional-id';

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

  const { data: queues } = useGetQueuesByProfessionalId(user?._id);

  const availableQueue = queues?.find((queue) => queue.status === 'CLOSED');

  const { mutateAsync: openQueue } = useOpenQueue();

  const handleOpenQueue = async (queueId: string) => {
    try {
      await openQueue(queueId);
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUE_MANAGEMENT],
      });
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUE_BY_PROFESSIONAL_ID],
      });
    } catch (error) {
      console.error(error);
    }
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
          {queueManagement ? (
            <>
              <NowQueueCard
                queue={queueManagement.queue}
                currentItem={queueManagement.currentItem}
                onFinish={handleFinish}
                onAbsent={handleAbsent}
              />

              <AwaitingQueueCard queueManagement={queueManagement} />
            </>
          ) : availableQueue ? (
            <OpenQueueCard
              queueDate={availableQueue.queueDate}
              onOpen={() => handleOpenQueue(availableQueue._id)}
            />
          ) : (
            <p>Nenhuma fila disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { HealthProfessionalManager };
