import { useCallback, useState } from 'react';
import { useCloseQueue } from '../../../config/api/close-queue';
import {
  GET_QUEUE_ITEM_BY_QUEUE_ID,
  getQueueItemByQueueId,
} from '../../../config/api/get-queue-item-by-queue-id';
import { useOpenQueue } from '../../../config/api/open-queue';
import { QueueItemStatus } from '../../../config/entities/queue-item/queue-item.entity';
import { handleApiError } from '../../../config/utils/handle-api-error';
import {
  invalidateQueryKeys,
  queryClient,
} from '../../../services/react-query';
import { useCallQueueItem } from '../api/call-queue-item';
import { useFinishQueueItem } from '../api/finish-queue-item';
import {
  GET_QUEUE_MANAGEMENT,
  useGetQueueManagement,
} from '../api/get-queue-management-by-professional-id';
import {
  GET_QUEUES_BY_PROFESSIONAL_ID,
  useGetQueuesByProfessionalId,
} from '../api/get-queues-by-professional-id';
import { useMarkQueueItemAsAbsent } from '../api/mark-queue-item-as-absent';
import { useQueueRealtime } from './use-queue-realtime';

const QUEUE_QUERY_KEYS = [GET_QUEUE_MANAGEMENT, GET_QUEUES_BY_PROFESSIONAL_ID];

const hasAttendedSomeone = async (queueId: string) => {
  const items = await queryClient.fetchQuery({
    queryKey: [GET_QUEUE_ITEM_BY_QUEUE_ID, queueId],
    queryFn: () => getQueueItemByQueueId(queueId),
  });

  return items.some((item) => item.status === QueueItemStatus.FINISHED);
};

export function useQueueManagement(professionalId?: string) {
  const [closeReasonQueueId, setCloseReasonQueueId] = useState<string | null>(
    null
  );

  const { data: queueManagement } = useGetQueueManagement(professionalId);
  const { data: queues, isLoading } =
    useGetQueuesByProfessionalId(professionalId);

  const invalidateQueues = useCallback(
    () => invalidateQueryKeys(QUEUE_QUERY_KEYS),
    []
  );

  useQueueRealtime(invalidateQueues);

  const mutationOptions = {
    onSuccess: invalidateQueues,
    onError: handleApiError,
  };

  const { mutate: finishQueueItem } = useFinishQueueItem(mutationOptions);
  const { mutate: markQueueItemAsAbsent } =
    useMarkQueueItemAsAbsent(mutationOptions);
  const { mutate: callQueueItem } = useCallQueueItem(mutationOptions);
  const {
    mutate: openQueue,
    isPending: isOpeningQueue,
    variables: openingQueueId,
  } = useOpenQueue(mutationOptions);
  const {
    mutate: closeQueue,
    isPending: isClosingQueue,
    variables: closingQueue,
  } = useCloseQueue(mutationOptions);

  const currentItemId = queueManagement?.currentItem?.queueItem._id;

  const requestCloseQueue = async (queueId: string) => {
    try {
      if (!(await hasAttendedSomeone(queueId))) {
        setCloseReasonQueueId(queueId);
        return;
      }

      closeQueue({ queueId });
    } catch (error) {
      handleApiError(error);
    }
  };

  const confirmCloseWithReason = (reason: string) => {
    if (!closeReasonQueueId) return;

    closeQueue(
      { queueId: closeReasonQueueId, reason },
      { onSuccess: () => setCloseReasonQueueId(null) }
    );
  };

  return {
    queueManagement,
    activeQueues: (queues ?? []).filter((queue) => !queue.closedAt),
    isLoading,
    openingQueueId: isOpeningQueue ? openingQueueId : undefined,
    closingQueueId: isClosingQueue ? closingQueue?.queueId : undefined,
    isClosingQueue,
    closeReasonQueueId,
    cancelCloseWithReason: () => setCloseReasonQueueId(null),
    openQueue: (queueId: string) => openQueue(queueId),
    requestCloseQueue,
    confirmCloseWithReason,
    callQueueItem: (queueItemId: string) => callQueueItem(queueItemId),
    finishCurrentItem: () => currentItemId && finishQueueItem(currentItemId),
    markCurrentItemAbsent: () =>
      currentItemId && markQueueItemAsAbsent(currentItemId),
  };
}
