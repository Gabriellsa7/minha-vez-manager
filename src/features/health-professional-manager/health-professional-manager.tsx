import { useState } from 'react';
import { HeaderManager } from '../../components/header-manager/header-manager';
import { SideBar } from '../../components/side-bar/side-bar-manager';
import { useCurrentUser } from '../../config/api/get-current-user';
import { queueShift, queueStatus } from '../../config/entities/queue/queue.entity';
import { SIDEBAR_PROFESSIONAL_MANAGER } from './constants';
import style from './health-professional-manager.module.scss';
import { AwaitingQueueCard } from './components/awating-queue-card/awating-queue-card';
import {
  GET_QUEUE_MANAGEMENT,
  useGetQueueManagement,
} from './api/get-queue-management-by-professional-id';
import { NowQueueCard } from './components/now-queue-card/now-queue-card';
import { useOpenQueue } from '../../config/api/open-queue';
import { useCloseQueue } from '../../config/api/close-queue';
import { queryClient } from '../../services/react-query';
import { QueueListCard } from './components/queue-list-card/queue-list-card';
import {
  GET_QUEUES_BY_PROFESSIONAL_ID,
  useGetQueuesByProfessionalId,
} from './api/get-queues-by-professional-id';
import { useFinishQueueItem } from './api/finish-queue-item';
import { useMarkQueueItemAsAbsent } from './api/mark-queue-item-as-absent';
import { useCallQueueItem } from './api/call-queue-item';

function isSameDay(dateA: string, dateB: Date): boolean {
  const a = new Date(dateA);
  return (
    a.getFullYear() === dateB.getFullYear() &&
    a.getMonth() === dateB.getMonth() &&
    a.getDate() === dateB.getDate()
  );
}

const AFTERNOON_SHIFT_START_HOUR = 12;
const AFTERNOON_SHIFT_START_MINUTE = 30;

function hasShiftStarted(shift: string, now: Date): boolean {
  if (shift === queueShift.MORNING) return true;

  const afternoonStart = new Date(now);
  afternoonStart.setHours(
    AFTERNOON_SHIFT_START_HOUR,
    AFTERNOON_SHIFT_START_MINUTE,
    0,
    0,
  );

  return now.getTime() >= afternoonStart.getTime();
}

function HealthProfessionalManager() {
  const [onModalOpen, setModalOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const { data: queueManagement } = useGetQueueManagement(user?._id);
  const { data: queues } = useGetQueuesByProfessionalId(user?._id);

  const invalidateQueues = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUE_MANAGEMENT, user?._id],
      }),
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUES_BY_PROFESSIONAL_ID, user?._id],
      }),
    ]);
  };

  const { mutateAsync: finishQueueItem } = useFinishQueueItem({
    onSuccess: invalidateQueues,
  });

  const { mutateAsync: markQueueItemAsAbsent } = useMarkQueueItemAsAbsent({
    onSuccess: invalidateQueues,
  });

  const { mutateAsync: callQueueItem } = useCallQueueItem({
    onSuccess: invalidateQueues,
  });

  const {
    mutateAsync: openQueue,
    isPending: isOpeningQueue,
    variables: openingQueueId,
  } = useOpenQueue();

  const {
    mutateAsync: closeQueue,
    isPending: isClosingQueue,
    variables: closingQueueId,
  } = useCloseQueue();

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

  const handleCall = async (id: string) => {
    await callQueueItem(id);
  };

  const handleOpenQueue = async (queueId: string) => {
    try {
      await openQueue(queueId);
      await invalidateQueues();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseQueue = async (queueId: string) => {
    try {
      await closeQueue(queueId);
      await invalidateQueues();
    } catch (error) {
      console.error(error);
    }
  };

  console.log(onModalOpen);

  const today = new Date();
  const hasOpenQueue = Boolean(queueManagement?.queue);

  // A queue that has already been opened and closed completed its cycle for
  // the day (every patient was served) — it belongs in the history, not in
  // this "abrir fila" list, so it shouldn't be offered for reopening.
  const activeQueues = queues?.filter(
    (queue) => !(queue.status === queueStatus.CLOSED && queue.openedAt),
  );

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
          {activeQueues?.length ? (
            activeQueues.map((queue) => {
              const isActive =
                queue.status === queueStatus.OPEN ||
                queue.status === queueStatus.IN_PROGRESS;

              return (
                <div key={queue._id} className={style.queueEntry}>
                  <QueueListCard
                    queue={queue}
                    isToday={isSameDay(queue.queueDate, today)}
                    hasShiftStarted={hasShiftStarted(queue.shift, today)}
                    isActive={isActive}
                    isBlocked={hasOpenQueue && !isActive}
                    onOpen={handleOpenQueue}
                    onClose={handleCloseQueue}
                    isOpening={isOpeningQueue && openingQueueId === queue._id}
                    isClosing={isClosingQueue && closingQueueId === queue._id}
                  />

                  {isActive && queueManagement && (
                    <div className={style.queueDetails}>
                      {queueManagement.currentItem && (
                        <NowQueueCard
                          queue={queueManagement.queue}
                          currentItem={queueManagement.currentItem}
                          onFinish={handleFinish}
                          onAbsent={handleAbsent}
                        />
                      )}
                      <AwaitingQueueCard
                        onCall={handleCall}
                        queueManagement={queueManagement}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Nenhuma fila disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { HealthProfessionalManager };
