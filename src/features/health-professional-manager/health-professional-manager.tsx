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
import { useFinishQueueItem } from './api/finish-queue-item';
import { useMarkQueueItemAsAbsent } from './api/mark-queue-item-as-absent';

function HealthProfessionalManager() {
  const [onModalOpen, setModalOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const { data: queueManagement } = useGetQueueManagement(user?._id);

  const { mutateAsync: finishQueueItem } = useFinishQueueItem({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUE_MANAGEMENT],
      });
    },
  });

  const { mutateAsync: markQueueItemAsAbsent } = useMarkQueueItemAsAbsent({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUE_MANAGEMENT],
      });
    },
  });

  const handleFinish = async () => {
    if (!queueManagement?.currentItem) return;

    try {
      await finishQueueItem(queueManagement.currentItem.queueItem._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAbsent = async () => {
    if (!queueManagement?.currentItem) return;

    try {
      await markQueueItemAsAbsent(queueManagement.currentItem.queueItem._id);
    } catch (error) {
      console.error(error);
    }
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
