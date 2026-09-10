import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services/axios';
import type { IQueueItem } from '../entities/queue-item/queue-item.entity';

export const CHECK_IN_QUEUE_ITEM = 'CHECK_IN_QUEUE_ITEM';

const checkInQueueItem = async (queueItemId: string): Promise<IQueueItem> => {
  const path = `/queue-items/${queueItemId}/check-in`;
  const response = await apiClient.patch<IQueueItem>(path);
  return response.data;
};

export const useCheckInQueueItem = (
  options?: UseMutationOptions<IQueueItem, unknown, string>
) => {
  return useMutation({
    mutationKey: [CHECK_IN_QUEUE_ITEM],
    mutationFn: checkInQueueItem,
    ...options,
  });
};
