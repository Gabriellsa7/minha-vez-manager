import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { IQueueItem } from '../../../config/entities/queue-item/queue-item.entity';
import { apiClient } from '../../../services/axios';

export const FINISH_QUEUE_ITEM = 'FINISH_QUEUE_ITEM';

export type FinishQueueItemResponse = IQueueItem;

const finishQueueItem = async (
  queueItemId: string
): Promise<FinishQueueItemResponse> => {
  const path = `/queue-items/${queueItemId}/finish`;

  try {
    const response = await apiClient.patch<FinishQueueItemResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useFinishQueueItem = (
  options?: UseMutationOptions<FinishQueueItemResponse, Error, string>
) => {
  return useMutation({
    mutationKey: [FINISH_QUEUE_ITEM],

    mutationFn: finishQueueItem,

    ...options,
  });
};
