import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { IQueueItem } from '../../../config/entities/queue-item/queue-item.entity';
import { apiClient } from '../../../services/axios';

export const MARK_QUEUE_ITEM_AS_ABSENT = 'MARK_QUEUE_ITEM_AS_ABSENT';

export type MarkQueueItemAsAbsentResponse = IQueueItem;

const markQueueItemAsAbsent = async (
  queueItemId: string
): Promise<MarkQueueItemAsAbsentResponse> => {
  const path = `/queue-items/${queueItemId}/absent`;

  try {
    const response = await apiClient.patch<MarkQueueItemAsAbsentResponse>(path);

    return response.data;
  } catch {
    throw new Error(path);
  }
};

export const useMarkQueueItemAsAbsent = (
  options?: UseMutationOptions<MarkQueueItemAsAbsentResponse, Error, string>
) => {
  return useMutation({
    mutationKey: [MARK_QUEUE_ITEM_AS_ABSENT],

    mutationFn: markQueueItemAsAbsent,

    ...options,
  });
};
