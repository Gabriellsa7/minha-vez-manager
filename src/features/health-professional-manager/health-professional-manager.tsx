import { useCallback, useEffect, useState } from 'react';
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
import {
  GET_QUEUE_ITEM_BY_QUEUE_ID,
  getQueueItemByQueueId,
} from '../../config/api/get-queue-item-by-queue-id';
import { QueueItemStatus } from '../../config/entities/queue-item/queue-item.entity';
import { CloseQueueReasonModal } from '../../components/close-queue-reason-modal/close-queue-reason-modal';
import { queryClient } from '../../services/react-query';
import { QueueListCard } from './components/queue-list-card/queue-list-card';
import {
  GET_QUEUES_BY_PROFESSIONAL_ID,
  useGetQueuesByProfessionalId,
} from './api/get-queues-by-professional-id';
import { useFinishQueueItem } from './api/finish-queue-item';
import { useMarkQueueItemAsAbsent } from './api/mark-queue-item-as-absent';
import { useCallQueueItem } from './api/call-queue-item';
import { useHealthProfessionalById } from '../../config/api/get-health-professional-by-id';
import { MarkReturnModal } from './components/mark-return-modal/mark-return-modal';
import { handleApiError } from '../../config/utils/handle-api-error';
import { QueueSocketService } from '../../services/realtime/queue-socket.service';

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
  const [isMarkReturnModalOpen, setMarkReturnModalOpen] = useState(false);
  const [closeReasonQueueId, setCloseReasonQueueId] = useState<string | null>(
    null,
  );
  const { data: user } = useCurrentUser();
  const { data: professional } = useHealthProfessionalById(user?._id);

  const { data: queueManagement } = useGetQueueManagement(user?._id);
  const { data: queues } = useGetQueuesByProfessionalId(user?._id);

  const invalidateQueues = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUE_MANAGEMENT, user?._id],
      }),
      queryClient.invalidateQueries({
        queryKey: [GET_QUEUES_BY_PROFESSIONAL_ID, user?._id],
      }),
    ]);
  }, [user?._id]);

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

  // Keeps this panel in sync without an F5 — the backend broadcasts
  // queue-item.created/queue.updated/queue.closed whenever a patient books
  // or the queue state changes elsewhere.
  useEffect(() => {
    const unsubscribe = QueueSocketService.subscribeToSocket(() => {
      void invalidateQueues();
    });
    const stopSocket = QueueSocketService.startSocket();

    return () => {
      unsubscribe();
      stopSocket();
    };
  }, [invalidateQueues]);

  const handleFinish = async () => {
    if (!queueManagement?.currentItem) return;

    try {
      await finishQueueItem(queueManagement.currentItem.queueItem._id);
    } catch (error) {
      handleApiError(error);
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

  const handleMarkReturn = () => {
    if (!queueManagement?.currentItem) return;
    setMarkReturnModalOpen(true);
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
      const items = await queryClient.fetchQuery({
        queryKey: [GET_QUEUE_ITEM_BY_QUEUE_ID, queueId],
        queryFn: () => getQueueItemByQueueId(queueId),
      });

      const attendedSomeone = items.some(
        (item) => item.status === QueueItemStatus.FINISHED,
      );

      if (!attendedSomeone) {
        setCloseReasonQueueId(queueId);
        return;
      }

      await closeQueue({ queueId });
      await invalidateQueues();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmCloseWithReason = async (reason: string) => {
    if (!closeReasonQueueId) return;

    try {
      await closeQueue({ queueId: closeReasonQueueId, reason });
      await invalidateQueues();
      setCloseReasonQueueId(null);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(onModalOpen);

  const today = new Date();
  const hasOpenQueue = Boolean(queueManagement?.queue);

  // closedAt is set whenever a queue's cycle is done — either it was opened
  // and closed normally (every patient was served) or it was canceled ahead
  // of time while still pending (never opened, so openedAt stays unset).
  // Either way it belongs in the history, not in this "abrir fila" list.
  const activeQueues = queues?.filter((queue) => !queue.closedAt);

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
                    isClosing={
                      isClosingQueue && closingQueueId?.queueId === queue._id
                    }
                  />

                  {isActive && queueManagement && (
                    <div className={style.queueDetails}>
                      {queueManagement.currentItem && (
                        <NowQueueCard
                          queue={queueManagement.queue}
                          currentItem={queueManagement.currentItem}
                          onFinish={handleFinish}
                          onAbsent={handleAbsent}
                          onMarkReturn={handleMarkReturn}
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

      {isMarkReturnModalOpen && queueManagement?.currentItem && (
        <MarkReturnModal
          onClose={() => setMarkReturnModalOpen(false)}
          professional={professional}
          patientId={queueManagement.currentItem.patient._id}
          patientName={queueManagement.currentItem.user.name}
          originQueueItemId={queueManagement.currentItem.queueItem._id}
        />
      )}

      {closeReasonQueueId && (
        <CloseQueueReasonModal
          isClosing={isClosingQueue}
          onCancel={() => setCloseReasonQueueId(null)}
          onConfirm={handleConfirmCloseWithReason}
        />
      )}
    </div>
  );
}

export { HealthProfessionalManager };
